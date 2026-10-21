// The study around the book: a worn oak desk with a woven runner, a candle in a brass
// chamberstick (real light, glow, flicker), props with real geometry (quill in an inkwell,
// dried lavender, brass vessels, a small chest, a sealed letter), the painted far wall
// and dust in the candle light.
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

export const CANDLE = new THREE.Vector3(-1.19, 0, -0.9); // base of the candlestick: off the book's top-left corner
const DISH = 0.155; // drip-dish radius
const FLAME_Y = 0.385;

const rng = (seed) => () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

function canvasTex(w, h, draw, { srgb = true } = {}) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  draw(c.getContext("2d"), w, h);
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

const shadows = (obj, cast = true, receive = true) =>
  obj.traverse((o) => {
    if (o.isMesh) {
      o.castShadow = cast;
      o.receiveShadow = receive;
    }
  });

// ---------- environment map: a warm dark room with one candle and a cool window ----------
export function makeEnvironment(renderer) {
  const env = new THREE.Scene();
  const room = new THREE.Mesh(new THREE.BoxGeometry(12, 6, 12), new THREE.MeshBasicMaterial({ color: 0x1a0f08, side: THREE.BackSide }));
  env.add(room);
  const warm = new THREE.Mesh(new THREE.SphereGeometry(0.6, 16, 8), new THREE.MeshBasicMaterial({ color: new THREE.Color(5, 2.6, 1.0) }));
  warm.position.set(-2, 1.5, -1.5);
  env.add(warm);
  // warm-lit wall and shelves give the brass something to mirror
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(6, 2.4), new THREE.MeshBasicMaterial({ color: new THREE.Color(0.32, 0.17, 0.08) }));
  wall.position.set(-1.5, 1.4, -5.9);
  env.add(wall);
  for (let i = 0; i < 3; i++) {
    const shelf = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 0.12), new THREE.MeshBasicMaterial({ color: new THREE.Color(0.7, 0.38, 0.16) }));
    shelf.position.set(-5.9, 0.8 + i * 0.7, -1 + i * 0.3);
    shelf.rotation.y = Math.PI / 2;
    env.add(shelf);
  }
  // candlelight bouncing off a low ceiling: gold and brass seen from above mirror this warmth
  const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(12, 12), new THREE.MeshBasicMaterial({ color: new THREE.Color(0.2, 0.11, 0.05) }));
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.y = 2.9;
  env.add(ceiling);
  const bounce = new THREE.Mesh(new THREE.CircleGeometry(1.6, 24), new THREE.MeshBasicMaterial({ color: new THREE.Color(1.1, 0.62, 0.28) }));
  bounce.rotation.x = Math.PI / 2;
  bounce.position.set(-1.0, 2.85, -0.6);
  env.add(bounce);
  const window_ = new THREE.Mesh(new THREE.PlaneGeometry(2, 3), new THREE.MeshBasicMaterial({ color: new THREE.Color(0.25, 0.35, 0.6) }));
  window_.position.set(3, 2, -5.9);
  env.add(window_);
  const desk = new THREE.Mesh(new THREE.PlaneGeometry(12, 12), new THREE.MeshBasicMaterial({ color: 0x3a2214 }));
  desk.rotation.x = -Math.PI / 2;
  desk.position.y = -0.5;
  env.add(desk);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const rt = pmrem.fromScene(env, 0.04);
  pmrem.dispose();
  return rt.texture;
}

// ---------- candle ----------
// The flame is a camera-facing card drawn as a teardrop: a blue cup at the base round the wick,
// a dim zone just above it, a warm-white luminous core and an orange envelope whose edge melts
// into a faint glow. Seen from above (the reading camera) a real flame is a round blob; the
// card keeps at least ~70 % of its height so it still reads as a flame, pointing away from
// the viewer the way the flame's top leans in perspective.
const flameVert = /* glsl */ `
  uniform vec3 uCenter;
  uniform vec2 uSize;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec3 up = vec3(0.0, 1.0, 0.0);
    vec3 toCam = normalize(cameraPosition - uCenter);
    vec3 upP = up - toCam * dot(up, toCam);
    float s = length(upP);
    upP = s > 1e-3 ? upP / s : vec3(0.0, 0.0, -1.0);
    vec3 right = normalize(cross(upP, toCam));
    // a vertical flame seen from above is foreshortened, but keeps its teardrop
    float h = uSize.y * max(s, 0.7);
    vec3 p = uCenter + right * position.x * uSize.x + upP * (position.y + 0.5) * h;
    gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.0);
  }`;
const flameFrag = /* glsl */ `
  uniform float uTime;
  uniform float uPower;
  varying vec2 vUv;
  void main() {
    float y = vUv.y;
    // flicker: the tip sways, the flame breathes in height, never strobes
    float sway = (sin(uTime * 7.3 + y * 3.0) * 0.03 + sin(uTime * 2.3) * 0.02 + sin(uTime * 13.1 + 1.7) * 0.007) * y * y;
    float x = vUv.x - 0.5 - sway;
    float tip = 0.88 + 0.035 * sin(uTime * 5.1) + 0.025 * sin(uTime * 11.3 + 0.5);
    float yb = 0.24; // widest point
    float R = 0.19;
    float t = clamp((y - yb) / (tip - yb), 0.0, 1.0);
    float rTop = R * pow(1.0 - t, 1.35) * (1.0 + 0.25 * t * (1.0 - t));
    float q = clamp((yb - y) / yb, 0.0, 1.0);
    float rBot = R * sqrt(max(0.0, 1.0 - q * q));
    float r = y > yb ? rTop : rBot;
    float d = abs(x) / max(r, 1e-3);
    float body = (1.0 - smoothstep(0.62, 1.0, d)) * smoothstep(0.0, 0.03, y) * (1.0 - smoothstep(tip - 0.05, tip, y));
    // luminous core: warm white, low in the flame
    float core = (1.0 - smoothstep(0.15, 0.7, d)) * smoothstep(0.1, 0.3, y) * (1.0 - smoothstep(0.42, 0.8, y));
    // blue cup at the base, strongest at the sides
    float blue = (1.0 - smoothstep(0.02, 0.2, y)) * (0.35 + 0.65 * smoothstep(0.1, 0.85, d));
    // the dim zone round the wick, where the wax vapour has not yet caught
    float dim = (1.0 - smoothstep(0.0, 0.42, d)) * (1.0 - smoothstep(0.05, 0.2, y));
    vec3 col = vec3(1.0, 0.46, 0.13) * body * (0.65 + 0.35 * (1.0 - smoothstep(0.3, 1.0, d)));
    col = mix(col, vec3(1.0, 0.9, 0.66) * 1.3, core * body);
    col += vec3(0.16, 0.3, 1.0) * blue * body * 0.95;
    col *= 1.0 - dim * 0.6;
    // a faint warm breath of light round the flame, so its edge melts into the air
    float halo = exp(-x * x / 0.03) * exp(-pow((y - 0.42) / 0.5, 2.0) * 3.0);
    col += vec3(1.0, 0.55, 0.22) * halo * 0.16 * (1.0 - body);
    gl_FragColor = vec4(col * uPower, 1.0);
  }`;

function radialTexture(stops) {
  return canvasTex(128, 128, (g) => {
    const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    for (const [o, c] of stops) gr.addColorStop(o, c);
    g.fillStyle = gr;
    g.fillRect(0, 0, 128, 128);
  });
}

// Worn brass: patina colour and scratched roughness from the CC0 Metal007 set.
function brassMaterial(tex, env, { color = 0xd2a55a, repeat = 1, rough = 1.25 } = {}) {
  const map = tex.brass.map.clone();
  const rmap = tex.brass.rough.clone();
  for (const t of [map, rmap]) {
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(repeat, repeat);
    t.needsUpdate = true;
  }
  return new THREE.MeshStandardMaterial({ color, map, roughnessMap: rmap, roughness: rough, metalness: 1, envMap: env, envMapIntensity: 1.0 });
}

function makeCandle(env, tex) {
  const group = new THREE.Group();
  group.position.copy(CANDLE);
  group.rotation.y = 2.4; // finger ring towards the dark, away from the reader's view
  const brass = brassMaterial(tex, env, { repeat: 1.5 });
  // chamberstick: a wide drip dish with a rolled rim, a short stem and a socket
  const k = DISH / 0.212;
  const prof = [
    [0, 0], [0.19 * k, 0], [0.205 * k, 0.006], [DISH, 0.02], [0.206 * k, 0.03], [0.196 * k, 0.026], [0.185 * k, 0.016], [0.07, 0.022],
    [0.042, 0.032], [0.032, 0.06], [0.036, 0.086], [0.062, 0.098], [0.07, 0.11], [0.066, 0.12], [0.06, 0.118], [0.06, 0.106], [0, 0.106],
  ].map(([r, y]) => new THREE.Vector2(r, y));
  const holder = new THREE.Mesh(new THREE.LatheGeometry(prof, 48), brass);
  group.add(holder);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.011, 10, 28), brass);
  ring.position.set(DISH + 0.025, 0.022, 0.0);
  ring.rotation.x = Math.PI / 2;
  group.add(ring);
  const thumb = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.026, 0.006, 20), brass);
  thumb.position.set(DISH + 0.04, 0.058, 0);
  group.add(thumb);
  const strut = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.008, 0.016), brass);
  strut.position.set(DISH + 0.005, 0.04, 0);
  strut.rotation.z = 0.5;
  group.add(strut);

  // wax: a pillar burnt down a little, warmer and brighter towards the flame
  const wax = new THREE.MeshStandardMaterial({ color: 0xb49a78, roughness: 0.6, emissive: 0xff9a40, emissiveIntensity: 0.0 });
  wax.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nvarying float vH;\nvarying vec3 vLoc;")
      .replace("#include <begin_vertex>", "#include <begin_vertex>\nvH = (modelMatrix * vec4(position, 1.0)).y;\nvLoc = position;");
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", "#include <common>\nvarying float vH;\nvarying vec3 vLoc;")
      // the melt pool in the cup round the wick: darker, glossier amber, so the flame stands out
      .replace(
        "#include <map_fragment>",
        `#include <map_fragment>
        float cup = (1.0 - smoothstep(0.024, 0.04, length(vLoc.xz))) * smoothstep(${(FLAME_Y - 0.085 - 0.032).toFixed(3)}, ${(FLAME_Y - 0.085 - 0.02).toFixed(3)}, vLoc.y);
        diffuseColor.rgb *= mix(vec3(1.0), vec3(0.3, 0.21, 0.13), cup);`
      )
      .replace("#include <roughnessmap_fragment>", "#include <roughnessmap_fragment>\nroughnessFactor = mix(roughnessFactor, 0.18, cup);")
      .replace("#include <emissivemap_fragment>", "#include <emissivemap_fragment>\ntotalEmissiveRadiance = vec3(1.0, 0.5, 0.18) * pow(smoothstep(0.14, 0.32, vH), 2.0) * 0.12 * (1.0 - 0.6 * cup);");
  };
  const R = 0.054;
  const TOP = FLAME_Y - 0.085; // rim of the burnt-down pillar
  const waxProf = [
    [0, 0.106], [R, 0.106], [R, TOP - 0.05], [R - 0.001, TOP - 0.02], [R - 0.003, TOP - 0.004], [R - 0.009, TOP], [R - 0.016, TOP - 0.007], [0.026, TOP - 0.017], [0.012, TOP - 0.021], [0, TOP - 0.022],
  ].map(([r, y]) => new THREE.Vector2(r, y));
  const candleGeo = new THREE.LatheGeometry(waxProf, 40);
  // an uneven, melted rim
  const cp = candleGeo.attributes.position;
  const rr = rng(31);
  const wob = Array.from({ length: 41 }, () => rr());
  for (let i = 0; i < cp.count; i++) {
    const y = cp.getY(i);
    if (y < TOP - 0.04) continue;
    const a = Math.atan2(cp.getZ(i), cp.getX(i));
    const k = Math.floor(((a + Math.PI) / (Math.PI * 2)) * 40);
    const n = Math.sin(a * 3 + 1.2) * 0.5 + wob[k] * 0.5;
    cp.setY(i, y - n * 0.012 * smoothstep01((y - TOP + 0.04) / 0.04));
  }
  candleGeo.computeVertexNormals();
  const candle = new THREE.Mesh(candleGeo, wax);
  group.add(candle);
  // drips running down the side, some reaching the dish
  const r = rng(11);
  for (let i = 0; i < 11; i++) {
    const a = r() * Math.PI * 2;
    const len = 0.03 + Math.pow(r(), 1.6) * (TOP - 0.14);
    const w = 0.006 + r() * 0.005;
    const top = TOP - 0.006 - r() * 0.012;
    const drip = new THREE.Mesh(new THREE.CapsuleGeometry(w, len, 4, 10), wax);
    drip.position.set(Math.cos(a) * (R - w * 0.35), top - len / 2, Math.sin(a) * (R - w * 0.35));
    drip.scale.set(1, 1, 0.75);
    drip.lookAt(drip.position.x * 4, drip.position.y, drip.position.z * 4);
    group.add(drip);
    const blob = new THREE.Mesh(new THREE.SphereGeometry(w * 1.15, 10, 8), wax);
    blob.scale.set(1, 0.8, 1);
    blob.position.set(Math.cos(a) * (R + w * 0.2), Math.max(0.112, top - len), Math.sin(a) * (R + w * 0.2));
    group.add(blob);
  }
  // a little spilt wax on the dish and in the socket
  const spill = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.075, 0.008, 24), wax);
  spill.position.y = 0.112;
  spill.scale.set(1, 1, 0.8);
  group.add(spill);
  const puddle = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.04, 0.004, 18), wax);
  puddle.position.set(DISH * 0.6, 0.024, 0.04);
  group.add(puddle);
  const wick = new THREE.Mesh(new THREE.CylinderGeometry(0.0028, 0.002, 0.034, 6), new THREE.MeshBasicMaterial({ color: 0x1a120c }));
  wick.position.y = TOP - 0.004;
  wick.rotation.z = 0.12;
  group.add(wick);
  group.traverse((o) => {
    if (o.isMesh) {
      o.castShadow = false; // the key light sits above the flame; the candle would shadow everything
      o.receiveShadow = true;
    }
  });

  // flame (view-facing, foreshortened) and two glow layers
  const flameMat = new THREE.ShaderMaterial({
    vertexShader: flameVert,
    fragmentShader: flameFrag,
    uniforms: {
      uCenter: { value: new THREE.Vector3(CANDLE.x, FLAME_Y - 0.078, CANDLE.z) },
      uSize: { value: new THREE.Vector2(0.085, 0.15) },
      uTime: { value: 0 },
      uPower: { value: 1.6 },
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const flame = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), flameMat);
  flame.frustumCulled = false;
  flame.renderOrder = 10;
  // halo: wide and soft, with no hot centre of its own, so the flame's shape stays readable on it
  const haloTex = radialTexture([[0, "rgba(255,190,120,0.55)"], [0.1, "rgba(255,170,95,0.42)"], [0.3, "rgba(255,130,55,0.14)"], [0.6, "rgba(255,110,40,0.04)"], [1, "rgba(255,100,30,0)"]]);
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: haloTex, color: 0xffb070, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.55 }));
  halo.scale.setScalar(0.85);
  halo.position.set(CANDLE.x, FLAME_Y - 0.02, CANDLE.z);
  halo.renderOrder = 9;
  // a small warm bloom round the flame (the glare a lens/eye adds), kept dim
  const glowTex = radialTexture([[0, "rgba(255,214,150,0.8)"], [0.25, "rgba(255,170,90,0.35)"], [0.6, "rgba(255,120,40,0.06)"], [1, "rgba(255,100,30,0)"]]);
  const core = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: 0xffd9a0, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.3 }));
  core.scale.setScalar(0.16);
  core.position.set(CANDLE.x, FLAME_Y - 0.025, CANDLE.z);
  core.renderOrder = 9;
  // warm pool of light on the desk around the candle (painted, not computed)
  const pool2 = new THREE.Mesh(
    new THREE.PlaneGeometry(1.5, 1.5),
    new THREE.MeshBasicMaterial({ map: radialTexture([[0, "rgba(255,170,90,0.3)"], [0.4, "rgba(255,140,60,0.09)"], [1, "rgba(255,120,40,0)"]]), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })
  );
  pool2.rotation.x = -Math.PI / 2;
  pool2.position.set(CANDLE.x, 0.003, CANDLE.z);
  return { group, flame, flameMat, halo, core, pool: pool2 };
}
const smoothstep01 = (t) => {
  const x = Math.min(1, Math.max(0, t));
  return x * x * (3 - 2 * x);
};

// ---------- small props ----------

// The quill: a real feather (generated texture) on a gently curved, V-shaped vane with a
// tapered shaft. Built along +y from the nib (origin); `placeQuill` stands it in the inkwell.
// The texture's shaft runs a little right of centre (u ~ 0.57 at the nib, 0.64 near the tip), so
// the vane is laid out round that line and the 3D shaft sits exactly on the painted one.
const QUILL_BEND = 0.3; // extra lean the feather gains from nib to tip (rad)
function quillCurve(len) {
  const pts = [];
  let x = 0;
  let y = 0;
  const steps = 24;
  for (let i = 0; i <= steps; i++) {
    pts.push(new THREE.Vector3(x, y, 0));
    const a = QUILL_BEND * Math.pow((i + 0.5) / steps, 1.8);
    x += Math.sin(a) * (len / steps);
    y += Math.cos(a) * (len / steps);
  }
  return new THREE.CatmullRomCurve3(pts);
}
function makeQuill(tex, len = 0.72) {
  const g = new THREE.Group();
  const curve = quillCurve(len);
  const aspect = tex.feather.image ? tex.feather.image.width / tex.feather.image.height : 0.23;
  const width = len * aspect;
  const shaftU = (v) => Math.min(0.64, 0.572 + 0.08 * v);
  const NU = 8;
  const NV = 40;
  const pos = [];
  const uv = [];
  const idx = [];
  const side = new THREE.Vector3(0, 0, 1);
  for (let j = 0; j <= NV; j++) {
    const v = j / NV;
    const p = curve.getPoint(v);
    const t = curve.getTangent(v);
    const nrm = new THREE.Vector3().crossVectors(side, t).normalize(); // in the bend plane, facing out
    const twist = 0.25 * v * v; // the vane turns a little towards the tip, as real feathers do
    const u0 = shaftU(v);
    for (let i = 0; i <= NU; i++) {
      const u = i / NU;
      const s = (u - u0) * width;
      // the two halves rise from the shaft in a shallow V and droop at their outer edges
      const half = s < 0 ? u0 * width : (1 - u0) * width;
      const lift = Math.abs(s) * 0.22 - Math.pow(Math.abs(s) / half, 2) * width * 0.07;
      const q = p
        .clone()
        .addScaledVector(side, s * Math.cos(twist))
        .addScaledVector(nrm, lift + s * Math.sin(twist));
      pos.push(q.x, q.y, q.z);
      uv.push(u, v);
    }
  }
  for (let j = 0; j < NV; j++) {
    for (let i = 0; i < NU; i++) {
      const a = j * (NU + 1) + i;
      idx.push(a, a + 1, a + NU + 1, a + 1, a + NU + 2, a + NU + 1);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  // barbs are thin keratin: candlelight passing through warms the side turned away from the flame
  const vaneMat = new THREE.MeshStandardMaterial({ map: tex.feather, emissiveMap: tex.feather, emissive: 0x6a4a30, alphaTest: 0.4, side: THREE.DoubleSide, roughness: 0.82 });
  const vane = new THREE.Mesh(geo, vaneMat);
  vane.castShadow = true;
  vane.receiveShadow = true;
  g.add(vane);
  // the shaft: a tapered, translucent-looking quill, ink-dark where it has been dipped
  const RINGS = 48;
  const SEGS = 8;
  const sp = [];
  const sc = [];
  const si = [];
  const ref = new THREE.Vector3(0, 0, 1);
  for (let j = 0; j <= RINGS; j++) {
    const v = j / RINGS;
    const p = curve.getPoint(v);
    const t = curve.getTangent(v);
    const b1 = new THREE.Vector3().crossVectors(t, ref).normalize();
    const b2 = new THREE.Vector3().crossVectors(t, b1).normalize();
    const r = 0.0046 * (1 - 0.72 * Math.pow(v, 1.3)) * (v < 0.02 ? 0.6 + 20 * v : 1);
    const ink = 1 - 0.82 * (1 - smoothstep01((v - 0.07) / 0.06));
    for (let i = 0; i <= SEGS; i++) {
      const a = (i / SEGS) * Math.PI * 2;
      const q = p.clone().addScaledVector(b1, Math.cos(a) * r).addScaledVector(b2, Math.sin(a) * r);
      sp.push(q.x, q.y, q.z);
      sc.push(ink, ink * 0.97, ink * 0.92);
    }
  }
  for (let j = 0; j < RINGS; j++) {
    for (let i = 0; i < SEGS; i++) {
      const a = j * (SEGS + 1) + i;
      si.push(a, a + SEGS + 1, a + 1, a + 1, a + SEGS + 1, a + SEGS + 2);
    }
  }
  const sg = new THREE.BufferGeometry();
  sg.setAttribute("position", new THREE.Float32BufferAttribute(sp, 3));
  sg.setAttribute("color", new THREE.Float32BufferAttribute(sc, 3));
  sg.setIndex(si);
  sg.computeVertexNormals();
  const shaft = new THREE.Mesh(sg, new THREE.MeshStandardMaterial({ color: 0xece2cc, vertexColors: true, roughness: 0.38 }));
  shaft.castShadow = true;
  shaft.receiveShadow = true;
  g.add(shaft);
  g.userData.curve = curve;
  return g;
}

// Stands the quill in the inkwell: the nib rests on the bottom, the shaft leans `lean` rad from
// vertical towards `azimuth` (radians about +y, 0 = +x) and touches the rim of the neck on that
// side, so the feather rises up and out of the well. `roll` turns the vane about the shaft.
function placeQuill(quill, well, { lean = 0.44, azimuth = 0, roll = 0, rimY = 0.113, rimR = 0.033, below = 0.085 } = {}) {
  const L = new THREE.Vector3(Math.cos(azimuth), 0, -Math.sin(azimuth));
  const axis = new THREE.Vector3().copy(L).multiplyScalar(Math.sin(lean)).addScaledVector(new THREE.Vector3(0, 1, 0), Math.cos(lean));
  // the shaft rests against the inside of the lip on the side it leans to
  const contact = new THREE.Vector3(well.x, rimY, well.z).addScaledVector(L, rimR - 0.0046);
  const nib = contact.clone().addScaledVector(axis, -below);
  // local +y -> axis, local +x (the way the feather bends) -> outwards along L
  const xl = L.clone().addScaledVector(axis, -L.dot(axis)).normalize();
  const zl = new THREE.Vector3().crossVectors(xl, axis).normalize();
  const m = new THREE.Matrix4().makeBasis(xl, axis, zl);
  quill.quaternion.setFromRotationMatrix(m).multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), roll));
  quill.position.copy(nib);
}

function makeInkwell(env, tex) {
  const g = new THREE.Group();
  const pewter = new THREE.MeshStandardMaterial({ color: 0x8c8478, metalness: 0.85, roughness: 0.5, envMap: env, envMapIntensity: 0.9 });
  pewter.roughnessMap = tex.brass.rough;
  const prof = [[0, 0], [0.095, 0], [0.1, 0.008], [0.098, 0.02], [0.084, 0.03], [0.086, 0.066], [0.074, 0.08], [0.05, 0.088], [0.04, 0.1], [0.046, 0.112], [0.036, 0.115], [0.032, 0.102], [0, 0.1]].map(([r, y]) => new THREE.Vector2(r, y));
  const pot = new THREE.Mesh(new THREE.LatheGeometry(prof, 40), pewter);
  g.add(pot);
  const ink = new THREE.Mesh(new THREE.CircleGeometry(0.033, 24), new THREE.MeshStandardMaterial({ color: 0x07060a, roughness: 0.05, envMap: env }));
  ink.rotation.x = -Math.PI / 2;
  ink.position.y = 0.102;
  g.add(ink);
  shadows(g);
  return g;
}

function makeKey(env, tex) {
  const iron = brassMaterial(tex, env, { color: 0x9a7a4a, repeat: 0.5, rough: 1.4 });
  const g = new THREE.Group();
  const bow = new THREE.Mesh(new THREE.TorusGeometry(0.034, 0.009, 10, 28), iron);
  bow.rotation.x = Math.PI / 2;
  g.add(bow);
  const inner = new THREE.Mesh(new THREE.TorusGeometry(0.014, 0.005, 8, 18), iron);
  inner.rotation.x = Math.PI / 2;
  g.add(inner);
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.0075, 0.0075, 0.17, 10), iron);
  shaft.rotation.z = Math.PI / 2;
  shaft.position.x = 0.118;
  g.add(shaft);
  for (const [x, w, d] of [[0.17, 0.012, 0.04], [0.19, 0.01, 0.03], [0.2, 0.012, 0.045]]) {
    const bit = new THREE.Mesh(new THREE.BoxGeometry(w, 0.012, d), iron);
    bit.position.set(x, 0, d / 2);
    g.add(bit);
  }
  const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.012, 12), iron);
  collar.rotation.z = Math.PI / 2;
  collar.position.x = 0.044;
  g.add(collar);
  shadows(g, true, false);
  g.position.y = 0.009;
  return g;
}

// A folded letter (three panels, slightly sprung open) closed with a red wax seal.
function makeLetter(parchmentImg) {
  const tex = canvasTex(512, 380, (c, w, h) => {
    if (parchmentImg) c.drawImage(parchmentImg, 0, 0, w, h);
    else {
      c.fillStyle = "#e9d8b0";
      c.fillRect(0, 0, w, h);
    }
    c.strokeStyle = "rgba(50,30,15,0.5)";
    c.lineWidth = 2;
    const r = rng(5);
    for (let line = 0; line < 10; line++) {
      const y = 46 + line * 31;
      let x = 40;
      c.beginPath();
      c.moveTo(x, y);
      while (x < w - 50 - (line === 9 ? 220 : 0)) {
        const nx = x + 8 + r() * 10;
        c.quadraticCurveTo((x + nx) / 2, y - 7 - r() * 6, nx, y + (r() - 0.5) * 3);
        x = nx;
        if (r() < 0.12) {
          x += 12;
          c.moveTo(x, y);
        }
      }
      c.stroke();
    }
    // fold lines
    c.fillStyle = "rgba(110,75,40,0.18)";
    c.fillRect(0, h / 3 - 1, w, 2);
    c.fillRect(0, (2 * h) / 3 - 1, w, 2);
  });
  const W_ = 0.6;
  const H_ = 0.45;
  const geo = new THREE.PlaneGeometry(W_, H_, 12, 6);
  geo.rotateX(-Math.PI / 2);
  const p = geo.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const z = p.getZ(i);
    const x = p.getX(i);
    // panels meet at folds at z = ±H/6; the outer panels lift a little
    const f = Math.max(0, Math.abs(z) - H_ / 6);
    p.setY(i, 0.002 + f * 0.16 + Math.pow(Math.abs(x) / (W_ / 2), 4) * 0.006);
  }
  geo.computeVertexNormals();
  const g = new THREE.Group();
  const sheet = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ map: tex, color: 0xcbbb9c, roughness: 0.92, side: THREE.DoubleSide }));
  g.add(sheet);
  // wax seal: an uneven puddle with a pressed rim and a raised device
  const wax = new THREE.MeshStandardMaterial({ color: 0x8e1b12, roughness: 0.34, metalness: 0 });
  const sealProf = [[0, 0], [0.052, 0], [0.056, 0.004], [0.05, 0.009], [0.04, 0.0105], [0.034, 0.008], [0.03, 0.0085], [0, 0.0085]].map(([r, y]) => new THREE.Vector2(r, y));
  const sealGeo = new THREE.LatheGeometry(sealProf, 36);
  const sp = sealGeo.attributes.position;
  for (let i = 0; i < sp.count; i++) {
    const a = Math.atan2(sp.getZ(i), sp.getX(i));
    const k = 1 + 0.08 * Math.sin(a * 3 + 0.7) + 0.05 * Math.sin(a * 7 + 2.1);
    if (Math.hypot(sp.getX(i), sp.getZ(i)) > 0.045) {
      sp.setX(i, sp.getX(i) * k);
      sp.setZ(i, sp.getZ(i) * k);
    }
  }
  sealGeo.computeVertexNormals();
  const seal = new THREE.Mesh(sealGeo, wax);
  seal.position.set(-0.13, 0.002 + (H_ / 2 - H_ / 6) * 0.16 * 0.5, -0.13);
  g.add(seal);
  const device = new THREE.Group();
  for (let i = 0; i < 6; i++) {
    const petal = new THREE.Mesh(new THREE.SphereGeometry(0.009, 10, 6), wax);
    const a = (i / 6) * Math.PI * 2;
    petal.position.set(Math.cos(a) * 0.014, 0.009, Math.sin(a) * 0.014);
    petal.scale.set(1, 0.35, 0.6);
    petal.rotation.y = -a;
    device.add(petal);
  }
  const dot = new THREE.Mesh(new THREE.SphereGeometry(0.006, 10, 6), wax);
  dot.position.y = 0.01;
  dot.scale.y = 0.5;
  device.add(dot);
  device.position.copy(seal.position);
  g.add(device);
  shadows(g);
  return g;
}

// Dried lavender: instanced stems and bud whorls, bound with twine. Lies on the desk
// (lying = true) or stands upright (for the vase).
function makeLavender({ stems = 40, len = 0.5, seed = 21, lying = true, spread = 0.3 } = {}) {
  const r = rng(seed);
  const g = new THREE.Group();
  const stemMat = new THREE.MeshStandardMaterial({ color: 0x7d8458, roughness: 0.85 });
  const budMat = new THREE.MeshStandardMaterial({ color: 0x6e5a8e, roughness: 0.8 });
  const stemGeo = new THREE.CylinderGeometry(0.0022, 0.0028, 1, 5);
  stemGeo.translate(0, 0.5, 0);
  const budGeo = new THREE.SphereGeometry(1, 6, 4);
  const BUDS = 20;
  const stemsIM = new THREE.InstancedMesh(stemGeo, stemMat, stems * 2);
  const budsIM = new THREE.InstancedMesh(budGeo, budMat, stems * BUDS);
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const e = new THREE.Euler();
  const tie = len * 0.42; // binding point above the cut ends
  let bi = 0;
  for (let s = 0; s < stems; s++) {
    // above the tie the stems fan out; below it they stay close together
    const ax = (r() - 0.5) * spread;
    const az = (r() - 0.5) * spread;
    const l = len * (0.62 + r() * 0.3);
    const base = new THREE.Vector3((r() - 0.5) * 0.012, tie, (r() - 0.5) * 0.012);
    e.set(ax, 0, az);
    q.setFromEuler(e);
    m.compose(base, q, new THREE.Vector3(1, l - tie, 1));
    stemsIM.setMatrixAt(s * 2, m);
    // the lower part, down to the cut
    e.set(-ax * 0.15 + (r() - 0.5) * 0.06, 0, -az * 0.15 + (r() - 0.5) * 0.06);
    q.setFromEuler(e);
    const dirDown = new THREE.Vector3(0, -1, 0).applyQuaternion(q);
    const cut = base.clone().addScaledVector(dirDown, tie * (0.9 + r() * 0.15));
    m.compose(cut, q, new THREE.Vector3(1, base.distanceTo(cut), 1));
    stemsIM.setMatrixAt(s * 2 + 1, m);
    // buds along the top third of the stem, in little whorls
    const dir = new THREE.Vector3(0, 1, 0).applyEuler(new THREE.Euler(ax, 0, az));
    const top = base.clone().addScaledVector(dir, l - tie);
    for (let b = 0; b < BUDS; b++) {
      const t = b / (BUDS - 1);
      const along = top.clone().addScaledVector(dir, -t * (l - tie) * 0.42);
      const a = b * 2.4 + r();
      const rad = 0.004 + 0.002 * Math.sin(t * Math.PI);
      const off = new THREE.Vector3(Math.cos(a) * rad, 0, Math.sin(a) * rad);
      const sz = 0.0062 * (1 - t * 0.35) * (0.8 + r() * 0.4);
      m.compose(along.add(off), q.setFromEuler(new THREE.Euler(ax, a, az)), new THREE.Vector3(sz, sz * 1.5, sz));
      budsIM.setMatrixAt(bi++, m);
    }
  }
  stemsIM.instanceMatrix.needsUpdate = true;
  budsIM.instanceMatrix.needsUpdate = true;
  // twine binding
  const twine = new THREE.Mesh(new THREE.TorusGeometry(0.016, 0.0035, 6, 18), new THREE.MeshStandardMaterial({ color: 0x9c3a2a, roughness: 0.75 }));
  twine.rotation.x = Math.PI / 2;
  twine.position.y = tie;
  const twine2 = twine.clone();
  twine2.position.y = tie - 0.012;
  g.add(stemsIM, budsIM, twine, twine2);
  shadows(g);
  if (lying) {
    const lie = new THREE.Group();
    g.rotation.z = -Math.PI / 2;
    g.position.y = 0.018;
    lie.add(g);
    return lie;
  }
  return g;
}

// Woven runner (generated tapestry texture over a fine weave normal) with fringed ends.
function makeRunner(tex, length = 3.7, width = 0.62) {
  const g = new THREE.Group();
  const map = tex.runner;
  map.wrapS = THREE.RepeatWrapping;
  map.repeat.set(length / (width * (map.image.width / map.image.height)), 1);
  map.anisotropy = 8;
  const nrm = tex.weave;
  nrm.wrapS = nrm.wrapT = THREE.RepeatWrapping;
  nrm.repeat.set(length * 14, width * 14);
  const geo = new THREE.PlaneGeometry(length, width, 60, 6);
  geo.rotateX(-Math.PI / 2);
  // a gentle unevenness, as a cloth never lies perfectly flat
  const p = geo.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i);
    const z = p.getZ(i);
    p.setY(i, 0.0016 + 0.0016 * (Math.sin(x * 5.1 + z * 2.0) * 0.5 + 0.5) * smoothstep01((Math.abs(x) - 1.1) / 0.4));
  }
  geo.computeVertexNormals();
  const cloth = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ map, normalMap: nrm, normalScale: new THREE.Vector2(0.9, 0.9), color: 0x8a7464, roughness: 0.96 }));
  cloth.receiveShadow = true;
  g.add(cloth);
  const fringeTex = canvasTex(512, 64, (c, w, h) => {
    c.clearRect(0, 0, w, h);
    const r = rng(9);
    for (let i = 0; i < 64; i++) {
      const x = (i + 0.5) * (w / 64) + (r() - 0.5) * 2;
      const l = h * (0.75 + r() * 0.25);
      c.strokeStyle = `rgb(${110 + r() * 30},${48 + r() * 20},${34 + r() * 14})`;
      c.lineWidth = 3;
      c.beginPath();
      c.moveTo(x, 0);
      c.quadraticCurveTo(x + (r() - 0.5) * 6, l * 0.5, x + (r() - 0.5) * 8, l);
      c.stroke();
    }
    // knots
    c.fillStyle = "rgb(92,40,28)";
    for (let i = 0; i < 16; i++) c.fillRect((i + 0.5) * (w / 16) - 8, 6, 16, 8);
  });
  for (const sx of [-1, 1]) {
    const f = new THREE.Mesh(new THREE.PlaneGeometry(width * 0.98, 0.075), new THREE.MeshStandardMaterial({ map: fringeTex, alphaTest: 0.35, roughness: 0.95, side: THREE.DoubleSide }));
    f.rotation.x = -Math.PI / 2;
    f.rotation.z = (sx * Math.PI) / 2;
    f.position.set(sx * (length / 2 + 0.036), 0.0015, 0);
    f.receiveShadow = true;
    g.add(f);
  }
  return g;
}

// ---------- dust motes ----------
function makeDust(count = 170) {
  const r = rng(77);
  const pos = new Float32Array(count * 3);
  const seed = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    // most motes hang in the candle's cone of light, a few drift over the pages
    const near = r() < 0.72;
    pos[i * 3] = near ? CANDLE.x + 0.15 + (r() - 0.3) * 1.3 : (r() - 0.5) * 2.4;
    pos[i * 3 + 1] = near ? 0.15 + r() * 0.9 : 0.3 + r() * 0.8;
    pos[i * 3 + 2] = near ? CANDLE.z + 0.25 + (r() - 0.4) * 1.1 : (r() - 0.6) * 1.6;
    seed[i] = r() * 100;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  g.setAttribute("seed", new THREE.BufferAttribute(seed, 1));
  const mat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uLight: { value: new THREE.Vector3(CANDLE.x, FLAME_Y, CANDLE.z) }, uPx: { value: 1 }, uOpacity: { value: 1 } },
    vertexShader: /* glsl */ `
      attribute float seed;
      uniform float uTime;
      uniform vec3 uLight;
      uniform float uPx;
      varying float vA;
      void main() {
        vec3 p = position;
        float t = uTime * 0.12;
        p += vec3(sin(t * 1.1 + seed) * 0.09, sin(t * 0.7 + seed * 1.7) * 0.06 + mod(t * 0.05 + seed, 1.0) * 0.04, cos(t * 0.9 + seed * 0.6) * 0.07);
        float d = distance(p, uLight);
        vA = clamp(1.25 - d * 0.85, 0.0, 1.0) * (0.55 + 0.45 * sin(uTime * 0.8 + seed * 3.0));
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_PointSize = uPx * (2.0 + fract(seed) * 2.5) * (3.0 / -mv.z);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */ `
      uniform float uOpacity;
      varying float vA;
      void main() {
        float r = length(gl_PointCoord - 0.5);
        float a = smoothstep(0.5, 0.0, r) * vA * uOpacity;
        gl_FragColor = vec4(vec3(1.0, 0.82, 0.55) * a, a);
      }`,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const pts = new THREE.Points(g, mat);
  pts.frustumCulled = false;
  pts.renderOrder = 11;
  return { points: pts, mat };
}

// ---------- assembly ----------
export async function createRoom({ renderer, scene, tex, base, parchmentImg }) {
  const env = makeEnvironment(renderer);
  scene.environment = env;
  scene.environmentIntensity = 0.32;
  scene.background = new THREE.Color(0x0b0604);

  // desk: a worn, matte oak top with a rounded front edge that catches the light
  const wood = tex.wood;
  for (const t of [wood.map, wood.normal, wood.rough]) {
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(2.1, 1.5);
    t.anisotropy = 8;
  }
  const desk = new THREE.Mesh(
    new RoundedBoxGeometry(4.6, 0.14, 3.3, 3, 0.025),
    new THREE.MeshStandardMaterial({ map: wood.map, normalMap: wood.normal, normalScale: new THREE.Vector2(1.0, 1.0), roughnessMap: wood.rough, roughness: 1.15, color: 0xc0a48c, envMapIntensity: 0.22 })
  );
  desk.position.set(0, -0.07, -0.12);
  desk.receiveShadow = true;
  scene.add(desk);

  // far wall: painted, softly out of focus
  const backdrop = new THREE.Mesh(new THREE.PlaneGeometry(9, 4.5), new THREE.MeshBasicMaterial({ map: tex.backdrop, color: 0xc8b8a8, fog: false }));
  backdrop.position.set(0.9, 0.95, -4.6);
  scene.add(backdrop);
  const floorFade = new THREE.Mesh(new THREE.PlaneGeometry(16, 10), new THREE.MeshBasicMaterial({ color: 0x0b0604 }));
  floorFade.rotation.x = -Math.PI / 2;
  floorFade.position.set(0, -1.4, -2);
  scene.add(floorFade);

  // lights: candle key (shadows), candle glow (falloff), warm fill, a breath of moonlight
  const key = new THREE.DirectionalLight(0xffcb94, 1.9);
  key.position.set(CANDLE.x + 0.15, 1.6, CANDLE.z + 0.2);
  key.target.position.set(0.15, 0, 0.1);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.left = -2.4;
  key.shadow.camera.right = 2.4;
  key.shadow.camera.top = 1.9;
  key.shadow.camera.bottom = -1.9;
  key.shadow.camera.near = 0.2;
  key.shadow.camera.far = 5;
  key.shadow.bias = -0.0005;
  key.shadow.normalBias = 0.01;
  key.shadow.radius = 5;
  scene.add(key, key.target);
  // the candle's warm pool: placed above the flame so the brass dish right under it does not burn out
  const glow = new THREE.PointLight(0xff9a4c, 4.6, 0, 2);
  glow.position.set(CANDLE.x + 0.12, 0.95, CANDLE.z + 0.12);
  scene.add(glow);
  const fill = new THREE.HemisphereLight(0xffe0b8, 0x2a170c, 0.72);
  scene.add(fill);
  const moon = new THREE.DirectionalLight(0x9fb4e0, 0.24);
  moon.position.set(2.5, 2.4, -3.0);
  scene.add(moon);

  const candle = makeCandle(env, tex);
  scene.add(candle.group, candle.flame, candle.halo, candle.core, candle.pool);

  const runner = makeRunner(tex);
  runner.position.set(-0.1, 0, 0.02);
  runner.rotation.y = 0.025;
  scene.add(runner);

  // the inkwell stands beside the book's right board, well below the corner controls; the quill
  // stands in it leaning back towards the candle and in over the board's edge, so from the
  // reading camera it rises along the margin (perspective pushes tall things outwards at the
  // frame's edge, the inward lean holds it in view) and from the intro camera it is a clear
  // silhouette against the dark room
  const inkwell = makeInkwell(env, tex);
  const WELL = new THREE.Vector3(1.18, 0.0025, 0.2); // on the runner
  inkwell.position.copy(WELL);
  scene.add(inkwell);
  const quill = makeQuill(tex, 0.72);
  placeQuill(quill, WELL, { lean: 0.42, azimuth: Math.PI * 0.77, rimY: 0.113 + WELL.y });
  scene.add(quill);

  const key3 = makeKey(env, tex);
  key3.position.set(-1.24, 0.0025, 0.05);
  key3.rotation.y = -1.25;
  scene.add(key3);

  const letter = makeLetter(parchmentImg);
  letter.position.set(1.33, 0, 0.84);
  letter.rotation.y = -0.38;
  scene.add(letter);

  // dried lavender along the left edge of the book, heads towards the candle
  const lavender = makeLavender({ len: 0.46 });
  lavender.position.set(-1.2, 0, 0.62);
  lavender.rotation.y = Math.PI / 2 + 0.12;
  scene.add(lavender);

  const loader = new GLTFLoader();
  const load = (name) => loader.loadAsync(`${base}assets/book3d/models/${name}.glb`).then((g) => g.scene).catch(() => null);
  const [apple, goblet, pot, vase, chest] = await Promise.all([load("apple"), load("goblet"), load("brass_pot"), load("brass_vase"), load("chest")]);
  const fit = (obj, size, pos, rotY = 0, byHeight = false) => {
    if (!obj) return null;
    const box = new THREE.Box3().setFromObject(obj);
    const s = size / (byHeight ? box.max.y - box.min.y : Math.max(box.max.x - box.min.x, box.max.z - box.min.z));
    obj.scale.setScalar(s);
    obj.position.set(pos.x, -box.min.y * s, pos.z);
    obj.rotation.y = rotY;
    obj.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
        if (o.material) o.material.envMapIntensity = 1.1;
      }
    });
    scene.add(obj);
    return obj;
  };
  fit(apple, 0.12, new THREE.Vector3(1.78, 0, -0.62), 0.8);
  fit(goblet, 0.15, new THREE.Vector3(1.5, 0, -0.78));
  fit(pot, 0.26, new THREE.Vector3(-1.66, 0, -0.18), 0.4);
  fit(chest, 0.56, new THREE.Vector3(1.9, 0, -1.3), -0.35);
  if (fit(vase, 0.36, new THREE.Vector3(-0.62, 0, -1.3), 0, true)) {
    const bunch = makeLavender({ stems: 30, len: 0.55, seed: 44, lying: false, spread: 0.55 });
    bunch.position.set(-0.62, 0.36 - 0.55 * 0.42 + 0.02, -1.3);
    scene.add(bunch);
  }
  // metals mirror the room explicitly (the scene-wide environment is kept dim for paper and wood)
  scene.traverse((o) => {
    const m = o.material;
    if (o.isMesh && m?.isMeshStandardMaterial && !m.envMap && (m.metalness > 0.5 || m.metalnessMap)) {
      m.envMap = env;
      // ORM-mapped leather is mostly dielectric: keep its grazing reflections modest
      m.envMapIntensity = m.userData.envBoost ?? (m.metalnessMap ? 0.6 : 0.9);
      m.needsUpdate = true;
    }
  });

  const dust = makeDust();
  scene.add(dust.points);

  return { env, desk, key, glow, fill, moon, candle, dust, backdrop, flamePos: new THREE.Vector3(CANDLE.x, FLAME_Y, CANDLE.z) };
}
