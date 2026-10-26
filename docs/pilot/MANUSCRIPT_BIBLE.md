# Manuscript Bible — "Smok na starym moście" / "The Dragon on the Old Bridge"

Art direction for the illustrations inside the 3D book. One ImageGen call per image, no edits. The book (3D, candle-lit room) supplies parchment, margins, initials, ornaments and the "golden words"; the images only have to show, simply and clearly, what the text on that page says.

What changed since the earlier side-view miniatures (direction C): the manuscript language stays (flat tempera, ink contour, gold leaf), but the images are no longer small side-view miniatures beside the text. Every page gets a deliberate **shot** (wide, close, over-the-shoulder, top-down, floor-level, detail, spot) so that the ten pages have rhythm, and the plates are large (full page, or a framed plate that owns the right page). "Too quiet" is answered with proximity and point of view, not with more detail.

Contents: 1 Style bible · 2 Character canon · 3 Shot grammar · 4 Scene cards (10 pages, 15 images) · 5 Pilot (4 images) · 6 Generation order and gates.

---

## 1. Style bible

### 1.1 One sentence
A late-medieval illuminated miniature in the spirit of Pentiment, softened for children aged 4–8: flat opaque colour, one dark-brown contour, gold leaf as pigment, calm faces, up to three or four characters in a scene so its meaning reads at once, one key object per picture.

### 1.2 Palette (hex)
**Style A v2 (2026-10-19):** the user chose option A (Pentiment ink + watercolour) and asked for a simpler, more muted palette than the first A tests — see `prototypes/prompts/_style-a2.txt` for the prompt block. The character hexes below still define identity; renders desaturate them slightly.


| Role | Hex | Notes |
|---|---|---|
| Parchment / vignette ground (book supplies it) | `#efe3c6` | never painted inside a plate |
| Ink contour (every asset) | `#4a2e1c` | the single line colour |
| Sky, warm end | `#e9d9a6` | cream-gold, early evening |
| Sky, cool end | `#a9b7bd` | slate blue, the only allowed gradient |
| Dusk slate (pages 4–8 flat fields) | `#6b7a8c` | |
| Night blue (pages 9–10) | `#3d4a5c` | stars = gold dots |
| Diaper blue (pattern grounds) | `#3b5b8c` | lozenge lattice with gold dots |
| Hills | `#8a9a52` | olive |
| Moss | `#5f7a3a` | "soft as a green blanket" |
| Stone | `#a39f87` | shadow block `#6f6b58` |
| Water | `#6f8c9a` | |
| Mist ribbon | `#f4efe3` | flat opaque band |
| Dragon copper | `#c8742c` | belly plates `#e39a4f`, horns `#d8c08a` |
| Gustaw cloak | `#8a3a2c` | shield `#9b2f2a`, griffin `#d9a53c` |
| Oliwia dress | `#3f7d78` | gold trim `#d9a53c` |
| Wool | `#efe4c8` | |
| Bread crust | `#a56a35` | crumb `#d7b98a` |
| Red pennant | `#b6392e` | |
| Gold leaf, base | `#c9972b` | burnished |
| Gold leaf, highlight band / glow fields | `#f3c76a` | |
| Mouse Big / Middle / Smallest | `#8b7b66` / `#a3805a` / `#c9a97e` | see 2.4 |
| Helpers: miller tunic / baker dress / basket maker vest, cap | `#7a5a3c` / `#9b3b2e` / `#b24a35`, `#4e6b4a` | |

### 1.3 Line
- One closed contour in `#4a2e1c` around every shape, like the edge of cut paper. Weight hierarchy carries depth: heaviest on the main subject and foreground shapes, medium in the middle ground, thin and slightly lighter in the distance. No contour-less painterly edges.
- Interior marks are economical: two or three fold lines on a garment, a few arcs to suggest scales on the dragon's flank only, each stone drawn with a single line, three whiskers per side on a mouse. Short parallel hatching only inside cast-shadow blocks; never cross-hatched fields, never hatching as texture.
- Nothing is rendered: no stippled fur, no individual leaves (foliage is drawn as grape-like clusters), no brickwork grids.

### 1.4 Colour handling
- Flat, opaque, tempera-like local colour. At most two values per object: the local colour and one flat, slightly cooler shadow block. No gradients (the sky band is the single exception: one smooth cream-gold → slate transition), no airbrush, no modelling, no highlights on skin.
- Warm key with cool counterweights, as on the approved cover: copper, red and gold against moss, slate and teal.
- Time of day is carried by the sky/field colour, never by darkening the figures: early evening (p1–3) cream-gold to slate; cold dusk with mist (p4–7) slate dominant, gold concentrated in lantern/breath; deep dusk (p8) slate with lit windows; night (p9–10) night blue with gold-dot stars. Night is never black and figures keep their full local colour.
- Inside plates the parchment tone does not appear (the book adds margins); plates fill their canvas edge to edge with a thin gold frame line just inside the edge.

### 1.5 Faces
Kind, authored, never anime: almond eyes with a visible upper lid and a dark-brown iris, pupils as dots with one tiny highlight; small straight nose; small calm mouth, closed or barely smiling; slight asymmetry; brows drawn as one soft line. Gustaw: long oval face. Oliwia: oval face, dark brows, no pointed chin. Forbidden: big glossy eyes, blush circles, open grins, teeth, caricature noses, long Pentiment noses. Up to **three or four characters per scene, with their faces visible** (revised 2026-10-19: hands-and-backs-only framing made scenes hard to read for a child). Every visible face must be on canon; beyond four, extra figures are seen from behind, in profile or far away. A scene shows the characters the text names as present — the reader should see who is acting, not only their hands.

### 1.6 Backgrounds — three modes (plus none)
1. **Landscape band** (WIDE, OTS, FOLLOWING, POV, LOW): a tilted flat ground plane as in Gothic miniatures, and above it a single shallow band of stylised rounded hills, cluster-trees, the mill or the inn, then the sky field. One band, never a deep vista.
2. **Diaper pattern** (CLOSE, some DETAIL): a flat lattice of lozenges in `#3b5b8c` with one tiny gold dot per lozenge — the classic manuscript ground that means "we are close to someone, the setting does not matter now". Perfectly flat, no perspective.
3. **Flat field** (HIGH, DETAIL): either the stone surface itself (large flat grey-olive blocks with moss in the joints) or a single flat dusk field `#6b7a8c`.
4. **None** (SPOT/vignette): true transparency; the group stands on at most a small tuft of grass or a patch of stone that belongs to the silhouette.

### 1.7 Gold and magic — painted as objects, never as lines
- **Dragon's breath** (user, 2026-10-21; replaces the earlier flat gold-leaf cloud): soft translucent wisps of warm golden air with a fine gold-leaf edge, curling, thinning and dissolving like breath on a frosty morning (`BREATH` in `_build_a2.py`). Never round cloud icons, flower or blossom shapes, dots, sparks, rays, lines or threads. Warmed stones glow amber from inside.
- **A tune — humming, a song, a lullaby** (user, 2026-10-24): a light, airy scatter of about eight tiny gold-leaf notes in the manner of a medieval chant book (square and lozenge note heads, a few with one thin stem; no staff, no modern clefs or quavers) with a few tiny four-pointed gold sparkles, floating loosely and far apart and fading away (`MELODY` in `_build_moonhill.py`). Never a ribbon, line or thread: next to a bell rope it reads as a second rope. A bell's ring alone may still be drawn as a few wide, soft waves of warm air.
- **Lantern light / warmed things glowing**: a flat pale-gold field (`#f3c76a`) with a crisp edge, optionally rayed with 6–8 short straight gold strokes like a manuscript sun. Light "lies on" stones as a flat shape. No gradients, no lens flare, no light rays as thin lines, no cast shadows.
- **Warmed stone** (p3): a flat pale-gold halo ring around the stone, like a nimbus.
- **The sword "shone"** (p8): one small flat gold four-pointed star on the pommel. That is the whole glint.
- **Stars**: gold dots. **Candles**: never in images (the 3D room owns candles).
- **Golden words in dragon speech** (p9/p10, variant `name-promise`): the image contains only a small flat **tablet of gold leaf** (a rectangular patch with punched dots) on the parapet / by the cradle. The glyphs are set by the book in code, like initials. No letters, runes or marks that look like writing are ever generated.

### 1.8 Forbidden (goes into every prompt as negatives)
Text, letters, numbers, runes, signatures, watermarks · any figure not listed in the counts · any animal not listed (no birds, no horse, no dog) · gradients, airbrush, modelling, photographic texture, 3D-render look, depth-of-field blur, bokeh, fish-eye distortion · sparkles, lens flare, light rays as lines, smoke threads · anime, chibi, caricature, teeth, open-mouth grins · drawn weapons, raised weapons, fire, flames · black night, cluttered backgrounds, perspective grids · parchment margins or border ornament inside plates · the dragon with spread wings, a spade-tipped tail, red eyes or a giant size.

### 1.8a Continuity of bodies and buildings (user, 2026-10-24)
- A structure stays whole: a parapet, wall, deck or tower runs on unbroken behind and past any figure. It is hidden only where something really stands in front of it, and it never fades out or stops where a figure lies.
- Every figure is drawn whole and countable: two legs and two feet on a ladder, never a limb melting into a trunk or wall. A person holds one stick, staff or tool, never a doubled copy of it (one for leaning, one for pointing).
- The dragon's head reads as **two-horned**: two long swept-back horns plus a pair of very short stubs in front, less than a third of their length. Never three long horns.

### 1.9 Readability rule
Every image is judged cold at 320 px wide: the key object must be the clearest thing, the counts must be countable, the smallest meaningful detail (a mouse's eye, a crumb) is at least 3 px at that size. Eye-lines of all figures converge on the key object.

### 1.10 Geography (keeps shots consistent)
**Superseded in detail by `SET_BIBLE_dragon-bridge.md` (2026-10-19)** — the set canon, compass, nest position and continuity rules for every tale live there. Summary kept below.

The heroes arrive from the **left** bank; the bridge runs left → right with one round arch; the loose stone and the mice's gap are in the **near parapet**, right of centre; the dragon sits at the middle/right; the path to the mill and the village leaves from the **right** end; the brook flows toward the viewer; the inn is far beyond the right. Side-view cameras stand on the near bank. The FOLLOWING shot (p5 lantern) is a deliberate reverse angle (we come from the mill), so the bridge is ahead and Gustaw faces us.

---

## 2. Character canon

Fixed descriptions. Paste only the characters present into a prompt. Source of identity: `prototypes/refs/cover.png`, `dragon-hero-head.png`, `gustaw-lantern.png`, `oliwia-kneel.png`, `basketmaker-kneel-cradle.png`; the miller and the baker are fixed below in words.

### 2.1 The dragon
Copper-coloured (`#c8742c`) with lighter copper-orange belly plates (`#e39a4f`); about the size of a horse — lying down, its back reaches a grown man's waist, and its head is longer than a man's torso. A rounded, soft snout with small nostrils and a closed mouth with a gentle smile line; large almond eyes with heavy upper lids and dark-brown irises; two long pale striped horns (`#d8c08a`) swept back from the crown and a second, shorter pale pair in front of them; a ridge of short copper spines from the crown down the neck; small bat-like wings always folded flat on the back; a long plain tail (no spade tip); four-toed paws with pale claws; scales suggested by a few arcs on the flank only. Expression: a worried, kindly grandfather. Thumbnail signature: copper mass + two pale horns + heavy-lidded eye. Never: teeth, flames, red eyes, spread wings, giant size, a second dragon.

### 2.2 Sir Gustaw
A young knight of about twenty: chin-length wavy blond hair, no beard, long oval face, straight nose. Grey mail shirt to mid-thigh over grey hose, grey knee plates, tall brown boots. Brown belt with a sword that always stays in its brown scabbard at the left hip. Red cloak (`#8a3a2c`) clasped at the right shoulder with a round gold brooch. Red kite-shaped shield (`#9b2f2a`) with a golden rampant griffin (`#d9a53c`), carried on the left arm or slung on the back. A bronze lantern with horn panes and a carrying ring, one candle inside. From behind: red cloak dominates, blond hair above it, the griffin shows if the shield is slung. Thumbnail signature: red cloak + blond hair + red shield.

### 2.3 Oliwia
A girl of about nine, two heads shorter than Gustaw (her head reaches his chest): long wavy chestnut-brown hair past her waist with a thin braid around the crown, dark brows, oval face. Ankle-length teal-green dress (`#3f7d78`) with narrow gold trim at neck, cuffs and hem; a brown leather satchel on a strap across her chest; brown ankle boots. Small tan hands with short fingers. From behind: hair covers most of her back, the satchel strap crosses it. Thumbnail signature: teal dress + long brown hair + satchel.

### 2.4 The three river mice (always exactly three, told apart by size and colour)
- **Big** — grey-brown (`#8b7b66`), upright ears, long plain tail; shoulder height of a thumb.
- **Middle** — warm tawny brown (`#a3805a`), slimmer, with a **white tip to its tail**.
- **Smallest** — pale sandy (`#c9a97e`), round as a hazelnut with no visible neck, oversized pink ears, pink nose, stubby tail.
All have cream bellies, dot eyes with one highlight, three whiskers per side. They never wear clothes, never stand like people, are never pink or white. In every picture they are a single huddled or queued group so the count reads at once.

### 2.5 The helpers
- **The miller** — about fifty-five, dark beard streaked with grey, white head-cloth tied like a cap, brown knee-length tunic (`#7a5a3c`) under a cream apron dusted with flour, grey hose, brown shoes. Carries an armful of cream sheep's wool.
- **The baker** — a woman of about forty, round kind face, rosy cheeks, hair fully covered by a white kerchief, brick-red dress (`#9b3b2e`) with a cream apron over a slate-blue underskirt. Carries a folded clean white cloth with two thin red stripes.
- **The basket maker** — about twenty-five, light-brown hair under a green cap (`#4e6b4a`), thin moustache, cream shirt with rolled sleeves under a laced red vest (`#b24a35`), teal trousers, brown boots. Carries a bundle of green-grey reeds tied with string.
The three are a row: tall-bearded / round-kerchiefed / young-capped, each with a different load — the loads are how a child tells them apart.

### 2.6 Reference sheets to generate FIRST
Generated once, judged cold, copied to `prototypes/refs/`, then attached to every scene prompt in which the character appears. Prompts: `prototypes/prompts/m-sheet-*.txt`.

| Sheet | File | Contents | Needed by (pilot) |
|---|---|---|---|
| Dragon | `m-sheet-dragon.png` 1536×1024 | full body side view lying (tail round a stone) with a Gustaw figure for scale; head ¾; head profile with lowered snout + gold-leaf breath; curled asleep | p2, p4 |
| Heroes | `m-sheet-heroes.png` 1536×1024 | Gustaw front / side with lantern / **back**; Oliwia front / side / **back** / kneeling; correct relative height; hand details (lantern ring, open palms) | p4, p5 ×2 |
| Mice | `m-sheet-mice.png` 1024×1024 | the three in a row by size; sitting up looking up; noses from a crack; asleep in wool | p4, p5 bread |
| Helpers | `m-sheet-helpers.png` 1536×1024 | the three from the front with loads; the same three **from behind**; the three loads alone | p5 ×2 |

Back views are on the sheets because the shot grammar uses characters seen from behind (OTS, FOLLOWING). A sheet that fails canon is regenerated from the same prompt (a new generation, not an edit) before any scene is attempted.

---

## 3. Shot grammar

Seven shots. Each stays a manuscript image: same contour, same flat colour, same gold; only the framing changes. Depth is always made of overlap, scale and line weight, never of blur or atmospheric haze.

| # | Shot | When to use | Framing rule | How it stays manuscript |
|---|---|---|---|---|
| 1 | **WIDE** — establishing miniature | Open and close a tale; a place changes state (p1 ↔ p9 rhyme) | Side view, tilted ground, horizon at the upper third, figures thumb-sized, 3–6 figures max, one landscape band, the key object still readable | The classic book-of-hours page; gold frame line; stacked bands instead of perspective |
| 2 | **CLOSE** — intimate portrait | An emotional beat belonging to one character (or two) | Head-and-shoulders or half figure fills ⅔ of the frame; eyes near the upper third; diaper ground | Like a donor or evangelist portrait: flat patterned ground, heavier contour, face rules strictly |
| 3 | **OTS / POV** — someone's eyes | Discovery; the reader should stand where a character stands. Sub-forms: over-the-shoulder (one big foreground figure from behind), FOLLOWING (a group from behind), first-person (own hand/belt at the frame edge) | The foreground figure is a flat cut-out occupying ⅓–½ of the frame, cut by the edge; the "scene beyond" is drawn as a WIDE at smaller scale | No faces in the foreground figure, so no face risk; depth by overlap only; the foreground gets the heaviest line |
| 4 | **HIGH** — table-top, bird's eye | A plan, an offering, things laid out; choice pages where two options must be shown without resolving | Seen straight from above like a map; the ground (stone blocks) is the background; hands and snouts enter from the edges; objects in plan view | Like a diagram or a "table" miniature; hands drawn with 2–3 lines; light as a flat disc |
| 5 | **LOW** — child's / mouse's eye | The small ones' point of view; a journey measured in paws | Eye at ground level, horizon at the top quarter, stones as big blocks, people cut at the waist by the top edge (hems, boots, loads as kind shapes), mice in the foreground | No distortion; flat colour; big simple shapes; counts stay safe because faces are out of frame |
| 6 | **DETAIL** — hands and the object | The careful task; "hands had to be careful" | Tight crop around one object; hands from the edges; no faces; flat-field or diaper ground | The object gets the densest marks (weave, wool, griffin); everything else is calm flat colour |
| 7 | **SPOT** — vignette | Only small ornaments beside the text (tailpieces, drolleries). Never a story scene: a scene is a `plate` or a `full` portrait, and a tale's last page is the closing emblem (see Layouts) | Transparent ground, the group composed as one silhouette, soft irregular edge, at most a tuft of grass as a base | A drollery grown up: pure cut-out on cream |

Reserved, not used in this tale: **THRESHOLD** (framed through a doorway or arch) — for tales with interiors; the inn at the end of p8 is its cue for the next tale.

Rhythm rules: no two consecutive pages share a shot (checked along both reading paths); a variant pair keeps the same shot unless the choice itself changes whose point of view we take (p5: big ones vs small ones); CLOSE and SPOT never carry the heavy story beats alone; every tale has at least one WIDE at the start and one near the end.

Layouts (page rule, user 2026-10-21; it overrides the older page cards below): the left page carries text only. The right page is either a `plate` — 1536×1024, shown as a 5:4 crop, with the choices or a "Did you know" note under it — or a `full` portrait, 2:3, 1024×1536, when nothing sits under the picture. The layout follows from the content (choices or note → plate, otherwise full). The one exception is a tale's last page: a `vignette` spread carrying the closing emblem, a gold illuminated roundel made as the pair of the title emblem (`emblem()` in the prompt builders). Transparent cut-out scenes are never used. `prototypes/prompts/_build_a2.py` rejects any other scene layout, and `validate-stories.js` rejects a vignette spread on any page other than the ending.

---

## 4. Scene cards — all 10 pages, every variant (15 images)

Variant map (0-based data keys in `stories.js` / `locales.js`): page 3 ← `paragraphByChoice[1]` (p2: `ask` / `listen`); page 5 ← `[3]` (p4: `lantern` / `bread`); page 7 ← `[5]` (p6: `basket-maker` / `carry-together`); page 9 and page 10 ← `[7]` (p8: `name-promise` / `wave-goodnight`). Pages 1, 2, 4, 6, 8 have no variants; 2, 4, 6, 8 are the choice pages.

Reading-path rhythm — path A (lantern · basket-maker · name-promise): WIDE → CLOSE → OTS → HIGH → FOLLOWING → SPOT → DETAIL → POV → WIDE → SPOT. Path B (bread · carry-together · wave-goodnight): WIDE → CLOSE → OTS → HIGH → LOW → SPOT → DETAIL → POV → WIDE → SPOT.

### Page 1 — "Nieoczekiwane spotkanie" / "An Unexpected Meeting"
- **Variant:** none.
- **Moment:** Toward evening Gustaw and Oliwia stop at the near end of the old bridge and see a small copper dragon sitting in its middle, paws under its chin, tail wrapped round one loose stone.
- **Present:** Gustaw (1), Oliwia (1), dragon (1). No mice, no horse, no villagers.
- **Key object:** the dragon's tail around the loose stone of the parapet.
- **State carried:** none.
- **Mood / time:** early evening, cream-gold sky cooling to slate; quiet wonder.
- **Shot:** WIDE · **Layout:** `full` · **Size:** 1024×1536 · **Background:** landscape band (hills, cluster trees, village roofs small), brook with reeds below.
- **Text:** PL „na samym środku, ku ich zdziwieniu, siedział nieduży smok, cały miedziany… ogonem otulał jeden obluzowany kamień" · EN "in the very middle, sat a small copper dragon… wrapped its tail around one loose stone".

### Page 2 — "Cichy głos spod mostu" / "A Voice Below the Bridge" (choice: ask / listen)
- **Variant:** none.
- **Moment:** The dragon lets out one puff small enough to fit in a milk cup, golden at the edges, drifting slowly down under the bridge, while something tiny peeps beneath the stones.
- **Present:** dragon (1) — head, neck and front paws. No people in frame (Gustaw and Oliwia are watching from outside the frame), no mice visible.
- **Key object:** the gold-leaf puff.
- **State carried:** none.
- **Mood / time:** early evening; held breath, listening.
- **Shot:** CLOSE · **Layout:** `plate` · **Size:** 1024×1024 · **Background:** diaper pattern; parapet stones and three reed stems along the bottom.
- **Text:** PL „Smok wypuścił z nozdrzy dymek tak mały, że zmieściłby się w kubku na mleko. Dymek był złoty po brzegach… opadając pod most" · EN "a puff small enough to fit inside a milk cup. It was golden at the edges and drifted under the bridge".

### Page 3 — "Kamień z sekretem" / "The Stone's Secret"
**Variant `ask`** (p2 → "Zapytaj, co się stało")
- **Moment:** When Oliwia asks, the dragon taps one claw on the loose stone and lowers its head toward the gap, and she sees the nest.
- **Present:** Oliwia (1, from behind, foreground), dragon (1, head and one forepaw), mice (3: Big and Middle in the nest, Smallest only ears and tail behind the warmed stone).
- **Key object:** the dragon's claw on the loose stone, the nest below it.
- **State carried:** choice `ask` — the dragon is active and pointing.
- **Mood / time:** early evening; revelation.
- **Shot:** OTS (over Oliwia's shoulder) · **Layout:** `plate` · **Size:** 1536×1024 · **Background:** landscape band (far bank reeds, mist ribbon, slate sky).
- **Text:** PL „smok stuknął pazurem w obluzowany kamień i pochylił głowę ku szczelinie… Najmniejsza myszka schowała się za kamieniem ogrzanym smoczym oddechem" · EN "the dragon tapped one claw against the loose stone and lowered its head toward the gap… The smallest mouse had hidden behind a stone warmed by the dragon's breath".

**Variant `listen`** (p2 → "Poczekaj i posłuchaj")
- **Moment:** Oliwia stays silent until the smallest peep returns from a narrow mossy gap at the edge of the bridge, and finds the nest herself.
- **Present:** Oliwia (1, from behind, closer — her ear turned to the gap), dragon (1, head far at the right edge, still, not pointing), mice (3: Big and Middle looking out, Smallest shivering behind the warmed stone, ears and tail only).
- **Key object:** the narrow mossy gap at the parapet edge.
- **State carried:** choice `listen` — Oliwia is active, the dragon waits.
- **Mood / time:** early evening; stillness.
- **Shot:** OTS (same shot as `ask`, tighter) · **Layout:** `plate` · **Size:** 1536×1024 · **Background:** landscape band.
- **Text:** PL „Oliwia została w ciszy tak długo, aż najcichsze piśnięcie odezwało się ponownie. Dochodziło z brzegu mostu, gdzie mech przykrywał wąską szczelinę" · EN "Oliwia stayed quiet long enough for the smallest peep to return. It came from the edge of the bridge, where moss covered a narrow gap".

### Page 4 — "Plan dla małych myszek" / "A Plan for the Little Mice" (choice: lantern / bread)
- **Variant:** none. The image shows both offers without resolving them.
- **Moment:** Over the mossy crack where the mice tremble, three gifts are held very still: Gustaw's lantern, Oliwia's half rye loaf in linen, and the dragon's warm breath.
- **Present:** Oliwia (kneeling, seen over her shoulder in the foreground, holding the bread), Gustaw (kneeling with the lantern, face visible from above), dragon (head lowered to the stones, face visible), mice (3, in the crack). Revised 2026-10-19 from a flat plan view with hands only, which read as unfinished clip-art.
- **Key object:** the crack with the three mice, ringed by the three gifts.
- **State carried:** none.
- **Mood / time:** colder dusk, a flat white ribbon of mist across one corner.
- **Shot:** HIGH (table-top) · **Layout:** `plate` · **Size:** 1024×1024 · **Background:** flat field — the stone blocks of the parapet top.
- **Text:** PL „Gustaw trzymał latarnię, Oliwia pół żytniego bochenka w lnianym płótnie, a smok wypuszczał ciepły oddech… W omszałej szczelinie myszki trzęsły wąsikami" · EN "Gustaw held a lantern, Oliwia had half a rye loaf wrapped in linen, and the dragon breathed warmth… In the mossy crack, the mice trembled their whiskers".

### Page 5 — "Pomoc nadchodzi z młyna" / "Help Comes From the Mill"
**Variant `lantern`** (p4 → "Unieś latarnię")
- **Moment:** Walking behind the three helpers from the mill, we see the red pennant by the path and, ahead on the bridge, Gustaw's raised lantern laying a flat patch of light on the three safest stones.
- **Present:** miller, baker, basket maker (3, from behind, large, with wool / cloth / reeds), Gustaw (1, small, facing us on the bridge). No Oliwia, no dragon, no mice, no mill (it is behind the camera).
- **Key object:** the pennant and the lantern's flat gold light on three stones.
- **State carried:** choice `lantern` — the light is the event; mice hidden.
- **Mood / time:** dusk; the village answering a sign.
- **Shot:** OTS — FOLLOWING (reverse angle) · **Layout:** `plate` · **Size:** 1536×1024 · **Background:** landscape band (bridge with one arch, mist on the brook, hills, cream-to-slate sky).
- **Text:** PL „uniesiona latarnia pokazała najbezpieczniejsze kamienie pod mchem… Każdy wiedział, gdzie ostrożnie postawić stopę" · EN "the lifted lantern showed the safest stones beneath the moss… Each helper knew where to step".

**Variant `bread`** (p4 → "Podziel się chlebem")
- **Moment:** At mouse level, crumbs lead from the linen to the crack; three noses push out toward the scent as the helpers' boots and hems arrive like big kind shapes.
- **Present:** mice (3, heads out of the crack), miller, baker, basket maker (3, from the waist down with their loads). No faces, no Gustaw, no Oliwia, no dragon.
- **Key object:** the linen with the half loaf and the trail of crumbs.
- **State carried:** choice `bread` — the mice dare to come out.
- **Mood / time:** dusk; courage of the small.
- **Shot:** LOW (mouse's eye) · **Layout:** `plate` · **Size:** 1536×1024 · **Background:** landscape band reduced to the far parapet, a mist ribbon and a flat slate sky.
- **Text:** PL „przy omszałej szczelinie czekały okruszki ciepłego chleba… Zwabione zapachem myszki wysunęły noski, gdy nadszedł młynarz z owczą wełną, piekarka z czystą chustą i wikliniarz z naręczem trzcin" · EN "crumbs of warm bread waited near the mossy crack… Drawn by the scent, the mice poked out their noses as the miller arrived with sheep's wool, the baker with a clean kerchief, and the basket maker with reeds".

> **Superseded (2026-10-21):** the p6 choice is now `crumbs` / `warm-path`; the current page 7 set-up, camera and states are in `SET_BIBLE_dragon-bridge.md` and `prototypes/prompts/_build_a2.py`.

### Page 6 — "Kołyska z trzciny i mchu" / "A Cradle of Reeds and Moss" (choice: basket-maker / carry-together)
- **Variant:** none. The cradle is **empty**; the mice are still outside it (the move belongs to p7).
- **Moment:** The basket maker holds up the finished cradle, the dragon warms it with one tiny breath, and the three mice blink at it without running.
- **Present:** basket maker (1, kneeling), dragon (1, head lowered from the right), mice (3, sitting in a row at his knee, looking up). No Gustaw, no Oliwia.
- **Key object:** the empty cradle (reeds outside, wool and dry moss inside), seen slightly from above.
- **State carried:** none (the lantern/bread prop is not in the text of this page).
- **Mood / time:** dusk; careful hands.
- **Shot:** SPOT (composed as a CLOSE two-shot) · **Layout:** `vignette` · **Size:** 1024×1024, transparent · **Background:** none; a small patch of mossy stone under the group.
- **Text:** PL „Wikliniarz uplótł kołyskę z trzcin, wełny i suchego mchu… Smok pochylił pysk i ogrzał ją jednym malutkim oddechem. Myszki mrugały… ale żadna nie uciekła" · EN "The basket maker wove a cradle from reeds, wool, and dry moss… The dragon lowered its snout and warmed it with one tiny breath. The mice blinked… but not one of them ran".

### Page 7 — "Przeprowadzka maleńkich łapek" / "The Little Paws Move Home"
**Variant `basket-maker`** (p6 → "Poproś wikliniarza o pomoc")
- **Moment:** The basket maker tilts the cradle against the stone as gently as a leaf under rain; Big is on the wool, Middle steps over the rim, Smallest follows the dragon's warm nose; Oliwia's hands stay open; Gustaw's shield lies beneath.
- **Present:** basket maker (two hands, cream sleeves, red vest edge), Oliwia (two open hands, teal sleeves), Gustaw (shield only), dragon (snout tip only, from the right), mice (3, in procession). No faces.
- **Key object:** the tilted cradle on the shield.
- **State carried:** choice `basket-maker` — one pair of expert hands on the cradle.
- **Mood / time:** dusk; held breath.
- **Shot:** DETAIL · **Layout:** `plate` · **Size:** 1536×1024 · **Background:** flat dusk field `#6b7a8c`, stone block and moss at the left.
- **Text:** PL „Wikliniarz ustawił kołyskę przy kamieniu i przechylił ją tylko tak bardzo, jak liść ugina się pod kroplą deszczu. Pierwsza myszka weszła na wełnę. Za nią druga… najmniejsza… prowadzona ciepłym smoczym nosem… Gustaw podsunął pod koszyk tarczę" · EN "tilted it only as much as a leaf tilts under rain. The first mouse stepped onto the wool. Then the second… the smallest… following the dragon's warm nose… Gustaw slid his shield beneath the basket".

**Variant `carry-together`** (p6 → "Przenieście gniazdo razem")
- **Moment:** The helpers hold the cradle level between them, each steadying one small part of the rim, and everyone moves at the pace of the smallest paws.
- **Present:** miller (two hands, brown sleeves, floury), baker (two hands, red sleeves), basket maker (two hands, cream sleeves) on the rim; Oliwia (two open hands below); Gustaw (shield beneath); dragon (snout tip); mice (3, in procession). No faces. Fallback if eight hands fail the cold check: drop the baker's hands and state "two helpers' hands".
- **Key object:** the cradle held level by many hands.
- **State carried:** choice `carry-together` — many hands, one pace.
- **Mood / time:** dusk; shared care.
- **Shot:** DETAIL (same crop as `basket-maker`) · **Layout:** `plate` · **Size:** 1536×1024 · **Background:** flat dusk field.
- **Text:** PL „Pomocnicy otoczyli kołyskę, a każdy przytrzymał jej mały fragment… Wszyscy poruszali się w tempie najmniejszych łapek" · EN "The helpers gathered around the cradle, each taking one small part to steady… Everyone moved at the pace of the smallest paws".

### Page 8 — "Obietnica na starym moście" / "A Promise on the Old Bridge" (choice: name-promise / wave-goodnight)
- **Variant:** none.
- **Moment:** The dragon has moved aside, the bridge lies open and empty, nobody hurries, the sword glints in its scabbard, and the road leads on toward an inn full of candles.
- **Present:** Gustaw (first-person: his own belt, sword hilt in scabbard and cloak edge at the bottom of the frame), dragon (1, sitting aside at the right end of the parapet, calm, facing the road). No other people, no mice.
- **Key object:** the open, empty bridge deck; the inn's lit windows far ahead.
- **State carried:** none.
- **Mood / time:** deep dusk, first gold-dot stars, three flat gold windows on the inn.
- **Shot:** POV (first-person) · **Layout:** `plate` · **Size:** 1536×1024 · **Background:** landscape band (path up a rounded hill to the inn).
- **Text:** PL „smok odsunął się z drogi. Most znów stał otworem, ale nikt nie przebiegł przez niego w pośpiechu. Miecz Gustawa zalśnił w pochwie… ku gospodzie pełnej świec" · EN "the dragon moved aside. The bridge opened again, but nobody hurried across it. Gustaw's sword shone in its scabbard… toward an inn full of candles".

### Page 9 — "Most znów jest otwarty" / "The Bridge Opens Again"
Visual rhyme with page 1: same side view, same `full` format, nightfall, the bridge now busy and the dragon at rest.

**Variant `name-promise`** (p8 → "Wypowiedz słowa podzięki dla smoka")
- **Moment:** Villagers cross one by one, pausing beside the gold tablet where the book wrote the thanks in dragon speech, each glancing down to the cradle among the reeds; the dragon lies curled on the warm stone beside it, watching.
- **Present:** villagers (5: miller, baker, basket maker and two more, thumb-sized, in a line), dragon (1, curled, eyes open), mice (3, as sleeping shapes in the cradle on the bank). No Gustaw, no Oliwia (they are the viewers).
- **Key object:** the gold-leaf tablet on the parapet (glyphs added in code) and the cradle among the reeds below.
- **State carried:** choice `name-promise`.
- **Mood / time:** night blue with gold-dot stars; peace.
- **Shot:** WIDE · **Layout:** `full` · **Size:** 1024×1536 · **Background:** landscape band, night.
- **Text:** PL „Mieszkańcy przechodzili przez most jeden po drugim, zatrzymując się przy złotych słowach… Smok położył się na ciepłym kamieniu obok liter" · EN "pausing beside the golden words the book had written in the dragon's language. The dragon curled on the warm stone near the letters".

**Variant `wave-goodnight`** (p8 → "Pomachaj na dobranoc")
- **Moment:** The same crossing, but the villagers pause beside three freshly grown flowers warmed open by the dragon's sleepy breath; the dragon lies with one eye half closed.
- **Present:** villagers (5), dragon (1, one eye half closed), mice (3, asleep in the cradle below).
- **Key object:** three pale-gold flowers growing from the parapet joints by the dragon's nose; the cradle below.
- **State carried:** choice `wave-goodnight`.
- **Mood / time:** night blue, stars; sleepy warmth.
- **Shot:** WIDE · **Layout:** `full` · **Size:** 1024×1536.
- **Text:** PL „zatrzymując się przy trzech świeżo wyrosłych kwiatach, ogrzanych sennym smoczym oddechem. Smok położył się… z jednym okiem przymkniętym" · EN "pausing beside three freshly grown flowers warmed open by the dragon's sleepy breath. The dragon curled on the warm stone with one eye half closed".

### Page 10 — "To, co zapamiętała księga" / "What the Book Remembered"
**Variant `name-promise`**
- **Moment:** What remained on the bank: the dragon asleep, curled round the reed cradle where the three mice sleep, and the gold tablet of thanks leaning by its paw.
- **Present:** dragon (1, asleep, curled like a cat), mice (3, asleep in the cradle: three curled shapes in wool). Nothing else.
- **Key object:** the cradle inside the curl of the dragon; the gold tablet.
- **State carried:** choice `name-promise`.
- **Mood / time:** night, conveyed by colour only (no sky in a vignette); the room's real candles do the rest.
- **Shot:** SPOT · **Layout:** `vignette` · **Size:** 1024×1024, transparent · **Background:** none; a tuft of dry grass and two reed stems belong to the silhouette.
- **Text:** PL „smoka, złote słowa podziękowania i rzeczne myszki śpiące bezpiecznie przy brzegu" · EN "a dragon, golden words of thanks, and river mice sleeping safely by the bank".

**Variant `wave-goodnight`**
- **Moment:** The same sleeping group, with three flowers grown beside the cradle instead of the tablet.
- **Present:** dragon (1), mice (3). Nothing else.
- **Key object:** the cradle inside the curl; three flowers.
- **State carried:** choice `wave-goodnight`.
- **Shot:** SPOT · **Layout:** `vignette` · **Size:** 1024×1024, transparent.
- **Text:** PL „smoka, trzy świeżo wyrosłe kwiaty i rzeczne myszki śpiące bezpiecznie przy brzegu" · EN "a dragon, three freshly grown flowers, and river mice sleeping safely by the bank".

### Summary table

> Historical (pilot, 2026-10-19). The current shots, layouts and prompts live in `prototypes/prompts/_build_a2.py`, `prototypes/prompts/_build_moonhill.py` and `src/book/pages.js`. The SPOT/vignette rows below are superseded by the page rule in the Layouts section.

Note (2026-10-19): the face limit is now 3–4 characters per scene. The cards for p3 (both), p5 bread, p7 (both) and p8 still use the old faceless framing and are to be widened when they are generated — e.g. p7 shows the helpers and heroes around the cradle, not only their hands; p8 shows Gustaw and Oliwia with the dragon, not only a belt and hilt.

| Page | Variant | Shot | Layout | Size | Faces | Figures |
|---|---|---|---|---|---|---|
| 1 | — | WIDE | full | 1024×1536 | 2 (tiny) | Gustaw, Oliwia, dragon |
| 2 | — | CLOSE | plate | 1024×1024 | 0 (dragon) | dragon |
| 3 | ask | OTS | plate | 1536×1024 | 0 | Oliwia (back), dragon, 3 mice |
| 3 | listen | OTS | plate | 1536×1024 | 0 | Oliwia (back), dragon, 3 mice |
| 4 | — | HIGH (¾, over Oliwia's shoulder) | plate | 1024×1024 | 2 + dragon | Oliwia (back), Gustaw, dragon, 3 mice |
| 5 | lantern | FOLLOWING | plate | 1536×1024 | 1 (tiny) | 3 helpers (back), Gustaw |
| 5 | bread | LOW | plate | 1536×1024 | 0 | 3 mice, 3 helpers (waist down) |
| 6 | — | SPOT (close two-shot) | vignette | 1024×1024 α | 1 + dragon | basket maker, dragon, 3 mice |
| 7 | basket-maker | DETAIL | plate | 1536×1024 | 0 | hands, shield, cradle, snout, 3 mice |
| 7 | carry-together | DETAIL | plate | 1536×1024 | 0 | hands ×4 parties, shield, cradle, snout, 3 mice |
| 8 | — | POV | plate | 1536×1024 | 0 | own belt/hilt, dragon |
| 9 | name-promise | WIDE | full | 1024×1536 | 0 (tiny) | 5 villagers, dragon, cradle + 3 mice, gold tablet |
| 9 | wave-goodnight | WIDE | full | 1024×1536 | 0 (tiny) | 5 villagers, dragon, cradle + 3 mice, 3 flowers |
| 10 | name-promise | SPOT | vignette | 1024×1024 α | dragon | dragon, cradle + 3 mice, gold tablet |
| 10 | wave-goodnight | SPOT | vignette | 1024×1024 α | dragon | dragon, cradle + 3 mice, 3 flowers |

---

## 5. Pilot — the four images

| # | Asset | Page | Shot | Layout / size | Prompt |
|---|---|---|---|---|---|
| 1 | `m-p2` | 2 | CLOSE | plate 1024×1024 | `prototypes/prompts/m-p2.txt` |
| 2 | `m-p4` | 4 (choice page) | HIGH | plate 1024×1024 | `prototypes/prompts/m-p4.txt` |
| 3 | `m-p5-lantern` | 5, variant `lantern` | FOLLOWING (OTS) | plate 1536×1024 | `prototypes/prompts/m-p5-lantern.txt` |
| 4 | `m-p5-bread` | 5, variant `bread` | LOW | plate 1536×1024 | `prototypes/prompts/m-p5-bread.txt` |

Why these four:
- They are a **consecutive run** (2 → 4 → 5 → 5′) that reads as a sequence in the 3D book, including a choice page (4) followed by both of its consequences (5), so the "the book changed because I chose" effect can be judged on the real spread order.
- Four **different shots**, none of them the flat side view that direction C already proved: intimate close-up, top-down table, a group seen from behind, and the floor-level mouse's eye. Both plate aspect ratios are exercised.
- The variant pair is the strongest contrast in the tale: `lantern` is the point of view of the big ones (light, village, distance), `bread` is the point of view of the small ones (scent, closeness). Same page, two cameras.
- It front-loads the risks: the dragon's face (p2, the character that appears in 12 of 15 images), hands-only characters and the mice count (p4), three distinct helpers by their backs and loads (p5 lantern), mice and boots at floor level (p5 bread). The gold-leaf breath and the flat-light convention are tested in p2 and p4 before they are needed in six more images.
- WIDE and SPOT are not in the pilot on purpose: C1 (wide miniature) and C4/C5 (transparent spots) already proved those modes; they come in wave 2 with p1, p6 and p10.

Pass criteria (cold check at 320 px and full size): counts exact; at most four faces and every one on canon; gold reads as a painted shape, not a line or a glow; no text; the key object is the first thing seen; the four images sit together as one book.

---

## 6. Generation order and gates

1. `m-sheet-dragon` → cold check (horns ×2 pairs, heavy-lidded eye, horse scale, closed mouth) → copy `prototypes/raw/m-sheet-dragon.png` to `prototypes/refs/`.
2. `m-p2` immediately after — one character, one object; it validates the style block before the costly images.
3. `m-sheet-heroes`, `m-sheet-mice`, `m-sheet-helpers` → cold check each (back views present, relative heights, mice colour ladder, three different loads) → copy to `prototypes/refs/`.
4. `m-p4` (dragon + heroes + mice sheets).
5. `m-p5-bread` (mice + helpers + heroes sheets).
6. `m-p5-lantern` (helpers + heroes sheets) — the most figures, last.

Rules: one generation per scene asset, no edits, judged pass/fail. A failed sheet is regenerated from the same prompt before any scene depends on it; a failed scene is a finding, not a retry. Run with `prototypes/gen.sh <id>`; the script attaches the files on the `REFS:` line from `prototypes/refs/` and sends the rest of the file as the brief, so each brief states its own size and, for vignettes, its transparency.
