// Shared by master.mjs and sheets.mjs: ffmpeg helpers, the mastering chains and the analysis that
// lets the sheets suggest picks (technical checks only: nobody listened to them).
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
export const SFX = path.join(ROOT, "local-assets/sfx");
export const RAW = path.join(SFX, "raw");

// ---------------------------------------------------------------- ffmpeg (always with a clean environment)
export function run(cmd, argv, { binary = false } = {}) {
  const r = spawnSync(cmd, argv, { env: { PATH: process.env.PATH }, encoding: binary ? "buffer" : "utf8", maxBuffer: 512 * 1024 * 1024 });
  if (r.status !== 0) throw new Error(`${cmd} failed:\n${String(r.stderr || "").split("\n").slice(-12).join("\n")}`);
  return binary ? r.stdout : r.stderr || "";
}
export const ff = (...a) => run("ffmpeg", ["-hide_banner", "-nostats", "-y", ...a]);
export function probe(file) {
  const r = spawnSync("ffprobe", ["-v", "error", "-show_entries", "stream=channels,sample_rate:format=duration", "-of", "json", file], { env: { PATH: process.env.PATH }, encoding: "utf8" });
  const j = JSON.parse(r.stdout);
  return { dur: Number(j.format.duration), ch: j.streams[0].channels, rate: Number(j.streams[0].sample_rate) };
}
// momentary maximum and integrated loudness (LUFS), loudness range (LU), true peak (dBTP); padded
// with silence, so a sound shorter than the 400 ms momentary window is still measured
export function loudness(file) {
  const log = ff("-i", file, "-af", "apad=pad_dur=0.6,ebur128=peak=true", "-f", "null", "-");
  const Ms = [...log.matchAll(/M:\s*(-?[\d.]+)/g)].map((m) => Number(m[1])).filter((v) => v > -120);
  const sum = log.slice(log.lastIndexOf("Summary:"));
  const num = (re) => Number(sum.match(re)?.[1]);
  const TP = num(/Peak:\s*(-?[\d.]+)/);
  return { M: Ms.length ? Math.max(...Ms) : -70, I: num(/I:\s*(-?[\d.]+)/), LRA: num(/LRA:\s*(-?[\d.]+)/), TP: Number.isFinite(TP) ? TP : -70 };
}
// decoded to 48 kHz float stereo (mono files are doubled)
export function readPcm(file) {
  const buf = run("ffmpeg", ["-hide_banner", "-v", "error", "-i", file, "-ac", "2", "-ar", "48000", "-f", "f32le", "-"], { binary: true });
  const x = new Float32Array(buf.buffer, buf.byteOffset, Math.floor(buf.length / 4));
  const n = x.length / 2;
  const L = new Float32Array(n), R = new Float32Array(n), mono = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    L[i] = x[2 * i];
    R[i] = x[2 * i + 1];
    mono[i] = (L[i] + R[i]) / 2;
  }
  return { L, R, mono, sr: 48000 };
}

// ---------------------------------------------------------------- notes
export const NOTE_NAMES = ["C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯", "A", "A♯", "B"];
export const midiHz = (m) => 440 * Math.pow(2, (m - 69) / 12);
export const hzMidi = (hz) => 69 + 12 * Math.log2(hz / 440);
export const noteName = (m) => `${NOTE_NAMES[((Math.round(m) % 12) + 12) % 12]}${Math.floor(Math.round(m) / 12) - 1}`;
// the shift in semitones (fractional) that takes `hz` to the nearest pitch of class `pc` (2 = D)
export function shiftTo(hz, pc) {
  const m = hzMidi(hz);
  let d = (pc - m) % 12;
  if (d > 6) d -= 12;
  if (d < -6) d += 12;
  return d;
}

// ---------------------------------------------------------------- pitch: YIN over the sustain
function yin(x, start, W, sr) {
  const tauMin = Math.floor(sr / 1500), tauMax = Math.floor(sr / 55);
  if (start + W + tauMax >= x.length) return null;
  const d = new Float64Array(tauMax + 2);
  for (let tau = 1; tau <= tauMax + 1; tau++) {
    let s = 0;
    for (let i = start; i < start + W; i++) { const v = x[i] - x[i + tau]; s += v * v; }
    d[tau] = s;
  }
  const cm = new Float64Array(tauMax + 2);
  let run = 0;
  for (let tau = 1; tau <= tauMax + 1; tau++) { run += d[tau]; cm[tau] = (d[tau] * tau) / (run || 1); }
  let best = -1;
  for (let tau = tauMin; tau <= tauMax; tau++) if (cm[tau] < 0.15) { while (tau + 1 <= tauMax && cm[tau + 1] < cm[tau]) tau++; best = tau; break; }
  if (best < 0) return null;
  const a = cm[best - 1], b = cm[best], c = cm[best + 1];
  const den = a - 2 * b + c;
  const shift = den ? (a - c) / (2 * den) : 0;
  return { hz: sr / (best + (Math.abs(shift) < 1 ? shift : 0)), clarity: 1 - b };
}
// The pitch heard after the attack: YIN every 40 ms from just after the loudest moment for up to a
// second, keeping confident frames, then the most common pitch class (octave-proof) and its median.
export function detectPitch(mono, sr = 48000) {
  let p = 0, at = 0;
  for (let i = 0; i < mono.length; i++) if (Math.abs(mono[i]) > p) { p = Math.abs(mono[i]); at = i; }
  const frames = [];
  const W = 3072;
  for (let s = at + Math.floor(sr * 0.03); s < Math.min(mono.length - W - 1200, at + sr * 1.2); s += Math.floor(sr * 0.04)) {
    let e = 0;
    for (let i = s; i < s + W; i++) e += mono[i] * mono[i];
    if (10 * Math.log10(e / W + 1e-12) < 20 * Math.log10(p + 1e-12) - 40) break;
    const r = yin(mono, s, W, sr);
    if (r && r.clarity > 0.8) frames.push(r);
  }
  if (frames.length < 2) return null;
  const byPc = new Map();
  for (const f of frames) {
    const pc = ((Math.round(hzMidi(f.hz)) % 12) + 12) % 12;
    byPc.set(pc, [...(byPc.get(pc) || []), f]);
  }
  const [pc, list] = [...byPc.entries()].sort((a, b) => b[1].length - a[1].length)[0];
  // cents within the class, octave-folded, median
  const cents = list.map((f) => { const m = hzMidi(f.hz); return (m - Math.round(m)) * 100; }).sort((a, b) => a - b);
  const c = cents[Math.floor(cents.length / 2)];
  const octaves = list.map((f) => Math.round(hzMidi(f.hz))).sort((a, b) => a - b);
  const midi = octaves[Math.floor(octaves.length / 2)] + c / 100;
  return { hz: +midiHz(midi).toFixed(2), midi: +midi.toFixed(2), name: noteName(midi), cents: +c.toFixed(0), pc, clarity: +(list.reduce((a, f) => a + f.clarity, 0) / list.length).toFixed(2), share: +(list.length / frames.length).toFixed(2) };
}

// ---------------------------------------------------------------- technical analysis of a take
const dbOf = (v) => 20 * Math.log10(v + 1e-12);
function highpass(x, sr, f = 1500) {
  // two cascaded first-order high-passes: enough to find the attacks of plucks, steps, taps
  const out = new Float32Array(x.length);
  const a = 1 / (1 + (2 * Math.PI * f) / sr);
  let y = 0, px = 0, y2 = 0, py = 0;
  for (let i = 0; i < x.length; i++) {
    y = a * (y + x[i] - px); px = x[i];
    y2 = a * (y2 + y - py); py = y;
    out[i] = y2;
  }
  return out;
}
export function analyse(file, { tonal = false, loop = false } = {}) {
  const { L, R, mono, sr } = readPcm(file);
  const n = mono.length;
  const lo = loudness(file);
  let peak = 0, clip = 0;
  for (let i = 0; i < n; i++) { const a = Math.max(Math.abs(L[i]), Math.abs(R[i])); if (a > peak) peak = a; if (a >= 0.999) clip++; }
  const pk = dbOf(peak);
  // 20 ms windows: lead-in silence, the active span, the noise floor, how the file ends
  const hop = Math.floor(sr * 0.02);
  const lv = [];
  for (let s = 0; s + hop <= n; s += hop) { let e = 0; for (let i = s; i < s + hop; i++) e += mono[i] * mono[i]; lv.push(10 * Math.log10(e / hop + 1e-12)); }
  const winPk = Math.max(...lv);
  const first = lv.findIndex((v) => v > winPk - 40);
  const last = lv.length - 1 - [...lv].reverse().findIndex((v) => v > winPk - 40);
  const sorted = [...lv].sort((a, b) => a - b);
  const floor = sorted[Math.floor(sorted.length * 0.1)];
  const endLv = Math.max(...lv.slice(-3));
  // attacks: rises of the high-passed energy (10 ms hops) over 5 dB, within 30 dB of its loudest
  const hp = highpass(mono, sr);
  const h = Math.floor(sr * 0.01);
  const hl = [];
  for (let s = 0; s + h <= n; s += h) { let e = 0; for (let i = s; i < s + h; i++) e += hp[i] * hp[i]; hl.push(10 * Math.log10(e / h + 1e-12)); }
  const hmax = Math.max(...hl);
  const onsets = [];
  let lastOn = -99;
  for (let i = 0; i < hl.length; i++) {
    const base = i >= 3 ? Math.min(hl[i - 3], hl[i - 2]) : -120;
    if (hl[i] - base > 5 && hl[i] > hmax - 30 && i - lastOn > 8) { onsets.push(+((i * h) / sr).toFixed(2)); lastOn = i; }
  }
  // stereo width: side relative to mid
  let ms = 0, ss = 0;
  for (let i = 0; i < n; i++) { const m = (L[i] + R[i]) / 2, s = (L[i] - R[i]) / 2; ms += m * m; ss += s * s; }
  const out = {
    dur: +(n / sr).toFixed(3), peakDb: +pk.toFixed(1), clipped: clip, M: lo.M, I: lo.I, LRA: lo.LRA, TP: lo.TP,
    leadMs: first * 20, activeSec: +(((last - first + 1) * 20) / 1000).toFixed(2), floorDb: +(floor - winPk).toFixed(0),
    endDb: +(endLv - winPk).toFixed(0), onsets, widthDb: +(10 * Math.log10((ss + 1e-12) / (ms + 1e-12))).toFixed(0),
  };
  if (loop) {
    let st = 0;
    for (let i = 1; i < n; i++) st += Math.abs(mono[i] - mono[i - 1]);
    out.seam = +(Math.abs(mono[0] - mono[n - 1]) / (st / (n - 1) || 1)).toFixed(1);
  }
  if (tonal) out.pitch = detectPitch(mono, sr);
  return out;
}

// ---------------------------------------------------------------- spectrum: narrow tonal peaks
function fft(re, im) {
  const n = re.length;
  for (let i = 1, j = 0; i < n; i++) {
    let b = n >> 1;
    for (; j & b; b >>= 1) j ^= b;
    j ^= b;
    if (i < j) { [re[i], re[j]] = [re[j], re[i]]; [im[i], im[j]] = [im[j], im[i]]; }
  }
  for (let len = 2; len <= n; len <<= 1) {
    const a = (-2 * Math.PI) / len;
    for (let i = 0; i < n; i += len)
      for (let k = 0; k < len / 2; k++) {
        const c = Math.cos(a * k), s = Math.sin(a * k), u = i + k, v = u + len / 2;
        const xr = re[v] * c - im[v] * s, xi = re[v] * s + im[v] * c;
        re[v] = re[u] - xr; im[v] = im[u] - xi; re[u] += xr; im[u] += xi;
      }
  }
}
// The steady narrow tones in a take (Hz), standing `minProm` dB over the spectrum round them: the
// generator's faint whine at multiples of ~200 Hz that made the first room bed sound like a machine.
// Measured on the whole file (averaged spectra), so a passing bird call or crackle never counts.
export function tonalPeaks(file, { minHz = 100, maxHz = 4000, minProm = 9 } = {}) {
  const { mono, sr } = readPcm(file);
  const n = 32768;
  const acc = new Float64Array(n / 2);
  const w = new Float64Array(n).map((_, i) => 0.5 - 0.5 * Math.cos((2 * Math.PI * i) / n));
  for (let s = 0; s + n <= mono.length; s += n / 2) {
    const re = new Float64Array(n), im = new Float64Array(n);
    for (let i = 0; i < n; i++) re[i] = mono[s + i] * w[i];
    fft(re, im);
    for (let b = 0; b < n / 2; b++) acc[b] += Math.hypot(re[b], im[b]);
  }
  const out = [];
  for (let b = Math.ceil((minHz * n) / sr); b < (maxHz * n) / sr; b++) {
    const ring = [...acc.slice(b - 8, b - 2), ...acc.slice(b + 3, b + 9)];
    const local = ring.reduce((a, x) => a + x, 0) / ring.length;
    if (acc[b] > acc[b - 1] && acc[b] > acc[b + 1] && 20 * Math.log10(acc[b] / (local || 1e-12)) > minProm) {
      // the peak's true frequency between its bins (parabolic)
      const [a1, a2, a3] = [acc[b - 1], acc[b], acc[b + 1]];
      out.push(+(((b + (a1 - a3) / (2 * (a1 - 2 * a2 + a3) || 1)) * sr) / n).toFixed(1));
    }
  }
  return out;
}
// ---------------------------------------------------------------- low-frequency thumps
// A page turn should be paper: air and rustle. A take whose "landing" is a heavy low thump (the user
// heard one in every few turns, 2026-10-25: page-turn-b t01, 79% of its energy below 200 Hz) is
// caught here. `share`: the part of the energy below 200 Hz; `vsFull`: the loudest 10 ms of that
// band against the loudest 10 ms of the whole sound (0 dB: the thump is the sound).
export const THUMP = { share: 0.25, vsFull: -6 };
function lowpass200(x, sr) {
  const out = Float32Array.from(x);
  for (let pass = 0; pass < 2; pass++) {
    const w = (2 * Math.PI * 200) / sr, a = Math.sin(w) / (2 * Math.SQRT1_2), c = Math.cos(w);
    const b0 = (1 - c) / 2, b1 = 1 - c, a0 = 1 + a, a1 = -2 * c, a2 = 1 - a;
    let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
    for (let i = 0; i < out.length; i++) {
      const x0 = out[i];
      const y = (b0 * x0 + b1 * x1 + b0 * x2 - a1 * y1 - a2 * y2) / a0;
      x2 = x1; x1 = x0; y2 = y1; y1 = y; out[i] = y;
    }
  }
  return out;
}
export function lowBand(file) {
  const { mono, sr } = readPcm(file);
  const lo = lowpass200(mono, sr);
  let e = 0, el = 0, pkl = 0, at = 0;
  for (let i = 0; i < mono.length; i++) { e += mono[i] ** 2; el += lo[i] ** 2; if (Math.abs(lo[i]) > pkl) { pkl = Math.abs(lo[i]); at = i / sr; } }
  const h = Math.floor(sr * 0.01);
  let wl = 0, wa = 0;
  for (let s = 0; s + h <= mono.length; s += h) {
    let a = 0, b = 0;
    for (let i = s; i < s + h; i++) { a += mono[i] ** 2; b += lo[i] ** 2; }
    wa = Math.max(wa, a); wl = Math.max(wl, b);
  }
  const share = el / (e || 1e-12), vsFull = 10 * Math.log10((wl || 1e-12) / (wa || 1e-12));
  return { share: +share.toFixed(3), vsFull: +vsFull.toFixed(1), peakDb: +(20 * Math.log10(pkl + 1e-9)).toFixed(1), at: +at.toFixed(2), thump: share > THUMP.share || vsFull > THUMP.vsFull };
}
// the sounds of a turning page, which must never thump
export const TURN_FAMILY = new Set(["page-turn", "page-settle", "page-held", "riffle-leaf", "riffle-land", "pages-return"]);

// ---------------------------------------------------------------- key of a piece (themes)
// Chroma of the whole piece (and of its last 2.5 s) against the Krumhansl key profiles: the key it
// is in, the pitches of its last chord.
const NOTE_PC = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const MAJ = [6.35, 2.23, 3.48, 2.33, 4.38, 4.09, 2.52, 5.19, 2.39, 3.66, 2.29, 2.88], MIN = [6.33, 2.68, 3.52, 5.38, 2.6, 3.53, 2.54, 4.75, 3.98, 2.69, 3.34, 3.17];
function chroma(x, sr, t0, t1) {
  const n = 8192, out = new Float64Array(12);
  const w = new Float64Array(n).map((_, i) => 0.5 - 0.5 * Math.cos((2 * Math.PI * i) / n));
  for (let s = Math.floor(t0 * sr); s + n <= Math.min(x.length, t1 * sr); s += n / 2) {
    const re = new Float64Array(n), im = new Float64Array(n);
    for (let i = 0; i < n; i++) re[i] = x[s + i] * w[i];
    fft(re, im);
    for (let b = 1; b < n / 2; b++) {
      const f = (b * sr) / n;
      if (f < 60 || f > 2000) continue;
      out[((Math.round(12 * Math.log2(f / 440) + 69) % 12) + 12) % 12] += Math.sqrt(Math.hypot(re[b], im[b]));
    }
  }
  return out;
}
function bestKey(c) {
  const mc = c.reduce((a, b) => a + b) / 12;
  let best = null;
  for (const [mode, P] of [["major", MAJ], ["minor", MIN]]) {
    const mp = P.reduce((a, b) => a + b) / 12;
    for (let r = 0; r < 12; r++) {
      let num = 0, dc = 0, dp = 0;
      for (let i = 0; i < 12; i++) { const a = c[(i + r) % 12] - mc, b = P[i] - mp; num += a * b; dc += a * a; dp += b * b; }
      const v = num / Math.sqrt(dc * dp);
      if (!best || v > best.score) best = { key: `${NOTE_PC[r]} ${mode}`, score: +v.toFixed(2) };
    }
  }
  return best;
}
export function keyOf(file) {
  const { mono, sr } = readPcm(file);
  const d = mono.length / sr;
  const k = bestKey(chroma(mono, sr, 0, d));
  const last = chroma(mono, sr, Math.max(0, d - 2.5), d);
  const final = [...last].map((v, i) => [NOTE_PC[i], v]).sort((a, b) => b[1] - a[1]).slice(0, 3).map((x) => x[0]).join(" ");
  return { ...k, final };
}

// a soft small room: decaying pink noise, darker than the dry sound (made once)
const IR = path.join(SFX, "ir-small-room.wav");
export function roomIR() {
  if (!existsSync(IR)) ff("-f", "lavfi", "-i", "anoisesrc=d=0.5:c=pink:r=48000:a=1:s=11", "-af", "afade=t=out:st=0:d=0.5:curve=exp,highpass=f=220,lowpass=f=4200", "-ac", "1", "-c:a", "pcm_f32le", IR);
  return IR;
}

// ---------------------------------------------------------------- mastering chains
export const TARGET = { oneshotM: -20, oneshotTP: -1, bedI: -24, bedTP: -3 };
export const BITRATE = { mono: { opus: "48k", aac: "64k" }, stereo: { opus: "64k", aac: "96k" }, music: { opus: "96k", aac: "128k" } };

// One-shot: optional retune (a speed change, like a slower or faster string: right for a semitone
// or two), high-pass, silence trimmed, folded to mono (unless `mono: false`), loudness, fades.
// `fx: "far"`: the same sound heard from across the valley (duller, a little echo off the hills).
// `soft: { attack, lp, deess, room, fade }`: a dry, stiff take made gentler: a slower attack (s), a
// low-pass (Hz), de-essing (0..1, for a sharp quill), a little small room (0..1 wet), a slower fade (s).
// `tilt`: dB of treble shelf at 4 kHz (a derived variant a shade darker or brighter).
// `tailFade`: seconds of a gentle fade over the end (a held last chord the take cuts off too soon).
export function oneshot(src, dst, { mono = true, trim, gainDb = 0, music = false, rate = 1, fx = null, soft = null, tilt = 0, tailFade = 0 } = {}) {
  const t1 = `${dst}.trim.wav`;
  const { ch } = probe(src);
  const tail = ["areverse", "silenceremove=start_periods=1:start_threshold=-60dB:start_silence=0.04", "areverse"];
  const pre = [
    trim ? `atrim=start=${trim[0]}:end=${trim[1]},asetpts=PTS-STARTPTS` : null,
    "aresample=48000",
    rate !== 1 ? `asetrate=${(48000 * rate).toFixed(3)},aresample=48000` : null,
    `highpass=f=${music ? 40 : 70}`,
    fx === "far" ? "lowpass=f=2200,aecho=0.8:0.7:90|210:0.35|0.25" : null,
    soft?.lp ? `lowpass=f=${soft.lp}` : null,
    soft?.deess ? `deesser=i=${soft.deess}:m=0.6:f=0.45:s=o` : null,
    tilt ? `treble=g=${tilt}:f=4000` : null,
    "silenceremove=start_periods=1:start_threshold=-60dB:start_silence=0.005", ...tail,
    mono && ch === 2 ? "pan=mono|c0=0.5*c0+0.5*c1" : null,
  ].filter(Boolean).join(",");
  ff("-i", src, "-af", pre, "-c:a", "pcm_f32le", t1);
  if (soft?.room) {
    // a little of a small room under the dry sound, its tail kept
    const t2 = `${dst}.room.wav`;
    ff("-i", t1, "-i", roomIR(), "-filter_complex", `[0:a]apad=pad_dur=0.5[x];[x][1:a]afir=dry=10:wet=${(10 * soft.room).toFixed(2)}[w];[w]${tail.join(",")}[o]`, "-map", "[o]", "-c:a", "pcm_f32le", t2);
    spawnSync("mv", [t2, t1]);
  }
  const { dur } = probe(t1);
  const L = loudness(t1);
  // to the loudness target (plus the pick's own offset), never past the true-peak ceiling
  const g = Math.min(TARGET.oneshotM - L.M + gainDb, TARGET.oneshotTP - L.TP);
  const fo = tailFade ? Math.min(tailFade, dur * 0.4) : soft?.fade ? Math.min(soft.fade, dur * 0.5) : music ? Math.min(0.3, dur * 0.2) : Math.min(0.08, Math.max(0.03, dur * 0.12));
  const fi = soft?.attack || 0.003;
  ff("-i", t1, "-af", `volume=${g.toFixed(2)}dB,afade=t=in:d=${fi}${soft?.attack ? ":curve=qsin" : ""},afade=t=out:st=${Math.max(0, dur - fo).toFixed(4)}:d=${fo.toFixed(4)}`, "-c:a", "pcm_s24le", dst);
  spawnSync("rm", ["-f", t1]);
  return { gain: g, measured: L, dur };
}

// Bed: EQ that leaves room for the reader's voice, loudness, then a seamless loop. A steep
// high-pass (`hp`, 150 Hz: no rumble or drone, which tablet speakers cannot play anyway) and a
// narrow notch on every steady tone measured in the take (tonalPeaks: the generator's whine).
// `dynamics: false`: linear gain only, as high as the peaks allow (a take kept as generated: its
// crackles and pops are never evened out); the engine then makes up the level (sounds.js `lufs`).
// How far a bed may be raised to its level: a near-silent take raised more than this is mostly the
// generator's own noise made loud, heard as distortion (2026-10-25: the tower bed, raised 42 dB).
// A picked take that would need more is raised this far only and sits that much quieter (`capped`).
export const BED_MAX_RAISE = 24;
export function bed(src, dst, { xfade = 2, trim, gainDb = 0, hp = 150, notch = "auto", dynamics = true } = {}) {
  const t1 = `${dst}.eq.wav`;
  const t2 = `${dst}.norm.wav`;
  const tones = notch === "auto" ? tonalPeaks(src) : [...(notch || [])];
  const chain = () => [trim ? `atrim=start=${trim[0]}:end=${trim[1]},asetpts=PTS-STARTPTS` : null, "aresample=48000", `highpass=f=${hp}`, `highpass=f=${hp}`,
    ...tones.map((f) => `equalizer=f=${f}:t=h:w=${Math.max(4, f * 0.012).toFixed(1)}:g=-30`), "lowpass=f=14000", "equalizer=f=2500:t=q:w=0.8:g=-3"].filter(Boolean).join(",");
  ff("-i", src, "-af", chain(), "-c:a", "pcm_f32le", t1);
  // tones the rumble hid show once it is gone: measured again, notched in a second pass
  if (notch === "auto") {
    const more = tonalPeaks(t1).filter((f) => !tones.some((g) => Math.abs(g - f) < 3));
    if (more.length) {
      tones.push(...more);
      ff("-i", src, "-af", chain(), "-c:a", "pcm_f32le", t1);
    }
  }
  const eq = null;
  // a very quiet take is brought up first: loudnorm only accepts measurements down to -99 LUFS and
  // corrects best from near its target
  const pre = loudness(t1).I;
  const raised = +(TARGET.bedI + gainDb - pre).toFixed(1);
  // never raised past the guard: the bed's level is then that much lower
  const capped = Math.max(0, +(raised - BED_MAX_RAISE).toFixed(1));
  const targetI = TARGET.bedI + gainDb - capped;
  const lift = Number.isFinite(pre) && pre < -40 ? Math.min(45, -30 - pre) : 0;
  if (lift) {
    ff("-i", t1, "-af", `volume=${lift.toFixed(1)}dB`, "-c:a", "pcm_f32le", `${t1}.l.wav`);
    spawnSync("mv", [`${t1}.l.wav`, t1]);
  }
  let m;
  if (dynamics) {
    const ln = `loudnorm=I=${targetI}:TP=${TARGET.bedTP}:LRA=7`;
    m = JSON.parse(ff("-i", t1, "-af", `${ln}:print_format=json`, "-f", "null", "-").match(/\{[\s\S]*?\}/)[0]);
    ff("-i", t1, "-af", `${ln}:measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}:measured_thresh=${m.input_thresh}:offset=${m.target_offset}:linear=true,aresample=48000`, "-c:a", "pcm_f32le", t2);
  } else {
    const L0 = loudness(t1);
    const g = Math.min(targetI - L0.I, TARGET.bedTP - L0.TP);
    ff("-i", t1, "-af", `volume=${g.toFixed(2)}dB`, "-c:a", "pcm_f32le", t2);
    m = { input_i: L0.I, input_tp: L0.TP, input_lra: L0.LRA };
  }
  const { dur } = probe(t2);
  const X = Math.min(xfade, dur / 4);
  // [tail][head] crossfaded, then the middle: the loop's seam is the original, unbroken audio
  ff("-i", t2, "-filter_complex",
    `[0:a]asplit=3[a][b][c];[a]atrim=0:${X},asetpts=PTS-STARTPTS[head];[b]atrim=${X}:${dur - X},asetpts=PTS-STARTPTS[mid];` +
    `[c]atrim=${dur - X}:${dur},asetpts=PTS-STARTPTS[tail];[tail][head]acrossfade=d=${X}:c1=qsin:c2=qsin[xf];[xf][mid]concat=n=2:v=0:a=1[out]`,
    "-map", "[out]", "-c:a", "pcm_s24le", dst);
  spawnSync("rm", ["-f", t1, t2]);
  // tones a fire's crackle hid until the loudness pass evened it out: one more round with them notched
  if (notch === "auto" || (Array.isArray(notch) && !arguments[2]?.final)) {
    const more = tonalPeaks(dst).filter((f) => !tones.some((g) => Math.abs(g - f) < 3));
    if (more.length) return bed(src, dst, { xfade, trim, gainDb, hp, notch: [...tones, ...more], final: true, dynamics });
  }
  return { measured: { I: Number(m.input_i), TP: Number(m.input_tp), LRA: Number(m.input_lra) }, notched: tones, raised: Math.min(raised, BED_MAX_RAISE), capped, dur: probe(dst).dur, xfade: X };
}

export function encode(master, outBase, kind, ch) {
  const br = kind === "music" ? BITRATE.music : ch === 1 ? BITRATE.mono : BITRATE.stereo;
  ff("-i", master, "-c:a", "libopus", "-b:a", br.opus, "-vbr", "on", "-application", "audio", "-ar", "48000", `${outBase}.webm`);
  ff("-i", master, "-c:a", "aac_at", "-b:a", br.aac, "-ar", "48000", "-movflags", "+faststart", `${outBase}.m4a`);
}
