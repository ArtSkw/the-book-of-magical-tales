# New Story Workflow

Use this workflow whenever adding a new tale to **The Book of Magical Tales / Księga Magicznych Opowieści**.

The goal is to keep every tale consistent with the book's atmosphere: Polish-first, gentle, medieval-fantasy, nonviolent, emotionally safe, visually rich, and ready for parent-child co-reading.

Do not push a new story to Git until the full story, images, animations, validation, and owner review are complete.

## 1. Story Seed

Start with a short planning note before writing prose.

Define:

- **Working title:** Polish first, English later.
- **Core place:** bridge, mill, orchard, tower, forest road, river crossing, workshop, herb garden, market, monastery, ferry, stable, or another medieval-inspired setting.
- **Small problem:** something is lost, quiet, tangled, cracked, misunderstood, frightened, blocked, forgotten, or waiting to be repaired.
- **Main virtue:** kindness, patience, courage, listening, care, friendship, honesty, gratitude, humility, stewardship, or cooperation.
- **Medieval detail:** craft, tool, food, custom, building, road, village duty, weather sign, song, map, bell, lantern, horse tack, basket, reed, wool, flour, or woodwork.
- **Fantasy detail:** gentle creature, old oath, moon sign, enchanted object, listening river, wise animal, hidden path, tiny folk, lantern magic, or remembered song.
- **Educational hook:** a concrete thing a child can learn through the story rather than through explanation.
- **Emotional arc:** how the characters move from worry/confusion to understanding, repair, safety, or belonging.

## 2. Polish-First Draft

Write the full tale in Polish first. Treat Polish as the source language and literary anchor.

Use the current Polish versions of **Smoczy Most** and **Księżycowy Dzwon** as the tone reference:

- natural read-aloud rhythm
- warm folk-tale simplicity
- concrete village and medieval details
- gentle emotional naming
- soft repetitions where they help the parent read aloud
- page titles based on what actually happens in the scene
- choices phrased as small, kind actions rather than game commands

Draft:

- story title and short ribbon title
- 10-page structure, or more only if the story truly needs it
- 3 short paragraphs per page
- choice pages and choice responses
- consequence echoes after choices
- final page ending clearly with **"Koniec."**
- 3-4 curiosity-note candidates

## 3. Structure And Content Validation

Before translating, check the Polish source against the book rules.

The story should have:

- Preferably 10 pages, matching the existing tales.
- 3 short paragraphs per page.
- Balanced choices, usually on pages 2, 4, 6, and 8.
- Every choice kind, valid, nonviolent, and emotionally safe.
- Choice consequences reflected later through detail, helper, dialogue, image, or ending.
- 3-4 curiosity notes, with 3 as the minimum and 4 only when there is a genuinely worthwhile topic.
- No combat resolution, enemy framing, fear escalation, or moralizing lecture.
- A secure final page with repair, understanding, safety, belonging, or wonder.

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

It should not copy Polish syntax too literally. English should sound like natural children's-book prose while remaining faithful to the Polish source.

## 5. App Integration With Placeholder Art

Add the story data before generating final images.

Update:

- `stories.js` for English text and shared story metadata
- `locales.js` for Polish text and UI-localized fields
- `illustrationCatalog.js` for new visual IDs
- `docs/TALE_TEMPLATE.md` only if the story reveals a reusable rule

Use placeholder or existing fallback art at this stage. The point is to verify structure and layout before committing to final illustrations.

Run:

```bash
npm run validate:stories
npm run build
```

Then check both Polish and English in the book frame for:

- title wrapping
- body text fit
- choice-button fit
- curiosity-note popover placement
- final page clarity
- no clipped controls or page content

## 6. Illustration Plan

Create an illustration brief for every page and every choice variant.

Each page brief should include:

- page number and title
- scene summary
- composition type: cover tableau, close-up, medium scene, low view, object detail, group scene, final tableau, interior vignette, or landscape
- characters and objects visible
- required continuity details
- mood and lighting
- what must not appear
- possible animation hooks

Page 1 may be cover-like. Later pages should vary composition so the story feels like a real illustrated book rather than one repeated camera angle.

## 7. Sketch Or Skeleton Pass

Before high-resolution generation, prepare rough image skeletons or written composition sketches.

The skeleton pass should confirm:

- all pages have distinct visual focus
- choice variants visibly reflect the child choice
- key story objects are present
- character continuity is plausible
- the image will fit the book's illustration frame
- there are good places for subtle CSS living details

## 8. High-Resolution Image Generation

Generate the final raster illustrations from the approved art direction and page briefs.

For every image, check:

- style match with the existing tales
- medieval/fantasy atmosphere
- story accuracy
- character and object continuity
- no unwanted violence, scary intensity, modern details, or text artifacts
- composition variety across pages
- sufficient clear area for the image frame

Generate corrections before moving to animation.

## 9. Image Review And Corrections

Review the full image set in sequence.

Check:

- Does the story visually progress?
- Do lighting and time of day make sense?
- Do choice variants clearly but gently differ?
- Are endings visually distinct and conclusive?
- Are images too busy, too dark, or too repetitive?
- Does each image support the text on the same page?

Do not start final CSS animation until the image set is accepted.

## 10. Living Details And CSS Animation

Add page-specific animation overlays one by one.

Prefer:

- candle-like glows
- bell-note shimmer
- moving river highlights
- grass or leaf hush
- lantern spark
- soft breath
- dust motes
- tiny magical glints
- gentle moonlight

Avoid:

- generic copied animation across all pages
- busy or game-like effects
- motion that distracts from reading
- effects that obscure important image details

After each animation group, verify the page still feels calm and readable.

## 11. Sound Pass

Decide whether the story needs dedicated image-click audio or only the shared UI sounds.

If adding sounds:

- use curated files, not synthetic Web Audio tones
- keep volume balanced against page turn, choice, ink, and button sounds
- fade image sounds in and out softly
- never trigger image-specific sounds from choice buttons or unrelated controls
- keep sound optional and controlled by the global sound toggle

## 12. Review-Ready Handoff

Before owner review, run:

```bash
npm run validate:stories
npm run build
```

Then prepare a short review note:

- story title
- new pages and choice structure
- curiosity-note pages
- image count and variants
- animation highlights
- known tradeoffs or items needing human review

Tell the owner the story is **review-ready**.

Do not push to Git until the owner has reviewed the tale and approved the content and visual direction.

## 13. Final Approval And Push

After review changes are complete:

- run validation and build again
- check Git diff carefully
- commit with a clear story-focused message
- push to `main`
- confirm GitHub Pages deployment succeeds

