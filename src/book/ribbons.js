// Silk ribbon bookmarks, one per tale. Each ribbon is glued at the head of the spine, runs
// between the leaves, slips out over the tail edge of the page block, crosses the board's
// square, drapes over its rounded edge and lies on the desk, ending in a swallow-tail cut with a
// few loose threads and a small gold-thread motif.
//
// Every ribbon is bound in where its tale begins. While the book lies open at that spread (the
// tale's title spread) the ribbon lies open in the gutter: it comes up out of the joint at the
// head, rolls over the head of the leaves into the fold and runs down it. On any other spread it
// stays between the leaves, so it slips out of the left or the right page block at the right
// depth and only its tail shows. Geometry is rebuilt on the CPU only when something moves (a
// turn, the cover, a tug), from the same page profiles the book uses.
import * as THREE from "three";
import { D, BT, SQUARE, RAD, thicknessFor } from "./book.js";

export const RW = 0.026; // width (about 7 mm at the book's scale)
const RT = 0.0011; // thickness of the silk (it lifts the ribbon off what it lies on)
const NC = 7; // vertices across the face
const MAPLEN = 0.2; // world length covered by the colour map, measured from the cut end
const EPS = 0.0016; // how far the ribbon floats above the paper it lies on
const UNDER = 0.0012; // between the leaves, how far the silk keeps below the paper above it
const BIAS = 0.007; // depth pulled towards the camera so the ribbon wins over a leaf landing on it
const TAIL = D / 2 + SQUARE; // z of the boards' tail edge
const CROSS = 1; // spreads over which a ribbon the leaves riffle past slides across the spine
// samples per segment: up the head of the leaves, along the fold (or between the leaves), drop
// off the leaves, across the board, over the edge, on the desk
const SEG = { H: 9, A: 26, B: 8, C: 5, D: 12, E: 26 };
const HD = 3; // head samples on the straight drop from the joint (the rest roll over the edge)
const HEADSHADE = 0.045; // how far down the fold the shade of the head reaches
const AH = 5; // fold samples within it
const M = SEG.H + SEG.A + SEG.B + SEG.C + SEG.D + SEG.E + 1;
const A0 = SEG.H; // first sample along the fold
const B0 = A0 + SEG.A; // last one: where the ribbon leaves the page block at the tail
const PER = NC; // vertices per cross-section (one double-sided face: the silk is thinner than a pixel)

const clamp01 = (t) => Math.min(1, Math.max(0, t));
const smooth = (t) => t * t * (3 - 2 * t);
const mix = (a, b, t) => a + (b - a) * t;

// Height of a page profile at distance d from the spine.
function profY(prof, d) {
  const xs = prof.xs;
  const n = xs.length - 1;
  if (d <= 0) return prof.ys[0];
  if (d >= xs[n]) return prof.ys[n];
  let lo = 0;
  let hi = n;
  while (hi - lo > 1) {
    const m = (lo + hi) >> 1;
    if (xs[m] <= d) lo = m;
    else hi = m;
  }
  return mix(prof.ys[lo], prof.ys[hi], (d - xs[lo]) / (xs[hi] - xs[lo]));
}

// ---------- textures ----------

// Gold-thread motifs, drawn into a w x h box centred at (cx, cy).
function motifPath(g, kind, cx, cy, s) {
  g.beginPath();
  if (kind === "flame") {
    g.moveTo(cx, cy - s);
    g.bezierCurveTo(cx + s * 0.25, cy - s * 0.45, cx + s * 0.75, cy - s * 0.1, cx + s * 0.55, cy + s * 0.45);
    g.bezierCurveTo(cx + s * 0.4, cy + s * 0.85, cx - s * 0.4, cy + s * 0.85, cx - s * 0.55, cy + s * 0.45);
    g.bezierCurveTo(cx - s * 0.7, cy + s * 0.05, cx - s * 0.2, cy - s * 0.2, cx, cy - s);
  } else if (kind === "bell") {
    g.moveTo(cx - s * 0.12, cy - s * 0.85);
    g.lineTo(cx + s * 0.12, cy - s * 0.85);
    g.bezierCurveTo(cx + s * 0.55, cy - s * 0.65, cx + s * 0.45, cy + s * 0.1, cx + s * 0.75, cy + s * 0.5);
    g.lineTo(cx - s * 0.75, cy + s * 0.5);
    g.bezierCurveTo(cx - s * 0.45, cy + s * 0.1, cx - s * 0.55, cy - s * 0.65, cx - s * 0.12, cy - s * 0.85);
    g.moveTo(cx + s * 0.16, cy + s * 0.72);
    g.arc(cx, cy + s * 0.72, s * 0.16, 0, Math.PI * 2);
  } else if (kind === "star") {
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
      const r = i % 2 ? s * 0.42 : s * 0.95;
      i ? g.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r) : g.moveTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
    }
    g.closePath();
  } else {
    // trefoil on a short stem
    for (const [dx, dy] of [[0, -0.42], [-0.4, 0.05], [0.4, 0.05]]) {
      g.moveTo(cx + dx * s + s * 0.36, cy + dy * s);
      g.arc(cx + dx * s, cy + dy * s, s * 0.36, 0, Math.PI * 2);
    }
    g.moveTo(cx - s * 0.08, cy + s * 0.2);
    g.lineTo(cx + s * 0.08, cy + s * 0.2);
    g.lineTo(cx + s * 0.05, cy + s * 0.95);
    g.lineTo(cx - s * 0.05, cy + s * 0.95);
    g.closePath();
  }
}

// Colour (with the cut end in alpha) and roughness/metalness maps for one ribbon. The map spans
// MAPLEN from the end; the rest of the ribbon samples its top row (clamped).
function ribbonMaps(color, motif, seed) {
  const w = 96;
  const h = 640;
  const mk = () => {
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    return c;
  };
  const cc = mk();
  const cr = mk();
  const g = cc.getContext("2d");
  const r = cr.getContext("2d");
  let s = seed * 7919 + 13;
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  const base = new THREE.Color(color).getRGB({}, THREE.SRGBColorSpace);
  const css = (k, a = 1) => `rgba(${Math.round(Math.min(255, base.r * 255 * k))},${Math.round(Math.min(255, base.g * 255 * k))},${Math.round(Math.min(255, base.b * 255 * k))},${a})`;
  g.fillStyle = css(1);
  g.fillRect(0, 0, w, h);
  // warp threads: faint lengthwise streaks of slightly different dye
  for (let x = 0; x < w; x += 2) {
    g.fillStyle = css(0.9 + rnd() * 0.2, 0.5);
    g.fillRect(x, 0, 2, h);
  }
  // selvedges: a denser, darker band with a fine light line inside, on both edges
  for (const x0 of [0, w - 7]) {
    g.fillStyle = css(0.62);
    g.fillRect(x0, 0, 7, h);
  }
  g.fillStyle = css(1.32, 0.8);
  g.fillRect(8, 0, 1.5, h);
  g.fillRect(w - 9.5, 0, 1.5, h);
  // roughness/metalness: silk is soft (G 0.55), the gold thread metallic (B)
  r.fillStyle = "rgb(255,118,0)";
  r.fillRect(0, 0, w, h);

  // the motif, embroidered in gold a little above the cut
  const notch = h * (RW * 0.9) / MAPLEN;
  const sz = w * 0.27;
  const cy = h - notch - sz * 1.7;
  const gold = g.createLinearGradient(w / 2 - sz, cy - sz, w / 2 + sz, cy + sz);
  gold.addColorStop(0, "#f2d688");
  gold.addColorStop(0.5, "#c3923e");
  gold.addColorStop(1, "#e7c472");
  g.save();
  g.shadowColor = "rgba(20,8,4,0.55)";
  g.shadowBlur = 3;
  g.shadowOffsetY = 1.5;
  motifPath(g, motif, w / 2, cy, sz);
  g.fillStyle = gold;
  g.fill("evenodd");
  g.restore();
  // satin stitches across the motif
  g.save();
  motifPath(g, motif, w / 2, cy, sz);
  g.clip("evenodd");
  g.strokeStyle = "rgba(90,55,20,0.45)";
  g.lineWidth = 1;
  for (let k = -sz * 2; k < sz * 2; k += 3.2) {
    g.beginPath();
    g.moveTo(w / 2 + k - sz, cy - sz);
    g.lineTo(w / 2 + k + sz, cy + sz);
    g.stroke();
  }
  g.restore();
  motifPath(r, motif, w / 2, cy, sz);
  r.fillStyle = "rgb(255,95,215)";
  r.fill("evenodd");

  // swallow-tail cut: the notch is transparent; a few threads stray out of the cut edges
  g.save();
  g.globalCompositeOperation = "destination-out";
  g.beginPath();
  g.moveTo(-1, h + 1);
  g.lineTo(w / 2, h - notch);
  g.lineTo(w + 1, h + 1);
  g.closePath();
  g.fill();
  g.restore();
  g.lineCap = "round";
  for (let i = 0; i < 9; i++) {
    const t = 0.08 + rnd() * 0.84;
    const side = t < 0.5 ? -1 : 1;
    const x = t * w;
    const yEdge = h - notch * (1 - Math.abs(t - 0.5) * 2);
    const len = 4 + rnd() * 9;
    g.strokeStyle = css(1.05 + rnd() * 0.2, 0.95);
    g.lineWidth = 0.9 + rnd() * 0.6;
    g.beginPath();
    g.moveTo(x, yEdge - 2);
    g.quadraticCurveTo(x + side * len * 0.3, yEdge + len * 0.3, x + side * len * 0.15 + (rnd() - 0.5) * 3, yEdge + len * 0.7);
    g.stroke();
  }
  const make = (c, srgb) => {
    const t = new THREE.CanvasTexture(c);
    if (srgb) t.colorSpace = THREE.SRGBColorSpace;
    t.wrapS = THREE.ClampToEdgeWrapping;
    t.wrapT = THREE.ClampToEdgeWrapping;
    t.anisotropy = 4;
    return t;
  };
  return { map: make(cc, true), orm: make(cr, false) };
}

// Taffeta weave: fine ribs across the ribbon over faint warp lines, as a tiling normal map.
function weaveNormal() {
  const n = 64;
  const c = document.createElement("canvas");
  c.width = c.height = n;
  const g = c.getContext("2d");
  const img = g.createImageData(n, n);
  const H = (x, y) => 0.55 * Math.sin((2 * Math.PI * y) / 8) * (0.85 + 0.15 * Math.sin((2 * Math.PI * x) / 4)) + 0.2 * Math.sin((2 * Math.PI * x) / 4);
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      const dx = H(x + 1, y) - H(x - 1, y);
      const dy = H(x, y + 1) - H(x, y - 1);
      const l = Math.hypot(dx, dy, 1);
      const k = (y * n + x) * 4;
      img.data[k] = (-dx / l) * 127.5 + 127.5;
      img.data[k + 1] = (dy / l) * 127.5 + 127.5;
      img.data[k + 2] = (1 / l) * 127.5 + 127.5;
      img.data[k + 3] = 255;
    }
  }
  g.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(5, MAPLEN / 0.0032 / 8);
  return t;
}

// Soft contact shadow across the width: dark in the middle, gone at the sides.
function shadowTexture() {
  const c = document.createElement("canvas");
  c.width = 64;
  c.height = 4;
  const g = c.getContext("2d");
  const gr = g.createLinearGradient(0, 0, 64, 0);
  gr.addColorStop(0, "rgba(0,0,0,0)");
  gr.addColorStop(0.3, "rgba(0,0,0,0.75)");
  gr.addColorStop(0.5, "rgba(0,0,0,1)");
  gr.addColorStop(0.7, "rgba(0,0,0,0.75)");
  gr.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = gr;
  g.fillRect(0, 0, 64, 4);
  return new THREE.CanvasTexture(c);
}

function silkMaterial(tale, maps, weave) {
  const col = new THREE.Color(tale.ribbon.color);
  const sheenCol = col.clone().lerp(new THREE.Color(1, 0.9, 0.76), 0.55).multiplyScalar(1.25);
  const m = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    vertexColors: true,
    map: maps.map,
    alphaTest: 0.5,
    normalMap: weave,
    normalScale: new THREE.Vector2(0.4, 0.4),
    roughnessMap: maps.orm,
    metalnessMap: maps.orm,
    roughness: 1,
    metalness: 1,
    sheen: 1,
    sheenColor: sheenCol,
    sheenRoughness: 0.32,
    anisotropy: 0.5,
    side: THREE.DoubleSide,
  });
  m.userData.uniforms = { uBias: { value: 0 } };
  m.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, m.userData.uniforms);
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nuniform float uBias;\nattribute float shade;\nvarying float vShade;")
      .replace(
        "#include <project_vertex>",
        // pull the vertex towards the camera along its view ray: same pixel, nearer depth
        `#include <project_vertex>
        vShade = shade;
        { vec4 mvb = mvPosition; mvb.xyz *= max(0.0, 1.0 - uBias / length(mvb.xyz)); gl_Position = projectionMatrix * mvb; }`
      );
    // occlusion where the silk goes down into the joint: it dims the sheen too, not just the dye
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", "#include <common>\nvarying float vShade;")
      .replace("#include <opaque_fragment>", "outgoingLight *= vShade;\n#include <opaque_fragment>");
  };
  m.customProgramCacheKey = () => "silk-ribbon";
  return m;
}

// ---------- assembly ----------
export function createRibbons({ tales, book }) {
  const group = new THREE.Group();
  group.name = "ribbons";
  const weave = weaveNormal();
  const shadowTex = shadowTexture();
  const n = tales.length;
  const index = [];
  for (let i = 0; i < M - 1; i++) {
    const a = i * PER;
    const b = (i + 1) * PER;
    for (let k = 0; k < NC - 1; k++) index.push(a + k, b + k, a + k + 1, a + k + 1, b + k, b + k + 1);
  }
  const shadowIndex = [];
  for (let i = 0; i < M - 1; i++) shadowIndex.push(i * 2, i * 2 + 2, i * 2 + 1, i * 2 + 1, i * 2 + 2, i * 2 + 3);

  const ribbons = tales.map((tale, i) => {
    const maps = ribbonMaps(tale.ribbon.color, tale.ribbon.motif, i + 1);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(M * PER * 3), 3));
    geo.setAttribute("uv", new THREE.BufferAttribute(new Float32Array(M * PER * 2), 2));
    geo.setAttribute("color", new THREE.BufferAttribute(new Float32Array(M * PER * 3).fill(1), 3));
    geo.setAttribute("shade", new THREE.BufferAttribute(new Float32Array(M * PER).fill(1), 1));
    geo.setIndex(index);
    const mat = silkMaterial(tale, maps, weave);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.frustumCulled = false;
    mesh.name = `ribbon-${tale.id}`;
    mesh.renderOrder = 3;
    // contact shadow on the board and the desk
    const sg = new THREE.BufferGeometry();
    sg.setAttribute("position", new THREE.BufferAttribute(new Float32Array(M * 2 * 3), 3));
    sg.setAttribute("uv", new THREE.BufferAttribute(new Float32Array(M * 2 * 2), 2));
    sg.setAttribute("color", new THREE.BufferAttribute(new Float32Array(M * 2 * 4), 4));
    sg.setIndex(shadowIndex);
    const sm = new THREE.MeshBasicMaterial({ color: 0x000000, map: shadowTex, transparent: true, vertexColors: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -4 });
    const shadow = new THREE.Mesh(sg, sm);
    shadow.frustumCulled = false;
    shadow.renderOrder = 2;
    group.add(shadow, mesh);
    // lane: where the ribbon ends up on the desk, in binding order from left to right
    const lane = (i - (n - 1) / 2) * 0.05;
    return { tale, mesh, mat, geo, shadow, lane, seed: i * 1.7 + 0.4, pick: [], tug: 0, hover: 0, s: 0, gut: 0, side: 1, rankL: 0, rankR: 0 };
  });

  // scratch
  const P = Array.from({ length: M }, () => new THREE.Vector3());
  const N = Array.from({ length: M }, () => new THREE.Vector3());
  const T = new THREE.Vector3();
  const T0 = new THREE.Vector3();
  const TA = new THREE.Vector3();
  const SIDE = new THREE.Vector3();
  const Q = new THREE.Quaternion();
  const conform = new Float32Array(M); // 1 where the cross-section follows the gutter
  const arc = new Float32Array(M);
  // per sample of the head and the fold run (the bound part): its height in the gutter, how much
  // each thread there follows the paper under it, and how deep it lies in the shadow of the head
  const gy = new Float32Array(M);
  const fw = new Float32Array(M);
  const hs = new Float32Array(M);

  // The page surface at signed x (right page x > 0), with the left side swung by the cover.
  function surface(x, layout) {
    if (x >= 0) return profY(layout.profR, x);
    return profY(layout.profL, -x);
  }

  // Lays out one ribbon. r.s = spread it marks (global), r.gut = 1 when it lies in the gutter,
  // r.side = the block it lies in otherwise (-1 left, +1 right; in between while it slides
  // across the spine), r.rankL / r.rankR = how many ribbons lie nearer the open spread there.
  function build(r, layout, layer) {
    const { profL, profR, total, open } = layout;
    // where it slips out of the leaves at the tail when it is not in the gutter: at the depth of
    // its tale's first leaf, in the left block or the right one
    const [hLs, hRs] = thicknessFor(r.s, total);
    const exL = 0.011 + r.rankL * 0.012;
    const exR = 0.011 + r.rankR * 0.012;
    let xL = -exL;
    let yL = BT + (profY(profL, exL) - BT) * clamp01(hLs / Math.max(1e-4, layout.hL)) - 0.0006;
    if (open < 1) {
      // the left block swings with the cover
      const a = layout.cover;
      const dy = yL - layout.pivotY;
      xL = -exL * Math.cos(a) - dy * Math.sin(a);
      yL = layout.pivotY - exL * Math.sin(a) + dy * Math.cos(a);
    }
    const yR = BT + (profY(profR, exR) - BT) * clamp01(hRs / Math.max(1e-4, layout.hR)) - 0.0006;
    const sd = r.side;
    const exx = sd < 0 ? xL * -sd : exR * sd;
    const ey = mix(yL, yR, (sd + 1) / 2);
    const hy = ey - 0.0015; // its run between the leaves, a little under where it slips out
    // in the gutter: centred in the fold (a hair off centre, as silk never lies quite true), and
    // there at every angle of the cover: the front block swings about the joint a good centimetre
    // (0.04) clear of the silk, so the ribbon the intro shows hanging from the closed book
    // is exactly the one lying in the fold once it is open, and nothing moves as the cover lifts
    const gut = r.gut;
    const xc = 0.0018 * Math.sin(r.seed * 3.1);
    const crest = Math.max(profY(profL, 0), profY(profR, 0));
    const cy = Math.max(surface(xc, layout), crest) + EPS;
    const x0 = mix(exx, xc, gut);
    const y0 = mix(ey, cy, gut);
    const yBoard = BT + 0.0011 + layer * 0.0007;
    const yDesk = 0.0009 + layer * 0.0005;
    const tug = r.tug;
    const meander = (z) => 0.0016 * Math.sin(z * 4.3 + r.seed) * gut;
    const zA = -D / 2 + 0.004; // where the run along the fold begins, just inside the head

    let m = 0;
    // H: glued into the joint at the head of the spine. In the gutter it rises up the head of the
    // leaves and rolls over their edge into the fold (so it never just ends at the edge); between
    // the leaves it runs straight in.
    const zFace = -D / 2 - RT * 0.6 - 0.0003; // hangs just clear of the leaves' head edge
    const rb = 0.003; // radius of the roll over the edge
    const yJoint = BT - 0.004; // tucked down into the joint between the boards
    const drop = Math.max(0.002, cy - rb - yJoint);
    for (let k = 0; k < SEG.H; k++) {
      let yg;
      let zg;
      if (k < HD) {
        yg = yJoint + (drop * k) / HD;
        zg = zFace;
      } else {
        const phi = ((k - HD) / (SEG.H - HD)) * Math.PI * 0.5;
        yg = cy - rb + rb * Math.sin(phi);
        zg = zFace + rb * (1 - Math.cos(phi));
      }
      P[m].set(x0 + meander(zA), mix(hy, yg, gut), mix(zA - 0.0016 + (k / SEG.H) * 0.0014, zg, gut));
      gy[m] = yg;
      // over the edge each thread rolls at the height of the paper under it; below, it hangs flat
      fw[m] = k < HD ? 0 : smooth((k - HD) / (SEG.H - HD));
      // and darkens into the joint, where neither the candle nor the room reach
      hs[m] = k < HD ? mix(0.95, 0.82, k / HD) : mix(0.82, 0.66, (k - HD) / (SEG.H - HD));
      conform[m] = gut * fw[m];
      m++;
    }
    // A: along the fold (or between the leaves) from the head to the tail; the first few samples
    // close together, so the shade at the head of the fold fades in smoothly
    const zS = zA + HEADSHADE;
    for (let k = 0; k <= SEG.A; k++) {
      const z = k <= AH ? mix(zA, zS, k / AH) : mix(zS, D / 2 - 0.0015, (k - AH) / (SEG.A - AH));
      P[m].set(x0 + meander(z), mix(hy, cy, gut), z);
      gy[m] = cy;
      fw[m] = 1;
      // the head of the fold lies in shade, as the paper does there
      hs[m] = 0.62 * (1 - smooth(clamp01((z - zA) / HEADSHADE)));
      conform[m] = gut;
      m++;
    }
    // B: off the end of the leaves and down onto the board's square
    const zB = D / 2 + 0.03;
    const xB = mix(x0, r.lane, 0.14);
    const b0 = new THREE.Vector3(x0, y0, D / 2);
    const b1 = new THREE.Vector3(x0, y0 + 0.0012, D / 2 + 0.011);
    const b2 = new THREE.Vector3(xB, yBoard + 0.0006, zB - 0.013);
    const b3 = new THREE.Vector3(xB, yBoard, zB);
    for (let k = 1; k <= SEG.B; k++) {
      const t = k / SEG.B;
      const u = 1 - t;
      P[m].set(0, 0, 0).addScaledVector(b0, u * u * u).addScaledVector(b1, 3 * u * u * t).addScaledVector(b2, 3 * u * t * t).addScaledVector(b3, t * t * t);
      conform[m] = gut * (1 - smooth(clamp01(t / 0.6)));
      m++;
    }
    // C: across the square to the edge of the board
    const zC = TAIL - RAD;
    const xC = mix(x0, r.lane, 0.3);
    for (let k = 1; k <= SEG.C; k++) {
      const t = k / SEG.C;
      P[m].set(mix(xB, xC, t), yBoard, mix(zB, zC, t));
      conform[m] = 0;
      m++;
    }
    // D: over the rounded edge, down the board's face and onto the desk
    const re = RAD + RT * 0.6 + 0.0004;
    const r2 = 0.013; // silk does not crease where it meets the desk: a soft bend
    const zf = TAIL + RT * 0.6 + 0.0004;
    const yTop = BT - RAD;
    const dropLen = Math.max(0, yTop - (yDesk + r2));
    const lenD = re * Math.PI * 0.5 + dropLen + r2 * Math.PI * 0.5;
    const xD = mix(x0, r.lane, 0.42);
    for (let k = 1; k <= SEG.D; k++) {
      const l = (k / SEG.D) * lenD;
      let y;
      let z;
      if (l < re * Math.PI * 0.5) {
        const psi = l / re;
        z = zC + re * Math.sin(psi);
        y = yTop + re * Math.cos(psi) + (yBoard - BT - re + RAD) * Math.cos(psi);
      } else if (l < re * Math.PI * 0.5 + dropLen) {
        z = zf;
        y = yTop - (l - re * Math.PI * 0.5);
      } else {
        const phi = (l - re * Math.PI * 0.5 - dropLen) / r2;
        z = zf + r2 - r2 * Math.cos(phi);
        y = yDesk + r2 - r2 * Math.sin(phi);
      }
      P[m].set(mix(xC, xD, k / SEG.D), y, z);
      conform[m] = 0;
      m++;
    }
    // E: lying on the desk, curving out towards its lane, the end gently lifted by a tug
    const e0 = P[m - 1].clone();
    const side = Math.sign(r.lane) || 1;
    const outer = Math.abs(r.lane) / 0.075;
    const eEnd = new THREE.Vector3(r.lane * 1.8 + side * 0.006 * Math.sin(r.seed), yDesk, TAIL + 0.07 + 0.01 * Math.sin(r.seed * 2.3) - outer * 0.008);
    const c1 = new THREE.Vector3(e0.x, yDesk, e0.z + 0.026);
    const ang = side * (0.12 + outer * 0.28) + 0.08 * Math.sin(r.seed * 1.7);
    const c2 = eEnd.clone().add(new THREE.Vector3(-Math.sin(ang) * 0.028, 0, -Math.cos(ang) * 0.028));
    for (let k = 1; k <= SEG.E; k++) {
      const t = k / SEG.E;
      const u = 1 - t;
      const p = P[m].set(0, 0, 0).addScaledVector(e0, u * u * u).addScaledVector(c1, 3 * u * u * t).addScaledVector(c2, 3 * u * t * t).addScaledVector(eEnd, t * t * t);
      // a tug: the end is pinched up and drawn a little towards the reader
      const w = smooth(clamp01((t - 0.15) / 0.85));
      p.y += tug * 0.013 * w;
      p.z += tug * 0.006 * t;
      conform[m] = 0;
      m++;
    }
    // the drape eases up with the tug, so the lift travels back along the ribbon
    if (tug > 0) for (let k = B0 + SEG.B + 1; k < B0 + SEG.B + SEG.C + SEG.D + 1; k++) P[k].z += tug * 0.002;

    // arc length from the cut end
    arc[M - 1] = 0;
    for (let k = M - 2; k >= 0; k--) arc[k] = arc[k + 1] + P[k].distanceTo(P[k + 1]);

    // frames: parallel transport of the face normal along the path (no twist), starting where the
    // ribbon lies flat along the fold: on to the tail, and back up over the head into the joint
    TA.subVectors(P[A0 + 1], P[A0]).normalize();
    N[A0].set(0, 1, 0).addScaledVector(TA, -TA.y).normalize();
    T0.copy(TA);
    for (let k = A0 + 1; k < M; k++) {
      T.subVectors(P[Math.min(M - 1, k + 1)], P[k - 1]).normalize();
      Q.setFromUnitVectors(T0, T);
      N[k].copy(N[k - 1]).applyQuaternion(Q).addScaledVector(T, -N[k - 1].dot(T)).normalize();
      T0.copy(T);
    }
    T0.copy(TA);
    for (let k = A0 - 1; k >= 0; k--) {
      T.subVectors(P[k + 1], P[Math.max(0, k - 1)]).normalize();
      Q.setFromUnitVectors(T0, T);
      N[k].copy(N[k + 1]).applyQuaternion(Q).addScaledVector(T, -N[k + 1].dot(T)).normalize();
      T0.copy(T);
    }

    // vertices
    const pa = r.geo.attributes.position.array;
    const ua = r.geo.attributes.uv.array;
    const ca = r.geo.attributes.color.array;
    const sa = r.geo.attributes.shade.array;
    const spa = r.shadow.geometry.attributes.position.array;
    const sua = r.shadow.geometry.attributes.uv.array;
    const sca = r.shadow.geometry.attributes.color.array;
    const pick = [];
    for (let k = 0; k < M; k++) {
      const p = P[k];
      T.subVectors(P[Math.min(M - 1, k + 1)], P[Math.max(0, k - 1)]).normalize();
      SIDE.crossVectors(T, N[k]).normalize();
      const v = arc[k] / MAPLEN;
      const base = k * PER;
      const cw = conform[k];
      const bound = k <= B0; // the head and the run along the fold (or between the leaves)
      const head = bound ? gut * hs[k] : 0;
      for (let c = 0; c < NC; c++) {
        const o = (c / (NC - 1) - 0.5) * RW;
        let x = p.x + SIDE.x * o;
        let y = p.y + SIDE.y * o;
        let z = p.z + SIDE.z * o;
        if (bound) {
          // between the leaves the silk keeps under the paper above it, so it never shows in the
          // gutter; in the fold it relaxes: each thread rests on the paper beneath it
          const sy = surface(x, layout);
          const inside = open >= 1 ? Math.min(hy, sy - UNDER) : hy;
          y = mix(inside, gy[k] + fw[k] * (Math.max(sy, crest) + EPS - cy), gut);
        } else if (cw > 0) y = mix(y, Math.max(surface(x, layout), crest) + EPS + (p.y - cy), cw);
        // a soft lengthwise curl at the selvedges where the ribbon hangs free
        const free = bound ? gut * (1 - fw[k]) : 1 - cw;
        const curl = free * 0.0007 * Math.pow(Math.abs(o) / (RW / 2), 2);
        x += N[k].x * curl;
        y += N[k].y * curl;
        z += N[k].z * curl;
        const ti = (base + c) * 3;
        pa[ti] = x;
        pa[ti + 1] = y;
        pa[ti + 2] = z;
        ua[(base + c) * 2] = c / (NC - 1);
        ua[(base + c) * 2 + 1] = v;
        // deep in the fold the silk shares the gutter's shadow (as the paper does in its shader)
        const dS = Math.abs(x);
        const fold = cw * (0.5 * Math.exp(-dS / 0.022) + 0.16 * Math.exp(-dS / 0.09));
        ca[ti] = 1 - fold * 0.58;
        ca[ti + 1] = 1 - fold * 0.7;
        ca[ti + 2] = 1 - fold * 0.8;
        // and at the head it fades into the shade of the joint it goes down into
        sa[base + c] = 1 - head * 0.8;
      }
      // contact shadow: on the board's square and on the desk, fading where the silk lifts
      const onBoard = k > B0 + 2 && k <= B0 + SEG.B + SEG.C;
      const onDesk = k > B0 + SEG.B + SEG.C + SEG.D - 3;
      const surfY = onDesk ? 0.0004 : BT + 0.0005;
      const lifted = p.y - (onDesk ? yDesk : yBoard);
      const alpha = (onBoard || onDesk ? 0.55 : 0) * clamp01(1 - lifted / 0.012) * clamp01(arc[k] / 0.012);
      const sw = RW * (1.25 + clamp01(lifted / 0.01) * 0.6);
      for (const [j, sgn] of [[0, -1], [1, 1]]) {
        const si = (k * 2 + j) * 3;
        spa[si] = p.x + SIDE.x * sgn * sw * 0.5 + 0.003;
        spa[si + 1] = surfY;
        spa[si + 2] = p.z + SIDE.z * sgn * sw * 0.5 + 0.004;
        sua[(k * 2 + j) * 2] = j;
        sua[(k * 2 + j) * 2 + 1] = 0.5;
        sca.set([1, 1, 1, alpha], (k * 2 + j) * 4);
      }
      if (k >= B0) pick.push(p.clone());
    }
    r.geo.attributes.position.needsUpdate = true;
    r.geo.attributes.uv.needsUpdate = true;
    r.geo.attributes.color.needsUpdate = true;
    r.geo.attributes.shade.needsUpdate = true;
    r.geo.computeVertexNormals();
    r.shadow.geometry.attributes.position.needsUpdate = true;
    r.shadow.geometry.attributes.color.needsUpdate = true;
    r.shadow.geometry.attributes.uv.needsUpdate = true;
    r.mat.userData.uniforms.uBias.value = BIAS * gut;
    r.pick = pick;
  }

  // layout: { pos (global spread, may be fractional), total, hL, hR, profL, profR, cover, pivotY }
  // marks: per ribbon { s, gut, side? }; side = the block it lies in, or is on its way into or out
  // of, when not in the gutter (-1 left, +1 right). Left out, it follows from s and pos: a ribbon
  // whose spread the leaves riffle past slides across the spine under the gutter, never pops.
  function update(layout, marks) {
    layout.open = 1 + layout.cover / Math.PI;
    const pos = layout.pos;
    ribbons.forEach((r, i) => {
      r.s = marks[i].s;
      r.gut = marks[i].gut;
      r.side = marks[i].side ?? Math.max(-1, Math.min(1, (r.s - pos) / CROSS));
    });
    // rank of each ribbon inside its block: how many lie between it and the open spread (one on
    // its way into or out of the fold, or across the spine, counts in part, so its neighbours
    // make room smoothly)
    const near = [...ribbons].sort((a, b) => Math.abs(a.s - pos) - Math.abs(b.s - pos));
    let inL = 0;
    let inR = 0;
    for (const r of near) {
      r.rankL = inL;
      r.rankR = inR;
      inL += (1 - r.gut) * clamp01(-r.side);
      inR += (1 - r.gut) * clamp01(r.side);
    }
    // and its layer on the board: a ribbon from higher up lies on top
    const byHeight = [...ribbons].sort((a, b) => b.gut - a.gut || Math.abs(a.s - pos) - Math.abs(b.s - pos));
    byHeight.forEach((r, k) => build(r, layout, byHeight.length - 1 - k));
  }

  // The ribbon nearest a screen point (CSS px), within `tol` px of its visible tail, or -1. The
  // caller decides what an inert ribbon does (nothing): a touch on it never reaches a neighbour.
  const A2 = new THREE.Vector3();
  const B2 = new THREE.Vector3();
  function pick(clientX, clientY, camera, tol) {
    let best = -1;
    let bestD = Infinity;
    const W_ = window.innerWidth;
    const H_ = window.innerHeight;
    ribbons.forEach((r, i) => {
      for (let k = 0; k < r.pick.length - 1; k += 1) {
        A2.copy(r.pick[k]).project(camera);
        B2.copy(r.pick[k + 1]).project(camera);
        const ax = ((A2.x + 1) / 2) * W_;
        const ay = ((1 - A2.y) / 2) * H_;
        const bx = ((B2.x + 1) / 2) * W_;
        const by = ((1 - B2.y) / 2) * H_;
        const dx = bx - ax;
        const dy = by - ay;
        const l2 = dx * dx + dy * dy || 1;
        const t = clamp01(((clientX - ax) * dx + (clientY - ay) * dy) / l2);
        const d = Math.hypot(clientX - (ax + dx * t), clientY - (ay + dy * t));
        if (d < bestD) {
          bestD = d;
          best = i;
        }
      }
    });
    return bestD <= tol ? best : -1;
  }

  // Screen-space centre of a ribbon's tail (for focus rings and review tooling).
  function anchor(i, camera) {
    const r = ribbons[i];
    const p = r.pick[Math.floor(r.pick.length * 0.75)] || r.pick[0];
    if (!p) return null;
    A2.copy(p).project(camera);
    return { x: ((A2.x + 1) / 2) * window.innerWidth, y: ((1 - A2.y) / 2) * window.innerHeight };
  }

  return { group, ribbons, update, pick, anchor };
}
