// The study around the book: a worn oak desk with a woven runner, a candle in a brass
// chamberstick (real light, glow, flicker), props with real geometry (quill in an inkwell,
// dried lavender, brass vessels, a small chest, a sealed letter), the chamber behind the desk
// (painted wall, floor, a hearth's glow) and dust in the candle light.
import * as THREE from "three";
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

// ---------- under the desk top ----------
// An apron (frieze) recessed behind the top's edges, with a long drawer at the front, its brass
// escutcheon and pulls, and a bead under the top's lip; four turned legs down to the floor. Only a
// phone held upright opening the book sees them: past the desk's front edge its far, steep view
// looks down to the floor under the desk. The candle stands on the top and cannot reach them, so
// they take no direct light at all, only the room's warm bounce (the hemisphere fill, lifted:
// the lit desk top, the plaster and the hearth all throw light back under the desk) and, for the
// brass, its reflections: dim, warm shapes in the shade of the desk, the top's lip and the beads
// a little lighter than the faces under them, the legs fading down to the floor.
const BOUNCE = 7;
function indirectOnly(mat) {
  mat.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <lights_fragment_end>",
      `#include <lights_fragment_end>\nreflectedLight.directDiffuse *= 0.0;\nreflectedLight.directSpecular *= 0.0;\nreflectedLight.indirectDiffuse *= ${BOUNCE.toFixed(2)};`
    );
  };
  mat.customProgramCacheKey = () => `indirect-only-${mat.type}`;
  return mat;
}
function makeDeskBase(wood, env, tex, top) {
  const g = new THREE.Group();
  const grain = (rx, ry, rot = 0) => {
    const o = {};
    for (const k of ["map", "normal", "rough"]) {
      const t = wood[k].clone();
      t.repeat.set(rx, ry);
      t.rotation = rot;
      t.needsUpdate = true;
      o[k] = t;
    }
    return indirectOnly(new THREE.MeshStandardMaterial({ map: o.map, normalMap: o.normal, roughnessMap: o.rough, roughness: 1.1, color: 0x9c8270, envMapIntensity: 0.3 }));
  };
  const IN = 0.08; // the apron stands this far in from the top's edges
  const AH = 0.36; // its height under the top
  const AT = 0.045; // its thickness
  const y0 = top.y0; // underside of the top
  const yc = y0 - AH / 2;
  const fz = top.z1 - IN; // the front face
  const bz = top.z0 + IN;
  const sx = top.x - IN;
  const long = grain(2.0, 0.16);
  const short = grain(1.45, 0.16);
  const front = new THREE.Mesh(new THREE.BoxGeometry(2 * sx, AH, AT), long);
  front.position.set(0, yc, fz - AT / 2);
  const back = front.clone();
  back.position.z = bz + AT / 2;
  const sideGeo = new THREE.BoxGeometry(AT, AH, fz - bz);
  const left = new THREE.Mesh(sideGeo, short);
  left.position.set(-sx + AT / 2, yc, (fz + bz) / 2);
  const right = left.clone();
  right.position.x = sx - AT / 2;
  g.add(front, back, left, right);
  // a bead under the lip of the top, and a thinner one along the apron's foot
  for (const [y, r] of [[y0 - 0.014, 0.016], [y0 - AH + 0.01, 0.011]]) {
    const bead = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 2 * sx, 12, 1), long);
    bead.rotation.z = Math.PI / 2;
    bead.position.set(0, y, fz + r * 0.35);
    g.add(bead);
  }
  // the drawer: a front standing a little proud, a fine shadow gap round it, brass hardware
  const DW = 1.56;
  const DH = 0.22;
  const gap = new THREE.Mesh(new THREE.BoxGeometry(DW + 0.02, DH + 0.02, 0.004), new THREE.MeshBasicMaterial({ color: 0x080503 }));
  gap.position.set(0, yc - 0.01, fz + 0.002);
  const drawer = new THREE.Mesh(new THREE.BoxGeometry(DW, DH, 0.016), grain(0.75, 0.1));
  drawer.position.set(0, yc - 0.01, fz + 0.008);
  g.add(gap, drawer);
  const brass = indirectOnly(brassMaterial(tex, env, { color: 0xc89a52, repeat: 0.4, rough: 1.2 }));
  const plate = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.075, 0.005), brass);
  plate.position.set(0, yc - 0.01, fz + 0.018);
  const hole = new THREE.Mesh(new THREE.CircleGeometry(0.008, 12), new THREE.MeshBasicMaterial({ color: 0x050302 }));
  hole.position.set(0, yc - 0.002, fz + 0.0207);
  g.add(plate, hole);
  for (const x of [-0.5, 0.5]) {
    const rose = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.024, 0.006, 20), brass);
    rose.rotation.x = Math.PI / 2;
    rose.position.set(x, yc - 0.01, fz + 0.019);
    const knob = new THREE.Mesh(new THREE.SphereGeometry(0.02, 16, 10), brass);
    knob.scale.set(1, 1, 0.8);
    knob.position.set(x, yc - 0.01, fz + 0.04);
    g.add(rose, knob);
  }
  // the legs: a square block where the aprons meet, then turned (collar, vase, rings, bun foot)
  const LB = 0.17;
  const blockMat = grain(0.12, 0.16);
  const legMat = grain(0.5, 2.4, Math.PI / 2);
  const prof = [
    [0.07, 0], [0.085, 0.03], [0.08, 0.1], [0.06, 0.14], [0.066, 0.2], [0.052, 0.26], [0.05, 0.4], [0.058, 0.62], [0.08, 0.95], [0.09, 1.15],
    [0.084, 1.3], [0.06, 1.48], [0.052, 1.56], [0.07, 1.62], [0.07, 1.68], [0.055, 1.74], [0.06, 1.8], [0.078, 1.86], [0.078, 1.92], [0.07, 1.95],
  ];
  const turnH = y0 - AH - FLOOR; // from the floor to the foot of the apron
  const legGeo = new THREE.LatheGeometry(prof.map(([r, y]) => new THREE.Vector2(r, (y / 1.95) * turnH)), 24);
  const blockGeo = new THREE.BoxGeometry(LB, AH, LB);
  for (const x of [-1, 1]) {
    for (const z of [bz + LB / 2 - 0.012, fz - LB / 2 + 0.012]) {
      const block = new THREE.Mesh(blockGeo, blockMat);
      block.position.set(x * (sx - LB / 2 + 0.012), yc, z);
      const leg = new THREE.Mesh(legGeo, legMat);
      leg.position.set(block.position.x, FLOOR, z);
      g.add(block, leg);
    }
  }
  g.traverse((o) => {
    if (o.isMesh) {
      o.castShadow = false;
      o.receiveShadow = false;
    }
  });
  return g;
}

// ---------- the chamber behind the desk ----------
// The desk stands in a small, low room: worn oak floorboards about 76 cm below the desk top
// (FLOOR) and, a metre behind the desk, the far wall (WALL_Z) with a hearth at floor level, low
// shelves, a chest and a door. The opening camera looks down over the desk, so above its far edge
// it sees only the base of that wall (in landscape) and the floor behind and beside the desk (in
// portrait), the top fifth to third of the frame; the reading pose sees none of it. So the room
// is painted rather than built: the wall is a painting (tex.chamberWall, prompts/room-wall.txt,
// softly out of focus); the floor is drawn here, small on purpose, so the GPU's magnification
// blurs it like depth of field. Both are unlit (they carry their own light), dim, and fade into
// the dark at their edges. A soft glow over the hearth and its pool on the floor flicker with a
// slower fire than the candle's, and the whole room comes up with the candle as the veil lifts.
// Until the painting exists, the wall is drawn here too (the same layout, in plain shapes).
export const FLOOR = -2.8;
const WALL_Z = -5.4;
// The wall plane carries the painting at its own 3:2: 12.6 x 8.4 units (about 3.4 x 2.3 m),
// placed for what the openings actually see of it: in landscape the wall from about 1.0 to 2.2
// units above the floor (the desk hides the rest), in portrait from the floor to about 0.9, both
// round x = 0. So the hearth (left in the painting) stands at x = 0, and the painting's floor
// line (`floor`, up from its bottom edge) sits `lift` above the 3D floor: the fire then shows
// just over the desk's far edge in landscape, the hearth's stones and its glow in portrait; the
// painted boards below the line read as floor.
const WALL = { x0: -2.4, x1: 10.2, h: 8.4, floor: 0.125, lift: 0.35 };
const HEARTH = { u: 0.19, v: 0.22 }; // the fire's bright centre in the painting (bake_room.py: from its left, from its bottom)
const ROOM = { dim: 0.6 }; // how much of its own light the painted room keeps
// Drawn at w x h and kept at `soft` of that (antialiased and a little soft); seen magnified, the
// smooth sampling below (smoothSampled) blurs it on like a lens out of focus.
function softTex(w, h, soft, draw) {
  const big = document.createElement("canvas");
  big.width = w;
  big.height = h;
  draw(big.getContext("2d"), w, h);
  return canvasTex(Math.round(w * soft), Math.round(h * soft), (g, sw, sh) => {
    g.imageSmoothingQuality = "high";
    g.drawImage(big, 0, 0, sw, sh);
    big.width = big.height = 0;
  });
}

// The painted room is seen far larger than its texels in some framings (a phone held upright
// opens on the hearth and the floor several times magnified). Bilinear filtering then shows the
// texel grid and every compression block: it reads as a picture gone missing. A cubic B-spline
// instead (four bilinear taps, weighted; GPU Gems 2, ch. 20) is smooth to its second derivative,
// so the magnified painting melts like a lens out of focus. The level of detail is taken from
// the plain texture coordinates (textureGrad), so the taps' per-texel jumps never pick a blurrier
// mip along the grid; with dithering, the long dark gradients never band.
const BSPLINE = /* glsl */ `
vec4 bsplineW(float v) {
  vec4 n = vec4(1.0, 2.0, 3.0, 4.0) - v;
  vec4 s = n * n * n;
  float x = s.x, y = s.y - 4.0 * s.x, z = s.z - 4.0 * s.y + 6.0 * s.x;
  return vec4(x, y, z, 6.0 - x - y - z) / 6.0;
}
vec4 textureSmooth(sampler2D t, vec2 uv) {
  vec2 size = vec2(textureSize(t, 0));
  vec2 gx = dFdx(uv), gy = dFdy(uv);
  vec2 st = uv * size - 0.5;
  vec2 f = fract(st);
  st -= f;
  vec4 xw = bsplineW(f.x), yw = bsplineW(f.y);
  vec4 c = st.xxyy + vec2(-0.5, 1.5).xyxy;
  vec4 s = vec4(xw.xz + xw.yw, yw.xz + yw.yw);
  vec4 o = (c + vec4(xw.yw, yw.yw) / s) / size.xxyy;
  vec4 s0 = textureGrad(t, o.xz, gx, gy), s1 = textureGrad(t, o.yz, gx, gy);
  vec4 s2 = textureGrad(t, o.xw, gx, gy), s3 = textureGrad(t, o.yw, gx, gy);
  float sx = s.x / (s.x + s.y), sy = s.z / (s.z + s.w);
  return mix(mix(s3, s2, sx), mix(s1, s0, sx), sy);
}`;
function smoothSampled(mat) {
  mat.dithering = true;
  mat.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", `#include <common>\n${BSPLINE}`)
      .replace("#include <map_fragment>", "#ifdef USE_MAP\n  diffuseColor *= textureSmooth(map, vMapUv);\n#endif");
  };
  mat.customProgramCacheKey = () => "smooth-sampled";
  return mat;
}

function softGlow(size = 128) {
  return canvasTex(size, size, (g, w) => {
    const r = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2);
    r.addColorStop(0, "rgba(255,190,110,1)");
    r.addColorStop(0.35, "rgba(255,150,70,0.45)");
    r.addColorStop(1, "rgba(255,120,40,0)");
    g.fillStyle = r;
    g.fillRect(0, 0, w, w);
  });
}

// The floor from above, painted as albedo times light (multiplied, so the boards keep their
// grain and seams where the fire lights them, as the painted boards at the foot of the wall do):
// worn oak boards running along the wall, a hearth rug between the desk and the fire, the
// hearth's light falling off from the foot of the wall (as warm and bright there as the
// painting's own boards, so that floor and wall meet without a seam), only the room's dim
// bounce under and in front of the desk, and darkness at the edges. Drawn at ~114 px a unit and
// kept at a quarter of that, then sampled smooth (smoothSampled): as soft and out of focus as the
// painted wall beside it, never the grid of its texels, even where a phone held upright sees it
// many times magnified.
function floorTexture(x0, x1, z0, z1) {
  const W_ = 2048;
  const H_ = Math.round((W_ * (z1 - z0)) / (x1 - x0));
  return softTex(W_, H_, 0.25, (g, w, h) => {
    const rnd = rng(77);
    const k = w / (x1 - x0); // px a unit
    const px = (x) => (x - x0) * k;
    const pz = (z) => (z - z0) * k;
    // ---- albedo: worn oak boards along the wall, each its own brown, grain, knots, seams
    g.fillStyle = "#4a2c18";
    g.fillRect(0, 0, w, h);
    const bw = 0.38 * k; // about 10 cm
    for (let y = 0; y < h; y += bw) {
      let x = -rnd() * 4 * k;
      while (x < w) {
        const len = (2.6 + rnd() * 4.4) * k;
        g.fillStyle = `hsl(${21 + rnd() * 8}, ${44 + rnd() * 14}%, ${31 + rnd() * 11}%)`;
        g.fillRect(x, y, len, bw);
        for (let s = 0; s < 9; s++) {
          g.fillStyle = rnd() < 0.45 ? `rgba(255,214,160,${0.03 + rnd() * 0.05})` : `rgba(30,14,5,${0.06 + rnd() * 0.12})`;
          g.fillRect(x + rnd() * 0.3 * k, y + rnd() * bw, len * (0.5 + rnd() * 0.5), 1 + rnd() * 2.5);
        }
        if (rnd() < 0.3) {
          g.fillStyle = "rgba(34,16,6,0.45)";
          g.beginPath();
          g.ellipse(x + rnd() * len, y + bw * (0.3 + rnd() * 0.4), 0.06 * k, 0.025 * k, 0, 0, Math.PI * 2);
          g.fill();
        }
        g.fillStyle = "rgba(14,6,2,0.7)"; // a butt joint
        g.fillRect(x + len - 1.5, y, 3, bw);
        x += len;
      }
      g.fillStyle = "rgba(12,5,2,0.75)"; // the seam between two boards, and the worn edge beside it
      g.fillRect(0, y - 1.5, w, 3);
      g.fillStyle = "rgba(255,205,150,0.06)";
      g.fillRect(0, y + 1.5, w, 2);
    }
    // ---- the hearth rug: a madder border with an ochre guard line and a running lozenge, a
    // terracotta field with a stepped medallion, fringed short ends, worn paler here and there
    const R = { x: 0.7, z: -3.65, a: 1.9, b: 0.85 };
    const box = (inset, c) => {
      g.fillStyle = c;
      g.fillRect(px(R.x - R.a + inset), pz(R.z - R.b + inset), (2 * (R.a - inset)) * k, (2 * (R.b - inset)) * k);
    };
    const lozenge = (x, z, a, b, c) => {
      g.fillStyle = c;
      g.beginPath();
      g.moveTo(px(x - a), pz(z));
      g.lineTo(px(x), pz(z - b));
      g.lineTo(px(x + a), pz(z));
      g.lineTo(px(x), pz(z + b));
      g.closePath();
      g.fill();
    };
    g.strokeStyle = "rgba(200,166,118,0.6)";
    g.lineWidth = 2.5;
    for (const sx of [-1, 1]) {
      for (let zz = R.z - R.b + 0.03; zz < R.z + R.b - 0.02; zz += 0.035) {
        g.beginPath();
        g.moveTo(px(R.x + sx * R.a), pz(zz));
        g.lineTo(px(R.x + sx * (R.a + 0.07 + rnd() * 0.03)), pz(zz + (rnd() - 0.5) * 0.02));
        g.stroke();
      }
    }
    box(0, "#6a2418");
    box(0.05, "#5a1d14");
    for (const [z, sgn] of [[R.z - R.b + 0.13, 1], [R.z + R.b - 0.13, 1]]) {
      for (let x = R.x - R.a + 0.2; x < R.x + R.a - 0.15; x += 0.2) lozenge(x, z, 0.06, 0.05 * sgn, "#8a5430");
    }
    for (const x of [R.x - R.a + 0.13, R.x + R.a - 0.13]) {
      for (let z = R.z - R.b + 0.3; z < R.z + R.b - 0.25; z += 0.2) lozenge(x, z, 0.05, 0.06, "#8a5430");
    }
    box(0.24, "#94603a");
    box(0.27, "#7e3420");
    lozenge(R.x, R.z, 0.9, 0.42, "#5e1d13");
    lozenge(R.x, R.z, 0.74, 0.33, "#9a5e36");
    lozenge(R.x, R.z, 0.5, 0.22, "#7a2a18");
    lozenge(R.x, R.z, 0.22, 0.1, "#a87444");
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) lozenge(R.x + sx * (R.a - 0.55), R.z + sz * (R.b - 0.5), 0.26, 0.12, "#6a2416");
    for (let i = 0; i < 14; i++) {
      g.fillStyle = `rgba(214,170,120,${0.05 + rnd() * 0.06})`;
      g.beginPath();
      g.ellipse(px(R.x + (rnd() - 0.5) * 2 * R.a * 0.8), pz(R.z + (rnd() - 0.5) * 2 * R.b * 0.7), (0.1 + rnd() * 0.25) * k, (0.05 + rnd() * 0.12) * k, rnd() * 3, 0, Math.PI * 2);
      g.fill();
    }
    // ---- light, multiplied in: the room's dim bounce everywhere, the fire at the foot of the
    // wall (falling off from the hearth, a warm band along the wall's foot from the lit plaster),
    // the desk's shade under and in front of it, darkness towards the edges
    const L = document.createElement("canvas");
    L.width = w;
    L.height = h;
    const l = L.getContext("2d");
    l.fillStyle = "rgb(50,38,30)";
    l.fillRect(0, 0, w, h);
    l.globalCompositeOperation = "lighter";
    const hx = px(WALL.x0 + HEARTH.u * (WALL.x1 - WALL.x0));
    const fire = l.createRadialGradient(hx, pz(WALL_Z), 0, hx, pz(WALL_Z), 5.4 * k);
    fire.addColorStop(0, "rgba(255,200,140,1)");
    fire.addColorStop(0.08, "rgba(255,178,108,0.9)");
    fire.addColorStop(0.24, "rgba(220,124,64,0.5)");
    fire.addColorStop(0.5, "rgba(150,74,36,0.2)");
    fire.addColorStop(1, "rgba(90,44,20,0)");
    l.fillStyle = fire;
    l.fillRect(0, 0, w, h);
    const band = l.createLinearGradient(0, pz(WALL_Z), 0, pz(WALL_Z + 1.5));
    band.addColorStop(0, "rgba(160,92,46,0.6)");
    band.addColorStop(1, "rgba(160,92,46,0)");
    l.fillStyle = band;
    l.fillRect(0, 0, w, h);
    l.globalCompositeOperation = "source-over";
    const shade = (x, z, rw, rd, a) => {
      const gr = l.createRadialGradient(px(x), pz(z), 0, px(x), pz(z), rw * k);
      gr.addColorStop(0, `rgba(6,4,3,${a})`);
      gr.addColorStop(0.55, `rgba(6,4,3,${a * 0.75})`);
      gr.addColorStop(1, "rgba(6,4,3,0)");
      l.save();
      l.translate(px(x), pz(z));
      l.scale(1, rd / rw);
      l.translate(-px(x), -pz(z));
      l.fillStyle = gr;
      l.fillRect(0, 0, w, h);
      l.restore();
    };
    // the fire's light passing low under the desk, and the room's warm bounce on the reader's side
    l.globalCompositeOperation = "lighter";
    const under = l.createRadialGradient(px(0.1), pz(1.1), 0, px(0.1), pz(1.1), 3.4 * k);
    under.addColorStop(0, "rgba(150,96,62,0.62)");
    under.addColorStop(0.6, "rgba(120,74,44,0.3)");
    under.addColorStop(1, "rgba(100,60,34,0)");
    l.fillStyle = under;
    l.fillRect(0, 0, w, h);
    l.globalCompositeOperation = "source-over";
    shade(0, -0.4, 2.7, 1.6, 0.34);
    const edge = l.createRadialGradient(px(0.6), pz(-1.6), 3.0 * k, px(0.6), pz(-1.6), 9.6 * k);
    edge.addColorStop(0, "rgba(0,0,0,0)");
    edge.addColorStop(1, "rgba(0,0,0,0.94)");
    l.fillStyle = edge;
    l.fillRect(0, 0, w, h);
    g.globalCompositeOperation = "multiply";
    g.drawImage(L, 0, 0);
    g.globalCompositeOperation = "source-over";
    L.width = L.height = 0;
  });
}

// The far wall in plain shapes, laid out as the painting is (prompts/room-wall.txt): plaster
// between oak posts under a beam, the hearth, a low bookcase, a chest with a cloak, the round-
// topped door at the right, a small night window high up.
function wallSketch() {
  return softTex(384, 256, 0.42, (g, w, h) => {
    const rnd = rng(5);
    const U = (u) => u * w;
    const Vb = (v) => h - (v + WALL.floor - 0.04) * h; // v up from the floor line (drawn at 0.04)
    const base = g.createLinearGradient(0, 0, 0, h);
    base.addColorStop(0, "#2a160b");
    base.addColorStop(0.7, "#5a3519");
    base.addColorStop(1, "#4a2a14");
    g.fillStyle = base;
    g.fillRect(0, 0, w, h);
    g.fillStyle = "#1e1008";
    for (const u of [0.05, 0.23, 0.45, 0.66, 0.97]) g.fillRect(U(u) - 5, 0, 10, h);
    g.fillRect(0, 0, w, 14);
    g.fillStyle = "#3a2010";
    g.fillRect(0, Vb(0.04), w, h * 0.04); // the floor strip
    // the window, high up
    g.fillStyle = "#1c2a44";
    g.beginPath();
    g.arc(U(0.16), Vb(0.72), 16, Math.PI, 0);
    g.lineTo(U(0.16) + 16, Vb(0.56));
    g.lineTo(U(0.16) - 16, Vb(0.56));
    g.fill();
    // the hearth: a dark round mouth, the fire, logs
    const [hx, hy] = [U(HEARTH.u), h - HEARTH.v * h];
    g.fillStyle = "#5c4a3a";
    g.beginPath();
    g.arc(hx, Vb(0.2), 40, Math.PI, 0);
    g.lineTo(hx + 40, Vb(0.04));
    g.lineTo(hx - 40, Vb(0.04));
    g.fill();
    g.fillStyle = "#140a05";
    g.beginPath();
    g.arc(hx, Vb(0.2), 30, Math.PI, 0);
    g.lineTo(hx + 30, Vb(0.04));
    g.lineTo(hx - 30, Vb(0.04));
    g.fill();
    const fire = g.createRadialGradient(hx, hy, 0, hx, hy, 40);
    fire.addColorStop(0, "rgba(255,176,96,0.9)");
    fire.addColorStop(0.3, "rgba(220,110,40,0.7)");
    fire.addColorStop(1, "rgba(200,80,20,0)");
    g.fillStyle = fire;
    g.fillRect(hx - 44, hy - 44, 88, 88);
    g.fillStyle = "#3a2414";
    for (let k = 0; k < 4; k++) g.fillRect(hx + 46 + (k % 2) * 6, Vb(0.04) - 6 - k * 6, 22, 6);
    // the low bookcase with its books
    const [b0, b1, bt] = [U(0.5), U(0.62), Vb(0.42)];
    g.fillStyle = "#24140a";
    g.fillRect(b0, bt, b1 - b0, Vb(0.04) - bt);
    for (const s of [0.06, 0.18, 0.3]) {
      let x = b0 + 3;
      while (x < b1 - 6) {
        const bw = 3 + rnd() * 5;
        const bh = 14 + rnd() * 10;
        g.fillStyle = ["#5a2a1c", "#3e4a2c", "#6a4a24", "#2c3a4a", "#7a5a30"][Math.floor(rnd() * 5)];
        g.fillRect(x, Vb(s) - bh, bw, bh);
        x += bw + 1;
      }
    }
    g.fillStyle = "#c08a3a";
    g.fillRect(U(0.55), bt - 12, 8, 12); // the lantern
    // the chest, a cloak on it, a staff
    g.fillStyle = "#3a2312";
    g.fillRect(U(0.68), Vb(0.2), U(0.1), h * 0.16);
    g.fillStyle = "#5a1e16";
    g.fillRect(U(0.69), Vb(0.22), U(0.08), h * 0.03);
    g.fillStyle = "#2a180c";
    g.fillRect(U(0.8), Vb(0.6), 3, h * 0.56);
    // the door, round-topped, in shadow
    g.fillStyle = "#170c06";
    g.beginPath();
    g.arc(U(0.89), Vb(0.62), 26, Math.PI, 0);
    g.lineTo(U(0.89) + 26, Vb(0.04));
    g.lineTo(U(0.89) - 26, Vb(0.04));
    g.fill();
    // the fire's warmth on the plaster, and the dark at the edges
    const warm = g.createRadialGradient(hx, hy, 0, hx, hy, w * 0.45);
    warm.addColorStop(0, "rgba(255,150,70,0.22)");
    warm.addColorStop(1, "rgba(255,150,70,0)");
    g.globalCompositeOperation = "lighter";
    g.fillStyle = warm;
    g.fillRect(0, 0, w, h);
    g.globalCompositeOperation = "source-over";
    const v = g.createRadialGradient(w * 0.5, h * 0.8, h * 0.3, w * 0.5, h * 0.8, w * 0.7);
    v.addColorStop(0, "rgba(11,6,4,0)");
    v.addColorStop(1, "rgba(11,6,4,0.9)");
    g.fillStyle = v;
    g.fillRect(0, 0, w, h);
  });
}

function makeChamber(tex) {
  const group = new THREE.Group();
  const flat = (map) => smoothSampled(new THREE.MeshBasicMaterial({ map, color: new THREE.Color(ROOM.dim, ROOM.dim, ROOM.dim), fog: false }));
  // the floor, from the wall to well in front of the desk
  const [fx0, fx1, fz0, fz1] = [-7, 11, WALL_Z, 4.6];
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(fx1 - fx0, fz1 - fz0), flat(floorTexture(fx0, fx1, fz0, fz1)));
  floor.rotation.x = -Math.PI / 2;
  floor.position.set((fx0 + fx1) / 2, FLOOR, (fz0 + fz1) / 2);
  const wallTex = tex.chamberWall || wallSketch();
  wallTex.colorSpace = THREE.SRGBColorSpace;
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(WALL.x1 - WALL.x0, WALL.h), flat(wallTex));
  wall.position.set((WALL.x0 + WALL.x1) / 2, FLOOR + WALL.lift + (0.5 - WALL.floor) * WALL.h, WALL_Z);
  // the fire: its glow on the wall and its pool on the floor, both additive
  const glowTex = softGlow();
  const glowMat = (o) => new THREE.MeshBasicMaterial({ map: glowTex, transparent: true, opacity: o, depthWrite: false, blending: THREE.AdditiveBlending, fog: false });
  const hx = WALL.x0 + HEARTH.u * (WALL.x1 - WALL.x0);
  // the painting carries its own fire; the glow over it only breathes with it
  const fireGlow = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 2.6), glowMat(tex.chamberWall ? 0.1 : 0.16));
  fireGlow.position.set(hx, FLOOR + WALL.lift + (HEARTH.v - WALL.floor) * WALL.h, WALL_Z + 0.03);
  const firePool = new THREE.Mesh(new THREE.PlaneGeometry(4.4, 3.2), glowMat(0.12));
  firePool.rotation.x = -Math.PI / 2;
  firePool.position.set(hx, FLOOR + 0.01, WALL_Z + 1.1);
  group.add(floor, wall, fireGlow, firePool);
  const mats = [floor.material, wall.material];
  const base = { glow: fireGlow.material.opacity, pool: firePool.material.opacity };
  // t: seconds; light: the room's share of the candle coming up (the intro), 0..1
  function update(t, light = 1, motion = true) {
    const f = motion ? 1 + 0.07 * Math.sin(t * 2.3) + 0.05 * Math.sin(t * 5.9 + 1.1) + 0.03 * Math.sin(t * 13.1 + 2.3) : 1;
    const k = ROOM.dim * (0.45 + 0.55 * light);
    for (const m of mats) m.color.setScalar(k);
    fireGlow.material.opacity = base.glow * f * light;
    firePool.material.opacity = base.pool * f * light;
  }
  return { group, update, painted: Boolean(tex.chamberWall) };
}

// ---------- the props with real geometry (CC0 models, public/assets/book3d/models) ----------
// Fetched once the desk's own textures are in (they come first on a slow line), with the glTF
// loader split off into a chunk of its own; the book does not wait for them long (main.js), and
// any that come later take their place on the desk as they arrive (createRoom place, main.js placeLate).
const PROPS = ["apple", "goblet", "brass_pot", "brass_vase", "chest"];
export function loadProps(base) {
  const loader = import("three/examples/jsm/loaders/GLTFLoader.js").then(({ GLTFLoader }) => new GLTFLoader());
  return Object.fromEntries(
    PROPS.map((name) => [name, loader.then((l) => l.loadAsync(`${base}assets/book3d/models/${name}.glb`)).then((g) => g.scene).catch(() => null)])
  );
}

// Sets one prop on the desk where it belongs (its scale from its size), its metals mirroring the
// room; returns the objects to add to the scene (the vase brings its lavender), or null.
function placeProp(name, obj, env) {
  if (!obj) return null;
  const fit = (size, pos, rotY = 0, byHeight = false) => {
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
    mirrorRoom(obj, env);
  };
  const out = [obj];
  if (name === "apple") fit(0.12, new THREE.Vector3(1.78, 0, -0.62), 0.8);
  else if (name === "goblet") fit(0.15, new THREE.Vector3(1.5, 0, -0.78));
  else if (name === "brass_pot") fit(0.26, new THREE.Vector3(-1.66, 0, -0.18), 0.4);
  else if (name === "chest") fit(0.56, new THREE.Vector3(1.9, 0, -1.3), -0.35);
  else if (name === "brass_vase") {
    fit(0.36, new THREE.Vector3(-0.62, 0, -1.3), 0, true);
    const bunch = makeLavender({ stems: 30, len: 0.55, seed: 44, lying: false, spread: 0.55 });
    bunch.position.set(-0.62, 0.36 - 0.55 * 0.42 + 0.02, -1.3);
    out.push(bunch);
  }
  return out;
}

// metals mirror the room explicitly (the scene-wide environment is kept dim for paper and wood)
function mirrorRoom(root, env) {
  root.traverse((o) => {
    const m = o.material;
    if (o.isMesh && m?.isMeshStandardMaterial && !m.envMap && (m.metalness > 0.5 || m.metalnessMap)) {
      m.envMap = env;
      // ORM-mapped leather is mostly dielectric: keep its grazing reflections modest
      m.envMapIntensity = m.userData.envBoost ?? (m.metalnessMap ? 0.6 : 0.9);
      m.needsUpdate = true;
    }
  });
}

// ---------- assembly ----------
// `props`: loadProps(...) started by the caller. Those already in are placed now; place(name, obj)
// sets one that comes later (the caller compiles its materials first, so it never stalls a frame).
// `shadowSize`: the candle's shadow map (smaller on a weak GPU, main.js).
export function createRoom({ renderer, scene, tex, parchmentImg, props = {}, shadowSize = 2048 }) {
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
  scene.add(makeDeskBase(wood, env, tex, { x: 2.3, z0: -1.77, z1: 1.53, y0: -0.14 }));

  // the room behind the desk (see "the chamber")
  const chamber = makeChamber(tex);
  scene.add(chamber.group);

  // lights: candle key (shadows), candle glow (falloff), warm fill, a breath of moonlight
  const key = new THREE.DirectionalLight(0xffcb94, 1.9);
  key.position.set(CANDLE.x + 0.15, 1.6, CANDLE.z + 0.2);
  key.target.position.set(0.15, 0, 0.1);
  key.castShadow = true;
  key.shadow.mapSize.set(shadowSize, shadowSize);
  key.shadow.camera.left = -2.4;
  key.shadow.camera.right = 2.4;
  key.shadow.camera.top = 1.9;
  key.shadow.camera.bottom = -1.9;
  key.shadow.camera.near = 0.2;
  key.shadow.camera.far = 5;
  key.shadow.bias = -0.0005;
  key.shadow.normalBias = 0.01;
  key.shadow.radius = (5 * shadowSize) / 2048; // the same softness on the desk at any map size
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
  // silhouette against the dark room. The front cover swings up over it in the intro: its
  // fore-edge sweeps a half cylinder of radius ~1.07 round the spine (1.09 at the clasp), so the
  // feather leans back towards the head more than in over the board, and turns its vane a little
  // about the shaft, keeping every barb ~2.5 cm (0.027) outside that sweep
  const inkwell = makeInkwell(env, tex);
  const WELL = new THREE.Vector3(1.18, 0.0025, 0.2); // on the runner
  inkwell.position.copy(WELL);
  scene.add(inkwell);
  const quill = makeQuill(tex, 0.72);
  placeQuill(quill, WELL, { lean: 0.32, azimuth: Math.PI * 0.7, roll: 0.3, rimY: 0.113 + WELL.y });
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

  // the props already in (the rest come later, see place)
  for (const [name, obj] of Object.entries(props)) if (obj) scene.add(...placeProp(name, obj, env));
  mirrorRoom(scene, env);

  const dust = makeDust();
  scene.add(dust.points);

  const room = { env, desk, key, glow, fill, moon, candle, dust, chamber, flamePos: new THREE.Vector3(CANDLE.x, FLAME_Y, CANDLE.z) };
  // a prop that came after the room was built: the objects to compile and add (null: none)
  room.place = (name, obj) => placeProp(name, obj, room.env);
  // a lost GL context given back: the environment map is a rendered texture (nothing to upload it
  // again from), so it is rendered anew and every material mirroring the old one takes the new one
  room.renewEnvironment = () => {
    const old = room.env;
    room.env = makeEnvironment(renderer);
    if (scene.environment === old) scene.environment = room.env;
    scene.traverse((o) => {
      for (const m of [o.material].flat()) {
        if (m?.envMap === old) {
          m.envMap = room.env;
          m.needsUpdate = true;
        }
      }
    });
  };
  return room;
}
