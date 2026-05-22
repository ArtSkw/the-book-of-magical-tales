import { stories } from "./stories.js";
import { illustrationCatalog } from "./illustrationCatalog.js";
import { renderedVisuals } from "./illustrations.js";

const EXPECTED_PAGE_MIN = 9;
const EXPECTED_PAGE_MAX = 10;
const EXPECTED_PARAGRAPHS = 3;
const EXPECTED_CHOICE_PAGES = [2, 4, 6, 8];
const MIN_CURIOSITY_NOTES = 3;

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

  const curiosityNotes = story.pages.filter((page) => page.curiosityNote);
  if (curiosityNotes.length < MIN_CURIOSITY_NOTES) {
    addError(story, `expected at least ${MIN_CURIOSITY_NOTES} curiosity notes, got ${curiosityNotes.length}`);
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
    if (!page.virtue) addError(story, `${label} missing virtue`);
    if (!Array.isArray(page.choices)) addError(story, `${label} choices must be an array`);

    if (page.curiosityNote) {
      if (!isPlainObject(page.curiosityNote)) {
        addError(story, `${label} curiosityNote must be an object`);
      } else {
        if (!page.curiosityNote.title) addError(story, `${label} curiosityNote missing title`);
        if (!page.curiosityNote.body) addError(story, `${label} curiosityNote missing body`);
        if (page.curiosityNote.body && page.curiosityNote.body.length > 280) {
          addError(story, `${label} curiosityNote should stay short`);
        }
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

    for (const field of ["echoes", "cueByChoice", "visualByChoice", "virtueByChoice"]) {
      if (page[field] && !isPlainObject(page[field])) {
        addError(story, `${label} ${field} must be an object`);
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
}

if (errors.length) {
  console.error("Story validation failed:");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log(`Story validation passed for ${stories.length} tales.`);
