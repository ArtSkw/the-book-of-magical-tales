import { readdirSync } from "node:fs";
import { stories } from "./stories.js";
import { storyTranslations } from "./locales.js";
// the 3D book's tales and their spread manifests (tales.js and pages.js hold data only)
import { tales } from "./src/book/tales.js";
import { allImageSources } from "./src/book/pages.js";

const EXPECTED_PAGE_MIN = 9;
const EXPECTED_PAGE_MAX = 10;
const EXPECTED_PARAGRAPHS = 3;
const EXPECTED_CHOICE_PAGES = [2, 4, 6, 8];
const MIN_CURIOSITY_NOTES = 3;
const MAX_CURIOSITY_NOTES = 4;

// What fits under the 5:4 plate on a right page of the 3D book (src/book/pageArt.js, PLATE),
// in every language: one line per choice label, at most two lines of response, a note of at most
// four lines. Measured in EB Garamond at the book's sizes (docs/TYPE_SCALE.md: label 37, small 33); checked for English and each translation.
const CHOICE_OPTIONS = 2;
const MAX_CHOICE_LABEL = 38;
const MAX_CHOICE_RESPONSE = 110; // two lines at the `small` size (33): 117 characters at worst, measured
const MAX_NOTE_BODY = 220;

const errors = [];
const TEXT_FIELDS = ["body", "bodyByChoice", "paragraphByChoice", "curiosityNote", "curiosityNoteByChoice"];
const BOOK_WORDS = { en: /\bbook\b/i, pl: /\bksi[ęe]g|\bksi[ąa]żk/i };
const AS_IF = { en: /\bas if\b|\bas though\b/gi, pl: /\bjakby\b/gi };
const warnings = [];

function addError(story, message) {
  errors.push(`${story.title}: ${message}`);
}

function isPlainObject(value) {
  return value && typeof value === "object" && !Array.isArray(value);
}

for (const story of stories) {
  if (!story.id) addError(story, "missing id");
  if (!story.shortTitle) addError(story, "missing shortTitle");
  if (!story.title) addError(story, "missing title");
  if (!story.kicker) addError(story, "missing kicker");
  if (!Array.isArray(story.pages)) addError(story, "pages must be an array");

  if (!Array.isArray(story.pages)) continue;

  if (story.pages.length < EXPECTED_PAGE_MIN || story.pages.length > EXPECTED_PAGE_MAX) {
    addError(story, `expected ${EXPECTED_PAGE_MIN}-${EXPECTED_PAGE_MAX} pages, got ${story.pages.length}`);
  }

  const endingPages = story.pages.filter((page) => page.ending);
  if (endingPages.length !== 1) {
    addError(story, `expected exactly one ending page, got ${endingPages.length}`);
  }

  // a note may also depend on an earlier choice (curiosityNoteByChoice): that page still has one note
  const curiosityNotes = story.pages.filter((page) => page.curiosityNote || page.curiosityNoteByChoice);
  if (curiosityNotes.length < MIN_CURIOSITY_NOTES) {
    addError(story, `expected at least ${MIN_CURIOSITY_NOTES} curiosity notes, got ${curiosityNotes.length}`);
  }
  if (curiosityNotes.length > MAX_CURIOSITY_NOTES) {
    addError(story, `expected no more than ${MAX_CURIOSITY_NOTES} curiosity notes, got ${curiosityNotes.length}`);
  }

  story.pages.forEach((page, index) => {
    const pageNumber = index + 1;
    const label = `page ${pageNumber}`;

    if (!page.title) addError(story, `${label} missing title`);
    // a page after a choice has a whole body per option (bodyByChoice) and needs no shared body
    if (!page.body && !page.bodyByChoice) {
      addError(story, `${label} needs a body or a bodyByChoice`);
    } else if (page.body && (!Array.isArray(page.body) || page.body.length !== EXPECTED_PARAGRAPHS)) {
      addError(story, `${label} expected ${EXPECTED_PARAGRAPHS} paragraphs, got ${Array.isArray(page.body) ? page.body.length : "no array"}`);
    }

    if (!Array.isArray(page.choices)) addError(story, `${label} choices must be an array`);

    if (page.curiosityNote) {
      if (!isPlainObject(page.curiosityNote)) {
        addError(story, `${label} curiosityNote must be an object`);
      } else {
        if (!page.curiosityNote.title) addError(story, `${label} curiosityNote missing title`);
        if (!page.curiosityNote.body) addError(story, `${label} curiosityNote missing body`);
        // its length is checked with the book limits below, for every language
      }
    }

    if (page.ending) {
      const finalParagraph = Array.isArray(page.body) ? page.body.at(-1) : "";
      if (finalParagraph !== "The end.") {
        addError(story, `${label} ending page must end with "The end."`);
      }
      if (page.choices?.length) {
        addError(story, `${label} ending page should not have choices`);
      }
    }

    page.choices?.forEach((choice, choiceIndex) => {
      const choiceLabel = `${label} choice ${choiceIndex + 1}`;
      if (!choice.id) addError(story, `${choiceLabel} missing id`);
      if (!choice.label) addError(story, `${choiceLabel} missing label`);
      if (!choice.response) addError(story, `${choiceLabel} missing response`);
    });

    if (page.echoes) {
      addError(story, `${label} has echoes; the italic echo line is retired (docs/DECISIONS.md 2026-10-31): write the whole page per choice in bodyByChoice`);
    }
    for (const field of ["bodyByChoice", "paragraphByChoice", "curiosityNoteByChoice"]) {
      if (page[field] && !isPlainObject(page[field])) {
        addError(story, `${label} ${field} must be an object`);
      }
    }
  });

  checkChoiceText(story);
  const actualChoicePages = story.pages
    .map((page, index) => (page.choices.length ? index + 1 : null))
    .filter(Boolean);

  if (JSON.stringify(actualChoicePages) !== JSON.stringify(EXPECTED_CHOICE_PAGES)) {
    addError(story, `expected choice pages ${EXPECTED_CHOICE_PAGES.join(", ")}, got ${actualChoicePages.join(", ") || "none"}`);
  }

  checkBookLimits(story);
}

// How choices shape the text, in English (stories.js) and each translation (locales.js):
// - the page right after a choice page is rewritten whole for each option (bodyByChoice), so the
//   consequence of a choice runs through the page, not through one added line;
// - an earlier choice may come back later as single paragraphs (paragraphByChoice), each paragraph
//   owned by one choice at most, and never on top of a whole-page variant of the same choice;
// - a translation carries every text field the English page has, or it would show English;
// - the book is never a character or a narrator inside a tale, and ornamental "as if" is rare.

function optionIds(story, sourceIndex) {
  return (story.pages[sourceIndex]?.choices || []).map((c) => c.id);
}

function checkChoiceText(story) {
  const languages = [["en", (i) => story.pages[i]], ...Object.entries(storyTranslations).map(([lang, tr]) => [lang, (i) => tr[story.id]?.pages?.[i] || {}])];
  story.pages.forEach((base, index) => {
    const pageNumber = index + 1;
    const prevIsChoice = index > 0 && story.pages[index - 1].choices?.length && !base.ending;
    for (const [lang, pageOf] of languages) {
      const page = pageOf(index);
      const label = `[${lang}] page ${pageNumber}`;
      if (lang !== "en") {
        for (const field of TEXT_FIELDS) {
          if (base[field] && !page[field]) addError(story, `${label} misses ${field}; the English one would show`);
        }
      }
      if (prevIsChoice) {
        const whole = page.bodyByChoice?.[index - 1];
        if (!isPlainObject(whole)) {
          addError(story, `${label} follows a choice and needs bodyByChoice[${index - 1}], a whole page per option`);
        } else {
          for (const id of optionIds(story, index - 1)) {
            const body = whole[id];
            if (!Array.isArray(body) || body.length !== EXPECTED_PARAGRAPHS || body.some((p) => typeof p !== "string" || !p.trim())) {
              addError(story, `${label} bodyByChoice "${id}" must be ${EXPECTED_PARAGRAPHS} paragraphs of text`);
            }
          }
        }
      }
      for (const src of Object.keys(page.bodyByChoice || {})) {
        if (!optionIds(story, Number(src)).length) addError(story, `${label} bodyByChoice source ${src} is not a choice page`);
      }
      const owner = {};
      for (const [src, variants] of Object.entries(page.paragraphByChoice || {})) {
        const ids = optionIds(story, Number(src));
        if (!ids.length) addError(story, `${label} paragraphByChoice source ${src} is not a choice page`);
        if (page.bodyByChoice?.[src]) addError(story, `${label} paragraphByChoice ${src} repeats a choice that already rewrites the whole page`);
        for (const id of ids) {
          if (!isPlainObject(variants?.[id])) addError(story, `${label} paragraphByChoice ${src} misses option "${id}"`);
        }
        for (const [id, replacements] of Object.entries(variants || {})) {
          for (const [i, text] of Object.entries(replacements || {})) {
            const n = Number(i);
            if (!Number.isInteger(n) || n < 0 || n >= EXPECTED_PARAGRAPHS) addError(story, `${label} paragraphByChoice ${src}/${id} has invalid paragraph index "${i}"`);
            if (typeof text !== "string" || !text.trim()) addError(story, `${label} paragraphByChoice ${src}/${id} paragraph ${i} must be text`);
            if (owner[n] !== undefined && owner[n] !== src) addError(story, `${label} paragraph ${n} is rewritten by two choices (${owner[n]} and ${src})`);
            owner[n] = src;
          }
        }
      }
      if (base.ending && Object.keys(owner).map(Number).includes(EXPECTED_PARAGRAPHS - 1)) {
        addError(story, `${label} the ending's last paragraph must stay "The end." / "Koniec."`);
      }
      // the first paragraph carries the illuminated initial, so it opens with a letter, not a quote
      const firsts = page.bodyByChoice ? Object.values(page.bodyByChoice).flatMap((v) => Object.values(v || {}).map((b) => b?.[0])) : [page.body?.[0]];
      for (const v of Object.values(page.paragraphByChoice || {})) for (const r of Object.values(v || {})) if (r?.[0]) firsts.push(r[0]);
      for (const t of firsts) {
        if (typeof t === "string" && !/^\p{L}/u.test(t)) addError(story, `${label} opens with "${t.slice(0, 12)}…"; the initial needs a letter (start with narration, not dialogue)`);
      }
      // the text a reader can meet on this page, every variant
      const texts = [page.title, ...(page.body || [])];
      for (const v of Object.values(page.bodyByChoice || {})) for (const body of Object.values(v || {})) texts.push(...(body || []));
      for (const v of Object.values(page.paragraphByChoice || {})) for (const r of Object.values(v || {})) texts.push(...Object.values(r || {}));
      const bookWord = BOOK_WORDS[lang];
      for (const t of texts) {
        if (bookWord && typeof t === "string" && bookWord.test(t)) addError(story, `${label} names the book inside the tale: "${t.slice(0, 70)}…"`);
      }
      const asIf = AS_IF[lang];
      if (asIf) {
        const variants = page.bodyByChoice ? Object.values(page.bodyByChoice).flatMap((v) => Object.values(v || {})) : [page.body || []];
        for (const body of variants) {
          const n = body.join(" ").match(asIf)?.length || 0;
          if (n > 1) warnings.push(`${story.title}: ${label} has ${n} "as if" comparisons; keep at most one, and only when it shows size, shape or sound`);
        }
      }
    }
  });
}

// The page rule of the 3D book (src/book/pages.js): the left page carries only text, the
// right page the picture (a 5:4 plate with the choices or the note under it, or a 2:3 portrait),
// chosen from the page's content when a spread gives no layout. Only the ending page runs its
// text over both pages round the closing emblem ("vignette").
for (const tale of tales) {
  if (!tale.spreads) continue;
  const story = stories.find((s) => s.id === tale.id);
  if (!story) {
    errors.push(`Book tale "${tale.id}": has spreads but no story with that id`);
    continue;
  }
  const endingPage = story.pages.findIndex((page) => page.ending) + 1;
  for (const spread of tale.spreads) {
    if (spread.layout === "vignette" && spread.page !== endingPage) {
      addError(story, `book spread for page ${spread.page} uses layout "vignette"; only the ending page (${endingPage || "none"}) may (leave layout out: text left, picture right)`);
    }
  }
}

// Every picture a spread manifest names (all its variants, tailpieces, ornaments) is a file
// under public/, spelled exactly (GitHub Pages is case-sensitive, a Mac's disk is not).
function inPublic(src) {
  let dir = new URL("./public/", import.meta.url);
  const parts = src.split("/").filter(Boolean);
  for (const [i, part] of parts.entries()) {
    let names;
    try {
      names = readdirSync(dir);
    } catch {
      return false;
    }
    if (!names.includes(part)) return false;
    dir = new URL(`${part}${i < parts.length - 1 ? "/" : ""}`, dir);
  }
  return true;
}
for (const tale of tales) {
  for (const src of allImageSources(tale.spreads || [])) {
    if (!src.startsWith("/assets/") || !inPublic(src)) {
      errors.push(`Book tale "${tale.id}": picture ${src} not found under public/`);
    }
  }
}

// The notes of a page as [where, note]: its own note and every note chosen by an earlier choice.
function notesOf(page) {
  const out = [];
  if (isPlainObject(page.curiosityNote)) out.push(["curiosityNote", page.curiosityNote]);
  for (const [sourcePage, variants] of Object.entries(page.curiosityNoteByChoice || {})) {
    for (const [choiceId, note] of Object.entries(variants || {})) out.push([`curiosityNoteByChoice ${sourcePage}/${choiceId}`, note]);
  }
  return out;
}

// Content limits of the 3D book's plate pages, for English (stories.js) and each translation
// (locales.js), resolved the way src/book/story.js does it: a translated field replaces
// the English one, choices are merged option by option.
function checkBookLimits(story) {
  const languages = [["en", () => ({})], ...Object.entries(storyTranslations).map(([lang, tales]) => [lang, (i) => tales[story.id]?.pages?.[i] || {}])];
  for (const [lang, translated] of languages) {
    story.pages.forEach((base, index) => {
      const tr = translated(index);
      const label = `[${lang}] page ${index + 1}`;
      const choices = (base.choices || []).map((choice, i) => ({ ...choice, ...(tr.choices?.[i] || {}) }));
      if (tr.choices && tr.choices.length !== (base.choices || []).length) {
        addError(story, `${label} has ${tr.choices.length} translated choices for ${(base.choices || []).length} options`);
      }
      if (choices.length && choices.length !== CHOICE_OPTIONS) {
        addError(story, `${label} has ${choices.length} choice options; the book's plate holds exactly ${CHOICE_OPTIONS}`);
      }
      choices.forEach((choice, i) => {
        if (choice.label && choice.label.length > MAX_CHOICE_LABEL) {
          addError(story, `${label} choice ${i + 1} label is ${choice.label.length} chars (max ${MAX_CHOICE_LABEL}, one line on the seal): "${choice.label}"`);
        }
        if (choice.response && choice.response.length > MAX_CHOICE_RESPONSE) {
          addError(story, `${label} choice ${i + 1} response is ${choice.response.length} chars (max ${MAX_CHOICE_RESPONSE}, two lines): "${choice.response}"`);
        }
      });
      const notes = notesOf({ curiosityNote: tr.curiosityNote || base.curiosityNote, curiosityNoteByChoice: tr.curiosityNoteByChoice || base.curiosityNoteByChoice });
      for (const [where, note] of notes) {
        if (note?.body && note.body.length > MAX_NOTE_BODY) {
          addError(story, `${label} ${where} is ${note.body.length} chars (max ${MAX_NOTE_BODY}, four lines under the plate)`);
        }
      }
      if (choices.length && notes.length) {
        addError(story, `${label} has choices and a curiosity note; under the plate there is room for one or the other (the note would be left out)`);
      }
    });
  }
}

for (const warning of warnings) console.warn(`warning: ${warning}`);

if (errors.length) {
  console.error("Story validation failed:");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log(`Story validation passed for ${stories.length} tales.`);
