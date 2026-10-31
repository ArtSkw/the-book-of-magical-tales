// Draws one book page (parchment, text, illustrations, choice seals) into a 2D canvas.
// Layout works in page units: the page is 1000 units wide and PAGE_UNITS_H tall;
// the canvas transform maps units to device pixels, so text is rasterised at the
// final resolution and stays crisp on a retina tablet.
import { storyFor, ui } from "./story.js";
import { spreadImage, normaliseImage } from "./pages.js";
import { taleUi, tales as talesList } from "./tales.js";
import { LATIN } from "./latin.js";

export const PAGE_ASPECT = 1.38; // depth / width
export const PAGE_UNITS_W = 1000;
export const PAGE_UNITS_H = Math.round(PAGE_UNITS_W * PAGE_ASPECT);

const SERIF = '"EB Garamond", "Garamond", Georgia, serif';
const C = {
  ink: "#2a1a0f",
  inkSoft: "#5b3e26",
  rubric: "#962a1f",
  gold: "#c99a3f",
  goldDark: "#80591d",
  goldLight: "#f1d78f",
  blue: "#2c4877",
  green: "#4f6b35",
  inkHint: "#4a3120", // the small italic under a choice: a shade darker than inkSoft
};
// The small type that sits quietest on a page is set heavier than its size alone would want, so
// it stays legible on a phone: the hint and the response under a choice in Medium italic, the
// letter-spaced rubric capitals of the running head and of an epigraph's source in Semibold
// (thin, spaced capitals fade first). index.html serves 400 to 600, roman and italic (public/fonts).
const SMALL_WEIGHT = 500;
const CAPS_WEIGHT = 600;

// margins in units (gutter = side towards the spine)
const M = { top: 100, bottom: 112, gutter: 98, outer: 84 };
// read by main.js: on a phone held upright the camera frames the text column between them
export const TEXT_MARGINS = M;

// The framed plate on a right page with choices or a note under it: one format for every tale,
// 5:4 (art exported at 1280x1024, cropped from the 1536x1024 generation), the width of the text
// column. pad = room above and below the picture for its gilded frame, gap = to the block under
// it, safe = kept free at the foot whatever the language. At this size the longest choice block
// (labels <= 38 chars, responses <= 110) and a note up to 280 chars still fit (validate-stories.js);
// on a phone held upright, where the print under it is set a step larger (PHONE_LIFT), the plate
// gives up some of its height to it.
const PLATE = { aspect: 5 / 4, pad: 40, gap: 34, safe: 24 };
// ---------- type scale ----------
// Every kind of text on a page has a role, and every role is a step of one modular scale: the
// house body (42 page units) times a major second (1.125) per step. Hierarchy comes as much from
// weight, italic, small capitals and colour, so the steps stay close, as in a printed book. Only a
// tale's body text is fitted (SIZES, so its longest page fits); every other role keeps its size
// whatever the tale, the layout or the language, and the content limits in validate-stories.js
// are measured at these sizes. The table of roles: docs/TYPE_SCALE.md.
const TYPE = { base: 42, ratio: 1.125 };
const ROLE_STEP = { display: 5, title: 3, body: 0, quote: -1, label: -1, small: -2, caption: -4, caps: -5 };
// Read on a phone held upright, the camera frames only the page's text column (main.js, column
// mode) and the print under the body would read a size small: there labels and small print go one
// step up. The plate gives them the room (choicesBlock, noteBlock).
const PHONE_LIFT = new Set(["label", "small"]);
const typeSize = (role, column = false) => Math.round(TYPE.base * TYPE.ratio ** (ROLE_STEP[role] + (column && PHONE_LIFT.has(role) ? 1 : 0)));
// the lines of a tale's title: the display size with a tight book leading
const TITLE_LEAD = Math.round(typeSize("display") * 1.13);

// Polish typography: never leave a one-letter word at the end of a line.
const glueOrphans = (s) => s.replace(/(^|[\s(„"])([aiouwzAIOUWZ])\s+/g, "$1$2 ");

function font(weight, size, italic = false) {
  return `${italic ? "italic " : ""}${weight} ${size}px ${SERIF}`;
}

function wrap(ctx, text, widthAt) {
  const words = text.split(/ +/);
  const lines = [];
  let line = "";
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (!line || ctx.measureText(test).width <= widthAt(lines.length)) line = test;
    else {
      lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

// ---------- motion helpers (a page redrawn while it animates) ----------

const clamp01 = (t) => Math.min(1, Math.max(0, t));
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const mix = (a, b, t) => `rgba(${a.slice(0, 3).map((v, i) => Math.round(v + (b[i] - v) * t)).join(",")},${(a[3] ?? 1) + ((b[3] ?? 1) - (a[3] ?? 1)) * t})`;

// A line of type being written in from the left: `reveal` (0..1) of it is inked, with a soft
// wet edge running ahead of the pen.
function inkText(ctx, text, x, y, reveal, color) {
  if (reveal <= 0) return;
  ctx.fillStyle = color;
  if (reveal < 1) {
    const w = ctx.measureText(text).width;
    const feather = Math.min(56, w * 0.3);
    const edge = x + (w + feather) * reveal;
    const g = ctx.createLinearGradient(edge - feather, 0, edge, 0);
    g.addColorStop(0, color);
    g.addColorStop(1, `rgba(${rgb(color).join(",")},0)`);
    ctx.fillStyle = g;
  }
  ctx.fillText(text, x, y);
}

// Every line of type on a page goes through fillText. While a page is drawn the artist notes
// where each line lands (canvas px), so the language "rewrite" can write it in line by line; or
// it leaves the type out altogether: the bare page (parchment, pictures, ornaments) under the ink.
function lineBox(g, s, x, y) {
  const m = g.measureText(s);
  const T = g.getTransform();
  const pad = 5; // antialiasing and the drop initial's outline
  const x0 = T.a * (x - m.actualBoundingBoxLeft - pad) + T.e;
  const y0 = T.d * (y - m.actualBoundingBoxAscent - pad) + T.f;
  const x1 = T.a * (x + m.actualBoundingBoxRight + pad) + T.e;
  const y1 = T.d * (y + m.actualBoundingBoxDescent + pad) + T.f;
  return { x: Math.floor(x0), y: Math.floor(y0), w: Math.ceil(x1) - Math.floor(x0), h: Math.ceil(y1) - Math.floor(y0) };
}
function typeHooks(g, { bare, lines }) {
  if (bare) g.fillText = g.strokeText = () => {};
  else {
    const fill = g.fillText;
    g.fillText = function (s, x, y, maxW) {
      lines.push(lineBox(this, s, x, y));
      return maxW === undefined ? fill.call(this, s, x, y) : fill.call(this, s, x, y, maxW);
    };
  }
  return () => {
    delete g.fillText;
    delete g.strokeText;
  };
}

// ---------- ornaments ----------

function goldGradient(ctx, x, y, w, h) {
  const g = ctx.createLinearGradient(x, y, x + w, y + h);
  g.addColorStop(0, "#f6dc8e");
  g.addColorStop(0.35, "#cf9f45");
  g.addColorStop(0.55, "#9c6d27");
  g.addColorStop(0.8, "#e5be63");
  g.addColorStop(1, "#b5832f");
  return g;
}

function dot(ctx, x, y, r, color) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
}

// A small diamond-and-dots rule used as a divider.
function ornamentRule(ctx, cx, y, w) {
  ctx.save();
  ctx.strokeStyle = C.rubric;
  ctx.globalAlpha = 0.75;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx - w / 2, y);
  ctx.lineTo(cx - 22, y);
  ctx.moveTo(cx + 22, y);
  ctx.lineTo(cx + w / 2, y);
  ctx.stroke();
  ctx.globalAlpha = 1;
  ctx.fillStyle = goldGradient(ctx, cx - 12, y - 12, 24, 24);
  ctx.beginPath();
  ctx.moveTo(cx, y - 12);
  ctx.lineTo(cx + 12, y);
  ctx.lineTo(cx, y + 12);
  ctx.lineTo(cx - 12, y);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 1.5;
  ctx.stroke();
  dot(ctx, cx - w / 2 - 8, y, 4, C.gold);
  dot(ctx, cx + w / 2 + 8, y, 4, C.gold);
  ctx.restore();
}

// ---------- drop-initial sprigs ----------
// The small sprig trailing from a gilt initial into the outer margin: a family of margin plants
// in the manner of the tailpieces (pear, oak and acorn, reed mace, rose hip, wild strawberry,
// hazel catkins, columbine, clover, a finch's feather, the old ivy vine), all in the greens, line
// weight and gold the sprig has always had, and within its old reach. Each is drawn in the
// sprig's own frame: x runs out into the margin from the initial's edge (never back in over the
// text), y down from the initial's top, `s` the initial's size; the stem leaves the initial at
// 0.82 s and hangs about one initial deep. `o`: { bend (+1/-1, which way the stem swings), curl
// (+1/-1, tendrils and hanging fruit), len (0.88..1.04), gold (a gold-leaf dot at the root) }.
const SPRIG_C = { leaf: C.green, light: "#6f8a45", rib: "rgba(38,52,24,0.5)", slate: "rgba(55,74,100,0.9)" };
const bezAt = (P, t) => {
  const u = 1 - t;
  const pt = (i) => u * u * u * P[0][i] + 3 * u * u * t * P[1][i] + 3 * u * t * t * P[2][i] + t * t * t * P[3][i];
  const d = (i) => 3 * u * u * (P[1][i] - P[0][i]) + 6 * u * t * (P[2][i] - P[1][i]) + 3 * t * t * (P[3][i] - P[2][i]);
  return { x: pt(0), y: pt(1), a: Math.atan2(d(1), d(0)) };
};
// reach: how much of the usual depth the stem takes (the rest is fruit, a flower or a feather)
function sprigStem(ctx, s, o, reach = 1, width = 3, straight = false) {
  const y0 = 0.82 * s;
  const h = 0.93 * o.len * reach * s;
  const P = [[0, y0], [straight ? 22 : 26, y0 + 0.14 * h], [26 - (straight ? 4 : 10) * o.bend, y0 + 0.57 * h], [26, y0 + h]];
  ctx.strokeStyle = SPRIG_C.leaf;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(...P[0]);
  ctx.bezierCurveTo(...P[1], ...P[2], ...P[3]);
  ctx.stroke();
  if (o.gold) goldDot(ctx, bezAt(P, 0.1).x, bezAt(P, 0.1).y, 2.6);
  return { at: (t) => bezAt(P, t), end: bezAt(P, 1) };
}
function goldDot(ctx, x, y, r) {
  dot(ctx, x, y, r + 0.9, C.goldDark);
  dot(ctx, x, y, r, C.goldLight);
}
// A leaf with a fine midrib; w = its half-width (of its length) at the widest.
function blade(ctx, x, y, r, angle, color, w = 0.45, rib = true) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(r * 0.55, -r * w, r, 0);
  ctx.quadraticCurveTo(r * 0.55, r * w, 0, 0);
  ctx.fillStyle = color;
  ctx.fill();
  if (rib) {
    ctx.beginPath();
    ctx.moveTo(r * 0.1, 0);
    ctx.lineTo(r * 0.78, 0);
    ctx.strokeStyle = SPRIG_C.rib;
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  ctx.restore();
}
function oakLeaf(ctx, x, y, r, angle, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  // three rounded lobes a side, narrowing to the stalk
  const half = (t) => r * 0.3 * Math.pow(Math.sin(Math.PI * Math.min(1, t * 1.04)), 0.7) * (0.62 + 0.38 * Math.abs(Math.cos(Math.PI * 3.5 * t)));
  ctx.beginPath();
  ctx.moveTo(0, 0);
  for (let i = 1; i <= 28; i++) ctx.lineTo((i / 28) * r, -half(i / 28));
  for (let i = 28; i >= 0; i--) ctx.lineTo((i / 28) * r, half(i / 28));
  ctx.fillStyle = color;
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(r * 0.05, 0);
  ctx.lineTo(r * 0.85, 0);
  ctx.strokeStyle = SPRIG_C.rib;
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.restore();
}
function trefoil(ctx, x, y, r, angle, color) {
  for (let k = 0; k < 3; k++) {
    const a = angle + (k - 1) * 1.15;
    dot(ctx, x + Math.cos(a) * r * 0.95, y + Math.sin(a) * r * 0.95, r, color);
  }
}
// A leaf on a little stalk: `make` draws the leaf (or leaflets) at the stalk's tip.
function stalk(ctx, x, y, len, angle, make) {
  const ex = x + Math.cos(angle) * len;
  const ey = y + Math.sin(angle) * len;
  ctx.strokeStyle = SPRIG_C.leaf;
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(ex, ey);
  ctx.stroke();
  make(ex, ey, angle);
}
// A fine tendril curling off the stem, outwards, a turn and a bit (dir: down first, or up).
function tendril(ctx, x, y, dir, r = 7) {
  ctx.strokeStyle = SPRIG_C.leaf;
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(x, y);
  for (let i = 1; i <= 28; i++) {
    const t = i / 28;
    const a = Math.PI - dir * 2.3 * Math.PI * t;
    const rr = r * (1 - 0.75 * t);
    ctx.lineTo(x + r + Math.cos(a) * rr, y + Math.sin(a) * rr);
  }
  ctx.stroke();
}

const SPRIGS = {
  // the old sprig: four ivy leaves and a red berry with a gold eye
  vine(ctx, s, o) {
    const st = sprigStem(ctx, s, o);
    for (let i = 0; i < 4; i++) {
      const p = st.at(0.16 + i * 0.25);
      blade(ctx, p.x, p.y, i % 2 ? 21 : 19, p.a + (i % 2 ? -1 : 1) * 1.0, i % 2 ? SPRIG_C.leaf : SPRIG_C.light, 0.45, false);
    }
    dot(ctx, st.end.x, st.end.y + 0.03 * s, 7, C.rubric);
    dot(ctx, st.end.x, st.end.y + 0.03 * s, 3, C.goldLight);
  },
  // a pear leaf or two and a small gilded pear on its stalk
  pear(ctx, s, o) {
    const st = sprigStem(ctx, s, o, 0.76);
    const a = st.at(0.3);
    const b = st.at(0.6);
    blade(ctx, a.x, a.y, 22, a.a - 0.95, SPRIG_C.leaf, 0.5);
    blade(ctx, b.x, b.y, 16, b.a + 1.05, SPRIG_C.light, 0.5);
    const { x, y } = st.end;
    const px = x + 2 * o.curl;
    ctx.strokeStyle = C.inkSoft;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x, y + 5, px, y + 9);
    ctx.stroke();
    blade(ctx, x + 0.5, y + 3, 10, -0.45, SPRIG_C.light, 0.5, false);
    ctx.save();
    ctx.translate(px, y + 8);
    ctx.rotate(-0.12 * o.curl);
    const w = 19;
    const h = 29;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(w * 0.3, 0, w * 0.2, h * 0.36, w * 0.48, h * 0.6);
    ctx.bezierCurveTo(w * 0.7, h * 0.9, w * 0.22, h, 0, h);
    ctx.bezierCurveTo(-w * 0.22, h, -w * 0.7, h * 0.9, -w * 0.48, h * 0.6);
    ctx.bezierCurveTo(-w * 0.2, h * 0.36, -w * 0.3, 0, 0, 0);
    ctx.fillStyle = goldGradient(ctx, -w / 2, 0, w, h);
    ctx.fill();
    ctx.strokeStyle = C.goldDark;
    ctx.lineWidth = 1.1;
    ctx.stroke();
    dot(ctx, -w * 0.18, h * 0.62, 2, "rgba(255,246,214,0.85)");
    ctx.restore();
  },
  // a finch's flight feather caught on a short sprig: slate vane, the gold wing bar
  feather(ctx, s, o) {
    const st = sprigStem(ctx, s, o, 0.4, 2.6);
    const m = st.at(0.55);
    blade(ctx, m.x, m.y, 13, m.a - 1.0, SPRIG_C.light, 0.45, false);
    const { x, y } = st.end;
    const L = 0.5 * s;
    ctx.save();
    ctx.translate(x, y + 3);
    // hanging, tilted out towards the page edge (never in over the text)
    ctx.rotate(Math.PI / 2 - (o.curl > 0 ? 0.14 : 0.3));
    ctx.scale(1, o.curl);
    const vane = () => {
      ctx.beginPath();
      ctx.moveTo(L * 0.1, 0);
      ctx.quadraticCurveTo(L * 0.45, -L * 0.2, L, -1);
      ctx.quadraticCurveTo(L * 0.6, L * 0.12, L * 0.1, 0);
    };
    vane();
    ctx.fillStyle = SPRIG_C.slate;
    ctx.fill();
    ctx.save();
    vane();
    ctx.clip();
    ctx.fillStyle = C.goldLight;
    ctx.fillRect(L * 0.5, -L, L * 0.1, 2 * L);
    // a few barbs, finer than the type
    ctx.strokeStyle = "rgba(240,228,200,0.35)";
    ctx.lineWidth = 0.8;
    for (let i = 1; i < 6; i++) {
      ctx.beginPath();
      ctx.moveTo(L * (0.15 + i * 0.13), 0);
      ctx.lineTo(L * (0.28 + i * 0.13), -L * 0.18);
      ctx.stroke();
    }
    ctx.restore();
    ctx.strokeStyle = C.inkSoft;
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(L, 0);
    ctx.stroke();
    ctx.restore();
    goldDot(ctx, x, y, 2.4);
  },
  // trefoil leaves on little stalks, a round clover head
  clover(ctx, s, o) {
    const st = sprigStem(ctx, s, o, 0.9, 2.6);
    const a = st.at(0.3);
    const b = st.at(0.62);
    stalk(ctx, a.x, a.y, 10, a.a - 1.05, (x, y, ang) => trefoil(ctx, x, y, 6.2, ang, SPRIG_C.leaf));
    stalk(ctx, b.x, b.y, 7, b.a + 1.0, (x, y, ang) => trefoil(ctx, x, y, 4.8, ang, SPRIG_C.light));
    const c = st.at(0.8);
    tendril(ctx, c.x, c.y, o.curl, 5.5);
    const { x, y } = st.end;
    blade(ctx, x, y + 2, 7, -2.4, SPRIG_C.light, 0.5, false);
    blade(ctx, x, y + 2, 7, -0.7, SPRIG_C.light, 0.5, false);
    for (let i = 0; i < 9; i++) {
      const a2 = i * 2.4;
      const r = i ? 3.6 + (i % 3) * 1.2 : 0;
      dot(ctx, x + Math.cos(a2) * r, y + 9 + Math.sin(a2) * r * 0.9, 2.6, i % 4 ? C.rubric : "#b8483a");
    }
  },
  // a lobed oak leaf and an acorn: gilded nut, brown cup
  oak(ctx, s, o) {
    const st = sprigStem(ctx, s, o, 0.88);
    const a = st.at(0.3);
    const b = st.at(0.62);
    oakLeaf(ctx, a.x, a.y, 30, a.a - 0.85, SPRIG_C.leaf);
    oakLeaf(ctx, b.x, b.y, 17, b.a + 1.05, SPRIG_C.light);
    const { x, y } = st.end;
    const cx = x + 1.5 * o.curl;
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(cx, y + 14, 5.8, 8.5, 0.08 * o.curl, 0, Math.PI * 2);
    ctx.fillStyle = goldGradient(ctx, cx - 6, y + 5, 12, 18);
    ctx.fill();
    ctx.strokeStyle = C.goldDark;
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(cx, y + 7.5, 7.4, 4.6, 0, 0, Math.PI * 2);
    ctx.fillStyle = C.inkSoft;
    ctx.fill();
    for (const [dx, dy] of [[-3.4, 7.2], [0, 6], [3.4, 7.2], [-1.7, 9], [1.7, 9]]) dot(ctx, cx + dx, y + dy, 0.9, "rgba(241,215,143,0.7)");
    ctx.restore();
    dot(ctx, cx, y + 22.8, 1.2, C.inkSoft);
    ctx.strokeStyle = C.inkSoft;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(cx, y + 3.5);
    ctx.stroke();
  },
  // reed blades and a hanging reed mace
  reed(ctx, s, o) {
    const st = sprigStem(ctx, s, o, 0.92, 2.6, true);
    const a = st.at(0.22);
    const b = st.at(0.46);
    blade(ctx, a.x, a.y, 36, a.a - 0.15, SPRIG_C.leaf, 0.13);
    blade(ctx, b.x, b.y, 28, b.a + 0.55, SPRIG_C.light, 0.13, false);
    const e = st.end;
    ctx.save();
    ctx.translate(e.x, e.y);
    ctx.rotate(e.a);
    ctx.fillStyle = C.inkSoft;
    roundRect(ctx, 3, -3.6, 24, 7.2, 3.6);
    ctx.fill();
    ctx.strokeStyle = "rgba(201,154,63,0.7)";
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    ctx.moveTo(7, -1.8);
    ctx.lineTo(23, -1.8);
    ctx.stroke();
    ctx.strokeStyle = C.inkSoft;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(27, 0);
    ctx.lineTo(36, 0.6 * o.curl);
    ctx.stroke();
    ctx.restore();
  },
  // small leaflets in threes and a red hip with its dark crown
  rosehip(ctx, s, o) {
    const st = sprigStem(ctx, s, o, 0.86, 2.6);
    const leaflets = (len, r, color) => (x, y, ang) => {
      for (const k of [-1, 1]) blade(ctx, x - Math.cos(ang) * len * 0.45, y - Math.sin(ang) * len * 0.45, r, ang + k * 0.95, color, 0.55, false);
      blade(ctx, x, y, r * 1.1, ang, color, 0.55, false);
    };
    const a = st.at(0.3);
    const b = st.at(0.62);
    stalk(ctx, a.x, a.y, 13, a.a - 0.95, leaflets(13, 8.5, SPRIG_C.leaf));
    stalk(ctx, b.x, b.y, 9, b.a + 1.0, leaflets(9, 6.5, SPRIG_C.light));
    const { x, y } = st.end;
    ctx.strokeStyle = SPRIG_C.leaf;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + o.curl, y + 4);
    ctx.stroke();
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(x + o.curl, y + 13, 6.4, 9.4, 0.1 * o.curl, 0, Math.PI * 2);
    ctx.fillStyle = C.rubric;
    ctx.fill();
    ctx.restore();
    dot(ctx, x + o.curl - 2.2, y + 9.5, 1.7, "rgba(241,215,143,0.75)");
    ctx.strokeStyle = C.inkSoft;
    ctx.lineWidth = 1.1;
    for (const k of [-2, -1, 0, 1, 2]) {
      ctx.beginPath();
      ctx.moveTo(x + o.curl, y + 21.5);
      ctx.lineTo(x + o.curl + k * 2.2, y + 26 - Math.abs(k) * 0.8);
      ctx.stroke();
    }
  },
  // a wild-strawberry runner: a trefoil leaf, a tendril and one berry under its green calyx
  strawberry(ctx, s, o) {
    const st = sprigStem(ctx, s, o, 0.84, 2.3);
    const a = st.at(0.32);
    stalk(ctx, a.x, a.y, 10, a.a - 1.0, (x, y, ang) => {
      for (const k of [-0.85, 0, 0.85]) blade(ctx, x, y, 11, ang + k, SPRIG_C.leaf, 0.55);
    });
    const c = st.at(0.6);
    tendril(ctx, c.x, c.y, -o.curl, 6);
    const { x, y } = st.end;
    const cx = x + 1.5 * o.curl;
    ctx.beginPath();
    ctx.moveTo(cx - 7, y + 6);
    ctx.quadraticCurveTo(cx - 8, y + 14, cx, y + 20);
    ctx.quadraticCurveTo(cx + 8, y + 14, cx + 7, y + 6);
    ctx.quadraticCurveTo(cx, y + 2.5, cx - 7, y + 6);
    ctx.fillStyle = C.rubric;
    ctx.fill();
    for (const [dx, dy] of [[-3, 9], [2, 8.5], [-1, 12.5], [3.4, 12.5], [0.5, 16]]) dot(ctx, cx + dx, y + dy, 0.9, C.goldLight);
    for (let k = 0; k < 5; k++) blade(ctx, cx, y + 5, 6, -Math.PI + (k * Math.PI) / 4, SPRIG_C.light, 0.45, false);
  },
  // a round hazel leaf and two catkins in gold
  hazel(ctx, s, o) {
    const st = sprigStem(ctx, s, o, 0.78);
    const a = st.at(0.3);
    const b = st.at(0.58);
    blade(ctx, a.x, a.y, 24, a.a - 0.9, SPRIG_C.leaf, 0.62);
    blade(ctx, b.x, b.y, 9, b.a + 1.0, SPRIG_C.light, 0.5, false);
    const { x, y } = st.end;
    for (const [dx, len, sway] of [[-3, 27, -1], [4, 20, 1]]) {
      const x0 = x + dx;
      ctx.strokeStyle = SPRIG_C.leaf;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x0, y + 3);
      ctx.stroke();
      for (let i = 0; i < 7; i++) {
        const t = i / 6;
        const px = x0 + sway * o.curl * 3.5 * Math.sin(t * 1.4);
        dot(ctx, px, y + 4 + t * len, 3.1 - t * 1.1 + 0.7, C.goldDark);
        dot(ctx, px, y + 4 + t * len, 3.1 - t * 1.1, i % 2 ? C.gold : "#d9b05a");
      }
    }
  },
  // a nodding columbine: blue petals, spurs curling back, a few gold stamens
  columbine(ctx, s, o) {
    const st = sprigStem(ctx, s, o, 0.8);
    const a = st.at(0.32);
    stalk(ctx, a.x, a.y, 8, a.a - 1.0, (x, y, ang) => {
      for (const k of [-0.9, 0, 0.9]) blade(ctx, x, y, 9, ang + k, SPRIG_C.light, 0.7, false);
    });
    const { x, y } = st.end;
    const fx = x + 6 * o.curl;
    const fy = y + 11;
    ctx.strokeStyle = SPRIG_C.leaf;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + 7 * o.curl, y + 2, fx, fy);
    ctx.stroke();
    // the spurs, short and hooked back over the bonnet of petals
    ctx.strokeStyle = C.blue;
    ctx.lineWidth = 1.3;
    for (const k of [-1, 0, 1]) {
      ctx.beginPath();
      ctx.moveTo(fx + k * 2.5, fy + 3);
      ctx.quadraticCurveTo(fx + k * 5, fy - 3, fx + k * 4 + 2.5 * o.curl, fy - 4.5);
      ctx.stroke();
      dot(ctx, fx + k * 4 + 2.5 * o.curl, fy - 4.5, 1.2, C.blue);
    }
    for (const k of [-0.55, -0.28, 0, 0.28, 0.55]) blade(ctx, fx, fy, k ? 13 : 15, Math.PI / 2 + k, C.blue, 0.38, false);
    ctx.strokeStyle = C.goldLight;
    ctx.lineWidth = 1;
    for (const k of [-1.5, 0, 1.5]) {
      ctx.beginPath();
      ctx.moveTo(fx, fy + 10);
      ctx.lineTo(fx + k, fy + 18);
      ctx.stroke();
    }
  },
};

// Which sprig each initial carries. Per tale, page by page: the one least used so far of the
// tale's set (its own motifs first), never one of the three before it, nor the plant the page's
// own tailpiece already shows; curl, swing and length vary per page too. The same page always
// gets the same sprig, whatever the language or the choices. The riffle's Latin pages draw from
// the whole family, one per fable.
const SPRIG_SETS = {
  "dragon-bridge": { own: ["reed", "oak", "rosehip"], more: ["strawberry", "hazel", "columbine", "vine"] },
  "moonhill-bell": { own: ["pear", "feather", "clover"], more: ["strawberry", "hazel", "columbine", "vine"] },
};
const ALL_SPRIGS = Object.keys(SPRIGS);
const strHash = (str) => {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619);
  return h >>> 0;
};
function sprigSequence(key, own, more, tails) {
  const set = [...own, ...more];
  const used = {};
  const names = [];
  return tails.map((tail, i) => {
    let free = set.filter((v) => !names.slice(-3).includes(v) && !(tail && tail.includes(v)));
    if (!free.length) free = set.filter((v) => v !== names[names.length - 1]);
    const score = (v) => (used[v] || 0) - (own.includes(v) ? 0.5 : 0);
    const best = Math.min(...free.map(score));
    const pool = free.filter((v) => score(v) === best);
    const h = strHash(`${key}|${i}`);
    const kind = pool[h % pool.length];
    used[kind] = (used[kind] || 0) + 1;
    names.push(kind);
    return { kind, bend: h & 0x100 ? 1 : -1, curl: h & 0x200 ? 1 : -1, len: 0.88 + ((h >>> 12) % 17) / 100, gold: (h & 0xc00) === 0xc00 };
  });
}
const sprigCache = new Map();
// The sprig of a tale's page (its spreads give every page's tailpiece).
function sprigOf(taleId, spreads, page) {
  if (!sprigCache.has(taleId)) {
    const set = SPRIG_SETS[taleId] || { own: [], more: ALL_SPRIGS };
    const pages = spreads.filter((s) => s.page > 0);
    const seq = sprigSequence(taleId, set.own, set.more, pages.map((s) => normaliseImage(s.tailpiece)?.src || null));
    sprigCache.set(taleId, new Map(pages.map((s, i) => [s.page, seq[i]])));
  }
  return sprigCache.get(taleId).get(page) || null;
}
const fillerSprigs = sprigSequence("filler", [], ALL_SPRIGS, LATIN.map(() => null));
const DEFAULT_SPRIG = { kind: "vine", bend: 1, curl: 1, len: 1, gold: false };

function drawSprig(ctx, x, y, size, vineSide, sprig) {
  const o = sprig || DEFAULT_SPRIG;
  ctx.save();
  // the sprig's own frame: out into the margin, whichever side the initial stands
  ctx.translate(vineSide < 0 ? x : x + size, y);
  ctx.scale(vineSide < 0 ? -1 : 1, 1);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  (SPRIGS[o.kind] || SPRIGS.vine)(ctx, size, o);
  ctx.restore();
}

// Gilded drop initial: gold-leaf square, ink frame, red letter, a sprig trailing into the margin
// (`sprig`, see sprigOf).
function dropInitial(ctx, letter, x, y, size, vineSide, sprig = null) {
  ctx.save();
  // the sprig first, so the box sits on top of it
  drawSprig(ctx, x, y, size, vineSide, sprig);

  // gold-leaf ground
  ctx.shadowColor = "rgba(60,30,10,0.25)";
  ctx.shadowBlur = 6;
  ctx.shadowOffsetY = 2;
  ctx.fillStyle = goldGradient(ctx, x, y, size, size);
  ctx.fillRect(x, y, size, size);
  ctx.shadowColor = "transparent";
  // punched dots along the inside of the frame
  ctx.fillStyle = "rgba(255,245,200,0.55)";
  for (let i = 0; i < 9; i++) {
    const t = 10 + (i / 8) * (size - 20);
    dot(ctx, x + t, y + 9, 1.8, ctx.fillStyle);
    dot(ctx, x + t, y + size - 9, 1.8, ctx.fillStyle);
    dot(ctx, x + 9, y + t, 1.8, ctx.fillStyle);
    dot(ctx, x + size - 9, y + t, 1.8, ctx.fillStyle);
  }
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 3;
  ctx.strokeRect(x, y, size, size);
  ctx.lineWidth = 1.2;
  ctx.strokeRect(x + 15, y + 15, size - 30, size - 30);
  // inner blue field with white filigree
  ctx.fillStyle = C.blue;
  ctx.fillRect(x + 16, y + 16, size - 32, size - 32);
  ctx.strokeStyle = "rgba(235,230,215,0.55)";
  ctx.lineWidth = 1.4;
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    const r = (size - 32) * (0.18 + i * 0.13);
    ctx.arc(x + size / 2 + (i - 1) * 6, y + size / 2 + (1 - i) * 5, r, 0.4 + i, 2.6 + i);
    ctx.stroke();
  }
  // letter
  ctx.font = font(600, size * 0.86);
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  const m = ctx.measureText(letter);
  const asc = m.actualBoundingBoxAscent || size * 0.6;
  const desc = m.actualBoundingBoxDescent || 0;
  const by = y + size / 2 + (asc - desc) / 2;
  ctx.lineWidth = 7;
  ctx.strokeStyle = "#f3e2b5";
  ctx.strokeText(letter, x + size / 2, by);
  ctx.fillStyle = "#b3241a";
  ctx.fillText(letter, x + size / 2, by);
  ctx.restore();
}

// Wax seal with an embossed rosette. `sel` (0..1) warms the wax; while a choice is sealed the
// seal is pressed into the page (`press`, 0..1, sits lower and casts a tighter shadow) and its
// gold ring is traced round (`sweep`) or fades back (`ring`). `glow` (0..1) is a seal still
// waiting to be chosen when the reader tries to turn on: its wax warms, light catches it and a
// gold ring breathes round it; `swell` lets it rise a touch to meet the eye.
function waxSeal(ctx, cx, cy, r0, { sel, alpha = 1, seed, press = 0, sweep = 1, ring = sel, glow = 0, swell = 0 }) {
  ctx.save();
  ctx.globalAlpha = alpha;
  sel = Math.max(sel, glow);
  const r = r0 * (1 - 0.06 * press + 0.07 * swell);
  const pts = 22;
  ctx.beginPath();
  for (let i = 0; i <= pts; i++) {
    const a = (i / pts) * Math.PI * 2;
    const rr = r * (1 + 0.07 * Math.sin(a * 3 + seed) + 0.04 * Math.sin(a * 7 + seed * 2));
    const px = cx + Math.cos(a) * rr;
    const py = cy + Math.sin(a) * rr;
    i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
  }
  ctx.closePath();
  ctx.shadowColor = "rgba(50,10,5,0.45)";
  ctx.shadowBlur = 10 - 6 * press + 4 * swell;
  ctx.shadowOffsetY = 4 - 3 * press + 2 * swell;
  const g = ctx.createRadialGradient(cx - r * 0.35, cy - r * 0.4, r * 0.1, cx, cy, r * 1.1);
  g.addColorStop(0, mix(rgb("#c8402e"), rgb("#e0503a"), sel));
  g.addColorStop(0.6, mix(rgb("#962518"), rgb("#a92a1c"), sel));
  g.addColorStop(1, "#5e140c");
  ctx.fillStyle = g;
  ctx.fill();
  ctx.shadowColor = "transparent";
  // pressed ring
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.68, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(60,8,4,0.55)";
  ctx.lineWidth = r * 0.07;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx + r * 0.03, cy + r * 0.04, r * 0.68, Math.PI * 1.05, Math.PI * 1.75);
  ctx.strokeStyle = "rgba(255,170,140,0.45)";
  ctx.lineWidth = r * 0.04;
  ctx.stroke();
  // rosette
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + 0.3;
    ctx.beginPath();
    ctx.ellipse(cx + Math.cos(a) * r * 0.27, cy + Math.sin(a) * r * 0.27, r * 0.2, r * 0.1, a, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(70,8,4,0.45)";
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(cx + Math.cos(a) * r * 0.27 - 1, cy + Math.sin(a) * r * 0.27 - 1.5, r * 0.16, r * 0.06, a, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,160,130,0.35)";
    ctx.fill();
  }
  dot(ctx, cx, cy, r * 0.1, mix([255, 190, 160, 0.6], rgb(C.goldLight), sel));
  // glint
  ctx.beginPath();
  ctx.ellipse(cx - r * 0.42, cy - r * 0.5, r * 0.2 * (1 + 0.25 * glow), r * 0.08, -0.6, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(255,235,220,${0.5 + 0.4 * glow})`;
  ctx.fill();
  if (glow > 0) {
    // the ring of gold, with candlelight caught round it
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r0 * 1.2, 0, Math.PI * 2);
    ctx.strokeStyle = goldGradient(ctx, cx - r0, cy - r0, r0 * 2, r0 * 2);
    ctx.shadowColor = "rgba(255,200,110,0.7)";
    ctx.shadowBlur = 14 * glow;
    ctx.globalAlpha = alpha * glow;
    ctx.lineWidth = 4.5;
    ctx.stroke();
    ctx.restore();
  }
  if (ring > 0 && sweep > 0) {
    ctx.beginPath();
    ctx.arc(cx, cy, r0 * 1.2, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * sweep);
    ctx.strokeStyle = goldGradient(ctx, cx - r0, cy - r0, r0 * 2, r0 * 2);
    ctx.globalAlpha = alpha * ring;
    ctx.lineWidth = 5;
    ctx.stroke();
  }
  ctx.restore();
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// ---------- images ----------

function drawCover(ctx, img, x, y, w, h, focus, crop) {
  const iw = img.naturalWidth || img.width;
  const ih = img.naturalHeight || img.height;
  const cx0 = crop[0] * iw;
  const cy0 = crop[1] * ih;
  const cw = iw * (1 - crop[0] - crop[2]);
  const ch = ih * (1 - crop[1] - crop[3]);
  const s = Math.max(w / cw, h / ch);
  const sw = w / s;
  const sh = h / s;
  ctx.drawImage(img, cx0 + (cw - sw) * focus[0], cy0 + (ch - sh) * focus[1], sw, sh, x, y, w, h);
}

// A picture still on its way (main.js streams them in behind the veil): a soft wash of the
// paper's own tone in the frame the picture will fill, a small fleuron at its heart. The page is
// drawn again, with the picture, as soon as it arrives; nothing else on it moves.
function placeholder(ctx, x, y, w, h) {
  ctx.save();
  const r = Math.hypot(w, h) / 2;
  const wash = ctx.createRadialGradient(x + w / 2, y + h / 2, 0, x + w / 2, y + h / 2, r);
  wash.addColorStop(0, "rgba(150,110,60,0.05)");
  wash.addColorStop(1, "rgba(120,85,45,0.16)");
  ctx.fillStyle = wash;
  ctx.fillRect(x, y, w, h);
  ctx.font = font(400, Math.round(Math.min(w, h) * 0.12));
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = C.rubric;
  ctx.globalAlpha = 0.26;
  ctx.fillText("❧", x + w / 2, y + h / 2);
  ctx.restore();
}

// Paint sits *in* the parchment: a whisper of the paper over the picture and a soft inner edge.
function settleIntoPaper(ctx, parchment, x, y, w, h) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  ctx.globalCompositeOperation = "multiply";
  ctx.globalAlpha = 0.22;
  ctx.drawImage(parchment, x, y, w, h);
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = "source-over";
  const e = Math.min(w, h) * 0.06;
  for (const [gx, gy, gw, gh, x0, y0, x1, y1] of [
    [x, y, w, e, 0, y, 0, y + e],
    [x, y + h - e, w, e, 0, y + h, 0, y + h - e],
    [x, y, e, h, x, 0, x + e, 0],
    [x + w - e, y, e, h, x + w, 0, x + w - e, 0],
  ]) {
    const g = ctx.createLinearGradient(x0, y0, x1, y1);
    g.addColorStop(0, "rgba(60,35,15,0.28)");
    g.addColorStop(1, "rgba(60,35,15,0)");
    ctx.fillStyle = g;
    ctx.fillRect(gx, gy, gw, gh);
  }
  ctx.restore();
}

function frameFull(ctx, x, y, w, h) {
  ctx.save();
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 2;
  ctx.strokeRect(x - 1, y - 1, w + 2, h + 2);
  ctx.strokeStyle = goldGradient(ctx, x, y, w, h);
  ctx.lineWidth = 7;
  ctx.strokeRect(x - 8, y - 8, w + 16, h + 16);
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 1.6;
  ctx.strokeRect(x - 12.5, y - 12.5, w + 25, h + 25);
  ctx.strokeStyle = C.rubric;
  ctx.lineWidth = 1.2;
  ctx.strokeRect(x - 20, y - 20, w + 40, h + 40);
  for (const [cx, cy] of [[x - 20, y - 20], [x + w + 20, y - 20], [x - 20, y + h + 20], [x + w + 20, y + h + 20]]) {
    dot(ctx, cx, cy, 7, C.gold);
    dot(ctx, cx, cy, 2.5, C.rubric);
  }
  ctx.restore();
}

function framePlate(ctx, x, y, w, h) {
  ctx.save();
  const b = 16;
  ctx.fillStyle = goldGradient(ctx, x - b, y - b, w + 2 * b, h + 2 * b);
  ctx.beginPath();
  ctx.rect(x - b, y - b, w + 2 * b, h + 2 * b);
  ctx.rect(x, y, w, h);
  ctx.fill("evenodd");
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 2.2;
  ctx.strokeRect(x - b, y - b, w + 2 * b, h + 2 * b);
  ctx.strokeRect(x, y, w, h);
  ctx.strokeStyle = C.rubric;
  ctx.lineWidth = 2;
  ctx.strokeRect(x - b - 9, y - b - 9, w + 2 * b + 18, h + 2 * b + 18);
  // corner blocks: blue squares with a gold quatrefoil
  const s = 34;
  for (const [cx, cy] of [[x - b / 2, y - b / 2], [x + w + b / 2, y - b / 2], [x - b / 2, y + h + b / 2], [x + w + b / 2, y + h + b / 2]]) {
    ctx.fillStyle = C.blue;
    ctx.fillRect(cx - s / 2, cy - s / 2, s, s);
    ctx.strokeStyle = C.ink;
    ctx.lineWidth = 1.8;
    ctx.strokeRect(cx - s / 2, cy - s / 2, s, s);
    for (let i = 0; i < 4; i++) {
      const a = (i * Math.PI) / 2;
      dot(ctx, cx + Math.cos(a) * 6, cy + Math.sin(a) * 6, 5, C.goldLight);
    }
    dot(ctx, cx, cy, 3, C.rubric);
  }
  ctx.restore();
}

// For art that carries its own painted frame line: a soft shadow, a hairline rule and corner dots.
function framePainted(ctx, x, y, w, h) {
  ctx.save();
  ctx.strokeStyle = "rgba(42,26,15,0.85)";
  ctx.lineWidth = 2;
  ctx.strokeRect(x - 1, y - 1, w + 2, h + 2);
  ctx.strokeStyle = C.rubric;
  ctx.globalAlpha = 0.8;
  ctx.lineWidth = 1.4;
  ctx.strokeRect(x - 14, y - 14, w + 28, h + 28);
  ctx.globalAlpha = 1;
  for (const [cx, cy] of [[x - 14, y - 14], [x + w + 14, y - 14], [x - 14, y + h + 14], [x + w + 14, y + h + 14]]) {
    dot(ctx, cx, cy, 6, C.gold);
    dot(ctx, cx, cy, 2.2, C.rubric);
  }
  ctx.restore();
}

// ---------- text blocks ----------
// A block knows its height for a width and draws itself at (x, y).

function paragraphBlock(text, opts) {
  const { size, italic = false, color = C.ink, drop = false, vineSide = -1, sprig = null, lh = 1.42 } = opts;
  let cache = null;
  const layout = (ctx, width) => {
    if (cache && cache.width === width) return cache;
    ctx.font = font(400, size, italic);
    const lineH = size * lh;
    let body = glueOrphans(text);
    let initial = null;
    let indent = 0;
    let boxSize = 0;
    if (drop) {
      const chars = Array.from(body);
      initial = chars[0].toUpperCase();
      body = chars.slice(1).join("");
      boxSize = Math.round(2 * lineH + size * 0.72);
      indent = boxSize + size * 0.42;
    }
    const lines = wrap(ctx, body, (i) => (drop && i < 3 ? width - indent : width));
    const height = Math.max(lines.length, drop ? 3 : 0) * lineH;
    cache = { width, lines, lineH, initial, indent, boxSize, height };
    return cache;
  };
  return {
    kind: "text",
    measure: (ctx, width) => layout(ctx, width).height,
    draw(ctx, x, y, width) {
      const L = layout(ctx, width);
      ctx.save();
      ctx.font = font(400, size, italic);
      ctx.fillStyle = color;
      ctx.textAlign = "left";
      ctx.textBaseline = "alphabetic";
      const ascent = size * 0.78;
      L.lines.forEach((line, i) => {
        const dx = L.initial && i < 3 ? L.indent : 0;
        ctx.fillText(line, x + dx, y + ascent + i * L.lineH);
      });
      ctx.restore();
      if (L.initial) dropInitial(ctx, L.initial, x, y + ascent - size * 0.7, L.boxSize, vineSide, sprig);
    },
  };
}

function headingBlock(text, size) {
  let cache = null;
  const layout = (ctx, width) => {
    if (cache && cache.width === width) return cache;
    ctx.font = font(600, size);
    const lines = wrap(ctx, glueOrphans(text), () => width);
    cache = { width, lines, height: lines.length * size * 1.12 };
    return cache;
  };
  return {
    kind: "text",
    measure: (ctx, width) => layout(ctx, width).height,
    draw(ctx, x, y, width) {
      const L = layout(ctx, width);
      ctx.save();
      ctx.font = font(600, size);
      ctx.fillStyle = C.rubric;
      ctx.textBaseline = "alphabetic";
      L.lines.forEach((line, i) => ctx.fillText(line, x, y + size * 0.82 + i * size * 1.12));
      ctx.restore();
    },
  };
}

// Choice tabs with wax seals. `reserve` is the longest response: its room (or that of whichever
// response takes the most lines) is kept under the tabs, so choosing never reflows the page.
// `anim` ({ fresh, capture }) is a choice being made:
// the page is drawn once without the block, and `anim.draw(g, p)` then paints only the block at
// progress p (0..1) – the chosen seal pressed in, a gold wash spreading from it across its tab,
// its ring traced round, the other seal dimming and the response written in. With
// `anim.glint` nothing is chosen: the reader tried to turn on past the choice, and the seals
// glow once, one after another (`anim.calm`: reduced motion, they only glow, never swell); with a
// choice made, only its seal glows: the reader pressed it again, the choice already sealed.
// `anim.levels` ({ id: 0..1 }, drawn at p = 1) is the pointer resting on seals (main.js eases it).
// `column`: the page is read by its text column on a phone, its print a step larger (PHONE_LIFT)
// and its rows taller.
function choicesBlock({ options, selectedId, hint, hits, pageId, response, reserve = null, anim = null, column = false }) {
  const size = typeSize("label", column);
  const rowH = Math.round(size * 2.5);
  const gap = Math.round(size * 0.45);
  const sealR = rowH * 0.36;
  const hintSize = typeSize("small", column);
  let cache = null;
  const layout = (ctx, width) => {
    if (cache && cache.width === width) return cache;
    ctx.font = font(SMALL_WEIGHT, hintSize, true);
    const hintLines = hint ? wrap(ctx, hint, () => width) : [];
    const lines = (text) => (text ? wrap(ctx, glueOrphans(text), () => width - 20) : []);
    const respLines = lines(response);
    const respRows = Math.max(respLines.length, lines(reserve).length, ...options.map((o) => lines(o.response).length));
    ctx.font = font(600, size);
    // a label has its tab from past the seal (see paint) to the tab's end, kept as far from the end
    // as from the seal
    const labelLines = options.map((o) => wrap(ctx, glueOrphans(o.label), () => width - 2 * sealR - 60));
    const rows = labelLines.map((ls) => Math.max(rowH, ls.length * size * 1.18 + size * 0.9));
    const height = hintLines.length * hintSize * 1.35 + (hintLines.length ? 16 : 0) + rows.reduce((a, b) => a + b, 0) + gap * (options.length - 1) + (respRows ? 18 + respRows * hintSize * 1.35 : 0);
    cache = { width, hintLines, respLines, labelLines, rows, height };
    return cache;
  };
  const PLAIN = { fill: "rgba(255,247,226,0.6)", stroke: [150, 110, 50, 0.85] };
  const GOLD = { fill: "rgba(246,224,160,0.75)", clear: "rgba(246,224,160,0)", stroke: rgb(C.goldDark) };
  // p = 1 is the resting state; a static page is simply the end of the animation
  const paint = (ctx, x, y, width, p, hits) => {
    const L = layout(ctx, width);
    const k = anim ? p : 1;
    const e = easeOut(k);
    let cy = y;
    ctx.save();
    ctx.font = font(SMALL_WEIGHT, hintSize, true);
    ctx.fillStyle = C.inkHint;
    for (const line of L.hintLines) {
      ctx.fillText(line, x, cy + hintSize * 0.8);
      cy += hintSize * 1.35;
    }
    if (L.hintLines.length) cy += 16;
    options.forEach((o, i) => {
      const h = L.rows[i];
      const now = selectedId === o.id;
      const was = anim?.fresh ? false : now;
      // how chosen the tab looks: the new choice washes in from its seal
      const sel = now ? (was ? 1 : easeOut(clamp01(k / 0.75))) : 0;
      const dimTo = selectedId && !now ? 1 : 0;
      const dimFrom = anim?.fresh ? 0 : dimTo;
      // under the pointer (desktop, a choice still to be made): a seal warms a little
      const hover = anim?.levels && !now ? easeOut(anim.levels[o.id] || 0) : 0;
      const dim = dimFrom + (dimTo - dimFrom) * e;
      // a seal still to be chosen: each glows in turn, a little after the one above it (a choice
      // made: only its own seal, at once)
      const stagger = 0.16;
      const q = anim?.glint && (selectedId ? now : !now) ? clamp01((k - stagger * (selectedId ? 0 : i)) / (1 - stagger * (options.length - 1))) : 0;
      const glint = Math.pow(Math.sin(Math.PI * q), 1.5);
      const glow = Math.max(glint, 0.55 * hover);
      const bx = x + sealR + 6;
      const tw = width - sealR - 8;
      // vellum tab with gold edge
      ctx.save();
      ctx.globalAlpha = 1 - 0.45 * dim;
      roundRect(ctx, bx, cy + 6, tw, h - 12, 18);
      ctx.fillStyle = PLAIN.fill;
      ctx.fill();
      if (sel > 0) {
        ctx.save();
        if (now && sel < 1) {
          // gold leaf laid from the seal rightwards, its leading edge soft
          ctx.clip();
          const feather = 90;
          const edge = bx - sealR + (tw + sealR + feather) * sel;
          const g = ctx.createLinearGradient(edge - feather, 0, edge, 0);
          g.addColorStop(0, GOLD.fill);
          g.addColorStop(1, GOLD.clear);
          ctx.fillStyle = g;
          ctx.fillRect(bx, cy, Math.max(0, edge - bx), h);
          // light catching the fresh leaf just behind its edge, gone as it settles
          const sheen = ctx.createLinearGradient(edge - feather * 2, 0, edge, 0);
          sheen.addColorStop(0, "rgba(255,240,190,0)");
          sheen.addColorStop(0.6, `rgba(255,240,190,${0.55 * (1 - sel)})`);
          sheen.addColorStop(1, "rgba(255,240,190,0)");
          ctx.fillStyle = sheen;
          ctx.fillRect(Math.max(bx, edge - feather * 2), cy, feather * 2, h);
        } else {
          ctx.globalAlpha *= sel;
          ctx.fillStyle = GOLD.fill;
          ctx.fill();
        }
        ctx.restore();
      }
      ctx.lineWidth = 2.2 + 1.3 * sel;
      ctx.strokeStyle = mix(PLAIN.stroke, GOLD.stroke, Math.max(sel, 0.6 * glow));
      ctx.stroke();
      ctx.font = font(600, size);
      ctx.fillStyle = C.rubric;
      const tx = bx + sealR + 26;
      const textH = L.labelLines[i].length * size * 1.18;
      L.labelLines[i].forEach((line, j) => ctx.fillText(line, tx, cy + (h - textH) / 2 + size * 0.86 + j * size * 1.18));
      ctx.restore();
      waxSeal(ctx, x + sealR + 6, cy + h / 2, sealR, {
        sel,
        alpha: 1 - 0.5 * dim,
        seed: i * 1.7 + pageId,
        // pressed in quickly and let go, the ring traced round once the wax has taken
        press: now && !was ? Math.sin(Math.PI * clamp01(k / 0.55)) : 0,
        sweep: now && !was ? easeOut(clamp01((k - 0.12) / 0.8)) : 1,
        ring: now ? 1 : 0,
        glow,
        swell: anim?.calm ? 0 : glint,
      });
      // a row answers a touch half way across the gap either side of it: two rows meet in the
      // middle of the gap between them, and no strip there lets a tap through to the page (in
      // portrait, a turn: refused before a choice, its cue lighting the first seal first)
      hits.push({ x, y: cy - gap / 2, w: width, h: h + gap, action: { type: "choice", id: o.id } });
      cy += h + gap;
    });
    if (L.respLines.length) {
      cy += 18 - gap;
      ctx.font = font(SMALL_WEIGHT, hintSize, true);
      // the response is written in after the seal, line after line
      const write = anim?.fresh ? easeOut(clamp01((k - 0.22) / 0.78)) * L.respLines.length : L.respLines.length;
      L.respLines.forEach((line, j) => inkText(ctx, line, x + 20, cy + hintSize * 0.8 + j * hintSize * 1.35, clamp01(write - j), C.inkHint));
    }
    ctx.restore();
  };
  return {
    kind: "choices",
    measure: (ctx, width) => layout(ctx, width).height,
    draw(ctx, x, y, width) {
      if (anim?.capture) {
        // leave the block out of this page; the animation paints it frame by frame (no hits)
        anim.rect = { x: x - 40, y: y - 24, w: width + 80, h: layout(ctx, width).height + 56 };
        anim.draw = (g, p) => paint(g, x, y, width, p, []);
        return;
      }
      paint(ctx, x, y, width, 1, hits);
    },
  };
}

// The plate of the clasp as a path of its own (to fill, clip and band without disturbing the
// context's path): a rounded oblong, raised `dy` for the light along its top or the shade below.
function platePath(x, y, w, h, r) {
  const p = new Path2D();
  p.moveTo(x + r, y);
  p.arcTo(x + w, y, x + w, y + h, r);
  p.arcTo(x + w, y + h, x, y + h, r);
  p.arcTo(x, y + h, x, y, r);
  p.arcTo(x, y, x + w, y, r);
  p.closePath();
  return p;
}

// The last page closes with a clasp that starts the tale again – not a choice, so not a seal: a
// small plate of gold leaf, a sibling of the language label on the desk (its proportions and
// corners, the same leaf, lit along the top and shaded at the foot, its words in the book's
// hand), centred under the text between two fine rules. While the page lies still the book raises
// a real button over it (main.js, "the clasp"), drawn to this same measure; the print is what
// turns with the leaf.
function claspBlock({ label, column, hits }) {
  const fontSize = typeSize("small", column);
  const h = Math.round(fontSize * 2.5);
  const r = h * 0.325; // the language plaque's corner: 13 px on its 40 px height
  const track = fontSize * 0.02;
  let cache = null;
  const layout = (ctx) => {
    if (cache) return cache;
    ctx.font = font(600, fontSize);
    const widths = Array.from(label).map((ch) => ctx.measureText(ch).width);
    const textW = widths.reduce((a, b) => a + b, 0) + track * (widths.length - 1);
    // the words sit on the middle between their x-height and capitals: optically centred
    const cap = ctx.measureText("Z").actualBoundingBoxAscent || fontSize * 0.65;
    const xh = ctx.measureText("x").actualBoundingBoxAscent || fontSize * 0.42;
    cache = { widths, textW, w: Math.round(textW + h * 1.5), lift: (cap + xh) / 4 };
    return cache;
  };
  return {
    kind: "clasp",
    measure: () => h + 12, // the plate and its shadow
    draw(ctx, x, y, width) {
      const L = layout(ctx);
      const x0 = Math.round(x + (width - L.w) / 2);
      const cy = y + h / 2;
      ctx.save();
      // fine rubric rules running out from its ends, a gold dot at each end
      const rule = Math.min(96, (width - L.w) / 2 - 24);
      if (rule > 30) {
        ctx.strokeStyle = C.rubric;
        ctx.globalAlpha = 0.6;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(x0 - 14, cy);
        ctx.lineTo(x0 - 14 - rule, cy);
        ctx.moveTo(x0 + L.w + 14, cy);
        ctx.lineTo(x0 + L.w + 14 + rule, cy);
        ctx.stroke();
        ctx.globalAlpha = 1;
        dot(ctx, x0 - 22 - rule, cy, 4, C.gold);
        dot(ctx, x0 + L.w + 22 + rule, cy, 4, C.gold);
      }
      // the plate, standing off the paper on its shadow; gold leaf laid at 160° as on the desk label
      const plate = platePath(x0, y, L.w, h, r);
      const [dx, dy] = [Math.sin((160 * Math.PI) / 180), -Math.cos((160 * Math.PI) / 180)];
      const half = (Math.abs(L.w * dx) + Math.abs(h * dy)) / 2;
      const g = ctx.createLinearGradient(x0 + L.w / 2 - dx * half, cy - dy * half, x0 + L.w / 2 + dx * half, cy + dy * half);
      [["#f7e1a2", 0], ["#d7ac58", 0.42], ["#a8792f", 0.7], ["#e6c477", 1]].forEach(([c, at]) => g.addColorStop(at, c));
      ctx.shadowColor = "rgba(46,22,6,0.42)";
      ctx.shadowBlur = 8;
      ctx.shadowOffsetY = 3;
      ctx.fillStyle = g;
      ctx.fill(plate);
      ctx.shadowColor = "transparent";
      // lit along its top, shaded at its foot: the band between the plate and itself moved a little
      ctx.save();
      ctx.clip(plate);
      for (const [shift, color] of [[2, "rgba(255,248,220,0.6)"], [-2.4, "rgba(80,45,10,0.45)"]]) {
        const band = new Path2D();
        band.addPath(plate);
        band.addPath(platePath(x0, y + shift, L.w, h, r));
        ctx.fillStyle = color;
        ctx.fill(band, "evenodd");
      }
      ctx.restore();
      ctx.strokeStyle = "rgba(110,70,25,0.45)";
      ctx.lineWidth = 1.4;
      ctx.stroke(plate);
      // the words in ink, a light edge under them as if pressed into the leaf
      ctx.font = font(600, fontSize);
      ctx.textAlign = "left";
      ctx.textBaseline = "alphabetic";
      const by = cy + L.lift;
      let tx = x0 + (L.w - L.textW) / 2;
      Array.from(label).forEach((ch, i) => {
        ctx.fillStyle = "rgba(255,240,200,0.45)";
        ctx.fillText(ch, tx, by + 2);
        ctx.fillStyle = C.ink;
        ctx.fillText(ch, tx, by);
        tx += L.widths[i] + track;
      });
      ctx.restore();
      // `plate`: where the plate lies and how its words are set, for the raised button (main.js)
      const at = { x: x0, y, w: L.w, h, r, label, fontSize, track, textX: (L.w - L.textW) / 2, baseline: h / 2 + L.lift };
      hits.push({ x: x0 - 18, y: y - 18, w: L.w + 36, h: h + 36, action: { type: "choice", id: "restart" }, plate: at });
    },
  };
}

const longestResponse = (choice) => choice.options.reduce((a, o) => (o.response?.length > (a?.length || 0) ? o.response : a), "");

// A "Did you know" note as a gloss in a manuscript's margin: a rubric rule at its left, the
// words upright in the main ink (italic at this size read too faintly), on a soft, lighter patch
// of paper whose edges fade, under the title in red italic. Small print, a step under the labels.
function noteBlock(note, column) {
  const fs = typeSize("small", column);
  const lead = 1.38;
  const inner = 30;
  let cache = null;
  const layout = (ctx, width) => {
    if (cache && cache.width === width) return cache;
    ctx.font = font(400, fs);
    const lines = wrap(ctx, glueOrphans(note.body), () => width - inner * 2);
    cache = { width, lines, height: fs * 1.3 + 14 + lines.length * fs * lead + inner * 1.4 };
    return cache;
  };
  return {
    kind: "note",
    optional: true,
    measure: (ctx, width) => layout(ctx, width).height,
    draw(ctx, x, y, width) {
      const L = layout(ctx, width);
      ctx.save();
      // the lighter patch: a rounded shape drawn off the page and only its blurred shadow cast back
      // onto it, so the edge fades the same in every browser (no canvas filter); the shadow works
      // in device pixels, so the offset and blur follow the page's scale
      const k = ctx.getTransform().a || 1;
      const off = 4000;
      ctx.save();
      ctx.shadowColor = "rgba(255,249,231,0.4)";
      ctx.shadowBlur = 16 * k;
      ctx.shadowOffsetX = off * k;
      roundRect(ctx, x + 6 - off, y + 6, width - 12, L.height - 12, 16);
      ctx.fillStyle = "#000";
      ctx.fill();
      ctx.restore();
      // a light wash over it, brightest by the rule, fading towards the far corner
      const wash = ctx.createLinearGradient(x, y, x + width, y + L.height);
      wash.addColorStop(0, "rgba(255,251,238,0.24)");
      wash.addColorStop(1, "rgba(255,251,238,0.03)");
      roundRect(ctx, x, y, width, L.height, 16);
      ctx.fillStyle = wash;
      ctx.fill();
      // the rubric rule
      ctx.globalAlpha = 0.75;
      ctx.fillStyle = C.rubric;
      ctx.fillRect(x + 8, y + inner * 0.6, 3, L.height - inner * 1.2);
      ctx.globalAlpha = 1;
      ctx.font = font(600, fs * 0.95, true);
      ctx.fillStyle = C.rubric;
      ctx.fillText(note.title, x + inner, y + inner * 0.7 + fs * 0.85);
      ctx.font = font(400, fs);
      ctx.fillStyle = C.ink;
      L.lines.forEach((line, i) => ctx.fillText(line, x + inner, y + inner * 0.7 + fs * 1.3 + 14 + fs * 0.8 + i * fs * lead));
      ctx.restore();
    },
  };
}

function imageBlock(img, entry, { mode, maxH, aspect, parchment, large = false }) {
  // mode: "plate" (framed miniature) | "vignette" (transparent spot image, no frame);
  // large: a closing emblem alone on its page may take most of the column
  const box = (width) => {
    if (mode === "vignette") {
      const ar = img ? img.naturalWidth / img.naturalHeight : 1.4;
      let w = large ? Math.min(width * 0.94, 800) : Math.min(width * 0.82, 560);
      let h = w / ar;
      if (h > maxH) {
        h = maxH;
        w = h * ar;
      }
      return { w, h, pad: 10 };
    }
    let w = width - 12;
    let h = w / aspect;
    if (h > maxH) {
      h = maxH;
      w = h * aspect;
    }
    return { w, h, pad: PLATE.pad };
  };
  return {
    kind: "image",
    shrinkable: true,
    measure: (ctx, width) => {
      const b = box(width);
      return b.h + b.pad * 2;
    },
    draw(ctx, x, y, width) {
      const b = box(width);
      const ix = x + (width - b.w) / 2;
      const iy = y + b.pad;
      if (!img) {
        // still loading: the plate keeps its frame, so the page looks the same once it comes
        if (mode === "vignette") return;
        placeholder(ctx, ix, iy, b.w, b.h);
        settleIntoPaper(ctx, parchment, ix, iy, b.w, b.h);
        return entry?.frame === "painted" ? framePainted(ctx, ix, iy, b.w, b.h) : framePlate(ctx, ix, iy, b.w, b.h);
      }
      if (mode === "vignette") {
        ctx.save();
        ctx.globalCompositeOperation = "multiply";
        ctx.drawImage(img, ix, iy, b.w, b.h);
        ctx.restore();
        return;
      }
      ctx.save();
      ctx.imageSmoothingQuality = "high";
      drawCover(ctx, img, ix, iy, b.w, b.h, entry.focus, entry.crop);
      ctx.restore();
      settleIntoPaper(ctx, parchment, ix, iy, b.w, b.h);
      if (entry.frame === "painted") framePainted(ctx, ix, iy, b.w, b.h);
      else framePlate(ctx, ix, iy, b.w, b.h);
    },
  };
}

// ---------- page composition ----------

function runningHead(ctx, text, side) {
  ctx.save();
  ctx.font = font(CAPS_WEIGHT, typeSize("caps"));
  ctx.fillStyle = C.rubric;
  ctx.globalAlpha = 0.92;
  ctx.textAlign = "center";
  const label = text.toUpperCase().split("").join(" ");
  const cx = side === "left" ? (M.outer + PAGE_UNITS_W - M.gutter) / 2 : (M.gutter + PAGE_UNITS_W - M.outer) / 2;
  ctx.fillText(label, cx, 62);
  ctx.restore();
}

function folio(ctx, n, side) {
  if (!n) return;
  ctx.save();
  const cx = side === "left" ? (M.outer + PAGE_UNITS_W - M.gutter) / 2 : (M.gutter + PAGE_UNITS_W - M.outer) / 2;
  const y = PAGE_UNITS_H - 58;
  ctx.font = font(400, typeSize("caption"));
  ctx.fillStyle = C.inkSoft;
  ctx.textAlign = "center";
  ctx.fillText(String(n), cx, y + 9);
  for (const s of [-1, 1]) {
    ctx.beginPath();
    const dx = cx + s * 30;
    ctx.moveTo(dx, y - 5);
    ctx.lineTo(dx + 5, y);
    ctx.lineTo(dx, y + 5);
    ctx.lineTo(dx - 5, y);
    ctx.closePath();
    ctx.fillStyle = C.gold;
    ctx.fill();
  }
  ctx.restore();
}

function textBox(side) {
  const x = side === "left" ? M.outer : M.gutter;
  const w = PAGE_UNITS_W - M.outer - M.gutter;
  return { x, y: M.top, w, h: PAGE_UNITS_H - M.top - M.bottom };
}

// Where the blocks of the page being drawn went (drawPage returns them): { role, x, y, w, h } in
// page units, role = the block's `role` or its kind (text, image, choices, note, clasp), plus the
// parts compose places itself (picture, title, medallion, begin, epigraph). main.js frames them one by
// one when a phone held sideways reads a spread a part at a time (?mode=pan).
let REGIONS = null;
// Stacks blocks top-down (or centred) in a box.
function stack(ctx, blocks, box, { gap = 26, align = "top" } = {}) {
  const list = blocks.filter(Boolean);
  const hs = list.map((b) => b.measure(ctx, box.w));
  const gapOf = (b) => (b.gapBefore ?? gap);
  let total = hs.reduce((a, h, i) => a + h + (i ? gapOf(list[i]) : 0), 0);
  let y = box.y;
  if (align === "center") y = box.y + Math.max(0, (box.h - total) / 2);
  list.forEach((b, i) => {
    if (i) y += gapOf(list[i]);
    b.draw(ctx, box.x, y, box.w);
    REGIONS?.push({ role: b.role || b.kind, x: box.x, y, w: box.w, h: hs[i] });
    y += hs[i];
  });
  return total;
}

// A tale's epigraph in a language (tales.js), or null.
const epigraphOf = (taleId, lang) => talesList.find((t) => t.id === taleId)?.epigraph?.[lang] || null;
// Small capitals set with even tracking (in units), centred on cx; one fillText per letter.
function trackedWidth(ctx, text, track) {
  const chars = [...text];
  return chars.reduce((w, ch) => w + ctx.measureText(ch).width, 0) + track * (chars.length - 1);
}
function trackedText(ctx, text, cx, y, track) {
  const align = ctx.textAlign;
  ctx.textAlign = "left";
  let x = cx - trackedWidth(ctx, text, track) / 2;
  for (const ch of text) {
    ctx.fillText(ch, x, y);
    x += ctx.measureText(ch).width + track;
  }
  ctx.textAlign = align;
}

// The filler pages of a riffle (drawGeneric): the fables of latin.js at the body size of the
// tales, laid out as paragraphBlock and headingBlock would set them. Each fable begins on a fresh
// line under its heading, with a gilt initial (heading and the initial's three lines are kept on
// one page; a page left with no room for them closes with a small ornament), and runs on over
// the foot of the page, never leaving its last line alone at the head of the next; after the
// last fable they begin again. Returns the items of page `page`, in page units.
function fillerLayout(g, page) {
  const size = typeSize("body");
  const lineH = size * 1.42;
  const headSize = typeSize("title");
  const headH = headSize * 1.12;
  const initial = Math.round(2 * lineH + size * 0.72);
  const indent = initial + size * 0.42;
  const box = textBox("left");
  const foot = box.y + box.h;
  const items = [];
  let n = 0; // the page being laid out
  let y = box.y;
  const put = (it) => n === page && items.push(it);
  const turn = () => {
    n++;
    y = box.y;
  };
  for (let f = 0; n <= page; f = (f + 1) % LATIN.length) {
    const { title, text } = LATIN[f];
    g.font = font(600, headSize);
    const head = wrap(g, title, () => box.w);
    g.font = font(400, size);
    const [first, ...rest] = Array.from(text);
    const lines = wrap(g, rest.join(""), (i) => (i < 3 ? box.w - indent : box.w));
    const gap = y > box.y ? Math.round(size * 0.95) : 0;
    if (y + gap + head.length * headH + Math.round(size * 0.7) + 3 * lineH > foot) {
      if (foot - y > 3 * lineH) put({ rule: y + Math.max(40, Math.min(170, (foot - y) / 2.6)) });
      turn();
    } else y += gap;
    for (const line of head) {
      put({ head: line, y });
      y += headH;
    }
    y += Math.round(size * 0.7);
    put({ initial: first.toUpperCase(), fable: f, y });
    lines.forEach((line, i) => {
      if (y + lineH > foot || (i >= 3 && i === lines.length - 2 && y + 2 * lineH > foot)) turn();
      put({ line, x: i < 3 ? indent : 0, y });
      y += lineH;
    });
  }
  return { items, size, headSize, initial };
}

// Builds and draws one page. Returns hit regions in page units.
export function createPageArtist({ parchment, grain, images }) {
  const getImg = (entry) => (entry ? images.get(entry.src) || null : null);

  function base(ctx, k, seed) {
    // parchment, flipped per page so neighbours are not identical
    ctx.save();
    const fx = seed % 2 ? -1 : 1;
    const fy = seed % 3 === 1 ? -1 : 1;
    ctx.translate(fx < 0 ? PAGE_UNITS_W : 0, fy < 0 ? PAGE_UNITS_H : 0);
    ctx.scale(fx, fy);
    ctx.drawImage(parchment, 0, 0, PAGE_UNITS_W, PAGE_UNITS_H);
    ctx.restore();
    // fine paper grain at device resolution
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = ctx.createPattern(grain, "repeat");
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.restore();
    ctx.setTransform(k, 0, 0, k, 0, 0);
  }

  // Art in another format than its frame is cropped to fit (a portrait in a plate hard, older 3:2
  // plates a little at the sides, by its `focus`): say so once.
  const aspectWarned = new Set();
  function warnAspect(spread, layout, image) {
    const img = image && getImg(image);
    if (!img || (layout !== "full" && layout !== "plate") || aspectWarned.has(image.src)) return;
    const a = img.naturalWidth / img.naturalHeight;
    if (layout === "full" ? a > 0.8 : Math.abs(a - PLATE.aspect) > 0.08) {
      aspectWarned.add(image.src);
      console.warn(`[book] ${spread.taleId} p${spread.page}: ${image.src} is ${a.toFixed(2)}:1, the ${layout} layout wants ${layout === "full" ? "2:3" : "5:4"}`);
    }
  }

  // Decide what each page of a spread carries.
  function plan(spread, ctx) {
    const { lang, choices, resolved } = ctx;
    const out = { left: null, right: null };
    if (spread.layout === "title") {
      out.left = { type: "dedication" };
      out.right = { type: "titlePage", image: spreadImage(spread, resolved) };
      return out;
    }
    if (spread.layout === "taleTitle") {
      // a tale whose pages do not exist yet: its title spread, clearly marked as a placeholder
      out.left = { type: "taleNote", tale: spread.tale };
      out.right = { type: "taleTitle", tale: spread.tale };
      return out;
    }
    const t = storyFor(spread.taleId || ctx.tale).pageText(spread.page, resolved, lang);
    const hasChoices = t.choices.length > 0;
    const image = spreadImage(spread, resolved);
    const choice = hasChoices ? { options: t.choices, selectedId: choices[spread.page] || null } : null;
    // no layout given: the right page decides – a plate when choices or a note sit under the
    // picture, a full-page portrait when nothing does (the left page only ever carries text)
    const layout = spread.layout || (hasChoices || t.note ? "plate" : "full");
    warnAspect(spread, layout, image);
    if (layout === "full") {
      out.left = { type: "text", t, paragraphs: t.paragraphs, title: true, choice, note: hasChoices ? null : t.note, tailpiece: normaliseImage(spread.tailpiece) };
      out.right = { type: "full", image };
    } else if (layout === "plate") {
      out.left = { type: "text", t, paragraphs: t.paragraphs, title: true, note: null, tailpiece: normaliseImage(spread.tailpiece) };
      out.right = { type: "plate", image, choice, note: t.note };
    } else {
      // a tale's last spread: the whole text, "The end" and an ornament on the left; the closing
      // emblem on its own page on the right, as large as a page allows, with the clasp that
      // starts the tale again under it
      if (t.ending) {
        out.left = { type: "text", t, paragraphs: t.paragraphs, title: true, vignette: normaliseImage(spread.secondary) };
        out.right = { type: "text", t, paragraphs: [], title: false, choice, vignette: image, emblem: true, cont: true, restart: true };
      } else {
        // vignette: text runs over both pages
        const split = Math.ceil(t.paragraphs.length / 2);
        out.left = { type: "text", t, paragraphs: t.paragraphs.slice(0, split), title: true, vignette: normaliseImage(spread.secondary) };
        out.right = { type: "text", t, paragraphs: t.paragraphs.slice(split), title: false, choice, vignette: image, cont: true };
      }
    }
    return out;
  }

  // opts.bare: leave the type out (the page under the ink); opts.seal: a choice being made (see
  // choicesBlock). Returns hit regions in page units and the lines of type in canvas px.
  function drawPage(canvas, spread, side, state, opts = {}) {
    const g = canvas.getContext("2d");
    const lines = [];
    const regions = [];
    const unhook = typeHooks(g, { bare: opts.bare, lines });
    REGIONS = regions;
    try {
      return { hits: compose(g, canvas, spread, side, state, opts), lines: mergeLines(lines), regions };
    } finally {
      REGIONS = null;
      unhook();
    }
  }

  // Lines of type drawn piecewise (letter-spaced capitals, an embossed label) become one line.
  function mergeLines(lines) {
    const out = [];
    for (const l of lines) {
      const p = out[out.length - 1];
      const overlap = p ? Math.min(p.y + p.h, l.y + l.h) - Math.max(p.y, l.y) : 0;
      if (p && overlap > 0.6 * Math.min(p.h, l.h) && l.x <= p.x + p.w + 24 && l.x + l.w >= p.x - 24) {
        const x1 = Math.max(p.x + p.w, l.x + l.w);
        const y1 = Math.max(p.y + p.h, l.y + l.h);
        p.x = Math.min(p.x, l.x);
        p.y = Math.min(p.y, l.y);
        p.w = x1 - p.x;
        p.h = y1 - p.y;
      } else out.push({ ...l });
    }
    return out;
  }

  function compose(g, canvas, spread, side, state, opts) {
    const k = canvas.width / PAGE_UNITS_W;
    g.setTransform(k, 0, 0, k, 0, 0);
    g.clearRect(0, 0, PAGE_UNITS_W, PAGE_UNITS_H);
    base(g, k, spread.page * 2 + (side === "left" ? 0 : 1));
    const hits = [];
    const desc = plan(spread, state)[side];
    const meta = storyFor(spread.taleId || state.tale)?.storyMeta(state.lang);
    const L = ui[state.lang];
    const box = textBox(side);
    const vineSide = side === "left" ? -1 : 1;

    if (desc.type === "dedication") {
      // the tale's epigraph between two ornament rules, its source in small rubric capitals under
      // them (and a note, if any, under that); the block sits where the page's eye rests, the
      // rules and the attribution follow its height. A tale without one: the book's dedication
      // and the ex libris at the foot.
      const E = epigraphOf(spread.taleId || state.tale, state.lang);
      const lines = E ? E.lines : L.dedication.split("\n");
      g.save();
      g.textAlign = "center";
      const cx = box.x + box.w / 2;
      let size = typeSize("quote");
      g.font = font(400, size, true);
      const widest = Math.max(...lines.map((l) => g.measureText(l).width));
      if (widest > box.w - 40) size = Math.floor((size * (box.w - 40)) / widest);
      const lead = Math.round(size * 1.42);
      const first = 677 - ((lines.length - 1) * lead) / 2;
      const last = first + (lines.length - 1) * lead;
      ornamentRule(g, cx, first - 90, 260);
      g.font = font(400, size, true);
      g.fillStyle = C.inkSoft;
      lines.forEach((line, i) => g.fillText(line, cx, first + i * lead));
      ornamentRule(g, cx, last + 86, 160);
      g.fillStyle = C.rubric;
      if (E) {
        g.globalAlpha = 0.92;
        g.font = font(CAPS_WEIGHT, typeSize("caps"));
        const credit = `${E.author} · ${E.work}`.toUpperCase();
        let y = last + 86 + 66;
        // one line if it fits the column, else the author over the work
        for (const part of trackedWidth(g, credit, 3) <= box.w - 40 ? [credit] : [E.author.toUpperCase(), E.work.toUpperCase()]) {
          trackedText(g, part, cx, y, 3);
          y += 34;
        }
        if (E.note) {
          g.font = font(SMALL_WEIGHT, typeSize("caps"), true);
          g.fillStyle = C.inkSoft;
          g.globalAlpha = 0.78;
          g.fillText(E.note, cx, y + 2);
        }
        REGIONS?.push({ role: "epigraph", x: box.x, y: first - 120, w: box.w, h: y + (E.note ? 30 : 0) - (first - 120) });
      } else {
        g.font = font(400, typeSize("caps"));
        g.globalAlpha = 0.7;
        g.fillText("EX LIBRIS", cx, 1120);
        REGIONS?.push({ role: "epigraph", x: box.x, y: first - 120, w: box.w, h: 1140 - (first - 120) });
      }
      g.restore();
    } else if (desc.type === "titlePage") {
      g.save();
      g.textAlign = "center";
      const cx = box.x + box.w / 2;
      g.font = font(400, typeSize("caption"));
      g.fillStyle = C.rubric;
      g.fillText(L.bookTitle.toUpperCase().split("").join(" "), cx, 190);
      ornamentRule(g, cx, 236, 300);
      g.font = font(600, typeSize("display"));
      g.fillStyle = C.ink;
      const lines = wrap(g, meta.title, () => box.w - 40);
      lines.forEach((line, i) => g.fillText(line, cx, 350 + i * TITLE_LEAD));
      let y = 350 + (lines.length - 1) * TITLE_LEAD;
      g.font = font(400, typeSize("body"), true);
      g.fillStyle = C.rubric;
      g.fillText(meta.kicker, cx, y + 76);
      g.restore();
      const img = getImg(desc.image);
      REGIONS?.push({ role: "title", x: box.x, y: 140, w: box.w, h: y + 100 - 140 });
      if (img) {
        const w = 520;
        const h = (w * img.naturalHeight) / img.naturalWidth;
        g.save();
        g.globalCompositeOperation = "multiply";
        g.drawImage(img, cx0(box) - w / 2, y + 150, w, h);
        g.restore();
        REGIONS?.push({ role: "medallion", x: cx0(box) - w / 2, y: y + 150, w, h });
      }
      // the invitation to turn, with a fleuron under it
      // (set larger on a phone, it keeps as far from a tall medallion's foot by sitting a little lower)
      const begin = typeSize("small", state.column);
      const by = 1150 + (begin - typeSize("small"));
      g.save();
      g.textAlign = "center";
      g.font = font(400, begin, true);
      g.fillStyle = C.inkSoft;
      g.fillText(L.turnToBegin, cx0(box), by);
      g.font = font(400, typeSize("small"));
      g.fillStyle = C.rubric;
      g.fillText("❧", cx0(box), by + 56);
      g.restore();
      REGIONS?.push({ role: "begin", x: box.x, y: by - begin, w: box.w, h: by + 66 - (by - begin) });
      hits.push({ x: PAGE_UNITS_W * 0.55, y: 1050, w: PAGE_UNITS_W * 0.45, h: 250, action: { type: "next" } });
    } else if (desc.type === "taleNote") {
      g.save();
      g.textAlign = "center";
      const cx = box.x + box.w / 2;
      ornamentRule(g, cx, 560, 260);
      g.font = font(400, typeSize("quote"), true);
      g.fillStyle = C.inkSoft;
      taleUi[state.lang].placeholderNote.split("\n").forEach((line, i) => g.fillText(line, cx, 650 + i * Math.round(typeSize("quote") * 1.42)));
      ornamentRule(g, cx, 790, 160);
      g.restore();
    } else if (desc.type === "taleTitle") {
      const T = desc.tale;
      g.save();
      g.textAlign = "center";
      const cx = box.x + box.w / 2;
      g.font = font(400, typeSize("caption"));
      g.fillStyle = C.rubric;
      g.fillText(L.bookTitle.toUpperCase().split("").join("\u200a"), cx, 190);
      ornamentRule(g, cx, 236, 300);
      g.font = font(600, typeSize("display"));
      g.fillStyle = C.ink;
      const lines = wrap(g, T.title[state.lang], () => box.w - 40);
      lines.forEach((line, i) => g.fillText(line, cx, 350 + i * TITLE_LEAD));
      const y = 350 + (lines.length - 1) * TITLE_LEAD;
      g.font = font(400, typeSize("body"), true);
      g.fillStyle = C.rubric;
      g.fillText(T.kicker[state.lang], cx, y + 76);
      // the tale's ribbon colour as a small painted lozenge between gold rules
      const ly = y + 260;
      g.fillStyle = T.ribbon.color;
      g.beginPath();
      g.moveTo(cx, ly - 46);
      g.lineTo(cx + 34, ly);
      g.lineTo(cx, ly + 46);
      g.lineTo(cx - 34, ly);
      g.closePath();
      g.fill();
      g.strokeStyle = goldGradient(g, cx - 40, ly - 50, 80, 100);
      g.lineWidth = 5;
      g.stroke();
      ornamentRule(g, cx, ly + 110, 220);
      g.font = font(400, typeSize("small"), true);
      g.fillStyle = C.inkSoft;
      g.fillText(taleUi[state.lang].placeholderHint, cx, 1150);
      g.font = font(400, typeSize("small"));
      g.fillStyle = C.rubric;
      g.fillText("❧", cx, 1206);
      g.restore();
    } else if (desc.type === "full") {
      const img = getImg(desc.image);
      const availH = PAGE_UNITS_H - 104 - 122;
      let w = Math.min(box.w + 18, availH * (2 / 3));
      let h = w * 1.5;
      const x = side === "left" ? M.outer + (box.w - w) / 2 : M.gutter - 6 + (box.w + 6 - w) / 2;
      const y = 104 + (availH - h) / 2;
      REGIONS?.push({ role: "picture", x: x - 20, y: y - 20, w: w + 40, h: h + 40 });
      if (img) drawCover(g, img, x, y, w, h, desc.image.focus, desc.image.crop);
      else placeholder(g, x, y, w, h);
      settleIntoPaper(g, parchment, x, y, w, h);
      if (desc.image.frame === "painted") framePainted(g, x, y, w, h);
      else frameFull(g, x, y, w, h);
    } else if (desc.type === "plate") {
      // a 5:4 plate the width of the column, with the choices (and the room kept for the longest
      // response) or the note under it; art in another format is cropped to it by its `focus`
      const img = getImg(desc.image);
      const under = [];
      if (desc.choice) {
        const resp = desc.choice.selectedId ? desc.choice.options.find((o) => o.id === desc.choice.selectedId)?.response : null;
        under.push(choicesBlock({ ...desc.choice, hint: L.choiceHint, hits, pageId: spread.page, response: resp, reserve: longestResponse(desc.choice), anim: opts.seal, column: state.column }));
      }
      const note = desc.note ? noteBlock(desc.note, state.column) : null;
      if (note) under.push(note);
      // the picture takes the room the blocks under it leave; it only ever gets smaller than the
      // full plate if a page's text outgrows the content limits, so nothing runs off the page
      const room = (list) => box.h - PLATE.safe - list.reduce((a, b) => a + b.measure(g, box.w) + PLATE.gap, 0) - 2 * PLATE.pad;
      let maxH = room(under);
      // a note is optional: rather than shrink the picture below a 3:2 plate, leave the note out
      if (note && maxH < (box.w - 12) / 1.5) {
        under.pop();
        maxH = room(under);
      }
      const pic = imageBlock(img, desc.image, { mode: "plate", maxH, aspect: PLATE.aspect, parchment });
      pic.role = "picture";
      stack(g, [pic, ...under], box, { gap: PLATE.gap, align: "center" });
    } else if (desc.type === "text") {
      layoutTextPage(g, desc, side, box, state, hits, vineSide, spread, opts);
      runningHead(g, desc.cont ? desc.t.title : meta.title, side);
      if (!desc.cont) folio(g, spread.page, side);
    }
    return hits;
  }

  const cx0 = (box) => box.x + box.w / 2;

  const SIZES = [44, 42, 40, 38, 36, 34, 32, 30];

  // Text blocks of a text page at a body size. The choice block always reserves room for the
  // longest response, so choosing never reflows the page.
  function textBlocks(desc, size, state, hits, vineSide, spread, reserve = true, anim = null) {
    const L = ui[state.lang];
    const blocks = [];
    if (desc.title) blocks.push(headingBlock(desc.t.title, typeSize("title")));
    desc.paragraphs.forEach((p, i) => {
      const b = paragraphBlock(p.text, { size, drop: desc.title && i === 0, vineSide, sprig: desc.title && i === 0 ? sprigOf(spread.taleId || state.tale, state.spreads, spread.page) : null });
      b.gapBefore = i === 0 && desc.title ? Math.round(size * 0.7) : Math.round(size * 0.42);
      blocks.push(b);
    });
    if (desc.choice) {
      const longest = longestResponse(desc.choice);
      const selected = desc.choice.selectedId ? desc.choice.options.find((o) => o.id === desc.choice.selectedId)?.response : null;
      const cb = choicesBlock({ ...desc.choice, hint: L.choiceHint, hits, pageId: spread.page, response: reserve ? longest : selected, reserve: longest, anim, column: state.column });
      cb.gapBefore = Math.round(size * 0.95);
      blocks.push(cb);
    }
    return blocks;
  }
  const heightOf = (g, blocks, w) => blocks.reduce((a, b, i) => a + b.measure(g, w) + (i ? b.gapBefore ?? 24 : 0), 0);

  // Every way a spread can read: one context per combination of the choices that rewrite it.
  function readingsOf(spread, state) {
    const S = spread.page ? storyFor(spread.taleId || state.tale) : null;
    if (!S) return [state];
    return S.dependsOn(spread.page).reduce(
      (list, src) => list.flatMap((ctx) => S.choiceOptions(src, state.lang).map((o) => ({ ...ctx, resolved: { ...ctx.resolved, [src]: o.id } }))),
      [state]
    );
  }

  function fitSize(g, desc, side, state, spread) {
    const box = textBox(side);
    for (const size of SIZES) if (heightOf(g, textBlocks(desc, size, state, [], -1, spread), box.w) <= box.h) return size;
    return SIZES[SIZES.length - 1];
  }

  // One body size per tale (per language), so type never jumps: not between its spreads, and not
  // when the reader changes a choice. A choice rewrites later pages, so every way each spread can
  // read is measured, and the size that fits them all is kept whatever is chosen. (Read by its
  // column on a phone, a text page's choices measure taller, see choicesBlock: a size of its own.)
  const uniformCache = new Map();
  function uniformSize(g, state) {
    const key = `${state.tale}|${state.lang}|${state.column ? "column" : ""}`;
    if (uniformCache.has(key)) return uniformCache.get(key);
    let size = SIZES[0];
    for (const spread of state.spreads) {
      for (const variant of readingsOf(spread, state)) {
        const p = plan(spread, variant);
        for (const side of ["left", "right"]) if (p[side].type === "text") size = Math.min(size, fitSize(g, p[side], side, variant, spread));
      }
    }
    uniformCache.set(key, size);
    api.lastBodySize = size;
    return size;
  }

  function layoutTextPage(g, desc, side, box, state, hits, vineSide, spread, opts = {}) {
    const L = ui[state.lang];
    const size = uniformSize(g, state);
    api.lastBodySize = size;
    const blocks = textBlocks(desc, size, state, [], vineSide, spread, true);
    let remaining = box.h - heightOf(g, blocks, box.w);
    // the last page closes with a gilded clasp that starts the tale again, under the text and its
    // closing ornament; its room is set aside first, so the ornament is sized round it
    let clasp = desc.restart ? claspBlock({ label: L.restartStory, column: state.column, hits }) : null;
    const claspGap = Math.round(size * 1.5);
    if (clasp && clasp.measure() + claspGap + 40 < remaining) remaining -= clasp.measure() + claspGap;
    else clasp = null;
    // optional extras into the remaining space: a vignette, then the "did you know" note
    const vEntry = desc.vignette;
    if (vEntry) {
      const img = getImg(vEntry);
      if (img && remaining > 200) {
        // the closing emblem of a tale has a page of its own (with the clasp under it)
        const vb = imageBlock(img, vEntry, { mode: "vignette", maxH: Math.min(remaining - 60, desc.emblem ? 900 : 470), large: desc.emblem });
        vb.role = desc.emblem ? "emblem" : "vignette";
        const h = vb.measure(g, box.w);
        // an emblem alone on its page: it and the clasp sit together in the page's optical middle;
        // a spot image sits in the optical middle of the room under the text, not glued to it
        vb.gapBefore = desc.emblem && !blocks.length ? Math.max(30, (remaining - h) * 0.42) : Math.max(30, Math.min(170, (remaining - h) / 2.6));
        blocks.push(vb);
        remaining -= h + vb.gapBefore;
      }
    }
    if (desc.note && remaining > 260) {
      const nb = noteBlock(desc.note, state.column);
      const h = nb.measure(g, box.w);
      if (h + 40 < remaining) {
        nb.gapBefore = 44;
        blocks.push(nb);
        remaining -= h + 44;
      }
    }
    // a tailpiece (ink drollery) sits in the middle of whatever room is left
    const tail = desc.tailpiece && getImg(desc.tailpiece);
    if (tail && remaining > 220) {
      const tb = imageBlock(tail, desc.tailpiece, { mode: "vignette", maxH: Math.min(remaining - 90, 230) });
      tb.role = "tailpiece";
      const h = tb.measure(g, box.w);
      tb.gapBefore = Math.max(40, Math.min(170, (remaining - h) / 2.6));
      blocks.push(tb);
    }
    if (clasp) {
      // right under the ornament; with none, in the optical middle of the free space
      const after = blocks[blocks.length - 1]?.kind === "image"; // nothing above it: an emblem still loading
      clasp.gapBefore = after ? claspGap : Math.max(claspGap, Math.min(170, (remaining + claspGap) / 2.6));
      blocks.push(clasp);
    }
    // final pass: the choice block shows only the chosen response and registers hit regions
    if (desc.choice) {
      const i = blocks.findIndex((b) => b.kind === "choices");
      const real = textBlocks(desc, size, state, hits, vineSide, spread, false, opts.seal).find((b) => b.kind === "choices");
      real.gapBefore = blocks[i].gapBefore;
      blocks[i] = real;
    }
    stack(g, blocks, box, { gap: 24 });
  }

  // A printed page for the leaves that fly past while the book riffles to a tale: Phaedrus'
  // fables (latin.js) set as the book sets its own text pages (running head, rubric headings, a
  // gilt initial, the body type, a folio) and running on from page to page; `index` picks the
  // page, so neighbouring leaves differ in text and paper. Never read, only glimpsed.
  function drawGeneric(canvas, index = 0) {
    const g = canvas.getContext("2d");
    const k = canvas.width / PAGE_UNITS_W;
    g.setTransform(k, 0, 0, k, 0, 0);
    base(g, k, index + 3);
    const { items, size, headSize, initial } = fillerLayout(g, index);
    const box = textBox("left");
    g.save();
    g.textAlign = "left";
    g.textBaseline = "alphabetic";
    for (const it of items) {
      if (it.head) {
        g.font = font(600, headSize);
        g.fillStyle = C.rubric;
        g.fillText(it.head, box.x, it.y + headSize * 0.82);
      } else if (it.line) {
        g.font = font(400, size);
        g.fillStyle = C.ink;
        g.fillText(it.line, box.x + it.x, it.y + size * 0.78);
      }
    }
    g.restore();
    for (const it of items) {
      if (it.initial) dropInitial(g, it.initial, box.x, it.y + size * 0.08, initial, -1, fillerSprigs[it.fable]);
      else if (it.rule) ornamentRule(g, box.x + box.w / 2, it.rule, 160);
    }
    runningHead(g, "Fabulae Aesopiae", "left");
    folio(g, index + 1, "left");
  }

  const api = { drawPage, drawGeneric, plan, lastBodySize: null, resetMetrics: () => uniformCache.clear() };
  return api;
}

// Fine paper grain, drawn once and tiled at device resolution.
export function makeGrain(size = 256) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d");
  const img = g.createImageData(size, size);
  let s = 1234567;
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < size * size; i++) {
    const v = rnd();
    const dark = v < 0.5;
    img.data[i * 4] = dark ? 90 : 255;
    img.data[i * 4 + 1] = dark ? 60 : 248;
    img.data[i * 4 + 2] = dark ? 30 : 230;
    img.data[i * 4 + 3] = Math.floor(Math.abs(v - 0.5) * 2 * 16);
  }
  g.putImageData(img, 0, 0);
  // a few fibres
  g.lineCap = "round";
  for (let i = 0; i < 70; i++) {
    g.strokeStyle = `rgba(${rnd() < 0.5 ? "110,75,40" : "255,250,235"},${0.05 + rnd() * 0.08})`;
    g.lineWidth = 0.6 + rnd() * 0.8;
    const x = rnd() * size;
    const y = rnd() * size;
    const a = (rnd() - 0.5) * 1.2;
    const l = 6 + rnd() * 22;
    g.beginPath();
    g.moveTo(x, y);
    g.quadraticCurveTo(x + Math.cos(a) * l * 0.5, y + Math.sin(a) * l * 0.5 + (rnd() - 0.5) * 4, x + Math.cos(a) * l, y + Math.sin(a) * l);
    g.stroke();
  }
  return c;
}
