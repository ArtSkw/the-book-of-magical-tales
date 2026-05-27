# Baseline QA And Asset Inventory

Date: 2026-05-25

This pass records the current state before implementing preload, lazy-load, image optimization, and the small-screen reading recommendation modal.

## Viewport QA

Automated checks covered the start screen, opened book, PL/EN language switching, and an early choice flow across common viewport sizes.

| Viewport | Result | Notes |
| --- | --- | --- |
| 1920 x 1080 | Pass | No scrollbars or viewport clipping. |
| 1440 x 1000 | Pass | No scrollbars or viewport clipping. |
| 1366 x 768 | Needs polish | Open-book content fits, but story tabs sit slightly above the viewport on short laptop height. |
| 1280 x 800 | Needs polish | Similar story-tab top clipping, less severe than 1366 x 768. |
| 1024 x 768 | Pass | Tablet landscape is usable. No clipping detected in the tested path. |
| 820 x 1000 | Not suitable for full open-book reading | Portrait tablet layout clips open-book content vertically. |
| 768 x 1024 | Not suitable for full open-book reading | Portrait tablet layout clips open-book content on choice-heavy pages. |
| 430 x 932 | Not suitable for full open-book reading | Mobile-ish layout can fit some pages, but choice pages and language transitions clip vertically. |
| 390 x 844 | Not suitable for full open-book reading | Open-book mode clips the book, tabs, content, and controls. |

## Post-Loading QA Pass

Date: 2026-05-27

Rechecked after the narrow-screen fallback and first asset-loading pass.

| Viewport / Flow | Result | Notes |
| --- | --- | --- |
| 1440 x 1000 desktop | Pass | Start screen, open-book reveal, page turn, choice lock/unlock, language switch, sound toggle, and story switch passed. |
| 1366 x 720 short laptop | Pass | Open-book content fits; story tabs now clear the top edge after the short-height adjustment. |
| 1024 x 768 tablet landscape | Pass | Opens directly without the narrow-screen modal; controls and pages stay inside the viewport. |
| 820 x 1180 tablet portrait | Pass with recommendation | Wider-screen modal appears; closing it returns to the closed book. |
| 390 x 844 mobile portrait | Pass with recommendation | Wider-screen modal appears; "open anyway" uses stacked pages with fixed bottom controls and internal scroll. |

Interaction checks:

- The next-page button is disabled on choice pages until a choice is selected.
- Choice selection enables the next-page button and updates the branch flow.
- Story art loads after page turns and story switches.
- Language switching updates content without breaking layout in the tested path.
- Sound toggle state updates correctly.
- Mobile "open anyway" controls remain fixed while the book content scrolls.

## UX Decision For Narrow Screens

For narrow portrait screens, we should not force the full two-page book layout. The better experience is a manuscript-styled modal before opening the book:

- Show the closed book and table ambience.
- When the user taps the book on a narrow screen, show a warm note explaining that the book is best read on a wider screen.
- Keep the tone gentle and child-friendly.
- Allow dismissal only if we intentionally want users to continue anyway; otherwise keep it as a recommendation gate.
- Suggested threshold: show the modal when width is below `900px` or when the viewport is portrait and the open-book area cannot fit safely.

Suggested copy:

Polish:
> Ta księga najlepiej otwiera się na szerszym ekranie. Obróć tablet poziomo albo usiądź przy większym ekranie, żeby opowieści, ilustracje i wybory zmieściły się wygodnie na stronach.

English:
> This book opens best on a wider screen. Turn your tablet sideways or use a larger screen so the tales, illustrations, and choices can rest comfortably on the pages.

## Tap Target Notes

Some compact controls are slightly below ideal touch target size:

- Language options are usually around `33-38px` tall.
- The sound button is around `35-40px`.
- Curiosity-note buttons can be around `37-38px`.

Recommendation: during the responsive polish pass, raise compact controls toward a practical `40-44px` minimum without making the book controls feel oversized.

## Asset Inventory

Current local `public/assets` inventory:

| Group | Size | Notes |
| --- | ---: | --- |
| Dragon Bridge illustrations | ~45 MB | 15 PNG images, most around 2.8-3.2 MB. |
| Moonhill Bell illustrations | ~45 MB | 15 PNG images, most around 2.8-3.2 MB. |
| Tracked scene layers | ~8.3 MB | Table, open book frame, closed cover. |
| Audio | ~4.3 MB | Largest files are story-image sounds. |
| Total public assets, local | ~105 MB | Includes untracked local source/reference files currently inside `public`. |

Largest asset pattern:

- Story illustrations are `1448 x 1086` PNGs.
- Scene layers are around `1535 x 1024` or `1619 x 971`.
- Most story PNGs are around `3 MB` each.
- `dragon-story-image-sound.wav` is about `1.9 MB`.
- `moonhill-story-image-sound.wav` is about `1.5 MB`.

Local-only cleanup note:

- `premium-book-cover-closed-v1-source.png` was moved out of `public` into ignored `local-assets/scene/`, so it remains available locally without being served.
- `.DS_Store` files were removed from `public`.
- Future source/reference files should live outside `public` so they are not accidentally served.

## Loading Strategy Targets

Next implementation should split assets into these buckets:

1. Critical start screen:
   - tabletop background
   - closed book cover
   - book-opening sound

2. Open-book first reveal:
   - open book frame
   - current story page 1 image
   - core UI sounds

3. Reading flow:
   - current page image
   - next page image
   - both next-page variants when a choice is visible

4. Deferred:
   - other story images
   - later choice variants
   - story-image sounds for inactive tales

## Recommended Next Steps

1. Add the narrow-screen recommendation modal. Done.
2. Fix story-tab vertical positioning on short laptop heights. Done.
3. Add a lightweight asset loader/preloader module. Done in `app.js`.
4. Preload start-screen and first-open assets. Done for scene images, current page art, and core UI sounds.
5. Lazy-load page illustrations and choice variants. Done through current, adjacent, hover, story-switch, and idle story art warmups.
6. Generate optimized WebP versions of large PNG illustrations, keeping originals as source assets. Still pending; local tooling did not provide a WebP encoder during this pass.
7. Re-run the viewport QA matrix after loading changes. Done.

## Implemented Loading Pass

- Core UI sounds are warmed intentionally, while large story-image sounds are no longer created with eager `preload="auto"` on startup.
- Scene images and the current page art are preloaded with high priority.
- Adjacent page images and branch variants are warmed during reading.
- Full story image sets are warmed during idle time after the book opens, after story switching, or when a story tab is targeted.
- Rendered story images use async decoding and high fetch priority for the active page.
