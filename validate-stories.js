import { stories } from "./stories.js";
import { storyTranslations } from "./locales.js";
import { illustrationCatalog } from "./illustrationCatalog.js";
import { renderedVisuals } from "./illustrations.js";

const EXPECTED_PAGE_MIN = 9;
const EXPECTED_PAGE_MAX = 10;
const EXPECTED_PARAGRAPHS = 3;
const EXPECTED_CHOICE_PAGES = [2, 4, 6, 8];
const MIN_CURIOSITY_NOTES = 3;
const MAX_CURIOSITY_NOTES = 4;

// What fits under the 5:4 plate on a right page of the 3D book (prototypes/book/pageArt.js, PLATE),
// in every language: one line per choice label, at most two lines of response, a note of at most
// four lines. Measured in EB Garamond at the book's sizes; checked for English and each translation.
const CHOICE_OPTIONS = 2;
const MAX_CHOICE_LABEL = 38;
const MAX_CHOICE_RESPONSE = 120;
const MAX_NOTE_BODY = 220;

const errors = [];

for (const [family, familyCatalog] of Object.entries(illustrationCatalog)) {
  const rendered = new Set(renderedVisuals[family] || []);
  for (const visual of Object.keys(familyCatalog.visuals)) {
    if (!rendered.has(visual)) {
      errors.push(`Illustration catalog "${family}": visual "${visual}" has no renderer`);
    }
  }

  for (const visual of rendered) {
    if (!familyCatalog.visuals[visual]) {
      errors.push(`Illustration renderer "${family}": visual "${visual}" is missing from catalog`);
    }
  }
}

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
  if (!story.illustration) addError(story, "missing illustration");
  if (!Array.isArray(story.pages)) addError(story, "pages must be an array");

  const illustrationFamily = illustrationCatalog[story.illustration];
  if (story.illustration && !illustrationFamily) {
    addError(story, `unknown illustration family "${story.illustration}"`);
  }

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
    if (!Array.isArray(page.body)) {
      addError(story, `${label} body must be an array`);
    } else if (page.body.length !== EXPECTED_PARAGRAPHS) {
      addError(story, `${label} expected ${EXPECTED_PARAGRAPHS} paragraphs, got ${page.body.length}`);
    }

    if (!page.cue) addError(story, `${label} missing cue`);
    if (!page.visual) {
      addError(story, `${label} missing visual`);
    } else if (illustrationFamily && !illustrationFamily.visuals[page.visual]) {
      addError(story, `${label} unknown visual "${page.visual}" for illustration "${story.illustration}"`);
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

    for (const field of ["echoes", "paragraphByChoice", "cueByChoice", "visualByChoice"]) {
      if (page[field] && !isPlainObject(page[field])) {
        addError(story, `${label} ${field} must be an object`);
      }
    }

    if (page.echoes) {
      for (const [sourcePage, variants] of Object.entries(page.echoes)) {
        const paragraphVariants = page.paragraphByChoice?.[sourcePage];
        if (!isPlainObject(paragraphVariants)) {
          addError(story, `${label} paragraphByChoice missing variants for source page ${sourcePage}`);
          continue;
        }

        for (const choiceId of Object.keys(variants)) {
          const replacements = paragraphVariants[choiceId];
          if (!isPlainObject(replacements)) {
            addError(story, `${label} paragraphByChoice missing "${choiceId}" replacement`);
            continue;
          }

          const changedIndexes = Object.keys(replacements);
          if (changedIndexes.length < 2) {
            addError(story, `${label} paragraphByChoice "${choiceId}" should replace at least two paragraphs`);
          }

          for (const [paragraphIndex, paragraph] of Object.entries(replacements)) {
            const indexNumber = Number(paragraphIndex);
            if (!Number.isInteger(indexNumber) || indexNumber < 0 || indexNumber >= EXPECTED_PARAGRAPHS) {
              addError(story, `${label} paragraphByChoice "${choiceId}" has invalid paragraph index "${paragraphIndex}"`);
            }
            if (typeof paragraph !== "string" || !paragraph.trim()) {
              addError(story, `${label} paragraphByChoice "${choiceId}" paragraph ${paragraphIndex} must be text`);
            }
          }
        }
      }
    }

    if (page.visualByChoice && illustrationFamily) {
      for (const [sourcePage, variants] of Object.entries(page.visualByChoice)) {
        if (!isPlainObject(variants)) {
          addError(story, `${label} visualByChoice for page ${sourcePage} must be an object`);
          continue;
        }

        for (const visual of Object.values(variants)) {
          if (!illustrationFamily.visuals[visual]) {
            addError(story, `${label} unknown choice visual "${visual}" for illustration "${story.illustration}"`);
          }
        }
      }
    }
  });

  const actualChoicePages = story.pages
    .map((page, index) => (page.choices.length ? index + 1 : null))
    .filter(Boolean);

  if (JSON.stringify(actualChoicePages) !== JSON.stringify(EXPECTED_CHOICE_PAGES)) {
    addError(story, `expected choice pages ${EXPECTED_CHOICE_PAGES.join(", ")}, got ${actualChoicePages.join(", ") || "none"}`);
  }

  checkBookLimits(story);
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
// (locales.js), resolved the way prototypes/book/story.js does it: a translated field replaces
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

if (errors.length) {
  console.error("Story validation failed:");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log(`Story validation passed for ${stories.length} tales.`);
