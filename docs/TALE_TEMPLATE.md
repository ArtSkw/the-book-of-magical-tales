# Tale Template

Use this template when adding a new tale to the book.

For the full production process, follow `docs/NEW_STORY_WORKFLOW.md`. This template is the story data, the book's rules and the quality checklist used during that workflow.

The tone and values come from `BRIEF.md`; how sentences, choices and wonder are written comes from `docs/WRITING_BIBLE.md`. Where the brief describes the original 2D app (CSS animations, tap-to-animate illustrations, a 2D layout), the 3D book has replaced it; the rules below are the current ones.

## Book Rules

`npm run validate:stories` checks every rule marked ✓, for English and Polish alike.

- ✓ 9-10 pages, preferably 10.
- ✓ 3 short paragraphs per page (in `body`, or in each option of `bodyByChoice`).
- ✓ Choice pages on pages 2, 4, 6, and 8, each with exactly **2** options.
- ✓ Every page needs `title`, `body`, `choices` (an empty array on pages without a choice); every choice needs `id`, `label`, `response`.
- ✓ A choice label fits on one line of the wax-seal tab: at most **38 characters**. A response fits in two lines: at most **110 characters** (sizes: `docs/TYPE_SCALE.md`).
- ✓ Exactly one page has `ending: true`: the last one. It has no choices and its last paragraph is `"The end."` in English and `"Koniec."` in Polish.
- ✓ The page after a choice page (3, 5, 7, 9) is written whole for each option in `bodyByChoice`; it needs no shared `body`. Echo lines (`echoes`) are retired.
- ✓ An earlier choice may come back as single paragraphs (`paragraphByChoice`), every option covered, each paragraph rewritten by one choice at most, never on top of that choice's own whole page; the ending's last paragraph stays "The end." / "Koniec.".
- ✓ The translation carries every text field the English page has (`body`, `bodyByChoice`, `paragraphByChoice`, notes), or English would show.
- ✓ The first paragraph of every page and variant opens with a letter (it carries the illuminated initial): start with narration, not dialogue.
- ✓ The book never appears inside a tale ("księga", "book"); more than one "jakby" / "as if" on a page is a warning.
- ✓ 3-4 curiosity notes per tale (`curiosityNote` or `curiosityNoteByChoice`), each body at most **220 characters** (four lines under the picture). Three is the minimum; add a fourth only when the story has a genuinely worthwhile topic.
- ✓ A page has a choice **or** a curiosity note, never both: under the picture there is room for one or the other. In practice notes sit on the odd consequence pages (1, 3, 5, 7, 9).
- ✓ Every picture the tale's spread manifest (`src/book/pages.js`) names exists under `public/`, spelled exactly (GitHub Pages is case-sensitive).
- Every page needs a distinct illustration composition. Page 1 can be a cover-like wide tableau; later pages should vary between close-ups, medium scenes, detail vignettes, low views, object-focused images, group scenes, and final tableaux.
- The picture's format follows the page: a page with a choice or a note gets a framed **5:4 plate** with the choices or the note under it; a page with neither gets a **2:3 portrait**. The ending page runs its text across both pages, with a closing emblem instead of a picture. Plan compositions for the right format from the start.
- Choices should be kind, valid, nonviolent, and softly acknowledged later.
- Do not add retired discussion-prompt fields, explicit value-label fields, choice-based value-label maps, or the 2D app's art and animation fields (`art*`, `cue*`, `visual*`, `illustration`). The book does not use them.
- Keep middle pages grounded in action, sensory detail, practical causes, and visible consequences. Save explicit value summary for the final page.
- Every tale should be written Polish-first, then adapted into English. Polish should define the read-aloud rhythm, folk-tale warmth, page titles, and emotional pacing; English should preserve the same structure and image beats while reading naturally.

## How The Book Shows The Data

- **Title spread** (before page 1): the epigraph on the left (`epigraph` in `src/book/tales.js`), on the right the book's name, the tale's `title` and `kicker`, and the title emblem.
- **Page:** the left page carries only the title and the text (and a small marginal ornament, the `tailpiece`, when there is room), the right page the picture. The text is sized to fit the left page, so keep paragraphs short.
- **After a choice:** the next page is the chosen option's own page (`bodyByChoice`), with that option's picture. An earlier choice can return later as one paragraph (`paragraphByChoice`). There is no echo line.
- **Choice:** two tabs with wax seals under the plate. The chosen seal is pressed and its `response` is written in under the tabs. The reader cannot turn on until they have chosen.
- **Curiosity note:** under the plate, titled "Did you know...?" / "Czy wiesz, że...?". `curiosityNoteByChoice` lets the note itself depend on an earlier choice.
- **Ending page:** the text runs over both pages: the first half with the closing emblem under it on the left, the rest with a small ornament and the "Begin again" button on the right.
- **Ribbon:** each tale has a silk ribbon in the book (colour and an embroidered motif) that opens its title spread.
- `shortTitle` is still required by the validator but no longer shown.

## New Tale Production Checklist

Use this checklist before considering a tale ready for review:

- [ ] Story seed is defined: place, problem, core value direction, medieval detail, fantasy detail, educational hook, and emotional arc.
- [ ] Polish version is drafted first and uses the current Polish tales as the tone reference.
- [ ] Page titles describe concrete story moments rather than abstract translated phrases.
- [ ] Tale has preferably 10 pages.
- [ ] Every page has 3 short read-aloud paragraphs.
- [ ] Choice pages are balanced, have 2 options each, and every choice is kind, valid, nonviolent, and softly acknowledged later.
- [ ] The tale card (`docs/WRITING_BIBLE.md`, §3) is filled in before drafting.
- [ ] Every page after a choice is written whole for each option, every path is a real, different way through, and at least one earlier choice returns later (usually in the ending).
- [ ] Every page passes the questions of the writing bible, §5: why is this here, where did it come from, what does it change next.
- [ ] Middle pages do not over-explain the moral; values are shown through what characters notice, decide, repair, carry, wait for, or protect.
- [ ] The final page ends clearly with `"Koniec."` in Polish and `"The end."` in English.
- [ ] 3-4 curiosity notes are included, on pages without a choice, with 3 as the minimum and 4 only for a genuinely worthwhile topic.
- [ ] English is adapted after Polish, preserving meaning and page beats while reading naturally.
- [ ] The tale's set bible (`docs/pilot/SET_BIBLE_<tale-id>.md`) holds its cast, place, story state and colour script.
- [ ] Layout pass with draft pictures is complete in both languages before final images are generated.
- [ ] Every page and choice variant has an illustration brief with a distinct composition in the right format (plate 5:4 or portrait 2:3).
- [ ] High-resolution images have been reviewed for story accuracy, style match, continuity, anatomy, and calm readability.
- [ ] Every picture has a short Polish and English `alt` text in `src/book/pages.js`.
- [ ] Title emblem, epigraph and ribbon are set in `src/book/tales.js`.
- [ ] The tale's sound script is in `src/book/soundscape.js`: one bed per place and time, at most two quiet spot sounds per page, an intro and an ending theme.
- [ ] The book has been read through in both languages, every choice path, on a tablet, a phone (upright and sideways) and a desktop.
- [ ] `npm run validate:stories`, `npm run check:pages`, `npm run build` and `npm run sfx:check` pass.
- [ ] Owner review is complete before the tale goes to `main`.

## Story Planning Pass

Before writing the JS object, outline:

- **Medieval detail:** craft, place, object, custom, tool, food, weather sign, map, song, garden, animal care, or village duty.
- **Fantasy detail:** creature, old oath, gentle magic, hidden path, enchanted object, wise animal, moon/star sign, tiny folk, or forest spirit.
- **Developmental focus:** responsive listening, emotional naming, co-regulation, cooperation, repair, gratitude, patience, courage, honesty, or stewardship.
- **Educational thread:** what the child learns through action, not exposition.
- **Final reflection:** what changed, what was repaired, and what the tale leaves the child remembering.
- **Illustration rhythm:** one distinct composition per page, with the focal subject, camera scale and format (plate or portrait) named before image generation.
- **Places and times:** where each page happens and at what time of day. This colour script drives the grading of the pictures and the sound beds.
- **Curiosity hooks:** three concrete topics from the tale, such as a craft, animal, plant, medieval object, village custom, food, weather sign, or old belief.
- **Bilingual voice:** the Polish source wording first, then the English adaptation approach, including any names or terms that should remain consistent.

## Curiosity Note Pass

After drafting the story, choose 3-4 pages without a choice for curiosity notes:

- Tie every note to something visible or mentioned on that page.
- Keep each note short, warm, and wonder-based rather than encyclopedic: at most 220 characters in each language.
- Use 3 notes as the default. Add a fourth only when research or story content provides a truly interesting, child-friendly hook.
- Prefer real-world details children can imagine: mills, bridges, bells, birds, reeds, orchards, candles, village work, tools, food, or old customs.
- Avoid frightening historical facts, violence, disease, punishment, or anything that pulls the tale out of its gentle mood.
- Write the Polish note first, then adapt it into natural English.
- Do not add notes to every page; rarity should make each note feel like a small discovery.
- When a consequence page shows a different object depending on the choice, the note can follow it with `curiosityNoteByChoice`.

## Polish-First Writing Pass

When adding or rewriting a tale:

- Draft the Polish version first as original children's folk-fantasy prose.
- Preserve page count, paragraph count, choice IDs, choice meaning, payoffs, and illustration alignment when adapting into English.
- Follow `docs/WRITING_BIBLE.md`: every detail has a reason or a payoff, every action a visible cause, magic is a rule of the world, the book never appears inside the tale, one comparison per page at most.
- Use warm, clear, read-aloud Polish phrasing with oral rhythm and occasional soft repetition.
- Use grounded, descriptive story movement: concrete actions, practical reasons, sensory details, and visible consequences.
- Avoid frequent morals, metaphors, and abstract summaries in the middle of the tale. Let the final page carry the clear value reflection.
- Prefer grounded Polish diction: "wioska", "młyn", "sad", "potok", "bochenek", "płótno", "dzwonnica", "ścieżka", "łąka".
- Avoid awkward calques, stiff word order, and overly ornate pseudo-medieval diction.
- Avoid gendered second-person phrases when possible. Prefer neutral wording such as "Po tym wyborze..." or "Dzięki temu...".
- Add 3-4 curiosity notes per tale, written as short wonder-sparking facts tied to concrete page content.
- Adapt into English second, preserving meaning and page beats without copying Polish syntax too literally.
- When a picture shows something slightly differently from the text and the picture is better, change the text (the dragon's "pebble" became a "stone").
- Check both language versions in the book after the pass.

## 10-Page Rhythm

1. **Invitation:** place, mood, and small problem.
2. **First clue + choice:** child chooses how to begin kindly.
3. **Consequence:** acknowledge the first choice.
4. **Wider problem + choice:** a new complication or helper appears.
5. **Consequence:** acknowledge the second choice.
6. **Mending/listening + choice:** child chooses how to continue carefully.
7. **Deeper understanding:** the problem is reframed.
8. **Final choice:** closing gesture, promise, or welcome.
9. **Resolution:** repair, understanding, return, comfort, or protection.
10. **Reflection and ending:** final choice is acknowledged, the tale gathers its main values, and it ends with `"Koniec."` in Polish and `"The end."` in English.

## Copyable Skeletons

### English story: `stories.js`

The English text and the shared structure (choice ids, which pages are rewritten by which choice, notes and the ending).

```js
{
  id: "new-tale-id",
  shortTitle: "Ribbon Title",
  title: "The Full Tale Title",
  kicker: "A tale of ...",
  pages: [
    {
      title: "Page One Title",
      body: [
        "Paragraph one: place, mood, sensory detail, or action.",
        "Paragraph two: character feeling, discovery, dialogue, or complication.",
        "Paragraph three: concrete consequence, next action, or setup for what matters."
      ],
      choices: [],
      curiosityNote: { title: "Did you know...?", body: "Short curiosity note tied to this page topic (max 220 characters)." },
    },
    {
      title: "Page Two Choice",
      body: [
        "Paragraph one.",
        "Paragraph two.",
        "Paragraph three that invites a kind choice."
      ],
      choices: [
        {
          id: "choice-a",
          label: "Kind action A",
          response: "Immediate gentle response for choice A."
        },
        {
          id: "choice-b",
          label: "Kind action B",
          response: "Immediate gentle response for choice B."
        }
      ],
    },
    {
      title: "Page Three Consequence",
      // the whole page, once per option of the choice on page 2 (0-based key 1)
      bodyByChoice: {
        1: {
          "choice-a": ["Paragraph one as it happens after A.", "Paragraph two.", "Paragraph three."],
          "choice-b": ["Paragraph one as it happens after B.", "Paragraph two.", "Paragraph three."]
        }
      },
      choices: [],
    },
    {
      title: "Page Four Choice",
      body: [
        "Paragraph one.",
        "Paragraph two.",
        "Paragraph three."
      ],
      choices: [
        { id: "choice-c", label: "Kind action C", response: "Immediate gentle response for choice C." },
        { id: "choice-d", label: "Kind action D", response: "Immediate gentle response for choice D." }
      ],
    },
    {
      title: "Page Five Consequence",
      bodyByChoice: {
        3: {
          "choice-c": ["...", "...", "..."],
          "choice-d": ["...", "...", "..."]
        }
      },
      choices: [],
      // a note that follows the choice made on page 4 (or a plain curiosityNote)
      curiosityNoteByChoice: {
        3: {
          "choice-c": { title: "Did you know...?", body: "A note about what action C brought into the scene." },
          "choice-d": { title: "Did you know...?", body: "A note about what action D brought into the scene." }
        }
      },
    },
    // pages 6-9 follow the same pattern: 6 and 8 are choice pages, 7 and 9 pages after a choice
    // (bodyByChoice 5 / 7), notes on 7 and/or 9. A choice page may open with a paragraph that an
    // earlier choice brings back: paragraphByChoice: { 5: { "choice-e": { 0: "..." }, ... } } on page 8
    {
      title: "Page Ten Ending",
      body: [
        "Paragraph one.",
        "Paragraph two.",
        "The end."
      ],
      // the ending: the last gesture opens it, the first choice returns in its closing saying
      paragraphByChoice: {
        7: { "choice-g": { 0: "..." }, "choice-h": { 0: "..." } },
        1: { "choice-a": { 1: "..." }, "choice-b": { 1: "..." } }
      },
      choices: [],
      ending: true
    }
  ]
}
```

### Polish text: `locales.js` (`storyTranslations.pl["new-tale-id"]`)

The same pages in the same order. A translated field replaces the English one; choices are merged option by option, so they carry no `id`; `bodyByChoice`, `paragraphByChoice` and notes use the same page keys and choice ids as `stories.js`.

```js
"new-tale-id": {
  shortTitle: "Tytuł na wstążkę",
  title: "Pełny tytuł opowieści",
  kicker: "Opowieść o ...",
  pages: [
    {
      title: "Tytuł pierwszej strony",
      body: ["Akapit pierwszy.", "Akapit drugi.", "Akapit trzeci."],
      curiosityNote: { title: "Czy wiesz, że...?", body: "Krótka ciekawostka (do 220 znaków)." },
    },
    {
      title: "Strona z wyborem",
      body: ["...", "...", "..."],
      choices: [
        { label: "Życzliwe działanie A", response: "Łagodna odpowiedź na wybór A." },
        { label: "Życzliwe działanie B", response: "Łagodna odpowiedź na wybór B." }
      ],
    },
    {
      title: "Strona po wyborze",
      bodyByChoice: { 1: { "choice-a": ["...", "...", "..."], "choice-b": ["...", "...", "..."] } },
    },
    // ...
    {
      title: "Zakończenie",
      body: ["...", "...", "Koniec."],
      paragraphByChoice: { 7: { "choice-g": { 0: "..." }, "choice-h": { 0: "..." } }, 1: { "choice-a": { 1: "..." }, "choice-b": { 1: "..." } } },
    }
  ]
}
```

### Pictures: `src/book/pages.js`

One entry per spread; the field reference is the comment at the top of the file. A page whose picture depends on a choice names the choice page in `variantFrom` and keys `images` by choice id.

```js
const NT = `${V}/new-tale-id`;

export const newTaleSpreads = [
  { page: 0, layout: "title", images: { default: img(`${NT}/title.webp`, "Opis medalionu.", "The medallion described.") } },
  { page: 1, tailpiece: `${OR}/oak-wren.webp`, images: { default: img(`${NT}/p1.webp`, "Co widać na obrazku.", "What the picture shows.") } },
  { page: 2, tailpiece: `${OR}/reeds-dragonfly.webp`, images: { default: img(`${NT}/p2.webp`, "...", "...") } },
  {
    page: 3, tailpiece: `${OR}/fleuron.webp`, variantFrom: 2,
    images: {
      "choice-a": img(`${NT}/p3-choice-a.webp`, "...", "..."),
      "choice-b": img(`${NT}/p3-choice-b.webp`, "...", "..."),
    },
  },
  // ...
  {
    page: 10, layout: "vignette", variantFrom: 8, secondary: img(`${OR}/fleuron.webp`, "Ozdobnik.", "An ornament."),
    images: {
      "choice-g": img(`${NT}/p10-choice-g.webp`, "...", "..."),
      "choice-h": img(`${NT}/p10-choice-h.webp`, "...", "..."),
    },
  },
];
```

### Binding: `src/book/tales.js`

The book has four ribbons; a new tale takes the slot of a placeholder (`tale-three`, `tale-four`) and keeps its ribbon, or gets a colour and motif of its own (`flame | bell | star | trefoil`).

```js
{
  id: "new-tale-id",
  ...fromStories("new-tale-id"),
  ribbon: { color: "#857c40", motif: "star" }, // weld, a yellow-green ochre
  available: true,
  spreads: newTaleSpreads,
  epigraph: {
    pl: { lines: ["„Pierwszy wers,", "drugi wers.”"], author: "Autor", work: "Dzieło", note: "tłum. własne" },
    en: { lines: ["“First line,", "second line.”"], author: "Author", work: "Work" },
  },
},
```
