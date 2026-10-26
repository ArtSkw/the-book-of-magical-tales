#!/usr/bin/env node
// Masters the picked takes (scripts/sfx/picks.json) into the files the book ships, with ffmpeg.
//
//   node scripts/sfx/master.mjs                       every pick
//   node scripts/sfx/master.mjs --only page-turn,seal-press
//   node scripts/sfx/master.mjs --picks <file> --out <dir> --manifest <file>   (e.g. a test run)
//   node scripts/sfx/master.mjs --dry-run             list what would be made
//   node scripts/sfx/master.mjs --prune --only ""      only remove what the picks no longer hold
//
// picks.json: { "<ship id>": { "kind": "oneshot" | "bed" | "music", "bus": "ui" | "foley" | "story" | "amb",
//   "takes": ["<raw id>/<take file>", { "file": "...", "trim": [start, end], "gainDb": 0, "tune": "D", "mono": false, "role": "first" }, ...],
//   "xfade": 2 (beds: loop crossfade, s), "mono": true (one-shots default), "gainDb": 0 (engine gain), "note": "..." } }
// Several takes become variants <id>-1, <id>-2 ... (round robin in the engine). `kind` defaults from
// the manifest (a looping sound is a bed, music is music, the rest one-shots).
// `tune`: a pitch class (D, F#, A ...): the take's pitch is detected (lib.mjs detectPitch) and the
// take is re-pitched to the nearest such note by a speed change; `rate` sets that speed directly.
//
// Chains (lib.mjs), 48 kHz throughout:
//   oneshot  high-pass 70 Hz, silence trimmed (-60 dBFS gate, 5 ms pre-roll), folded to mono,
//            momentary max -20 LUFS with true peak <= -1 dBTP, 3 ms fade in, 30-80 ms fade out
//   music    as a one-shot but stereo, high-pass 40 Hz, a 0.3 s tail fade
//   bed      high-pass 80 Hz, low-pass 14 kHz, -3 dB at 2.5 kHz (room for the reader's voice),
//            -24 LUFS integrated, true peak <= -3 dBTP (two-pass loudnorm, linear), then made
//            seamless: the last `xfade` s crossfaded (equal power) into the first; loop = whole file
// Masters: local-assets/sfx/master/<id>.wav (24-bit). Shipped: <out>/<group>/<id>.webm (Opus) and
// .m4a (AAC), mono 48/64 kbps for one-shots, stereo 64/96 kbps for beds and music. The engine's
// manifest (default src/book/sounds.js) lists every file, its duration, loop and gain.
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync, statSync } from "node:fs";
import path from "node:path";
import { ROOT, RAW, SFX, probe, readPcm, detectPitch, shiftTo, noteName, oneshot, bed, encode, analyse, loudness, lowBand, TURN_FAMILY, BED_MAX_RAISE } from "./lib.mjs";

const MASTER = path.join(SFX, "master");
const args = process.argv.slice(2);
const opt = (k, d = null) => (args.includes(`--${k}`) ? args[args.indexOf(`--${k}`) + 1] : d);
const flag = (k) => args.includes(`--${k}`);
const picksFile = path.resolve(ROOT, opt("picks", "scripts/sfx/picks.json"));
const OUT = path.resolve(ROOT, opt("out", "public/assets/book3d/sound"));
const MANIFEST = path.resolve(ROOT, opt("manifest", "src/book/sounds.js"));
const BASE_URL = opt("base-url", "/assets/book3d/sound/");
// [start, end] of each attack of a take, cut before the next one (at most `max`, each `min`..`len` s)
function slices(src, { max = 8, min = 0.12, len = 0.45 } = {}) {
  const a = analyse(src);
  const on = Array.isArray(a.onsets) ? a.onsets : [];
  const out = [];
  for (let k = 0; k < on.length && out.length < max; k++) {
    const s = Math.max(0, on[k] - 0.015);
    const e = Math.min(a.dur, on[k + 1] !== undefined ? on[k + 1] - 0.01 : a.dur, s + len);
    if (e - s >= min) out.push([+s.toFixed(3), +e.toFixed(3)]);
  }
  return out;
}
// [start, end] of the loudest single attack of a take
function strongest(src) {
  const all = slices(src, { max: 99, len: 0.7, min: 0.08 });
  const { mono, sr } = readPcm(src);
  const energy = ([s, e]) => { let a = 0; for (let i = Math.floor(s * sr); i < Math.min(mono.length, e * sr); i++) a += mono[i] * mono[i]; return a; };
  return all.sort((a, b) => energy(b) - energy(a))[0] || [0, 0.7];
}
const PC = { C: 0, "C#": 1, D: 2, "D#": 3, E: 4, F: 5, "F#": 6, G: 7, "G#": 8, A: 9, "A#": 10, B: 11 };

const manifest = JSON.parse(await readFile(path.join(ROOT, "scripts/sfx/manifest.json"), "utf8"));
const soundOf = (file) => manifest.sounds.find((s) => s.id === file.split("/")[0]);

if (!existsSync(picksFile)) {
  console.error(`no picks file at ${path.relative(ROOT, picksFile)}: export it from the listening sheet first`);
  process.exit(1);
}
const picks = JSON.parse(await readFile(picksFile, "utf8"));
const only = opt("only")?.split(",");
const ids = Object.keys(picks).filter((id) => !id.startsWith("_") && (!only || only.includes(id)));
console.log(`${ids.length} sound(s) to master -> ${path.relative(ROOT, OUT)}`);
if (flag("dry-run")) {
  for (const id of ids) console.log(`  ${id}: ${picks[id].kind || "(from manifest)"}, ${picks[id].takes.length} take(s)`);
  process.exit(0);
}
await mkdir(MASTER, { recursive: true });
// keep the entries of sounds not mastered this time
let entries = {};
if (existsSync(MANIFEST)) {
  const m = (await readFile(MANIFEST, "utf8")).match(/export const sounds = (\{[\s\S]*\});/);
  if (m) entries = JSON.parse(m[1]);
}
// --prune: what the picks no longer hold leaves the book (its manifest entry and its files)
if (flag("prune")) {
  const { rmSync } = await import("node:fs");
  for (const id of Object.keys(entries).filter((id) => !picks[id])) {
    for (const v of entries[id].variants) for (const ext of ["webm", "m4a"]) rmSync(path.join(OUT, `${v.file}.${ext}`), { force: true });
    console.log(`  pruned ${id} (${entries[id].variants.length} file(s) per format)`);
    delete entries[id];
  }
}
let bytes = 0;
for (const id of ids) {
  const p = picks[id];
  const firstFile = typeof p.takes[0] === "string" ? p.takes[0] : p.takes[0].file;
  const first = soundOf(firstFile);
  const kind = p.kind || (first?.loop ? "bed" : first?.kind === "music" ? "music" : "oneshot");
  const variants = [];
  const before = new Set((entries[id]?.variants || []).map((v) => v.file)); // what this id shipped until now
  // a take with `slice` becomes several variants: one per attack it holds (a riffle's leaves, a wick's sputters)
  const takes = [];
  for (const t of p.takes) {
    const take = typeof t === "string" ? { file: t } : t;
    const src = path.join(RAW, take.file);
    if (!existsSync(src)) throw new Error(`${id}: missing take ${take.file}`);
    if (take.slice) for (const trim of slices(src, take.slice)) takes.push({ ...take, trim, slice: undefined });
    else if (take.single) takes.push({ ...take, trim: strongest(src), single: undefined }); // the one main hit of a take that holds several
    else takes.push(take);
  }
  for (const [i, take] of takes.entries()) {
    const src = path.join(RAW, take.file);
    const name = takes.length > 1 ? `${id}-${i + 1}` : id;
    const group = soundOf(take.file)?.group || "misc";
    const master = path.join(MASTER, `${name}.wav`);
    let rate = take.rate || 1;
    let tuned = null;
    if (take.tune && !take.rate) {
      const pc = PC[String(take.tune).replace("♯", "#")];
      // a bell's strongest partial measured by hand (its many partials mislead detectPitch)
      const m = take.fromHz ? 69 + 12 * Math.log2(take.fromHz / 440) : null;
      const pitch = m !== null ? { hz: take.fromHz, midi: m, name: noteName(m), cents: Math.round((m - Math.round(m)) * 100) } : detectPitch(readPcm(src).mono);
      if (pc === undefined || !pitch) throw new Error(`${id}: cannot tune ${take.file} to ${take.tune}${pitch ? "" : " (no clear pitch)"}`);
      const semis = shiftTo(pitch.hz, pc);
      rate = Math.pow(2, semis / 12);
      tuned = { from: pitch.name, cents: pitch.cents, to: noteName(pitch.midi + semis), semitones: +semis.toFixed(2) };
    }
    const mono = take.mono ?? (kind === "music" ? false : p.mono !== false);
    const r = kind === "bed" ? bed(src, master, { xfade: p.xfade ?? 2, ...take, dynamics: !take.plain }) : oneshot(src, master, { mono, music: kind === "music", trim: take.trim, gainDb: take.gainDb, rate, fx: take.fx, soft: take.soft, tilt: take.tilt, tailFade: take.tailFade });
    await mkdir(path.join(OUT, group), { recursive: true });
    // a bed is never raised past the guard (lib.mjs bed caps it): one that needed more sits quieter
    if (kind === "bed") console.log(`    raised ${r.raised} dB (limit ${BED_MAX_RAISE})${r.capped ? `, capped: ${r.capped} dB under the bed level` : ""}; notched ${r.notched.length} tone(s)`);
    // a page that turns must not thump (lib.mjs lowBand): such a take never ships, unless --allow-thump
    if (TURN_FAMILY.has(id)) {
      const lf = lowBand(master);
      if (lf.thump && !flag("allow-thump")) throw new Error(`${name} (${take.file}) thumps: ${Math.round(lf.share * 100)}% of its energy below 200 Hz, its loudest low 10 ms ${lf.vsFull} dB against the full band (limits ${Math.round(100 * 0.25)}%, -6 dB). Take it out of the picks.`);
      console.log(`    low band: ${Math.round(lf.share * 100)}% below 200 Hz, ${lf.vsFull} dB: no thump`);
    }
    const { ch, dur } = probe(master);
    // the master's own level (one-shots: momentary max, beds: integrated) and peak, so the engine can
    // make up a file the peak ceiling held under the common level
    const fin = loudness(master);
    encode(master, path.join(OUT, group, name), kind, ch);
    const sizes = ["webm", "m4a"].map((e) => statSync(path.join(OUT, group, `${name}.${e}`)).size);
    bytes += sizes[0];
    variants.push({ file: `${group}/${name}`, dur: +dur.toFixed(3), ch, ...(take.role ? { role: take.role } : {}), ...(tuned ? { tuned } : {}), from: take.file, lufs: kind === "bed" ? fin.I : fin.M, tp: fin.TP, ...(r.capped ? { capped: r.capped } : {}), ...(take.derived ? { derived: { rate: take.rate, tilt: take.tilt } } : {}), ...(take.soft ? { soft: true } : {}), ...(take.plain ? { plain: true } : {}) });
    console.log(`  ${name}: ${kind} ${dur.toFixed(2)} s x${ch}${tuned ? `, ${tuned.from}${tuned.cents >= 0 ? "+" : ""}${tuned.cents}c -> ${tuned.to}` : ""}, measured ${JSON.stringify(r.measured)}${r.gain !== undefined ? `, gain ${r.gain.toFixed(1)} dB` : ""}, ${(sizes[0] / 1024).toFixed(0)} KB webm / ${(sizes[1] / 1024).toFixed(0)} KB m4a`);
  }
  entries[id] = { kind, bus: p.bus || (kind === "bed" ? "amb" : "sfx"), group: soundOf(firstFile)?.group || "misc", gainDb: p.gainDb ?? 0, loop: kind === "bed", variants };
  // files of this id the new set no longer has (fewer variants than before) leave the book
  const { rmSync } = await import("node:fs");
  for (const f of before) if (!variants.some((v) => v.file === f)) for (const ext of ["webm", "m4a"]) rmSync(path.join(OUT, `${f}.${ext}`), { force: true });
}
await mkdir(path.dirname(MANIFEST), { recursive: true });
await writeFile(MANIFEST, `// Generated by scripts/sfx/master.mjs from scripts/sfx/picks.json: do not edit by hand.\n// Files are listed without extension: the engine adds .webm (Opus) or .m4a (AAC).\nexport const SOUND_BASE = ${JSON.stringify(BASE_URL)};\nexport const sounds = ${JSON.stringify(entries, null, 2)};\n`);
console.log(`done: ${(bytes / 1024).toFixed(0)} KB of Opus this run; manifest ${path.relative(ROOT, MANIFEST)}`);
