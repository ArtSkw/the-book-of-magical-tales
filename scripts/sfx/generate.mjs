#!/usr/bin/env node
// Generates takes of the 3D book's sounds with ElevenLabs, from scripts/sfx/manifest.json.
//
//   node --env-file=.env scripts/sfx/generate.mjs --set ab0          a named run (manifest `sets`)
//   node --env-file=.env scripts/sfx/generate.mjs --only seal-press  these ids (their manifest takes)
//   node --env-file=.env scripts/sfx/generate.mjs --all              every sound in the manifest
//   ... --dry-run    list what would be generated, the seconds and an estimated cost; no requests
//   ... --index      only rebuild local-assets/sfx/raw/index.json (what the listening sheet reads)
//   ... --model m    override the sound-effects model (--music-model for music);
//       --takes n    override how many takes to end up with
//
// The key is read from ELEVENLABS_API_KEY (the gitignored .env) and is never printed or logged.
// Takes land in local-assets/sfx/raw/<id>/<id>--<model>-tNN.<ext> (gitignored), each with a JSON
// sidecar (prompt, parameters, response ids and any cost headers). Re-running only fills in the
// takes that are missing, so an interrupted run resumes. One request at a time; 429 and 5xx are
// retried with backoff; 401 and 402 stop the run.
//
// Output format: the best one the key's plan allows is found on the first request by trying
// wav_48000, then mp3_44100_192, then mp3_44100_128, and remembered in raw/.formats.json
// (looping sound effects keep their own entry: ElevenLabs serves WAV for non-looping ones only).
import { readFile, writeFile, mkdir, readdir, appendFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "../..");
const RAW = path.join(ROOT, "local-assets/sfx/raw");
const API = "https://api.elevenlabs.io";
// USD per minute of generated audio, elevenlabs.io/pricing/api as read on 2026-10-25 (its FAQ also
// says "billed per generation"; the dashboard is the truth). Measured in phase 0: every sound effect
// answered with a character-cost header of exactly 10 credits per requested second; music sent none.
const PRICE_PER_MIN = { sfx: 0.12, music: 0.15 };
const SFX_CREDITS_PER_SEC = 10;
const SFX_FORMATS = ["wav_48000", "mp3_44100_192", "mp3_44100_128"];
const FORMAT_HINT = /format|tier|subscription|plan|upgrade|pcm|wav|192/i;

class Stop extends Error {}

const args = process.argv.slice(2);
const flag = (k) => args.includes(`--${k}`);
const opt = (k) => {
  const i = args.indexOf(`--${k}`);
  return i >= 0 ? args[i + 1] : null;
};

const manifest = JSON.parse(await readFile(path.join(HERE, "manifest.json"), "utf8"));
const byId = new Map(manifest.sounds.map((s) => [s.id, s]));

const tagOf = (model) =>
  ({ eleven_text_to_sound_v2: "sfx-v2", eleven_text_to_sound_v3: "sfx-v3", music_v1: "music-v1", music_v2: "music-v2", music_v2_5: "music-v2-5" })[model] ||
  model.replace(/[^a-z0-9]+/gi, "-");

function jobs() {
  let list;
  if (opt("set")) {
    list = manifest.sets?.[opt("set")];
    if (!list) throw new Error(`no set "${opt("set")}" in manifest.json`);
  } else if (opt("only")) list = opt("only").split(",").map((id) => ({ id: id.trim() }));
  else if (flag("all")) list = manifest.sounds.filter((s) => !s.retired).map((s) => ({ id: s.id }));
  else throw new Error("say what to generate: --set <name>, --only <ids> or --all");
  return list.map((j) => {
    const sound = byId.get(j.id);
    if (!sound) throw new Error(`unknown sound id "${j.id}"`);
    // --model overrides sound effects only, --music-model the music
    const model = opt(sound.kind === "music" ? "music-model" : "model") || j.model || sound.model || manifest.defaults[sound.kind].model;
    const takes = Number(opt("takes") || j.takes || sound.takes || 1);
    return { sound, model, tag: tagOf(model), takes };
  });
}

async function existingTakes(id, tag) {
  const dir = path.join(RAW, id);
  if (!existsSync(dir)) return [];
  const re = new RegExp(`^${id}--${tag}-t(\\d+)\\.(wav|mp3|opus|ogg)$`);
  return (await readdir(dir)).map((f) => f.match(re)).filter(Boolean).map((m) => Number(m[1]));
}

const secondsOf = (sound) => (sound.kind === "music" ? sound.lengthMs / 1000 : sound.seconds || 2);

// ---------------------------------------------------------------- requests
const KEY = process.env.ELEVENLABS_API_KEY;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const formatsFile = path.join(RAW, ".formats.json");
let formats = existsSync(formatsFile) ? JSON.parse(await readFile(formatsFile, "utf8")) : {};

async function detail(res) {
  const text = await res.text().catch(() => "");
  try {
    const j = JSON.parse(text);
    const d = j.detail ?? j;
    return typeof d === "string" ? d : d.message || d.status || JSON.stringify(d).slice(0, 400);
  } catch {
    return text.slice(0, 400);
  }
}

// response headers worth keeping (ids, any cost or usage figure); never request headers
const KEEP = /^(request-id|history-item-id|x-request-id|character-cost|x-character-count|current-concurrent-requests|maximum-concurrent-requests|content-type)$|cost|credit|usage|ratelimit/i;
// music answers are kept whole (minus cookies): what, if anything, they say about cost
const keptHeaders = (res, all = false) => Object.fromEntries([...res.headers].filter(([k]) => (all || KEEP.test(k)) && k !== "set-cookie"));

async function post(url, body) {
  for (let attempt = 0; ; attempt++) {
    let res;
    try {
      res = await fetch(url, { method: "POST", headers: { "xi-api-key": KEY, "Content-Type": "application/json" }, body: JSON.stringify(body) });
    } catch (e) {
      if (attempt >= 4) throw e;
      await sleep(2000 * 2 ** attempt);
      continue;
    }
    if ((res.status === 429 || res.status >= 500) && attempt < 4) {
      const wait = Number(res.headers.get("retry-after")) * 1000 || 2000 * 2 ** attempt;
      console.log(`    ${res.status}, retrying in ${(wait / 1000).toFixed(0)} s`);
      await res.body?.cancel();
      await sleep(wait);
      continue;
    }
    return res;
  }
}

// One take of a sound effect, stepping down through the output formats until one is allowed.
async function generateSfx(sound, model) {
  const loopKey = sound.loop ? "sfxLoop" : "sfx";
  const known = formats[loopKey] || formats.sfx;
  const chain = known ? SFX_FORMATS.slice(SFX_FORMATS.indexOf(known)) : SFX_FORMATS;
  const body = { text: sound.text, model_id: model, prompt_influence: sound.influence ?? manifest.defaults.sfx.influence, loop: Boolean(sound.loop) };
  if (sound.seconds) body.duration_seconds = sound.seconds;
  for (const [i, format] of chain.entries()) {
    const res = await post(`${API}/v1/sound-generation?output_format=${format}`, body);
    if (res.ok) {
      if (formats[loopKey] !== format) {
        formats[loopKey] = format;
        await writeFile(formatsFile, JSON.stringify(formats, null, 2));
        console.log(`    output format for ${sound.loop ? "looping " : ""}sound effects: ${format}`);
      }
      return { res, format, body };
    }
    const why = await detail(res);
    const last = i === chain.length - 1;
    // a plan that does not allow this format: try the next one down (only when the error says so)
    if (!last && [400, 401, 402, 403, 422].includes(res.status) && FORMAT_HINT.test(why)) {
      console.log(`    ${format} not allowed (${res.status}: ${why}); trying ${chain[i + 1]}`);
      continue;
    }
    if (res.status === 401 || res.status === 402) throw new Stop(`${res.status} from /v1/sound-generation: ${why}`);
    return { error: `${res.status}: ${why}` };
  }
}

async function generateMusic(sound, model) {
  const body = { prompt: sound.text, music_length_ms: sound.lengthMs, model_id: model, force_instrumental: true };
  const res = await post(`${API}/v1/music`, body);
  if (res.ok) return { res, format: "auto", body };
  const why = await detail(res);
  if (res.status === 401 || res.status === 402) throw new Stop(`${res.status} from /v1/music: ${why}`);
  return { error: `${res.status}: ${why}` };
}

function extOf(buf, contentType = "") {
  const head = buf.subarray(0, 4).toString("latin1");
  if (head === "RIFF") return "wav";
  if (head === "OggS") return "ogg";
  if (head.startsWith("ID3") || (buf[0] === 0xff && (buf[1] & 0xe0) === 0xe0)) return "mp3";
  if (/wav/.test(contentType)) return "wav";
  if (/opus|ogg/.test(contentType)) return "ogg";
  return "mp3";
}

// ffprobe with a clean environment (the .env keys stay in this process)
function probe(file) {
  const r = spawnSync("ffprobe", ["-v", "error", "-show_entries", "stream=sample_rate,channels:format=duration,bit_rate", "-of", "json", file], {
    env: { PATH: process.env.PATH },
    encoding: "utf8",
  });
  try {
    const j = JSON.parse(r.stdout);
    const s = j.streams?.[0] || {};
    return { durationSec: +Number(j.format?.duration).toFixed(3), sampleRate: Number(s.sample_rate), channels: s.channels, bitRate: Number(j.format?.bit_rate) || null };
  } catch {
    return {};
  }
}

// ---------------------------------------------------------------- index for the listening sheet
async function writeIndex() {
  const sounds = [];
  if (existsSync(RAW)) {
    for (const id of (await readdir(RAW, { withFileTypes: true })).filter((d) => d.isDirectory()).map((d) => d.name).sort()) {
      const files = (await readdir(path.join(RAW, id))).filter((f) => f.endsWith(".json")).sort();
      const takes = [];
      for (const f of files) {
        const side = JSON.parse(await readFile(path.join(RAW, id, f), "utf8"));
        takes.push({ file: `${id}/${side.file}`, model: side.model, tag: side.tag, take: side.take, format: side.format, ...side.probe, bytes: side.bytes, createdAt: side.createdAt, headers: side.response?.headers || {} });
      }
      const s = byId.get(id) || { id };
      sounds.push({ id, group: s.group, kind: s.kind, pl: s.pl, use: s.use, text: s.text, seconds: s.seconds, lengthMs: s.lengthMs, loop: Boolean(s.loop), influence: s.influence, takes });
    }
  }
  await mkdir(RAW, { recursive: true });
  await writeFile(path.join(RAW, "index.json"), JSON.stringify({ generatedAt: new Date().toISOString(), sets: manifest.sets, sounds }, null, 2));
  return sounds;
}

// ---------------------------------------------------------------- run
if (flag("index")) {
  const s = await writeIndex();
  console.log(`index: ${s.length} sounds, ${s.reduce((a, x) => a + x.takes.length, 0)} takes`);
  process.exit(0);
}

const plan = [];
for (const j of jobs()) {
  const have = await existingTakes(j.sound.id, j.tag);
  for (let n = 1; n <= j.takes; n++) if (!have.includes(n)) plan.push({ ...j, take: n });
}
const secs = { sfx: 0, music: 0 };
for (const p of plan) secs[p.sound.kind] += secondsOf(p.sound);
const usd = secs.sfx / 60 * PRICE_PER_MIN.sfx + secs.music / 60 * PRICE_PER_MIN.music;
const nMusic = plan.filter((p) => p.sound.kind === "music").length;
console.log(`${plan.length} generation(s) (${plan.length - nMusic} sound effects, ${nMusic} music): ${secs.sfx.toFixed(1)} s of sound effects = about ${Math.round(secs.sfx * SFX_CREDITS_PER_SEC)} credits, plus ${secs.music.toFixed(1)} s of music (no cost header); about $${usd.toFixed(2)} at the listed per-minute rates`);
for (const p of plan) console.log(`  ${p.sound.id} ${p.tag} t${String(p.take).padStart(2, "0")}  ${secondsOf(p.sound)} s${p.sound.loop ? " loop" : ""}`);
if (flag("dry-run") || !plan.length) process.exit(0);
if (!KEY) {
  console.error("ELEVENLABS_API_KEY is not set: run with  node --env-file=.env scripts/sfx/generate.mjs ...");
  process.exit(1);
}

await mkdir(RAW, { recursive: true });
const skipModels = new Set(); // a model the API refused (e.g. not available to this key)
let made = 0;
let credits = 0;
let done = 0; // plan items handled (made, failed or skipped)
const failed = [];
try {
  for (const p of plan) {
    done++;
    const label = `${p.sound.id} ${p.tag} t${String(p.take).padStart(2, "0")}`;
    if (skipModels.has(p.model)) {
      console.log(`- ${label}: skipped (model refused earlier)`);
      continue;
    }
    console.log(`- ${label}`);
    const t0 = Date.now();
    const out = p.sound.kind === "music" ? await generateMusic(p.sound, p.model) : await generateSfx(p.sound, p.model);
    const logLine = { at: new Date().toISOString(), id: p.sound.id, model: p.model, take: p.take };
    if (out.error) {
      console.log(`    failed ${out.error}`);
      if (/model/i.test(out.error)) skipModels.add(p.model);
      failed.push(`${label}: ${out.error}`);
      await appendFile(path.join(RAW, "runs.jsonl"), JSON.stringify({ ...logLine, error: out.error }) + "\n");
      continue;
    }
    const buf = Buffer.from(await out.res.arrayBuffer());
    const ext = extOf(buf, out.res.headers.get("content-type") || "");
    const name = `${p.sound.id}--${p.tag}-t${String(p.take).padStart(2, "0")}`;
    const dir = path.join(RAW, p.sound.id);
    await mkdir(dir, { recursive: true });
    const file = path.join(dir, `${name}.${ext}`);
    await writeFile(file, buf);
    const headers = keptHeaders(out.res, p.sound.kind === "music");
    const info = probe(file);
    const side = { id: p.sound.id, kind: p.sound.kind, model: p.model, tag: p.tag, take: p.take, file: `${name}.${ext}`, format: out.format, bytes: buf.length, probe: info, request: out.body, response: { status: out.res.status, headers }, ms: Date.now() - t0, createdAt: new Date().toISOString() };
    await writeFile(path.join(dir, `${name}.json`), JSON.stringify(side, null, 2));
    await appendFile(path.join(RAW, "runs.jsonl"), JSON.stringify({ ...logLine, file: side.file, bytes: buf.length, durationSec: info.durationSec, headers }) + "\n");
    const cost = Object.entries(headers).filter(([k]) => /cost|credit|usage|character/i.test(k)).map(([k, v]) => `${k}=${v}`).join(" ");
    console.log(`    ok ${ext} ${(buf.length / 1024).toFixed(0)} KB, ${info.durationSec ?? "?"} s, ${info.sampleRate || "?"} Hz x${info.channels || "?"}${cost ? `, ${cost}` : ""}`);
    made++;
    credits += Number(headers["character-cost"] || 0);
    await sleep(300);
  }
} catch (e) {
  if (e instanceof Stop) {
    console.error(`STOPPED: ${e.message}`);
    done--; // the item that was refused was not made
  } else throw e;
} finally {
  const s = await writeIndex();
  const missing = plan.slice(done).map((p) => `${p.sound.id} ${p.tag} t${String(p.take).padStart(2, "0")}`);
  await writeFile(path.join(RAW, "missing.json"), JSON.stringify({ at: new Date().toISOString(), failed, notReached: missing }, null, 2));
  console.log(`made ${made} take(s), ${credits} credits by the cost headers; failed ${failed.length}; not reached ${missing.length} (raw/missing.json)`);
  for (const f of failed) console.log(`  failed: ${f}`);
  console.log(`index: ${s.length} sounds, ${s.reduce((a, x) => a + x.takes.length, 0)} takes`);
}
