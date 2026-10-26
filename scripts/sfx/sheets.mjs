#!/usr/bin/env node
// Builds the listening sheets that scripts/sfx/review.html shows (?sheet=library | motif | phase0):
// every take analysed (lib.mjs analyse, cached in local-assets/sfx/analysis.json), a suggested pick
// pre-starred per sound (technical checks only: clean start, natural end, no clipping, steady beds,
// pitch in D for the musical sounds; nobody has listened to them), and the choice-motif candidates
// re-pitched to D (and to F#, A for the "four choices of a tale" set) as previews.
//
//   node scripts/sfx/sheets.mjs        then open review.html?sheet=library (or motif, phase0)
import { readFile, writeFile, mkdir, readdir } from "node:fs/promises";
import { existsSync, statSync } from "node:fs";
import path from "node:path";
import { ROOT, RAW, SFX, analyse, readPcm, shiftTo, noteName, oneshot, bed, tonalPeaks, ff, loudness, keyOf } from "./lib.mjs";
import { REDO } from "./redo.mjs";
import { storyTranslations } from "../../locales.js";

const SHEETS = path.join(SFX, "sheets");
const PREVIEW = path.join(SFX, "preview");
const manifest = JSON.parse(await readFile(path.join(ROOT, "scripts/sfx/manifest.json"), "utf8"));
const byId = new Map(manifest.sounds.map((s) => [s.id, s]));
const phase0 = existsSync(path.join(ROOT, "scripts/sfx/picks-faza0.json")) ? JSON.parse(await readFile(path.join(ROOT, "scripts/sfx/picks-faza0.json"), "utf8")) : { sounds: {} };
// (the phase-0 export names files relative to raw/)
const userPicked = new Set(Object.values(phase0.sounds).flatMap((s) => s.picked.map((p) => (p.file.startsWith("raw/") ? p.file : `raw/${p.file}`))));

const TONAL = new Set(["choice-motif", "harp-pluck", "mh-bell", "mh-bronze", "mh-hum", "gilt-glint", "choice-motif-music", "motif-end"]);
const SINGLE = new Set(["seal-press", "ui-tap", "ui-slide", "clasp", "cover-land", "db-scale", "page-settle"]);
const SLICE = new Set(["riffle", "candle-sputter"]);
const D_MAJOR = [2, 4, 6, 7, 9, 11, 1];

// ---------------------------------------------------------------- takes + analysis (cached)
const cacheFile = path.join(SFX, "analysis.json");
const cache = existsSync(cacheFile) ? JSON.parse(await readFile(cacheFile, "utf8")) : {};
async function takesOf(id) {
  const dir = path.join(RAW, id);
  if (!existsSync(dir)) return [];
  const out = [];
  for (const f of (await readdir(dir)).filter((f) => f.endsWith(".json")).sort()) {
    const side = JSON.parse(await readFile(path.join(dir, f), "utf8"));
    out.push({ file: `raw/${id}/${side.file}`, tag: side.tag, model: side.model, take: side.take, credits: Number(side.response?.headers?.["character-cost"] || 0) || null, m: metricsOf(`raw/${id}/${side.file}`, byId.get(id)) });
  }
  return out;
}
function metricsOf(rel, sound = {}) {
  const abs = path.join(SFX, rel);
  const st = statSync(abs);
  const key = `${rel}|${st.size}|${Math.round(st.mtimeMs)}`;
  if (cache[rel]?.key === key) return cache[rel].m;
  const m = analyse(abs, { tonal: TONAL.has(sound.id), loop: Boolean(sound.loop) });
  m.peaks = peaksOf(abs);
  if (m.onsets.length > 14) { m.onsetRate = +(m.onsets.length / m.dur).toFixed(1); m.onsets = m.onsets.length; }
  cache[rel] = { key, m };
  return m;
}
function peaksOf(abs, bins = 240) {
  const { mono } = readPcm(abs);
  const step = mono.length / bins;
  const out = [];
  for (let b = 0; b < bins; b++) {
    let p = 0;
    for (let i = Math.floor(b * step); i < Math.min(mono.length, Math.floor((b + 1) * step)); i++) p = Math.max(p, Math.abs(mono[i]));
    out.push(Math.round(p * 1000));
  }
  return out;
}

// ---------------------------------------------------------------- a technical score and its reasons
const cls = (s) => (s.loop ? "bed" : s.kind === "music" ? "music" : TONAL.has(s.id) ? "tonal" : SINGLE.has(s.id) ? "single" : SLICE.has(s.id) ? "slice" : "oneshot");
function judge(s, m) {
  const c = cls(s);
  const want = s.kind === "music" ? s.lengthMs / 1000 : s.seconds;
  let score = 10;
  const warn = [], good = [];
  if (m.clipped > 0) { score -= 3; warn.push("przester"); }
  if (c !== "bed") {
    // mastering trims a silent lead-in, so it only costs a little (a long one hints at a hesitant take)
    if (m.leadMs > 80) { score -= Math.min(1, (m.leadMs - 80) / 300); warn.push(`cisza na początku ${(m.leadMs / 1000).toFixed(2).replace(".", ",")} s (do przycięcia)`); }
    if (m.endDb > -30) { score -= c === "tonal" || c === "music" ? 3 : 2; warn.push("ucięty koniec"); } else if (m.endDb < -45) good.push("naturalne wybrzmienie");
    if (m.activeSec < 0.35 * want && c !== "single") { score -= 1.5; warn.push("bardzo krótki"); }
    // the quietest tenth of the file is still loud: a sound that never pauses (or a hiss under it)
    if (m.floorDb > -35) { score -= 0.5; warn.push("szeleści bez przerwy"); }
  }
  if (c === "single") {
    const n = Array.isArray(m.onsets) ? m.onsets.length : m.onsets;
    if (n > 3) { score -= 0.5 * (n - 3); warn.push(`${n} uderzeń`); } else good.push("jedno zdarzenie");
  }
  if (c === "slice" && (Array.isArray(m.onsets) ? m.onsets.length : m.onsets) < 5) { score -= 2; warn.push("mało kartek do wycięcia"); }
  if (c === "bed") {
    const spike = m.M - m.I;
    if (spike > 6) { score -= spike - 6; warn.push(`wyraźne zdarzenia w tle (+${spike.toFixed(0)} dB)`); } else good.push("równe tło");
    if (m.LRA > 6) { score -= (m.LRA - 6) / 2; warn.push("nierówna głośność"); }
    if (m.seam > 5) { score -= 0.5; warn.push("szew pętli do sprawdzenia"); }
    if (m.widthDb < -25) { score -= 0.5; warn.push("prawie mono"); }
  }
  if (c === "tonal" && s.id !== "motif-end") {
    const p = m.pitch;
    if (!p) { score -= 2; warn.push("brak wyraźnej wysokości"); }
    else {
      const inKey = D_MAJOR.includes(p.pc);
      if (!inKey) { score -= 1.5; warn.push(`${p.name} poza D-dur`); }
      score -= Math.abs(p.cents) / 25;
      if (["choice-motif", "mh-bell", "mh-hum"].includes(s.id) && ![2, 9, 6].includes(p.pc)) score -= 1;
      if (p.clarity < 0.9) { score -= 1; warn.push("niewyraźna wysokość"); }
      if (inKey) good.push(`${p.name} ${p.cents >= 0 ? "+" : "−"}${Math.abs(p.cents)} c`);
    }
  }
  if (!warn.length && !good.length) good.push("bez zastrzeżeń");
  return { score: +score.toFixed(2), warn, good };
}

// ---------------------------------------------------------------- where each sound plays
const pl = (tale) => storyTranslations.pl[tale];
const { stories } = await import("../../stories.js");
const storyChoiceIds = Object.fromEntries(stories.map((s) => [s.id, Object.fromEntries(s.pages.map((p, i) => [i + 1, (p.choices || []).map((c) => c.id)]))]));
const choiceLabel = (tale, n, id) => pl(tale).pages[n - 1].choices?.[storyChoiceIds[tale][n].indexOf(id)]?.label || id;
const page = (tale, n) => `Strona ${n}: ${pl(tale).pages[n - 1].title}`;
const after = (tale, n, id) => `${page(tale, n + 1)}, po wyborze „${choiceLabel(tale, n, id)}”`;
const DB = "dragon-bridge", MH = "moonhill-bell";

// [id, where (pl), how many the book ships]
const LIBRARY = [
  { title: "Książka: strony, wybory, przyciski", groups: [
    { title: "Przewracanie stron", items: [
      ["page-turn-a", "Każde przewrócenie strony, w przód i w tył (6 wersji na zmianę z trzech promptów)", 2],
      ["page-turn-b", "Jak wyżej: druga barwa pergaminu", 2],
      ["page-turn-c", "Jak wyżej: trzecia barwa", 2],
      ["page-settle", "Zmiana strony przy ograniczonym ruchu (strona przenika, nie przewraca się)", 3],
      ["page-held", "Próba przewrócenia przed wyborem: róg strony unosi się i opada", 3],
      ["riffle", "Zmiana opowieści wstążką: z tych nagrań wytniemy pojedyncze kartki", 2],
      ["riffle-land", "Zmiana opowieści: ostatnia kartka opada", 2],
      ["ribbon-silk", "Dotknięcie wstążki", 3],
    ] },
    { title: "Wybór", note: "Po kolei: pieczęć, dopisana odpowiedź, muzyczny gest. Zestaw czterech gestów jest w osobnym arkuszu (link u góry).", items: [
      ["seal-press", "Pieczęć przy wyborze", 4],
      ["quill-line", "Odpowiedź dopisuje się piórem pod pieczęcią", 3],
      ["choice-motif", "Muzyczny gest po pieczęci (wybór zestawu: arkusz motywu)", 4],
      ["gilt-glint", "Opcjonalna złota warstwa pod wyborem", 1],
    ] },
    { title: "Przyciski, język, początek i koniec", items: [
      ["quill-rewrite", "Zmiana języka PL/EN: tekst przepisuje się piórem", 3],
      ["ui-slide", "Przełącznik PL/EN", 2],
      ["ui-tap", "Przyciski na tabliczkach, włącznik dźwięku", 4],
      ["clasp", "Klamra „Zacznij od nowa” na ostatniej stronie", 2],
      ["pages-return", "Powrót na początek opowieści", 2],
      ["cover-open", "Otwarcie księgi po dotknięciu", 1],
      ["cover-land", "Okładka opada na biurko", 2],
    ] },
  ] },
  { title: "Pokój przy świecy", groups: [
    { items: [["room-hearth", "Zawsze pod spodem, bardzo cicho, od pierwszego dotknięcia (zastępuje pierwsze tło pokoju: wyszło prawie ciche)", 1], ["candle-sputter", "Losowo co 25–70 s (wytniemy pojedyncze trzaski)", 1]] },
  ] },
  { title: pl(DB).title, groups: [
    { title: "Strona tytułowa", items: [["db-breath-sleep", `Strona tytułowa; też ${after(DB, 8, "wave-goodnight")} i strona 10`, 2]] },
    { title: "Strony 1–3: wczesny wieczór", items: [
      ["db-bed-evening", "Tło stron 1–3", 1], ["db-huff", page(DB, 1), 1], ["db-sigh", page(DB, 2), 1],
      ["db-stone", after(DB, 2, "ask"), 1], ["db-peeps", after(DB, 2, "listen"), 1],
    ] },
    { title: "Strony 4–7: mglisty zmierzch", items: [
      ["db-bed-dusk", "Tło stron 4–7", 1], ["db-lantern", page(DB, 4), 1],
      ["db-steps", after(DB, 4, "lantern"), 1], ["db-mice", after(DB, 4, "bread"), 1], ["db-pennant", `${page(DB, 5)} (po obu wyborach)`, 1],
      ["db-cradle", page(DB, 6), 1], ["db-nibble", after(DB, 6, "crumbs"), 1], ["db-warm-breath", after(DB, 6, "warm-path"), 1],
    ] },
    { title: "Strona 8: późny zmierzch", items: [["db-bed-deepdusk", "Tło strony 8", 1], ["db-walk-away", page(DB, 8), 1]] },
    { title: "Strony 9–10: noc", items: [
      ["db-bed-night", "Tło stron 9–10", 1], ["db-owl", "Losowo w nocnym tle, rzadko (co 2–4 min)", 1],
      ["db-scale", after(DB, 8, "name-promise"), 1], ["db-tiptoe", after(DB, 8, "wave-goodnight"), 1],
    ] },
  ] },
  { title: pl(MH).title, groups: [
    { title: "Strona tytułowa", items: [["mh-finch", "Strona tytułowa; też losowo w wieczornym sadzie", 2]] },
    { title: "Strony 1–2: plac, wieczór", items: [["mh-bed-square-evening", "Tło stron 1–2", 1], ["mh-mare", page(MH, 1), 1], ["mh-keys", page(MH, 2), 1]] },
    { title: "Strona 3: sad, wieczór", items: [["mh-bed-orchard-evening", "Tło strony 3", 1], ["mh-hooves", after(MH, 2, "follow-clover"), 1], ["mh-stick", after(MH, 2, "ask-elders"), 1]] },
    { title: "Strony 4–5: sad o zmierzchu", items: [["mh-bed-orchard-dusk", "Tło stron 4–5", 1], ["mh-ladder", page(MH, 4), 1], ["mh-rope", `${page(MH, 5)} (po obu wyborach)`, 1]] },
    { title: "Strony 6–7: w dzwonnicy", items: [["mh-bed-tower", "Tło stron 6–7", 1], ["mh-bronze", `${page(MH, 6)}; też ${after(MH, 6, "thank-bell")}`, 1], ["mh-rivets", after(MH, 6, "invite-smith"), 1]] },
    { title: "Strony 8–10: noc", note: "Dzwon odzywa się dopiero na stronie 9, jak w opowieści.", items: [
      ["mh-bed-night", "Tło stron 8–10", 1], ["mh-finch-stir", page(MH, 8), 1],
      ["mh-bell", `${after(MH, 8, "ring-gently")}; na stronie 10 z tego samego nagrania zrobimy dzwon z oddali`, 2],
      ["mh-hum", `${after(MH, 8, "share-song")} (razem z dzwonem)`, 1], ["mh-chicks", `Strona 10, po wyborze „${choiceLabel(MH, 8, "share-song")}”`, 1],
    ] },
  ] },
  { title: "Muzyka", groups: [{ items: [["motif-end", "Ostatnia strona obu opowieści, po dźwięku strony; cytuje motyw wyboru (D–F♯–A)", 1]] }] },
];

const HINT = {
  "page-turn-a": "Ok. 1 s: uniesienie, szum powietrza, miękkie opadnięcie. Gruby pergamin.",
  "seal-press": "Miękkie wciśnięcie ciepłego wosku, ok. 0,4 s. Bez metalicznego stuku.",
  "choice-motif": "Wybierz tu ulubione pojedyncze szarpnięcia; zestaw czterech, nastrojonych do D, porównasz w arkuszu motywu.",
  riffle: "Liczy się, żeby kartki były wyraźnie osobne: wytniemy z nich pojedyncze przerzucenia.",
  "room-hearth": "Ma być prawie niezauważalne: słychać je dopiero, gdy przestaniesz czytać. Sprawdź „Pod moim głosem”.",
  "mh-bell": "Najważniejszy dźwięk tej opowieści: łagodny, czysty, słodki, z długim wybrzmieniem.",
  "motif-end": "Kilkanaście sekund harfy w D; zagra cicho po ostatniej stronie. Porównaj z motywem wyboru w arkuszu motywu.",
};

// ---------------------------------------------------------------- build the library sheet
const takesById = {};
for (const s of manifest.sounds) takesById[s.id] = await takesOf(s.id);
let total = 0, credits = 0, missing = [];
function item([id, where, ship], extra = {}) {
  const s = byId.get(id);
  const takes = takesById[id].filter((t) => !(s.model && !extra.allModels && t.model !== s.model && !userPicked.has(t.file)) || extra.allModels);
  if (!takes.length) missing.push(id);
  const judged = takes.map((t) => ({ ...t, ...judge(s, t.m) }));
  // pre-star: the user's own phase-0 picks first, then the best scores
  const ranked = [...judged].sort((a, b) => (userPicked.has(b.file) - userPicked.has(a.file)) || b.score - a.score || a.take - b.take);
  const rec = new Set(ranked.slice(0, ship).map((t) => t.file));
  for (const t of judged) { total++; credits += t.credits || 0; }
  return {
    id, label: s.pl || id, where, ship, hint: HINT[id] || "", prompt: s.text, seconds: s.seconds, lengthMs: s.lengthMs, loop: Boolean(s.loop), kind: s.kind,
    model: s.model || manifest.defaults[s.kind].model,
    tools: [s.loop ? "loop" : null, ["choice-motif", "gilt-glint"].includes(id) ? "asChoice" : null].filter(Boolean),
    takes: judged.map((t) => ({
      file: t.file, tag: t.tag, take: t.take, credits: t.credits, dur: t.m.dur, M: t.m.M, I: t.m.I, TP: t.m.TP, peaks: t.m.peaks,
      pitch: t.m.pitch ? `${t.m.pitch.name} ${t.m.pitch.cents >= 0 ? "+" : "−"}${Math.abs(t.m.pitch.cents)} c` : null,
      recommended: rec.has(t.file), mine: userPicked.has(t.file), warn: t.warn, good: t.good, score: t.score,
    })),
    ...extra,
  };
}
const best = (id) => {
  const t = item([id, "", 1]).takes.find((x) => x.recommended);
  return t ? { file: t.file, M: t.M, I: t.I, TP: t.TP } : null;
};
const context = { seal: best("seal-press"), quill: best("quill-line") };
total = 0; credits = 0; missing = [];
const library = {
  name: "library", title: "Odsłuch: cała biblioteka dźwięków",
  intro: "Każdy dźwięk z kilkoma wersjami, po kolei: książka, pokój, potem obie opowieści strona po stronie. Gwiazdką zaznaczyłem wstępny wybór, ale tylko na podstawie pomiarów (czysty początek, naturalne wybrzmienie, brak przesteru, równe tło, wysokość w D), bez słuchania, więc decyzja jest twoja. Liczba „w książce” mówi, ile wersji jednego dźwięku zagra na zmianę. Głośność wersji jest wyrównana; tła grają tak, jak zagrają pod czytaniem (wyraźnie ciszej).",
  base: "", showModels: true, context,
  questions: [{ name: "beds", legend: "Tła pod czytaniem (pętle potoku, sadu, nocy)", options: [{ value: "keep", label: "zostawić, są dobre" }, { value: "quieter", label: "zostawić, ale ciszej" }, { value: "fewer", label: "tylko pokój i pojedyncze dźwięki stron" }] }],
  sections: LIBRARY.map((sec) => ({ title: sec.title, groups: sec.groups.map((g) => ({ title: g.title || null, note: g.note || null, items: g.items.map((it) => item(it)) })) })),
};
library.stats = { takes: total, credits, missing: [...new Set(missing)] };

// ---------------------------------------------------------------- the choice motif: candidates and two proposed sets
await mkdir(path.join(PREVIEW, "choice-motif"), { recursive: true });
const motif = byId.get("choice-motif");
const cands = takesById["choice-motif"].filter((t) => t.model === "eleven_text_to_sound_v3").map((t) => ({ ...t, ...judge(motif, t.m) }));
const PICK = "raw/choice-motif/choice-motif--sfx-v3-t02.wav";
const pick = cands.find((t) => t.file === PICK);
const register = pick?.m.pitch?.midi ?? 50;
function preview(t, pc, label) {
  const p = t.m.pitch;
  if (!p) return null;
  const semis = shiftTo(p.hz, pc);
  const rate = Math.pow(2, semis / 12);
  const name = `${path.basename(t.file, ".wav")}--${["C", "Cs", "D", "Ds", "E", "F", "Fs", "G", "Gs", "A", "As", "B"][pc]}.wav`;
  const rel = `preview/choice-motif/${name}`;
  const abs = path.join(SFX, rel);
  const src = path.join(SFX, t.file);
  if (!existsSync(abs) || statSync(abs).mtimeMs < statSync(src).mtimeMs) oneshot(src, abs, { mono: false, rate });
  const m = metricsOf(rel, { id: "choice-motif" });
  return { file: rel, tag: t.tag, take: t.take, dur: m.dur, M: m.M, I: m.I, TP: m.TP, peaks: m.peaks, pitch: `${noteName(p.midi + semis)} (z ${p.name} ${semis >= 0 ? "+" : "−"}${Math.abs(semis).toFixed(2).replace(".", ",")} półtonu)`, role: label, recommended: true, warn: Math.abs(semis) > 3 ? ["mocno przestrojony: przybliżenie"] : [], good: [], from: t.file, semis: +semis.toFixed(2) };
}
// candidates for V2-V4: good scores, in the register of the user's pick (within a fifth), not the pick
const others = cands.filter((t) => t.file !== PICK && t.m.pitch && Math.abs(t.m.pitch.midi - register) <= 7).sort((a, b) => b.score - a.score);
const setA = [pick, ...others.slice(0, 3)].filter(Boolean).map((t, i) => preview(t, 2, `W${i + 1} · D`));
// set B: the four choices of a tale climb the motif, D, F#, A, D (each from the take that needs the smallest shift)
const degrees = [[2, "D"], [6, "F♯"], [9, "A, niżej"], [2, "D"]];
const used = new Set([PICK]);
const setB = degrees.map(([pc, nm], i) => {
  if (i === 0) return preview(pick, 2, "W1 · D (wybór 1)");
  const t = [...others].filter((x) => !used.has(x.file)).sort((a, b) => Math.abs(shiftTo(a.m.pitch.hz, pc)) - Math.abs(shiftTo(b.m.pitch.hz, pc)) || b.score - a.score)[0];
  if (!t) return null;
  used.add(t.file);
  return preview(t, pc, `W${i + 1} · ${nm} (wybór ${i + 1})`);
}).filter(Boolean);
// the library card stars the same four as set 1
for (const sec of library.sections) for (const g of sec.groups) for (const it of g.items) if (it.id === "choice-motif") for (const t of it.takes) t.recommended = setA.some((a) => a.from === t.file);
const candItem = {
  id: "choice-motif", label: "Kandydaci (surowe nagrania v3)", where: "Wszystkie wersje motywu z modelu v3, bez strojenia. Gwiazdką: twój wybór z fazy 0 i trzy najlepsze technicznie.", ship: 4, kind: "sfx", prompt: motif.text, seconds: motif.seconds, tools: ["asChoice"],
  takes: cands.map((t) => ({ file: t.file, tag: t.tag, take: t.take, credits: t.credits, dur: t.m.dur, M: t.m.M, I: t.m.I, TP: t.m.TP, peaks: t.m.peaks, pitch: t.m.pitch ? `${t.m.pitch.name} ${t.m.pitch.cents >= 0 ? "+" : "−"}${Math.abs(t.m.pitch.cents)} c` : "brak wyraźnej wysokości", recommended: t.file === PICK || setA.some((a) => a.from === t.file), mine: t.file === PICK, warn: t.warn, good: t.good, score: t.score })),
};
const motifSheet = {
  name: "motif", title: "Odsłuch: motyw wyboru",
  intro: "Po pieczęci i dopisanej odpowiedzi zabrzmi krótki gest harfy, ok. 10 dB ciszej niż przewracana strona. Poniżej: wszyscy kandydaci, a potem dwa proponowane zestawy po cztery wersje, nastrojone dokładnie do D. W pierwszym zestawie każda wersja gra D, różnią się tylko gestem. W drugim cztery wybory jednej opowieści (strony 2, 4, 6, 8) układają się w D, F♯, niższe A i znów D, a motyw zakończenia może te nuty zacytować. „Zagraj zestaw” odtwarza cztery wersje po kolei; „Jak przy wyborze” poprzedza każdą pieczęcią i piórem.",
  base: "", showModels: true, context,
  questions: [{ name: "set", legend: "Który zestaw?", options: [{ value: "A", label: "wszystkie na D" }, { value: "B", label: "D, F♯, A, D: cztery wybory opowieści" }, { value: "mix", label: "inny układ (opisz w uwagach)" }] }],
  sections: [
    { title: "Kandydaci", groups: [{ items: [candItem] }] },
    { title: "Zestaw 1: wszystkie na D", groups: [{ items: [{ id: "set-a", label: "Cztery gesty, każdy dokładnie na D", where: "Na zmianę przy kolejnych wyborach.", ship: 4, kind: "sfx", tools: ["sequence", "asChoice"], takes: setA }] }] },
    { title: "Zestaw 2: D, F♯, A, D", groups: [{ items: [{ id: "set-b", label: "Cztery wybory opowieści: D, F♯, A, D", where: "Wybór na stronie 2 gra D, na 4 F♯, na 6 niższe A, na 8 znów D. To wersja próbna z przestrojonych nagrań (F♯ i A brzmią przez to nieco inaczej); jeśli wybierzesz ten zestaw, wygeneruję nagrania od razu na tych nutach.", ship: 4, kind: "sfx", tools: ["sequence", "asChoice"], takes: setB }] }] },
    { title: "Motyw zakończenia", groups: [{ items: [item(["motif-end", "Ostatnia strona; powinien brzmieć jak ten sam instrument i ta sama tonacja", 1])] }] },
  ],
};

// ---------------------------------------------------------------- redo: the sounds the user asked to change
// Each picked take raw, made gentler (what ships now) and gentler still; the rejected room bed as
// the hearth that replaces it, both takes, as they ship (no rumble, its faint machine-like tones notched).
await mkdir(path.join(PREVIEW, "redo"), { recursive: true });
const fresh = (abs, src) => existsSync(abs) && statSync(abs).mtimeMs > statSync(src).mtimeMs;
function redoTake(rawFile, role, label, make, extra = {}) {
  const rel = role === "raw" ? `raw/${rawFile}` : `preview/redo/${path.basename(rawFile, ".wav")}--${role}.wav`;
  const abs = path.join(SFX, rel);
  if (role !== "raw" && !fresh(abs, path.join(RAW, rawFile))) make(path.join(RAW, rawFile), abs);
  const m = metricsOf(rel, { id: "redo" });
  return { file: rel, role, label, tag: "sfx-v2", dur: m.dur, M: m.M, I: m.I, TP: m.TP, peaks: m.peaks, warn: [], good: [], ...extra };
}
const REDO_PICK = { "ribbon-silk": "ribbon-silk/ribbon-silk--sfx-v2-t01.wav", "quill-rewrite": "quill-rewrite/quill-rewrite--sfx-v2-t03.wav", "cover-open": "cover-open/cover-open--sfx-v2-t01.wav" };
const NOTE = { "ribbon-silk": "„Brzmi dość sztywno i sucho, powinien być bardziej miękki”", "quill-rewrite": "„Piękny, brzmi dość ostro i sucho. Mógłby być łagodniejszy”", "cover-open": "„Dość sucho brzmi, mógłby być łagodniejszy i subtelniejszy”" };
const redoItems = Object.entries(REDO_PICK).map(([id, file]) => ({
  id, label: byId.get(id).pl, where: `Twoja uwaga: ${NOTE[id]}. Ten sam wybrany przez ciebie take: bez zmian, łagodniej (wolniejszy atak, ciemniej${id === "quill-rewrite" ? ", przycięte syczenie" : ""}, odrobina małego pokoju, dłuższe wygaszenie) i jeszcze łagodniej.`, ship: 1, kind: "sfx", tools: [],
  takes: [
    redoTake(file, "raw", "Bez zmian", null),
    redoTake(file, "soft", "Łagodniej (gra teraz)", (src, dst) => oneshot(src, dst, { soft: REDO[id].soft }), { recommended: true }),
    redoTake(file, "softer", "Jeszcze łagodniej", (src, dst) => oneshot(src, dst, { soft: REDO[id].softer })),
  ],
}));
const room = {
  id: "room-bed", label: "Tło pokoju: kominek", loop: true, ship: 1, kind: "sfx", tools: ["loop"],
  where: "Twoja uwaga: pierwsze tło brzmiało jak buczenie urządzenia. Słusznie: miało w sobie ciche tony 50, 200, 250 i 400 Hz, a arkusz podgłaśniał je o ok. 40 dB. W jego miejsce kominek: ciche trzaski i żar, bez dudnienia (obcięte poniżej 150 Hz) i z wyciętymi tymi samymi tonami. Tak zabrzmi pod czytaniem, bardzo cicho; sprawdź „Pod moim głosem”.",
  takes: [
    redoTake("room-hearth/room-hearth--sfx-v2-t01.wav", "hearth-1", "Kominek, nagranie 1 (gra teraz)", (src, dst) => bed(src, dst, {}), { recommended: true }),
    redoTake("room-hearth/room-hearth--sfx-v2-t02.wav", "hearth-2", "Kominek, nagranie 2 (więcej trzasków)", (src, dst) => bed(src, dst, {})),
  ],
};
const redoSheet = {
  name: "redo", title: "Odsłuch: poprawki",
  intro: "Cztery dźwięki, o których zmianę prosiłeś. Wszystkie zrobione z twoich wybranych nagrań, bez generowania nowych. Gwiazdka przy wersji, która gra teraz w książce; zmień ją, jeśli wolisz inną, i pobierz wybory. Kominek gra w pętli, tak jak w książce.",
  base: "", showModels: false, context,
  sections: [{ title: "Do łagodniejszego brzmienia", groups: [{ items: redoItems }] }, { title: "Nowe tło pokoju", groups: [{ items: [room] }] }],
};

// ---------------------------------------------------------------- redo 2: new generations (2026-10-25)
// The user rejected the processed versions: these are new takes from new prompts (manifest *-r2a/b/c,
// set redo2), both models, played raw and only level-matched (no reverb, no pitch, no EQ). Nothing is
// pre-starred. A take that is clearly broken (clipped, near-silent, a bed carrying a steady tone, the
// machine-like whine the first room bed had) is left off the sheet and named in its card.
const R2 = {
  "ribbon-silk": { label: "Jedwabna wstążka (nowe nagrania)", where: "Wstążka przy zmianie opowieści i przy dotknięciu wstążki. Miękki, przewiewny, aksamitny szept jedwabiu; bez trzasku, plastiku i uderzenia papieru." },
  "quill-rewrite": { label: "Pióro: przepisanie strony (nowe nagrania)", where: "Zmiana języka PL/EN. Pióro na grubym pergaminie, kilka miękkich, wdzięcznych pociągnięć: ciepłe, pierzaste, delikatne, z odrobiną magii; nigdy ostre ani suche." },
  "cover-open": { label: "Okładka się otwiera (nowe nagrania)", where: "Otwarcie księgi po dotknięciu. Ciężka skórzana okładka otwierana powoli: miękka skóra, ciche ciepłe skrzypnięcie starego grzbietu, okładka osiada; subtelnie i kojąco." },
  "room-bed": { label: "Tło pokoju (nowe nagrania)", loop: true, where: "Zawsze pod spodem, bardzo cicho: przytulna średniowieczna komnata nocą, mały łagodny ogień, drobne trzaski, szum żaru; bez buczenia, dudnienia i wiatru. Gra w pętli; sprawdź „Szew pętli” i „Pod moim głosem”." },
};
const MODEL_PL = { "sfx-v2": "v2", "sfx-v3": "v3" };
const toneCache = (cache.__tones ||= {});
const redo2Items = [];
const dropped = {};
for (const [base, meta] of Object.entries(R2)) {
  const ids = ["a", "b", "c"].map((k) => `${base}-r2${k}`).filter((id) => byId.has(id));
  const takes = [];
  dropped[base] = [];
  for (const id of ids) {
    const letter = id.slice(-1).toUpperCase();
    const n = {};
    for (const t of await takesOf(id)) {
      const m = t.m;
      n[t.tag] = (n[t.tag] || 0) + 1;
      const label = `${letter} · ${MODEL_PL[t.tag] || t.tag} · ${n[t.tag]}`;
      const why = [];
      if (m.clipped > 10) why.push("przester");
      if ((meta.loop ? m.I : m.M) < -58) why.push("prawie cisza");
      let tones = [];
      if (meta.loop) {
        const key = `${t.file}|${m.dur}|${m.I}`;
        tones = toneCache[key] ||= tonalPeaks(path.join(SFX, t.file), { minProm: 12 });
        if (tones.length) why.push(`stały ton ${tones.slice(0, 4).map((f) => `${Math.round(f)} Hz`).join(", ")}`);
      }
      if (why.length) { dropped[base].push(`${label} (${why.join("; ")})`); continue; }
      const j = judge({ ...byId.get(id), loop: meta.loop }, m);
      if (meta.loop) {
        // tones too faint to drop the take for, named all the same
        const faint = (toneCache[`${t.file}|faint`] ||= tonalPeaks(path.join(SFX, t.file), { minProm: 9.5 }));
        if (faint.length) j.warn.push(`słaby stały ton ${faint.slice(0, 3).map((f) => `${Math.round(f)} Hz`).join(", ")}`);
        else j.good.push("bez stałych tonów");
      }
      takes.push({ file: t.file, tag: t.tag, take: t.take, role: id, label, credits: t.credits, dur: m.dur, M: m.M, I: m.I, TP: m.TP, peaks: m.peaks, warn: j.warn, good: j.good, recommended: false });
    }
  }
  const prompts = ids.map((id) => `${id.slice(-1).toUpperCase()}: ${byId.get(id).text}`).join("  ·  ");
  redo2Items.push({ id: base, label: meta.label, where: meta.where + (dropped[base].length ? ` Odrzucone automatycznie: ${dropped[base].join(", ")}.` : ""), ship: 1, kind: "sfx", loop: Boolean(meta.loop), tools: meta.loop ? ["loop"] : [], prompt: prompts, seconds: byId.get(ids[0])?.seconds, takes });
}
const redo2Sheet = {
  name: "redo2", title: "Odsłuch: nowe nagrania",
  intro: "Cztery dźwięki nagrane od nowa, z nowych opisów, w obu modelach (v2 i v3). Każda wersja jest surowa, tylko wyrównana głośnością: bez pogłosu, bez zmiany wysokości, bez korekcji. Etykieta mówi, z którego opisu (A, B, C; pełne opisy pod „Prompt”) i z którego modelu pochodzi. Nic nie jest zaznaczone: wybierz gwiazdką, co ci się podoba (jedną lub kilka wersji), i pobierz wybory. Do czasu wyboru w książce zostają obecne dźwięki.",
  base: "", showModels: true, context,
  sections: [{ title: "Nowe nagrania", groups: [{ items: redo2Items }] }],
};

// ---------------------------------------------------------------- themes: an opening and a closing one per tale
// Music API takes (manifest dragon-/bell-intro|ending-a|b, set themes), raw, only level-matched,
// labelled by prompt and model, nothing pre-starred. Their key and last chord are measured
// (local-assets/sfx/theme-keys.json) so a take that sits badly with the D harp of the choices shows.
const KEYS = existsSync(path.join(SFX, "theme-keys.json")) ? JSON.parse(await readFile(path.join(SFX, "theme-keys.json"), "utf8")) : {};
const KEY_PL = (k = "") => k.replace(/^([A-G]#?) major$/, (_, n) => `${n.replace("#", "♯")}-dur`).replace(/^([A-G]#?) minor$/, (_, n) => `${n.toLowerCase().replace("#", "♯")}-moll`);
const MUSIC = { "music-v2": "Music v2", "music-v2-5": "Music v2.5" };
const THEMES = {
  "dragon-intro-theme": { label: "Smok: motyw otwarcia (strona tytułowa)", want: "D", base: "dragon-intro" },
  "dragon-ending-theme": { label: "Smok: motyw zakończenia (ostatnia strona)", want: "D", base: "dragon-ending" },
  "bell-intro-theme": { label: "Dzwon: motyw otwarcia (strona tytułowa)", want: "G", base: "bell-intro" },
  "bell-ending-theme": { label: "Dzwon: motyw zakończenia (ostatnia strona)", want: "G", base: "bell-ending" },
};
const themeItems = [];
for (const [ship, meta] of Object.entries(THEMES)) {
  const takes = [];
  for (const k of ["a", "b"]) {
    const id = `${meta.base}-${k}`;
    if (!byId.has(id)) continue;
    for (const t of await takesOf(id)) {
      const m = t.m, K = KEYS[t.file] || {};
      const warn = [], good = [];
      if (/^C /.test(K.key || "")) warn.push(`${KEY_PL(K.key)}: z harfą w D mniej spokojnie`);
      else if (/minor/.test(K.key || "")) warn.push(`${KEY_PL(K.key)}: ciemniej, smutniej`);
      else if (K.key) good.push(KEY_PL(K.key));
      if (K.final) good.push(`ostatni akord ${K.final.replace(/#/g, "♯").split(" ").join("–")}`);
      if (m.endDb > -45) warn.push("nie wybrzmiewa do końca");
      takes.push({ file: t.file, tag: t.tag, take: t.take, role: id, label: `${k.toUpperCase()} · ${MUSIC[t.tag] || t.tag}`, dur: m.dur, M: m.M, I: m.I, TP: m.TP, peaks: m.peaks, warn, good, recommended: false });
    }
  }
  const prompts = ["a", "b"].map((k) => `${k.toUpperCase()}: ${byId.get(`${meta.base}-${k}`)?.text || ""}`).join("  ·  ");
  themeItems.push({ id: ship, label: meta.label, where: `${meta.want === "D" ? "Lutnia i flet prosty, D-dur" : "Harfa i smyczki (fidel), G-dur (z D w akordzie, jak harfa wyborów)"}. Dwa opisy (A, B), każdy w dwóch modelach muzyki.`, ship: 1, kind: "music", lengthMs: byId.get(`${meta.base}-a`)?.lengthMs, prompt: prompts, tools: [], takes });
}
const refTake = (file, label, id) => {
  const m = metricsOf(file, { id });
  return { file, label, tag: "", dur: m.dur, M: m.M, I: m.I, TP: m.TP, peaks: m.peaks, warn: [], good: [], recommended: false };
};
const themesSheet = {
  name: "themes", title: "Odsłuch: motywy opowieści",
  intro: "Każda opowieść dostaje dwa krótkie motywy: na otwarcie (strona tytułowa, ok. 12 s) i na zakończenie (ostatnia strona, ok. 14 s, z wybrzmiewającym akordem), spokrewnione ze sobą: smok lutnia i flet w D-dur, dzwon harfa i smyczki w G-dur. Wszystkie surowe, tylko wyrównane głośnością; etykieta mówi, z którego opisu (A, B) i z którego modelu. Nic nie jest zaznaczone: wybierz po jednym (lub kilka) do każdego i pobierz wybory. Na dole dla porównania: obecny wspólny motyw zakończenia i harfa z wyborów. Do czasu wyboru w książce gra obecny wspólny motyw.",
  base: "", showModels: true, context,
  sections: [
    { title: "Nowe motywy", groups: [{ items: themeItems }] },
    { title: "Dla porównania", groups: [{ items: [
      { id: "ref-motif-end", label: "Obecnie: wspólny motyw zakończenia (gra w obu opowieściach)", where: "To, co gra teraz na ostatniej stronie obu opowieści.", ship: 0, kind: "music", tools: [], takes: [refTake("raw/motif-end/motif-end--music-v2-t03.mp3", "Obecny", "motif-end")] },
      { id: "ref-choice-motif", label: "Harfa z wyborów (D)", where: "Motywy powinny z nią współbrzmieć.", ship: 0, kind: "sfx", tools: [], takes: [refTake("raw/choice-motif/choice-motif--sfx-v3-t02.wav", "Harfa", "choice-motif")] },
    ] }] },
  ],
};

// ---------------------------------------------------------------- redo 3: new beds for both tales, the Bell's folk themes
// New generations only (manifest *-r3a/b/c, set redo3), raw and level-matched, labelled by prompt
// and model, nothing pre-starred; beside them, for comparison, what the book plays now (and for the
// village square the two earlier takes that were not picked). Every take is measured and flagged,
// none hidden: a steady tone, how far it must be raised to the bed level (over 18 dB: too quiet,
// its own noise would show), clipping, a lot of rumble; for the themes the key and the last chord.
const r3cache = (cache.__r3 ||= {});
function bedFlags(rel) {
  const key = `${rel}|${statSync(path.join(SFX, rel)).size}`;
  if (!r3cache[key]) {
    const abs = path.join(SFX, rel), tmp = path.join(SFX, "r3-cut.wav");
    ff("-i", abs, "-af", "aresample=48000,highpass=f=150,highpass=f=150", "-c:a", "pcm_f32le", tmp);
    const raise = +(-24 - loudness(tmp).I).toFixed(1);
    r3cache[key] = { raise, tones: tonalPeaks(abs, { minProm: 12 }), faint: tonalPeaks(abs, { minProm: 9.5 }) };
  }
  const f = r3cache[key], m = metricsOf(rel, { id: "redo3-bed", loop: true });
  const warn = [], good = [];
  if (f.tones.length) warn.push(`stały ton ${f.tones.slice(0, 3).map((x) => `${Math.round(x)} Hz`).join(", ")}`);
  else if (f.faint.length) warn.push(`słaby stały ton ${f.faint.slice(0, 3).map((x) => `${Math.round(x)} Hz`).join(", ")}`);
  else good.push("bez stałych tonów");
  if (f.raise > 18) warn.push(`za ciche: trzeba +${Math.round(f.raise)} dB`);
  else good.push(`głośność w normie (+${Math.max(0, Math.round(f.raise))} dB)`);
  if (m.clipped > 10) warn.push("przester");
  return { m, warn, good };
}
function themeFlags(rel) {
  const key = `${rel}|key`;
  const K = (r3cache[key] ||= keyOf(path.join(SFX, rel)));
  const m = metricsOf(rel, { id: "redo3-theme" });
  const warn = [], good = [];
  const pl = K.key.replace(/^([A-G]#?) major$/, (_, n) => `${n.replace("#", "♯")}-dur`).replace(/^([A-G]#?) minor$/, (_, n) => `${n.toLowerCase().replace("#", "♯")}-moll`);
  if (/^(G|D) major$/.test(K.key)) good.push(pl); else warn.push(`${pl}: inna tonacja niż G/D-dur`);
  good.push(`ostatni akord ${K.final.replace(/#/g, "♯").split(" ").join("–")}`);
  if (m.endDb > -45) warn.push("nie wybrzmiewa do końca");
  if (m.clipped > 10) warn.push("przester");
  return { m, warn, good };
}
const MODEL3 = { "sfx-v2": "v2", "sfx-v3": "v3", "music-v2": "Music v2", "music-v2-5": "Music v2.5" };
async function newTakes(base, letters, flags) {
  const out = [];
  for (const k of letters) {
    const id = `${base}-r3${k}`;
    if (!byId.has(id)) continue;
    for (const t of await takesOf(id)) {
      const { m, warn, good } = flags(t.file);
      out.push({ file: t.file, tag: t.tag, take: t.take, role: id, label: `${k.toUpperCase()} · ${MODEL3[t.tag] || t.tag}`, credits: t.credits, dur: m.dur, M: m.M, I: m.I, TP: m.TP, peaks: m.peaks, warn, good, recommended: false });
    }
  }
  return out;
}
const refTake3 = (rel, label, flags) => {
  if (!existsSync(path.join(SFX, rel))) return null;
  const { m, warn, good } = flags(rel);
  return { file: rel, role: "ref", label, tag: "", dur: m.dur, M: m.M, I: m.I, TP: m.TP, peaks: m.peaks, warn, good, recommended: false };
};
const promptsOf = (base, letters) => letters.map((k) => byId.get(`${base}-r3${k}`) && `${k.toUpperCase()}: ${byId.get(`${base}-r3${k}`).text}`).filter(Boolean).join("  ·  ");
const shipFrom = (id) => (await_sounds[id]?.variants?.[0]?.from ? `raw/${await_sounds[id].variants[0].from}` : null);
const { sounds: await_sounds } = await import(path.join(ROOT, "src/book/sounds.js"));
async function bedItem(base, label, where, letters, refs = []) {
  const takes = [...(await newTakes(base, letters, bedFlags)), ...refs.map(([rel, l]) => rel && refTake3(rel, l, bedFlags)).filter(Boolean)];
  return { id: base, label, where, ship: 1, kind: "sfx", loop: true, tools: ["loop"], prompt: promptsOf(base, letters), seconds: byId.get(`${base}-r3${letters[0]}`)?.seconds, takes };
}
const NOW = "Obecnie w książce";
const redo3Sheet = {
  name: "redo3", title: "Odsłuch: nowe tła i motywy dzwonu",
  intro: "Nowe nagrania: tła obu opowieści i ludowe motywy dzwonu. Wszystkie surowe, tylko wyrównane głośnością; etykieta mówi, z którego opisu (A, B, C; pełne opisy pod „Prompt”) i z którego modelu. Obok, dla porównania, to, co gra teraz w książce. Pod każdą wersją pomiary: stały ton, czy nagranie nie jest za ciche (powyżej +18 dB jego własny szum zaczyna być słyszalny), przester; przy motywach tonacja i ostatni akord. Nic nie jest zaznaczone: wybierz po jednym (lub kilka) do każdego i pobierz wybory. Tła grają w pętli; sprawdź „Szew pętli” i „Pod moim głosem”.",
  base: "", showModels: true, context,
  sections: [
    { title: "Dzwon z Księżycowego Wzgórza: tła", groups: [{ items: [
      await bedItem("mh-bed-tower", "Wnętrze dzwonnicy nocą (strony 6–7)", "Stare belki skrzypią, przez okiennice wpada nocny wiatr; z placu świerszcze. Teraz w książce gra tu tło nocnej wioski (poprzednie tło dzwonnicy było za ciche i brzmiało jak przester).", ["a", "b"]),
      await bedItem("mh-bed-square-evening", "Plac na wzgórzu wieczorem (strony 1–2)", "Kury idą spać, jaskółki, drzwi, lekki wiatr. Dla porównania dwa wcześniejsze nagrania, których nie wybrałeś (są czyste), i obecne.", ["a", "b"], [["raw/mh-bed-square-evening/mh-bed-square-evening--sfx-v2-t01.wav", "Wcześniejsze 1 (nie wybrane)"], ["raw/mh-bed-square-evening/mh-bed-square-evening--sfx-v2-t02.wav", "Wcześniejsze 2 (nie wybrane)"], [shipFrom("mh-bed-square-evening"), NOW]]),
      await bedItem("mh-bed-orchard-evening", "Sad gruszowy wieczorem (strona 3)", "Liście w lekkim wietrze, kos, senne zięby, świerszcz w trawie.", ["a", "b"], [[shipFrom("mh-bed-orchard-evening"), NOW]]),
    ] }] },
    { title: "Smok na starym moście: tła", groups: [{ items: [
      await bedItem("db-bed-evening", "Most wieczorem (strony 1–3)", "Kos, rudzik, strzyżyk, liście starego dębu, łąka; potok łagodny i cichszy; daleko, rzadko pies w miasteczku.", ["a", "b"], [[shipFrom("db-bed-evening"), NOW]]),
      await bedItem("db-bed-dusk", "Most o mglistym zmierzchu (strony 4–7)", "Ostatnie ptaki, pierwsze świerszcze, mgła, chłodny powiew; daleko dzwonek krowy.", ["a", "b"], [[shipFrom("db-bed-dusk"), NOW]]),
      await bedItem("db-bed-deepdusk", "Most o późnym zmierzchu (strona 8)", "Świerszcze, powiew w drzewach, raz daleka sowa, miasteczko daleko.", ["a", "b"], [[shipFrom("db-bed-deepdusk"), NOW]]),
      await bedItem("db-bed-night", "Most nocą (strony 9–10)", "Świerszcze, żaby przy potoku, rzadko daleka sowa; bardzo spokojnie.", ["a", "b"], [[shipFrom("db-bed-night"), NOW]]),
    ] }] },
    { title: "Dzwon: motywy (ludowo, bez harfy)", groups: [{ items: [
      { id: "bell-intro-theme", label: "Dzwon: motyw otwarcia (strona tytułowa)", where: "Lutnia, flet lub piszczałka, skrzypki, lira korbowa; G-dur lub D-dur; po wiejsku, z odrobiną magii. Dla porównania obecny motyw (harfa) i otwarcie smoka.", ship: 1, kind: "music", lengthMs: 12000, prompt: ["a", "b", "c"].map((k) => `${k.toUpperCase()}: ${byId.get(`bell-intro-r3${k}`)?.text}`).join("  ·  "), tools: [],
        takes: [...(await newTakes("bell-intro", ["a", "b", "c"], themeFlags)), refTake3(shipFrom("bell-intro-theme"), `${NOW} (harfa)`, themeFlags), refTake3(shipFrom("dragon-intro-theme"), "Smok: otwarcie (dla porównania)", themeFlags)].filter(Boolean) },
      { id: "bell-ending-theme", label: "Dzwon: motyw zakończenia (ostatnia strona)", where: "To samo brzmienie, wolniej, jak kołysanka, z czysto wybrzmiewającym akordem.", ship: 1, kind: "music", lengthMs: 14000, prompt: ["a", "b", "c"].map((k) => `${k.toUpperCase()}: ${byId.get(`bell-ending-r3${k}`)?.text}`).join("  ·  "), tools: [],
        takes: [...(await newTakes("bell-ending", ["a", "b", "c"], themeFlags)), refTake3(shipFrom("bell-ending-theme"), `${NOW} (harfa)`, themeFlags), refTake3(shipFrom("dragon-ending-theme"), "Smok: zakończenie (dla porównania)", themeFlags)].filter(Boolean) },
    ] }] },
  ],
};

// ---------------------------------------------------------------- phase 0 (kept for the record)
const ab0 = [...new Set(manifest.sets.ab0.map((e) => e.id))];
const takeTag = (model) => ({ eleven_text_to_sound_v2: "sfx-v2", eleven_text_to_sound_v3: "sfx-v3", music_v2: "music-v2", music_v2_5: "music-v2-5" })[model];
const phase0Sheet = {
  name: "phase0", title: "Odsłuch dźwięków: faza 0", intro: "Porównanie modeli v2 i v3 (zakończone). Modele ukryte, kolejność losowa.", base: "", showModels: false, blind: true, context,
  // only the takes of that run (the set's model and take numbers), the user's picks starred
  sections: [{ title: "Porównanie A/B", groups: [{ items: ab0.map((id) => item([id, byId.get(id).use, 1], { allModels: true })).map((it) => ({ ...it, takes: it.takes.filter((t) => manifest.sets.ab0.some((e) => e.id === it.id && takeTag(e.model) === t.tag && t.take <= e.takes)).map((t) => ({ ...t, recommended: t.mine })) })) }] }],
};

await mkdir(SHEETS, { recursive: true });
for (const s of [library, motifSheet, phase0Sheet, redoSheet, redo2Sheet, themesSheet, redo3Sheet]) await writeFile(path.join(SHEETS, `${s.name}.json`), JSON.stringify({ ...s, builtAt: new Date().toISOString() }));
await writeFile(cacheFile, JSON.stringify(cache));
console.log(`redo2: ${redo2Items.map((it) => `${it.id} ${it.takes.length}`).join(", ")}${Object.values(dropped).flat().length ? `; dropped ${Object.entries(dropped).map(([k, v]) => v.length ? `${k}: ${v.join(", ")}` : "").filter(Boolean).join(" | ")}` : ""}`);
console.log(`themes: ${themeItems.map((it) => `${it.id} ${it.takes.length}`).join(", ")}`);
console.log(`redo3: ${redo3Sheet.sections.flatMap((sec) => sec.groups[0].items).map((it) => `${it.id} ${it.takes.filter((t) => t.role !== "ref").length}+${it.takes.filter((t) => t.role === "ref").length} ref`).join(", ")}`);
console.log(`library: ${library.stats.takes} takes, ${library.stats.credits} credits by the cost headers${library.stats.missing.length ? `, NO TAKES for ${library.stats.missing.join(", ")}` : ""}`);
console.log(`motif: ${cands.length} candidates; set 1 ${setA.map((t) => `t${t.take}`).join(" ")}; set 2 ${setB.map((t) => `t${t.take} ${t.role.split(" · ")[1].split(" ")[0]} (${t.semis >= 0 ? "+" : ""}${t.semis})`).join(", ")}`);
