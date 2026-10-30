# New Story Workflow

Use this workflow whenever adding a new tale to **The Book of Magical Tales / Księga Magicznych Opowieści**.

The goal is to keep every tale consistent with the book's atmosphere: Polish-first, gentle, medieval-fantasy, nonviolent, emotionally safe, visually rich, and ready for parent-child co-reading.

The book is a 3D candle-lit book on a desk (`index.html`, `src/book/`). A tale is its text (`stories.js`, `locales.js`), its pictures (`src/book/pages.js`, `public/assets/illustrations/v2/<tale-id>/`), its place in the binding (`src/book/tales.js`) and its sound script (`src/book/soundscape.js`). The story data and rules are in `docs/TALE_TEMPLATE.md`.

Do not merge a new story into `main` until the full story, images, sound, validation, and owner review are complete. Every push to `main` publishes the site.

## 1. Story Seed

Start with a short planning note before writing prose.

Define:

- **Working title:** Polish first, English later.
- **Core place:** bridge, mill, orchard, tower, forest road, river crossing, workshop, herb garden, market, monastery, ferry, stable, or another medieval-inspired setting.
- **Small problem:** something is lost, quiet, tangled, cracked, misunderstood, frightened, blocked, forgotten, or waiting to be repaired.
- **Core value direction:** kindness, patience, courage, listening, care, friendship, honesty, gratitude, humility, stewardship, or cooperation. This should guide the story, but it should be shown through concrete events rather than named repeatedly.
- **Medieval detail:** craft, tool, food, custom, building, road, village duty, weather sign, song, map, bell, lantern, horse tack, basket, reed, wool, flour, or woodwork.
- **Fantasy detail:** gentle creature, old oath, moon sign, enchanted object, listening river, wise animal, hidden path, tiny folk, lantern magic, or remembered song.
- **Educational hook:** a concrete thing a child can learn through the story rather than through explanation.
- **Emotional arc:** how the characters move from worry/confusion to understanding, repair, safety, or belonging.
- **Places and times:** where each page happens and how the light changes (evening, dusk, deep dusk, night). The pictures and the sound beds both follow it.

## 2. Polish-First Draft

Write the full tale in Polish first. Treat Polish as the source language and literary anchor.

Use the current Polish versions of **Smok na starym moście** and **Dzwon z Księżycowego Wzgórza** as the tone reference:

- natural read-aloud rhythm
- warm folk-tale simplicity
- concrete village and medieval details
- grounded cause-and-effect rather than abstract metaphor
- gentle emotional naming
- soft repetitions where they help the parent read aloud
- page titles based on what actually happens in the scene
- choices phrased as small, kind actions rather than game commands

Draft:

- story title and kicker (the one line under the title)
- 10-page structure
- 3 short paragraphs per page
- choice pages with exactly 2 options each: short labels (at most 38 characters) and responses (at most 120)
- consequence echoes after choices, plus `paragraphByChoice` variants that replace at least two paragraphs on each affected page
- final page ending clearly with **"Koniec."**
- 3-4 curiosity-note candidates, on pages without a choice, at most 220 characters each
- an epigraph for the title spread (a short quotation, with author and work)

## 3. Structure And Content Validation

Before translating, check the Polish source against the book rules.

The story should have:

- Preferably 10 pages, matching the existing tales.
- 3 short paragraphs per page.
- Balanced choices on pages 2, 4, 6, and 8, two options each.
- Every choice kind, valid, nonviolent, and emotionally safe.
- Choice consequences reflected later through detail, helper, dialogue, image, or ending.
- 3-4 curiosity notes, with 3 as the minimum and 4 only when there is a genuinely worthwhile topic.
- No combat resolution, enemy framing, fear escalation, or moralizing lecture.
- No generic discussion prompts, explicit value labels, or mid-story moral summaries.
- A secure final page with repair, understanding, safety, belonging, or wonder.
- A clear final reflection may gather the main values, but earlier pages should stay descriptive, concrete, and story-led.

Run the tale mentally as a read-aloud session: if a page feels too dense, split or simplify before moving on.

## 4. English Adaptation

Adapt the approved Polish source into English.

The English version should preserve:

- page count and page order
- story meaning and emotional arc
- choice IDs and choice meaning
- illustration moments
- curiosity-note topics
- final reflection

It should not copy Polish syntax too literally. English should sound like natural children's-book prose while remaining faithful to the Polish source. The length limits apply to English too.

## 5. App Integration With Draft Pictures

Add the story to the book before generating final images.

Update:

- `stories.js`: English text and the shared structure (choice ids, echoes, notes, ending)
- `locales.js`: the Polish text under `storyTranslations.pl["<tale-id>"]`
- `src/book/pages.js`: the tale's spread manifest, one entry per spread (title spread, pages 1-10), with each choice variant and a Polish and English `alt` text
- `src/book/tales.js`: the tale in a placeholder slot (`tale-three`, `tale-four`) with `available: true`, its `spreads`, `epigraph` and ribbon
- `docs/TALE_TEMPLATE.md` only if the story reveals a reusable rule

The validator requires every picture the manifest names to exist, so point the spreads at draft pictures for now: a first rough generation exported in the right format, or an existing picture of the right format. The point is to verify structure and layout before committing to final illustrations.

Run:

```bash
npm run validate:stories
npm run build
npm run dev
```

The dev server opens the book at http://127.0.0.1:5173/the-book-of-magical-tales/. Links go straight to a page: `?tale=<tale-id>&spread=5&choices=choice-a,choice-c&lang=en&intro=0`. `spread=0` is the title spread, `choices=` gives the four choices in order, and `intro=0` skips the opening of the book. The dev server also has review switches (frozen states, camera, device tier, sound debug); they are listed at the top of `src/book/main.js` and do nothing on the live site.

Check both Polish and English in the book for:

- title wrapping
- body text fit on the left page
- choice tabs and responses under the plate
- curiosity notes under the plate
- the title spread (epigraph, title, kicker) and the ending page around its emblem
- no clipped controls or page content

## 6. Set Bible And Illustration Plan

Write the tale's set bible, `docs/pilot/SET_BIBLE_<tale-id>.md`, on the model of the two existing ones:

- **Cast:** every character and animal with fixed looks, clothes, colours and counts.
- **The place:** its buildings, landmarks and geography, so every shot shows the same place.
- **Story state:** what changes from page to page (what is repaired, carried, lit, where everyone is).
- **Colour script:** the time of day of every page.

The style for all tales is in `docs/pilot/MANUSCRIPT_BIBLE.md` (style A v2: palette, line, faces, gold, the forbidden list, continuity of bodies and buildings).

Then create an illustration brief for every page and every choice variant:

- page number and title
- format: 5:4 plate (a page with a choice or a note), 2:3 portrait (a page with neither), or the closing emblem (the ending page, a transparent drawing)
- scene summary
- composition type: cover tableau, close-up, medium scene, low view, object detail, group scene, final tableau, interior vignette, or landscape
- characters and objects visible, with counts
- required continuity details
- mood and lighting (the colour script)
- what must not appear

Page 1 may be cover-like. Later pages should vary composition so the story feels like a real illustrated book rather than one repeated camera angle.

Also plan the title emblem (a round medallion for the title page), and choose the marginal ornaments (`tailpiece`) from the shared set in `public/assets/illustrations/v2/ornaments/`, varied so each tale gets plants and small beasts, not one motif.

## 7. Prompts And References

Images are generated with Codex ImageGen from prompts written by a builder script:

- Generate the setting reference first (`prototypes/prompts/set-<tale>.txt`, saved into `prototypes/refs/`), then the character references the set bible asks for.
- Write the tale's builder, `prototypes/prompts/_build_<prefix>.py`, on the model of `_build_moonhill.py`: it imports `_build_a2.py` (the shared style, references and prompt assembly) and adds this tale's cast, place and pages. Run it from `prototypes/prompts/`; it writes one `<prefix>-<page>.txt` per picture.
- Add the new prefix in two places: to `.gitignore` (the written prompts are derived from the builder and stay untracked, like `a2-*` and `mh-*`) and to the `case` in `prototypes/export_v2.sh`.
- Plates are generated at 1536×1024 with a 5:4 safe area in the middle; portraits at 2:3.

## 8. Image Generation

Generate the pictures one at a time, never in parallel:

```bash
prototypes/gen.sh <prompt-id>     # writes prototypes/raw/<prompt-id>.png
```

Raw generations and graded masters stay local (`prototypes/raw/`, `prototypes/graded/` are gitignored).

For a page with choice variants, generate and approve **one** variant first. Then build the other variants from the approved picture as their composition reference, so all variants share one camera and one geometry and differ only where the choice does.

Generate corrections before moving on. To correct a picture, cut the approved raw into `prototypes/refs/<prompt-id>-composition.png` and add a `fix(...)` call in the builder: it keeps the approved composition, names the one change, and sets the next revision letter (`p3-listene` → `p3-listenf`). When a scene fails twice, change the approach (camera, composition reference, or the text), not the wording of the same prompt.

## 9. Image Review And Corrections

Before showing a picture to the owner, check it zoomed in, against this list:

- **Structure:** walls, bridges, towers and roofs continuous and the same shape as in the set bible; no second wall at a corner, no wall ending in the air.
- **Anatomy:** the right number of limbs, a left and a right paw or hand, horns, legs that do not melt into trees; nobody standing on what they should stand behind.
- **Counts:** characters, animals and story objects exactly as the text says (e.g. always three mice).
- **Continuity:** clothes, colours, props and where everyone is, against the story state.
- **Text:** the picture shows what the page says, for every choice variant.
- **Style:** style match with the existing tales, medieval/fantasy atmosphere, no violence, scary intensity, modern details, or text artifacts.

Then review the full image set in sequence:

- Does the story visually progress?
- Do lighting and time of day follow the colour script?
- Do choice variants clearly but gently differ?
- Are endings visually distinct and conclusive?
- Are images too busy, too dark, or too repetitive?
- Does each image support the text on the same page?

When the picture is better than the text, change the text.

Export each accepted picture into the book:

```bash
prototypes/export_v2.sh <raw-id> <tale-dir> <page-name> <time> [plate-focus]
# e.g. prototypes/export_v2.sh nt-p4b new-tale-id p4 dusk 0.35
```

`<time>` is the page's time of day from the colour script (`evening`, `dusk`, `deepdusk`, `night`; `none` skips grading, for the emblems). `plate-focus` crops a 1536×1024 plate to 5:4: `0` keeps the left edge, `0.5` the centre, `1` the right edge; choose it so every figure and story prop stays in. The graded master keeps the full frame, so a plate can be re-cropped later without regrading (`prototypes/export_webp.py ... --plate <focus>`).

Swap the draft pictures in `src/book/pages.js` for the final ones and update the `alt` texts to what each picture really shows.

## 10. Sound Pass

The sound script is in `src/book/soundscape.js` (its header explains the design). A new tale adds its entry under `TALES` there and nothing in `sound.js`:

- **Places:** one continuous bed per place and time of day, as in the colour script. It runs on across pages and changes, with a slow crossfade, only where the place or the time does.
- **Pages:** each page names its place and up to two quiet spot sounds of what is in it (a breath, a bird, the bell). They are first heard some seconds after the page has settled, and rarely again. No sound fires as a page lands.
- **Themes:** an opening theme on the tale's title spread and an ending theme on its last page, kin to each other, in D or a key with D in it (the choice harp is in D). For this book: warm folk instruments, not courtly music. The opening theme opens the tale like a film: some seconds in, the bed of page 1 rises beneath it, and it plays on to its natural end while the reader turns into the first pages, so it should be calm and die away on its own (no cut-off ending).
- A spot or theme whose file is not mastered yet is skipped, so the tale works before its sounds are done.

Sounds are generated with ElevenLabs by the tools in `scripts/sfx/`:

1. Describe each new sound in `scripts/sfx/manifest.json` (prompt, length, loop, takes).
2. Generate: `npm run sfx:gen -- --only <ids>` (add `--dry-run` first to see the cost). The API key is read from the gitignored `.env`. Takes land in `local-assets/sfx/raw/`.
3. Listen: `node scripts/sfx/sheets.mjs`, then `npm run sfx:review` and open `scripts/sfx/review.html` with the right `?sheet=`. The owner picks the takes and exports the picks.
4. Add the picks to `scripts/sfx/picks.json` through `scripts/sfx/picks.mjs` (as the earlier picks files are), then `npm run sfx:master`. This writes the shipped files to `public/assets/book3d/sound/<group>/` and regenerates `src/book/sounds.js`; never edit `sounds.js` by hand.
5. `npm run sfx:check` (no thump on page turns, no bed raised so far that it distorts).

Balance against the shared sounds (page turn, the click, the choice seal and harp), and keep everything optional behind the sound toggle.

## 11. Read-Through In The Book

Read the whole tale in the dev server, in both languages and on every choice path, on:

- a tablet (the main device), upright and sideways
- a phone upright, and sideways (the book is read by panning across the spread)
- a desktop

Check that pictures load, choices hold the page until made and stay sealed when you go back, each path rewrites the later pages (start over, or use `choices=` in a deep link, to read the other one), the sound follows the places, and "Begin again" returns to the title spread.

## 12. Review-Ready Handoff

Before owner review, run:

```bash
npm run validate:stories
npm run build
npm run sfx:check
```

Then prepare a short review note:

- story title
- new pages and choice structure
- curiosity-note pages
- image count and variants
- sound: places, spot sounds, themes
- known tradeoffs or items needing human review

Tell the owner the story is **review-ready**.

Do not merge into `main` until the owner has reviewed the tale and approved the content, visual direction and sound.

## 13. Final Approval And Release

After review changes are complete:

- run validation, build and `sfx:check` again
- check the Git diff carefully: no `.env`, no raw or graded images, no files over a few MB that the book does not load
- commit on a branch with a clear story-focused message
- open a pull request to `main` and merge it
- confirm the GitHub Pages deployment succeeds (the "Deploy to GitHub Pages" workflow) and open the live book: https://artskw.github.io/the-book-of-magical-tales/
