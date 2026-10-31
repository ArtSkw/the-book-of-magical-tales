# Medieval Fantasy Interactive Storybook

> The original project brief. The concept, values, nonviolence rules and story rules still hold. The first plan was a 2D app with animated illustrations; the book was built as a 3D book on a candle-lit desk instead, and the sections on scope, interaction, motion and technology now describe what was built. The working documents for new tales are `docs/TALE_TEMPLATE.md` (story data and rules) and `docs/NEW_STORY_WORKFLOW.md` (the production process).

## Working Title

**The Book of Magical Tales / Księga Magicznych Opowieści**

Alternative title directions:

- **The Little Book of Kind Knights**
- **The Lantern Knight's Storybook**
- **The Book of Brave and Gentle Tales**
- **Knightly Tales by Candlelight**

## Concept

A short-session parent-child interactive fairy tale book set in a gentle medieval fantasy world. The app presents an open illuminated manuscript on a table, with warm candlelight, parchment textures, calligraphic headings, readable story text, and an illustration on every page.

The experience should feel like opening an old magical book together at bedtime or during quiet play. It is not a combat game. It is a cozy, imaginative story ritual where medieval and fantasy themes are used to explore courage, kindness, patience, friendship, family, respect for animals, and care for the natural world.

## Guiding Sentence

**A gentle medieval fantasy world where courage means helping, strength means protecting, and every creature has a story.**

## Core Audience

- A child interested in knights, castles, dragons, medieval history, fantasy creatures, travelers, heroes, maps, armor, and old tales.
- A parent who wants to co-read, co-play, and guide the story through meaningful conversation.
- Sessions should be short, repeatable, warm, and visually rewarding.

## Design Values

- **Nonviolent by design:** no one is hurt physically; no attacking, slaying, fighting, or defeating enemies.
- **Protective fantasy:** swords, shields, armor, banners, and castles are knightly symbols and tools for protection, service, ceremony, courage, and responsibility.
- **Moral imagination:** choices and story moments should gently model love, respect, mutual support, patience, friendship, honesty, family ties, and care for animals.
- **Wonder first:** the app should feel magical without becoming noisy or overstimulating.
- **Parent-child co-play:** the parent remains part of the storytelling, not replaced by the app.
- **Readable and accessible:** medieval styling should support atmosphere without making the text hard to read.

## Nonviolence Rules

Avoid:

- Attacking, killing, slaying, stabbing, shooting, or physically hurting anyone.
- "Enemy" framing.
- Combat stats, health bars, damage, weapons upgrades, or defeat states.
- Scary imagery that becomes intense, graphic, or threatening.

Prefer:

- Helping, listening, repairing, guiding, sheltering, carrying, returning, inviting, comforting, sharing, protecting, and asking questions.
- Danger from weather, darkness, confusion, old grudges, broken bridges, lost messages, loneliness, fear, or misunderstanding.
- Resolutions based on kindness, patience, courage, honesty, cleverness, cooperation, and care.

## Reframing Knightly Objects

- **Sword:** ceremonial oath-blade; it stays sheathed. Mention it only when the story uses it.
- **Shield:** shelter from rain, wind, falling branches, sparks, or fear.
- **Armor:** gives courage to enter unknown places and protect others.
- **Banner:** gathers friends and helpers.
- **Lantern:** reveals hidden paths, invisible ink, tiny creatures, and old markings.
- **Gauntlets:** protect hands while moving hot stones, thorny branches, or heavy beams.
- **Horse:** a companion with personality, preferences, and emotional intelligence.

## Experience Shape

The first screen should be the storybook itself, not a landing page.

The app opens on:

- A wooden table or dark cloth surface.
- A large open book at the center.
- A candle beside the book, casting warm light.
- Subtle shadows, paper grain, edge wear, ink marks, and decorative manuscript borders.
- A simple story selector represented as bookmarks, ribbons, or page tabs.

The child and parent choose a story, turn pages, read together, and make small, kind choices that the tale remembers.

The tales are stations of one journey: Gustaw and Oliwia travel on from tale to tale, and Oliwia's bag collects one keepsake from each. Every tale still reads on its own and in any order (`docs/WRITING_BIBLE.md`, §4).

## Scope Of The First Release

- One polished 3D book on a candle-lit desk, with room, candle light and props.
- Two complete tales, ten pages each, with four choices of two options per tale.
- One illustration or illustration variant per page, a title emblem and a closing emblem per tale.
- Page turns, a ribbon per tale, and the choices sealed with wax.
- Polish and English, switchable at any time.
- Optional sound: a bed for each place and time of day, a few quiet spot sounds, a theme at the start and end of each tale.
- Story data as plain JS objects (`stories.js`, `locales.js`), checked by `npm run validate:stories`.

The two starter stories, as planned and as built:

1. **The Dragon on the Bridge** (built as *Smok na starym moście / The Dragon on the Old Bridge*)
   - A small dragon blocks a bridge because it is protecting or listening to something underneath.
   - The knight helps by asking questions, sharing food, lighting a lantern, and calling helpers.
   - Values: compassion, curiosity, patience, care for animals.

2. **The Lost Bell of Moonhill** (built as *Dzwon z Księżycowego Wzgórza / The Bell of Moonhill*)
   - A village bell has gone quiet before the evening gathering.
   - The knight, horse, and villagers follow clues and discover the bell is not stolen but tangled, hidden, cracked, or waiting to be repaired.
   - Values: cooperation, family/community ties, respect for different skills, repairing rather than blaming.

## Story And Content Rules

## Story Generation Ruleset

Use this ruleset for every new tale and every rewrite of an existing tale. The sentence-level craft rules, the tale card and the checks are in `docs/WRITING_BIBLE.md`; where the two differ, the writing bible is the newer and wins.

### Creative North Star

Stories should combine:

- **Medieval life and material culture:** castles, bridges, bells, mills, workshops, guilds, market squares, herb gardens, scribes, maps, illuminated books, banners, horses, ferries, feast days, harvests, weather signs, tools, craft traditions, village duties, and road customs.
- **Gentle fantasy wonder:** dragons, talking animals, hidden paths, lantern magic, old oaths, moonlit bells, forest spirits, tiny folk, enchanted maps, wise horses, sleeping giants, healing springs, star signs, and old magic with rules of its own.
- **Classic high-fantasy values:** fellowship, humility, mercy, stewardship, loyalty, hospitality, courage in small people, respect for old wisdom, reverence for nature, hope in dark or confusing moments, and the idea that power is best used to protect.
- **Universal family values:** love, patience, honesty, forgiveness, gratitude, cooperation, care for elders, care for younger or smaller beings, sibling/friendship repair, community responsibility, and respect for animals and the natural world.

Do not imitate or reuse specific characters, places, races, names, plots, or lore from Tolkien or any other existing copyrighted world. Use classic fantasy values as inspiration, then build original characters, places, customs, and conflicts.

### Educational And Developmental Principles

Stories should support parent-child co-reading and align with broad child-development guidance from reputable health and child-welfare organizations. They are not therapy or medical advice; they are warm, imaginative stories shaped by principles such as responsive caregiving, emotional safety, early learning through conversation and play, and secure caregiver-child connection.

Use these principles:

- **Responsive caregiving:** include moments where adults or older children notice signals, listen before acting, respond gently, and adapt to a child, creature, animal, or community member's needs.
- **Emotional naming:** help children recognize feelings without shame. Name feelings such as worry, loneliness, pride, relief, shyness, frustration, bravery, sadness, tenderness, and joy in simple language.
- **Co-regulation:** when a character is afraid or upset, show another character slowing down, speaking softly, breathing, offering presence, asking permission, or making the environment safer.
- **Agency without pressure:** give the child meaningful choices, but make every option kind and valid. Avoid success/failure framing.
- **Secure endings:** end with repair, understanding, safety, or belonging. It is fine for a mystery to remain wondrous, but the child should feel emotionally held.
- **Learning through story:** weave in concrete knowledge about medieval crafts, nature, seasons, animals, tools, maps, weather, music, gardens, or village life through action rather than exposition.
- **Curiosity notes instead of prompts:** optional adult-child support should come through rare, high-quality "Czy wiesz, że...?" / "Did you know...?" notes tied to concrete page content. Do not use generic parent prompts or quiz-like reflection buttons.
- **Respect for developmental comfort:** keep suspense gentle, avoid intense fear, avoid humiliation, avoid abandonment as a threat, and avoid moralizing lectures.
- **Repetition and rhythm:** use recurring phrases, ritual gestures, and clear story beats to help young children predict, remember, and retell.
- **Diverse competence:** let different characters help in different ways: noticing, carrying, waiting, mending, singing, remembering, cooking, drawing maps, caring for animals, or asking good questions.

### Story Content Checklist

Before adding or approving a tale, check that it includes:

- A medieval or medieval-inspired practical detail on most pages.
- A fantasy or wonder detail on most pages.
- At least one animal, natural place, craft, tool, song, map, or old custom that teaches gently.
- At least one moment of listening before action.
- At least one moment where a small or overlooked character matters.
- 3-4 curiosity notes per tale, with 3 as the minimum and a fourth only when the page offers a genuinely worthwhile child-friendly topic.
- No combat resolution, no defeated enemy, and no reward for domination.
- A final reflection that names or gathers the main values only at the end, after the story has shown them through action.

### Bilingual Story Rule

Every tale should be planned for both Polish and English. Polish should be the canonical source for structure, page beats, emotional rhythm, choices, and image alignment. English should be adapted from the Polish source as natural children's-book prose, not translated word-for-word.

Use **Polish-first story creation** for every new tale and every major rewrite:

- Draft the tale in Polish first, as if it were an original Polish children's folk-fantasy story written for warm read-aloud co-reading.
- Let the Polish version define the emotional rhythm, sensory details, sentence cadence, recurring phrases, page titles, curiosity notes, and story pacing.
- Translate or adapt into English second, preserving meaning, page structure, choices, image moments, curiosity notes, and emotional arc while making the English sound natural rather than literal.
- Treat English as the layout-aligned companion version, not the source of Polish phrasing.

Use **Polish transcreation and folk-tale styling** for the Polish source:

- Rewrite the tale as natural Polish children's-book prose, as if it were originally written in Polish.
- Preserve the same page count, choice IDs, choice meaning, curiosity notes, image moments, and emotional arc.
- Prefer warm, simple, read-aloud sentence rhythm over direct English word order.
- Avoid stiff translated idioms, overly formal phrasing, and awkward medieval vocabulary that a Polish-speaking child would not naturally receive.
- Avoid gendered second-person wording such as "wybrałeś" where a neutral phrase works. Prefer forms like "Po tym wyborze...", "Dzięki temu...", or "Teraz...".
- Curiosity notes should sound natural and wonder-sparking in Polish, not encyclopedic or quiz-like.
- After writing, read each Polish page aloud and check layout fit next to the illustration.

Polish folk-tale prose should generally include:

- **Oral rhythm:** sentences that sound good when spoken by a parent, with occasional soft repetitions such as "powoli, bardzo powoli", "cicho, najciszej jak umieli", or "nie od razu, tylko po chwili".
- **Formulaic warmth:** gentle tale-like openings and closings without parodying archaic language. Prefer "Dawno temu..." only when it truly fits; otherwise use concrete openings like "Pod wieczór...", "Za młynem...", "Na starym moście...".
- **Grounded Polish diction:** use natural words such as "wioska", "zagroda", "młyn", "izba", "siodło", "płótno", "bochenek", "dzwonnica", "sad", "ścieżka", "potok", and "łąka" where they fit the medieval-fantasy setting.
- **A living world, not animated objects:** rivers murmur and wind blows as they really do; animals and magical creatures may understand and feel; magic is a rule of the world, stated once and kept. Stones, trees, leaves and bells do not hear, want or remember (`docs/WRITING_BIBLE.md`, §1).
- **Simple emotional naming:** use clear child-friendly feeling words: "zmartwiony", "stremowany", "dumny", "spokojniejszy", "zawstydzony", "wdzięczny", "odważny po cichu".
- **Grounded causality:** make scenes work through concrete reasons and visible actions. Prefer "the pennant let the village know something important was happening" over symbolic or abstract explanation.
- **Concrete kindness:** show values through actions: waiting, warming, covering from wind, calling a careful helper, sharing bread, repairing a crack, speaking softly, giving a small creature room.
- **Low moralizing:** avoid direct lessons such as "trzeba być dobrym" and avoid sneaking summary morals into middle pages. Let the middle of the tale stay descriptive, eventful, and grounded. Save the clear value reflection for the final page.
- **Musical closure:** final pages may use a short repeating phrase or image that feels like closing a bedtime tale, ending clearly with "Koniec." in Polish and "The end." in English.

Recommended story themes:

- Repairing something old instead of blaming someone.
- Helping a misunderstood creature.
- Returning a lost object or message.
- Protecting an animal habitat.
- Preparing for a storm together.
- Welcoming a stranger or shy child.
- Learning humility after boasting.
- Keeping a promise when it becomes inconvenient.
- Caring for a forest, river, garden, field, or village common.
- Discovering that courage can mean asking for help.

Reference guidance used for this ruleset:

- WHO / UNICEF / World Bank Group, **Nurturing care for early childhood development**: nurturing care includes safety and security, responsive caregiving, and opportunities for early learning.
- WHO, **Improving early childhood development** guideline: emphasizes responsive care, early learning, caregiver support, play, communication, and nurturing interactions.
- UNICEF Parenting guidance: emphasizes warm relationships, reading/talking together, reassurance, open conversation, helping children understand feelings, and supportive caregiver-child connection.

### Tale Template

Each tale should generally be around **9-10 pages**. This is the preferred template for all future stories, even when an early prototype begins with fewer pages.

Developer template: use `docs/TALE_TEMPLATE.md` for a copyable 10-page JS skeleton and checklist when adding future tales.

Each page should usually contain **three short paragraphs**:

- One paragraph for place, mood, sensory detail, or action.
- One paragraph for character feeling, dialogue, discovery, or consequence.
- One paragraph that adds concrete consequence, prepares the next action, sets up a choice, or shows what changed without turning into a moral lesson.

Keep paragraphs short enough for parent-child co-reading. If a page becomes cramped, split the moment into another page rather than making the text too dense.

Each page should have a relevant illustration or illustration variant. A 10-page tale should therefore plan for 10 illustration moments, including the title/opening illustration.

The 10-page rhythm, with the choices on pages 2, 4, 6 and 8 and each tale ending in **"Koniec."** / **"The end."**, is in `docs/TALE_TEMPLATE.md`.

Use mostly linear stories with soft branching. Choices should change details, helpers, dialogue, illustration details, curiosity notes, or closing reflection while keeping every path kind and valid. The page after a choice is written whole for each option (`bodyByChoice`), so the choice runs through the page, as a scene does in a role-playing game; an earlier choice may return later as one paragraph (`paragraphByChoice`). Every path is a real, different way through. Rules: `docs/WRITING_BIBLE.md`, §2.

## Page Data Shape

The data shape of a tale, its pages, choices, choice variants and curiosity notes, is in `docs/TALE_TEMPLATE.md`, with copyable skeletons.

## Interaction Ideas

Interactions as built:

- Turn the page: tap or swipe it, use the arrows, or the keyboard's arrow keys.
- Touch a tale's ribbon to open it.
- Choose by pressing one of two wax seals; the page waits until a choice is made. A sealed choice stays until the tale is started over, as in a role-playing game: going back to its page shows it made; the other seal no longer answers, and pressing the chosen one only makes it glow.
- Switch the language: the open spread is rewritten in ink.
- Turn sound on or off.
- Read a short "Did you know...?" note under the picture on 3-4 pages per tale.

Choice interactions:

- "Ask what happened."
- "Hold up the lantern."
- "Share warm bread."
- "Call the carpenter."
- "Wait and listen."
- "Raise the shield gently."

The UI should avoid combat verbs.

### Choice Design Approach

Choices should use **soft branching** rather than fail states or complex game-like paths.

When a child chooses an action, the next page or later resolution should visibly acknowledge that choice by changing story details such as:

- Dialogue.
- Which helper arrives.
- Which small object is used.
- Which illustration variant is shown.
- Which concrete detail, helper, dialogue, or final reflection appears.
- The whole next page, written for that choice (`bodyByChoice`).
- A detail that comes back later, often in the ending (`paragraphByChoice`).

All choices should remain kind, constructive, and valid. The story may rejoin the main path after a choice, but the child should feel that their decision mattered and changed the way the tale unfolded.

## Curiosity Notes

Curiosity notes replace parent prompts. They should be optional, rare, and unobtrusive, appearing on only 3-4 pages per tale.

Good curiosity notes:

- connect to something visible or mentioned on the current page
- add a small real-world or folklore-adjacent spark about medieval life, nature, animals, crafts, tools, food, bells, mills, bridges, gardens, weather, or old customs
- are short enough to read without breaking the story mood
- are written in Polish first, then adapted into natural English

Avoid generic discussion questions, moral quizzes, therapy-like reflection prompts, and long encyclopedic explanations.

## Visual Direction

Use a deliberate split between the physical book and the illustrations inside it.

### Book And Scene Style

The book itself should be inspired by ornate medieval storybooks, illuminated manuscripts, and old fairy-tale volumes:

- Open medieval manuscript or travel journal spread.
- Aged parchment with warm yellow-brown texture.
- Darkened page edges, stains, ink specks, uneven fibers.
- Decorative borders inspired by illuminated manuscripts, floral margins, corner ornaments, ribbons, and gold accents.
- Thick page block, visible page edges, worn spine, and slight page curvature.
- A surrounding tabletop scene with candlelight, soft shadows, and a tactile bedtime-story feeling.
- Warm candlelit scene with high-quality lighting and shadows.
- Rich but gentle fantasy atmosphere.

### In-Page Illustration Style

Illustrations should draw from manuscript-like medieval game art similar in spirit to **Pentiment**:

- Flat layered scenes with expressive ink outlines.
- Muted historical pigment colors: moss green, faded ochre, dull red, dusty blue, warm gray, parchment cream.
- Lightly textured fills, visible brush/ink irregularities, and hand-drawn imperfections.
- Side-on or shallow-stage compositions rather than realistic cinematic depth.
- Medieval village architecture, timber frames, thatched roofs, bridges, fields, workshops, animals, banners, and small figures.
- Characters should feel readable, warm, and expressive, with gentle body language.
- Fantasy elements should be integrated into the manuscript world rather than rendered as glossy modern fantasy.

The illustrations can sit inside framed manuscript panels, margin vignettes, maps, illuminated initials, or decorative page scenes. The goal is not photorealism; the goal is a living manuscript.

Detailed current art direction: the style bible `docs/pilot/MANUSCRIPT_BIBLE.md` and each tale's set bible (`docs/pilot/SET_BIBLE_<tale-id>.md`).

Avoid:

- Dark horror fantasy.
- Aggressive battle imagery.
- Overly modern UI chrome.
- Overcrowded pages.
- Body text that is too ornate to read.
- Glossy high-fantasy concept art, realistic 3D renders, anime styling, or generic mobile-game cartoon visuals.

## Typography

Recommended direction:

- Decorative medieval or calligraphic font for titles, initials, and short labels.
- Highly readable serif font for body text.
- Large enough type for child-parent reading at desktop and tablet sizes.
- Avoid using script fonts for long paragraphs.

As built: **EB Garamond** for everything (titles, text, labels), self-hosted, with painted illuminated initials and gold ornaments carrying the medieval feeling, so the body text stays easy to read.

## Color And Lighting

Palette direction:

- Parchment: warm ivory, ochre, aged yellow.
- Ink: dark brown, near-black sepia.
- Accents: muted crimson, deep green, old gold, faded blue, soot gray.
- Lighting: warm amber candle glow with soft falloff.

Use restrained color. The page should feel old and warm, not neon or cartoonish.

## Motion Direction

Motion belongs to the book and the desk, not to the pictures, which stay still so they can be read:

- The candle flickers and its light moves softly over the pages.
- The book opens from its cover; leaves curl and turn; ribbons lift under the hand.
- A choice is sealed with wax and its answer written in ink; a changed language is rewritten in ink.
- "Begin again" riffles the pages back to the tale's title.

Motion stays slow and calm, never flashes, and gives way to a crossfade when the reader prefers reduced motion.

## As Built

The first plan was a 2D/2.5D React app with CSS/SVG animation, to keep text readable. The book was built in 3D instead, with the text typeset onto the pages at runtime, which kept it as readable as the 2D plan.

- **Stack:** Vite and plain JavaScript, no framework; three.js for the book, the desk and the light; Web Audio for sound; deployed to GitHub Pages from `main`.
- **Code:** `index.html` and `src/book/` (`main.js` the scene and reading, `book.js` the book, `pageArt.js` the typesetting of the pages, `pages.js` and `tales.js` the pictures and the tales, `soundscape.js` the sound script). The tales' text is in `stories.js` and `locales.js`.
- **Page layout:** the left page carries the text, the right page the picture: a framed 5:4 plate with the choices or a note under it, or a 2:3 portrait. The reading mode follows the screen: the whole spread, one page at a time, the text column on a phone held upright, or a part of the spread at a time on a phone held sideways.
- **Pictures:** raster illustrations in style A v2 (Pentiment-like manuscript art), generated with Codex ImageGen from builder-written prompts, graded per time of day and exported as WebP; shared marginal ornaments. The pipeline lives in `prototypes/` and never ships.
- **Sound:** generated with ElevenLabs and mastered by the tools in `scripts/sfx/` into Opus and AAC files; a bed per place and time of day with long crossfades, a few quiet spot sounds, one UI click, a seal and a harp for choices, and a theme at the start and end of each tale. Sound starts with the reader's first tap on the start gate; it can be turned off at any time, and the book remembers that.

## Accessibility And Comfort

- Keep text readable and scalable.
- Do not rely on audio only.
- Respect reduced-motion preferences.
- Avoid sudden flashes or loud sounds.
- Make controls large enough for parent-child use.
- Keep interactions calm and predictable.

## Future Ideas

- More tales: forest oath, winter feast, lost heirloom, boastful knight learns humility. Two ribbons in the book are waiting for them.
- Optional keepsake ending pages that summarize the tale's values without adding mid-story moral labels.
- Custom child/parent name insertion.
- Story bookmark saves.
- Printable story page export.
- Simple story editor for parent-authored tales.
- Isometric mini-map between stories.

## Status

The first release is live with two complete tales: https://artskw.github.io/the-book-of-magical-tales/. As the brief foresaw, the main work is content: writing tales, preparing their pictures and sound, and polishing the atmosphere.
