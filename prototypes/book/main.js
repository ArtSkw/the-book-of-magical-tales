// Księga Magicznych Opowieści — the 3D book on the candle-lit desk.
//
// Query parameters (all optional, for review and deterministic screenshots):
//   spread=0..10        open at this spread (0 = title spread); never past a choice not yet made
//                       (pass choices= too to open further on)
//   lang=pl|en          language (Polish is the default)
//   choice=lantern|bread   choice made on page 4
//   choices=a,b,c,d     choices for pages 2, 4, 6, 8 in order (e.g. ask,bread,warm-path,wave-goodnight)
//   still=1             no intro, time frozen at t (candle, dust) — for screenshots
//   t=3                 frozen time in seconds (with still=1)
//   turn=0.45           freeze a page turn at this progress (from `spread` to the next one)
//   dir=-1              with turn: show the backwards turn instead
//   introAt=1.8         freeze the intro at this time (seconds)
//   intro=0             skip the intro but keep everything animated
//   view=left|right     portrait: which page to frame
//   reduced=1           behave as prefers-reduced-motion (crossfade instead of the curl)
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
//   tales=4             every tale is available (placeholder title spreads), to test switching tales
//   tale=<id>           open at this tale (spread= then counts inside it)
//   switchTo=<id>       riffle to this tale's title spread right after load (the active tale's own id
//                       = back to its title spread); switchAt=0.8 freezes that riffle at 0.8 s
//   hover=<id>          show this ribbon lifted, as under the pointer
//   cam=x,y,z,tx,ty,tz  review camera (close-ups); no intro
import * as THREE from "three";
import { createBook, thicknessFor, sideProfile, leafSwing, W, D } from "./book.js";
import { createRoom, CANDLE } from "./room.js";
import { createPageArtist, makeGrain, PAGE_ASPECT, PAGE_UNITS_W } from "./pageArt.js";
import { allImageSources, spreadImage } from "./pages.js";
import { storyFor, ui } from "./story.js";
import { bindTales, taleUi } from "./tales.js";
import { createRibbons } from "./ribbons.js";

const BASE = import.meta.env.BASE_URL || "/";
const asset = (p) => `${BASE}${p.replace(/^\//, "")}`;
const params = new URLSearchParams(location.search);
const num = (k, d) => (params.has(k) && params.get(k) !== "" && !Number.isNaN(Number(params.get(k))) ? Number(params.get(k)) : d);
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const clamp01 = (t) => clamp(t, 0, 1);
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOut = (t) => 1 - Math.pow(1 - t, 3);

const Q = {
  spread: Math.max(0, Math.round(num("spread", 0))),
  lang: params.get("lang") === "en" ? "en" : "pl",
  still: params.get("still") === "1",
  t: num("t", 3),
  turn: params.has("turn") ? clamp01(num("turn", 0.5)) : null,
  dir: params.get("dir") === "-1" ? -1 : 1,
  introAt: params.has("introAt") ? num("introAt", 0) : null,
  perf: params.get("perf") === "1",
  reduced: params.get("reduced") === "1" || matchMedia("(prefers-reduced-motion: reduce)").matches,
  view: params.get("view"),
  tales: ["4", "all"].includes(params.get("tales")),
  switchTo: params.get("switchTo"),
  switchAt: params.has("switchAt") ? Math.max(0, num("switchAt", 0.6)) : null,
  sealAt: params.has("sealAt") ? Math.max(0, num("sealAt", 0.15)) : null,
  inkAt: params.has("inkAt") ? Math.max(0, num("inkAt", 0.6)) : null,
  resistAt: params.has("resistAt") ? Math.max(0, num("resistAt", 0.15)) : null,
  hover: params.get("hover"),
  cam: params.get("cam")?.split(",").map(Number),
};
Q.intro = Q.introAt !== null || (!Q.still && params.get("intro") !== "0" && Q.turn === null && !Q.cam);

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
if (params.get("choice")) state.choices[4] = params.get("choice");
if (params.get("choices")) params.get("choices").split(",").forEach((id, i) => id && story()?.CHOICE_PAGES[i] && (state.choices[story().CHOICE_PAGES[i]] = id));
// Resolved choices of a tale (placeholder tales have no story and no choices).
const resolved = (t = state.tale) => {
  const S = story(t);
  return S ? Object.fromEntries(S.CHOICE_PAGES.map((p) => [p, S.resolvedChoice(choicesOf(t), p)])) : {};
};
// A spread that asks the reader to choose holds the book open there until they have: no turn,
// tap, swipe, key or link goes on past it (back is always free; a ribbon only ever opens a
// tale's title spread). A choice changed later keeps the ones made after it, as story.js does.
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
const DPR = params.has("dpr") ? clamp(num("dpr", 1), 0.5, 3) : Math.min(window.devicePixelRatio || 1, 2);
renderer.setPixelRatio(DPR);
// If the device cannot hold ~60 fps at full resolution, step the canvas resolution down
// (page textures keep their resolution). Pinned when ?dpr= is given.
const adapt = { dpr: DPR, frames: [], last: 0, enabled: !params.has("dpr") };
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
function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}
const texLoader = new THREE.TextureLoader();
const loadTex = (p, srgb = true) =>
  texLoader.loadAsync(asset(p)).then((t) => {
    if (srgb) t.colorSpace = THREE.SRGBColorSpace;
    return t;
  });

// Canvas text needs the web font to be *usable by canvas*, which Safari can report late.
// Load every face, then confirm by measuring against the fallback; give up after ~4 s.
const FACES = ["400 40px", "600 40px", "italic 400 40px", "italic 600 40px"];
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

async function loadAll() {
  const fontsReady = fontsUsable();
  const T = "/assets/book3d/textures/";
  const tx = (name, srgb = true) => loadTex(T + name + ".webp", srgb);
  const im = (name) => loadImage(asset(T + name + ".webp"));
  const [textures, images_] = await Promise.all([
    Promise.all([
      tx("desk_diff"), tx("desk_nor", false), tx("desk_rough", false),
      tx("leather_diff"), tx("leather_nor", false), tx("leather_rough", false),
      tx("boardin_diff"), tx("boardin_nor", false), tx("boardin_orm", false),
      tx("spine_diff"), tx("spine_nor", false), tx("spine_orm", false),
      tx("brass_col"), tx("brass_rough", false),
      tx("parchment_nor", false), tx("weave_nor", false), tx("runner_diff"), tx("feather"), tx("backdrop"),
    ]),
    Promise.all([im("parchment"), im("cover_diff"), im("cover_nor"), im("cover_orm")]),
  ]);
  const [wood, woodN, woodR, lea, leaN, leaR, binC, binN, binO, spC, spN, spO, brC, brR, paperN, weaveN, runner, feather, backdrop] = textures;
  const [parchment, coverC, coverN, coverO] = images_;
  const aniso = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  for (const t of [binC, binN, binO, spC, spN, spO, paperN]) t.anisotropy = aniso;
  const images = new Map();
  const sources = [...new Set(tales.filter((t) => t.available).flatMap((t) => allImageSources(t.spreads)))];
  await Promise.all(sources.map(async (src) => images.set(src, await loadImage(asset(src)))));
  const fontsOk = await fontsReady;
  if (!fontsOk) console.warn("[book] EB Garamond not usable in canvas yet; pages will be redrawn when it arrives");
  return {
    wood: { map: wood, normal: woodN, rough: woodR },
    book: {
      leather: { map: lea, normal: leaN, rough: leaR },
      boardIn: { map: binC, normal: binN, orm: binO },
      spine: { map: spC, normal: spN, orm: spO },
      cover: { map: coverC, normal: coverN, orm: coverO },
      brass: { map: brC, rough: brR },
      paperNormal: paperN,
    },
    room: { brass: { map: brC, rough: brR }, runner, weave: weaveN, feather },
    backdrop,
    parchment,
    images,
  };
}

// ---------------------------------------------------------------- page textures
const pageSize = { w: 1024, h: 1413 };
const cache = new Map();
let artist = null;
// current + previous + next spread = 6 pages: enough for an instant turn either way, and bounded
// memory (a portrait page is ~1739x2400 px, ~22 MB on the GPU with mipmaps plus its canvas)
const MAX_CACHE = 6;
const choiceKey = (t = state.tale) => (story(t)?.CHOICE_PAGES || []).map((p) => choicesOf(t)[p] || "-").join(",");
const keyOf = (t, i, side) => `${tales[t].id}|${i}|${side}|${state.lang}|${choiceKey(t)}|${pageSize.h}`;
const ctxFor = (t = state.tale) => ({ tale: tales[t].id, spreads: tales[t].spreads, lang: state.lang, choices: choicesOf(t), resolved: resolved(t) });

function getPage(t, i, side) {
  const key = keyOf(t, i, side);
  let entry = cache.get(key);
  if (entry) {
    cache.delete(key);
    cache.set(key, entry); // LRU touch
    return entry;
  }
  const t0 = performance.now();
  const canvas = document.createElement("canvas");
  canvas.width = pageSize.w;
  canvas.height = pageSize.h;
  const { hits, lines } = artist.drawPage(canvas, tales[t].spreads[i], side, ctxFor(t));
  if (Q.perf) console.info(`[book] drew page ${tales[t].id} ${i}/${side} in ${(performance.now() - t0).toFixed(1)} ms`);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  entry = { tex, hits, canvas, lines };
  cache.set(key, entry);
  while (cache.size > MAX_CACHE) {
    const [oldKey, old] = cache.entries().next().value;
    if (isInUse(old.tex)) break;
    old.tex.dispose();
    cache.delete(oldKey);
  }
  return entry;
}
let book = null;
let ribbons = null;
const isInUse = (tex) =>
  [book.leftMat, book.rightMat, book.fadeLeft.material, book.fadeRight.material, ...book.leaves.flatMap((l) => [l.frontMat, l.backMat])].some((m) => m.map === tex);

// The leaves that fly past in a riffle carry one generic printed page (drawn once per size).
let generic = null;
function genericPage() {
  if (generic?.h === pageSize.h) return generic.tex;
  generic?.tex.dispose();
  const canvas = document.createElement("canvas");
  canvas.width = pageSize.w;
  canvas.height = pageSize.h;
  artist.drawGeneric(canvas);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  generic = { tex, h: pageSize.h };
  return tex;
}

// Pages of the neighbouring spreads are drawn and uploaded ahead of time, one page per idle
// slot and never while a leaf is moving, so the next turn starts without a hitch.
let prefetchTimer = 0;
function prefetch(delay = 1300) {
  clearTimeout(prefetchTimer);
  const queue = [];
  for (const i of [state.spread + 1, state.spread - 1]) {
    if (i >= 0 && i < spreads().length) for (const side of ["right", "left"]) queue.push([state.tale, i, side]);
  }
  if (!generic) queue.push(null);
  const idle = window.requestIdleCallback || ((f) => setTimeout(f, 16));
  const step = () => {
    if (state.turning || state.fade || state.riffle || state.seal || state.ink || state.resist || cam.to || (state.intro && !state.intro.done)) {
      prefetchTimer = setTimeout(step, 500);
      return;
    }
    if (!queue.length) return;
    const next = queue.shift();
    const t0 = performance.now();
    renderer.initTexture(next ? getPage(...next).tex : genericPage());
    if (Q.perf) console.info(`[book] prefetched ${next ? next.join("/") : "generic"} in ${(performance.now() - t0).toFixed(1)} ms`);
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
  for (const side of ["left", "right"]) renderer.initTexture(getPage(t, 0, side).tex);
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

// ---------------------------------------------------------------- camera
const portrait = () => window.innerHeight > window.innerWidth * 1.05;
const TMP = new THREE.Vector3();

// Fits a desk rectangle into the viewport for a camera tilted `tilt` rad from vertical (towards +z).
function fitPose(rect, tilt, ndc) {
  const target = new THREE.Vector3((rect.x0 + rect.x1) / 2, 0.06, (rect.z0 + rect.z1) / 2);
  const dir = new THREE.Vector3(0, Math.cos(tilt), Math.sin(tilt));
  let dist = 3.5;
  const corners = [
    [rect.x0, rect.z0], [rect.x1, rect.z0], [rect.x0, rect.z1], [rect.x1, rect.z1],
  ];
  const cam = camera.clone();
  for (let it = 0; it < 24; it++) {
    cam.position.copy(target).addScaledVector(dir, dist);
    cam.lookAt(target);
    cam.updateMatrixWorld(true);
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const [x, z] of corners) {
      for (const y of [0.0, rect.y ?? 0.12]) {
        TMP.set(x, y, z).project(cam);
        minX = Math.min(minX, TMP.x); maxX = Math.max(maxX, TMP.x);
        minY = Math.min(minY, TMP.y); maxY = Math.max(maxY, TMP.y);
      }
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
// space between the top and bottom controls (measured, in CSS px), so on a tablet the body text
// is as large as it can be without the font growing, and no control ever sits on the book.
// FRAME is a thin margin in world units round the boards: x (each side), head, tail; the
// ribbons' cut ends lie in the strip under the tail, beside the page controls.
const FRAME = { landscape: { x: 0.006, head: 0.004, tail: 0.004 }, portrait: { x: 0.03, head: 0.008, tail: 0.012, spine: 0.04 } };
const GAP = 10; // px between a control and the book
function chromeInsets() {
  // layout boxes, not client rects: the controls slide a few px while they fade in
  const [top, bottom] = els.chrome;
  return { top: Math.max(14, top.offsetTop + top.offsetHeight + GAP), bottom: Math.max(14, window.innerHeight - bottom.offsetTop + GAP), side: 10 };
}
function readingPose(view = state.view) {
  const bx = book.bounds.x;
  const bz = book.bounds.z;
  const ins = chromeInsets();
  const w = window.innerWidth;
  const h = window.innerHeight;
  const ndc = { x0: -1 + (2 * ins.side) / w, x1: 1 - (2 * ins.side) / w, y0: -1 + (2 * ins.bottom) / h, y1: 1 - (2 * ins.top) / h };
  if (portrait()) {
    const f = FRAME.portrait;
    const rect = view === "left" ? { x0: -bx - f.x, x1: f.spine, z0: -bz - f.head, z1: bz + f.tail, y: 0.04 } : { x0: -f.spine, x1: bx + f.x, z0: -bz - f.head, z1: bz + f.tail, y: 0.04 };
    return fitPose(rect, THREE.MathUtils.degToRad(10), ndc);
  }
  const f = FRAME.landscape;
  return fitPose({ x0: -bx - f.x, x1: bx + f.x, z0: -bz - f.head, z1: bz + f.tail, y: 0.04 }, THREE.MathUtils.degToRad(12), ndc);
}

// Body text size on screen in CSS px (measured at the middle of the page in view).
const PA = new THREE.Vector3();
const PB = new THREE.Vector3();
function bodyPx() {
  if (!book || !artist?.lastBodySize) return null;
  const side = portrait() ? state.view : "right";
  const prof = side === "right" ? book.state.profR : book.state.profL;
  const s = side === "right" ? 1 : -1;
  const i = Math.floor(prof.xs.length * 0.6);
  PA.set(s * prof.xs[i - 2], prof.ys[i - 2], 0).project(camera);
  PB.set(s * prof.xs[i + 2], prof.ys[i + 2], 0).project(camera);
  const arc = Math.hypot(prof.xs[i + 2] - prof.xs[i - 2], prof.ys[i + 2] - prof.ys[i - 2]);
  const pxPerUnit = Math.hypot(((PB.x - PA.x) * window.innerWidth) / 2, ((PB.y - PA.y) * window.innerHeight) / 2) / arc;
  return +((artist.lastBodySize / 1000) * W * pxPerUnit).toFixed(1);
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
function moveCamera(to, dur, now) {
  cam.from = { pos: camera.position.clone(), target: cam.pose.target.clone() };
  cam.to = to;
  cam.t0 = now;
  cam.dur = dur;
}

// Page-texture resolution: about one texel per device pixel of the page at rest.
function updatePageSize() {
  const pose = readingPose(state.view);
  const c = camera.clone();
  c.position.copy(pose.pos);
  c.lookAt(pose.target);
  c.updateMatrixWorld(true);
  const a = new THREE.Vector3(W / 2, 0.1, -D / 2).project(c);
  const b = new THREE.Vector3(W / 2, 0.1, D / 2).project(c);
  const px = (Math.abs(a.y - b.y) / 2) * window.innerHeight * DPR;
  const maxH = Math.min(renderer.capabilities.maxTextureSize, 2560);
  const h = clamp(Math.round((px * 1.04) / 16) * 16, 1024, maxH);
  if (Math.abs(h - pageSize.h) / pageSize.h > 0.12) {
    pageSize.h = h;
    pageSize.w = Math.round(h / PAGE_ASPECT);
    return true;
  }
  return false;
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
};
const esc = (s = "") => s.replace(/[&<>"]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[ch]);

function syncChrome() {
  const L = ui[state.lang];
  document.documentElement.lang = state.lang;
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
  els.prev.disabled = state.spread === 0;
  els.next.disabled = state.spread === spreads().length - 1;
  // held at a choice, the next arrow rests dimmed but stays a button: a press shows why
  const held = nextHeld();
  els.next.setAttribute("aria-disabled", String(held));
  els.prev.setAttribute("aria-label", L.prev);
  els.next.setAttribute("aria-label", held ? L.nextAfterChoice : L.next);
  els.langGroup.setAttribute("aria-label", L.langLabel);
  els.langGroup.dataset.lang = state.lang;
  els.langGroup.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.lang === state.lang)));
}

// One real button per available tale (keyboard and screen readers); unavailable tales are not
// listed at all, exactly as their ribbons do not respond. Updated in place so focus survives.
function syncTaleNav() {
  const T = taleUi[state.lang];
  els.taleNav.setAttribute("aria-label", T.talesLabel);
  const list = tales.filter((t) => t.available);
  if (els.taleNav.children.length !== list.length) {
    els.taleNav.innerHTML = list.map((t) => `<button type="button" data-tale="${t.index}"></button>`).join("");
  }
  [...els.taleNav.children].forEach((b) => {
    const t = tales[Number(b.dataset.tale)];
    b.textContent = T.goToTale(t.title[state.lang]);
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
    els.mirror.innerHTML = `<article lang="${state.lang}"><p>${esc(L.bookTitle)}</p><h1>${esc(meta.title)}</h1><p>${esc(meta.kicker)}</p><p>${esc(L.dedication.replace("\n", " "))}</p><p>${esc(L.turnToBegin)}</p></article>`;
    return;
  }
  const t = story().pageText(s.page, resolved(), state.lang);
  const img = spreadImage(s, resolved());
  const selected = state.choices[s.page];
  els.mirror.innerHTML = `<article lang="${state.lang}">
    <h2>${esc(L.pageCount(s.page, story().PAGE_COUNT))}: ${esc(t.title)}</h2>
    ${t.paragraphs.map((p) => `<p>${esc(p.text)}</p>`).join("")}
    ${img ? `<figure><figcaption>${esc(L.illustration)}: ${esc(alt(img))}</figcaption></figure>` : ""}
    ${t.choices.length ? `<div class="choices" role="group" aria-label="${esc(L.choose)}">${t.choices.map((c) => `<button type="button" data-choice="${esc(c.id)}" aria-pressed="${selected === c.id}">${esc(c.label)}</button>`).join("")}</div>` : ""}
    ${selected ? `<p>${esc(t.choices.find((c) => c.id === selected)?.response || "")}</p>` : t.choices.length ? `<p>${esc(L.turnsAfterChoice)}</p>` : ""}
    ${t.ending ? `<div class="choices"><button type="button" data-choice="restart">${esc(L.restartStory)}</button></div>` : ""}
    ${t.note ? `<aside><h3>${esc(t.note.title)}</h3><p>${esc(t.note.body)}</p></aside>` : ""}
  </article>`;
}

// ---------------------------------------------------------------- interaction
const busy = () => Boolean(state.turning || state.fade || state.riffle);

function choose(id) {
  if (id === "restart") return restart();
  const page = spreads()[state.spread].page;
  if (!page || state.choices[page] === id) return;
  const from = state.choices[page] || null;
  const shown = [book.leftMat.map, book.rightMat.map];
  const held = nextHeld();
  state.choices[page] = id;
  invalidatePages();
  applySpread();
  shown.forEach(dropTexture);
  syncChrome();
  syncMirror();
  prefetch();
  sealChoice(from);
  if (held) wakeNext();
}

function restart() {
  state.choices = {};
  invalidatePages();
  if (portrait()) setView("right", performance.now() / 1000);
  crossfade(0);
}

function setLang(lang) {
  if (lang === state.lang || state.riffle) return; // the leaves in flight carry this language's pages
  const shown = [book.leftMat.map, book.rightMat.map];
  const from = shownPages(); // what the reader sees now: the type to rewrite
  state.lang = lang;
  invalidatePages();
  applySpread();
  shown.forEach(dropTexture);
  rewriteSpread(from);
  book.makeCover(ui[lang].bookTitle, ui[lang].bookSubtitle);
  syncChrome();
  syncMirror();
  syncTaleNav();
}

function go(dir) {
  if (state.intro && !state.intro.done) return skipIntro();
  if (busy()) return;
  const now = performance.now() / 1000;
  if (portrait()) {
    // one page at a time: first glide across the spread, then turn the leaf
    if (dir > 0 && state.view === "left") return setView("right", now);
    if (dir < 0 && state.view === "right") return setView("left", now);
  }
  const to = state.spread + dir;
  if (to < 0 || to >= spreads().length) return;
  if (dir > 0 && awaitsChoice()) return resist(now);
  endResist();
  if (Q.reduced) return crossfade(to);
  startTurn(dir, now);
  if (portrait()) setView(dir > 0 ? "left" : "right", now, 1.0);
}

function setView(view, now, dur = 0.75) {
  state.view = view;
  moveCamera(readingPose(view), dur, now);
  syncChrome(); // in portrait the next arrow first glides across the spread, then turns the leaf
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
  cam.settle = now;
  syncChrome();
  syncMirror();
  prefetch();
}

function crossfade(to, toTale = state.tale) {
  const L = getPage(toTale, to, "left").tex;
  const R = getPage(toTale, to, "right").tex;
  book.fadeLeft.material.map = L;
  book.fadeRight.material.map = R;
  book.fadeLeft.material.opacity = book.fadeRight.material.opacity = 0;
  book.fadeLeft.visible = book.fadeRight.visible = true;
  state.fade = { to, toTale, t0: performance.now() / 1000, dur: toTale === state.tale ? 0.35 : 0.6 };
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
function sealChoice(from) {
  if (Q.reduced) return;
  sealMoment({ from }, SEAL, Q.sealAt);
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
// Desktop: the seal under the pointer warms a little, and one dimmed beside a choice already made
// brightens, a hint that it can still be chosen. A page moment held while the pointer stays; each
// seal's warmth eases in and out on its own (`levels`, read by the choice block as it draws).
const HOVER = 0.18; // s
function hoverSeal(id) {
  if (state.seal?.levels) return void (state.seal.want = id);
  if (!id || state.seal || state.ink || state.resist) return;
  const anim = { from: state.choices[spreads()[state.spread].page] || null, levels: {} };
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
// on the page out of view, the camera then glides over to them. No words, no sound; screen
// readers hear the plaque again (page, waiting for your choice). Reduced motion: the leaf stays
// down, the seals only glow.
const RESIST = { dur: 0.46, glint: 0.16 }; // s
const nextHeld = () => awaitsChoice() && (!portrait() || state.view === "right");
function resist(now) {
  if (state.resist) return;
  announceGate();
  const side = choiceSide();
  const away = side && !inView(side) ? side : null;
  if (!Q.reduced) {
    // the leaf carries the right page on its face (see holdLeaf); its back is never seen
    book.sheetBackMat.map = book.sheetBackMat.emissiveMap = genericPage();
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
  book.sheetFrontMat.map = book.sheetFrontMat.emissiveMap = genericPage();
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
// While the page lies still, a real button (#clasp, book.html) is raised over the print, the same
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
// The raised face: gold leaf, light and shadow from CSS (book.html, a sibling of the language
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
function startRiffle(toTale, now, frozenT = null) {
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
    starts.push(k === 0 ? 0.14 : starts[k - 1] + RIFFLE.gap * (last ? 1.7 : 0.8 + 0.4 * Math.sin((k / n) * Math.PI)));
    durs.push(last ? RIFFLE.last : RIFFLE.leaf);
  }
  const gen = genericPage();
  const from = { L: getPage(fromTale, state.spread, "left").tex, R: getPage(fromTale, state.spread, "right").tex };
  const to = { L: getPage(toTale, 0, "left").tex, R: getPage(toTale, 0, "right").tex };
  const faces = starts.map((_, k) =>
    dir > 0 ? { front: k === 0 ? from.R : gen, back: k === n - 1 ? to.L : gen } : { front: k === n - 1 ? to.R : gen, back: k === 0 ? from.L : gen }
  );
  book.leaves.forEach((leaf, k) => {
    leaf.group.visible = false;
    if (k >= n) return;
    leaf.frontMat.map = leaf.frontMat.emissiveMap = faces[k].front;
    leaf.backMat.map = leaf.backMat.emissiveMap = faces[k].back;
  });
  // what lies beneath the stack of leaves still to turn
  if (dir > 0) book.rightMat.map = n === 1 ? to.R : gen;
  else book.leftMat.map = n === 1 ? to.L : gen;
  state.riffle = { fromTale, toTale, g0, g1, dir, n, starts, durs, faces, to, t0: now, frozenT, landed: -1, total: starts[n - 1] + durs[n - 1] };
  tug.press = toTale;
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
  // the last leaf uncovers the tale's own first page
  if (R.n > 1 && t >= R.starts[R.n - 1]) {
    if (R.dir > 0) book.rightMat.map = R.to.R;
    else book.leftMat.map = R.to.L;
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
  cam.settle = now;
  syncChrome();
  syncMirror();
  syncTaleNav();
  if (updatePageSize()) {
    invalidatePages();
    applySpread();
  }
  prefetch();
  if (portrait() && state.view !== "right") setView("right", now);
}

// A tap on a ribbon. The tale being read: back to its title spread.
function openTale(i) {
  if (state.intro && !state.intro.done) return skipIntro();
  const now = performance.now() / 1000;
  if (!startRiffle(i, now) && !busy()) {
    // already there: a small acknowledging tug
    tug.press = i;
    setTimeout(() => tug.press === i && !state.riffle && (tug.press = -1), 260);
  }
}

const raycaster = new THREE.Raycaster();
const ndc = new THREE.Vector2();
function pick(clientX, clientY) {
  ndc.set((clientX / window.innerWidth) * 2 - 1, -(clientY / window.innerHeight) * 2 + 1);
  raycaster.setFromCamera(ndc, camera);
  const hit = raycaster.intersectObjects([book.leftPage, book.rightPage], false)[0];
  if (!hit) return null;
  const side = hit.object === book.leftPage ? "left" : "right";
  const ux = hit.uv.x * 1000;
  const uy = (1 - hit.uv.y) * 1000 * PAGE_ASPECT;
  const entry = getPage(state.tale, state.spread, side);
  const region = entry.hits.find((h) => ux >= h.x && ux <= h.x + h.w && uy >= h.y && uy <= h.y + h.h);
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
});
renderer.domElement.addEventListener("pointermove", (e) => {
  if (e.pointerType !== "mouse" || down) return;
  const r = ribbonAt(e);
  tug.hover = live(r) ? r : -1;
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
  const seal = p?.region?.action.type === "choice" && p.region.action.id !== "restart" ? p.region.action.id : null;
  if (!busy()) hoverSeal(seal);
  // a held leaf's edge does not invite a turn (a tap there still shows why)
  const edge = !portrait() && p?.fromSpine > 0.68 && !(p.side === "right" && nextHeld());
  const active = p && (p.region || edge);
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
els.prev.addEventListener("click", () => go(-1));
els.next.addEventListener("click", () => go(1));
els.next.addEventListener("animationend", () => els.next.classList.remove("wake"));
els.langGroup.addEventListener("click", (e) => {
  const b = e.target.closest("button[data-lang]");
  if (b) setLang(b.dataset.lang);
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
  if (b) openTale(Number(b.dataset.tale));
});
// a keyboard user sees which ribbon the focused button belongs to: it lifts
els.taleNav.addEventListener("focusin", (e) => {
  const b = e.target.closest("button[data-tale]");
  tug.focus = b ? Number(b.dataset.tale) : -1;
  if (b) prefetchTale(tug.focus);
});
els.taleNav.addEventListener("focusout", () => (tug.focus = -1));

// ---------------------------------------------------------------- intro
const INTRO = { holdEnd: 0.7, coverStart: 0.7, coverEnd: 3.0, camStart: 1.4, camEnd: 5.0 };
function introAt(t) {
  const c = clamp01((t - INTRO.coverStart) / (INTRO.coverEnd - INTRO.coverStart));
  const theta = -Math.PI * (1 - easeInOut(c));
  if (theta !== book.cover) {
    book.setCover(theta);
    layoutRibbons(); // the gutter ribbon settles into the fold as the cover lands
  }
  const k = easeInOut(clamp01((t - INTRO.camStart) / (INTRO.camEnd - INTRO.camStart)));
  const a = state.intro.start;
  const b = state.intro.end;
  camera.position.lerpVectors(a.pos, b.pos, k);
  // arc the path a little higher so the camera rises over the book rather than through it
  camera.position.y += Math.sin(k * Math.PI) * 0.35;
  cam.pose.target.lerpVectors(a.target, b.target, k);
  camera.lookAt(cam.pose.target);
  state.intro.light = 0.55 + 0.45 * easeOut(clamp01(t / 1.6));
  renderer.shadowMap.needsUpdate = true;
  if (t >= INTRO.camEnd) endIntro();
}
function skipIntro() {
  if (!state.intro || state.intro.done) return;
  state.intro.t0 = performance.now() / 1000 - INTRO.camEnd;
}
function endIntro() {
  state.intro.done = true;
  state.intro.light = 1;
  book.setCover(0);
  layoutRibbons();
  cam.pose = readingPose();
  camera.position.copy(cam.pose.pos);
  camera.lookAt(cam.pose.target);
  els.chrome.forEach((c) => c.classList.remove("hidden"));
  renderer.shadowMap.needsUpdate = true;
}

// ---------------------------------------------------------------- perf
const perf = { frames: [], cpu: [], last: 0, shown: 0, riffle: null, lastRiffle: null };
const gpuName = (() => {
  const gl = renderer.getContext();
  const ext = gl.getExtension("WEBGL_debug_renderer_info");
  return ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER);
})();
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
  if (now - perf.shown < 500 || perf.frames.length < 10) return;
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
  if (Q.perf) {
    out.gpu = gpuName;
    document.title = `perf ${JSON.stringify(out)}`; // readable from outside (DevTools /json/list)
    els.perf.hidden = false;
    els.perf.textContent = Object.entries(out).map(([k, v]) => `${k.padEnd(12)} ${v}`).join("\n");
  }
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
  const cpu0 = performance.now();
  const now = cpu0 / 1000;
  const dt = lastFrame ? Math.min(0.1, now - lastFrame) : 1 / 60;
  lastFrame = now;
  const t = Q.still ? Q.t : now - clockStart;
  const motion = !Q.reduced;

  // intro
  if (state.intro && !state.intro.done) introAt(Q.introAt ?? now - state.intro.t0);

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
  room.dust.mat.uniforms.uPx.value = DPR * window.innerHeight * 0.0036;

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
    book.fadeLeft.material.opacity = book.fadeRight.material.opacity = p;
    if (p >= 1) {
      const { to, toTale } = state.fade;
      const switched = toTale !== state.tale;
      state.fade = null;
      state.tale = toTale;
      state.spread = to;
      applySpread();
      book.fadeLeft.visible = book.fadeRight.visible = false;
      syncChrome();
      syncMirror();
      if (switched) syncTaleNav();
      prefetch();
      if (switched && portrait()) setView("right", now);
    }
  }
  // tale switch
  if (state.riffle) {
    const R = state.riffle;
    const done = riffleAt(R.frozenT ?? now - R.t0);
    if (done && R.frozenT === null) finishRiffle(now);
  }
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
      camera.position.x += Math.sin(t * 0.21) * 0.0035 * dist;
      camera.position.z += Math.sin(t * 0.17 + 1.1) * 0.0025 * dist;
      camera.position.y += Math.sin(t * 0.13 + 2.0) * 0.002 * dist;
    }
    camera.lookAt(target);
  }

  renderer.render(scene, camera);
  if (renderer.shadowMap.needsUpdate && !state.turning && !state.riffle && !(state.intro && !state.intro.done)) renderer.shadowMap.needsUpdate = false;
  placeClasp(); // after the render: the camera's matrices are this frame's
  perfTick(performance.now(), performance.now() - cpu0);
  requestAnimationFrame(frame);
}

function resize() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  renderer.setSize(w, h);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  // the page controls sit beside the ribbons in landscape and under the page in portrait
  document.documentElement.dataset.layout = portrait() ? "portrait" : "landscape";
  if (!book) return;
  syncChrome(); // turned to portrait, the next arrow may glide across the spread first
  // mid-riffle the leaves hold their textures; the new size is picked up when it lands
  if (!state.riffle && updatePageSize()) {
    invalidatePages();
    applySpread();
  }
  if (!state.intro || state.intro.done) {
    cam.pose = readingPose();
    cam.to = null;
  } else {
    state.intro.end = readingPose();
    state.intro.start = introStartPose();
  }
}

async function init() {
  resize();
  loaded = await loadAll();
  artist = createPageArtist({ parchment: loaded.parchment, grain: makeGrain(256), images: loaded.images });
  book = createBook({ tex: loaded.book });
  scene.add(book.root);
  book.makeCover(ui[state.lang].bookTitle, ui[state.lang].bookSubtitle);
  ribbons = createRibbons({ tales, book });
  book.root.add(ribbons.group);
  room = await createRoom({ renderer, scene, tex: { wood: loaded.wood, backdrop: loaded.backdrop, ...loaded.room }, base: BASE, parchmentImg: loaded.parchment });
  room.base = { key: room.key.intensity, glow: room.glow.intensity };

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
    state.intro = { t0: performance.now() / 1000, done: false, light: 0.55 };
    state.intro.end = cam.pose;
    state.intro.start = introStartPose();
    book.setCover(-Math.PI);
    camera.position.copy(state.intro.start.pos);
    cam.pose = { pos: cam.pose.pos.clone(), target: state.intro.start.target.clone() };
    camera.lookAt(cam.pose.target);
  } else {
    camera.position.copy(cam.pose.pos);
    camera.lookAt(cam.pose.target);
    els.chrome.forEach((c) => c.classList.remove("hidden"));
  }
  renderer.shadowMap.needsUpdate = true;
  // compile everything before the first visible frame, including the turning leaf and the
  // crossfade overlays (compile() skips hidden meshes, which would stall the first turn)
  const hidden = [...book.leaves.map((l) => l.group), book.fadeLeft, book.fadeRight].filter((o) => !o.visible);
  const tex = book.rightMat.map;
  for (const l of book.leaves) for (const m of [l.frontMat, l.backMat]) if (!m.map) m.map = m.emissiveMap = tex;
  for (const m of [book.fadeLeft.material, book.fadeRight.material]) {
    if (!m.map) m.map = tex;
    m.opacity = 0;
  }
  hidden.forEach((o) => (o.visible = true));
  renderer.compile(scene, camera);
  // one hidden render with the leaf in the air also builds its shadow-depth programs
  if (!state.turning) {
    const pr = sideProfile(book.state.hR);
    book.poseTurn(0.5, 1, pr, sideProfile(book.state.hL));
    renderer.shadowMap.needsUpdate = true;
    renderer.render(scene, camera);
  }
  hidden.forEach((o) => (o.visible = false));
  renderer.shadowMap.needsUpdate = true;
  syncChrome();
  syncMirror();
  syncTaleNav();
  // review: a ribbon shown lifted, or a tale switch started (and possibly frozen) right away
  if (tug.review >= 0) updateTugs(1);
  if (Q.switchTo && taleOf(Q.switchTo) >= 0) startRiffle(taleOf(Q.switchTo), performance.now() / 1000, Q.switchAt);
  els.veil.classList.add("gone");
  // review aid: the measured body size at the reading pose, readable without a running frame loop
  document.documentElement.dataset.bodyPx = String(bodyPx());
  requestAnimationFrame(frame);
  prefetch();
}

// review/testing script (see header)
function runActions() {
  const steps = (params.get("actions") || "").split(",").filter(Boolean);
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
  if (generic) generic.h = -1;
  applySpread();
});
init().then(runActions);
