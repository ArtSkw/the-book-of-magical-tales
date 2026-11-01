#!/usr/bin/env node
// The listening sheet for "Leśna przysięga" (review.html?sheet=forest): every take of the manifest set
// `forest`, raw and level-matched, labelled by prompt and model, nothing pre-starred. Beside the themes,
// for comparison, the shipped themes of the other tales and the harp of the choices (all in D).
// A standalone builder (sheets.mjs builds the older sheets and needs their raw takes, which live
// elsewhere). Measured and flagged like redo 4: themes their key and the notes they end on, beds their
// steady tones, how far they must be raised and how uneven they are, one-shots their length and ends.
//
//   node scripts/sfx/sheet-forest.mjs      then: npm run sfx:review, open scripts/sfx/review.html?sheet=forest
import { readFile, writeFile, mkdir, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { ROOT, RAW, SFX, analyse, readPcm, loudness, tonalPeaks, keyOf, ff } from "./lib.mjs";

const manifest = JSON.parse(await readFile(path.join(ROOT, "scripts/sfx/manifest.json"), "utf8"));
const byId = new Map(manifest.sounds.map((s) => [s.id, s]));
const MODEL = { "sfx-v2": "v2", "sfx-v3": "v3", "music-v2": "Music v2", "music-v2-5": "Music v2.5" };
const SHIPPED = path.join(ROOT, "public/assets/book3d/sound");

function peaksOf(abs, bins = 240) {
  const { mono } = readPcm(abs);
  const step = mono.length / bins, out = [];
  for (let b = 0; b < bins; b++) {
    let p = 0;
    for (let i = Math.floor(b * step); i < Math.min(mono.length, Math.floor((b + 1) * step)); i++) p = Math.max(p, Math.abs(mono[i]));
    out.push(Math.round(p * 1000));
  }
  return out;
}
const PL = (k = "") => k.replace(/^([A-G]#?) major$/, (_, n) => `${n.replace("#", "♯")}-dur`).replace(/^([A-G]#?) minor$/, (_, n) => `${n.toLowerCase().replace("#", "♯")}-moll`);
const num = (v) => String(v).replace(".", ",");

function themeFlags(abs, m) {
  const K = keyOf(abs), warn = [], good = [], info = [];
  if (/^D (major|minor)$/.test(K.key)) good.push(PL(K.key)); else warn.push(`${PL(K.key)}: nie na D`);
  const fin = K.final.split(" ");
  (fin.includes("D") ? good : warn).push(`na końcu: ${fin.map((n) => n.replace("#", "♯")).join(", ")}${fin.includes("D") ? "" : " (bez D)"}`);
  if (m.endDb > -45) warn.push("nie wybrzmiewa do końca"); else good.push("wybrzmiewa do ciszy");
  if (m.M < -26) info.push(`ciche nagranie: w książce +${Math.round(-20 - m.M)} dB`);
  if (m.clipped > 10) warn.push("przester");
  return { warn, good, info };
}
function bedFlags(abs, m) {
  const warn = [], good = [], info = [];
  const tmp = path.join(SFX, "forest-cut.wav");
  ff("-i", abs, "-af", "aresample=48000,highpass=f=150,highpass=f=150", "-c:a", "pcm_f32le", tmp);
  const raise = -24 - loudness(tmp).I;
  const tones = tonalPeaks(abs, { minProm: 12 }), faint = tonalPeaks(abs, { minProm: 9.5 });
  if (tones.length) warn.push(`stały ton ${tones.slice(0, 3).map((x) => `${Math.round(x)} Hz`).join(", ")}`);
  else if (faint.length) warn.push(`słaby stały ton ${faint.slice(0, 3).map((x) => `${Math.round(x)} Hz`).join(", ")}`);
  else good.push("bez stałych tonów");
  if (raise > 18) warn.push(`za ciche: trzeba +${Math.round(raise)} dB`); else good.push(`głośność w normie (+${Math.max(0, Math.round(raise))} dB)`);
  if (m.LRA > 8) warn.push(`nierówna głośność (LRA ${Math.round(m.LRA)})`);
  if (m.M - m.I > 8) info.push(`zdarzenia do +${Math.round(m.M - m.I)} dB nad tłem`);
  if (m.clipped > 10) warn.push("przester");
  return { warn, good, info };
}
function shotFlags(abs, m) {
  const warn = [], good = [], info = [`${num(m.activeSec)} s dźwięku`];
  if (m.leadMs > 400) info.push(`cisza na początku ${num((m.leadMs / 1000).toFixed(1))} s (przytnę)`);
  if (m.endDb > -40) warn.push("urywa się na końcu"); else good.push("wybrzmiewa do ciszy");
  if (m.clipped > 10) warn.push("przester");
  if (m.onsets > 14 || m.onsetRate) info.push("dużo zdarzeń");
  return { warn, good, info };
}

async function takesOf(id) {
  const dir = path.join(RAW, id);
  if (!existsSync(dir)) return [];
  const out = [];
  for (const f of (await readdir(dir)).filter((f) => f.endsWith(".json")).sort()) {
    const side = JSON.parse(await readFile(path.join(dir, f), "utf8"));
    out.push({ rel: `raw/${id}/${side.file}`, tag: side.tag, take: side.take, credits: Number(side.response?.headers?.["character-cost"] || 0) || null });
  }
  return out;
}
function measured(abs, rel, sound, flags) {
  const m = analyse(abs, { loop: Boolean(sound.loop) });
  const { warn, good, info } = flags(abs, m);
  return { file: rel, dur: m.dur, M: m.M, I: m.I, TP: m.TP, peaks: peaksOf(abs), warn, good, info, recommended: false };
}
// the takes of one or more prompt ids (A, B, C) for a ship id
async function takesFor(ids, flags) {
  const out = [];
  for (const [k, id] of ids.entries()) {
    const sound = byId.get(id);
    for (const t of await takesOf(id)) {
      const letter = ids.length > 1 ? `${ids[k].match(/-([a-d])$/)?.[1]?.toUpperCase() || "ABCD"[k]} · ` : "";
      out.push({ ...measured(path.join(SFX, t.rel), t.rel, sound, flags), tag: t.tag, take: t.take, role: id, label: `${letter}${MODEL[t.tag] || t.tag} t${t.take}`, credits: t.credits });
    }
  }
  return out;
}
// a shipped file of another tale, for comparison (served from public/, so the path climbs out of local-assets/sfx)
function ref(shippedRel, label, role, flags) {
  const abs = path.join(SHIPPED, `${shippedRel}.m4a`);
  if (!existsSync(abs)) return null;
  return { ...measured(abs, `../../assets/book3d/sound/${shippedRel}.m4a`, {}, flags), role, label, tag: "" };
}
const prompts = (ids) => ids.map((id, k) => `${ids.length > 1 ? `${ids[k].match(/-([a-d])$/)?.[1]?.toUpperCase() || "ABCD"[k]}: ` : ""}${byId.get(id)?.text}`).join("  ·  ");

const themeItem = async (id, label, where, ids, refs) => ({
  id, label, where, ship: 1, kind: "music", lengthMs: byId.get(ids[0]).lengthMs, prompt: prompts(ids), tools: [],
  takes: [...(await takesFor(ids, themeFlags)), ...refs.map(([f, l, r]) => ref(f, l, r, themeFlags))].filter(Boolean),
});
const bedItem = async (id, label, where) => {
  const ids = ["a", "b", "c", "d"].map((k) => `${id}-${k}`).filter((x) => byId.has(x));
  return { id, label, where, ship: 1, kind: "sfx", loop: true, tools: ["loop"], prompt: prompts(ids), seconds: byId.get(ids[0]).seconds, takes: await takesFor(ids, bedFlags) };
};
const shotItem = async (id, label, where, ship = 1, ids = [id]) => ({
  id, label, where, ship, kind: "sfx", tools: [], prompt: prompts(ids), seconds: byId.get(ids[0]).seconds, takes: await takesFor(ids, shotFlags),
});

const sheet = {
  name: "forest", title: "Odsłuch: Leśna przysięga",
  intro: "Dźwięki trzeciej baśni: dwa motywy, cztery tła (od mgły przed świtem do złotego południa) i dźwięki punktowe stron. Wszystkie nagrania surowe, tylko wyrównane głośnością; etykieta mówi, z którego opisu (A, B, C; pełne opisy pod „Prompt”) i z którego modelu. Przy motywach dla porównania motywy dwóch pierwszych baśni i harfa z wyborów (wszystko w D). Pod każdą wersją pomiary. Nic nie jest zaznaczone: wybierz do każdego dźwięku jedną wersję (przy prosiaczkach możesz dwie, będą grały na zmianę) i pobierz wybory. Tła grają w pętli; sprawdź „Szew pętli” i „Pod moim głosem”.",
  base: "", showModels: true, context: {},
  sections: [
    { title: "Motywy", groups: [{ items: [
      await themeItem("forest-intro-theme", "Motyw otwarcia (strona tytułowa)", "Mgła przed świtem: wolno, cicho, tajemniczo, jak las czekający na poranek. Ludowo (drewniany flet, lutnia, fidel, lira korbowa), bez harfy, na D (dorycki lub moll), z otwartym akordem D na końcu. Około 16 s.",
        ["forest-intro-a", "forest-intro-b", "forest-intro-c"], [["music/bell-intro-theme", "Dzwon: otwarcie (dla porównania)", "ref"], ["music/dragon-intro-theme", "Smok: otwarcie (dla porównania)", "ref"], ["core/choice-motif-1", "Harfa z wyborów (D)", "ref-harp"]]),
      await themeItem("forest-ending-theme", "Motyw zakończenia (ostatnia strona)", "Słońce w południe: te same instrumenty, ciepło w D-dur, czule i z nadzieją, z akordem D, który wybrzmiewa do ciszy. Około 14 s.",
        ["forest-ending-a", "forest-ending-b", "forest-ending-c"], [["music/bell-ending-theme", "Dzwon: zakończenie (dla porównania)", "ref"], ["music/dragon-ending-theme", "Smok: zakończenie (dla porównania)", "ref"]]),
    ] }] },
    { title: "Tła", groups: [{ items: [
      await bedItem("fo-bed-mist", "Las we mgle przed świtem (strony 1–3)", "Gęsta, nieruchoma mgła: krople z liści, cisza, jeden daleki ptak."),
      await bedItem("fo-bed-dawn", "Świt, mgła się przerzedza (strony 4–6)", "Szron, pierwsze rudziki i kos, chłodny powiew."),
      await bedItem("fo-bed-morning", "Las późnym rankiem (strony 7–8)", "Rzadka mgła, więcej ptaków, daleki dzięcioł, liście dębów."),
      await bedItem("fo-bed-noon", "Las w słońcu w południe (strony 9–10)", "Złote południe po mgle: wiele ptaków, ciepły wiatr w liściach, radośnie, ale spokojnie."),
    ] }] },
    { title: "Dźwięki stron", groups: [{ items: [
      await shotItem("fo-piglets-trot", "Prosiaczki truchtają przez liście", "Strona 1; strona 3 (za prosiaczkami)."),
      await shotItem("fo-piglets", "Prosiaczki węszą i pochrząkują", "Strony 2, 4, 6; strona 3 (wołanie) i 5 (ślady).", 2),
      await shotItem("fo-gate-lift", "Stara furtka podniesiona z trawy", "Strona 5 (oba warianty)."),
      await shotItem("fo-chisel", "Młotek i dłutko w drewnie", "Strona 7 (worek)."),
      await shotItem("fo-acorns", "Żołędzie sypią się na mech", "Strona 7 (oba warianty)."),
      await shotItem("fo-munch", "Prosiaczki chrupią bukiew", "Strona 7 (żołędzie w całym lesie)."),
      await shotItem("fo-stag", "Jeleń parska spokojnie", "Strona 8; strona 9 (łania poprowadzi); strona 10."),
      await shotItem("fo-fawn", "Jelonek cicho popiskuje", "Strona 8; strona 9 (Koniczynka odciąga gałąź); strona 10."),
      await shotItem("fo-hooves", "Jelenie stąpają po liściach", "Strona 9 (łania poprowadzi)."),
      await shotItem("fo-branch", "Konar odciągnięty na linie", "Strona 9 (Koniczynka odciąga gałąź)."),
    ] }] },
  ],
};
// the second round (2026-11-01): the two sounds the author rejected, new prompts B and C, both models
const redo = {
  name: "forest2", title: "Odsłuch: Leśna przysięga, poprawki",
  intro: "Nowe nagrania dwóch dźwięków, które odrzuciłeś: truchtające prosiaczki (w poprzednich słychać było ryk) i jelonek (poprzednie brzmiały sztucznie). Nowe opisy B i C, każdy w modelu v2 i v3, po dwie wersje. Wybierz po jednej i pobierz wybory. Jeśli i tu nic nie pasuje, ten dźwięk po prostu pominiemy: strona zagra wtedy samo tło.",
  base: "", showModels: true, context: {},
  sections: [{ title: "Poprawki", groups: [{ items: [
    await shotItem("fo-piglets-trot", "Prosiaczki truchtają przez liście", "Strona 1; strona 3 (za prosiaczkami). Odrzucone: „słychać ryk lub wark”.", 1, ["fo-piglets-trot-b", "fo-piglets-trot-c"]),
    await shotItem("fo-fawn", "Jelonek woła mamę", "Strona 8; strona 9 (Koniczynka odciąga gałąź); strona 10. Odrzucone: „zbyt syntetyczne”.", 1, ["fo-fawn-b", "fo-fawn-c"]),
  ] }] }],
};
await mkdir(path.join(SFX, "sheets"), { recursive: true });
await writeFile(path.join(SFX, "sheets/forest2.json"), JSON.stringify({ ...redo, builtAt: new Date().toISOString() }));
await writeFile(path.join(SFX, "sheets/forest.json"), JSON.stringify({ ...sheet, builtAt: new Date().toISOString() }));
console.log(sheet.sections.flatMap((s) => s.groups[0].items).map((it) => `${it.id} ${it.takes.length}`).join(", "));
