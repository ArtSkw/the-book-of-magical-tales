// Story text for the 3D book, resolved the same way app.js does it:
// translation first, then paragraphByChoice replacements, then the echo line
// (inserted after the first paragraph), for every choice page of every tale.
import { stories } from "../../stories.js";
import { storyTranslations, uiText } from "../../locales.js";

// Every tale of stories.js, bound by id: storyFor("moonhill-bell").pageText(3, resolved, "pl").
const cache = new Map();

export function storyFor(id) {
  if (cache.has(id)) return cache.get(id);
  const story = stories.find((s) => s.id === id);
  if (!story) return null;
  const storyPl = storyTranslations.pl[id] || { pages: [] };

  // 1-based story page numbers that hold a choice, e.g. [2, 4, 6, 8]
  const CHOICE_PAGES = story.pages.flatMap((p, i) => (p.choices?.length ? [i + 1] : []));

  function choiceOptions(pageNumber, lang) {
    const base = story.pages[pageNumber - 1];
    const tr = lang === "pl" ? storyPl.pages[pageNumber - 1] || {} : {};
    return (base.choices || []).map((c, i) => ({ ...c, ...(tr.choices?.[i] || {}) }));
  }

  // The id chosen on a choice page, or the first option when the reader has not chosen yet.
  function resolvedChoice(choices, pageNumber) {
    return choices[pageNumber] || story.pages[pageNumber - 1].choices[0].id;
  }

  // Applies a { sourcePageIndex(0-based): { choiceId: value } } map.
  function byChoice(map, choices) {
    if (!map) return [];
    return Object.entries(map).map(([srcIndex, variants]) => variants[resolvedChoice(choices, Number(srcIndex) + 1)]).filter(Boolean);
  }

  function pageText(pageNumber, choices, lang = "pl") {
    const index = pageNumber - 1;
    const base = story.pages[index];
    const tr = lang === "pl" ? storyPl.pages[index] || {} : {};
    const body = [...(tr.body || base.body)];
    for (const variant of byChoice(tr.paragraphByChoice || base.paragraphByChoice, choices)) {
      for (const [i, text] of Object.entries(variant)) body[Number(i)] = text;
    }
    const echo = byChoice(tr.echoes || base.echoes, choices)[0] || null;
    const paragraphs = body.map((text) => ({ text, kind: "body" }));
    if (echo) paragraphs.splice(1, 0, { text: echo, kind: "echo" });
    return {
      pageNumber,
      title: tr.title || base.title,
      paragraphs,
      choices: choiceOptions(pageNumber, lang),
      note: byChoice(tr.curiosityNoteByChoice || base.curiosityNoteByChoice, choices)[0] || tr.curiosityNote || base.curiosityNote || null,
      ending: Boolean(base.ending),
    };
  }

  // The choice pages whose choice rewrites this page (its paragraphs, echo line or note), e.g. [4].
  function dependsOn(pageNumber) {
    const base = story.pages[pageNumber - 1] || {};
    const tr = storyPl.pages[pageNumber - 1] || {};
    const maps = [base.paragraphByChoice, base.echoes, base.curiosityNoteByChoice, tr.paragraphByChoice, tr.echoes, tr.curiosityNoteByChoice];
    return [...new Set(maps.flatMap((m) => Object.keys(m || {}).map((k) => Number(k) + 1)))];
  }

  function storyMeta(lang) {
    return {
      title: lang === "pl" ? storyPl.title : story.title,
      kicker: lang === "pl" ? storyPl.kicker : story.kicker,
    };
  }

  const api = { id, PAGE_COUNT: story.pages.length, CHOICE_PAGES, choiceOptions, resolvedChoice, dependsOn, pageText, storyMeta };
  cache.set(id, api);
  return api;
}

export const ui = {
  pl: {
    ...uiText.pl,
    bookTitle: "Księga Magicznych Opowieści",
    bookSubtitle: "The Book of Magical Tales",
    titlePage: "Strona tytułowa",
    intro: "Wstęp", // the page plaque on the title spread
    theEnd: "Koniec", // ... and on a tale's last page
    dedication: "Dla tych, którzy czytają razem,\npo jednej stronie, przy jednej świecy.",
    turnToBegin: "Przewróć stronę, by zacząć",
    choose: "Wybierz:",
    chosen: "wybrane",
    next: "Następna strona",
    nextAfterChoice: "Następna strona. Najpierw wybierz, co dalej", // while the spread holds a choice
    awaitsChoice: "czeka na twój wybór", // ... said with the page number on the plaque
    turnsAfterChoice: "Strona przewróci się dopiero po wyborze.", // ... and under the choices
    prev: "Poprzednia strona",
    langLabel: "Język",
    illustration: "Ilustracja",
    skipIntro: "Dotknij, aby otworzyć księgę",
  },
  en: {
    ...uiText.en,
    bookTitle: "The Book of Magical Tales",
    bookSubtitle: "Księga Magicznych Opowieści",
    titlePage: "Title page",
    intro: "Intro",
    theEnd: "The End",
    dedication: "For those who read together,\none page at a time, by one candle.",
    turnToBegin: "Turn the page to begin",
    choose: "Choose:",
    chosen: "chosen",
    next: "Next page",
    nextAfterChoice: "Next page. Make a choice first",
    awaitsChoice: "waiting for your choice",
    turnsAfterChoice: "The page turns once you have chosen.",
    prev: "Previous page",
    langLabel: "Language",
    illustration: "Illustration",
    skipIntro: "Tap to open the book",
  },
};
