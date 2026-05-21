# Illustration Art Direction

Use this note when creating page-specific illustrations for *The Book of Magical Tales / Księga Magicznych Opowieści*.

## Reference Direction

The current visual references point toward a whimsical medieval-fantasy storybook style:

- Flat painted shapes with soft grain and brush-like texture.
- Playful castles, towers, red roofs, flags, rivers, hills, forests, and mountains.
- Gentle characters and creatures with rounded silhouettes, warm expressions, and readable body language.
- Cozy palettes built from teal greens, moss, muted red, parchment gold, warm gray stone, moonlit blue, and soft cream.
- Decorative trees, dotted leaves, simple stars, crescent moons, tiny flowers, glowing windows, and small magical marks.
- Child-friendly fantasy: dragons, horses, knights, mice, birds, villagers, and old buildings should feel welcoming, not threatening.

## SVG Asset Rules

Each finished page illustration should be a custom layered SVG, not one shared base scene with tiny swapped symbols.

Use named groups and classes so the app can animate the artwork:

- `.sky-layer`
- `.land-layer`
- `.architecture-layer`
- `.nature-layer`
- `.character-layer`
- `.creature-layer`
- `.prop-layer`
- `.magic-layer`
- `.ambient-layer`

Keep animation gentle and short:

- Flags drift.
- Stars or lanterns glimmer.
- Rivers shimmer.
- Leaves breathe slightly.
- Eyes blink.
- Dragon breath warms softly.
- Bell notes rise quietly.

Avoid high-frequency blinking, flashing, fast movement, or busy particle effects.

## Composition Rules

Each 10-page tale should have 10 distinct illustration compositions:

- Page 1: establishing scene or cover-like opening tableau.
- Choice pages: show the decision space clearly, but vary the camera from previous pages.
- Consequence pages: visibly reflect the chosen helper, detail, or mood.
- Ending page: calm, memorable final tableau.

Do not make later pages feel like the same illustration photographed from the same place with characters swapped. After the opening image, vary the visual storytelling like a real picture book:

- Use close-ups for emotional recognition, tiny creatures, hands, tools, food, lanterns, bells, nests, cracks, flowers, or magical details.
- Use medium scenes when the page is about relationships, dialogue, or shared planning.
- Use wide scenes only when the story needs geography, travel, a gathering, or a final tableau.
- Change the focal point from page to page: face, hand, object, creature, architecture, nature detail, group of helpers, or path forward.
- Change viewpoint gently: side-on manuscript stage, low view near a nest, over-the-shoulder view, top-down tabletop/detail view, framed doorway/window view, riverbank view, or margin-like vignette.
- Keep silhouettes readable at the app’s 880 x 660 illustration size.

Suggested 10-page composition rhythm:

1. **Opening cover:** wide establishing tableau.
2. **First clue:** medium close-up or partial scene focused on the clue.
3. **First consequence:** close-up or low-view detail showing what the choice revealed.
4. **Planning:** intimate medium scene around tools/helpers.
5. **Second consequence:** group/helper scene, but composed differently from page 4.
6. **Careful action:** close-up of hands, basket, rope, cradle, bell, or other craft detail.
7. **Understanding:** quiet emotional close-up or creature-eye view.
8. **Final choice:** symbolic object, gesture, or promise-focused composition.
9. **Resolution:** wider relief scene with changed environment.
10. **Ending:** still, memorable final image with clear “story is complete” feeling.

Use SVG choice overlays only when they genuinely show the child's previous decision. The base page illustration should still feel complete without a chosen overlay.

## Raster Prompt Rules

When generating raster page art, keep the approved style and 880 x 660 frame, but specify a different composition for each page. Prompts must include:

- The intended composition scale: wide, medium, close-up, detail vignette, or low-view.
- The exact focal subject for this page.
- What should be cropped or de-emphasized compared with earlier pages.
- A reminder to avoid repeating the previous page’s camera angle and staging.

Page 1 may be a wide cover-like image. Pages 2-10 should usually avoid another full bridge tableau unless the story specifically needs it.

## Implementation Pattern

Start with a finished page-specific SVG function for one page. Once approved, scale the pattern across the tale:

1. Add a custom SVG function for the page.
2. Keep important parts in separate named groups.
3. Add CSS animation hooks in `styles.css`.
4. Keep the current generic renderer as a fallback only.
5. Repeat until each page has its own illustration.
