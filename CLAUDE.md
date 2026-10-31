# The Book of Magical Tales: agent map

An interactive storybook in Polish and English for a parent and child to read
together: a three.js book open on a candle-lit desk, with an illustration on
every page and choices the tale remembers. Live at
https://artskw.github.io/the-book-of-magical-tales/. Main device: a tablet,
then a small laptop; phones are for personal tests.

`AGENTS.md` is a symlink to this file, so Codex reads the same map. The global
rules (`~/.claude/CLAUDE.md`) apply too.

## Where things live

| What | Where |
|---|---|
| The book (scene, reading, typesetting) | `index.html`, `src/book/` (`main.js`, `book.js`, `pageArt.js`) |
| Tales: text | `stories.js` (EN + shared structure), `locales.js` (PL) |
| Tales: pictures and binding | `src/book/pages.js`, `src/book/tales.js`, `public/assets/illustrations/v2/<tale>/` |
| Sound script / generated sound index | `src/book/soundscape.js` / `src/book/sounds.js` (generated) |
| Image pipeline (never ships) | `prototypes/` (`gen.sh`, `prompts/_build_*.py`, `grade.py`, `export_v2.sh`) |
| Sound pipeline (never ships) | `scripts/sfx/` |

## What to read for the task

- **Concept, values, nonviolence, story rules:** `BRIEF.md`
- **A new tale or story text:** `docs/WRITING_BIBLE.md` (craft rules, tale card, the journey), `docs/TALE_TEMPLATE.md`, then `docs/NEW_STORY_WORKFLOW.md`
- **Illustrations:** `docs/pilot/MANUSCRIPT_BIBLE.md` (style A v2, the forbidden
  list, §1.8a continuity) and `docs/pilot/SET_BIBLE_<tale>.md`. The prompt
  rules are encoded in `prototypes/prompts/_build_a2.py`, the source of truth.
- **Sound:** the header of `src/book/soundscape.js`, workflow §10
- **UI and motion polish:** `docs/pilot/ux-refs/`
- **Past decisions and rejected directions:** `docs/DECISIONS.md`

## How to verify

```bash
npm run validate:stories   # page counts, choices, endings, fit, every picture exists
npm run check:pages        # every page and choice moment draws without throwing
npm run build
npm run sfx:check          # when sound changed
npm run dev                # http://127.0.0.1:5173/the-book-of-magical-tales/
```

CI runs `validate:stories`, `check:pages` and `build` before every deploy. A deep link goes
straight to a page: `?tale=<id>&spread=5&choices=a,b,c,d&lang=en&intro=0`.
The dev-only review switches are listed at the top of `src/book/main.js`.
Show UI changes as screenshots in the book: tablet upright and sideways, phone,
desktop, PL and EN. Check images zoomed against the list in workflow §9 before
the author sees them.

## Hard rules

Each rule has its gate in brackets.

- Every push to `main` publishes the site. Work on a branch and merge the PR
  only after the author approves. (Direct pushes to `main` are denied in
  `.claude/settings.json`.)
- Never edit `src/book/sounds.js` by hand: `npm run sfx:master` writes it.
  (Edits are denied.)
- `.env` holds the ElevenLabs key: never read, print or commit it. (Reads are
  denied; the file is gitignored.)
- `prototypes/gen.sh` runs one image at a time, never in parallel: it copies
  the newest generated file, so parallel runs swap pictures. Raw and graded
  images stay local.
- Polish is written first and English is adapted from it. Once a tale has
  pictures, its beats and choice ids stay fixed. (Length limits and structure:
  `validate:stories`.)
- Nonviolent by design: no fighting, enemies or fear escalation (`BRIEF.md`,
  Design Values).

## Author's gates

- Story text, Polish first.
- Each picture: the first variant of a page is approved before its siblings.
- Sound takes: the author picks them in `scripts/sfx/review.html`.
- Final review of a tale or a visible change before merging to `main`.

## Routing for this project

- The 3D layer, UI logic and creative details → Opus, xhigh.
- Small style tweaks (font size, colour, a CSS property, a constant) → fast:
  directly or Sonnet, with one check (a screenshot or two, validate and build).
- Polish prose → the `miodkuj` skill.
- Art direction briefs → Fable.
- Images → Codex ImageGen through `gen.sh`.

## Non-goals

No framework and no backend. Sound is always optional. No mid-story moral
labels. More tales and craft come before more features (`BRIEF.md`, Future
Ideas).
