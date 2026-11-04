# Decisions

Directions the author approved or rejected, with the reason, so no session
re-opens them. Newest first. The rules that follow from them live in the
bibles and the prompt builders; this log keeps the why.

- **2026-11-04: name groups exactly; clear, not poor.** Reading the Forest Oath in the book, the
  author found "the Heartwood, where the animals are safe… no pigs" unclear (pigs are animals too)
  and p3's endings thin: "żołędzie" four times and "jeleniom" three times in a paragraph, short flat
  clauses. Clarity for a child must not make the language poor. Now `WRITING_BIBLE.md` §1 rules 14
  and 15, and a warning in `validate:stories` for a content word three times in one paragraph. The
  author chose: "schronienie dzikich zwierząt. Świniom ze wsi…", Oliwia's understanding told in
  narration on the follow-piglets path, "To dlatego mgła dziś nie zeszła" on the call-back path, and
  the saying "Co obiecane lasowi…" (the oath was made with the forest).

- **2026-11-03: no shared paragraph after a choice; a choice page states the need; learning from
  the masters.** After rereading "Leśna przysięga", the author found p4 did not say why the heroes
  must talk to Marcin or what they need from him (p3 had already told what he would confess), and the
  page after the choice repeated its last paragraph in both variants. A scan showed 11 of the 12
  pages after a choice, across all three tales, ended on a paragraph shared by both variants: the
  rule "the choice runs through all three paragraphs" had no gate. Now: no paragraph may be the same
  in two variants (error in `validate:stories`; a warning for the Dragon and the Bell until they are
  rewritten), and a choice page says what the heroes need before the seals (`WRITING_BIBLE.md` §2).
  The bible named Tolkien and Rowling in one line and said nothing of their techniques; §5 now lists
  what we take from them and from Konopnicka and Leśmian, with a per-page check. Order agreed: the
  Forest Oath is rewritten first by these rules; if it reads well, the two older tales follow.

- **2026-11-01: "Leśna przysięga" approved.** The author accepted the tale's text and every picture
  after reading the whole book on both paths. A detail that must look the same on several pages (the
  old gate's split star) is copied from one approved page in the same view, not regenerated or redrawn:
  three regenerations and two hand-painted versions each came out different.

- **2026-11-01: "Leśna przysięga" after reading the whole book.** (1) The two variants of a page
  must differ in content, layout and perspective, each drawn from its own text, as in the earlier
  tales. Rejected: one camera per pair with small changes (our rhythm rule had said "a variant pair
  keeps the same shot"; the rule in `MANUSCRIPT_BIBLE.md` §3 now says the opposite). (2) Gustaw carries
  his shield only while he walks or stands. When his hands are busy (lifting, holding, pulling,
  kneeling) he sets it down nearby, still in view; it is equipment, not welded to him. (3) The old
  gate's split star has one form on every page: the crossbar snapped through the centre of the star,
  each half carrying half the star (the approved p3 follow-piglets take is the detail reference).
  Rejected: a whole star with a crack beside it.

- **2026-10-31: "Leśna przysięga" after the author's first reading.** (1) The charcoal burner is
  Agata, not Dobrochna (too foreign for today's children); the deer's place is the Matecznik /
  the Heartwood, the folk "heart of the forest" where animals are safe, not the "Dębowy Kąt"
  (too generic, a third "oak" name). (2) The oath's star is on ONE thing: the gate's crossbar.
  The storm broke the gate, the piglets went in through it, the heroes find the cracked star,
  build a new gate and Marcin carves the star again; the rest of the fence is plain. Rejected:
  a star on every post, then one new post with a new star (no reason for it to be special).
  (3) A choice label says one concrete act: "Pokaż Marcinowi ślady raciczek", not "show him
  gently". (4) The two options of a choice must be different kinds of action: p8 is "step
  back, the hind will lead it" (trust the animal's nature) or "pull the branch away with
  Koniczynka" (practical help); rejected "make way" / "move the branch", which were one act.
  Choice ids stay; the pictures with fence stars are regenerated.
  Pictures (fresh-context review): the new gate has ONE design on every page (three pale planks
  under one broad crossbar with the carved star); the old cracked gate shows only on p7 as
  Marcin's pattern, so later pages hold one star; on p8 the branch must truly cut the fawn off
  from the doe; Marcin carves with a mallet and chisel, so the tool cannot read as a knife.

- **2026-10-31: one type scale by role.** The pages used 17 different sizes (eight of them
  between 30 and 38) and six separate phone multipliers; the same element had one size under a
  plate and another on a text page. Now every text has a role on one modular scale (house body
  42, ratio 1.125): display, title, body, quote, label, small, caption, caps. Only the body is
  fitted per tale; on a phone, label and small print go one step up. The interface has four
  tokens. The note is `small` (33), a step under the labels. Rejected: keeping today's values
  as named tokens only (no hierarchy); a screen-pixel floor before it can be measured on devices.
  Table: `docs/TYPE_SCALE.md`.

- **2026-10-31: the "Did you know" note reads as a gloss.** Its body was small italic
  in a light brown on a darker tint, hard to read. Now: upright in the main ink, one step of
  the body scale under the small print of the choices (35 against 37), a rubric rule at its left like a manuscript gloss,
  on a soft lighter patch of paper with feathered edges and gently rounded corners; the red
  italic title stays. Rejected: a heavier italic (C), a solid pasted-in slip (E).

- **2026-10-31: heroes reason out loud, and refrains are concrete** (author's review of the
  dragon tale, p3). "Idźmy łagodnie" read as an order with no clear meaning. Heroes now
  show notice → understand → help in their own words (Oliwia: the dragon guards the mice
  because it cannot tell anyone they live there), and a refrain names an action and its reason
  ("Powoli i cicho, przy moście śpią myszki"). Rules 9–10 in `docs/WRITING_BIBLE.md`.

- **2026-10-31: the tales are one journey.** Gustaw and Oliwia travel on from tale to
  tale; Oliwia's bag collects one keepsake per tale (a reed basket from the bridge, a
  pear leaf from Moonhill), the same on every path. Every tale still reads alone and in any
  order. Craft for wonder without animating objects: a law of magic, a world beyond the page,
  a mystery with a clue in a picture, a gentle clock, a refrain, an origin
  (`docs/WRITING_BIBLE.md`).

- **2026-10-31: the tale text is rewritten for logic and craft.** The first
  tales held details with no reason in the story (Gustaw's sword gleaming, the
  baker's rolls, Oliwia's tummy), ornamental similes, and objects that "hear"
  or "want". The cause was partly our own rules (BRIEF asked for "bells
  remember, trees listen" and for echo lines saying "the book remembered").
  Approved: (1) the book is not a character or a narrator inside a tale; it
  stays only in the frame (dedication, title pages); (2) a choice rewrites the
  whole consequence page for each path, the italic echo line goes, and an
  earlier choice may return later as one concrete detail (most of all on the
  ending); pictures still vary only on the choice just before them;
  (3) the Moonhill page 6 choice "remember the bell's name" becomes a real,
  different way to mend the bell, with new pictures as needed. Both languages
  follow. Rejected: animating inert things for decoration; mid-tale morals;
  a choice whose two paths end the same.

- **2026-10-30: a choice is sealed for good.** Once made, a choice cannot be
  changed by going back to its page; only "Start over" on the tale's last page
  clears the choices. The reader should feel the tale answer a decision and
  live with it, as in a classic role-playing game. The other seal no longer
  answers a click or a touch at all; pressing the chosen one only makes it glow
  once (no words, no tone). Rejected: re-choosing at will, which made the
  choices feel like a toggle; a glow answering a press on the other seal.

- **2026-10-21: production sound via ElevenLabs.** The Openverse placeholder
  sounds were removed as not good enough. Sound was then made with the author's
  ElevenLabs account through `scripts/sfx/`.
- **2026-10-21: the 3D book replaces the 2D v1.0.** The pilot, theatre and
  canvas explorations were deleted.
- **2026-10-19: style A v2** (Pentiment-like ink and watercolour, simple muted
  palette). Rejected: style B, painterly in the manner of KCD2, as
  oversaturated and generic, with slips in logic.
- **2026-10-19: tone is graded chroma-only** to the author-approved tone
  anchors (`prototypes/grade.py`). Rejected: full Lab colour transfer, which
  greyed the copper dragon. The location sheet is for layout only; its washed-out
  colours never drive tone.
- **2026-10-19: images must look finished and rich.** An over-constrained
  "flat, no shading, plan view" prompt produced banal clip-art (dragon p4
  top-down). The bar is the dragon tale's p5-lantern.
- **2026-10-19: 3–4 characters per scene, faces visible.** The earlier "at most
  two faces" rule produced scenes of hands and backs.
- **Rejected: paper-theatre cut-outs**, because of errors in scale and logic.
- **Rejected: illustrations drawn in code**, because each image cost too much.
