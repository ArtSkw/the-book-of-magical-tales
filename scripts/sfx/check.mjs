#!/usr/bin/env node
// Checks what the book ships: every sound of a turning page (lib.mjs TURN_FAMILY) is decoded from
// its shipped .webm and measured for a low-frequency thump (lowBand), and every bed for how far its
// take had to be raised (BED_MAX_RAISE: a near-silent take raised further is heard as distortion);
// anything over the limits fails the check (exit 1). Run after mastering: npm run sfx:check
import path from "node:path";
import { ROOT, RAW, SFX, ff, loudness, lowBand, THUMP, TURN_FAMILY, BED_MAX_RAISE } from "./lib.mjs";
const { sounds } = await import(path.join(ROOT, "src/book/sounds.js"));
let bad = 0, n = 0;
for (const id of TURN_FAMILY) {
  for (const v of sounds[id]?.variants || []) {
    const lf = lowBand(path.join(ROOT, "public/assets/book3d/sound", `${v.file}.webm`));
    n++;
    if (lf.thump) bad++;
    console.log(`${lf.thump ? "THUMP" : "ok   "} ${v.file.padEnd(26)} ${String(Math.round(lf.share * 100)).padStart(3)}% below 200 Hz, loudest low 10 ms ${lf.vsFull} dB${v.from ? `  (${v.from})` : ""}`);
  }
}
console.log(`${n} turn sounds, ${bad} thumping (limits: ${THUMP.share * 100}% below 200 Hz, ${THUMP.vsFull} dB)`);
// every bed: how far its take had to be raised to the bed level (after the rumble cut)
let badBeds = 0;
for (const [id, e] of Object.entries(sounds)) {
  if (e.kind !== "bed") continue;
  for (const v of e.variants) {
    const tmp = path.join(SFX, "check-bed.wav");
    ff("-i", path.join(RAW, v.from), "-af", "aresample=48000,highpass=f=150,highpass=f=150", "-c:a", "pcm_f32le", tmp);
    const raise = +(-24 - loudness(tmp).I).toFixed(1);
    // the policy: never raised past the guard; a take that needed more ships capped (quieter), which is fine
    const over = raise > BED_MAX_RAISE && !v.capped;
    if (over) badBeds++;
    console.log(`${over ? "RAISED" : "ok    "} ${v.file.padEnd(32)} needed ${raise} dB${v.capped ? `, raised ${BED_MAX_RAISE} (capped: ${v.capped} dB quieter)` : ""} (limit ${BED_MAX_RAISE})  (${v.from})`);
  }
}
process.exit(bad || badBeds ? 1 : 0);
