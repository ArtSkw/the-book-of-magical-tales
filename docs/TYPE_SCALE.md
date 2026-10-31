# Type Scale

Every piece of text in the book has a role, and every role is one step of a single scale. A new
kind of text picks an existing role; it never gets a size of its own. The code is `typeSize(role)`
in `src/book/pageArt.js` (the pages) and the `--ui-*` tokens in `index.html` (the interface around
the book). Why: `docs/DECISIONS.md`, 2026-10-31.

## The pages

One modular scale: the house body, **42 page units**, times a **major second (1.125)** per step.
A page is 1024 units wide; the camera decides how many screen pixels that makes. Hierarchy comes
as much from weight, italic, small capitals and colour as from size, so the steps stay close, as
in a printed book.

| Role | Step | Size | Style | Used for |
|---|---|---|---|---|
| `display` | +5 | 76 | Semibold | a tale's title on its title page |
| `title` | +3 | 60 | Semibold | a page's heading; the fables glimpsed in a riffle |
| `body` | 0 | 42 (40–44 fitted) | Regular; italic for a kicker | a tale's text; the subtitle (kicker) on the title page |
| `quote` | −1 | 37 | Italic | the epigraph, the dedication, a placeholder tale's note |
| `label` | −1 | 37 | Semibold | the choice labels on the wax-seal tabs |
| `small` | −2 | 33 | Medium italic / Regular | the hint and response under the choices, the "Did you know" note, the "Begin again" clasp, the invitation to turn, the fleuron under it |
| `caption` | −4 | 26 | Regular | the folio, the book's name on a title page |
| `caps` | −5 | 23 | Semibold small capitals | the running head, an epigraph's source and note, *ex libris* |

Rules:

1. **Only the body is fitted.** A tale's body text takes the largest size of `SIZES` (44, 42,
   40 …) at which its longest page fits, so it may differ between tales and languages. Every
   other role has one size everywhere: on a plate page and on a text page, in every tale and
   language. The content limits in `validate-stories.js` (a label of 38 characters, a response of
   110, a note of 220) are measured at these sizes.
2. **On a phone, one rule.** Read upright, the camera frames only the text column and small print
   would read a size small, so `label` and `small` go up one step there (37 → 42, 33 → 37). Nothing
   else changes.
3. **Leading follows the role:** 1.42 for body and quote, about 1.38 for small print, 1.13 for the
   display title (`TITLE_LEAD`).
4. **Not on the scale:** drawings that happen to use type, such as the gilt initial's letter
   (sized to its box) and the placeholder shown while a picture loads.

## The interface

The controls around the book are HTML, measured in CSS pixels, with four tokens on `:root` in
`index.html`:

| Token | Size | Used for |
|---|---|---|
| `--ui-plaque` | 22px | the gilt plaque that opens the book |
| `--ui-text` | 18px | the page indicator, notices, the gilt buttons |
| `--ui-label` | 17px | small-caps controls (language), the ribbon's tip |
| `--ui-fine` | 15px | the length of the tale beside the page number |

The dev-only performance overlay keeps its monospace and is not part of the book.

## Next

A floor in screen pixels: the code already measures how large the body reads on a screen
(`bodyPx` in `src/book/main.js`). Once it has been measured on a real tablet and phone, a rule can
lift any role that would read under a set number of CSS pixels by one step.
