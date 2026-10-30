// Draws every page of the book in Node, on a stand-in canvas that takes any call, so a page that
// throws (a name left behind by a rename, a choice state nobody tried) stops the deploy instead of
// the reader. It checks that the pages draw, not how they look: pictures are left out (the page
// draws them as still on their way) and the type is measured by a rough stand-in.
//
// Every tale, every spread, both sides, in each language, as a spread and as a phone's column, for
// every state its choices can be in (none made yet, then each way of making them in order); on a
// choice page also each moment the choice block draws (sealing, the glint, the pointer); each page
// bare, as a change of language draws it under the ink; and the riffle's Latin pages.
import { createPageArtist } from "../src/book/pageArt.js";
import { bindTales } from "../src/book/tales.js";
import { storyFor } from "../src/book/story.js";

const W = 1024;
const H = 1413;
const gradient = { addColorStop() {} };
const context = () =>
  new Proxy(
    {},
    {
      get(own, key) {
        if (key in own) return own[key];
        if (key === "measureText") return (s) => ({ width: String(s).length * 10, actualBoundingBoxAscent: 8, actualBoundingBoxDescent: 2 });
        if (/^create(Linear|Radial|Conic)Gradient$|^createPattern$/.test(key)) return () => gradient;
        if (key === "getImageData") return (x, y, w, h) => ({ data: new Uint8ClampedArray(Math.max(1, w * h * 4)) });
        if (key === "getTransform") return () => ({ a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 });
        if (key === "canvas") return { width: W, height: H };
        return () => {};
      },
      set(own, key, value) {
        own[key] = value;
        return true;
      },
    },
  );
const canvas = () => ({ width: W, height: H, getContext: () => context() });
globalThis.document = { createElement: canvas };
globalThis.Path2D = class {
  moveTo() {}
  lineTo() {}
  arc() {}
  arcTo() {}
  ellipse() {}
  rect() {}
  bezierCurveTo() {}
  quadraticCurveTo() {}
  closePath() {}
  addPath() {}
};

const artist = createPageArtist({ parchment: canvas(), grain: canvas(), images: new Map() });
const failures = [];
let draws = 0;
const attempt = (what, fn) => {
  try {
    fn();
    draws++;
  } catch (err) {
    failures.push(`${what}: ${err.stack?.split("\n").slice(0, 3).join(" | ") || err}`);
  }
};

for (const tale of bindTales().filter((t) => t.available)) {
  const S = storyFor(tale.id);
  const pages = S.CHOICE_PAGES;
  // the choices as a reader can hold them: none yet, then the first k made, every way
  const states = [{}];
  for (const p of pages) {
    for (const prev of states.filter((s) => Object.keys(s).length === pages.indexOf(p))) {
      for (const o of S.choiceOptions(p)) states.push({ ...prev, [p]: o.id });
    }
  }
  for (const lang of ["pl", "en"]) {
    for (const column of [false, true]) {
      for (const choices of states) {
        const resolved = Object.fromEntries(pages.map((p) => [p, S.resolvedChoice(choices, p)]));
        const ctx = { tale: tale.id, spreads: tale.spreads, lang, choices, resolved, column };
        const key = `${tale.id} ${lang}${column ? " column" : ""} choices=${pages.map((p) => choices[p] || "-").join(",")}`;
        tale.spreads.forEach((spread, i) => {
          let plan = null;
          attempt(`${key} spread ${i} plan`, () => (plan = artist.plan(spread, ctx)));
          for (const side of ["left", "right"]) {
            const at = `${key} spread ${i} ${side}`;
            attempt(at, () => artist.drawPage(canvas(), spread, side, ctx));
            attempt(`${at} bare`, () => artist.drawPage(canvas(), spread, side, ctx, { bare: true }));
            if (!plan?.[side]?.choice) continue;
            const made = choices[spread.page];
            const ids = S.choiceOptions(spread.page).map((o) => o.id);
            const moments = made ? { seal: { fresh: true }, glint: { glint: true }, calm: { glint: true, calm: true } } : { glint: { glint: true }, calm: { glint: true, calm: true }, hover: { levels: { [ids[0]]: 0.7, [ids[1]]: 0.2 } } };
            for (const [name, anim] of Object.entries(moments)) {
              attempt(`${at} ${name}`, () => {
                anim.capture = true;
                artist.drawPage(canvas(), spread, side, ctx, { seal: anim });
                if (!anim.draw) throw new Error("the choice block gave no moment to draw");
                for (const p of [0, 0.1, 0.3, 0.5, 0.75, 1]) anim.draw(context(), p);
              });
            }
          }
        });
      }
    }
  }
}
for (let i = 0; i < 8; i++) attempt(`Latin page ${i}`, () => artist.drawGeneric(canvas(), i));

if (failures.length) {
  console.error(`${failures.length} page draw(s) failed:`);
  for (const f of failures.slice(0, 20)) console.error(`- ${f}`);
  if (failures.length > 20) console.error(`... and ${failures.length - 20} more`);
  process.exit(1);
}
console.log(`Page check passed: ${draws} pages and moments drawn without error.`);
