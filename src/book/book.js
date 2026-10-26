// The book: tooled leather boards with brass corners and clasps, a raised-band spine,
// two page blocks with gilded stacked edges, two resting pages and one turning sheet.
// Book space: spine along z at x = 0, right page towards +x, head of the page at -z,
// desk at y = 0.
//
// Every page surface is built from one profile: a curve parameterised by arc
// length s (0 at the spine, W at the fore-edge) whose angle is integrated into
// x/y. Resting pages and the turning sheet share it, so a page never stretches
// and the turn starts and ends exactly on the resting shape.
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

export const W = 1.0; // page width (arc length)
export const D = 1.38; // page depth (head to tail)
export const BT = 0.03; // board thickness
export const HT = 0.105; // total thickness of all leaves
// how far the boards stand out beyond the leaves; the baked board textures
// (textures/cover_*, boardin_*) are laid out for these three numbers
export const SQUARE = 0.058;
export const HINGE = 0.012;
export const RAD = 0.006; // rounded board edges
// brass plates on the inside of the boards (corners, clasp): extruded this deep, plus a bevel on
// each face; the outer leaves lie over their inner tips at the fore-edge
const BEVEL = 0.0016;
const CORNER_T = 0.0028;
const CLASP_T = 0.003;
const BRASS_TOP = BT + Math.max(CORNER_T, CLASP_T) + 2 * BEVEL;
const SPINE_BANDS = [0.2, 0.35, 0.5, 0.65, 0.8]; // raised bands, as fractions head -> tail
const NS = 52;
const NZ_SHEET = 14;
const S = Array.from({ length: NS + 1 }, (_, i) => W * Math.pow(i / NS, 1.45));

const clamp01 = (t) => Math.min(1, Math.max(0, t));
const smooth = (t) => t * t * (3 - 2 * t);

// Rest angle profile for a block of thickness h: the leaf rises out of the gutter
// and relaxes into a gentle droop towards the fore-edge.
function restAngles(h) {
  const lam = 0.07;
  const rise = 0.006 + h * 0.62;
  const a0 = Math.min(1.1, rise / lam);
  // the droop towards the fore-edge never sinks the leaf below the board on a thin block
  const droop = 0.05 * Math.min(1, Math.max(0.12, (h - 0.004) / 0.045));
  return S.map((s) => a0 * Math.exp(-s / lam) - droop * Math.pow(s / W, 1.7));
}

function integrate(angles, y0, outX, outY) {
  outX[0] = 0;
  outY[0] = y0;
  for (let i = 1; i <= NS; i++) {
    const ds = S[i] - S[i - 1];
    const a = (angles[i] + angles[i - 1]) * 0.5;
    outX[i] = outX[i - 1] + Math.cos(a) * ds;
    outY[i] = outY[i - 1] + Math.sin(a) * ds;
  }
}

// Profile of a side: angles plus the spine height that puts the crest at the block top.
export function sideProfile(h) {
  const angles = restAngles(h);
  const xs = new Float32Array(NS + 1);
  const ys = new Float32Array(NS + 1);
  integrate(angles, 0, xs, ys);
  let peak = 0;
  for (let i = 0; i <= NS; i++) peak = Math.max(peak, ys[i]);
  // the leaf rests on the brass at the fore-edge and never droops into it: on the thinnest block
  // (the title spread) its edge would lie exactly in the plane of the corner plates' tops and
  // z-fight with them. It stays 1.2 mm over the highest plate (the next spread's leaf: 1.6 mm).
  const y0 = Math.max(BT + h - peak, BRASS_TOP + 0.0012 - ys[NS]);
  for (let i = 0; i <= NS; i++) ys[i] = Math.max(ys[i] + y0, BT + 0.003);
  return { angles, xs, ys, y0, h };
}

// How far a turning leaf has swung over at the spine, 0 (where it lay) .. 1 (landed), at turn
// time t: it lifts off and settles gently. A ribbon in the fold goes with it (main.js).
export const leafSwing = (t) => smooth(clamp01((clamp01(t) - 0.04) / 0.82));

// Thickness of the left and right blocks when spread i of n is open.
export function thicknessFor(i, n) {
  const fraction = n > 1 ? i / (n - 1) : 0;
  const hL = 0.008 + (HT - 0.016) * fraction;
  return [hL, HT - hL];
}

function gridIndex(nx, nz, flip) {
  const idx = [];
  for (let j = 0; j < nz; j++) {
    for (let i = 0; i < nx; i++) {
      const a = j * (nx + 1) + i;
      const b = a + 1;
      const c = a + nx + 1;
      const d = c + 1;
      if (flip) idx.push(a, b, c, b, d, c);
      else idx.push(a, c, b, b, c, d);
    }
  }
  return idx;
}

// Resting page surface for one side.
function pageGeometry(side, nz = 6) {
  const g = new THREE.BufferGeometry();
  const count = (NS + 1) * (nz + 1);
  g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(count * 3), 3));
  const uv = new Float32Array(count * 2);
  for (let j = 0; j <= nz; j++) {
    for (let i = 0; i <= NS; i++) {
      const k = j * (NS + 1) + i;
      uv[k * 2] = side > 0 ? S[i] / W : 1 - S[i] / W;
      uv[k * 2 + 1] = 1 - j / nz;
    }
  }
  g.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
  g.setIndex(gridIndex(NS, nz, side < 0));
  g.userData.nz = nz;
  return g;
}

function writePage(g, side, prof, lift = 0) {
  const nz = g.userData.nz;
  const p = g.attributes.position.array;
  for (let j = 0; j <= nz; j++) {
    const z = -D / 2 + (j / nz) * D;
    for (let i = 0; i <= NS; i++) {
      const k = (j * (NS + 1) + i) * 3;
      p[k] = side * prof.xs[i];
      p[k + 1] = prof.ys[i] + lift;
      p[k + 2] = z;
    }
  }
  g.attributes.position.needsUpdate = true;
  g.computeVertexNormals();
  g.computeBoundingSphere();
}

// Page block: end caps (head and tail) under the page profile and a fore-edge that
// slopes out towards the board, so the stacked, gilded leaf edges show from above.
const LINE = 1.1; // leaf-line texture repeat height in world units: a few bold leaf lines across the edge
function foreSlope(prof) {
  return Math.min(0.036, (prof.ys[NS] - BT) * 0.42 + 0.005);
}
function blockGeometry(side, prof) {
  const pos = [];
  const uv = [];
  const idx = [];
  const xe = prof.xs[NS];
  const ye = prof.ys[NS];
  const sl = foreSlope(prof);
  // fore-edge profile: leaves drape over the edge in a soft convex curve
  const FE = 5;
  const fx = [];
  const fy = [];
  for (let k = 0; k <= FE; k++) {
    const t = k / FE;
    fx.push(xe + sl * (1 - (1 - t) * (1 - t)));
    fy.push(ye - (ye - BT) * t);
  }
  for (const zc of [-D / 2 + 0.002, D / 2 - 0.002]) {
    const base = pos.length / 3;
    for (let i = 0; i <= NS; i++) {
      const x = side * prof.xs[i];
      pos.push(x, BT, zc, x, prof.ys[i], zc);
      uv.push(prof.xs[i] / W, 0, prof.xs[i] / W, (prof.ys[i] - BT) / LINE);
    }
    for (let i = 0; i < NS; i++) {
      const a = base + i * 2;
      if (side > 0) idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
      else idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
    // the cap continues under the draped fore-edge
    const c0 = pos.length / 3;
    for (let k = 0; k <= FE; k++) {
      pos.push(side * fx[k], fy[k], zc);
      uv.push(fx[k] / W, (fy[k] - BT) / LINE);
    }
    const cb = pos.length / 3;
    pos.push(side * xe, BT, zc);
    uv.push(xe / W, 0);
    for (let k = 0; k < FE; k++) idx.push(cb, c0 + k, c0 + k + 1);
  }
  // fore-edge strip
  const base = pos.length / 3;
  for (let k = 0; k <= FE; k++) {
    const v = (fy[k] - BT) / LINE;
    pos.push(side * fx[k], fy[k], -D / 2, side * fx[k], fy[k], D / 2);
    uv.push(0, v, D * 3, v);
  }
  for (let k = 0; k < FE; k++) {
    const a = base + k * 2;
    if (side > 0) idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
    else idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

// Gilded leaf edges: rubbed gold with the fine lines of the individual leaves.
function edgeTextures() {
  const mk = () => {
    const c = document.createElement("canvas");
    c.width = 64;
    c.height = 512;
    return c;
  };
  const cc = mk();
  const cr = mk();
  const g = cc.getContext("2d");
  const r = cr.getContext("2d");
  g.fillStyle = "#dcb870";
  g.fillRect(0, 0, 64, 512);
  r.fillStyle = "rgb(255,125,85)"; // AO, roughness ~0.49, metalness ~0.33 (rubbed, dull gilt)
  r.fillRect(0, 0, 64, 512);
  let s = 99;
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  for (let y = 0; y < 512; y += 4 + Math.floor(rnd() * 4)) {
    // each leaf: a slightly different gold, and a dark gap below it where the leaves part
    const k = rnd();
    g.fillStyle = `rgb(${196 + k * 44},${156 + k * 36},${86 + k * 28})`;
    g.fillRect(0, y, 64, 3);
    g.fillStyle = `rgba(${52 + rnd() * 30},${32 + rnd() * 18},14,${0.55 + rnd() * 0.35})`;
    g.fillRect(0, y + 3, 64, 1 + (rnd() < 0.3 ? 1 : 0));
    r.fillStyle = "rgb(255,215,40)";
    r.fillRect(0, y + 3, 64, 2);
  }
  // rubbed patches where the paper shows through the gilt
  for (let i = 0; i < 26; i++) {
    const x = rnd() * 64;
    const y = rnd() * 512;
    g.fillStyle = `rgba(214,190,140,${0.15 + rnd() * 0.25})`;
    g.fillRect(x, y, 6 + rnd() * 20, 2 + rnd() * 10);
  }
  const make = (c, srgb) => {
    const t = new THREE.CanvasTexture(c);
    if (srgb) t.colorSpace = THREE.SRGBColorSpace;
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    return t;
  };
  return { map: make(cc, true), orm: make(cr, false) };
}

// The reader's eye adapts to the candle. The light on the pages (room.js: the key, the glow and
// the warm fill, together about R:G:B 1.7 : 1 : 0.55 there) keeps all its warmth on the desk,
// the boards and the gilt; on the paper half of its cast is taken back (a partial white balance
// that keeps the luminance), so the illustrations keep their own blues, greens and reds on a
// page that still reads cream and candle-lit. Retune PAGE_LIGHT if the lights in room.js change.
const PAGE_LIGHT = [1.7, 1, 0.55]; // linear
const PAGE_ADAPT = 0.5; // 0: the full candle cast on the paper, 1: a neutral page
const PAGE_BALANCE = (() => {
  const lum = (c) => 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  const gain = PAGE_LIGHT.map((c) => Math.pow(c, -PAGE_ADAPT));
  const k = lum(PAGE_LIGHT) / lum(PAGE_LIGHT.map((c, i) => c * gain[i]));
  return gain.map((g) => (g * k).toFixed(4)).join(", ");
})();

// Paper material: aged edges, a soft gutter shadow and the fibre relief of the sheet,
// so the spread reads as real paper lying in a binding even under flat light.
export function pageMaterial(spineU, { transparent = false, fibre = null } = {}) {
  const m = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9, metalness: 0, transparent });
  if (fibre) {
    m.normalMap = fibre;
    m.normalScale = new THREE.Vector2(0.55, 0.55);
  }
  m.defines = { USE_UV: "" };
  m.userData.uniforms = { uSpineU: { value: spineU }, uGutter: { value: 1 } };
  m.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, m.userData.uniforms);
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", "#include <common>\nuniform float uSpineU;\nuniform float uGutter;")
      .replace(
        "#include <map_fragment>",
        `#include <map_fragment>
        // edges of the leaf: warmer and darker, like paper handled for years
        float eF = abs(vUv.x - (1.0 - uSpineU));
        float eHT = min(vUv.y, 1.0 - vUv.y) * 1.38;
        float edge = min(eF, eHT);
        float aged = 0.5 * (1.0 - smoothstep(0.0, 0.03, edge)) + 0.2 * (1.0 - smoothstep(0.0, 0.11, edge));
        diffuseColor.rgb *= mix(vec3(1.0), vec3(0.8, 0.66, 0.48), aged);`
      )
      .replace(
        "#include <opaque_fragment>",
        `float dS = abs(vUv.x - uSpineU);
        float gut = uGutter * (0.5 * exp(-dS / 0.022) + 0.16 * exp(-dS / 0.09));
        outgoingLight *= mix(vec3(1.0), vec3(0.42, 0.3, 0.2), gut);
        outgoingLight *= vec3(${PAGE_BALANCE}); // the eye adapted to the candle (see PAGE_ADAPT)
        #include <opaque_fragment>`
      );
  };
  m.customProgramCacheKey = () => (fibre ? "book-page-f" : "book-page");
  return m;
}

// Gold title lettering for the cover's cartouche. Splits the title into balanced lines.
function titleLines(title) {
  const words = title.split(" ");
  if (words.length <= 2) return words.length === 2 && title.length > 16 ? words : [title];
  if (words.length === 3) return words;
  // "The Book of Magical Tales" -> "The Book" / "of Magical" / "Tales"
  const lines = [];
  const per = Math.ceil(words.length / 3);
  for (let i = 0; i < words.length; i += per) lines.push(words.slice(i, i + per).join(" "));
  return lines;
}

// The front cover: generated tooled-leather art (with its normal and ORM maps) plus the
// title set in gold leaf at runtime, embossed into the normal map and metallic in the ORM.
function coverMaps(art, title, subtitle) {
  const w = art.map.width;
  const h = art.map.height;
  const canvas = () => {
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    return c;
  };
  const cA = canvas();
  const cN = canvas();
  const cO = canvas();
  const gA = cA.getContext("2d");
  const gN = cN.getContext("2d", { willReadFrequently: true });
  const gO = cO.getContext("2d");
  gA.drawImage(art.map, 0, 0);
  gN.drawImage(art.normal, 0, 0);
  gO.drawImage(art.orm, 0, 0);

  // the cartouche of the art: centre and inner size, as fractions of the board
  const cx = w * 0.5;
  const cy = h * 0.455;
  const maxW = w * 0.44;
  const lines = titleLines(title);
  let size = lines.length > 2 ? 74 : 84;
  const setFont = (g, s) => (g.font = `600 ${s}px "EB Garamond", Georgia, serif`);
  setFont(gA, size);
  while (size > 44 && Math.max(...lines.map((l) => gA.measureText(l).width)) > maxW) setFont(gA, --size);
  const lh = size * 1.0;
  const subSize = Math.round(size * 0.42);
  const subGap = subSize * 1.75;
  // centre the block (cap height of the first line .. subtitle baseline) on the cartouche
  const capH = size * 0.66;
  const blockH = (lines.length - 1) * lh + subGap + capH;
  const y0 = cy - blockH / 2 + capH;
  const drawText = (g, fill) => {
    g.save();
    g.textAlign = "center";
    g.textBaseline = "alphabetic";
    g.fillStyle = fill;
    setFont(g, size);
    lines.forEach((l, i) => g.fillText(l, cx, y0 + i * lh));
    g.font = `italic 500 ${subSize}px "EB Garamond", Georgia, serif`;
    g.fillText(subtitle, cx, y0 + (lines.length - 1) * lh + subGap);
    g.restore();
  };
  // albedo: a dark impression under the leaf, then the gold
  gA.save();
  gA.translate(1.5, 2.5);
  drawText(gA, "rgba(18,7,2,0.75)");
  gA.restore();
  const gr = gA.createLinearGradient(0, cy - blockH / 2, 0, cy + blockH / 2);
  gr.addColorStop(0, "#efd08a");
  gr.addColorStop(0.45, "#cf9f4c");
  gr.addColorStop(0.7, "#b0803a");
  gr.addColorStop(1, "#e2bd6c");
  drawText(gA, gr);
  // ORM: gold leaf is metal and fairly smooth
  drawText(gO, "rgb(255,80,245)");
  // normal map: emboss the lettering (raised leaf) inside the cartouche region
  const rx = Math.round(cx - maxW * 0.7);
  const ry = Math.round(cy - blockH / 2 - size * 0.5);
  const rw = Math.round(maxW * 1.4);
  const rh = Math.round(blockH + size * 1.2);
  const cm = document.createElement("canvas");
  cm.width = rw;
  cm.height = rh;
  const gm = cm.getContext("2d", { willReadFrequently: true });
  gm.fillStyle = "#000";
  gm.fillRect(0, 0, rw, rh);
  gm.translate(-rx, -ry);
  gm.filter = "blur(1.2px)";
  drawText(gm, "#fff");
  const hm = gm.getImageData(0, 0, rw, rh).data;
  cm.width = cm.height = 0; // iOS returns a canvas's memory at once only when it is sized to nothing
  const nd = gN.getImageData(rx, ry, rw, rh);
  // height at (x, y), clamped to the region: the red channel, 0..1 (rows and columns indexed
  // directly, the arithmetic as it was)
  for (let y = 0; y < rh; y++) {
    const row = y * rw * 4;
    const up = Math.max(0, y - 1) * rw * 4;
    const down = Math.min(rh - 1, y + 1) * rw * 4;
    for (let x = 0; x < rw; x++) {
      const left = Math.max(0, x - 1) * 4;
      const right = Math.min(rw - 1, x + 1) * 4;
      const dx = hm[row + right] / 255 - hm[row + left] / 255;
      const dy = hm[down + x * 4] / 255 - hm[up + x * 4] / 255;
      if (dx === 0 && dy === 0) continue;
      const k = (y * rw + x) * 4;
      const nx = -dx * 2.2;
      const ny = dy * 2.2;
      const l = Math.hypot(nx, ny, 1);
      nd.data[k] = (nx / l) * 127.5 + 127.5;
      nd.data[k + 1] = (ny / l) * 127.5 + 127.5;
      nd.data[k + 2] = (1 / l) * 127.5 + 127.5;
    }
  }
  gN.putImageData(nd, rx, ry);
  const tex = (c, srgb) => {
    const t = new THREE.CanvasTexture(c);
    if (srgb) t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  };
  return { map: tex(cA, true), normal: tex(cN, false), orm: tex(cO, false) };
}

// Ornate brass corner piece: corner at the origin, legs along +x and +y (world +x and -z).
function cornerShape(L) {
  const s = new THREE.Shape();
  s.moveTo(0, 0);
  s.lineTo(L, 0);
  s.quadraticCurveTo(L * 1.0, L * 0.16, L * 0.8, L * 0.2);
  s.quadraticCurveTo(L * 0.6, L * 0.2, L * 0.56, L * 0.32);
  s.quadraticCurveTo(L * 0.62, L * 0.5, L * 0.48, L * 0.48);
  s.quadraticCurveTo(L * 0.5, L * 0.62, L * 0.32, L * 0.56);
  s.quadraticCurveTo(L * 0.2, L * 0.6, L * 0.2, L * 0.8);
  s.quadraticCurveTo(L * 0.16, L * 1.0, 0, L);
  s.closePath();
  // a small pierced hole near the inner tip
  const hole = new THREE.Path();
  hole.absellipse(L * 0.35, L * 0.35, L * 0.045, L * 0.045, 0, Math.PI * 2, true);
  s.holes.push(hole);
  return s;
}
function plateGeometry(shape, depth) {
  const g = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelThickness: BEVEL, bevelSize: 0.0022, bevelSegments: 2, curveSegments: 10 });
  // shape (x, y) -> world (x, -z), extrusion -> +y, bottom on y = 0
  g.rotateX(-Math.PI / 2);
  g.computeBoundingBox();
  g.translate(0, -g.boundingBox.min.y, 0);
  g.computeVertexNormals();
  return g;
}

export function createBook({ tex }) {
  const root = new THREE.Group();
  root.name = "book";

  // ----- materials -----
  const L = tex.leather;
  const leatherMat = new THREE.MeshStandardMaterial({
    color: 0x7a5a4a,
    map: L.map,
    normalMap: L.normal,
    normalScale: new THREE.Vector2(0.8, 0.8),
    roughnessMap: L.rough,
    roughness: 0.85,
    metalness: 0.0,
  });
  const ormMat = (set, extra = {}) =>
    new THREE.MeshStandardMaterial({ map: set.map, normalMap: set.normal, roughnessMap: set.orm, metalnessMap: set.orm, roughness: 1, metalness: 1, ...extra });
  const boardInMat = ormMat(tex.boardIn);
  // the back faces the candle square-on while the boards catch it at a glancing angle, so its
  // leather (not its gilt) is toned down to read as the same hide as the covers. The back is one
  // sheet seen from both sides: its faces turned into the book (front-facing; the strip under the
  // fold of an open book, seen through the gap between the leaves as the cover lands) are the
  // spine's lining, not the tooled hide: a plain warm brown linen, matte, with only the faintest
  // mottle (the strip is a few px wide: no weave fine enough to shimmer), without the gilt's bumps
  const spineMat = ormMat(tex.spine, { side: THREE.DoubleSide });
  spineMat.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <metalnessmap_fragment>",
        `#include <metalnessmap_fragment>
        diffuseColor.rgb *= mix(vec3(0.62, 0.55, 0.49), vec3(1.0), smoothstep(0.3, 0.7, metalnessFactor));
        if (gl_FrontFacing) {
          float mottle = sin(vMapUv.y * 37.0 + 1.3) * sin(vMapUv.x * 9.0 + vMapUv.y * 5.0);
          diffuseColor.rgb = vec3(0.12, 0.078, 0.05) * (1.0 + 0.06 * mottle);
          metalnessFactor = 0.0;
        }`
      )
      .replace("#include <roughnessmap_fragment>", "#include <roughnessmap_fragment>\nif (gl_FrontFacing) roughnessFactor = 0.92;")
      .replace("#include <normal_fragment_maps>", "vec3 liningNormal = normal;\n#include <normal_fragment_maps>\nif (gl_FrontFacing) normal = liningNormal;");
  };
  spineMat.customProgramCacheKey = () => "spine-leather";
  const coverMat = ormMat({ map: null, normal: null, orm: null });
  // the tooled cover lies 0.4 mm off the board's face: from the far, steep opening view of a
  // phone held upright that is under the depth buffer's resolution, and the bare board showed
  // through it in patches; pulled forward in depth it always wins
  coverMat.polygonOffset = true;
  coverMat.polygonOffsetFactor = -1;
  coverMat.polygonOffsetUnits = -4;
  const edge = edgeTextures();
  const edgeMat = new THREE.MeshStandardMaterial({ map: edge.map, roughnessMap: edge.orm, metalnessMap: edge.orm, roughness: 0.85, metalness: 1, side: THREE.DoubleSide });
  edgeMat.userData.envBoost = 1.7; // gilt edges mirror the warm room even where the candle cannot reach
  const B = tex.brass;
  const brassMat = new THREE.MeshStandardMaterial({ color: 0xd8ae62, map: B.map, roughnessMap: B.rough, roughness: 1.35, metalness: 1.0 });

  // ----- boards -----
  const boardW = W + SQUARE + HINGE;
  const boardD = D + SQUARE * 2;
  const boardGeo = new RoundedBoxGeometry(boardW, BT, boardD, 2, RAD);
  const rightBoard = new THREE.Mesh(boardGeo, leatherMat);
  rightBoard.position.set(boardW / 2, BT / 2, 0);
  rightBoard.castShadow = rightBoard.receiveShadow = true;
  root.add(rightBoard);

  // left side lives in a pivot so the front cover can swing open in the intro
  const yA = BT + HT / 2;
  const leftPivot = new THREE.Group();
  leftPivot.position.set(0, yA, 0);
  root.add(leftPivot);
  const leftSide = new THREE.Group();
  leftSide.position.set(0, -yA, 0);
  leftPivot.add(leftSide);
  const leftBoard = new THREE.Mesh(boardGeo, leatherMat);
  leftBoard.position.set(-(boardW / 2), BT / 2, 0);
  leftBoard.castShadow = leftBoard.receiveShadow = true;
  leftSide.add(leftBoard);

  // inside of each board: tooled leather turn-ins (u = 0 at the spine on both sides)
  const innerGeo = new THREE.PlaneGeometry(boardW - 2 * RAD, boardD - 2 * RAD);
  innerGeo.rotateX(-Math.PI / 2);
  const innerR = new THREE.Mesh(innerGeo, boardInMat);
  innerR.position.set(boardW / 2, BT + 0.0004, 0);
  innerR.receiveShadow = true;
  root.add(innerR);
  const innerGeoL = innerGeo.clone();
  const iuv = innerGeoL.attributes.uv;
  for (let i = 0; i < iuv.count; i++) iuv.setX(i, 1 - iuv.getX(i));
  const innerL = new THREE.Mesh(innerGeoL, boardInMat);
  innerL.position.set(-boardW / 2, BT + 0.0004, 0);
  innerL.receiveShadow = true;
  leftSide.add(innerL);

  // tooled cover on the outside of the front board
  const coverPlane = new THREE.Mesh(new THREE.PlaneGeometry(boardW - 2 * RAD, boardD - 2 * RAD), coverMat);
  coverPlane.geometry.rotateX(Math.PI / 2);
  coverPlane.geometry.rotateY(Math.PI);
  coverPlane.position.set(-(boardW / 2), -0.0004, 0);
  leftSide.add(coverPlane);

  // ----- brass: corner pieces at the fore-edge corners, and a clasp at mid fore-edge -----
  const CL = 0.15;
  const plate = plateGeometry(cornerShape(CL), CORNER_T);
  const bossGeo = new THREE.SphereGeometry(0.014, 18, 8, 0, Math.PI * 2, 0, Math.PI / 2);
  // a strip folded round the board edge along each leg
  // (local frame: board interior at x > 0, z < 0)
  const wrapX = new THREE.BoxGeometry(CL * 0.98, BT + 0.007, 0.0035);
  wrapX.translate(CL * 0.49, BT / 2, 0.0012);
  const wrapZ = new THREE.BoxGeometry(0.0035, BT + 0.007, CL * 0.98);
  wrapZ.translate(-0.0012, BT / 2, -CL * 0.49);
  function cornerPiece(withOutside) {
    const g = new THREE.Group();
    const top = new THREE.Mesh(plate, brassMat);
    top.position.y = BT;
    const boss = new THREE.Mesh(bossGeo, brassMat);
    boss.position.set(CL * 0.17, BT + 0.003, -CL * 0.17);
    boss.scale.y = 0.55;
    g.add(top, boss, new THREE.Mesh(wrapX, brassMat), new THREE.Mesh(wrapZ, brassMat));
    if (withOutside) {
      const under = new THREE.Mesh(plate, brassMat);
      under.scale.y = -1;
      const boss2 = boss.clone();
      boss2.position.y = -0.003;
      boss2.scale.y = -0.55;
      g.add(under, boss2);
    }
    g.traverse((o) => {
      if (o.isMesh) o.castShadow = true;
    });
    return g;
  }
  // board-local corner frames: (x of the fore-edge, z of head/tail, rotation so legs point inwards)
  function addCorners(parent, xEdge, sideSign, withOutside) {
    for (const sz of [-1, 1]) {
      const c = cornerPiece(withOutside);
      c.position.set(xEdge, 0, sz * boardD / 2);
      // legs: one along the fore-edge (towards the middle), one along head/tail (towards the spine)
      c.scale.set(-sideSign, 1, sz);
      parent.add(c);
    }
  }
  addCorners(root, boardW, 1, false);
  addCorners(leftSide, -boardW, -1, true);

  // clasp: an ornate plate on the board with hinge knuckles standing out past the fore-edge
  const claspShape = new THREE.Shape();
  claspShape.moveTo(0, -0.07);
  claspShape.lineTo(0.03, -0.07);
  claspShape.quadraticCurveTo(0.075, -0.05, 0.09, -0.015);
  claspShape.quadraticCurveTo(0.11, 0, 0.09, 0.015);
  claspShape.quadraticCurveTo(0.075, 0.05, 0.03, 0.07);
  claspShape.lineTo(0, 0.07);
  claspShape.closePath();
  const claspPlate = plateGeometry(claspShape, CLASP_T);
  const knuckle = new THREE.CylinderGeometry(0.0085, 0.0085, 0.038, 16);
  knuckle.rotateX(Math.PI / 2);
  const pin = new THREE.SphereGeometry(0.009, 12, 8);
  function clasp(withOutside) {
    const g = new THREE.Group();
    const p = new THREE.Mesh(claspPlate, brassMat);
    p.position.y = BT;
    p.rotation.y = Math.PI; // plate extends inwards from the fore-edge
    g.add(p);
    if (withOutside) {
      const q = new THREE.Mesh(claspPlate, brassMat);
      q.scale.y = -1;
      q.rotation.y = Math.PI;
      g.add(q);
    }
    for (const z of [-0.046, 0, 0.046]) {
      const k = new THREE.Mesh(knuckle, brassMat);
      k.position.set(0.006, BT / 2, z);
      g.add(k);
    }
    const b = new THREE.Mesh(pin, brassMat);
    b.position.set(-0.045, BT + 0.003, 0);
    b.scale.y = 0.5;
    g.add(b);
    g.traverse((o) => {
      if (o.isMesh) o.castShadow = true;
    });
    return g;
  }
  const claspR = clasp(false);
  claspR.position.set(boardW, 0, 0);
  root.add(claspR);
  const claspL = clasp(true);
  claspL.position.set(-boardW, 0, 0);
  claspL.scale.x = -1;
  leftSide.add(claspL);

  // ----- spine: leather over a rounded back with raised bands, tooled in gold -----
  const spineN = 18;
  const zRows = [];
  for (let j = 0; j <= 24; j++) zRows.push(j / 24);
  for (const b of SPINE_BANDS) for (const d of [-0.016, -0.011, -0.006, 0, 0.006, 0.011, 0.016]) zRows.push(b + d);
  zRows.sort((a, b) => a - b);
  const nZ = zRows.length;
  const bump = zRows.map((v) => {
    let k = 0;
    for (const b of SPINE_BANDS) {
      const d = Math.abs(v - b) / 0.0135;
      if (d < 1) k = Math.max(k, 0.5 + 0.5 * Math.cos(Math.PI * d));
    }
    return k;
  });
  const spineGeo = new THREE.BufferGeometry();
  spineGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array((spineN + 1) * nZ * 3), 3));
  const sUv = [];
  for (let j = 0; j < nZ; j++) for (let i = 0; i <= spineN; i++) sUv.push(i / spineN, 1 - zRows[j]);
  spineGeo.setAttribute("uv", new THREE.Float32BufferAttribute(sUv, 2));
  const sIdx = [];
  for (let j = 0; j < nZ - 1; j++) {
    for (let i = 0; i < spineN; i++) {
      const a = j * (spineN + 1) + i;
      const b = a + 1;
      const c = a + spineN + 1;
      const d = c + 1;
      sIdx.push(a, b, c, b, d, c);
    }
  }
  spineGeo.setIndex(sIdx);
  const spine = new THREE.Mesh(spineGeo, spineMat);
  spine.castShadow = true;
  root.add(spine);
  const P = new THREE.Vector2();
  const T = new THREE.Vector2();
  function updateSpine(theta) {
    const closed = clamp01(-theta / Math.PI);
    const p = spineGeo.attributes.position.array;
    const pr = new THREE.Vector2(HINGE, 0.001);
    const rel = new THREE.Vector2(-HINGE, 0.001 - yA).rotateAround(new THREE.Vector2(0, 0), theta);
    const pl = new THREE.Vector2(rel.x, rel.y + yA);
    const ctrl = new THREE.Vector2(-0.16 * Math.sin(closed * Math.PI * 0.5), yA * closed);
    for (let i = 0; i <= spineN; i++) {
      const t = i / spineN;
      P.set((1 - t) * (1 - t) * pr.x + 2 * (1 - t) * t * ctrl.x + t * t * pl.x, (1 - t) * (1 - t) * pr.y + 2 * (1 - t) * t * ctrl.y + t * t * pl.y);
      T.set(2 * (1 - t) * (ctrl.x - pr.x) + 2 * t * (pl.x - ctrl.x), 2 * (1 - t) * (ctrl.y - pr.y) + 2 * t * (pl.y - ctrl.y)).normalize();
      // outward normal of the back; bands stand out only across the rounded back of a closed book
      const lift = 0.0075 * closed * Math.pow(Math.sin(Math.PI * t), 0.6);
      for (let j = 0; j < nZ; j++) {
        const k = (j * (spineN + 1) + i) * 3;
        const o = lift * bump[j];
        p[k] = P.x - T.y * o;
        p[k + 1] = P.y + T.x * o;
        p[k + 2] = -boardD / 2 + zRows[j] * boardD;
      }
    }
    spineGeo.attributes.position.needsUpdate = true;
    spineGeo.computeVertexNormals();
    spineGeo.computeBoundingSphere();
  }

  // ----- leaves -----
  const rightBlock = new THREE.Mesh(new THREE.BufferGeometry(), edgeMat);
  const leftBlock = new THREE.Mesh(new THREE.BufferGeometry(), edgeMat);
  rightBlock.castShadow = leftBlock.castShadow = true;
  rightBlock.receiveShadow = leftBlock.receiveShadow = true;
  root.add(rightBlock);
  leftSide.add(leftBlock);

  const fibre = tex.paperNormal;
  const rightMat = pageMaterial(0, { fibre });
  const leftMat = pageMaterial(1, { fibre });
  const rightPage = new THREE.Mesh(pageGeometry(1), rightMat);
  const leftPage = new THREE.Mesh(pageGeometry(-1), leftMat);
  rightPage.receiveShadow = leftPage.receiveShadow = true;
  rightPage.castShadow = leftPage.castShadow = false;
  rightPage.name = "page-right";
  leftPage.name = "page-left";
  root.add(rightPage);
  leftSide.add(leftPage);

  // overlay pages for the reduced-motion crossfade
  const fadeRightMat = pageMaterial(0, { transparent: true, fibre });
  const fadeLeftMat = pageMaterial(1, { transparent: true, fibre });
  const fadeRight = new THREE.Mesh(rightPage.geometry, fadeRightMat);
  const fadeLeft = new THREE.Mesh(leftPage.geometry, fadeLeftMat);
  fadeRight.visible = fadeLeft.visible = false;
  fadeRight.renderOrder = fadeLeft.renderOrder = 2;
  fadeRightMat.polygonOffset = fadeLeftMat.polygonOffset = true;
  fadeRightMat.polygonOffsetFactor = fadeLeftMat.polygonOffsetFactor = -2;
  root.add(fadeRight);
  leftSide.add(fadeLeft);

  // ----- turning leaves: front shows a right page, back shows the next left page -----
  // Leaf 0 is the ordinary page turn; all LEAVES fly together when the book riffles to a tale.
  const sheetCount = (NS + 1) * (NZ_SHEET + 1);
  const uvF = new Float32Array(sheetCount * 2);
  const uvB = new Float32Array(sheetCount * 2);
  for (let j = 0; j <= NZ_SHEET; j++) {
    for (let i = 0; i <= NS; i++) {
      const k = j * (NS + 1) + i;
      uvF[k * 2] = S[i] / W;
      uvB[k * 2] = 1 - S[i] / W;
      uvF[k * 2 + 1] = uvB[k * 2 + 1] = 1 - j / NZ_SHEET;
    }
  }
  const sheetIdx = new THREE.Uint16BufferAttribute(gridIndex(NS, NZ_SHEET, false), 1);
  const uvFAttr = new THREE.BufferAttribute(uvF, 2);
  const uvBAttr = new THREE.BufferAttribute(uvB, 2);
  function makeLeaf() {
    const pos = new THREE.BufferAttribute(new Float32Array(sheetCount * 3), 3);
    const norm = new THREE.BufferAttribute(new Float32Array(sheetCount * 3), 3);
    const geo = (uv) => {
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", pos);
      g.setAttribute("normal", norm);
      g.setAttribute("uv", uv);
      g.setIndex(sheetIdx);
      return g;
    };
    const frontGeo = geo(uvFAttr);
    // the turning leaf glows a little with candlelight passing through the paper
    const frontMat = pageMaterial(0, { fibre });
    const backMat = pageMaterial(1, { fibre });
    for (const m of [frontMat, backMat]) {
      m.emissive.set(0xffd2a0);
      m.emissiveIntensity = 0;
    }
    backMat.side = THREE.BackSide;
    const front = new THREE.Mesh(frontGeo, frontMat);
    const back = new THREE.Mesh(geo(uvBAttr), backMat);
    front.castShadow = back.castShadow = true;
    front.receiveShadow = back.receiveShadow = true;
    front.frustumCulled = back.frustumCulled = false;
    const group = new THREE.Group();
    group.add(front, back);
    group.visible = false;
    root.add(group);
    return { group, frontMat, backMat, pos, norm, frontGeo };
  }
  const LEAVES = 7;
  const leaves = Array.from({ length: LEAVES }, makeLeaf);
  const sheet = leaves[0].group;
  const sheetFrontMat = leaves[0].frontMat;
  const sheetBackMat = leaves[0].backMat;

  const state = { hL: 0.01, hR: HT - 0.01, profL: null, profR: null };

  function setThickness(hL, hR) {
    state.hL = hL;
    state.hR = hR;
    state.profL = sideProfile(hL);
    state.profR = sideProfile(hR);
    writePage(rightPage.geometry, 1, state.profR);
    writePage(leftPage.geometry, -1, state.profL);
    rightBlock.geometry.dispose();
    leftBlock.geometry.dispose();
    rightBlock.geometry = blockGeometry(1, state.profR);
    leftBlock.geometry = blockGeometry(-1, state.profL);
  }

  // Writes the sheet shape. e: 0 = resting on the right, 1 = resting on the left.
  // bend: curl amount (+ = free edge leads towards the left), lean: corner lift.
  const angF = new Float32Array(NS + 1);
  const xs = new Float32Array(NS + 1);
  const ys = new Float32Array(NS + 1);
  function shapeSheet(leaf, e, bend, lean, profFrom, profTo, lift) {
    const aR = profFrom.angles;
    const aL = profTo.angles;
    const y0 = profFrom.y0 + (profTo.y0 - profFrom.y0) * e;
    const p = leaf.pos.array;
    for (let j = 0; j <= NZ_SHEET; j++) {
      const zn = (j / NZ_SHEET) * 2 - 1; // -1 head .. +1 tail
      const rowBend = bend * (1 + lean * zn);
      for (let i = 0; i <= NS; i++) {
        const u = S[i] / W;
        const rest = aR[i] * (1 - e) + (Math.PI - aL[i]) * e;
        angF[i] = rest + rowBend * Math.pow(u, 1.35);
      }
      integrate(angF, y0, xs, ys);
      const z = -D / 2 + (j / NZ_SHEET) * D;
      for (let i = 0; i <= NS; i++) {
        const k = (j * (NS + 1) + i) * 3;
        p[k] = xs[i];
        p[k + 1] = ys[i] + lift;
        p[k + 2] = z;
      }
    }
    leaf.pos.needsUpdate = true;
    leaf.frontGeo.computeVertexNormals(); // writes into the shared normal attribute
    leaf.norm.needsUpdate = true;
  }

  // Page-turn pose of one leaf. t: 0..1 animation time, dir: +1 forward (right → left), -1 back.
  // `flutter` (riffle leaves) varies the curl a little so the leaves in flight never look stamped.
  function poseLeaf(leaf, t, dir, profFrom, profTo, flutter = 0) {
    const tt = clamp01(t);
    // the spine side swings with an S-curve; the free edge leads at first, then trails and lands last
    const e0 = leafSwing(tt);
    const e = dir > 0 ? e0 : 1 - e0;
    const curl = Math.sin(Math.PI * Math.pow(tt, 0.85) * 2) * (0.62 + flutter * 0.18) * (1 - tt * 0.25);
    const bend = dir * curl;
    const lean = (0.32 + flutter * 0.1) * Math.sin(Math.PI * tt);
    const lift = 0.0015 + 0.004 * Math.sin(Math.PI * tt);
    shapeSheet(leaf, e, bend, lean, profFrom, profTo, lift);
    const g = 1 - Math.sin(Math.PI * clamp01(tt * 1.1)) * 0.85;
    leaf.frontMat.userData.uniforms.uGutter.value = g;
    leaf.backMat.userData.uniforms.uGutter.value = g;
    // none while it lies on a block (as the page under it), so a leaf lifts off and lands unseen
    const glow = 0.28 * Math.sin(Math.PI * tt);
    leaf.frontMat.emissiveIntensity = glow;
    leaf.backMat.emissiveIntensity = glow;
  }
  const poseTurn = (t, dir, profFrom, profTo) => poseLeaf(leaves[0], t, dir, profFrom, profTo);

  // The right leaf tried while it is held down (a choice not made yet): a hand peels up its tail
  // corner by k (0..1), the head and the spine stay put. At k = 0 it lies exactly on the page.
  function poseHeld(k, profR, profL) {
    const leaf = leaves[0];
    shapeSheet(leaf, 0, 0.5 * k, 0.9, profR, profL, 0.0015 + 0.0015 * k);
    leaf.frontMat.userData.uniforms.uGutter.value = 1;
    leaf.backMat.userData.uniforms.uGutter.value = 1;
    leaf.frontMat.emissiveIntensity = leaf.backMat.emissiveIntensity = 0.08 * k;
  }

  function setCover(theta) {
    leftPivot.rotation.z = theta;
    updateSpine(theta);
  }
  setCover(0);

  return {
    root,
    leftPage,
    rightPage,
    leftSide,
    leftPivot,
    fadeLeft,
    fadeRight,
    sheet,
    sheetFrontMat,
    sheetBackMat,
    leaves,
    rightMat,
    leftMat,
    coverMat,
    state,
    setThickness,
    poseTurn,
    poseLeaf,
    poseHeld,
    setCover,
    get cover() {
      return leftPivot.rotation.z;
    },
    pivotY: yA,
    // the title set on the cover art (`art`: { map, normal, orm }, images or bitmaps; main.js lets
    // their pixels go after the bake and decodes them again for the next one)
    makeCover(title, subtitle, art = tex.cover) {
      for (const k of ["map", "normalMap", "roughnessMap"]) coverMat[k]?.dispose();
      const t = coverMaps(art, title, subtitle);
      coverMat.map = t.map;
      coverMat.normalMap = t.normal;
      coverMat.roughnessMap = coverMat.metalnessMap = t.orm;
      coverMat.needsUpdate = true;
    },
    bounds: { x: W + SQUARE + HINGE, z: D / 2 + SQUARE },
  };
}
