#!/usr/bin/env node
// Writes scripts/sfx/picks.json, the input of master.mjs: what the book ships and from which takes.
//
//   node scripts/sfx/picks.mjs                                  library = picks-library.json if there, else the sheet's pre-stars
//   node scripts/sfx/picks.mjs --library <export.json>          another export of the library sheet
//   node scripts/sfx/picks.mjs --redo <sfx-picks-redo.json>     the user's choices on the (rejected) redo sheet
//   node scripts/sfx/picks.mjs --redo2 <export.json>            the new generations picked on ?sheet=redo2
//                                                               (picks-redo2.json is read when present):
//                                                               each ships as generated, one take, no variants
//   then: node scripts/sfx/master.mjs
//
// - The choice motif and the ending motif are fixed here, from the motif sheet (picks-motif.json,
//   2026-10-25, set "mix"): every take the user starred anywhere, all tuned to D.
// - The library: the user's own picks when their export is given; until then the library sheet's
//   pre-stars (local-assets/sfx/sheets/library.json), which put the user's phase-0 picks first
//   (page turn, seal, evening bed) and fill the rest from the technical checks.
// - Takes of several prompts may ship as one sound (page-turn-a/b/c -> page-turn); the riffle and the
//   candle takes are sliced into single leaves and sputters; the Moonhill bell also gives the far
//   bell of page 10.
import { readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { ROOT, SFX } from "./lib.mjs";
import { REDO } from "./redo.mjs";

const args = process.argv.slice(2);
const arg = (k) => (args.includes(`--${k}`) ? args[args.indexOf(`--${k}`) + 1] : null);
const DEFAULT_LIB = path.join(ROOT, "scripts/sfx/picks-library.json");
const libArg = arg("library") || (existsSync(DEFAULT_LIB) ? DEFAULT_LIB : null);
const redoArg = arg("redo");
const DEFAULT_REDO2 = path.join(ROOT, "scripts/sfx/picks-redo2.json");
// the tales' themes picked on ?sheet=themes (picks-themes.json is read when present)
const DEFAULT_THEMES = path.join(ROOT, "scripts/sfx/picks-themes.json");
// the new beds of both tales and the Bell's folk themes picked on ?sheet=redo3 (picks-redo3.json)
const DEFAULT_REDO3 = path.join(ROOT, "scripts/sfx/picks-redo3.json");
const redo3Arg = arg("redo3") || (existsSync(DEFAULT_REDO3) ? DEFAULT_REDO3 : null);
const themesArg = arg("themes") || (existsSync(DEFAULT_THEMES) ? DEFAULT_THEMES : null);
const redo2Arg = arg("redo2") || (existsSync(DEFAULT_REDO2) ? DEFAULT_REDO2 : null);
const manifest = JSON.parse(await readFile(path.join(ROOT, "scripts/sfx/manifest.json"), "utf8"));
const byId = new Map(manifest.sounds.map((s) => [s.id, s]));

// ---------------------------------------------------------------- the motifs (fixed)
const MOTIF = {
  "choice-motif": {
    kind: "oneshot", bus: "music", mono: false,
    note: "Set 'mix' (picks-motif.json): every take starred anywhere, all in D. The first choice of a tale plays t02 (starred in all three lists), the last t01 (the user's W4 in set 2), those between t07, t08, t04 (t04 starred raw; its F sharp version was not chosen).",
    takes: [
      { file: "choice-motif/choice-motif--sfx-v3-t02.wav", tune: "D", role: "first" },
      { file: "choice-motif/choice-motif--sfx-v3-t07.wav", tune: "D", role: "middle" },
      { file: "choice-motif/choice-motif--sfx-v3-t08.wav", tune: "D", role: "middle" },
      { file: "choice-motif/choice-motif--sfx-v3-t04.wav", tune: "D", role: "middle" },
      { file: "choice-motif/choice-motif--sfx-v3-t01.wav", tune: "D", role: "last" },
    ],
  },
  "motif-end": {
    kind: "music", bus: "music",
    note: "The user starred music_v2 t03 and t04 for one slot: t03 ends on a clean D major triad (D-A-F sharp) with its tail fully decayed (-64 dB) and even dynamics (LRA 4.5 LU); t04 ends D-A-E and still rings at the 12 s cut.",
    takes: ["motif-end/motif-end--music-v2-t03.mp3"],
  },
};

// ---------------------------------------------------------------- the library
const SHIP = { "page-turn-a": "page-turn", "page-turn-b": "page-turn", "page-turn-c": "page-turn", riffle: "riffle-leaf", "room-hearth": "room-bed" };
// the redo sheet's choice per sound: "raw" | "soft" | "softer" (default "soft")
const redoChoice = {};
if (redoArg) {
  const ex = JSON.parse(await readFile(path.resolve(redoArg), "utf8"));
  for (const [id, v] of Object.entries(ex.sounds)) redoChoice[id] = v.picked.map((p) => p.role).filter(Boolean)[0];
}
const SKIP = new Set(["choice-motif", "choice-motif-music", "harp-pluck", "motif-end"]);
// No longer played since the soundscape redesign (2026-10-25: one bed per place, nothing fired as a
// page lands, one click for every control, the choice without the quill line): not shipped.
const RETIRED = new Set(["db-stone", "db-lantern", "db-steps", "db-cradle", "db-walk-away", "db-scale", "db-tiptoe",
  "mh-keys", "mh-hooves", "mh-stick", "mh-ladder", "mh-rope", "ui-tap", "ui-slide", "quill-line", "gilt-glint",
  // the tower bed's first take (t03) was near-silent: raised 42 dB its noise was heard as distortion
  // (2026-10-25); its new take comes from the redo3 picks
  "mh-bed-tower"]);
const SLICE = { riffle: { max: 4, len: 0.42 }, "candle-sputter": { max: 4, len: 0.6 } };
const STEREO = new Set(["mh-bell", "mh-hum", "mh-bronze", "gilt-glint"]);
const TONAL = new Set(["mh-bell", "mh-hum", "mh-bronze", "gilt-glint"]);

// Takes flagged by the checks, fixed in mastering: the copper scale's one click (its take holds five
// taps), the two bells tuned from their strongest partial (581.5 Hz = D5 -17 c; 1486.9 Hz = F sharp 6)
// to a clean D, the rejected room bed replaced by the hearth (its machine-like tones notched in bed()).
const TAKE_FIX = {
  "db-scale/db-scale--sfx-v2-t03.wav": { single: true },
  "mh-bell/mh-bell--sfx-v3-t04.wav": { fromHz: 581.5, tune: "D" },
  "mh-bell/mh-bell--sfx-v3-t08.wav": { fromHz: 1486.9, tune: "D" },
};
const ROOM_TAKE = "room-hearth/room-hearth--sfx-v2-t01.wav"; // t02 carries a 400 Hz whine and busier crackle (notched too)
const ROOM_T02 = "room-hearth/room-hearth--sfx-v2-t02.wav";
// Where the book ships more variants than were picked, the extra ones come from the picked takes,
// a shade slower or faster and darker or brighter (never an unpicked take).
const VARY = [{ rate: 0.965, tilt: -1.5 }, { rate: 1.035, tilt: 1 }, { rate: 0.98, tilt: 1.5 }, { rate: 1.02, tilt: -1 }];
// Picked, then taken out: the heavy landing the user heard as a thump in every few turns
// (2026-10-25; 79% of its energy below 200 Hz, see lib.mjs lowBand). A turning page also never gets
// derived variants: the page-turn rotation is the user's own takes only.
const PICK_DROP = { "page-turn-b/page-turn-b--sfx-v2-t01.wav": "a thump in the turn: 79% of its energy below 200 Hz" };
const NEVER_DERIVE = new Set(["page-turn-a", "page-turn-b", "page-turn-c"]);
const BUS = (id) => {
  const s = byId.get(id);
  if (s?.loop || ["candle-sputter", "db-owl"].includes(id)) return "amb"; // room-hearth is a loop too
  if (["ui-tap", "ui-slide"].includes(id)) return "ui";
  if (s?.group === "core") return "sfx";
  return "story";
};

let picked; // { rawId: [files relative to raw/] }
let ship = {}; // { rawId: how many the book plays in turn }
let source;
if (libArg) {
  const ex = JSON.parse(await readFile(path.resolve(libArg), "utf8"));
  picked = Object.fromEntries(Object.entries(ex.sounds).map(([id, v]) => [id, v.picked.map((p) => p.file)]));
  ship = Object.fromEntries(Object.entries(ex.sounds).map(([id, v]) => [id, v.ship || v.picked.length]));
  picked["room-bed"] = [`raw/${ROOM_TAKE}`]; // rejected: the hearth instead
  ship["room-bed"] = 1;
  source = `the user's library export ${path.basename(libArg)} (${ex.exportedAt})`;
} else {
  const sheetFile = path.join(SFX, "sheets/library.json");
  if (!existsSync(sheetFile)) throw new Error("no library sheet: run node scripts/sfx/sheets.mjs");
  const sheet = JSON.parse(await readFile(sheetFile, "utf8"));
  picked = {};
  for (const sec of sheet.sections) for (const g of sec.groups) for (const it of g.items) picked[it.id] = it.takes.filter((t) => t.recommended).map((t) => t.file);
  source = `the library sheet's pre-stars (${sheet.builtAt}): the user's phase-0 picks plus technical picks, until the user's library picks arrive`;
}
// the redo sheet may have chosen the other hearth take
if (picked["room-bed"] && redoChoice["room-bed"] === "hearth-2") picked["room-bed"] = [`raw/${ROOM_T02}`];
const rel = (f) => f.replace(/^raw\//, "");
const out = { _about: `Written by scripts/sfx/picks.mjs on ${new Date().toISOString()}. Motifs: from picks-motif.json. Library: ${source}. The mix lives in src/book/sound.js (LEVELS); gainDb here only trims a file.`, ...MOTIF };
for (const [id, files] of Object.entries(picked)) {
  if (SKIP.has(id) || RETIRED.has(id) || !files.length) continue;
  const shipId = SHIP[id] || id;
  const s = byId.get(id === "room-bed" ? "room-hearth" : id);
  const entry = (out[shipId] ||= { kind: s?.loop ? "bed" : "oneshot", bus: BUS(id === "room-bed" ? "room-hearth" : id), ...(STEREO.has(id) ? { mono: false } : {}), takes: [] });
  const redo = REDO[id] && (redoChoice[id] || "soft");
  const takeOf = (f) => {
    const t = { file: rel(f), ...(TAKE_FIX[rel(f)] || {}) };
    if (SLICE[id]) t.slice = { ...SLICE[id], ...(id === "riffle" && files.length === 1 ? { max: 8 } : {}) };
    if (redo && redo !== "raw") t.soft = REDO[id][redo];
    return Object.keys(t).length === 1 ? t.file : t;
  };
  const base = files.filter((f) => !PICK_DROP[rel(f)]).map(takeOf);
  if (!base.length) continue;
  entry.takes.push(...base);
  // more variants wanted than picked: derived from the picked takes (not for pitched or sliced sounds)
  const want = ship[id] || files.length;
  if (!SLICE[id] && !TONAL.has(id) && !NEVER_DERIVE.has(id) && want > base.length)
    for (let k = 0; k < want - base.length; k++) {
      const t = base[k % base.length];
      const o = typeof t === "string" ? { file: t } : { ...t };
      entry.takes.push({ ...o, rate: +((o.rate || 1) * VARY[k % VARY.length].rate).toFixed(4), tilt: VARY[k % VARY.length].tilt, derived: true });
    }
  if (id === "mh-bell") out["mh-bell-far"] = { kind: "oneshot", bus: "story", mono: false, takes: [{ ...(typeof base[0] === "string" ? { file: base[0] } : base[0]), fx: "far" }] };
}
// The new generations the user picked on the redo2 sheet replace those sounds whole: the take as
// generated through the plain chain (trim, loudness, fades; a bed's tone notches, rumble cut, loop),
// one variant, nothing softened or derived.
if (redo2Arg) {
  const ex = JSON.parse(await readFile(path.resolve(redo2Arg), "utf8"));
  for (const [id, v] of Object.entries(ex.sounds)) {
    if (!v.picked?.length) continue;
    const prev = out[id] || {};
    out[id] = { kind: prev.kind || (id === "room-bed" ? "bed" : "oneshot"), bus: prev.bus || BUS(id), note: `redo2 (${ex.exportedAt}): new generation as picked, plain chain`, takes: v.picked.map((p) => ({ file: rel(p.file), plain: true })) };
  }
  out._about += ` Redo2: ${Object.keys(ex.sounds).join(", ")} from ${path.basename(redo2Arg)}.`;
}
// The tales' themes: each ships as its picked take (the first, if several were starred), as generated
// (the music chain: trim, loudness, a short tail fade); once a tale has its own closing theme the
// shared one (motif-end) is no longer its ending (soundscape.js plays the first that is mastered).
if (themesArg) {
  const ex = JSON.parse(await readFile(path.resolve(themesArg), "utf8"));
  // the dragon's opening holds its last D major chord from 8 s and the take drops it ~20 dB in its
  // last 0.75 s: that chord fades out gently over its last 2.5 s instead (nothing else changes)
  const THEME_FIX = { "dragon-intro-a/dragon-intro-a--music-v2-5-t01.mp3": { tailFade: 2.5 } };
  for (const [id, v] of Object.entries(ex.sounds)) {
    if (!/-theme$/.test(id) || !v.picked?.length) continue;
    const f = rel(v.picked[0].file);
    out[id] = { kind: "music", bus: "music", note: `themes (${ex.exportedAt})`, takes: [THEME_FIX[f] ? { file: f, ...THEME_FIX[f] } : f] };
  }
  // both tales have their own closing theme: the shared one is retired
  if (out["dragon-ending-theme"] && out["bell-ending-theme"]) delete out["motif-end"];
  out._about += ` Themes from ${path.basename(themesArg)}.`;
}
// Redo 3: the picked beds replace those of both tales (the tower comes back with its new take), the
// Bell's folk themes replace its harp ones. Each as generated, through the plain chain. The two
// themes are each cut off by the generator's quick fade (the opening on a re-struck last note, the
// closing a new phrase into its own); each ends at its last phrase instead, on its held D chord,
// with a gentle fade over that chord (nothing else changes).
if (redo3Arg) {
  const ex = JSON.parse(await readFile(path.resolve(redo3Arg), "utf8"));
  const THEME3_FIX = {
    "bell-intro-r3c/bell-intro-r3c--music-v2-t01.mp3": { trim: [0, 10.62], tailFade: 1.0 },
    "bell-ending-r3c/bell-ending-r3c--music-v2-5-t01.mp3": { trim: [0, 12.75], tailFade: 0.8 },
  };
  for (const [id, v] of Object.entries(ex.sounds)) {
    if (!v.picked?.length) continue;
    const f = rel(v.picked[0].file);
    if (/-theme$/.test(id)) out[id] = { kind: "music", bus: "music", note: `redo3 (${ex.exportedAt})`, takes: [THEME3_FIX[f] ? { file: f, ...THEME3_FIX[f] } : f] };
    else out[id] = { kind: "bed", bus: "amb", note: `redo3 (${ex.exportedAt})`, takes: [f] };
  }
  out._about += ` Redo3: ${Object.keys(ex.sounds).filter((k) => ex.sounds[k].picked?.length).join(", ")} from ${path.basename(redo3Arg)}.`;
}
await writeFile(path.join(ROOT, "scripts/sfx/picks.json"), JSON.stringify(out, null, 2) + "\n");
const n = Object.keys(out).filter((k) => !k.startsWith("_")).length;
console.log(`picks.json: ${n} sounds (${source})`);
