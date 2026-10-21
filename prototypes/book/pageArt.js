// Draws one book page (parchment, text, illustrations, choice seals) into a 2D canvas.
// Layout works in page units: the page is 1000 units wide and PAGE_UNITS_H tall;
// the canvas transform maps units to device pixels, so text is rasterised at the
// final resolution and stays crisp on a retina tablet.
import { storyFor, ui } from "./story.js";
import { spreadImage, normaliseImage } from "./pages.js";
import { taleUi } from "./tales.js";

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
};

// margins in units (gutter = side towards the spine)
const M = { top: 100, bottom: 112, gutter: 98, outer: 84 };

// The framed plate on a right page with choices or a note under it: one format for every tale,
// 5:4 (art exported at 1280x1024, cropped from the 1536x1024 generation), the width of the text
// column. pad = room above and below the picture for its gilded frame, gap = to the block under
// it, safe = kept free at the foot whatever the language. At this size the longest choice block
// (labels <= 38 chars, responses <= 120) and a note up to 280 chars still fit (validate-stories.js).
const PLATE = { aspect: 5 / 4, pad: 40, gap: 34, safe: 24 };

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

function leaf(ctx, x, y, r, angle, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(r * 0.6, -r * 0.45, r, 0);
  ctx.quadraticCurveTo(r * 0.6, r * 0.45, 0, 0);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
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

// Gilded drop initial: gold-leaf square, ink frame, red letter, a vine trailing into the margin.
function dropInitial(ctx, letter, x, y, size, vineSide) {
  ctx.save();
  // vine first, so the box sits on top of it
  const vx = vineSide < 0 ? x - 26 : x + size + 26;
  ctx.strokeStyle = C.green;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(vineSide < 0 ? x : x + size, y + size * 0.82);
  ctx.bezierCurveTo(vx, y + size * 0.95, vx - vineSide * 10, y + size * 1.35, vx, y + size * 1.75);
  ctx.stroke();
  for (let i = 0; i < 4; i++) {
    const t = 0.95 + i * 0.22;
    leaf(ctx, vx + Math.sin(i * 2.1) * 6, y + size * t, 22, (i % 2 ? 0.6 : 2.5) * (vineSide < 0 ? -1 : 1) + (vineSide < 0 ? Math.PI : 0), i % 2 ? C.green : "#6f8a45");
  }
  dot(ctx, vx, y + size * 1.78, 7, C.rubric);
  dot(ctx, vx, y + size * 1.78, 3, C.goldLight);

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

function placeholder(ctx, x, y, w, h) {
  ctx.save();
  ctx.fillStyle = "rgba(120,90,50,0.12)";
  ctx.fillRect(x, y, w, h);
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
  const { size, italic = false, color = C.ink, drop = false, vineSide = -1, lh = 1.42 } = opts;
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
      if (L.initial) dropInitial(ctx, L.initial, x, y + ascent - size * 0.7, L.boxSize, vineSide);
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

// Choice tabs with wax seals. `reserve` is the longest response: its room is kept under the
// tabs, so choosing never reflows the page. `anim` ({ from, capture }) is a choice being made:
// the page is drawn once without the block, and `anim.draw(g, p)` then paints only the block at
// progress p (0..1) – the chosen seal pressed in, a gold wash spreading from it across its tab,
// its ring traced round, the previous choice fading back and its response rewritten. With
// `anim.glint` nothing is chosen: the reader tried to turn on past the choice, and the seals
// glow once, one after another (`anim.calm`: reduced motion, they only glow, never swell).
// `anim.levels` ({ id: 0..1 }, drawn at p = 1) is the pointer resting on seals (main.js eases it).
function choicesBlock({ options, selectedId, hint, size, hits, pageId, response, reserve = null, anim = null }) {
  const rowH = Math.round(size * 2.5);
  const gap = Math.round(size * 0.45);
  const hintSize = Math.round(size * 0.84);
  const fromResponse = anim ? options.find((o) => o.id === anim.from)?.response || null : null;
  let cache = null;
  const layout = (ctx, width) => {
    if (cache && cache.width === width) return cache;
    ctx.font = font(400, hintSize, true);
    const hintLines = hint ? wrap(ctx, hint, () => width) : [];
    const lines = (text) => (text ? wrap(ctx, glueOrphans(text), () => width - 20) : []);
    const respLines = lines(response);
    const fromLines = lines(fromResponse);
    const respRows = Math.max(respLines.length, lines(reserve).length);
    ctx.font = font(600, size);
    const labelLines = options.map((o) => wrap(ctx, glueOrphans(o.label), () => width - rowH * 1.25 - 30));
    const rows = labelLines.map((ls) => Math.max(rowH, ls.length * size * 1.18 + size * 0.9));
    const height = hintLines.length * hintSize * 1.35 + (hintLines.length ? 16 : 0) + rows.reduce((a, b) => a + b, 0) + gap * (options.length - 1) + (respRows ? 18 + respRows * hintSize * 1.35 : 0);
    cache = { width, hintLines, respLines, fromLines, labelLines, rows, height };
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
    ctx.font = font(400, hintSize, true);
    ctx.fillStyle = C.inkSoft;
    for (const line of L.hintLines) {
      ctx.fillText(line, x, cy + hintSize * 0.8);
      cy += hintSize * 1.35;
    }
    if (L.hintLines.length) cy += 16;
    options.forEach((o, i) => {
      const h = L.rows[i];
      const now = selectedId === o.id;
      const was = anim ? anim.from === o.id : now;
      // how chosen the tab looks: the new choice washes in from its seal, the old one fades back
      const wash = now ? (was ? 1 : easeOut(clamp01(k / 0.75))) : 0;
      const back = was && !now ? 1 - easeOut(clamp01(k / 0.6)) : 0;
      const sel = Math.max(wash, back);
      const dimTo = selectedId && !now ? 1 : 0;
      const dimFrom = anim ? (anim.from && !was ? 1 : 0) : dimTo;
      // under the pointer (desktop): a seal not chosen warms a little, a dimmed one brightens
      const hover = anim?.levels && !now ? easeOut(anim.levels[o.id] || 0) : 0;
      const dim = (dimFrom + (dimTo - dimFrom) * e) * (1 - 0.6 * hover);
      // a seal still to be chosen: each glows in turn, a little after the one above it
      const stagger = 0.16;
      const q = anim?.glint && !now ? clamp01((k - stagger * i) / (1 - stagger * (options.length - 1))) : 0;
      const glint = Math.pow(Math.sin(Math.PI * q), 1.5);
      const glow = Math.max(glint, 0.55 * hover);
      const sealR = rowH * 0.36;
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
        if (now && wash < 1) {
          // gold leaf laid from the seal rightwards, its leading edge soft
          ctx.clip();
          const feather = 90;
          const edge = bx - sealR + (tw + sealR + feather) * wash;
          const g = ctx.createLinearGradient(edge - feather, 0, edge, 0);
          g.addColorStop(0, GOLD.fill);
          g.addColorStop(1, GOLD.clear);
          ctx.fillStyle = g;
          ctx.fillRect(bx, cy, Math.max(0, edge - bx), h);
          // light catching the fresh leaf just behind its edge, gone as it settles
          const sheen = ctx.createLinearGradient(edge - feather * 2, 0, edge, 0);
          sheen.addColorStop(0, "rgba(255,240,190,0)");
          sheen.addColorStop(0.6, `rgba(255,240,190,${0.55 * (1 - wash)})`);
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
        ring: now ? 1 : back,
        glow,
        swell: anim?.calm ? 0 : glint,
      });
      hits.push({ x, y: cy, w: width, h, action: { type: "choice", id: o.id } });
      cy += h + gap;
    });
    if (L.respLines.length || L.fromLines.length) {
      cy += 18 - gap;
      ctx.font = font(400, hintSize, true);
      const rewritten = anim && fromResponse !== response;
      if (rewritten && L.fromLines.length && k < 0.35) {
        ctx.save();
        ctx.globalAlpha = 1 - easeOut(k / 0.35);
        ctx.fillStyle = C.inkSoft;
        L.fromLines.forEach((line, j) => ctx.fillText(line, x + 20, cy + hintSize * 0.8 + j * hintSize * 1.35));
        ctx.restore();
      }
      // the response is written in after the seal, line after line
      const write = rewritten ? easeOut(clamp01((k - 0.22) / 0.78)) * L.respLines.length : L.respLines.length;
      L.respLines.forEach((line, j) => inkText(ctx, line, x + 20, cy + hintSize * 0.8 + j * hintSize * 1.35, clamp01(write - j), C.inkSoft));
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
function claspBlock({ label, size, hits }) {
  const h = Math.round(size * 1.85);
  const r = h * 0.325; // the language plaque's corner: 13 px on its 40 px height
  const fontSize = Math.round(size * 0.74);
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

function noteBlock(note, size) {
  const inner = 28;
  let cache = null;
  const layout = (ctx, width) => {
    if (cache && cache.width === width) return cache;
    ctx.font = font(400, size, true);
    const lines = wrap(ctx, glueOrphans(note.body), () => width - inner * 2);
    cache = { width, lines, height: size * 1.3 + 14 + lines.length * size * 1.36 + inner * 1.4 };
    return cache;
  };
  return {
    kind: "note",
    optional: true,
    measure: (ctx, width) => layout(ctx, width).height,
    draw(ctx, x, y, width) {
      const L = layout(ctx, width);
      ctx.save();
      roundRect(ctx, x, y, width, L.height, 10);
      ctx.fillStyle = "rgba(150,110,60,0.07)";
      ctx.fill();
      ctx.strokeStyle = "rgba(150,42,31,0.45)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([2, 6]);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.font = font(600, size * 0.95, true);
      ctx.fillStyle = C.rubric;
      ctx.fillText(note.title, x + inner, y + inner * 0.7 + size * 0.85);
      ctx.font = font(400, size, true);
      ctx.fillStyle = C.inkSoft;
      L.lines.forEach((line, i) => ctx.fillText(line, x + inner, y + inner * 0.7 + size * 1.3 + 14 + size * 0.8 + i * size * 1.36));
      ctx.restore();
    },
  };
}

function imageBlock(img, entry, { mode, maxH, aspect, parchment }) {
  // mode: "plate" (framed miniature) | "vignette" (transparent spot image, no frame)
  const box = (width) => {
    if (mode === "vignette") {
      const ar = img ? img.naturalWidth / img.naturalHeight : 1.4;
      let w = Math.min(width * 0.82, 560);
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
      if (!img) return placeholder(ctx, ix, iy, b.w, b.h);
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
  ctx.font = font(400, 21);
  ctx.fillStyle = C.rubric;
  ctx.globalAlpha = 0.8;
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
  ctx.font = font(400, 26);
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
    y += hs[i];
  });
  return total;
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
      // vignette: text runs over both pages
      const n = t.paragraphs.length;
      const split = Math.ceil(n / 2);
      // on a tale's last spread the closing emblem takes the roomier left page, clear of the restart button
      const [vl, vr] = t.ending ? [image, normaliseImage(spread.secondary)] : [normaliseImage(spread.secondary), image];
      out.left = { type: "text", t, paragraphs: t.paragraphs.slice(0, split), title: true, vignette: vl, emblem: t.ending };
      out.right = { type: "text", t, paragraphs: t.paragraphs.slice(split), title: false, choice, vignette: vr, cont: true, restart: t.ending };
    }
    return out;
  }

  // opts.bare: leave the type out (the page under the ink); opts.seal: a choice being made (see
  // choicesBlock). Returns hit regions in page units and the lines of type in canvas px.
  function drawPage(canvas, spread, side, state, opts = {}) {
    const g = canvas.getContext("2d");
    const lines = [];
    const unhook = typeHooks(g, { bare: opts.bare, lines });
    try {
      return { hits: compose(g, canvas, spread, side, state, opts), lines: mergeLines(lines) };
    } finally {
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
      g.save();
      g.textAlign = "center";
      const cx = box.x + box.w / 2;
      ornamentRule(g, cx, 560, 260);
      g.font = font(400, 38, true);
      g.fillStyle = C.inkSoft;
      L.dedication.split("\n").forEach((line, i) => g.fillText(line, cx, 650 + i * 54));
      ornamentRule(g, cx, 790, 160);
      g.font = font(400, 22);
      g.fillStyle = C.rubric;
      g.globalAlpha = 0.7;
      g.fillText("EX LIBRIS", cx, 1120);
      g.restore();
    } else if (desc.type === "titlePage") {
      g.save();
      g.textAlign = "center";
      const cx = box.x + box.w / 2;
      g.font = font(400, 26);
      g.fillStyle = C.rubric;
      g.fillText(L.bookTitle.toUpperCase().split("").join(" "), cx, 190);
      ornamentRule(g, cx, 236, 300);
      g.font = font(600, 74);
      g.fillStyle = C.ink;
      const lines = wrap(g, meta.title, () => box.w - 40);
      lines.forEach((line, i) => g.fillText(line, cx, 350 + i * 84));
      let y = 350 + (lines.length - 1) * 84;
      g.font = font(400, 40, true);
      g.fillStyle = C.rubric;
      g.fillText(meta.kicker, cx, y + 76);
      g.restore();
      const img = getImg(desc.image);
      if (img) {
        const w = 520;
        const h = (w * img.naturalHeight) / img.naturalWidth;
        g.save();
        g.globalCompositeOperation = "multiply";
        g.drawImage(img, cx0(box) - w / 2, y + 150, w, h);
        g.restore();
      }
      g.save();
      g.textAlign = "center";
      g.font = font(400, 30, true);
      g.fillStyle = C.inkSoft;
      g.fillText(L.turnToBegin, cx0(box), 1150);
      g.font = font(400, 34);
      g.fillStyle = C.rubric;
      g.fillText("❧", cx0(box), 1206);
      g.restore();
      hits.push({ x: PAGE_UNITS_W * 0.55, y: 1050, w: PAGE_UNITS_W * 0.45, h: 250, action: { type: "next" } });
    } else if (desc.type === "taleNote") {
      g.save();
      g.textAlign = "center";
      const cx = box.x + box.w / 2;
      ornamentRule(g, cx, 560, 260);
      g.font = font(400, 36, true);
      g.fillStyle = C.inkSoft;
      taleUi[state.lang].placeholderNote.split("\n").forEach((line, i) => g.fillText(line, cx, 650 + i * 52));
      ornamentRule(g, cx, 790, 160);
      g.restore();
    } else if (desc.type === "taleTitle") {
      const T = desc.tale;
      g.save();
      g.textAlign = "center";
      const cx = box.x + box.w / 2;
      g.font = font(400, 26);
      g.fillStyle = C.rubric;
      g.fillText(L.bookTitle.toUpperCase().split("").join(" "), cx, 190);
      ornamentRule(g, cx, 236, 300);
      g.font = font(600, 74);
      g.fillStyle = C.ink;
      const lines = wrap(g, T.title[state.lang], () => box.w - 40);
      lines.forEach((line, i) => g.fillText(line, cx, 350 + i * 84));
      const y = 350 + (lines.length - 1) * 84;
      g.font = font(400, 40, true);
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
      g.font = font(400, 30, true);
      g.fillStyle = C.inkSoft;
      g.fillText(taleUi[state.lang].placeholderHint, cx, 1150);
      g.font = font(400, 34);
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
        under.push(choicesBlock({ ...desc.choice, hint: L.choiceHint, size: 37, hits, pageId: spread.page, response: resp, reserve: longestResponse(desc.choice), anim: opts.seal }));
      }
      const note = desc.note ? noteBlock(desc.note, 35) : null;
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
      stack(g, [imageBlock(img, desc.image, { mode: "plate", maxH, aspect: PLATE.aspect, parchment }), ...under], box, { gap: PLATE.gap, align: "center" });
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
    if (desc.title) blocks.push(headingBlock(desc.t.title, Math.round(size * 1.36)));
    desc.paragraphs.forEach((p, i) => {
      const b = p.kind === "echo"
        ? paragraphBlock(p.text, { size: Math.round(size * 0.92), italic: true, color: C.inkSoft })
        : paragraphBlock(p.text, { size, drop: desc.title && i === 0, vineSide });
      b.gapBefore = i === 0 && desc.title ? Math.round(size * 0.7) : Math.round(size * 0.42);
      blocks.push(b);
    });
    if (desc.choice) {
      const longest = longestResponse(desc.choice);
      const selected = desc.choice.selectedId ? desc.choice.options.find((o) => o.id === desc.choice.selectedId)?.response : null;
      const cb = choicesBlock({ ...desc.choice, hint: L.choiceHint, size: Math.round(size * 0.88), hits, pageId: spread.page, response: reserve ? longest : selected, reserve: longest, anim });
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
  // read is measured, and the size that fits them all is kept whatever is chosen.
  const uniformCache = new Map();
  function uniformSize(g, state) {
    const key = `${state.tale}|${state.lang}`;
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
    let clasp = desc.restart ? claspBlock({ label: L.restartStory, size, hits }) : null;
    const claspGap = Math.round(size * 1.5);
    if (clasp && clasp.measure() + claspGap + 40 < remaining) remaining -= clasp.measure() + claspGap;
    else clasp = null;
    // optional extras into the remaining space: a vignette, then the "did you know" note
    const vEntry = desc.vignette;
    if (vEntry) {
      const img = getImg(vEntry);
      if (img && remaining > 200) {
        // the closing emblem of a tale gets the room a spot image would leave empty
        const vb = imageBlock(img, vEntry, { mode: "vignette", maxH: Math.min(remaining - 60, desc.emblem ? 760 : 470) });
        const h = vb.measure(g, box.w);
        // sit the spot image in the optical middle of the free space, not glued to the text
        // (with the clasp under it, the pair may sit lower: level with the emblem opposite)
        vb.gapBefore = Math.max(30, Math.min(clasp ? 320 : 170, (remaining - h) / 2.6));
        blocks.push(vb);
        remaining -= h + vb.gapBefore;
      }
    }
    if (desc.note && remaining > 260) {
      const nb = noteBlock(desc.note, Math.round(size * 0.78));
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
      const h = tb.measure(g, box.w);
      tb.gapBefore = Math.max(40, Math.min(170, (remaining - h) / 2.6));
      blocks.push(tb);
    }
    if (clasp) {
      // right under the ornament; with none, in the optical middle of the free space
      const after = blocks[blocks.length - 1].kind === "image";
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

  // A generic printed page for the leaves that fly past while the book riffles to a tale: a
  // rubric heading, a gilt initial and lines of type in pseudo-words (never read, only glimpsed).
  function drawGeneric(canvas, seed = 3) {
    const g = canvas.getContext("2d");
    const k = canvas.width / PAGE_UNITS_W;
    g.setTransform(k, 0, 0, k, 0, 0);
    base(g, k, seed);
    let s = seed * 9301 + 49297;
    const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
    const syl = ["la", "re", "mi", "so", "do", "va", "ne", "ri", "tu", "ca", "mo", "li", "se", "ta", "no", "be", "ar", "es", "um", "or"];
    const word = () => Array.from({ length: 1 + Math.floor(rnd() * 3) }, () => syl[Math.floor(rnd() * syl.length)]).join("");
    const box = textBox("right");
    g.textBaseline = "alphabetic";
    g.font = font(600, 46);
    g.fillStyle = C.rubric;
    g.globalAlpha = 0.85;
    g.fillText(`${word()} ${word()} ${word()}`.replace(/^./, (c) => c.toUpperCase()), box.x, box.y + 40);
    g.globalAlpha = 1;
    const size = 34;
    const lead = size * 1.42;
    const ini = Math.round(size * 2.6);
    g.fillStyle = goldGradient(g, box.x, box.y + 80, ini, ini);
    g.fillRect(box.x, box.y + 82, ini, ini);
    g.font = font(600, ini * 0.8);
    g.fillStyle = C.rubric;
    g.fillText(String.fromCharCode(65 + Math.floor(rnd() * 20)), box.x + ini * 0.2, box.y + 82 + ini * 0.8);
    g.font = font(400, size);
    g.fillStyle = C.ink;
    g.globalAlpha = 0.86;
    let y = box.y + 82 + size;
    for (let line = 0; y < box.y + box.h - 20; line++) {
      const x0 = box.x + (y < box.y + 82 + ini + 6 ? ini + 18 : 0);
      const last = line % 7 === 6;
      let x = x0;
      const limit = box.x + box.w * (last ? 0.45 + rnd() * 0.3 : 1);
      for (;;) {
        const w = word();
        const ww = g.measureText(w).width;
        if (x + ww > limit) break;
        g.fillText(w, x, y);
        x += ww + size * 0.3;
      }
      y += last ? lead * 1.6 : lead;
    }
    g.globalAlpha = 1;
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
