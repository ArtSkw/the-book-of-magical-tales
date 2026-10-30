// Księga Magicznych Opowieści — the 3D book on the candle-lit desk.
//
// Query parameters, all optional. A link anyone may follow (the reload after a lost GL context
// builds one, see hereUrl):
//   tale=<id>           open at this tale (spread= then counts inside it)
//   spread=0..10        open at this spread (0 = title spread); never past a choice not yet made
//                       (pass choices= too to open further on)
//   choices=a,b,c,d     choices for pages 2, 4, 6, 8 in order (e.g. ask,bread,warm-path,wave-goodnight)
//   view=left|right     portrait: which page to frame
//   lang=pl|en          language (else the one the reader chose last, kept in localStorage; else Polish)
//   intro=0             skip the intro but keep everything animated
//   sound=0|1           sound off / on for this visit (not remembered)
//   reduced=1           behave as prefers-reduced-motion (crossfade instead of the curl)
// For review and deterministic screenshots, in the dev server only (import.meta.env.DEV; a
// deployed book ignores them):
//   choice=lantern|bread   choice made on page 4
//   still=1             no intro, time frozen at t (candle, dust, hearth) — for screenshots
//   t=3                 frozen time in seconds (with still=1)
//   turn=0.45           freeze a page turn at this progress (from `spread` to the next one)
//   dir=-1              with turn: show the backwards turn instead
//   introAt=1.8         freeze the intro at this time (seconds)
//   perf=1              frame-time overlay (and window.__bookPerf, also mirrored into document.title);
//                       bodyPx = body text size on screen in CSS px (also on <html data-body-px>)
//   actions=a,b,...     review/testing script, one step every 1.6 s after load:
//                       next | prev | choose:<id> | tap:<x>:<y> (screen fractions, real pointer events)
//                       | tale:<id> (open that tale) | tapRibbon:<id> (touch its ribbon) | hover:<id>
//                       | lang:<pl|en> (switch language: the open spread is rewritten)
//   sealAt=0.15         freeze the sealing of a choice (made with actions=choose:<id>) at 0.15 s
//   inkAt=0.6           freeze the rewriting of a spread (actions=lang:<code>) at 0.6 s
//   resistAt=0.15       freeze the cue of a refused turn (actions=next on a spread whose choice is
//                       not made yet) at 0.15 s: the leaf held down, the waiting seals glowing
//   restartAt=0.5       freeze the riffle back of "Start over" (actions=choose:restart on a tale's
//                       last spread) at 0.5 s
//   tales=4             every tale is available (placeholder title spreads), to test switching tales
//   switchTo=<id>       riffle to this tale's title spread right after load (the active tale's own id
//                       = back to its title spread); switchAt=0.8 freezes that riffle at 0.8 s
//   hover=<id>          show this ribbon lifted, as under the pointer
//   cam=x,y,z,tx,ty,tz  review camera (close-ups); no intro
//   mode=spread|single|column|pan   force a reading mode (see pickMode; pan = a part of a spread
//                       at a time, a phone held sideways)
//   sound=debug         sound on, with the engine's log, an on-screen panel and window.__sound
//                       (state(), play(id)). The frozen review modes (still, turn, introAt, cam,
//                       *At) are silent.
//   gate=0              no "tap to open" gate: the intro plays on its own (as with actions=)
//   dpr=1.5             pin the canvas resolution
import * as THREE from "three";
import { createBook, thicknessFor, sideProfile, leafSwing, W, D, BT, SQUARE, HINGE } from "./book.js";
import { createRoom, loadProps, CANDLE } from "./room.js";
import { createPageArtist, makeGrain, PAGE_ASPECT, PAGE_UNITS_W, PAGE_UNITS_H, TEXT_MARGINS } from "./pageArt.js";
import { allImageSources, spreadImage, normaliseImage } from "./pages.js";
import { storyFor, ui } from "./story.js";
import { bindTales, taleUi } from "./tales.js";
import { createRibbons, RW } from "./ribbons.js";
import { createSound } from "./sound.js";

const BASE = import.meta.env.BASE_URL || "/";
const asset = (p) => `${BASE}${p.replace(/^\//, "")}`;
const params = new URLSearchParams(location.search);
// the review switches (see the header) answer in the dev server only; a built book never sees them
const REVIEW = import.meta.env.DEV;
const rp = REVIEW ? params : new URLSearchParams();
const num = (k, d, p = params) => (p.has(k) && p.get(k) !== "" && !Number.isNaN(Number(p.get(k))) ? Number(p.get(k)) : d);
const rnum = (k, d) => num(k, d, rp);
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const clamp01 = (t) => clamp(t, 0, 1);
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOut = (t) => 1 - Math.pow(1 - t, 3);

// The language the reader chose last, kept with the rest of the site's memory (the same key the
// earlier 2D edition of the site used, so a returning reader keeps their language and sound):
// the book opens in it, cover and loader included, from the first frame. Storage may be missing
// or refused: then Polish.
const MEMORY_KEY = "bookOfMagicalTalesState";
function savedLang() {
  try {
    const l = JSON.parse(localStorage.getItem(MEMORY_KEY) || "{}")?.language;
    return l === "en" || l === "pl" ? l : null;
  } catch {
    return null;
  }
}
function remember(field, value) {
  try {
    let m = JSON.parse(localStorage.getItem(MEMORY_KEY) || "{}");
    if (!m || typeof m !== "object" || Array.isArray(m)) m = {};
    m[field] = value;
    localStorage.setItem(MEMORY_KEY, JSON.stringify(m));
  } catch {
    // a comfort only: the book reads on without it
  }
}
const saveLang = (lang) => remember("language", lang);
// Sound is on unless the reader turned it off (the same field the 2D edition kept).
function savedSound() {
  try {
    return JSON.parse(localStorage.getItem(MEMORY_KEY) || "{}")?.soundEnabled !== false;
  } catch {
    return true;
  }
}

const Q = {
  spread: Math.max(0, Math.round(num("spread", 0))),
  lang: ["pl", "en"].includes(params.get("lang")) ? params.get("lang") : savedLang() || "pl",
  still: rp.get("still") === "1",
  t: rnum("t", 3),
  turn: rp.has("turn") ? clamp01(rnum("turn", 0.5)) : null,
  dir: rp.get("dir") === "-1" ? -1 : 1,
  introAt: rp.has("introAt") ? rnum("introAt", 0) : null,
  perf: rp.get("perf") === "1",
  reduced: params.get("reduced") === "1" || matchMedia("(prefers-reduced-motion: reduce)").matches,
  view: params.get("view"),
  tales: ["4", "all"].includes(rp.get("tales")),
  switchTo: rp.get("switchTo"),
  switchAt: rp.has("switchAt") ? Math.max(0, rnum("switchAt", 0.6)) : null,
  restartAt: rp.has("restartAt") ? Math.max(0, rnum("restartAt", 0.5)) : null,
  sealAt: rp.has("sealAt") ? Math.max(0, rnum("sealAt", 0.15)) : null,
  inkAt: rp.has("inkAt") ? Math.max(0, rnum("inkAt", 0.6)) : null,
  resistAt: rp.has("resistAt") ? Math.max(0, rnum("resistAt", 0.15)) : null,
  hover: rp.get("hover"),
  cam: rp.get("cam")?.split(",").map(Number),
};
Q.intro = Q.introAt !== null || (!Q.still && params.get("intro") !== "0" && Q.turn === null && !Q.cam);
// The book waits closed until a tap opens it (see "intro"): the tap is the gesture that lets the
// browser play sound, so the cover opens with its creak. Not for frozen or scripted reviews.
Q.gate = Q.intro && Q.introAt === null && rp.get("gate") !== "0" && !rp.has("actions") && !Q.switchTo;
// Frozen review states are silent; ?sound= sets it for one visit.
Q.frozen = Q.still || Q.turn !== null || Q.introAt !== null || Boolean(Q.cam) || [Q.sealAt, Q.inkAt, Q.resistAt, Q.switchAt, Q.restartAt].some((v) => v !== null);
const SOUND_DEBUG = REVIEW && params.get("sound") === "debug";
const soundParam = SOUND_DEBUG ? "1" : ["0", "1"].includes(params.get("sound")) ? params.get("sound") : null;
const sound = createSound({
  base: BASE,
  enabled: Q.frozen ? false : soundParam === "0" ? false : soundParam === "1" ? true : savedSound(),
  // a visit with ?sound= keeps the reader's own setting
  onChange: (on) => soundParam === null && remember("soundEnabled", on),
  debug: SOUND_DEBUG,
});
sound.attach(window);
if (SOUND_DEBUG) {
  window.__sound = sound;
  // on screen: the bed, the spot sounds waiting, what holds the floor, the mixer
  const panel = document.createElement("pre");
  panel.style.cssText = "position:fixed;left:8px;bottom:8px;z-index:40;margin:0;padding:6px 9px;border-radius:6px;background:rgba(0,0,0,.66);color:#e8d9b0;font:11px/1.35 ui-monospace,Menlo,monospace;pointer-events:none;max-width:46vw;white-space:pre-wrap";
  document.body.append(panel);
  setInterval(() => {
    const st = sound.state();
    const m = st.mixer;
    panel.textContent = [
      `sound ${st.on ? "on" : "off"} · ${st.context}${st.idle ? " · idle" : ""}`,
      `bed ${st.bed || "-"}${st.bedPending ? " (loading)" : ""}${m?.bedLevel != null ? ` ${m.bedLevel} dB` : ""}`,
      `theme ${st.theme || "-"} · floor held ${st.foreground} s`,
      `spots ${st.spots.length ? st.spots.map((s) => `${s.id} in ${s.in}s (${s.plays}/${s.max})`).join(", ") : "-"}`,
      m ? `ducks ${Object.entries(m.duck).map(([b, v]) => `${b} ${v}`).join(" · ")}` : "",
      `voices ${st.voices.join(", ") || "-"} · ${st.decodedMB} MB, ${st.files} files`,
    ].join("\n");
  }, 500);
}

// The tales bound into the book; a tale's spreads are numbered inside it, and `offset` places
// them in the whole binding (page-block thickness, where its ribbon lies).
const tales = bindTales({ allAvailable: Q.tales });
const TOTAL = tales.reduce((a, t) => a + t.length, 0);
const startTale = Math.max(0, tales.findIndex((t) => t.id === params.get("tale") && t.available));
const taleOf = (id) => tales.findIndex((t) => t.id === id);

const state = {
  tale: startTale,
  spread: Math.min(Q.spread, tales[startTale].spreads.length - 1),
  lang: Q.lang,
  choicesByTale: {},
  view: Q.view === "right" || (Q.view !== "left" && Q.spread === 0) ? "right" : "left",
  turning: null,
  fade: null,
  riffle: null,
  intro: null,
  seal: null, // a choice being sealed, or the seals glowing at a refused turn (see "page moments")
  ink: null, // the spread being rewritten in another language
  resist: null, // a turn refused at a choice not yet made (see "the gate")
};
// Each tale keeps its own choices; `state.choices` always means the tale being read.
Object.defineProperty(state, "choices", {
  get: () => (state.choicesByTale[tales[state.tale].id] ||= {}),
  set: (v) => (state.choicesByTale[tales[state.tale].id] = v),
});
const spreads = () => tales[state.tale].spreads;
const story = (t = state.tale) => storyFor(tales[t].id);
const choicesOf = (t) => (state.choicesByTale[tales[t].id] ||= {});
const gIndex = (t = state.tale, i = state.spread) => tales[t].offset + i;
if (rp.get("choice")) state.choices[4] = rp.get("choice");
// ?choices= ids come from a link, so only an id that is one of that page's options is taken
if (params.get("choices")) params.get("choices").split(",").forEach((id, i) => {
  const p = story()?.CHOICE_PAGES[i];
  if (p && story().choiceOptions(p).some((c) => c.id === id)) state.choices[p] = id;
});
// Resolved choices of a tale (placeholder tales have no story and no choices).
const resolved = (t = state.tale) => {
  const S = story(t);
  return S ? Object.fromEntries(S.CHOICE_PAGES.map((p) => [p, S.resolvedChoice(choicesOf(t), p)])) : {};
};
// A spread that asks the reader to choose holds the book open there until they have: no turn,
// tap, swipe, key or link goes on past it (back is always free; a ribbon only ever opens a
// tale's title spread). A choice once sealed stays until the tale is started over (see choose).
const awaitsChoice = (t = state.tale, i = state.spread) => {
  const page = tales[t].spreads[i]?.page;
  return Boolean(page && story(t)?.CHOICE_PAGES.includes(page) && !choicesOf(t)[page]);
};
// The furthest a reader may get towards spread `want`: the first spread on the way still
// waiting for a choice.
const reachable = (t, want) => {
  for (let i = 0; i < want; i++) if (awaitsChoice(t, i)) return i;
  return want;
};
// deep links keep the rule too (?spread=5 alone opens at page 2's choice; add choices= to go on)
if (reachable(state.tale, state.spread) !== state.spread) {
  console.info(`[book] spread=${state.spread} lies past a choice not made yet: opening at spread ${reachable(state.tale, state.spread)}`);
  state.spread = reachable(state.tale, state.spread);
}

// ---------------------------------------------------------------- renderer
const stage = document.getElementById("stage");
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
const gpuName = (() => {
  try {
    const gl = renderer.getContext();
    const ext = gl.getExtension("WEBGL_debug_renderer_info");
    return String(ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER));
  } catch {
    return "";
  }
})();
// A weak device starts lighter: the canvas at 1.5x at the most, page textures at most 2048 px tall
// (as on a phone held upright) and a 1024 px shadow map. Only signals a browser gives
// cheaply count: little memory (Chromium's deviceMemory), a software or old mobile GPU, a small
// texture limit. Safari gives none of them, so an iPhone or iPad keeps the whole book; anywhere,
// adaptResolution still steps the canvas down if frames run long. ?tier=low|high forces it (dev).
// A software rasteriser (no GPU at all) draws every pixel on the CPU: it gets the canvas at 1x.
const SOFT_GPU = /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i;
const LOW_GPU = /Mali-4\d\d|Mali-T\d|Adreno \(TM\) [2-4]\d\d|PowerVR SGX/i;
const SOFT = SOFT_GPU.test(gpuName);
const LOW = rp.get("tier") === "low" || (rp.get("tier") !== "high" && (SOFT || (navigator.deviceMemory || 8) <= 2 || LOW_GPU.test(gpuName) || renderer.capabilities.maxTextureSize < 4096));
const DPR = rp.has("dpr") ? clamp(rnum("dpr", 1), 0.5, 3) : Math.min(window.devicePixelRatio || 1, SOFT ? 1 : LOW ? 1.5 : 2);
renderer.setPixelRatio(DPR);
// If the device cannot hold ~60 fps at full resolution, step the canvas resolution down
// (page textures keep their resolution). Pinned when ?dpr= is given.
const adapt = { dpr: DPR, frames: [], last: 0, enabled: !rp.has("dpr") };
function adaptResolution(dt, now) {
  if (!adapt.enabled || adapt.dpr <= 1.25) return;
  adapt.frames.push(dt);
  if (adapt.frames.length < 120) return;
  const sorted = adapt.frames.sort((a, b) => a - b);
  const median = sorted[60];
  adapt.frames = [];
  if (median > 19 && now - adapt.last > 3000 && !state.turning && !state.riffle) {
    adapt.dpr = Math.max(1.25, +(adapt.dpr - 0.35).toFixed(2));
    adapt.last = now;
    renderer.setPixelRatio(adapt.dpr);
    renderer.setSize(window.innerWidth, window.innerHeight);
    console.info(`[book] frame median ${median.toFixed(1)} ms; canvas DPR lowered to ${adapt.dpr}`);
  }
}
// shader errors are looked for (and logged) in the dev server; a built book skips the extra GL
// round trips per program as it compiles
renderer.debug.checkShaderErrors = REVIEW;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.08;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
renderer.shadowMap.autoUpdate = false; // shadows are re-rendered only while something moves
stage.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(24, 1, 0.05, 60);

// ---------------------------------------------------------------- loading
function loadImage(src, priority = "auto") {
  return new Promise((resolve) => {
    const img = new Image();
    img.decoding = "async";
    img.fetchPriority = priority;
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

// ---------------------------------------------------------------- illustrations, streamed
// The veil waits only for the desk and the pictures of the spread the book opens at; the others
// stream in behind it: the spreads either side first, then the rest of this tale in reading
// order, then the other tales' title spreads (for a ribbon's riffle); a tale's other pictures
// stream once it is opened (a reader of one tale never downloads the rest of the book). With
// Save-Data on, or on a 2G line, only the spreads either side are fetched ahead. A page drawn
// before its picture has come shows a quiet placeholder in the picture's frame (pageArt.js) and
// is drawn again as the picture arrives (artArrived). Wherever the reader goes, the pictures of
// that spread and its neighbours jump the queue (prefetch).
const art = { map: new Map(), jobs: new Map(), queue: [], active: 0, get: (src) => art.map.get(src) };
const ART_PARALLEL = 3; // background downloads at a time; a picture wanted now starts at once
function artJob(src) {
  let j = art.jobs.get(src);
  if (!j) {
    j = { src, started: false, done: false };
    j.promise = new Promise((r) => (j.resolve = r));
    art.jobs.set(src, j);
  }
  return j;
}
function startArt(j, urgent) {
  j.started = true;
  art.active++;
  loadImage(asset(j.src), urgent ? "high" : "low").then(async (img) => {
    // decoded before any page draws it, so drawing a page never stalls on it
    if (img) await img.decode?.().catch(() => {});
    art.active--;
    j.done = true;
    if (img) art.map.set(j.src, img);
    else console.warn(`[book] could not load ${j.src}`);
    j.resolve(img);
    if (img) artArrived(j.src);
    pumpArt();
  });
}
function pumpArt() {
  while (art.active < ART_PARALLEL && art.queue.length) startArt(art.queue.shift(), false);
}
// Resolves once every picture asked for is in (or has failed).
function wantArt(srcs, urgent = false) {
  const jobs = [...new Set(srcs.filter(Boolean))].map(artJob);
  for (const j of jobs) {
    if (j.started) continue;
    if (urgent) {
      art.queue = art.queue.filter((q) => q !== j);
      startArt(j, true);
    } else if (!art.queue.includes(j)) art.queue.push(j);
  }
  pumpArt();
  return Promise.all(jobs.map((j) => j.promise));
}
const artReady = (srcs) => srcs.every((s) => art.jobs.get(s)?.done);
// The pictures a spread shows for the choices made so far (all: every variant it can show).
function spreadArt(t, i, all = false) {
  const s = tales[t]?.spreads[i];
  if (!s) return [];
  if (all) return allImageSources([s]);
  return [spreadImage(s, resolved(t)), normaliseImage(s.tailpiece), normaliseImage(s.secondary)].map((e) => e?.src).filter(Boolean);
}
const lean = () => Boolean(navigator.connection?.saveData) || /2g$/.test(navigator.connection?.effectiveType || "");
function artOrder() {
  const t = state.tale;
  const i = state.spread;
  const out = [...spreadArt(t, i + 1), ...spreadArt(t, i - 1)];
  if (lean()) return out;
  for (let k = i; k < spreads().length; k++) out.push(...spreadArt(t, k, true));
  for (let k = i - 1; k >= 0; k--) out.push(...spreadArt(t, k, true));
  for (const o of tales) if (o.index !== t && o.available) out.push(...spreadArt(o.index, 0));
  return out;
}
// What the veil waits for: the spread the book opens at (and one a review link shows at once).
function criticalArt() {
  const out = spreadArt(state.tale, state.spread);
  if (Q.turn !== null) out.push(...spreadArt(state.tale, state.spread + Q.dir));
  if (Q.switchTo && taleOf(Q.switchTo) >= 0) out.push(...spreadArt(taleOf(Q.switchTo), 0));
  return out;
}
// A picture has come: the pages drawn without it are drawn again, those in view as soon as the
// book is still (frame), the neighbours in idle time (prefetch), any other when next shown.
let artDirty = false;
function artArrived(src) {
  let hit = false;
  for (const e of cache.values()) if (e.missing?.includes(src)) hit = e.stale = true;
  if (!hit) return;
  artDirty = true;
  if (book) prefetch(300);
}
function repaintShown() {
  artDirty = false;
  for (const e of cache.values()) if (e.stale && (book.leftMat.map === e.tex || book.rightMat.map === e.tex)) drawInto(e);
}
// The desk's and the book's textures are decoded off the main thread, as ImageBitmaps, where the
// browser can flip one the way WebGL wants it (tested once, on a tiny PNG, below): an <img> is
// decoded inside texImage2D, on the main thread, in one long stall as the first frame is drawn
// (measured: ~260 ms on a fast laptop for these 23 files, ~1.4 s with the CPU slowed 6x; as
// bitmaps 25 ms and 85 ms). Elsewhere they load as <img>, as before. Once every texture sharing a
// bitmap is on the GPU its pixels are let go (releaseBitmaps); should the GL context be lost and
// given back, they are decoded again from the HTTP cache before the next frame (reviveBitmaps).
const BITMAP = { imageOrientation: "flipY", premultiplyAlpha: "none", colorSpaceConversion: "none" };
const bitmapsWork = (async () => {
  if (typeof createImageBitmap !== "function") return false;
  try {
    const c = document.createElement("canvas");
    c.width = 1;
    c.height = 2;
    const g = c.getContext("2d");
    g.fillStyle = "#f00";
    g.fillRect(0, 0, 1, 1);
    g.fillStyle = "#00f";
    g.fillRect(0, 1, 1, 1);
    const blob = await new Promise((r) => c.toBlob(r, "image/png"));
    const bmp = await createImageBitmap(blob, BITMAP);
    const d = document.createElement("canvas");
    d.width = 1;
    d.height = 2;
    const dg = d.getContext("2d", { willReadFrequently: true });
    dg.drawImage(bmp, 0, 0);
    bmp.close();
    const [r, , b] = dg.getImageData(0, 0, 1, 1).data;
    return b > 200 && r < 50; // the blue row came up to the top
  } catch {
    return false;
  }
})();
const bitmapSources = new Map(); // a texture source decoded as a bitmap -> its URL
const decodeBitmap = async (url) => {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  return createImageBitmap(await r.blob(), BITMAP);
};
const texLoader = new THREE.TextureLoader();
async function loadTex(p, srgb = true) {
  let t;
  if (await bitmapsWork) {
    t = new THREE.Texture(await decodeBitmap(asset(p)));
    t.flipY = false; // flipped as it was decoded
    t.needsUpdate = true;
    bitmapSources.set(t.source, asset(p));
  } else t = await texLoader.loadAsync(asset(p));
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
// Uploads every texture of the scene still decoded as a bitmap (a clone shares its source, so all
// of them), then lets the bitmaps' pixels go.
function releaseBitmaps() {
  const texs = new Set();
  scene.traverse((o) => {
    for (const m of [o.material].flat()) for (const v of Object.values(m || {})) if (v?.isTexture && bitmapSources.has(v.source)) texs.add(v);
  });
  texs.forEach((t) => renderer.initTexture(t));
  for (const src of bitmapSources.keys()) src.data?.close?.();
}
// The frame loop draws nothing while `reviving`; resolves false if a texture could not be had again.
let reviving = null;
function reviveBitmaps() {
  if (!bitmapSources.size) return Promise.resolve(true);
  reviving = Promise.all(
    [...bitmapSources].map(([src, url]) =>
      decodeBitmap(url).then((bmp) => {
        src.data = bmp;
        src.needsUpdate = true;
      })
    )
  ).then(
    () => {
      releaseBitmaps();
      return true;
    },
    (e) => {
      console.warn("[book] textures could not be decoded again", e);
      return false;
    }
  );
  return reviving.finally(() => (reviving = null));
}

// Canvas text needs the web font to be *usable by canvas*, which Safari can report late.
// Load every face, then confirm by measuring against the fallback; give up after ~4 s.
const FACES = ["400 40px", "500 40px", "600 40px", "italic 400 40px", "italic 500 40px", "italic 600 40px"];
async function fontsUsable() {
  const sample = "Wieczór stawał się chłodniejszy ąęłńóśźż";
  await Promise.all(FACES.map((f) => document.fonts.load(`${f} "EB Garamond"`, sample))).catch(() => null);
  const g = document.createElement("canvas").getContext("2d");
  const usable = () =>
    FACES.every((f) => {
      g.font = `${f} "EB Garamond", monospace`;
      const a = g.measureText(sample).width;
      g.font = `${f} monospace`;
      return Math.abs(a - g.measureText(sample).width) > 1;
    });
  for (let i = 0; i < 40 && !usable(); i++) await new Promise((r) => setTimeout(r, 100));
  return usable();
}

// The painted far wall of the room (prototypes/prompts/room-wall.txt, baked to textures/room_wall.webp
// by prototypes/book/tools/bake_room.py); without it the room draws the wall itself (room.js, "the chamber").
const CHAMBER_ART = true;
const T = "/assets/book3d/textures/";
const COVER_ART = ["cover_diff", "cover_nor", "cover_orm"];
// An image drawn into a canvas (the parchment under every page, the cover art the title is set
// on): decoded off the main thread as an ImageBitmap where there is one (drawImage of an <img>
// decodes it there and then: ~600 ms for these four with the CPU slowed 6x, 25 ms as bitmaps).
async function loadDrawable(name) {
  const url = asset(T + name + ".webp");
  if (typeof createImageBitmap === "function") {
    try {
      const r = await fetch(url);
      if (r.ok) return await createImageBitmap(await r.blob());
    } catch {
      // fall back to an <img>
    }
  }
  return loadImage(url);
}
const loadCoverArt = () => Promise.all(COVER_ART.map(loadDrawable)).then(([map, normal, orm]) => ({ map, normal, orm }));
const closeArt = (a) => Object.values(a).forEach((x) => x?.close?.());
async function loadAll() {
  const fontsReady = fontsUsable();
  const firstArt = wantArt(criticalArt(), true); // the rest streams in once the veil lifts
  const tx = (name, srgb = true) => loadTex(T + name + ".webp", srgb);
  const [textures, images_] = await Promise.all([
    Promise.all([
      tx("desk_diff"), tx("desk_nor", false), tx("desk_rough", false),
      tx("leather_diff"), tx("leather_nor", false), tx("leather_rough", false),
      tx("boardin_diff"), tx("boardin_nor", false), tx("boardin_orm", false),
      tx("spine_diff"), tx("spine_nor", false), tx("spine_orm", false),
      tx("brass_col"), tx("brass_rough", false),
      tx("parchment_nor", false), tx("weave_nor", false), tx("runner_diff"), tx("feather"),
      CHAMBER_ART ? tx("room_wall").catch(() => null) : null,
    ]),
    Promise.all([loadDrawable("parchment"), loadCoverArt()]),
  ]);
  // the desk's own textures are in (on a slow line they had its whole width): now the props
  const props = loadProps(BASE);
  const [wood, woodN, woodR, lea, leaN, leaR, binC, binN, binO, spC, spN, spO, brC, brR, paperN, weaveN, runner, feather, chamberWall] = textures;
  const [parchment, coverArt] = images_;
  const aniso = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  for (const t of [binC, binN, binO, spC, spN, spO, paperN]) t.anisotropy = aniso;
  await firstArt;
  const images = art; // filled as the pictures arrive (see "illustrations, streamed")
  const fontsOk = await fontsReady;
  if (!fontsOk) console.warn("[book] EB Garamond not usable in canvas yet; pages will be redrawn when it arrives");
  return {
    wood: { map: wood, normal: woodN, rough: woodR },
    book: {
      leather: { map: lea, normal: leaN, rough: leaR },
      boardIn: { map: binC, normal: binN, orm: binO },
      spine: { map: spC, normal: spN, orm: spO },
      cover: coverArt,
      brass: { map: brC, rough: brR },
      paperNormal: paperN,
    },
    room: { brass: { map: brC, rough: brR }, runner, weave: weaveN, feather, chamberWall },
    parchment,
    images,
    props,
  };
}

// ---------------------------------------------------------------- page textures
// `column`: the pages are drawn for column mode (see updatePageSize)
const pageSize = { w: 1024, h: 1413, column: false };
const cache = new Map();
let artist = null;
// current + previous + next spread = 6 pages: enough for an instant turn either way, and bounded
// memory (a portrait page is ~1739x2400 px, ~22 MB on the GPU with mipmaps plus its canvas). A
// touch screen held upright reads one page at a time and has far less memory to give: 4 pages
// (this spread and the one the next turn shows, see prefetch), at most 2048 px tall.
const maxCache = () => (memCompact() ? 4 : 6);
const choiceKey = (t = state.tale) => (story(t)?.CHOICE_PAGES || []).map((p) => choicesOf(t)[p] || "-").join(",");
const keyOf = (t, i, side) => `${tales[t].id}|${i}|${side}|${state.lang}|${choiceKey(t)}|${pageSize.h}`;
const ctxFor = (t = state.tale) => ({ tale: tales[t].id, spreads: tales[t].spreads, lang: state.lang, choices: choicesOf(t), resolved: resolved(t), column: pageSize.column });

function getPage(t, i, side) {
  const key = keyOf(t, i, side);
  let entry = cache.get(key);
  if (entry) {
    cache.delete(key);
    cache.set(key, entry); // LRU touch
    if (entry.stale) drawInto(entry); // drawn while its picture was still on its way
    return entry;
  }
  const canvas = document.createElement("canvas");
  canvas.width = pageSize.w;
  canvas.height = pageSize.h;
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  entry = { tex, canvas, t, i, side };
  drawInto(entry, false);
  cache.set(key, entry);
  // held upright on a touch screen the cap is kept, passing over pages in use; elsewhere it gives
  // way to them (a ribbon's tale drawn ahead never pushes out the next spread)
  const strict = memCompact();
  for (const [oldKey, old] of cache) {
    if (cache.size <= maxCache()) break;
    if (old === entry || isInUse(old.tex)) {
      if (strict) continue;
      break;
    }
    old.tex.dispose();
    cache.delete(oldKey);
    if (strict && !Object.values(state.ink?.sides || {}).some((s) => s.page === old)) freeCanvas(old.canvas);
  }
  return entry;
}
// Draws (or draws again, into the same canvas and texture) a cached page, noting the pictures it
// is still waiting for; those are wanted at once.
function drawInto(e, upload = true) {
  const t0 = performance.now();
  const { hits, lines, regions } = artist.drawPage(e.canvas, tales[e.t].spreads[e.i], e.side, ctxFor(e.t));
  const d = artist.plan(tales[e.t].spreads[e.i], ctxFor(e.t))[e.side];
  const missing = [d?.image, d?.vignette, d?.tailpiece].map((x) => x?.src).filter((s) => s && !art.map.has(s));
  Object.assign(e, { hits, lines, regions, missing, stale: false });
  if (missing.length) wantArt(missing, true);
  if (upload) {
    e.tex.needsUpdate = true;
    clasp.entry = null; // the clasp may sit elsewhere now (placeClasp reads it again)
  }
  if (Q.perf) console.info(`[book] ${upload ? "redrew" : "drew"} page ${tales[e.t].id} ${e.i}/${e.side} in ${(performance.now() - t0).toFixed(1)} ms${missing.length ? `, waiting for ${missing.length} picture(s)` : ""}`);
}
let book = null;
let ribbons = null;
const isInUse = (tex) =>
  [book.leftMat, book.rightMat, book.fadeLeft.material, book.fadeRight.material, ...book.leaves.flatMap((l) => [l.frontMat, l.backMat])].some((m) => m.map === tex);

// The leaves that fly past in a riffle carry printed pages of their own, FILLER of them (Latin
// fables, see drawGeneric in pageArt.js), drawn once per size and dealt out in book order: an odd
// number, so neither side of a riffle shows the same page twice running. Nothing ever redraws
// them, so each canvas is let go as soon as its texture is on the GPU (a lost GL context has
// them drawn again).
const FILLER = 5;
let filler = { h: 0, tex: [] };
function fillerPage(i) {
  if (filler.h !== pageSize.h) {
    filler.tex.forEach((tex) => tex?.dispose());
    filler = { h: pageSize.h, tex: [] };
  }
  if (filler.tex[i]) return filler.tex[i];
  const canvas = document.createElement("canvas");
  canvas.width = pageSize.w;
  canvas.height = pageSize.h;
  artist.drawGeneric(canvas, i);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  renderer.initTexture(tex);
  freeCanvas(canvas);
  return (filler.tex[i] = tex);
}
const fillerMissing = () => [...Array(FILLER).keys()].filter((i) => filler.h !== pageSize.h || !filler.tex[i]);
renderer.domElement.addEventListener("webglcontextrestored", () => (filler.h = -1));

// A lost GL context (a phone short of memory, the GPU reset): a calm plaque over the dimmed desk
// (index.html, #glLost) while the browser may give it back, with a button that loads the book
// again at the same page, in the same language, with the same choices. Given back, the desk's
// textures are decoded again (reviveBitmaps; nothing is drawn meanwhile), the room's environment
// map is rendered again (room.js renewEnvironment: without it every metal turned black), three.js
// uploads every other texture again from its canvas or image (the page cache keeps its canvases),
// the filler pages are drawn again (above) and the plaque goes; if a texture cannot be had, it
// stays, with its reload.
renderer.domElement.addEventListener("webglcontextlost", (e) => {
  e.preventDefault(); // without it the browser never gives the context back
  console.warn("[book] WebGL context lost");
  syncNotices();
  document.getElementById("glLost").classList.add("shown");
});
renderer.domElement.addEventListener("webglcontextrestored", () => {
  console.info("[book] WebGL context restored");
  room?.renewEnvironment();
  reviveBitmaps().then((ok) => ok && document.getElementById("glLost").classList.remove("shown"));
  renderer.shadowMap.needsUpdate = true;
  if (book) prefetch(300);
});
function syncNotices() {
  const L = ui[state.lang];
  document.getElementById("glLostText").textContent = L.glLost;
  document.getElementById("glReload").textContent = L.reload;
}
// The book as it lies now, as a link (see the query parameters at the top).
function hereUrl() {
  const p = new URLSearchParams(location.search);
  for (const k of ["still", "t", "turn", "dir", "introAt", "switchTo", "switchAt", "sealAt", "inkAt", "resistAt", "actions", "cam", "choice"]) p.delete(k);
  p.set("tale", tales[state.tale].id);
  p.set("spread", String(state.spread));
  p.set("view", state.view);
  p.set("lang", state.lang);
  p.set("intro", "0");
  const S = story();
  if (S) p.set("choices", S.CHOICE_PAGES.map((pg) => state.choices[pg] || "").join(","));
  else p.delete("choices");
  return `${location.pathname}?${p}`;
}
document.getElementById("glReload").addEventListener("click", () => location.replace(hereUrl()));

// Pages of the neighbouring spreads are drawn and uploaded ahead of time, one page per idle
// slot and never while a leaf is moving, so the next turn starts without a hitch.
let prefetchTimer = 0;
function prefetch(delay = 1300) {
  clearTimeout(prefetchTimer);
  // the pictures of this spread and its neighbours before any other
  if (art.jobs.size) wantArt([-1, 0, 1].flatMap((d) => spreadArt(state.tale, state.spread + d)), true);
  const queue = [];
  // one page at a time on a small cache: only the spread the next turn shows (from the left page
  // a turn goes back, from the right page on; the other way is a glide)
  const ahead = memCompact() && portrait() ? [state.spread + (state.view === "left" ? -1 : 1)] : [state.spread + 1, state.spread - 1];
  for (const i of ahead) {
    if (i >= 0 && i < spreads().length) for (const side of ["right", "left"]) queue.push([state.tale, i, side]);
  }
  queue.push(...fillerMissing());
  const idle = window.requestIdleCallback || ((f) => setTimeout(f, 16));
  const step = () => {
    if (state.turning || state.fade || state.riffle || state.seal || state.ink || state.resist || cam.to || (state.intro && !state.intro.done)) {
      prefetchTimer = setTimeout(step, 500);
      return;
    }
    if (!queue.length) return;
    const next = queue.shift();
    const t0 = performance.now();
    if (Array.isArray(next)) renderer.initTexture(getPage(...next).tex);
    else fillerPage(next);
    if (Q.perf) console.info(`[book] prefetched ${Array.isArray(next) ? next.join("/") : `filler ${next}`} in ${(performance.now() - t0).toFixed(1)} ms`);
    prefetchTimer = setTimeout(() => idle(step, { timeout: 600 }), 120);
  };
  prefetchTimer = setTimeout(() => idle(step, { timeout: 600 }), delay);
}

function invalidatePages() {
  for (const [, e] of cache) if (!isInUse(e.tex)) e.tex.dispose();
  cache.clear();
}

// Draws a tale's title spread ahead of a tap on its ribbon (hover / press), so the riffle starts clean.
function prefetchTale(t) {
  if (!tales[t]?.available) return;
  wantArt(spreadArt(t, 0), true);
  for (const side of ["left", "right"]) renderer.initTexture(getPage(t, 0, side).tex);
  sound.preloadTale(tales[t].id); // its beds and page sounds, decoded while the reader decides
}

function applySpread(t = state.tale, i = state.spread) {
  const [hL, hR] = thicknessFor(gIndex(t, i), TOTAL);
  book.setThickness(hL, hR);
  book.leftMat.map = getPage(t, i, "left").tex;
  book.rightMat.map = getPage(t, i, "right").tex;
  holdLeaf();
  layoutRibbons(gIndex(t, i));
  renderer.shadowMap.needsUpdate = true;
}

// ---------------------------------------------------------------- ribbons
// Every ribbon marks its tale's title spread. It lies in the gutter only while the book is open
// there; on every other spread it stays bound in between the leaves of the left or right block,
// and only its tail shows.
const tug = { hover: -1, press: -1, focus: -1, review: Q.hover ? taleOf(Q.hover) : -1, last: 0 };
function ribbonMarks(pos) {
  return tales.map((t) => ({ s: t.offset, gut: pos === t.offset ? 1 : 0 }));
}
// A turn from or back to a tale's title spread takes its ribbon with the leaf: turning on, the
// leaf lifts off the ribbon and, settling on the left, presses it in between the leaves; turning
// back, it draws the ribbon out again into the fold. Any other turn leaves the ribbons be.
function turnRibbons(p) {
  const tr = state.turning;
  const marks = ribbonMarks(gIndex(state.tale, tr.from));
  const s = tales[state.tale].offset;
  if (tr.from === 0) marks[state.tale] = { s, gut: 1 - leafSwing(p), side: -1 };
  else if (tr.to === 0) marks[state.tale] = { s, gut: leafSwing(p), side: -1 };
  layoutRibbons(gIndex(state.tale, tr.from), marks);
}
function layoutRibbons(pos = gIndex(), marks = ribbonMarks(pos)) {
  const st = book.state;
  ribbons.update({ pos, total: TOTAL, hL: st.hL, hR: st.hR, profL: st.profL, profR: st.profR, cover: book.cover, pivotY: book.pivotY }, marks);
  ribbons.lastMarks = marks;
  ribbons.lastPos = pos;
}
// Hover / press / keyboard focus lift a ribbon a little (a tug); with reduced motion it only warms.
function updateTugs(dt) {
  let moved = false;
  ribbons.ribbons.forEach((r, i) => {
    const want = r.tale.available && [tug.hover, tug.press, tug.focus, tug.review].includes(i) ? 1 : 0;
    const k = Q.still ? 1 : 1 - Math.exp(-dt * (want > r.hover ? 14 : 8));
    const h = r.hover + (want - r.hover) * k;
    if (Math.abs(h - r.hover) > 1e-4 || (want === 0 && r.hover !== 0 && h < 1e-3)) {
      r.hover = h < 1e-3 && want === 0 ? 0 : h;
      r.tug = Q.reduced ? 0 : r.hover;
      r.mat.emissive.copy(r.mat.sheenColor).multiplyScalar(0.06 * r.hover);
      moved = true;
    }
  });
  if (moved && !state.riffle) {
    layoutRibbons(ribbons.lastPos, ribbons.lastMarks);
    renderer.shadowMap.needsUpdate = true;
  }
}

// ---------------------------------------------------------------- ribbon tooltip
// What a ribbon marks, on a small plaque (index.html, #ribbonTip): its tale's title, or for a tale
// not written yet a quiet "coming soon". For the ribbon under the pointer on a desktop, or the one
// whose button (#taleNav) has keyboard focus; never on touch, and gone at a press, while the book
// moves and during the intro. Placed every frame, as the ribbon lifts and the camera breathes:
// above the ribbon's tail where the book lies there, beside the fold when the ribbon runs down
// it, under the tail if nothing else fits; never over the ribbon, never off the screen.
const tip = { el: document.getElementById("ribbonTip"), i: -1, src: null, w: 0, h: 0, hiddenAt: -1e9 };
const fineHover = matchMedia("(hover: hover) and (pointer: fine)");
function showTip(i, src) {
  if (i < 0 || (state.intro && !state.intro.done) || busy()) return hideTip();
  if (tip.i === i && tip.src === src) return;
  const T = tales[i];
  // moving on from one ribbon to the next, the plaque follows without the wait
  tip.el.classList.toggle("instant", tip.i >= 0 || performance.now() - tip.hiddenAt < 300);
  tip.i = i;
  tip.src = src;
  tip.el.firstChild.textContent = T.available ? T.title[state.lang] : taleUi[state.lang].comingSoon;
  tip.el.classList.toggle("soon", !T.available);
  tip.el.classList.toggle("hover", src === "hover");
  tip.w = tip.el.offsetWidth;
  tip.h = tip.el.offsetHeight;
  placeTip();
  tip.el.classList.add("shown");
}
function hideTip(src = null) {
  if (tip.i < 0 || (src && tip.src !== src)) return;
  tip.i = -1;
  tip.src = null;
  tip.hiddenAt = performance.now();
  tip.el.classList.remove("shown");
}
// the language changed: the same plaque, its words in the other language
function retitleTip() {
  if (tip.i < 0) return;
  const { i, src } = tip;
  tip.i = -1;
  showTip(i, src);
}
const TP = new THREE.Vector3();
const TP2 = new THREE.Vector3();
function placeTip() {
  if (tip.i < 0) return;
  if ((state.intro && !state.intro.done) || busy()) return hideTip();
  const r = ribbons.ribbons[tip.i];
  if (!r.pick.length) return hideTip();
  const w = window.innerWidth;
  const h = window.innerHeight;
  const screen = (p) => (TP.copy(p).project(camera), [((TP.x + 1) / 2) * w, ((1 - TP.y) / 2) * h]);
  // the tail on screen, from where it leaves the page block down to its cut end
  const [tx, ty] = screen(r.pick[0]);
  const half = Math.max(3, Math.abs(screen(TP2.copy(r.pick[0]).setX(r.pick[0].x + RW / 2))[0] - tx)); // half its width, in px
  let [x0, y0, x1, y1] = [tx, ty, tx, ty];
  for (const p of r.pick) {
    const [x, y] = screen(p);
    [x0, y0, x1, y1] = [Math.min(x0, x), Math.min(y0, y), Math.max(x1, x), Math.max(y1, y)];
  }
  const keepOff = [[x0 - half, y0 - half, x1 + half, y1 + half]];
  // a ribbon lying in the gutter (this one or another) runs up the fold above its tail
  for (const g of ribbons.ribbons) {
    if (g.gut <= 0.2 || !g.pick.length) continue;
    const [gx, gy] = screen(g.pick[0]);
    keepOff.push([gx - half - 2, 0, gx + half + 2, gy]);
  }
  const gap = 10;
  const [tw, th] = [tip.w, tip.h];
  const spots = [
    [tx - tw / 2, ty - gap - th], // above the tail, centred
    [tx + half + gap, ty - gap - th], // above, beside the fold
    [tx - half - gap - tw, ty - gap - th],
    [(x0 + x1) / 2 - tw / 2, y1 + half + gap], // under the tail
  ].map(([x, y]) => [clamp(x, 8, w - 8 - tw), clamp(y, 8, h - 8 - th)]);
  const clear = ([x, y]) => keepOff.every(([a, b, c, d]) => x + tw <= a || x >= c || y + th <= b || y >= d);
  const [x, y] = spots.find(clear) || spots[0];
  tip.el.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px)`;
}

// ---------------------------------------------------------------- camera
// How the book is read on this screen (layout.mode, chosen by pickMode below): "spread", the
// whole open book; "single", one page at a time, the camera gliding across the spread before the
// leaf turns; "column", the same on a phone held upright, framing only the text column of the
// page (its margins run off the sides) at the height of its print; "pan", a phone on its side, a
// part of a spread at a time (see "pan reading"). `portrait()` is true while the book is read one
// page at a time (single, column or pan).
const layout = { mode: null };
const portrait = () => layout.mode === "single" || layout.mode === "column" || layout.mode === "pan";
// a touch screen held upright: smaller page textures and cache (memory), never the framing
const coarse = matchMedia("(pointer: coarse)");
const memCompact = () => coarse.matches && window.innerHeight > window.innerWidth;
const TMP = new THREE.Vector3();

// Fits a desk rectangle into the viewport for a camera tilted `tilt` rad from vertical (towards +z).
// Its corners are taken on the desk and `rect.y` over it; `rect.pts` (world points) stand in for
// them where what is framed is no box (the paper of the open pages, see paperPose).
function fitPose(rect, tilt, ndc) {
  const pts = rect.pts || [];
  if (!rect.pts) for (const x of [rect.x0, rect.x1]) for (const z of [rect.z0, rect.z1]) for (const y of [0.0, rect.y ?? 0.12]) pts.push(new THREE.Vector3(x, y, z));
  let [x0, x1, z0, z1] = [Infinity, -Infinity, Infinity, -Infinity];
  for (const p of pts) [x0, x1, z0, z1] = [Math.min(x0, p.x), Math.max(x1, p.x), Math.min(z0, p.z), Math.max(z1, p.z)];
  const target = new THREE.Vector3((x0 + x1) / 2, 0.06, (z0 + z1) / 2);
  const dir = new THREE.Vector3(0, Math.cos(tilt), Math.sin(tilt));
  let dist = 3.5;
  const cam = camera.clone();
  for (let it = 0; it < 24; it++) {
    cam.position.copy(target).addScaledVector(dir, dist);
    cam.lookAt(target);
    cam.updateMatrixWorld(true);
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const p of pts) {
      TMP.copy(p).project(cam);
      minX = Math.min(minX, TMP.x); maxX = Math.max(maxX, TMP.x);
      minY = Math.min(minY, TMP.y); maxY = Math.max(maxY, TMP.y);
    }
    const sx = (maxX - minX) / (ndc.x1 - ndc.x0);
    const sy = (maxY - minY) / (ndc.y1 - ndc.y0);
    const s = Math.max(sx, sy);
    // recentre: shift target so the box centre lands on the ndc centre
    const cx = (minX + maxX) / 2 - (ndc.x0 + ndc.x1) / 2;
    const cy = (minY + maxY) / 2 - (ndc.y0 + ndc.y1) / 2;
    const viewH = 2 * dist * Math.tan(THREE.MathUtils.degToRad(cam.fov / 2));
    target.x += (cx * viewH * cam.aspect) / 2;
    target.z -= ((cy * viewH) / 2) / Math.cos(tilt);
    dist *= 1 + (s - 1) * 0.85;
  }
  return { pos: target.clone().addScaledVector(dir, dist), target, dist };
}

// Fits world points into the viewport for a camera looking back along `dir` (target -> camera).
function fitPoints(points, dir, ndc, target0) {
  const target = target0.clone();
  let dist = 4;
  const cam = camera.clone();
  const right = new THREE.Vector3();
  const up = new THREE.Vector3();
  for (let it = 0; it < 30; it++) {
    cam.position.copy(target).addScaledVector(dir, dist);
    cam.lookAt(target);
    cam.updateMatrixWorld(true);
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const p of points) {
      TMP.copy(p).project(cam);
      minX = Math.min(minX, TMP.x); maxX = Math.max(maxX, TMP.x);
      minY = Math.min(minY, TMP.y); maxY = Math.max(maxY, TMP.y);
    }
    const s = Math.max((maxX - minX) / (ndc.x1 - ndc.x0), (maxY - minY) / (ndc.y1 - ndc.y0));
    const cx = (minX + maxX) / 2 - (ndc.x0 + ndc.x1) / 2;
    const cy = (minY + maxY) / 2 - (ndc.y0 + ndc.y1) / 2;
    const viewH = 2 * dist * Math.tan(THREE.MathUtils.degToRad(cam.fov / 2));
    right.setFromMatrixColumn(cam.matrixWorld, 0);
    up.setFromMatrixColumn(cam.matrixWorld, 1);
    target.addScaledVector(right, (cx * viewH * cam.aspect) / 2).addScaledVector(up, (cy * viewH) / 2);
    dist *= 1 + (s - 1) * 0.85;
  }
  return { pos: target.clone().addScaledVector(dir, dist), target, dist };
}

// The reading frame brings the book as close as the corner controls allow: the open book fills the
// space between the top and bottom controls (measured, in CSS px), and no control sits on it.
// Where that leaves the body text of the spread under EASY_PX (a tablet on its side, a small
// laptop window), the spread comes closer still, only as far as the type needs and at the most
// until the paper of both pages comes to FULL px from the screen's edges (past the safe areas):
// the boards' rim, the brass corners and the clasps run off the sides, and off the head and the
// tail where the screen is the wider, the ribbons last of all (spreadPose, paperPose). The corner
// controls then lie over the boards, the desk or a blank corner of the paper, never over the
// print, which keeps to the pages' wide margins. Between the frames the spread grows evenly, so a
// resize never jumps it.
// FRAME is a thin margin in world units round the boards: x (each side), head, tail; the
// ribbons' cut ends lie in the strip under the tail, beside the page controls.
// The text column frame (column mode) is the column of type between the page's margins, `pad` of
// paper either side as arc length along the page (none: the column itself comes to the screen's
// side margins), at the height of the page's print: from just over the running head's capitals
// (about 47 units under the head) to just under the folio (about 44 over the tail), the blank
// paper beyond them (`head`, `tail` short of the edges) left to lie under the controls. Everything
// a page prints keeps within its column (a plate's frame or a drop cap's sprig a little into the
// margin, where the camera's tilt leaves the column room), so the type reads as large as the
// screen's width or height allows.
const FRAME = {
  landscape: { x: 0.006, head: 0.004, tail: 0.004 },
  portrait: { x: 0.03, head: 0.008, tail: 0.012, spine: 0.04 },
  column: { pad: 0, head: 0.03, tail: 0.03 },
};
const GAP = 10; // px between a control and the book
// body text (CSS px, at REF_BODY as pickMode measures it: the screen decides, never the tale)
// under which the spread comes closer than the controls allow
const EASY_PX = 24;
const FULL = 10; // px between the screen's edges and the paper, at the closest
const TAILS = 0.085; // the ribbons' cut ends past the boards' tail (ribbons.js: TAIL + 0.07, give or take 0.01)
// the screen's safe areas (a notch, rounded corners), read once per resize from CSS
const safeProbe = document.createElement("div");
safeProbe.style.cssText = "position:fixed;left:0;top:0;visibility:hidden;pointer-events:none;padding:env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)";
document.body.appendChild(safeProbe);
const safe = { left: 0, right: 0, top: 0, bottom: 0 };
function readSafe() {
  const s = getComputedStyle(safeProbe);
  safe.left = parseFloat(s.paddingLeft) || 0;
  safe.right = parseFloat(s.paddingRight) || 0;
  safe.top = parseFloat(s.paddingTop) || 0;
  safe.bottom = parseFloat(s.paddingBottom) || 0;
}
function chromeInsets() {
  // layout boxes, not client rects: the controls slide a few px while they fade in (their own
  // CSS keeps them clear of the safe areas at the top and bottom)
  const [top, bottom] = els.chrome;
  return { top: Math.max(14, top.offsetTop + top.offsetHeight + GAP), bottom: Math.max(14, window.innerHeight - bottom.offsetTop + GAP), side: 10 + Math.max(safe.left, safe.right) };
}
const BOUNDS = { x: W + SQUARE + HINGE, z: D / 2 + SQUARE }; // as book.bounds, before the book is built
// The profile a page lies in now (before the book is built: the one it will have).
function profileOf(side) {
  const p = book && (side === "right" ? book.state.profR : book.state.profL);
  if (p) return p;
  const [hL, hR] = thicknessFor(gIndex(), TOTAL);
  return sideProfile(side === "right" ? hR : hL);
}
// The point of a profile at arc length s from the spine (x, y).
function arcPoint(prof, s) {
  let acc = 0;
  const n = prof.xs.length - 1;
  for (let i = 1; i <= n; i++) {
    const d = Math.hypot(prof.xs[i] - prof.xs[i - 1], prof.ys[i] - prof.ys[i - 1]);
    if (acc + d >= s || i === n) {
      const k = clamp01((s - acc) / (d || 1));
      return [prof.xs[i - 1] + (prof.xs[i] - prof.xs[i - 1]) * k, prof.ys[i - 1] + (prof.ys[i] - prof.ys[i - 1]) * k];
    }
    acc += d;
  }
  return [prof.xs[n], prof.ys[n]];
}
function columnRect(view) {
  const f = FRAME.column;
  const prof = profileOf(view);
  const sgn = view === "right" ? 1 : -1;
  // both pages keep the gutter margin towards the spine and the outer one towards the fore-edge
  const from = (TEXT_MARGINS.gutter / PAGE_UNITS_W) * W - f.pad;
  const to = (1 - TEXT_MARGINS.outer / PAGE_UNITS_W) * W + f.pad;
  const [xa, ya] = arcPoint(prof, from);
  const [xb, yb] = arcPoint(prof, to);
  return { x0: Math.min(sgn * xa, sgn * xb), x1: Math.max(sgn * xa, sgn * xb), z0: -D / 2 + f.head, z1: D / 2 - f.tail, y: Math.max(ya, yb) };
}
function readingPose(view = state.view, mode = layout.mode) {
  const bx = BOUNDS.x;
  const bz = BOUNDS.z;
  const ins = chromeInsets();
  const w = window.innerWidth;
  const h = window.innerHeight;
  const ndc = { x0: -1 + (2 * ins.side) / w, x1: 1 - (2 * ins.side) / w, y0: -1 + (2 * ins.bottom) / h, y1: 1 - (2 * ins.top) / h };
  if (mode === "column") return fitPose(columnRect(view), THREE.MathUtils.degToRad(10), ndc);
  if (mode === "pan") return panPose(view, mode === layout.mode);
  if (mode === "single") {
    const f = FRAME.portrait;
    const rect = view === "left" ? { x0: -bx - f.x, x1: f.spine, z0: -bz - f.head, z1: bz + f.tail, y: 0.04 } : { x0: -f.spine, x1: bx + f.x, z0: -bz - f.head, z1: bz + f.tail, y: 0.04 };
    return fitPose(rect, THREE.MathUtils.degToRad(10), ndc);
  }
  const f = FRAME.landscape;
  return spreadPose({ x0: -bx - f.x, x1: bx + f.x, z0: -bz - f.head, z1: bz + f.tail, y: 0.04 }, THREE.MathUtils.degToRad(12), ndc);
}
// The spread's frame (see "the reading frame"): the one between the controls (`ndc`), or, while
// its type reads under EASY_PX, one further along the way to the closest: first to the paper
// filling the screen with the ribbons whole under the tail, then on to the paper filling it with
// the ribbons cut at the boards' edge (paperPose). The way is taken only as far as brings the type
// to EASY_PX or, short of that, to the size the closest frame gives. On a screen about as tall as
// wide (a desktop window) the boards stay whole, as they always do upright: there the way ends at
// the frame between the controls, and from there to 5:4 it reaches further and further.
function spreadPose(rect, tilt, ndc) {
  const calm = fitPose(rect, tilt, ndc);
  const px = (pose) => (REF_BODY / 1000) * W * pxPerUnit(poseCamera(pose), "right");
  const p0 = px(calm);
  if (p0 >= EASY_PX) return calm;
  const wide = clamp01((window.innerWidth / window.innerHeight - 1) / 0.25);
  if (wide === 0) return calm;
  const stops = [calm, ...[true, false].map((ends) => mixPose(calm, paperPose(tilt, ends), wide))];
  const at = (k) => (k <= 1 ? mixPose(stops[0], stops[1], k) : mixPose(stops[1], stops[2], k - 1));
  const want = Math.min(px(stops[2]), EASY_PX);
  if (want < p0 + 0.05) return calm;
  let [lo, hi] = [0, 2];
  for (let it = 0; it < 12; it++) {
    const mid = (lo + hi) / 2;
    if (px(at(mid)) >= want - 0.02) hi = mid;
    else lo = mid;
  }
  return at(hi);
}
// A frame a share k of the way from one pose to another of the same tilt: the book only comes
// closer and moves across, every point on screen in both stays on screen between them.
function mixPose(a, b, k) {
  return { pos: a.pos.clone().lerp(b.pos, k), target: a.target.clone().lerp(b.target, k), dist: a.dist + (b.dist - a.dist) * k };
}
// The paper of both pages, for the thinnest and the thickest page block a side ever has (the left
// one on a tale's first spread, the right one), so that one frame holds every spread: along the
// head and the tail every few samples of the page's profile, the fore-edges running straight
// between their corners.
let paperPts = null;
function paperOutline() {
  if (paperPts) return paperPts;
  paperPts = [];
  for (const h of thicknessFor(0, 2)) {
    const prof = sideProfile(h);
    const n = prof.xs.length - 1;
    const samples = Array.from({ length: Math.ceil(n / 4) }, (_, k) => 4 * k).concat(n);
    for (const s of [-1, 1]) for (const i of samples) for (const z of [-D / 2, D / 2]) paperPts.push(new THREE.Vector3(s * prof.xs[i], prof.ys[i], z));
  }
  return paperPts;
}
// The print nearest the right page's outer corners, where the corner controls sit: the outer edge
// of the text column (pageArt.js TEXT_MARGINS), from the capitals of a running head (21 units on a
// baseline at 62; on the right page only where a closing text runs on) down to the foot of the
// frame round a full-page picture (122 units over the page's foot, the frame 20 more). Plates,
// choices and notes keep inside the column; the folio keeps to the middle of the foot.
const PRINT = { u: PAGE_UNITS_W - TEXT_MARGINS.outer, head: 46, foot: PAGE_UNITS_H - 102 };
let printPts = null;
function printCorners() {
  if (printPts) return printPts;
  printPts = { head: [], foot: [] };
  for (const h of thicknessFor(0, 2)) {
    const prof = sideProfile(h);
    printPts.head.push(pagePoint("right", PRINT.u, PRINT.head, prof));
    printPts.foot.push(pagePoint("right", PRINT.u, PRINT.foot, prof));
  }
  return printPts;
}
// The closest frame of the spread: the paper of both pages FULL px inside the screen's edges (past
// the safe areas), and under the tail the ribbons down to their cut ends (`ends`) or only across
// the boards' square, so that a ribbon is still there to be touched. Where a corner control would
// then lie over the print, the paper keeps clear of it on that side (by GAP), the book moving away
// from it or, with no room to move, standing back a little. The print coming out from beside the
// control (GAP clear of it already) is held off by a share of that, all of it once it reaches the
// control, so that as the screen grows the frame never jumps.
function paperPose(tilt, ends) {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const pts = [...paperOutline(), new THREE.Vector3(0, ends ? 0 : BT, ends ? BOUNDS.z + TAILS : BOUNDS.z)];
  const ndc = { x0: -1 + (2 * (FULL + safe.left)) / w, x1: 1 - (2 * (FULL + safe.right)) / w, y0: -1 + (2 * (FULL + safe.bottom)) / h, y1: 1 - (2 * (FULL + safe.top)) / h };
  const [top, bottom] = els.chrome;
  const print = printCorners();
  const screen = (p, cam) => (TMP.copy(p).project(cam), [((TMP.x + 1) / 2) * w, ((1 - TMP.y) / 2) * h]);
  const share = (x, c) => clamp01((x - c.offsetLeft + 3 * GAP) / (2 * GAP));
  let pose = fitPose({ pts }, tilt, ndc);
  for (let it = 0; it < 4; it++) {
    const cam = poseCamera(pose);
    // how far the print runs under each control (px), and where the framed points reach now
    let under = 0, over = 0, y0 = Infinity, y1 = -Infinity;
    for (const p of print.head) {
      const [x, y] = screen(p, cam);
      under = Math.max(under, (top.offsetTop + top.offsetHeight + GAP - y) * share(x, top));
    }
    for (const p of print.foot) {
      const [x, y] = screen(p, cam);
      over = Math.max(over, (y - bottom.offsetTop + GAP) * share(x, bottom));
    }
    if (under < 0.5 && over < 0.5) break;
    for (const p of pts) {
      const y = screen(p, cam)[1];
      [y0, y1] = [Math.min(y0, y), Math.max(y1, y)];
    }
    if (under >= 0.5) ndc.y1 = Math.min(ndc.y1, 1 - (2 * (y0 + under)) / h);
    if (over >= 0.5) ndc.y0 = Math.max(ndc.y0, -1 + (2 * (h - y1 + over)) / h);
    pose = fitPose({ pts }, tilt, ndc);
  }
  return pose;
}

// ---------------------------------------------------------------- pan reading
// A phone held sideways, too short for a page, reads it a part at a time. Each spread
// is an ordered list of camera stops in reading order (panStops): a page's text in one to three
// bands, cut between lines and evened out, each framed so the body text comes to PAN.px..maxPx; a
// picture whole, as large as it goes; the choices, a "Did you know" note, the epigraph, the title
// with its medallion, a tale's closing emblem and the clasp each whole. The controls keep to the
// corners (index.html), so a stop takes the full height between them (box A) or, where that gives
// it more room, the full width between the top and bottom controls (box B). Forward is the next
// stop, and from the last one the leaf turns and the camera lands on the next spread's first stop
// (back: on the previous spread's last); a choice still to be made holds the last stop, as the
// gate holds the leaf. Between stops the camera glides as it does across a spread in portrait.
const PAN = {
  px: 17.5, // body text at the least, CSS px (the band of type a stop holds is sized for it)
  maxPx: 18.5, // ... and at the most (a short band is framed with more of the page round it)
  pad: 26, // page units of paper round a band of type
  frame: 24, // ... round a part framed whole
  up: 1.35, // a part framed whole comes at most this much closer than the type
  rowPx: 46, // ... but always close enough for a choice's row to be this tall (CSS px)
  rowUnits: 92.5, // a choice row on a plate page, page units (pageArt.js choicesBlock, size 37)
  dur: 0.85, // s, the glide from stop to stop
  tilt: THREE.MathUtils.degToRad(10),
};
state.stop = 0;
const panMemo = new Map();
const PAN_DIR = new THREE.Vector3(0, Math.cos(PAN.tilt), Math.sin(PAN.tilt));
// The two boxes a stop may fill, in NDC (and their size in CSS px).
function panBoxes() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const [top, bottom] = els.chrome;
  const tabs = els.taleNav.getBoundingClientRect();
  const clearL = Math.max(10 + safe.left, tabs.width > 2 ? tabs.right + GAP : 0);
  const clearR = Math.max(10 + safe.right, w - Math.min(top.offsetLeft, bottom.offsetLeft) + GAP);
  const ins = chromeInsets();
  const box = (x0, x1, y0, y1) => ({ x0: -1 + (2 * x0) / w, x1: -1 + (2 * x1) / w, y0: 1 - (2 * y1) / h, y1: 1 - (2 * y0) / h, w: x1 - x0, h: y1 - y0 });
  // A sits between the corner controls (a little off centre, where they differ in width)
  return { A: box(clearL, w - clearR, 8 + safe.top, h - 8 - safe.bottom), B: box(ins.side, w - ins.side, ins.top, h - ins.bottom) };
}
// A point of a page given in page units (as pageArt draws it), in world space.
// Past its edges (a frame grown round a part) the page runs on flat: over the spine onto the
// other page, past the fore-edge onto the desk.
function pagePoint(side, u, v, prof = profileOf(side)) {
  const a = ((side === "right" ? u : PAGE_UNITS_W - u) / PAGE_UNITS_W) * W; // arc from the spine
  const n = prof.xs.length - 1;
  const [x, y] = a <= 0 ? [a, prof.ys[0]] : a >= W ? [prof.xs[n] + a - W, prof.ys[n]] : arcPoint(prof, a);
  return new THREE.Vector3(side === "right" ? x : -x, y, -D / 2 + (v / (PAGE_UNITS_W * PAGE_ASPECT)) * D);
}
// CSS px per page unit at a point of the page, from a pose.
function panZoom(pose, side, u, v) {
  const cam = poseCamera(pose);
  PA.copy(pagePoint(side, u, v)).project(cam);
  PB.copy(pagePoint(side, u + 10, v)).project(cam);
  return Math.hypot(((PB.x - PA.x) * window.innerWidth) / 2, ((PB.y - PA.y) * window.innerHeight) / 2) / 10;
}
// Frames a rectangle of a page (page units) in the box that brings it closest, never closer than
// zMax px per unit: the rectangle then grows, round its centre, or (`up`, a band of type) upwards
// from its foot, so what the frame shows more of is what was read already, never the next lines
// cut off at the bottom of the screen.
function panFit(side, r, boxes, zMax, up = false) {
  let best = null;
  for (const box of boxes) {
    let rr = r;
    let f = null;
    for (let it = 0; it < 4; it++) {
      const pts = [];
      for (const u of [rr.x0, (rr.x0 + rr.x1) / 2, rr.x1]) for (const v of [rr.y0, rr.y1]) pts.push(pagePoint(side, u, v));
      const cu = (rr.x0 + rr.x1) / 2;
      const cv = (rr.y0 + rr.y1) / 2;
      const pose = fitPoints(pts, PAN_DIR, box, pagePoint(side, cu, cv));
      f = { pose, zoom: panZoom(pose, side, cu, cv), rect: rr };
      if (f.zoom <= zMax * 1.01) break;
      const k = f.zoom / zMax;
      const hw = ((rr.x1 - rr.x0) / 2) * k;
      const hh = ((rr.y1 - rr.y0) / 2) * k;
      rr = up ? { x0: cu - hw, x1: cu + hw, y0: rr.y1 - 2 * hh, y1: rr.y1 } : { x0: cu - hw, x1: cu + hw, y0: cv - hh, y1: cv + hh };
    }
    if (!best || f.zoom > best.zoom + 1e-3) best = f;
  }
  return best;
}
// Lines of type (sorted, page units, `p` = the paragraph each belongs to) gathered into bands no
// taller than `limit`, never cutting a line; a band that would end inside a paragraph ends at the
// paragraph before instead, if it is still more than half full (the eye then moves on at a break).
function panBands(lines, limit) {
  const out = [];
  for (let s = 0; s < lines.length; ) {
    let e = s;
    while (e + 1 < lines.length && lines[e + 1].y1 - lines[s].y0 <= limit) e++;
    if (e + 1 < lines.length && lines[e].p === lines[e + 1].p) {
      for (let j = e - 1; j >= s; j--) {
        if (lines[j].p === lines[j + 1].p) continue;
        if (lines[j].y1 - lines[s].y0 >= 0.55 * limit) e = j;
        break;
      }
    }
    out.push([lines[s].y0, Math.max(...lines.slice(s, e + 1).map((l) => l.y1))]);
    s = e + 1;
  }
  return out;
}
function panStops(t = state.tale, i = state.spread) {
  // the body size is part of the key: stops asked for before any page is drawn (the page size
  // estimated as the desk is built) are measured at REF_BODY, and must not stand in for the real ones
  const body = artist.lastBodySize || REF_BODY;
  const key = `${t}|${i}|${state.lang}|${choiceKey(t)}|${window.innerWidth}x${window.innerHeight}|${pageSize.h}|${body}`;
  if (panMemo.has(key)) return panMemo.get(key);
  const boxes = panBoxes();
  const zText = PAN.px / body;
  const zMaxText = PAN.maxPx / body;
  const zMaxWhole = Math.max(zText * PAN.up, PAN.rowPx / PAN.rowUnits);
  // a band of type sits between the corner controls if the column fits there at that size; on a
  // narrower phone (under ~640 px on its side) across the full width between the top and bottom
  // controls instead: lower bands, so more of them, but the type keeps its size
  const colW = PAGE_UNITS_W - TEXT_MARGINS.gutter - TEXT_MARGINS.outer + 2 * PAN.pad;
  const textBox = colW * zText <= boxes.A.w ? boxes.A : boxes.B;
  const limit = textBox.h / zText - 2 * PAN.pad; // the tallest band of type a stop can hold
  const stops = [];
  const grow = (r, m) => ({ x0: r.x - m, x1: r.x + r.w + m, y0: r.y - m, y1: r.y + r.h + m });
  const union = (rs) => ({ x: Math.min(...rs.map((r) => r.x)), y: Math.min(...rs.map((r) => r.y)), w: Math.max(...rs.map((r) => r.x + r.w)) - Math.min(...rs.map((r) => r.x)), h: Math.max(...rs.map((r) => r.y + r.h)) - Math.min(...rs.map((r) => r.y)) });
  for (const side of ["left", "right"]) {
    const e = getPage(t, i, side);
    const regs = e.regions || [];
    const own = [];
    const whole = (kind, r) => own.push({ side, kind, at: r.y, region: r, ...panFit(side, grow(r, PAN.frame), [boxes.A, boxes.B], zMaxWhole) });
    const text = regs.filter((r) => r.role === "text");
    if (text.length) {
      const k = PAGE_UNITS_W / e.canvas.width;
      const col = union(text);
      const para = (l) => text.findIndex((r) => (l.y0 + l.y1) / 2 >= r.y && (l.y0 + l.y1) / 2 <= r.y + r.h);
      const ls = e.lines.map((l) => ({ y0: l.y * k, y1: (l.y + l.h) * k })).map((l) => ({ ...l, p: para(l) })).filter((l) => l.p >= 0).sort((a, b) => a.y0 - b.y0);
      // as few bands as the size allows, then evened out: the least height that still needs no more
      const n = panBands(ls, limit).length;
      let [lo, hi] = [0, limit];
      for (let it = 0; it < 16; it++) {
        const mid = (lo + hi) / 2;
        if (panBands(ls, mid).length <= n) hi = mid;
        else lo = mid;
      }
      for (const [y0, y1] of panBands(ls, hi)) {
        const r = { x: col.x, y: y0, w: col.w, h: y1 - y0 };
        own.push({ side, kind: "text", at: y0, region: r, ...panFit(side, grow(r, PAN.pad), [textBox], zMaxText, true) });
      }
    }
    for (const r of regs) if (["picture", "choices", "note", "emblem", "epigraph"].includes(r.role)) whole(r.role, r);
    const title = regs.filter((r) => r.role === "title" || r.role === "medallion");
    if (title.length) whole("title", union(title));
    const clasp = regs.filter((r) => r.role === "clasp" || r.role === "vignette");
    if (regs.some((r) => r.role === "clasp")) whole("clasp", union(clasp));
    if (!own.length) whole("page", { x: 0, y: 0, w: PAGE_UNITS_W, h: PAGE_UNITS_W * PAGE_ASPECT });
    stops.push(...own.sort((a, b) => a.at - b.at));
  }
  stops.textBox = textBox === boxes.A ? "A" : "B";
  panMemo.set(key, stops);
  if (panMemo.size > 12) panMemo.delete(panMemo.keys().next().value);
  return stops;
}
// The pose of the stop the reader is at (on `view`'s page: a stop on the other page gives way to
// that page's first). `live`: the reader is in pan mode, so that becomes their stop.
function panPose(view, live) {
  // mid-turn (a phone turned on its side while the leaf is in the air) the spread it lands on
  const S = panStops(state.tale, state.turning?.to ?? state.spread);
  let k = clamp(state.stop, 0, S.length - 1);
  if (S[k].side !== view) k = Math.max(0, S.findIndex((s) => s.side === view));
  if (live) panHere(S, k);
  return S[k].pose;
}
// The stop the reader is at, and where on the page it lies (kept across a turn to portrait).
const panAt = { tale: -1, spread: -1, side: "right", at: null };
function panHere(S, k) {
  state.stop = k;
  const s = S[k];
  Object.assign(panAt, { tale: state.tale, spread: state.turning?.to ?? state.spread, side: s.side, at: (s.rect.y0 + s.rect.y1) / 2 });
}
// Glides to stop k of spread i (during a turn: of the spread the leaf is turning to).
function setStop(k, now, dur = PAN.dur, i = state.spread) {
  const S = panStops(state.tale, i);
  panHere(S, clamp(k, 0, S.length - 1));
  panAt.spread = i;
  state.view = S[state.stop].side;
  moveCamera(S[state.stop].pose, dur, now);
  syncChrome();
}
// Where in the spread the reader is (the page, and how far down it), so that a resize or a new
// language, which may cut the spread into other stops, lands on the stop over the same place.
// Lands on a spread just opened: its first stop (1), its last (-1), or its title ("title").
function panLand(where, now) {
  const S = panStops();
  setStop(where === "title" ? Math.max(0, S.findIndex((s) => s.side === "right")) : where < 0 ? S.length - 1 : 0, now);
}
function panAnchor() {
  const same = panAt.tale === state.tale && panAt.spread === state.spread && panAt.side === state.view;
  return { side: state.view, at: same ? panAt.at : null };
}
function panRestop(a) {
  const S = panStops();
  let k = S.findIndex((s) => s.side === a.side);
  if (a.at !== null) {
    let best = Infinity;
    S.forEach((s, j) => {
      const d = s.side === a.side ? Math.abs((s.rect.y0 + s.rect.y1) / 2 - a.at) : Infinity;
      if (d < best) [best, k] = [d, j];
    });
  }
  panHere(S, Math.max(0, k));
  state.view = S[state.stop].side;
}

// Body text size on screen in CSS px (measured at the middle of the page in view).
const PA = new THREE.Vector3();
const PB = new THREE.Vector3();
function bodyPx(cam = camera) {
  if (!book || !artist?.lastBodySize) return null;
  return +((artist.lastBodySize / 1000) * W * pxPerUnit(cam, portrait() ? state.view : "right")).toFixed(1);
}
// CSS px per world unit along a page, at its middle, as `cam` sees it.
function pxPerUnit(cam, side) {
  const prof = profileOf(side);
  const s = side === "right" ? 1 : -1;
  const i = Math.floor(prof.xs.length * 0.6);
  PA.set(s * prof.xs[i - 2], prof.ys[i - 2], 0).project(cam);
  PB.set(s * prof.xs[i + 2], prof.ys[i + 2], 0).project(cam);
  const arc = Math.hypot(prof.xs[i + 2] - prof.xs[i - 2], prof.ys[i + 2] - prof.ys[i - 2]);
  return Math.hypot(((PB.x - PA.x) * window.innerWidth) / 2, ((PB.y - PA.y) * window.innerHeight) / 2) / arc;
}
// A camera standing at a pose (for measuring a pose before the camera moves there).
const poseCam = camera.clone();
function poseCamera(pose) {
  poseCam.aspect = camera.aspect;
  poseCam.updateProjectionMatrix();
  poseCam.position.copy(pose.pos);
  poseCam.lookAt(pose.target);
  poseCam.updateMatrixWorld(true);
  return poseCam;
}

// The reading mode: the first of spread, single page, text column whose body text comes to at
// least READ_PX on this screen, measured through the camera each would use. A mode is kept until
// its text falls HYST under that, and one before it is taken up only HYST over it, so an iOS
// toolbar sliding in or out (or a tale set a size smaller) never flips it. When none reads that
// large, a phone on its side (short and wide) reads a part of a spread at a time ("pan", see "pan
// reading"); any other screen gets the mode that reads largest. A screen wider than tall always
// shows the whole spread (one page at a time only ever reads larger on an upright one). Only the
// viewport's size and aspect decide. ?mode= forces one, for review: spread, single, column, pan.
const READ_PX = 16;
const HYST = 0.8;
const REF_BODY = 40; // page units: the smallest body size of any tale and language (pageArt.js SIZES)
const MODES = ["spread", "single", "column"];
function pickMode() {
  if ([...MODES, "pan"].includes(rp.get("mode"))) return rp.get("mode");
  const w = window.innerWidth;
  const h = window.innerHeight;
  const cur = MODES.indexOf(layout.mode); // -1 at first, or while turned sideways
  const upright = h > w * (portrait() ? 1 : 1.05);
  const px = MODES.map((m) => (REF_BODY / 1000) * W * pxPerUnit(poseCamera(readingPose(state.view, m)), m === "spread" ? "right" : state.view));
  layout.px = Object.fromEntries(MODES.map((m, k) => [m, +px[k].toFixed(1)]));
  const open = upright ? MODES.length : 1;
  for (let k = 0; k < open; k++) {
    const need = k === cur ? READ_PX - HYST : cur >= 0 && k < cur ? READ_PX + HYST : READ_PX;
    if (px[k] >= need) return MODES[k];
  }
  if (w > h && h < 500) return "pan";
  return MODES[px.slice(0, open).reduce((best, v, k) => (v > px[best] + 1 ? k : best), 0)];
}

function introStartPose() {
  // from the front left and fairly low: the closed book with its tooled cover and raised-band
  // spine, the candle beside it, and a glimpse of the room beyond the desk
  const pts = [];
  for (const x of [-0.09, 1.1]) for (const z of [-0.79, 0.79]) for (const y of [0, 0.17]) pts.push(new THREE.Vector3(x, y, z));
  for (const [x, y, z] of [[CANDLE.x - 0.17, 0, CANDLE.z], [CANDLE.x, 0.46, CANDLE.z], [CANDLE.x, 0, CANDLE.z + 0.17]]) pts.push(new THREE.Vector3(x, y, z));
  // steeper on narrow screens, so the desk rather than the dark floor fills the height
  const up = THREE.MathUtils.clamp(0.55 + (1.3 - camera.aspect) * 1.4, 0.55, 1.45);
  const dir = new THREE.Vector3(-0.2, up, 0.81).normalize();
  return fitPoints(pts, dir, { x0: -0.9, x1: 0.92, y0: -0.82, y1: 0.62 }, new THREE.Vector3(0.1, 0.1, -0.2));
}

const cam = { pose: null, from: null, to: null, t0: 0, dur: 0, settle: -10 };
// The reader's slow breath: the camera drifts a few px, never quite still. `amount` grows it in
// (the intro).
function breathe(pos, dist, t, amount = 1) {
  pos.x += Math.sin(t * 0.21) * 0.0035 * dist * amount;
  pos.z += Math.sin(t * 0.17 + 1.1) * 0.0025 * dist * amount;
  pos.y += Math.sin(t * 0.13 + 2.0) * 0.002 * dist * amount;
}
function moveCamera(to, dur, now) {
  cam.from = { pos: camera.position.clone(), target: cam.pose.target.clone() };
  cam.to = to;
  cam.t0 = now;
  cam.dur = dur;
}

// Page-texture resolution: about one texel per device pixel of the page at rest. And whether the
// pages are set for column mode, where the camera frames only the text column and a page's choices
// are set larger (pageArt.js choicesBlock). True when the pages must be drawn again.
function updatePageSize() {
  const column = layout.mode === "column";
  const relaid = column !== pageSize.column;
  pageSize.column = column;
  const pose = readingPose(state.view);
  const c = camera.clone();
  c.position.copy(pose.pos);
  c.lookAt(pose.target);
  c.updateMatrixWorld(true);
  const a = new THREE.Vector3(W / 2, 0.1, -D / 2).project(c);
  const b = new THREE.Vector3(W / 2, 0.1, D / 2).project(c);
  const px = (Math.abs(a.y - b.y) / 2) * window.innerHeight * DPR;
  const maxH = Math.min(renderer.capabilities.maxTextureSize, memCompact() || LOW ? 2048 : 2560);
  const h = clamp(Math.round((px * 1.04) / 16) * 16, 1024, maxH);
  if (Math.abs(h - pageSize.h) / pageSize.h > 0.12) {
    pageSize.h = h;
    pageSize.w = Math.round(h / PAGE_ASPECT);
    return true;
  }
  return relaid;
}

// ---------------------------------------------------------------- DOM: chrome + mirror
const els = {
  mirror: document.getElementById("mirror"),
  taleNav: document.getElementById("taleNav"),
  indicator: document.getElementById("indicator"),
  pageNow: document.getElementById("pageNow"),
  pageOf: document.getElementById("pageOf"),
  pageSr: document.getElementById("pageSr"),
  prev: document.getElementById("prev"),
  next: document.getElementById("next"),
  langGroup: document.getElementById("langGroup"),
  chrome: [document.getElementById("chromeTop"), document.getElementById("chromeBottom")],
  veil: document.getElementById("veil"),
  perf: document.getElementById("perf"),
  clasp: document.getElementById("clasp"),
  stops: document.getElementById("stops"),
  sound: document.getElementById("soundToggle"),
  gate: document.getElementById("gate"),
  gateVeil: document.getElementById("gateVeil"),
};
const esc = (s = "") => s.replace(/[&<>"]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[ch]);

function syncChrome() {
  const L = ui[state.lang];
  document.documentElement.lang = state.lang;
  syncNotices();
  const s = spreads()[state.spread];
  // the plaque shows a short label (Wstęp, 3 / 10, Koniec); screen readers hear the full words
  const n = story()?.PAGE_COUNT;
  const last = s.page > 0 && state.spread === spreads().length - 1;
  els.pageNow.textContent = s.page === 0 ? L.intro : last ? L.theEnd : String(s.page);
  els.pageOf.textContent = s.page === 0 || last ? "" : `/ ${n}`;
  const waits = awaitsChoice();
  const sr = s.page === 0 ? L.titlePage : last ? `${L.pageCount(s.page, n)}, ${L.theEnd.toLowerCase()}` : waits ? `${L.pageCount(s.page, n)}, ${L.awaitsChoice}` : L.pageCount(s.page, n);
  // the plaque is a live region: only a real change is read out
  if (els.pageSr.textContent !== sr) els.pageSr.textContent = sr;
  els.indicator.style.setProperty("--progress", spreads().length > 1 ? state.spread / (spreads().length - 1) : 0);
  // pan reading: a gilt dot for every stop of the spread, the one in view lit
  const dots = layout.mode === "pan" && book ? panStops(state.tale, state.turning?.to ?? state.spread).map((_, k) => `<i${k === state.stop ? ' class="on"' : ""}></i>`).join("") : "";
  if (els.stops.innerHTML !== dots) els.stops.innerHTML = dots;
  // on the first and the last spread the arrows rest only once nothing is left that way: read one
  // page at a time, the spread's other page (in pan, its other stops) is still to come
  els.prev.disabled = state.spread === 0 && !moreOfSpread(-1);
  els.next.disabled = state.spread === spreads().length - 1 && !moreOfSpread(1);
  // held at a choice, the next arrow rests dimmed but stays a button: a press shows why
  const held = nextHeld();
  els.next.setAttribute("aria-disabled", String(held));
  els.prev.setAttribute("aria-label", L.prev);
  els.next.setAttribute("aria-label", held ? L.nextAfterChoice : L.next);
  els.langGroup.setAttribute("aria-label", L.langLabel);
  els.langGroup.dataset.lang = state.lang;
  els.langGroup.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.lang === state.lang)));
  syncSound();
}
// Whether, read one page at a time, the spread holds more on its way (dir: 1 on, -1 back): the
// other page in portrait, the next or the previous stop in pan (as go() moves before it turns).
function moreOfSpread(dir) {
  if (layout.mode === "pan") {
    const n = book ? panStops(state.tale, state.turning?.to ?? state.spread).length : 1;
    const k = clamp(state.stop, 0, n - 1);
    return dir > 0 ? k < n - 1 : k > 0;
  }
  if (portrait()) return state.view === (dir > 0 ? "left" : "right");
  return false;
}
// The sound toggle: a round plaque beside the language, pressed while the book has sound.
function syncSound() {
  const L = ui[state.lang];
  const on = sound.isEnabled();
  els.sound.setAttribute("aria-pressed", String(on));
  els.sound.setAttribute("aria-label", L.soundLabel);
  els.sound.title = on ? L.soundOn : L.soundOff;
  els.gate.setAttribute("aria-label", L.openBook);
  els.gate.querySelector(".label").textContent = L.openBook;
}

// One real button per available tale (keyboard and screen readers); unavailable tales are not
// listed at all, exactly as their ribbons do not respond. Updated in place so focus survives.
// A tale's ribbon as a tab: woven silk in its dye (warp threads, taffeta ribs, a satin sheen,
// darker selvedges with a light thread inside), cut swallow-tailed with a few stray threads, and
// its motif embroidered in gold thread above the cut, as on the ribbons in the book (ribbons.js).
// The weave, the light and the motifs are shared (index.html, #silkDefs); the dye is --ribbon.
const SILK_CUT = "M0 0H28V62L14 54L0 62Z";
function silkTab(motif) {
  const m = (fill, dy = 0) => `<use href="#motif-${motif}" x="7.5" y="${36.5 + dy}" width="13" height="13" fill="${fill}"/>`;
  const rect = (x, w, fill) => `<rect x="${x}" width="${w}" height="62" fill="${fill}"/>`;
  return `<span class="silk" aria-hidden="true"><svg viewBox="0 0 28 62" focusable="false"><path class="dye" d="${SILK_CUT}"/><g clip-path="url(#silkCut)">${["silkWarp", "silkRibs", "silkSheen", "silkFall"].map((f) => rect(0, 28, `url(#${f})`)).join("")}${rect(0, 2.4, "rgba(0,0,0,0.3)")}${rect(25.6, 2.4, "rgba(0,0,0,0.3)")}${rect(3, 0.55, "rgba(255,238,210,0.3)")}${rect(24.45, 0.55, "rgba(255,238,210,0.3)")}</g><path class="thread" d="M7.5 58.4q-.2 1.6-1 2.6M20.8 58.6q.3 1.5 1.1 2.4"/>${m("rgba(20,8,4,0.55)", 0.9)}${m("url(#silkGold)")}${m("url(#silkStitch)")}</svg></span>`;
}
function syncTaleNav() {
  const T = taleUi[state.lang];
  els.taleNav.setAttribute("aria-label", T.talesLabel);
  const list = tales.filter((t) => t.available);
  if (els.taleNav.children.length !== list.length) {
    // each button carries its tale's name (for screen readers) and, framed one page at a time,
    // shows as the tale's silk ribbon hanging from the headcap (index.html, "silk tabs")
    els.taleNav.innerHTML = list.map((t) => `<button type="button" data-tale="${t.index}" data-motif="${t.ribbon.motif}">${silkTab(t.ribbon.motif)}<span class="label"></span></button>`).join("");
    panMemo.clear(); // a stop keeps clear of the tabs (panBoxes): measured again with these
  }
  els.taleNav.style.setProperty("--n", String(list.length));
  [...els.taleNav.children].forEach((b) => {
    const t = tales[Number(b.dataset.tale)];
    b.querySelector(".label").textContent = T.goToTale(t.title[state.lang]);
    b.style.setProperty("--ribbon", t.ribbon.color);
    if (t.index === state.tale) b.setAttribute("aria-current", "true");
    else b.removeAttribute("aria-current");
  });
}

function syncMirror() {
  const L = ui[state.lang];
  const s = spreads()[state.spread];
  const alt = (entry) => entry?.alt?.[state.lang] || "";
  if (s.layout === "taleTitle") {
    const t = s.tale;
    els.mirror.innerHTML = `<article lang="${state.lang}"><p>${esc(L.bookTitle)}</p><h1>${esc(t.title[state.lang])}</h1><p>${esc(t.kicker[state.lang])}</p><p>${esc(taleUi[state.lang].placeholderNote.replace("\n", " "))}</p></article>`;
    return;
  }
  if (s.page === 0) {
    const meta = story().storyMeta(state.lang);
    // the epigraph read as one sentence, then its source
    const E = tales[state.tale].epigraph?.[state.lang];
    const lead = E ? `<blockquote><p>${esc(E.lines.join(" "))}</p><p>— ${esc(E.author)}, ${esc(E.work)}${E.note ? ` (${esc(E.note)})` : ""}</p></blockquote>` : `<p>${esc(L.dedication.replace("\n", " "))}</p>`;
    els.mirror.innerHTML = `<article lang="${state.lang}"><p>${esc(L.bookTitle)}</p><h1>${esc(meta.title)}</h1><p>${esc(meta.kicker)}</p>${lead}<p>${esc(L.turnToBegin)}</p></article>`;
    return;
  }
  const t = story().pageText(s.page, resolved(), state.lang);
  const img = spreadImage(s, resolved());
  const selected = state.choices[s.page];
  els.mirror.innerHTML = `<article lang="${state.lang}">
    <h2>${esc(L.pageCount(s.page, story().PAGE_COUNT))}: ${esc(t.title)}</h2>
    ${t.paragraphs.map((p) => `<p>${esc(p.text)}</p>`).join("")}
    ${img ? `<figure><figcaption>${esc(L.illustration)}: ${esc(alt(img))}</figcaption></figure>` : ""}
    ${t.choices.length ? `<div class="choices" role="group" aria-label="${esc(L.choose)}">${t.choices.map((c) => `<button type="button" data-choice="${esc(c.id)}" aria-pressed="${selected === c.id}"${selected ? ' aria-disabled="true"' : ""}>${esc(c.label)}</button>`).join("")}</div>` : ""}
    ${selected ? `<p>${esc(t.choices.find((c) => c.id === selected)?.response || "")}</p>` : t.choices.length ? `<p>${esc(L.turnsAfterChoice)}</p>` : ""}
    ${t.ending ? `<div class="choices"><button type="button" data-choice="restart">${esc(L.restartStory)}</button></div>` : ""}
    ${t.note ? `<aside><h3>${esc(t.note.title)}</h3><p>${esc(t.note.body)}</p></aside>` : ""}
  </article>`;
}

// ---------------------------------------------------------------- interaction
const busy = () => Boolean(state.turning || state.fade || state.riffle);
// Where the reader is, as the sound script (soundscape.js) knows it: the tale, its story page, the choices.
const soundSpot = (t = state.tale, i = state.spread) => ({ tale: tales[t].id, page: tales[t].spreads[i]?.page ?? 0, resolved: resolved(t) });

// A choice is sealed for good: going back to its page, the reader finds it made; the other seal
// no longer answers at all (its row still takes the touch, so it never turns the page), and a
// press on the chosen one only makes it glow once (no words, no tone). Only "Start over" (the
// clasp on the tale's last page) breaks the seals.
function choose(id) {
  if (id === "restart") return restart();
  const page = spreads()[state.spread].page;
  if (!page) return;
  if (state.choices[page]) return state.choices[page] === id ? glintSeals() : undefined;
  const shown = [book.leftMat.map, book.rightMat.map];
  const held = nextHeld();
  state.choices[page] = id;
  invalidatePages();
  applySpread();
  shown.forEach(dropTexture);
  syncChrome();
  syncMirror();
  prefetch();
  sealChoice();
  if (held) wakeNext();
  // wax, the response written in, then the harp: the first and the last choice of a tale have their own
  const pages = story().CHOICE_PAGES;
  sound.choice({ index: pages.indexOf(page), count: pages.length });
}

// Start over (the clasp on a tale's last page): the leaves riffle back to the tale's title spread,
// as they do to another tale's (see "tale switch"), only quicker and with fewer leaves the fewer
// spreads there are to go back; the last settles on the title spread as the tale's ribbon is drawn
// up into the fold with it, and the page blocks thin and thicken as the leaves land. The pages the
// reader sees leave on the first leaf as they are; the choices are forgotten behind them, so a page
// drawn without them only ever comes into view under a leaf. Upright, the camera glides to the
// title page (pan: its title stop) while the leaves fly, landing as the last one does. Reduced
// motion: a gentle crossfade, the blocks and the ribbon going over with it.
const RESTART = { lead: 0.1, leaf: 0.6, last: 0.86, gap: 0.08 };
function restart() {
  if (busy()) return;
  const now = performance.now() / 1000;
  const shown = { L: book.leftMat.map, R: book.rightMat.map };
  state.choices = {};
  invalidatePages();
  if (Q.reduced || !startRiffle(state.tale, now, Q.restartAt, { from: shown, pace: RESTART })) {
    if (portrait()) setView("right", now);
    crossfade(0, state.tale, -1, 0.6);
    state.fade.drop = [shown.L, shown.R];
    sound.startOver({ reduced: true, total: 0.6 }); // the clasp, then a soft rustle back
    return;
  }
  const R = state.riffle;
  sound.startOver(R); // the clasp, then the leaves riffling back
  const glide = Math.max(0.6, R.total - 0.1);
  if (layout.mode === "pan") {
    const S = panStops(state.tale, 0);
    setStop(Math.max(0, S.findIndex((s) => s.side === "right")), now, glide, 0);
  } else if (portrait() && state.view !== "right") setView("right", now, glide);
}

function setLang(lang) {
  if (lang === state.lang || state.riffle) return; // the leaves in flight carry this language's pages
  saveLang(lang);
  const shown = [book.leftMat.map, book.rightMat.map];
  const from = shownPages(); // what the reader sees now: the type to rewrite
  const anchor = panAnchor();
  state.lang = lang;
  invalidatePages();
  applySpread();
  if (layout.mode === "pan") {
    panRestop(anchor); // the other language's lines may cut the spread into other stops
    moveCamera(panStops()[state.stop].pose, PAN.dur, performance.now() / 1000);
  }
  shown.forEach(dropTexture);
  rewriteSpread(from);
  sound.language({ rewrite: state.ink?.total || 0 }); // the gilt slider, and the quill if the spread is rewritten
  retitleCover(lang);
  syncChrome();
  syncMirror();
  syncTaleNav();
  retitleTip();
}

// The cover's title, in the book's language: set as the desk is built, and after a language switch
// set again once the spread has been rewritten, in idle time (the cover lies face down under the
// open book), from the cover art decoded again (its pixels are let go after each bake).
let coverJob = 0;
function retitleCover(lang) {
  const job = ++coverJob;
  const idle = window.requestIdleCallback || ((f) => setTimeout(f, 50));
  const after = state.intro && !state.intro.done ? 0 : (state.ink?.total || 0) * 1000 + 200;
  setTimeout(
    () =>
      loadCoverArt().then((art) =>
        idle(
          () => {
            if (job === coverJob && art.map && art.normal && art.orm) book.makeCover(ui[lang].bookTitle, ui[lang].bookSubtitle, art);
            closeArt(art);
          },
          { timeout: 1500 }
        )
      ),
    after
  );
}

function go(dir) {
  if (state.intro && !state.intro.done) return skipIntro();
  if (busy()) return;
  const now = performance.now() / 1000;
  const pan = layout.mode === "pan";
  if (pan) {
    // a part of the spread at a time: the next stop, and from the last the leaf
    const n = panStops().length;
    const k = clamp(state.stop, 0, n - 1);
    if (dir > 0 && k < n - 1) return setStop(k + 1, now);
    if (dir < 0 && k > 0) return setStop(k - 1, now);
  } else if (portrait()) {
    // one page at a time: first glide across the spread, then turn the leaf
    if (dir > 0 && state.view === "left") return setView("right", now);
    if (dir < 0 && state.view === "right") return setView("left", now);
  }
  const to = state.spread + dir;
  if (to < 0 || to >= spreads().length) return;
  if (dir > 0 && awaitsChoice()) return resist(now);
  endResist();
  // the leaf's sound, and the next spread's bed rising as it lands
  sound.pageTurn(dir, { reduced: Q.reduced, next: soundSpot(state.tale, to) });
  if (Q.reduced) return crossfade(to, state.tale, dir);
  startTurn(dir, now);
  // the camera lands as the leaf does: on the next spread's first stop, or back on the last
  if (pan) setStop(dir > 0 ? 0 : panStops(state.tale, to).length - 1, now, 1.0, to);
  else if (portrait()) setView(dir > 0 ? "left" : "right", now, 1.0);
}

function setView(view, now, dur = 0.75) {
  state.view = view;
  moveCamera(readingPose(view), dur, now);
  syncChrome(); // in portrait the next arrow first glides across the spread, then turns the leaf
  if (memCompact()) prefetch(); // the small cache holds the spread of the next turn only
}

let turnProfiles = null;
function startTurn(dir, now, frozenT = null) {
  const from = state.spread;
  const to = from + dir;
  const t = state.tale;
  const [hLf, hRf] = thicknessFor(gIndex(t, from), TOTAL);
  const [hLt, hRt] = thicknessFor(gIndex(t, to), TOTAL);
  const setSheet = (front, back) => {
    book.sheetFrontMat.map = book.sheetFrontMat.emissiveMap = front;
    book.sheetBackMat.map = book.sheetBackMat.emissiveMap = back;
  };
  if (dir > 0) {
    // the leaf carries R(from) on its face and L(to) on its back; R(to) is revealed beneath
    setSheet(getPage(t, from, "right").tex, getPage(t, to, "left").tex);
    book.setThickness(hLf, hRt);
    book.leftMat.map = getPage(t, from, "left").tex;
    book.rightMat.map = getPage(t, to, "right").tex;
    turnProfiles = { right: sideProfile(hRf), left: sideProfile(hLt) };
  } else {
    setSheet(getPage(t, to, "right").tex, getPage(t, from, "left").tex);
    book.setThickness(hLt, hRf);
    book.leftMat.map = getPage(t, to, "left").tex;
    book.rightMat.map = getPage(t, from, "right").tex;
    turnProfiles = { right: sideProfile(hRt), left: sideProfile(hLf) };
  }
  state.turning = { dir, from, to, t0: now, dur: 1.05, frozenT };
  turnRibbons(frozenT ?? 0);
  if (Q.perf) console.info(`[book] turn ${from}->${to} started`);
  book.poseTurn(frozenT ?? 0, dir, turnProfiles.right, turnProfiles.left);
  book.sheet.visible = true;
}

function finishTurn(now) {
  const { to } = state.turning;
  state.turning = null;
  book.sheet.visible = false;
  state.spread = to;
  applySpread();
  if (refit.pending) refitPages(); // resized (or turned) while the leaf was in the air
  cam.settle = now;
  syncChrome();
  syncMirror();
  prefetch();
  sound.arrive(soundSpot()); // the bed carries on (or crosses over to a new place), the page's spot sounds come later, a last page has the tale's closing theme
}

// The reduced-motion turn, riffle and start over: the spread faded to comes up over the one left,
// and the page blocks and the ribbons go over to it as gently, within the fade (fadeAt), never in
// one step at its end.
function crossfade(to, toTale = state.tale, dir = 1, dur = toTale === state.tale ? 0.35 : 0.6) {
  const L = getPage(toTale, to, "left").tex;
  const R = getPage(toTale, to, "right").tex;
  book.fadeLeft.material.map = L;
  book.fadeRight.material.map = R;
  book.fadeLeft.material.opacity = book.fadeRight.material.opacity = 0;
  book.fadeLeft.visible = book.fadeRight.visible = true;
  state.fade = { to, toTale, dir, t0: performance.now() / 1000, dur, fromTale: state.tale, g0: gIndex(), g1: gIndex(toTale, to) };
}
function fadeAt(p) {
  const F = state.fade;
  book.fadeLeft.material.opacity = book.fadeRight.material.opacity = p;
  if (F.g0 === F.g1) return;
  const e = easeInOut(p);
  const pos = F.g0 + (F.g1 - F.g0) * e;
  const [hL, hR] = thicknessFor(pos, TOTAL);
  if (Math.abs(hL - book.state.hL) > 2e-5) book.setThickness(hL, hR);
  // as the riffle does: a ribbon leaving the fold goes down into the block the spread goes to,
  // the ribbon of the title spread faded to comes up out of the block the spread comes from
  const d = Math.sign(F.g1 - F.g0);
  const marks = tales.map((tl) => ({ s: tl.offset, gut: 0 }));
  if (F.g0 === tales[F.fromTale].offset) marks[F.fromTale] = { s: F.g0, gut: 1 - e, side: -d };
  if (F.g1 === tales[F.toTale].offset) marks[F.toTale] = { s: F.g1, gut: e, side: d };
  layoutRibbons(pos, marks);
  renderer.shadowMap.needsUpdate = true;
}

// ---------------------------------------------------------------- page moments
// Two moments redraw a page while the reader watches it: a choice being sealed (or, at a refused
// turn, the seals still waiting for one glowing), and the spread rewritten in another language.
// Each composites into canvases of its own, shown in place of the page textures only while it
// runs (no mipmaps: the page is at rest, about a texel per pixel) and only for the pages in view.
// Whatever else puts a page on the book meanwhile (a turn, a resize, another choice) simply ends
// the moment. Reduced motion: the new page at once.
const SEAL = 0.42; // s
const GLINT = 0.62; // s, the waiting seals glowing one after another
// the old type fades from the paper, then the new is written in: each line left to right with a
// soft wet edge, lines lower on the page a little later, the right page just after the left
const INK = { fade: 0.22, start: 0.1, cascade: 0.45, lag: 0.12, line: 0.62 };
const matOf = (side) => (side === "left" ? book.leftMat : book.rightMat);
const inView = (side) => !portrait() || state.view === side;
const isMoment = (tex) => tex === state.seal?.tex || Object.values(state.ink?.sides || {}).some((s) => s.tex === tex);
function momentCanvas(like, copy = false) {
  const c = document.createElement("canvas");
  c.width = like.width;
  c.height = like.height;
  if (copy) c.getContext("2d").drawImage(like, 0, 0);
  return c;
}
function momentTexture(canvas) {
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.generateMipmaps = false;
  tex.minFilter = THREE.LinearFilter;
  return tex;
}
// iOS returns a canvas's memory at once only when it is sized to nothing
const freeCanvas = (...cs) => cs.forEach((c) => c && (c.width = c.height = 0));
// a page texture taken off the book by a redraw is freed, unless something still holds it
function dropTexture(tex) {
  if (tex && !isMoment(tex) && ![...cache.values()].some((e) => e.tex === tex) && !isInUse(tex)) tex.dispose();
}
// Lets go of pages no cache holds (a start over's, drawn before its choices were forgotten): the
// idle leaves and overlays still carrying one (or parked on it when the shaders were compiled)
// take a page of the book in its place, so their shaders stay as they are.
function release(texs) {
  if (!texs.length) return;
  const idle = [...book.leaves.flatMap((l) => [l.frontMat, l.backMat]), book.fadeLeft.material, book.fadeRight.material];
  for (const m of idle) {
    if (!texs.includes(m.map)) continue;
    m.map = book.rightMat.map;
    if (m.emissiveMap) m.emissiveMap = book.rightMat.map;
  }
  texs.forEach(dropTexture);
}
// Copies a rectangle of `src` onto the same place of the context's canvas, in whole px.
function blit(g, src, x, y, w, h, minX = 0, maxX = src.width) {
  const x0 = Math.max(minX, Math.round(x));
  const x1 = Math.min(maxX, Math.round(x + w), src.width);
  const y0 = Math.max(0, Math.floor(y));
  const y1 = Math.min(src.height, Math.ceil(y + h));
  if (x1 > x0 && y1 > y0) g.drawImage(src, x0, y0, x1 - x0, y1 - y0, x0, y0, x1 - x0, y1 - y0);
}

// The page of the spread that carries its choices (null: none).
const choiceSide = () => {
  const plan = artist.plan(spreads()[state.spread], ctxFor());
  return ["left", "right"].find((s) => plan[s]?.choice) || null;
};
// A choice: the page is drawn once without its choice block, then only the block, frame by frame.
function sealChoice() {
  if (Q.reduced) return;
  sealMoment({ fresh: true }, SEAL, Q.sealAt);
}
// A turn refused at a choice not made yet: the seals waiting for it glow once (see "the gate").
// It only glows, nothing moves, so it stays with reduced motion. `delay`: the camera comes first.
function glintSeals(delay = 0) {
  sealMoment({ glint: true, calm: Q.reduced }, GLINT, Q.resistAt === null ? null : Math.max(0, Q.resistAt - delay), delay);
}
function sealMoment(anim, dur, frozen, delay = 0) {
  if (busy()) return;
  const spread = spreads()[state.spread];
  const side = choiceSide();
  if (!side || (!delay && !inView(side))) return;
  const page = getPage(state.tale, state.spread, side);
  const under = momentCanvas(page.canvas);
  anim.capture = true;
  artist.drawPage(under, spread, side, ctxFor(), { seal: anim });
  if (!anim.draw) return freeCanvas(under);
  endSeal();
  const canvas = momentCanvas(under, true);
  const now = performance.now() / 1000;
  state.seal = { side, under, canvas, tex: momentTexture(canvas), draw: anim.draw, rect: anim.rect, dur, frozen, t0: now + delay, last: -1 };
  matOf(side).map = state.seal.tex;
  sealFrame(now);
}
function sealFrame(now) {
  const S = state.seal;
  if (matOf(S.side).map !== S.tex) return endSeal();
  if (S.levels) return hoverFrame(S, now);
  const t = S.frozen ?? Math.max(0, now - S.t0);
  if (t === S.last) return;
  S.last = t;
  paintSeal(S, clamp01(t / S.dur));
  if (t >= S.dur && S.frozen === null) {
    matOf(S.side).map = getPage(state.tale, state.spread, S.side).tex;
    endSeal();
  }
}
function paintSeal(S, p) {
  const g = S.canvas.getContext("2d");
  const k = S.canvas.width / PAGE_UNITS_W;
  g.setTransform(1, 0, 0, 1, 0, 0);
  blit(g, S.under, S.rect.x * k, S.rect.y * k, S.rect.w * k, S.rect.h * k);
  g.setTransform(k, 0, 0, k, 0, 0);
  S.draw(g, p);
  S.tex.needsUpdate = true;
}
// Desktop: the seal under the pointer warms a little while the choice is still to be made (a
// sealed one no longer answers the pointer). A page moment held while the pointer stays; each
// seal's warmth eases in and out on its own (`levels`, read by the choice block as it draws).
const HOVER = 0.18; // s
function hoverSeal(id) {
  if (state.seal?.levels) return void (state.seal.want = id);
  if (!id || state.seal || state.ink || state.resist) return;
  const anim = { levels: {} };
  sealMoment(anim, HOVER, null);
  if (state.seal?.draw === anim.draw) Object.assign(state.seal, { levels: anim.levels, want: id, tick: performance.now() / 1000 });
}
function hoverFrame(S, now) {
  const step = (now - S.tick) / HOVER;
  S.tick = now;
  let moved = false;
  for (const id of new Set([...Object.keys(S.levels), S.want].filter(Boolean))) {
    const v = S.levels[id] || 0;
    const to = clamp01(id === S.want ? v + step : v - step);
    if (to !== v) [S.levels[id], moved] = [to, true];
  }
  if (moved) paintSeal(S, 1);
  if (!S.want && Object.values(S.levels).every((v) => v === 0)) {
    matOf(S.side).map = getPage(state.tale, state.spread, S.side).tex;
    endSeal();
  }
}
function endSeal() {
  const S = state.seal;
  if (!S) return;
  state.seal = null;
  S.tex.dispose();
  freeCanvas(S.under, S.canvas);
}

// The pages in view as the reader sees them now (a copy, if a moment is drawing them).
function shownPages() {
  if (Q.reduced || busy() || (state.intro && !state.intro.done)) return null;
  const out = {};
  for (const side of ["left", "right"]) {
    const map = matOf(side).map;
    if (!inView(side) || !map?.image) continue;
    out[side] = isMoment(map) ? { canvas: momentCanvas(map.image, true), own: true } : { canvas: map.image, own: false };
  }
  return out;
}
function rewriteSpread(from) {
  endInk();
  if (!from) return;
  const spread = spreads()[state.spread];
  const sides = {};
  for (const side of Object.keys(from)) {
    const page = getPage(state.tale, state.spread, side);
    const bare = momentCanvas(page.canvas);
    artist.drawPage(bare, spread, side, ctxFor(), { bare: true });
    const canvas = momentCanvas(page.canvas);
    const { width: w, height: h } = page.canvas;
    const lag = side === "right" && inView("left") ? INK.lag : 0;
    // a short line is written in less time than a full one: the pen keeps its pace
    const lines = page.lines.map((l) => ({ ...l, t0: INK.start + lag + INK.cascade * (l.y / h), dur: INK.line * (0.35 + 0.65 * Math.min(1, l.w / (w * 0.8))) }));
    sides[side] = { from: from[side], bare, page, canvas, tex: momentTexture(canvas), lines };
    matOf(side).map = sides[side].tex;
  }
  const total = Math.max(INK.fade, ...Object.values(sides).flatMap((s) => s.lines.map((l) => l.t0 + l.dur)));
  state.ink = { sides, total, t0: performance.now() / 1000, last: -1 };
  inkFrame(state.ink.t0);
}
function inkFrame(now) {
  const I = state.ink;
  const t = Q.inkAt ?? now - I.t0;
  if (t === I.last) return;
  I.last = t;
  const live = Object.entries(I.sides).filter(([side, s]) => matOf(side).map === s.tex);
  if (!live.length) return endInk();
  for (const [, s] of live) paintInk(s, t);
  if (t >= I.total && Q.inkAt === null) {
    for (const [side] of live) matOf(side).map = getPage(state.tale, state.spread, side).tex;
    endInk();
  }
}
function paintInk(s, t) {
  const g = s.canvas.getContext("2d");
  const { width: w, height: h } = s.canvas;
  const src = s.page.canvas;
  const f = easeOut(clamp01(t / INK.fade));
  g.globalAlpha = 1;
  if (f < 1) g.drawImage(s.from.canvas, 0, 0, w, h);
  g.globalAlpha = f;
  g.drawImage(s.bare, 0, 0);
  for (const l of s.lines) {
    const r = clamp01((t - l.t0) / l.dur);
    if (r <= 0) continue;
    const a = 0.55 + 0.45 * r; // the ink darkens as it dries
    g.globalAlpha = a;
    if (r >= 1) {
      blit(g, src, l.x, l.y, l.w, l.h);
      continue;
    }
    const feather = Math.min(l.w, Math.round(w * 0.05));
    const edge = l.x + (l.w + feather) * (1 - (1 - r) * (1 - r)); // the pen eases off at the line's end
    blit(g, src, l.x, l.y, edge - feather - l.x, l.h, l.x, l.x + l.w);
    // the wet edge ahead of the pen
    for (let i = 0; i < 4; i++) {
      g.globalAlpha = a * (1 - (i + 0.5) / 4);
      blit(g, src, edge - feather + (feather * i) / 4, l.y, feather / 4, l.h, l.x, l.x + l.w);
    }
  }
  g.globalAlpha = 1;
  s.tex.needsUpdate = true;
}
function endInk() {
  const I = state.ink;
  if (!I) return;
  state.ink = null;
  for (const s of Object.values(I.sides)) {
    s.tex.dispose();
    freeCanvas(s.bare, s.canvas, s.from.own ? s.from.canvas : null);
  }
}

// ---------------------------------------------------------------- the gate
// A spread whose choice is not made yet holds its leaf (see awaitsChoice). Trying to turn on
// anyway, the leaf's free corner lifts a little and settles back, as if a hand held it down, and
// the seals waiting for the choice glow once, one after the other. In portrait, with the choices
// on the page out of view, the camera then glides over to them. No words; only the soft flex of
// the held paper (no warning tone); screen readers hear the plaque again (page, waiting for your
// choice). Reduced motion: the leaf stays down, the seals only glow.
const RESIST = { dur: 0.46, glint: 0.16 }; // s
const nextHeld = () => awaitsChoice() && (layout.mode === "pan" ? state.stop >= panStops().length - 1 : !portrait() || state.view === "right");
function resist(now) {
  if (state.resist) return;
  announceGate();
  sound.refusedTurn();
  const side = choiceSide();
  const away = side && !inView(side) ? side : null;
  if (!Q.reduced) {
    // the leaf carries the right page on its face (see holdLeaf); its back is never seen
    book.sheetBackMat.map = book.sheetBackMat.emissiveMap = fillerPage(0);
    state.resist = { t0: now, frozenT: Q.resistAt, away };
    holdLeaf();
    resistFrame(now);
    book.sheet.visible = true;
  } else if (away) setView(away, now);
  glintSeals(away ? (Q.reduced ? 0 : RESIST.dur) + 0.75 : Q.reduced ? 0 : RESIST.glint);
}
function resistFrame(now) {
  const R = state.resist;
  const k = clamp01((R.frozenT ?? now - R.t0) / RESIST.dur);
  // lifted quickly against the hold, let down slowly
  book.poseHeld(k < 0.3 ? easeOut(k / 0.3) : 1 - easeInOut((k - 0.3) / 0.7), book.state.profR, book.state.profL);
  renderer.shadowMap.needsUpdate = true;
  if (k >= 1 && R.frozenT === null) {
    endResist();
    if (R.away) setView(R.away, now);
  }
}
// The held leaf shows what the right page shows (a moment drawing it too). A page put on the book
// meanwhile (a choice, a language, a resize) is taken up at once, so the leaf never keeps an old one.
function holdLeaf() {
  if (state.resist) book.sheetFrontMat.map = book.sheetFrontMat.emissiveMap = book.rightMat.map;
}
function endResist() {
  if (!state.resist) return;
  state.resist = null;
  book.sheet.visible = false;
  // let go of the page, so nothing keeps it from being freed
  book.sheetFrontMat.map = book.sheetFrontMat.emissiveMap = fillerPage(0);
  renderer.shadowMap.needsUpdate = true;
}
// The plaque is a live region: emptied and refilled, its words are read again.
function announceGate() {
  const sr = els.pageSr.textContent;
  els.pageSr.textContent = "";
  setTimeout(() => (els.pageSr.textContent ||= sr), 100);
}
// Chosen: the next arrow wakes with a small gold glint.
function wakeNext() {
  if (Q.reduced) return;
  els.next.classList.remove("wake");
  void els.next.offsetWidth; // restart the animation
  els.next.classList.add("wake");
}

// ---------------------------------------------------------------- the clasp
// The page prints the clasp that starts a tale again (pageArt.js), so it turns with its leaf.
// While the page lies still, a real button (#clasp, index.html) is raised over the print, the same
// plate laid onto the page as the camera sees it (its corners taken through the camera each
// frame), so it can rise, warm and be pressed like the controls on the desk. Whatever moves or
// redraws the page puts it away until the page is still again.
const clasp = { entry: null, plate: null, w: 0, h: 0 };
const PW = new THREE.Vector3();
// A point of the right page, in page units (as the artist draws it), on the screen in CSS px.
function pageToScreen(u, v) {
  const g = book.rightPage.geometry;
  const uv = g.attributes.uv.array;
  const pos = g.attributes.position.array;
  // the first row of the page's grid runs from the spine to the fore-edge, u by arc length
  const s = u / PAGE_UNITS_W;
  const n = uv.length / 2 / (g.userData.nz + 1);
  let i = 1;
  while (i < n - 1 && uv[i * 2] < s) i++;
  const f = clamp01((s - uv[i * 2 - 2]) / (uv[i * 2] - uv[i * 2 - 2] || 1));
  const at = (k) => pos[(i - 1) * 3 + k] + (pos[i * 3 + k] - pos[(i - 1) * 3 + k]) * f;
  PW.set(at(0), at(1), -D / 2 + (v / (PAGE_UNITS_W * PAGE_ASPECT)) * D);
  book.rightPage.localToWorld(PW).project(camera);
  return [((PW.x + 1) / 2) * window.innerWidth, ((1 - PW.y) / 2) * window.innerHeight];
}
// The CSS matrix that lays a w x h box onto the quad p0..p3 (clockwise from its top left). A flat
// (affine) fit to all four corners: over a plate this small the perspective is under half a
// pixel, and a flat matrix keeps the browser drawing the label sharp while it rises or glints.
function quadMatrix(w, h, [p0, p1, p2, p3]) {
  const along = (i) => (p1[i] - p0[i] + p2[i] - p3[i]) / (2 * w);
  const down = (i) => (p3[i] - p0[i] + p2[i] - p1[i]) / (2 * h);
  const mid = (i) => (p0[i] + p1[i] + p2[i] + p3[i]) / 4 - (along(i) * w) / 2 - (down(i) * h) / 2;
  return `matrix(${along(0)},${along(1)},${down(0)},${down(1)},${mid(0)},${mid(1)})`;
}
// The raised face: gold leaf, light and shadow from CSS (index.html, a sibling of the language
// label); only the words are drawn here, in the page's own units, so they lie exactly on the print.
function claspFace({ w, h, label, fontSize, track, textX, baseline }) {
  const text = (y, cls) => `<text class="${cls}" x="${textX}" y="${y}" font-size="${fontSize}" letter-spacing="${track}">${esc(label)}</text>`;
  return `<span class="face"><svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true">${text(baseline + 2, "edge")}${text(baseline, "ink")}</svg></span>`;
}
// Every frame, after the render: is the clasp's page at rest in view, and where does it lie?
function placeClasp() {
  const entry = cache.get(keyOf(state.tale, state.spread, "right"));
  if (entry !== clasp.entry) {
    clasp.entry = entry;
    clasp.plate = entry?.hits.find((h) => h.plate)?.plate || null;
    if (clasp.plate) els.clasp.innerHTML = claspFace(clasp.plate);
    clasp.w = clasp.h = 0;
  }
  const P = clasp.plate;
  const still = Boolean(P && book.rightMat.map === entry.tex && !busy() && !state.resist && !(state.intro && !state.intro.done));
  if (els.clasp.classList.contains("shown") !== still) els.clasp.classList.toggle("shown", still);
  if (!still) return;
  const quad = [[P.x, P.y], [P.x + P.w, P.y], [P.x + P.w, P.y + P.h], [P.x, P.y + P.h]].map(([u, v]) => pageToScreen(u, v));
  // the box is laid out at about its size on screen, so its words are drawn sharp; the camera's
  // slow breath is left to the matrix (a box resized every few frames would shimmer)
  const w = Math.hypot(quad[1][0] - quad[0][0], quad[1][1] - quad[0][1]);
  const h = Math.hypot(quad[3][0] - quad[0][0], quad[3][1] - quad[0][1]);
  if (Math.abs(w / clasp.w - 1) > 0.04 || Math.abs(h / clasp.h - 1) > 0.04 || !clasp.w) {
    [clasp.w, clasp.h] = [w, h];
    els.clasp.style.width = `${w}px`;
    els.clasp.style.height = `${h}px`;
    els.clasp.style.setProperty("--clasp-r", `${(P.r * w) / P.w}px`);
  }
  els.clasp.style.transform = quadMatrix(clasp.w, clasp.h, quad);
}

// ---------------------------------------------------------------- tale switch: the riffle
// Tapping a ribbon opens its tale at the title spread: the ribbon is drawn up a little, the
// leaves between here and there fan over (a handful stand in for many), and the last leaf
// turns at the pace of an ordinary page and settles. The page blocks thicken and thin as the
// leaves land; a ribbon lying in the gutter goes down with the first leaf, the new tale's ribbon
// is drawn up into the gutter by the last. Reduced motion: a slow crossfade instead.
const RIFFLE = { leaf: 0.8, last: 1.1, gap: 0.12, settle: 0.2 };
// `from`: the pages to fly on the first leaf (start over: those on the book as the reader sees
// them, drawn before the choices were forgotten); `pace`: the leaves' timing.
function startRiffle(toTale, now, frozenT = null, { from: shown = null, pace = RIFFLE } = {}) {
  if (busy() || !tales[toTale]?.available) return false;
  const fromTale = state.tale;
  const g0 = gIndex();
  const g1 = gIndex(toTale, 0);
  if (g0 === g1) return false;
  endResist(); // the held leaf is the first to riffle
  if (Q.reduced) {
    crossfade(0, toTale);
    return true;
  }
  const dir = Math.sign(g1 - g0);
  const n = Math.min(Math.abs(g1 - g0), book.leaves.length);
  const starts = [];
  const durs = [];
  for (let k = 0; k < n; k++) {
    const last = k === n - 1;
    starts.push(k === 0 ? pace.lead ?? 0.14 : starts[k - 1] + pace.gap * (last ? 1.7 : 0.8 + 0.4 * Math.sin((k / n) * Math.PI)));
    durs.push(last ? pace.last : pace.leaf);
  }
  // the first leaf carries the pages being left, the last the tale's own, and the leaves between
  // them the filler pages, one after another
  const fill = (i) => fillerPage(i % FILLER);
  const from = shown || { L: getPage(fromTale, state.spread, "left").tex, R: getPage(fromTale, state.spread, "right").tex };
  const to = { L: getPage(toTale, 0, "left").tex, R: getPage(toTale, 0, "right").tex };
  const faces = starts.map((_, k) =>
    dir > 0
      ? { front: k === 0 ? from.R : fill(2 * k), back: k === n - 1 ? to.L : fill(2 * k + 1) }
      : { front: k === n - 1 ? to.R : fill(2 * k + 1), back: k === 0 ? from.L : fill(2 * k) }
  );
  book.leaves.forEach((leaf, k) => {
    leaf.group.visible = false;
    if (k >= n) return;
    leaf.frontMat.map = leaf.frontMat.emissiveMap = faces[k].front;
    leaf.backMat.map = leaf.backMat.emissiveMap = faces[k].back;
  });
  // the pages in view stay as they are until the first leaf lifts off them (riffleAt)
  state.riffle = { fromTale, toTale, g0, g1, dir, n, starts, durs, faces, to, t0: now, frozenT, landed: -1, total: starts[n - 1] + durs[n - 1], drop: shown ? [shown.L, shown.R] : [] };
  if (!shown) tug.press = toTale; // the ribbon tapped is drawn up a little
  if (Q.perf) console.info(`[book] riffle ${tales[fromTale].id} ${g0} -> ${tales[toTale].id} ${g1}, ${n} leaves`);
  return true;
}

function riffleAt(t) {
  const R = state.riffle;
  let landed = 0;
  const pr = book.state.profR;
  const pl = book.state.profL;
  for (let k = 0; k < R.n; k++) {
    const leaf = book.leaves[k];
    const p = clamp01((t - R.starts[k]) / R.durs[k]);
    leaf.group.visible = t >= R.starts[k] && p < 1;
    if (leaf.group.visible) book.poseLeaf(leaf, p, R.dir, pr, pl, k === R.n - 1 ? 0 : Math.sin(k * 2.1 + 0.7));
    landed += clamp01((p - 0.5) / 0.5);
    if (p >= 1 && k > R.landed) {
      // a landed leaf becomes the top of the other block
      R.landed = k;
      if (R.dir > 0) book.leftMat.map = R.faces[k].back;
      else book.rightMat.map = R.faces[k].front;
    }
  }
  // the top of the stack the leaves lift off: the reader's own page until the first leaf rises
  // with it, then the page of the next leaf to rise, and under the last the tale's first page
  let lifted = 0;
  while (lifted < R.n && t >= R.starts[lifted]) lifted++;
  if (lifted) {
    const top = lifted < R.n ? R.faces[lifted][R.dir > 0 ? "front" : "back"] : R.dir > 0 ? R.to.R : R.to.L;
    (R.dir > 0 ? book.rightMat : book.leftMat).map = top;
  }
  const pos = R.g0 + (R.g1 - R.g0) * (landed / R.n);
  const [hL, hR] = thicknessFor(pos, TOTAL);
  if (Math.abs(hL - book.state.hL) > 2e-5) book.setThickness(hL, hR);
  // ribbons stay bound in where their tales begin (one the leaves riffle past slides across under
  // the gutter); leaving a title spread, its ribbon goes down with the first leaf, and the ribbon
  // of the tale we riffle to rises with the last leaf as it lifts off it
  const marks = tales.map((tl) => ({ s: tl.offset, gut: 0 }));
  const swing = (k) => leafSwing((t - R.starts[k]) / R.durs[k]);
  if (R.g0 === tales[R.fromTale].offset) marks[R.fromTale] = { s: R.g0, gut: 1 - swing(0), side: -R.dir };
  marks[R.toTale] = { s: R.g1, gut: swing(R.n - 1), side: R.dir };
  layoutRibbons(pos, marks);
  renderer.shadowMap.needsUpdate = true;
  return t >= R.total;
}

function finishRiffle(now) {
  const R = state.riffle;
  state.riffle = null;
  book.leaves.forEach((l) => (l.group.visible = false));
  tug.press = -1;
  state.tale = R.toTale;
  state.spread = 0;
  applySpread();
  release(R.drop);
  cam.settle = now;
  syncChrome();
  syncMirror();
  syncTaleNav();
  if (updatePageSize()) {
    invalidatePages();
    applySpread();
  }
  wantArt(artOrder()); // the tale now open streams in behind the reader
  prefetch();
  sound.arrive(soundSpot()); // the tale's title spread: the reading room's bed and the tale's opening theme
  if (layout.mode === "pan") panLand("title", now); // the new tale's title, as in portrait
  else if (portrait() && state.view !== "right") setView("right", now);
}

// A tap on a ribbon. The tale being read: back to its title spread.
// The tale's title spread is drawn with its picture: a ribbon tapped before the picture has come
// is held up a little while it does (2.5 s at the most; then the riffle goes, and the page takes
// up the picture when it comes).
const taleWait = { i: -1 };
function openTale(i, waited = false) {
  if (state.intro && !state.intro.done) return skipIntro();
  const need = tales[i]?.available && i !== state.tale ? spreadArt(i, 0) : [];
  if (!waited && !artReady(need)) {
    taleWait.i = i;
    tug.press = i;
    const timeout = new Promise((r) => setTimeout(r, 2500));
    Promise.race([wantArt(need, true), timeout]).then(() => {
      if (taleWait.i !== i) return; // another ribbon since
      taleWait.i = -1;
      if (!state.riffle) tug.press = -1;
      openTale(i, true);
    });
    return;
  }
  taleWait.i = -1;
  const now = performance.now() / 1000;
  // the silk, then the leaves (an opening theme rings on if the reader goes back to its own title)
  if (startRiffle(i, now)) sound.riffle({ ...(state.riffle || { reduced: true, total: 0.6 }), tale: tales[i].id });
  else if (!busy()) {
    // already there: a small acknowledging tug
    tug.press = i;
    setTimeout(() => tug.press === i && !state.riffle && (tug.press = -1), 260);
    sound.ribbon();
  }
}

const raycaster = new THREE.Raycaster();
const ndc = new THREE.Vector2();
const MIN_HIT = 44; // CSS px, the least a printed control answers to (as the corner controls)
function pick(clientX, clientY) {
  ndc.set((clientX / window.innerWidth) * 2 - 1, -(clientY / window.innerHeight) * 2 + 1);
  raycaster.setFromCamera(ndc, camera);
  const hit = raycaster.intersectObjects([book.leftPage, book.rightPage], false)[0];
  if (!hit) return null;
  const side = hit.object === book.leftPage ? "left" : "right";
  const ux = hit.uv.x * 1000;
  const uy = (1 - hit.uv.y) * 1000 * PAGE_ASPECT;
  const entry = getPage(state.tale, state.spread, side);
  // whatever the page prints to be pressed (a choice's row, the clasp) answers a touch at least
  // MIN_HIT px tall and wide round it, however small the page is on screen; where two reach, the
  // nearer one wins (page units are isotropic: 1000 to the page's width, 1 world unit)
  PA.copy(hit.point).project(camera);
  PB.copy(hit.point).setZ(hit.point.z + 0.01).project(camera);
  const pxPerPageUnit = Math.hypot(((PB.x - PA.x) * window.innerWidth) / 2, ((PB.y - PA.y) * window.innerHeight) / 2) / 10;
  const reach = (MIN_HIT + 2) / Math.max(pxPerPageUnit, 1e-3); // 2 px over: the camera's breath, rounding
  let region = null;
  let best = Infinity;
  for (const h of entry.hits) {
    const dx = Math.max(h.x - ux, 0, ux - h.x - h.w);
    const dy = Math.max(h.y - uy, 0, uy - h.y - h.h);
    if (dx > Math.max(0, (reach - h.w) / 2) || dy > Math.max(0, (reach - h.h) / 2) || dx + dy >= best) continue;
    best = dx + dy;
    region = h;
  }
  // distance from the spine, 0..1
  const fromSpine = side === "right" ? hit.uv.x : 1 - hit.uv.x;
  return { side, region, fromSpine };
}
// ribbons answer within ~22 px of their tail on touch (a 44 px wide band), 10 px with a mouse;
// the nearest ribbon wins, and an inert one (its tale not available yet) simply absorbs the touch
const ribbonAt = (e) => (ribbons && !busy() ? ribbons.pick(e.clientX, e.clientY, camera, e.pointerType === "mouse" ? 10 : 22) : -1);
const live = (i) => i >= 0 && tales[i].available;

let down = null;
renderer.domElement.addEventListener("pointerdown", (e) => {
  hideTip(); // a press (or any touch) never leaves the tooltip behind
  down = { x: e.clientX, y: e.clientY, t: performance.now(), id: e.pointerId, ribbon: ribbonAt(e) };
  if (live(down.ribbon)) {
    tug.press = down.ribbon;
    prefetchTale(down.ribbon);
  }
});
renderer.domElement.addEventListener("pointerup", (e) => {
  if (!down || down.id !== e.pointerId) return;
  const dx = e.clientX - down.x;
  const dy = e.clientY - down.y;
  const ribbon = down.ribbon;
  down = null;
  if (!state.riffle) tug.press = -1;
  if (state.intro && !state.intro.done) return skipIntro();
  if (ribbon >= 0 && Math.hypot(dx, dy) < 18) return live(ribbon) ? openTale(ribbon) : undefined;
  if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.4) return go(dx < 0 ? 1 : -1);
  if (Math.hypot(dx, dy) > 14) return;
  const p = pick(e.clientX, e.clientY);
  if (p?.region?.action.type === "choice") return choose(p.region.action.id);
  if (p?.region?.action.type === "next") return go(1);
  if (portrait()) {
    const fx = e.clientX / window.innerWidth;
    if (fx > 0.68) return go(1);
    if (fx < 0.32) return go(-1);
    return;
  }
  if (p && p.fromSpine > 0.68) return go(p.side === "right" ? 1 : -1);
});
renderer.domElement.addEventListener("pointercancel", () => {
  down = null;
  if (!state.riffle) tug.press = -1;
});
renderer.domElement.addEventListener("pointerleave", () => {
  tug.hover = -1;
  hoverSeal(null);
  hideTip("hover");
});
renderer.domElement.addEventListener("pointermove", (e) => {
  if (e.pointerType !== "mouse" || down) return;
  const r = ribbonAt(e);
  tug.hover = live(r) ? r : -1;
  if (r >= 0 && fineHover.matches) showTip(r, "hover");
  else hideTip("hover");
  if (r >= 0) hoverSeal(null);
  if (tug.hover >= 0) {
    prefetchTale(tug.hover);
    renderer.domElement.style.cursor = "pointer";
    return;
  }
  if (r >= 0) {
    renderer.domElement.style.cursor = "default"; // inert: no pointer, no lift
    return;
  }
  const p = pick(e.clientX, e.clientY);
  const sealed = Boolean(state.choices[spreads()[state.spread].page]);
  const seal = p?.region?.action.type === "choice" && p.region.action.id !== "restart" && !sealed ? p.region.action.id : null;
  if (!busy()) hoverSeal(seal);
  // a held leaf's edge does not invite a turn (a tap there still shows why), nor a sealed choice
  const edge = !portrait() && p?.fromSpine > 0.68 && !(p.side === "right" && nextHeld());
  const active = p && ((p.region && !(sealed && p.region.action.type === "choice" && p.region.action.id !== "restart")) || edge);
  renderer.domElement.style.cursor = active ? "pointer" : "default";
});
window.addEventListener("keydown", (e) => {
  // arrows always turn pages; Space only when it is not pressing a focused button
  if (e.key === " " && e.target.closest?.("button")) return;
  if (["ArrowRight", "PageDown", " "].includes(e.key)) {
    e.preventDefault();
    go(1);
  } else if (["ArrowLeft", "PageUp"].includes(e.key)) {
    e.preventDefault();
    go(-1);
  }
});
// every control clicks with the book's one warm click (sound.js click); a turn's own sound follows
els.prev.addEventListener("click", () => {
  sound.click();
  go(-1);
});
els.next.addEventListener("click", () => {
  sound.click();
  go(1);
});
els.next.addEventListener("animationend", () => els.next.classList.remove("wake"));
els.langGroup.addEventListener("click", (e) => {
  const b = e.target.closest("button[data-lang]");
  if (!b) return;
  if (b.dataset.lang === state.lang) sound.click(); // the language already chosen: only the click
  setLang(b.dataset.lang); // the click, and the quill as the spread is rewritten
});
// sound on or off (remembered); turned on, the bed comes back and the click says so
els.sound.addEventListener("click", () => {
  sound.setEnabled(!sound.isEnabled());
  if (sound.isEnabled()) sound.button();
  syncSound();
});
els.gate.addEventListener("click", () => skipIntro());
window.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && state.intro?.gate && !e.target.closest?.("button")) skipIntro();
});
els.mirror.addEventListener("click", (e) => {
  const b = e.target.closest("button[data-choice]");
  if (b) choose(b.dataset.choice);
});
// the raised clasp; a keyboard user on its line in the mirror sees it rise as under the pointer
els.clasp.addEventListener("click", () => choose("restart"));
els.clasp.addEventListener("touchstart", () => {}, { passive: true }); // lets iOS show :active
els.mirror.addEventListener("focusin", (e) => els.clasp.classList.toggle("focus", Boolean(e.target.closest('button[data-choice="restart"]'))));
els.mirror.addEventListener("focusout", () => els.clasp.classList.remove("focus"));
els.taleNav.addEventListener("click", (e) => {
  const b = e.target.closest("button[data-tale]");
  if (!b) return;
  sound.click(); // the tab's click; the riffle's leaves follow
  openTale(Number(b.dataset.tale));
});
// a keyboard user sees which ribbon the focused button belongs to: it lifts, and says its name
els.taleNav.addEventListener("focusin", (e) => {
  const b = e.target.closest("button[data-tale]");
  tug.focus = b ? Number(b.dataset.tale) : -1;
  if (b) prefetchTale(tug.focus);
  if (b?.matches(":focus-visible")) showTip(tug.focus, "focus");
});
els.taleNav.addEventListener("focusout", () => {
  tug.focus = -1;
  hideTip("focus");
});

// ---------------------------------------------------------------- intro
// One motion from the loader to the reading pose. The intro's clock starts as the veil begins to
// lift (liftVeil): the loader swells and fades (0.8 s) and the veil clears (1.2 s) over the closed
// book in low candlelight, the cover lifts from 0.7 s while the veil is still clearing and the
// light comes up, and the camera moves from 1.4 s. It lands exactly on the reading pose
// (intro.end, kept current by resize), and the reader's breath grows in with the move (none at
// its start, all of it as it lands), so the main loop takes over without a last step. The
// controls fade in while the camera slows into place. A tap meanwhile hurries the rest of it
// (skipIntro).
// The gate (Q.gate): the veil clears over the closed book and a small plaque asks for a tap; the
// intro's clock starts at the tap (openGate), which is also the gesture that lets the browser
// play sound, so the cover opens with its creak and lands with a soft knock (sound.js).
const INTRO = { holdEnd: 0.7, coverStart: 0.7, coverEnd: 3.0, camStart: 1.4, camEnd: 5.0, chrome: 4.5, skip: 0.7 };
const LOADER_MIN = 400; // ms since navigation the loader is up at the least (a cached load does not flash it)
function liftVeil() {
  const I = state.intro;
  if (I?.gate) {
    I.lifted = true;
    if (I.gate === "pending") openGate(); // tapped while the desk was still loading
    else showGate();
  } else if (I) {
    I.t0 = performance.now() / 1000;
    I.lifted = true;
    // a tap while the desk was still loading hurries the intro from its first frame
    if (I.skip === "pending") {
      I.skip = null;
      skipIntro();
    }
  }
  els.veil.classList.add("gone");
  // cleared, the veil leaves the page (and its turning layers stop)
  const gone = () => (els.veil.hidden = true);
  els.veil.addEventListener("transitionend", (e) => e.target === els.veil && gone());
  setTimeout(gone, 1600); // a hidden tab may never end the transition
}
function introAt(t, clock) {
  const c = clamp01((t - INTRO.coverStart) / (INTRO.coverEnd - INTRO.coverStart));
  const theta = -Math.PI * (1 - easeInOut(c));
  if (theta !== book.cover) {
    book.setCover(theta);
    layoutRibbons(); // the gutter ribbon settles into the fold as the cover lands
  }
  if (c >= 1 && !state.intro.landed) {
    state.intro.landed = true;
    sound.coverLand(); // on the frame the board comes down, hurried or not
  }
  const k = easeInOut(clamp01((t - INTRO.camStart) / (INTRO.camEnd - INTRO.camStart)));
  const a = state.intro.start;
  const b = state.intro.end;
  camera.position.lerpVectors(a.pos, b.pos, k);
  // arc the path a little higher so the camera rises over the book rather than through it
  camera.position.y += Math.sin(k * Math.PI) * 0.35;
  cam.pose.target.lerpVectors(a.target, b.target, k);
  if (!Q.reduced && !Q.still) breathe(camera.position, camera.position.distanceTo(cam.pose.target), clock, k);
  camera.lookAt(cam.pose.target);
  state.intro.light = 0.55 + 0.45 * easeOut(clamp01(t / 1.6));
  renderer.shadowMap.needsUpdate = true;
  if (t >= INTRO.chrome) showChrome();
  if (t >= INTRO.camEnd) endIntro();
}
// The intro's own time: the clock, or, once a tap has hurried it, the rest of the intro played
// out in INTRO.skip s along its own path. Its pace picks up from the clock's (no kick, as its
// ease starts flat), runs fast through the middle and is back to the clock's as it lands, where
// the camera's own ease-out settles it into the reading pose; the cover, the light, the breath
// and the controls all follow the same time, so nothing jumps.
function introTime(now) {
  const I = state.intro;
  if (I.gate) return 0; // the book waits closed for its tap
  const W = I.skip;
  if (!W || W === "pending") return now - I.t0;
  const s = now - W.at;
  return W.from + Math.min(s, W.dur) + W.extra * easeInOut(clamp01(s / W.dur));
}
// A tap (key, ribbon) during the intro: at the gate it opens the book, later it hurries the rest
// of the opening. Reduced motion: the reading pose at once.
function skipIntro() {
  const I = state.intro;
  if (!I || I.done) return;
  if (I.gate) {
    if (!I.lifted) return void (I.gate = "pending");
    return openGate();
  }
  if (I.skip || Q.introAt !== null) return;
  if (!I.lifted) return void (I.skip = "pending");
  const now = performance.now() / 1000;
  sound.coverHurry(); // the creak gives way; the landing still comes with the cover
  if (Q.reduced) return void (I.t0 = now - INTRO.camEnd);
  const from = introTime(now);
  const rest = Math.max(0, INTRO.camEnd - from);
  const dur = Math.min(INTRO.skip, rest);
  I.skip = { at: now, from, dur, extra: rest - dur };
}
function openGate() {
  const I = state.intro;
  if (!I?.gate) return;
  I.gate = false;
  I.t0 = performance.now() / 1000;
  hideGate();
  sound.busy(INTRO.camEnd); // nothing decodes while the camera moves
  sound.click(); // the gate's click, then the cover's own sound
  sound.coverOpen({ delay: INTRO.coverStart });
}
// Not focused on its own (it would wear the focus ring before anyone touched it): Tab reaches it,
// and Enter, Space or an arrow key opens the book from anywhere.
// It comes up where the loader was, as the loader goes (index.html, "the gate"); shown before the
// desk is ready it would wait (dimmed, aria-disabled), never looking pressable too early.
function showGate() {
  const ready = Boolean(state.intro?.lifted);
  els.gate.classList.toggle("waiting", !ready);
  els.gate.setAttribute("aria-disabled", String(!ready));
  els.gate.hidden = false;
  requestAnimationFrame(() => els.gate.classList.add("shown"));
}
// Pressed (or the book opened any other way): the button swells a hair and dissolves while the
// veil clears over the desk, the light comes up and the cover begins to lift.
function hideGate() {
  els.gate.classList.remove("shown");
  els.gate.classList.add("go");
  els.gateVeil.classList.add("gone");
  els.gate.blur();
  setTimeout(() => {
    els.gate.hidden = true;
    els.gateVeil.hidden = true;
  }, 1700);
}
function endIntro() {
  state.intro.done = true;
  state.intro.light = 1;
  book.setCover(0);
  layoutRibbons();
  // the main loop places the camera from here on, this same frame
  cam.pose = readingPose();
  showChrome();
  renderer.shadowMap.needsUpdate = true;
  sound.arrive(soundSpot()); // the first tale's opening theme, once the book lies open
}
function showChrome() {
  els.chrome.forEach((c) => c.classList.remove("hidden"));
}

// ---------------------------------------------------------------- perf
const perf = { frames: [], cpu: [], last: 0, shown: 0, riffle: null, lastRiffle: null };
function perfTick(now, cpuMs) {
  if (perf.last) {
    perf.frames.push(now - perf.last);
    adaptResolution(now - perf.last, now);
    // frame times while the book riffles to a tale (the heaviest moment: up to 7 leaves in flight)
    if (state.riffle) (perf.riffle ||= []).push([now - perf.last, cpuMs]);
    else if (perf.riffle) {
      const f = perf.riffle;
      perf.lastRiffle = `${f.length} frames, avg ${(f.reduce((a, x) => a + x[0], 0) / f.length).toFixed(1)} ms, max ${Math.max(...f.map((x) => x[0])).toFixed(1)} ms, cpu ${(f.reduce((a, x) => a + x[1], 0) / f.length).toFixed(2)} ms`;
      perf.riffle = null;
    }
  }
  perf.last = now;
  perf.cpu.push(cpuMs);
  if (perf.frames.length > 240) perf.frames.shift();
  if (perf.cpu.length > 240) perf.cpu.shift();
  if (!Q.perf || now - perf.shown < 500 || perf.frames.length < 10) return;
  perf.shown = now;
  const sorted = [...perf.frames].sort((a, b) => a - b);
  const avg = perf.frames.reduce((a, b) => a + b, 0) / perf.frames.length;
  const p95 = sorted[Math.floor(sorted.length * 0.95)];
  const cpu = perf.cpu.reduce((a, b) => a + b, 0) / perf.cpu.length;
  const info = renderer.info;
  const out = {
    fps: +(1000 / avg).toFixed(1),
    frameAvgMs: +avg.toFixed(2),
    frameP95Ms: +p95.toFixed(2),
    cpuRenderMs: +cpu.toFixed(2),
    calls: info.render.calls,
    triangles: info.render.triangles,
    textures: info.memory.textures,
    geometries: info.memory.geometries,
    dpr: adapt.dpr,
    canvas: `${renderer.domElement.width}x${renderer.domElement.height}`,
    pageTex: `${pageSize.w}x${pageSize.h}`,
    bodySize: artist?.lastBodySize,
    bodyPx: bodyPx(),
    riffle: perf.lastRiffle,
  };
  window.__bookPerf = out;
  out.gpu = gpuName;
  out.tier = SOFT ? "software" : LOW ? "low" : "full";
  document.title = `perf ${JSON.stringify(out)}`; // readable from outside (DevTools /json/list)
  els.perf.hidden = false;
  els.perf.textContent = Object.entries(out).map(([k, v]) => `${k.padEnd(12)} ${v}`).join("\n");
}

// ---------------------------------------------------------------- main loop
let room = null;
let loaded = null;
const clockStart = performance.now() / 1000;

function flicker(t) {
  // layered slow sines: a living flame, never a strobe
  return 1 + 0.045 * Math.sin(t * 7.1) + 0.03 * Math.sin(t * 12.7 + 1.3) + 0.05 * Math.sin(t * 2.3 + 0.4) + 0.025 * Math.sin(t * 23.0 + 2.0) * Math.sin(t * 0.9);
}

let lastFrame = 0;
function frame() {
  // a lost context given back: nothing is drawn until the desk's textures are decoded again
  if (reviving) return void requestAnimationFrame(frame);
  const cpu0 = performance.now();
  const now = cpu0 / 1000;
  const dt = lastFrame ? Math.min(0.1, now - lastFrame) : 1 / 60;
  lastFrame = now;
  const t = Q.still ? Q.t : now - clockStart;
  const motion = !Q.reduced;

  // intro
  if (state.intro && !state.intro.done) introAt(Q.introAt ?? introTime(now), t);

  // candle
  const light = state.intro?.light ?? 1;
  const f = motion ? flicker(t) : 1;
  room.key.intensity = room.base.key * f * light;
  room.glow.intensity = room.base.glow * f * f * light;
  room.candle.halo.material.opacity = 0.34 * f * light;
  room.candle.core.material.opacity = 0.22 * f;
  room.candle.flameMat.uniforms.uTime.value = motion ? t : 0;
  room.candle.flameMat.uniforms.uPower.value = 1.12 * f;
  room.dust.mat.uniforms.uTime.value = motion ? t : 0;
  room.dust.mat.uniforms.uPx.value = adapt.dpr * window.innerHeight * 0.0036;
  room.chamber.update(t, light, motion); // the hearth, and the room coming up with the candle

  // page turn
  if (state.turning) {
    const tr = state.turning;
    const p = tr.frozenT ?? clamp01((now - tr.t0) / tr.dur);
    book.poseTurn(p, tr.dir, turnProfiles.right, turnProfiles.left);
    if (tr.from === 0 || tr.to === 0) turnRibbons(p);
    renderer.shadowMap.needsUpdate = true;
    if (tr.frozenT === null && p >= 1) finishTurn(now);
  }
  if (state.fade) {
    const p = clamp01((now - state.fade.t0) / state.fade.dur);
    fadeAt(p);
    if (p >= 1) {
      const { to, toTale, dir: fadeDir, drop = [] } = state.fade;
      const switched = toTale !== state.tale;
      state.fade = null;
      state.tale = toTale;
      state.spread = to;
      applySpread();
      release(drop);
      book.fadeLeft.visible = book.fadeRight.visible = false;
      syncChrome();
      syncMirror();
      if (switched) {
        syncTaleNav();
        wantArt(artOrder());
      }
      if (refit.pending) refitPages();
      prefetch();
      sound.arrive(soundSpot());
      if (layout.mode === "pan") panLand(switched || to === 0 ? "title" : fadeDir, now);
      else if (switched && portrait()) setView("right", now);
    }
  }
  // tale switch
  if (state.riffle) {
    const R = state.riffle;
    const done = riffleAt(R.frozenT ?? now - R.t0);
    if (done && R.frozenT === null) finishRiffle(now);
  }
  // a picture that came while its page was in view: drawn in once the page is at rest
  if (artDirty && !busy() && !state.seal && !state.ink && !state.resist && !(state.intro && !state.intro.done)) repaintShown();
  // page moments: a choice sealed, a spread rewritten
  if (state.seal) sealFrame(now);
  if (state.ink) inkFrame(now);
  // a refused turn: the held leaf, carrying whatever the moments above put on the page
  if (state.resist) {
    holdLeaf();
    resistFrame(now);
  }
  updateTugs(dt);

  // camera: still while reading; a barely perceptible breath; a tiny settle after a turn
  if (!state.intro || state.intro.done) {
    let pos = cam.pose.pos;
    let target = cam.pose.target;
    if (cam.to) {
      const k = easeInOut(clamp01((now - cam.t0) / cam.dur));
      pos = TMP.lerpVectors(cam.from.pos, cam.to.pos, k).clone();
      target = new THREE.Vector3().lerpVectors(cam.from.target, cam.to.target, k);
      if (k >= 1) {
        cam.pose = cam.to;
        cam.to = null;
      }
    }
    camera.position.copy(pos);
    if (motion && !Q.still) {
      const dir = TMP.copy(pos).sub(target);
      const dist = dir.length();
      let scale = 1;
      // the reader leans back a touch while a leaf is in the air (it rises towards the camera)
      if (state.turning) scale += 0.04 * Math.pow(Math.sin(Math.PI * clamp01((now - state.turning.t0) / state.turning.dur)), 1.4);
      if (state.riffle) scale += 0.06 * Math.pow(Math.sin(Math.PI * clamp01((now - state.riffle.t0) / state.riffle.total)), 1.2);
      const since = now - cam.settle;
      if (since >= 0 && since < 1.2) scale -= 0.0035 * Math.exp(-since * 4.5) * Math.sin(since * 9);
      camera.position.copy(target).addScaledVector(dir.normalize(), dist * scale);
      breathe(camera.position, dist, t);
    }
    camera.lookAt(target);
  }

  renderer.render(scene, camera);
  if (renderer.shadowMap.needsUpdate && !state.turning && !state.riffle && !(state.intro && !state.intro.done)) renderer.shadowMap.needsUpdate = false;
  placeClasp(); // after the render: the camera's matrices are this frame's
  placeTip();
  perfTick(performance.now(), performance.now() - cpu0);
  requestAnimationFrame(frame);
}

function resize() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  renderer.setSize(w, h);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  readSafe();
  const anchor = panAnchor();
  layout.mode = pickMode();
  document.documentElement.dataset.mode = layout.mode;
  // the page controls sit beside the ribbons in landscape and under the page in portrait
  document.documentElement.dataset.layout = portrait() ? "portrait" : "landscape";
  if (!book) return;
  // a leaf in the air (a turn, a riffle, a crossfade) holds its textures; the new size is taken
  // up when it lands
  if (busy()) refit.pending = true;
  else refitPages();
  if (layout.mode === "pan" && !state.turning && !state.fade && !state.riffle) panRestop(anchor);
  syncChrome(); // turned to portrait (or the stops cut anew), the next arrow may move within the spread first
  if (!state.intro || state.intro.done) {
    cam.pose = readingPose();
    cam.to = null;
  } else {
    state.intro.end = readingPose();
    state.intro.start = introStartPose();
  }
  document.documentElement.dataset.bodyPx = String(bodyPx(poseCamera(readingPose())));
  if (Q.perf) console.info(`[book] ${w}x${h}: ${layout.mode} (body text if spread / single / column: ${Object.values(layout.px || {}).join(" / ")} px at size ${REF_BODY})`);
}
const refit = { pending: false };
function refitPages() {
  refit.pending = false;
  if (updatePageSize()) {
    invalidatePages();
    applySpread();
  }
}

// The props (room.js loadProps) the desk waits for, at the most PROP_WAIT ms once everything else
// is in: on a quick line they are all there and the desk comes up whole; on a slow one the book
// opens without waiting for them, and each takes its place on the desk as it comes (placeLate),
// its materials compiled first, so it never stalls a frame.
const PROP_WAIT = 1200;
async function propsWithin(props, ms) {
  const got = {};
  const all = Promise.all(Object.entries(props).map(([name, p]) => p.then((obj) => (got[name] = obj))));
  await Promise.race([all, new Promise((r) => setTimeout(r, ms))]);
  return { ...got };
}
async function placeLate(name, obj) {
  const objs = room.place(name, obj);
  if (!objs) return;
  const g = new THREE.Group();
  g.add(...objs);
  await renderer.compileAsync(g, camera, scene);
  scene.add(...objs);
  renderer.shadowMap.needsUpdate = true;
}

async function init() {
  resize();
  loaded = await loadAll();
  // (no await from here until the book's first pages are drawn: a resize or a font arriving
  // meanwhile would find a book with no pages yet)
  const props = await propsWithin(loaded.props, PROP_WAIT);
  artist = createPageArtist({ parchment: loaded.parchment, grain: makeGrain(256), images: loaded.images });
  book = createBook({ tex: loaded.book });
  scene.add(book.root);
  book.makeCover(ui[state.lang].bookTitle, ui[state.lang].bookSubtitle);
  closeArt(loaded.book.cover); // baked: its pixels go (retitleCover decodes it again)
  ribbons = createRibbons({ tales, book });
  book.root.add(ribbons.group);
  room = createRoom({ renderer, scene, tex: { wood: loaded.wood, ...loaded.room }, parchmentImg: loaded.parchment, props, shadowSize: LOW ? 1024 : 2048, weak: LOW });
  room.base = { key: room.key.intensity, glow: room.glow.intensity };
  for (const [name, p] of Object.entries(loaded.props)) if (!(name in props)) p.then((obj) => placeLate(name, obj));

  syncTaleNav(); // the tale tabs first: pan reading measures its stops clear of them
  updatePageSize();
  applySpread();
  // turn frozen for review: show the leaf mid-air between `spread` and its neighbour (not on past
  // a choice not made yet)
  if (Q.turn !== null) {
    const to = state.spread + Q.dir;
    if (to >= 0 && to < spreads().length && !(Q.dir > 0 && awaitsChoice())) startTurn(Q.dir, 0, Q.turn);
  }
  cam.pose = readingPose();
  if (Q.cam?.length === 6 && Q.cam.every(Number.isFinite)) {
    cam.pose = { pos: new THREE.Vector3(...Q.cam.slice(0, 3)), target: new THREE.Vector3(...Q.cam.slice(3)) };
  }
  if (Q.intro && state.spread === 0 && state.tale === 0) {
    state.intro = { t0: performance.now() / 1000, done: false, light: 0.55, gate: Q.gate };
    // the gate's veil lies under the loader from the start, so the desk comes up already veiled
    if (Q.gate) els.gateVeil.hidden = false;
    state.intro.end = cam.pose;
    state.intro.start = introStartPose();
    book.setCover(-Math.PI);
    layoutRibbons(); // for the closed book the intro starts from, not the open one applySpread laid out
    camera.position.copy(state.intro.start.pos);
    cam.pose = { pos: cam.pose.pos.clone(), target: state.intro.start.target.clone() };
    camera.lookAt(cam.pose.target);
  } else {
    camera.position.copy(cam.pose.pos);
    camera.lookAt(cam.pose.target);
    showChrome();
  }
  renderer.shadowMap.needsUpdate = true;
  // compile everything before the first visible frame, including the turning leaf and the
  // crossfade overlays (compile() skips hidden meshes, which would stall the first turn), in
  // parallel where the GPU driver can (KHR_parallel_shader_compile: the main thread stays free
  // meanwhile; elsewhere it is the same as compile())
  const hidden = [...book.leaves.map((l) => l.group), book.fadeLeft, book.fadeRight].filter((o) => !o.visible);
  const tex = book.rightMat.map;
  for (const l of book.leaves) for (const m of [l.frontMat, l.backMat]) if (!m.map) m.map = m.emissiveMap = tex;
  for (const m of [book.fadeLeft.material, book.fadeRight.material]) {
    if (!m.map) m.map = tex;
    m.opacity = 0;
  }
  hidden.forEach((o) => (o.visible = true));
  await renderer.compileAsync(scene, camera);
  // one hidden render with the leaf in the air also builds its shadow-depth programs
  if (!state.turning) {
    const pr = sideProfile(book.state.hR);
    book.poseTurn(0.5, 1, pr, sideProfile(book.state.hL));
    renderer.shadowMap.needsUpdate = true;
    renderer.render(scene, camera);
  }
  hidden.forEach((o) => (o.visible = false));
  releaseBitmaps(); // every texture is on the GPU now (those the camera did not see included)
  renderer.shadowMap.needsUpdate = true;
  syncChrome();
  syncMirror();
  syncTaleNav();
  // the loader stays up long enough not to flash on a quick load, and no longer than loading took
  if (performance.now() < LOADER_MIN) await new Promise((r) => setTimeout(r, LOADER_MIN - performance.now()));
  // review: a ribbon shown lifted, or a tale switch started (and possibly frozen) right away
  if (tug.review >= 0) updateTugs(1);
  if (Q.switchTo && taleOf(Q.switchTo) >= 0) startRiffle(taleOf(Q.switchTo), performance.now() / 1000, Q.switchAt);
  // sound: the book's own sounds decode now (no gesture needed), the tale's after them; opened
  // further in than the title, the spread's bed waits for the first touch
  sound.preloadCore();
  sound.preloadTale(tales[state.tale].id);
  if (!state.intro) sound.arrive({ ...soundSpot(), how: "load" });
  liftVeil();
  // every other picture now streams in behind the veil (prefetch puts the neighbours first)
  wantArt(artOrder());
  // review aid: the measured body size at the reading pose, readable without a running frame loop
  document.documentElement.dataset.bodyPx = String(bodyPx(Q.cam ? camera : poseCamera(readingPose())));
  requestAnimationFrame(frame);
  prefetch();
}

// review/testing hook (perf=1 only): the reader's state, the reading mode, and where the printed
// controls of the right page lie on screen (CSS px, corners clockwise from the top left), and
// where a ribbon's tail is
if (Q.perf) {
  window.__book = {
    state,
    layout,
    camera,
    busy,
    hits: () =>
      (cache.get(keyOf(state.tale, state.spread, "right"))?.hits || []).map((h) => ({
        action: h.action,
        quad: [[h.x, h.y], [h.x + h.w, h.y], [h.x + h.w, h.y + h.h], [h.x, h.y + h.h]].map(([u, v]) => pageToScreen(u, v)),
      })),
    ribbon: (id) => ribbons.anchor(taleOf(id), camera),
    pick: (x, y) => pick(x, y)?.region?.action || null,
    pending: () => [...art.jobs.values()].filter((j) => !j.done).length,
    cacheSize: () => cache.size,
    // pan reading: every stop of the spread (page units; zoom = CSS px per page unit there)
    stops: (i = state.spread) => panStops(state.tale, i).map((s) => ({ side: s.side, kind: s.kind, zoom: s.zoom, region: s.region })),
    body: () => artist.lastBodySize,
    textBox: () => (layout.mode === "pan" ? panStops().textBox : null),
    regions: (side) => cache.get(keyOf(state.tale, state.spread, side))?.regions || [],
    // the turning leaf's vertices (world x, y, z in a row), while one is in the air
    leaf: () => (book.leaves[0].group.visible ? Array.from(book.leaves[0].pos.array) : null),
    toScreen: (side, u, v) => {
      const p = pagePoint(side, u, v).project(camera);
      return [((p.x + 1) / 2) * window.innerWidth, ((1 - p.y) / 2) * window.innerHeight];
    },
  };
}

// review/testing script (see header)
function runActions() {
  const steps = (rp.get("actions") || "").split(",").filter(Boolean);
  steps.forEach((step, i) =>
    setTimeout(() => {
      const [kind, a, b] = step.split(":");
      if (kind === "next") go(1);
      else if (kind === "prev") go(-1);
      else if (kind === "choose") choose(a);
      else if (kind === "lang") setLang(a);
      else if (kind === "tale") openTale(taleOf(a));
      else if (kind === "tapRibbon" || kind === "tapTale") {
        // a real touch on the ribbon's tail, through the same hit-testing as a finger
        const p = ribbons.anchor(taleOf(a), camera);
        const o = { clientX: p.x, clientY: p.y, pointerId: 8, pointerType: "touch", bubbles: true };
        renderer.domElement.dispatchEvent(new PointerEvent("pointerdown", o));
        renderer.domElement.dispatchEvent(new PointerEvent("pointerup", o));
      }
      else if (kind === "hover") tug.review = taleOf(a);
      else if (kind === "tap") {
        const x = Number(a) * window.innerWidth;
        const y = Number(b) * window.innerHeight;
        const o = { clientX: x, clientY: y, pointerId: 7, pointerType: "touch", bubbles: true };
        renderer.domElement.dispatchEvent(new PointerEvent("pointerdown", o));
        renderer.domElement.dispatchEvent(new PointerEvent("pointerup", o));
      }
      console.log(`[actions] ${step} -> tale ${tales[state.tale].id} spread ${state.spread}, choices ${JSON.stringify(state.choices)}`);
    }, 1600 * (i + 1))
  );
}

window.addEventListener("resize", resize);
// if a face arrives after the first pages were drawn, redraw them with the right metrics
document.fonts.addEventListener?.("loadingdone", () => {
  if (!book) return;
  artist.resetMetrics();
  invalidatePages();
  filler.h = -1;
  applySpread();
});
init().then(() => REVIEW && runActions());
