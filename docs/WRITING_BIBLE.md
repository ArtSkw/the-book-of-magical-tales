# Writing Bible

How the tales are written: the rules every sentence answers to, the tale card filled in
before drafting, and the checks a draft must pass. It is to the text what
`docs/pilot/MANUSCRIPT_BIBLE.md` is to the pictures. The values and nonviolence rules stay in
`BRIEF.md`; the data shape and page limits in `docs/TALE_TEMPLATE.md`. Why these rules exist:
`docs/DECISIONS.md`, 2026-10-31.

The bar: a tale should read as if a real author of children's tales wrote it, someone who knows
the world better than the page shows. Tolkien and Rowling for a world with its own rules,
history and payoffs; Kipling, Donaldson, Potter, Hutchins and Sendak for read-aloud craft.

## 1. Every sentence earns its place

1. **Every detail has a reason, or comes back later.** Ask of each object, gesture and
   description: why is it here? "To make it pretty" is not an answer. A detail planted early
   pays off later (the baker's rolls on p7 → the flour on Koniczynka's nose on p9; the rope
   missing from the tower on p2 → found in the pear tree on p3). A detail with no reason is cut.
2. **Every action has a visible reason on the same page.** Not "the baker passed rolls" but
   "the baker brought rolls, because the work would last into the night".
3. **A feeling has a cause the reader saw.** No "Oliwia felt a knot in her tummy" out of
   nowhere. Better: give the character something to notice or do.
4. **The narrator is invisible, and the book is never a character.** No "the book heard",
   "the book remembered", "the book paused". The book is the frame (title pages, dedication);
   inside a tale there are only the characters and their world. (Gate: `validate:stories`.)
5. **Magic belongs to the world, not to decoration.** Magic is a rule of the world, stated
   plainly once and kept: bridge dragons breathe warmth that heats stone but never burns;
   silver moths gather where something waits to be mended. Living beings may understand and
   feel (the dragon, the mare). Stones, leaves, reeds and bells do not hear, want or remember.
   No ornamental "as if" about inert things. (Warning in `validate:stories`: more than one
   "jakby" / "as if" on a page.)
6. **One comparison per page at most**, and only when it shows a size, shape or sound the
   child could not otherwise picture ("thin as a hair", "like embers that no longer burn").
   No stacked similes ("round as a nutshell and light as a spring leaf").
7. **No morals in the middle.** No "not because anyone won a battle, but because…". The value
   is shown by what characters do; the last page gathers it, best as something said in the
   world (a saying at the inn, a custom of the village), never as a verdict on the reader's
   choice.
8. **Pictures and text agree.** When a picture shows something the text does not say, or the
   other way round, fix one of them (prefer fixing the text) or turn the difference into story
   (Moonhill: the pictures showed the ladder's feet wrapped in cloth, so the text says why:
   so they would not scrape on the stones). Check pictures zoomed, not as thumbnails.

9. **Heroes think out loud: notice → understand → help.** This is how the tales teach empathy
   and problem solving, so every tale shows it at least once, plainly, in a character's own
   words. *Notice*: what the hero sees or hears (the nest shakes with every step). *Understand*:
   why someone acts as they do, in words a child could repeat ("The dragon isn't blocking the
   road to be unkind. It's guarding the mice, because it can't tell anyone they live here.").
   *Help*: a concrete next step that fits that need (move the nest before the carts come).
   A conclusion follows from what the reader has just seen; it is never a slogan.
10. **Advice and refrains name a concrete action and its reason.** Not "go gently" (gently how,
   and why?) but "slowly and quietly, mice are sleeping by the bridge". If a child could ask
   "what does that mean?", rewrite it. Heroes do not announce virtues or moods
   ("let's be kind"); they notice, ask, explain and propose.

11. **Animals and creatures keep their nature.** Heroes do not give animals human social rituals
   (bowing, titles, courtly thanks). Empathy for an animal means respecting what it is and needs:
   quiet, distance, room to pass, the right food, its home. A wild animal is never approached or
   touched for the scene's sake; a magical creature speaks through its own behaviour (the bridge
   dragon's slow blink), not through human manners. Children learn something true: you give a deer
   room, you do not walk up to it.
12. **A refrain is something someone in the world would really say or do.** It exists so a young
   child can predict it, join in aloud and retell the tale. It is short (a child can say it with
   the parent, about five words), comes from the plot (a call, a custom, a sound, a request), and
   its meaning grows through the tale; it is never a composed maxim. Good: „Bim-bam, do domu!”,
   „Powoli i cicho, przy moście śpią myszki”, „Ręka w rękę, krok za krokiem”.

13. **Worry is never faced alone.** A young child must never be asked to imagine being lost,
   left or alone in the unknown. Uncertainty in a tale is always shared: someone who knows the
   way, a hand to hold, a warm animal, a plan. Mist, dark or a strange place can be mysterious,
   never threatening, and the tale's tension comes from a mystery to solve or someone to help,
   not from the heroes' own fear.

## 2. Choices change the page, not one line

- The page after a choice is written **whole, once per option** (`bodyByChoice`). The choice
  runs through all three paragraphs; there is no italic echo line.
- An earlier choice may **come back later as one paragraph** (`paragraphByChoice`), e.g. the
  first choice returning in the ending's saying, or the p6 choice deciding how p8 opens.
  Pictures vary only on the choice right before them, so a returning paragraph must fit every
  picture it can sit beside.
- **Every path is a real, complete way through.** Two options that end the same are a fake
  choice (rejected: "remember the bell's name" that still needed the blacksmith).
- **The response line under a seal states the intent, not the outcome** ("Oliwia will gently ask
  what it is guarding", not "a gentle question will give the dragon courage").

## 3. The spine, then the craft

Before the tale card, every tale answers five questions in plain words. If an answer is vague, the
tale is not ready to draft. Every page and every choice must serve this spine.

1. **The problem:** what is wrong, concretely, and what caused it (a cause the reader can follow).
2. **Why it matters, and to whom:** who is affected (people, animals, nature) and what they need.
3. **Why the heroes act:** what they notice and understand that makes them help; never "because
   heroes help".
4. **The values shown** (from `BRIEF.md`: kindness, understanding, compassion, respect for nature,
   animals and other people, honesty, keeping one's word…): which ones, and in which actions.
5. **The one thing to remember:** a single sentence a child could repeat after the last page. It is
   never said in the middle of the tale; the last page carries it in the world's own words (a
   saying, a custom, a sign).

### The tale card



Fill this in after the spine, before drafting, and keep it with the set bible. A tale need not use
every row, but an empty row is a decision, not an accident.

| Row | What it is | Dragon | Moonhill |
|---|---|---|---|
| **Law of magic** | One or two rules, stated once, never broken | Bridge dragons breathe warmth, not fire; warmed stone glows amber | Silver moths gather where something waits to be mended |
| **Creatures and folklore** | The medieval world interweaves with the legendary and the folk: a real animal with a real role in the plot, a fantastic being or phenomenon rooted in folk tradition (original, with its own rules), and a village custom or belief that explains it | River mice in the parapet · a bridge dragon · the custom of the red pennant and the slow blink | A mare and a finch family · silver moths that circle what waits to be mended · the evening bell, its name and its rhyme |
| **The world beyond the page** | One or two mentions of a larger world, never fully explained | Gustaw's grandfather's tales of bridge dragons; the basket maker's grandfather saw the slow blink | Grandmother Janina's girlhood; the bell's forgotten name and rhyme |
| **Newcomer** | Gustaw and Oliwia arrive; locals explain their customs | The red pennant custom; the slow blink | Why the hill is "Moonhill" (the crescent weathervane); the rhyme |
| **Mystery and clues** | One small mystery, 2–3 fair clues, one of them in a picture first | Tail round the stone (p1 picture), breath on the stone, the peep | Moths in the orchard (p1 picture), the rope gone from the tower, the windy afternoon |
| **Stakes and a gentle clock** | Something real to lose, no fear | Market carts cross at dawn | The shepherd comes home by the bell; the mist is coming down |
| **Refrain** | A short, natural line said three times, the last time changed; something a character would really say (rules 10, 12) | "Powoli i cicho, przy moście śpią myszki" (the promise, the night, the carts at dawn) | "Bim-bam, do domu!" (and the hoarse clank in between) |
| **Joyful turn** | A moment of wonder right after it seemed not to work | The warm path / the cradle carried home | The first clear note after the hoarse clank |
| **Origin** | Something in the world the child now "knows" the reason for | The saying at the inn; the copper scale in the wall | Three stars on Moonhill's arms; the finches' dawn song |
| **Notice → understand → help** | The moment a hero says plainly what they understood about someone and why (rule 9) | Oliwia, p3: the dragon guards the mice because it can't tell anyone they live there | The carpenter, p4: if the finch takes fright, the chicks get cold, so the rope comes loose without a tug |
| **Voices** | Each speaker sounds like themselves; at least one spoken line on most pages | Gustaw: few, calm words; the basket maker: his grandfather | Janina: memories and rhymes; the carpenter: practical, careful |
| **Rich words** | One real craft or old word per page, clear from context | mostowe, wapno, trzcina | spiż, nit, serce dzwonu, jesion |
| **Keepsake** | One small thing Oliwia keeps, the same on every path | A tiny reed basket woven from the cradle's leftovers | A pear leaf, tucked in beside the reed basket |
| **Return to warmth** | The last page is safe, warm, at rest | The inn, the sleeping mice, the carts crossing slowly | The bell resting, the chicks, the village home |

## 4. The journey

The tales are stations of one journey: Gustaw and Oliwia travel on (the dragon tale ends on the
road to the inn). Oliwia's leather bag, drawn in every picture, collects one keepsake per tale,
and a later tale may mention an earlier keepsake in one sentence. Every tale must still read on
its own and in any order: a reference to another tale is a small pleasure, never something the
reader needs to know.

## 5. Writing and checking

1. Answer the spine (§3), fill in the tale card, and keep the story state in the set bible.
2. Draft in Polish; read every page aloud. Then a full `miodkuj` audit (skill
   `anthropic-skills:miodkuj`, its whole workflow and quality gate) by an agent in a fresh
   context, not by the one who wrote the text.
3. Run the questions on every page, every path: *Why is this here? Where did it come from?
   What does it change next?* A sentence that answers none of them goes.
4. Adapt into English as natural prose (not a calque); keep beats, ids and payoffs. Then an
   English anti-slop audit by a fresh agent against the Polish source: AI cadence (tidy triads,
   "not X but Y", faux-profound closers, clichés), Polish-shaped word order, register, rhythm
   read aloud, British spelling kept consistent.
   **Any later change to the text, in either language, goes through its audit again** before
   the author sees it; a fix made after the last audit is not audited.
5. A fresh-context reviewer reads the tale against this bible and the pictures, path by path,
   before the author does.
6. `npm run validate:stories` enforces: whole-page variants after every choice, no echo lines,
   one owner per paragraph, every text field translated, no book inside the tale, the initial
   opening on a letter, and warns on stacked "as if".
