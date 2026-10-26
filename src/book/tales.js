// The tales bound into the book, in binding order, and the silk ribbon that marks each one.
//
// A tale is interactive (its ribbon can be hovered, tapped, focused) only when `available` is
// true. Adding a tale = adding its spread manifest here and flipping `available`; its ribbon
// wakes up on its own. Tales without spreads open at a placeholder title spread.
//
//   id         stable id (matches stories.js where the tale exists there)
//   title      { pl, en }
//   kicker     { pl, en } one line under the title on the title page
//   ribbon     color   – silk colour (sRGB hex), muted medieval dyes
//              motif   – gold-thread mark embroidered near the cut end: flame | bell | star | trefoil
//   available  whether the reader can open the tale in this prototype
//   spreads    spread manifest (see pages.js); omitted = placeholder title spread
//   length     spreads the tale occupies in the binding (for the page-block thickness and where
//              its ribbon sits); defaults to spreads.length, or NOMINAL_SPREADS when unknown
//   epigraph   { pl, en: { lines, author, work, note? } } the quotation on the left page of the
//              title spread (lines as set; note = a smaller line under the attribution); without
//              one the page carries the book's dedication
//
// Review (dev server only): ?tales=4 marks every tale available (placeholder title spreads), so
// switching between tales can be tested end to end before their pages exist.
import { stories } from "../../stories.js";
import { storyTranslations } from "../../locales.js";
import { dragonSpreads, moonhillSpreads } from "./pages.js";

export const NOMINAL_SPREADS = 11;

const fromStories = (id) => {
  const s = stories.find((x) => x.id === id);
  const pl = storyTranslations.pl[id];
  return s ? { title: { pl: pl?.title || s.title, en: s.title }, kicker: { pl: pl?.kicker || s.kicker, en: s.kicker } } : null;
};

export const tales = [
  {
    id: "dragon-bridge",
    ...fromStories("dragon-bridge"),
    ribbon: { color: "#7a3026", motif: "flame" }, // madder red
    available: true,
    spreads: dragonSpreads,
    epigraph: {
      pl: { lines: ["„Dobrze widzi się tylko sercem.", "Najważniejsze jest", "niewidoczne dla oczu.”"], author: "Antoine de Saint-Exupéry", work: "Mały Książę" },
      en: { lines: ["“It is only with the heart", "that one can see rightly;", "what is essential", "is invisible to the eye.”"], author: "Antoine de Saint-Exupéry", work: "The Little Prince" },
    },
  },
  {
    id: "moonhill-bell",
    ...fromStories("moonhill-bell"),
    ribbon: { color: "#3d5672", motif: "bell" }, // woad blue
    available: true,
    spreads: moonhillSpreads,
    epigraph: {
      pl: { lines: ["„Gdyby więcej z nas ceniło jadło,", "radość i piosenki", "wyżej niż zgromadzone złoto,", "świat byłby weselszy.”"], author: "J.R.R. Tolkien", work: "Hobbit", note: "tłum. własne" },
      en: { lines: ["“If more of us valued food", "and cheer and song", "above hoarded gold,", "it would be a merrier world.”"], author: "J.R.R. Tolkien", work: "The Hobbit" },
    },
  },
  {
    id: "tale-three",
    title: { pl: "Opowieść trzecia", en: "The Third Tale" },
    kicker: { pl: "Jeszcze niespisana", en: "Not yet written" },
    ribbon: { color: "#857c40", motif: "star" }, // weld, a yellow-green ochre
    available: false,
  },
  {
    id: "tale-four",
    title: { pl: "Opowieść czwarta", en: "The Fourth Tale" },
    kicker: { pl: "Jeszcze niespisana", en: "Not yet written" },
    ribbon: { color: "#56385a", motif: "trefoil" }, // deep (orchil) purple
    available: false,
  },
];

// UI strings for the tale ribbons and the placeholder title spreads.
export const taleUi = {
  pl: {
    talesLabel: "Opowieści w księdze",
    goToTale: (t) => `Wstążka: ${t}. Otwórz początek opowieści`,
    placeholderNote: "Ta opowieść jeszcze się pisze.\nJej wstążka czeka na strony.",
    placeholderHint: "Miejsce na nową opowieść",
    comingSoon: "Wkrótce", // the ribbon tooltip of a tale not written yet
  },
  en: {
    talesLabel: "Tales in the book",
    goToTale: (t) => `Ribbon: ${t}. Open the beginning of the tale`,
    placeholderNote: "This tale is still being written.\nIts ribbon is waiting for pages.",
    placeholderHint: "A place for a new tale",
    comingSoon: "Coming soon",
  },
};

// Applies the review switch (?tales=4 → every tale available) and fills in spreads and lengths.
export function bindTales({ allAvailable = false } = {}) {
  let offset = 0;
  return tales.map((t, index) => {
    const available = t.available || allAvailable;
    const spreads = (t.spreads || (available ? [{ page: 0, layout: "taleTitle", tale: t }] : [])).map((s) => ({ ...s, taleId: t.id }));
    const length = t.length || (t.spreads ? t.spreads.length : NOMINAL_SPREADS);
    const out = { ...t, index, available, spreads, length, offset };
    offset += length;
    return out;
  });
}
