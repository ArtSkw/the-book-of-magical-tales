# Set Bible — "Smok na starym moście" / "The Dragon on the Old Bridge"

Companion to `MANUSCRIPT_BIBLE.md`. The characters have a canon; so does the place. Every scene prompt pastes the **set block** (§3) for the parts of the set it shows and attaches the location sheet `prototypes/refs/set-dragon-bridge.png`.

## 0. Continuity rules (every tale, not only this one)

1. **Before any scene is generated, each tale gets a set bible and a location sheet**, just like the character sheets: every recurring place (bridge, house, room, street, forest clearing) is described once — shape, materials, sizes relative to the characters, what stands on its left and right, where the light comes from — and drawn once as a model sheet.
2. **Fixed facts never drift.** If a place has one arch, it has one arch in every picture. Doors, windows, chimneys, steps, fences, trees, signs and props keep their number, shape, side and colour. A window that is round in one picture is round in all of them; a door on the left of a house stays on the left.
3. **Every prompt states where the camera stands** in set terms (which bank, which end, facing which way) and what is therefore on the left and on the right. Reverse angles swap left and right on purpose; the prompt says so.
4. **Objects carry their state from page to page** (the pennant once planted stays planted; the loose stone once moved stays moved; the cradle once made exists from then on).
5. **Scale is physical.** Every object is sized against a person (the parapet is knee-high to Gustaw; the dragon's head is longer than Gustaw's torso; a mouse is the height of a thumb). Things in the distance shrink; nothing floats; everyone stands, sits or kneels on a surface that can hold them.
6. **Cold check per image:** after generating, compare against the location sheet and the previous pages; a continuity break (wrong arch count, nest on the wrong side, a door that moved) is a fail and the image is regenerated.

## 1. Compass and camera

- The **brook** runs north → south. **Downstream = south = the near side** in the default camera.
- The **road** runs west → east across the bridge. The heroes arrive from the **west** bank; the mill path and the village are on the **east** bank.
- **Default camera** (WIDE, side views): on the **south (downstream) bank**, looking north. West is on the left, east on the right, the brook flows toward the viewer.
- **Reverse camera** (p5 lantern, FOLLOWING): on the mill path on the east bank, looking west along the road toward the bridge. In this view **upstream (north) is on the right**, downstream on the left.

## 2. The set

### 2.1 The old bridge
- A narrow, humpbacked **packhorse bridge** of rough-cut grey-olive stone with **exactly one** semicircular arch. The deck rises gently to a crown over the middle of the arch.
- **Deck:** cobbled with rounded grey stones, about as wide as Gustaw is tall lying down (a small cart barely fits). Moss lines the joints at the edges.
- **Parapets:** on **both** sides, low — **knee-high to Gustaw** — built of rough blocks topped with flat, broad **capstones** (each about as long as Oliwia's arm, wide enough for a cat to sleep on). The capstones are slightly uneven, mossy in the joints, with tiny white flowers here and there.
- **Faces:** the **south (downstream) face** carries trailing ivy left of the arch; the north face is bare stone with moss.
- **Ends:** at each end the parapets flare outward and run into a low dry-stone wall along the bank; a few loose rocks at the foot.
- **Under the arch:** the brook, shallow and clear over pebbles, with reeds on both banks; in the evening a flat ribbon of mist lies on the water.

### 2.2 The loose stone and the mice's nest (fixed position)
- In the **south (downstream) parapet**, on the **east half** of the bridge, the **third capstone east of the crown** is the **loose stone**: slightly tilted, darker, with a thick cushion of moss.
- Along its **inner edge** (the deck side), between it and the next capstone, runs a **narrow mossy crack**, about two fingers wide. The three mice live inside the parapet under this capstone. They come out of this crack and only this crack.
- The dragon in p1 wraps its tail around this stone.
- From the default camera the nest is right of centre on the near parapet; from the reverse camera (east end) it is on the **left** parapet, close to the viewer.

### 2.3 West bank (heroes' side)
- The **road** arrives from the west between low grassy banks.
- An **old oak** stands at the south-west corner of the bridge, its branches reaching over the parapet end.
- **Reeds** and a few alder bushes along the water.

### 2.4 East bank (village side)
- The road continues east, uphill, toward the **village** on a rounded hill: a handful of whitewashed houses with steep **thatched** roofs and small square windows, one squat stone **church tower** with a short wooden spire. The **inn** is the last building at the top of the road: two storeys, timber-framed, a hanging wooden sign (blank), three small square windows on the upper floor that glow gold at night.
- At the **east end of the bridge**, on the **north (upstream) side** of the road, the **mill path** turns off north along the brook. This is where Gustaw plants the **red pennant** (p5 onward; it stays there).
- The **watermill** stands about a stone's throw **upstream on the east bank**: stone ground floor, timber upper floor, thatched roof, a wooden **undershot water wheel** on its south side turning in the brook. From the default camera it is small, beyond the bridge, upper right.
- **Basket maker's spot:** reeds are cut on the east bank just south of the bridge.

### 2.5 Landscape and vegetation
- Central European countryside (Bohemia/Lesser Poland), not Mediterranean: **oak, alder, willow, birch, hazel**, meadows, low rounded hills. Never cypresses, palms or vineyards.
- Hills are low and rounded, in two flat bands; no mountains, no castle on a crag.

### 2.6 Colour script — one aesthetic, light changes only with story time
The **location sheet defines content and layout only — never colour** (its colours came out washed out). The colour balance of every picture is that of the **tone anchors**: the approved pages `refs/tone-dragon-bridge-p4.png` and `refs/tone-dragon-bridge-p5.png` (natural, gently warm, muted but not faded). They are attached to every scene prompt as tone references and are the default anchors of `grade.py`. Every new tale picks its own tone anchors from its first approved pages; the location sheet never serves as one. **Time of day changes only lightness and coolness, along this script, never the palette, saturation or style:**

| Pages | Story time | Sky | Overall light | `grade.py --time` |
|---|---|---|---|---|
| p1–p3 | early evening, low sun from the **west** (left in the default camera) | pale cream at the horizon → pale grey-blue above, a few small soft clouds | as the sheet, a touch warmer | `evening` |
| p4–p7 | cold dusk with mist; the lantern is the main warm light | pale grey-blue → muted slate, no sunset colours | slightly darker and cooler | `dusk` |
| p8 | deep dusk, the inn windows lit gold | muted slate | darker, cool; gold windows and lantern are the only warm notes | `deepdusk` |
| p9 (p10 is an emblem) | night, stars as small gold dots | deep muted blue-grey, never black | darkest, cool; figures keep their colours | `night` |

Never: orange/pink sunsets, glowing skies, saturated golden hour, dramatic rim light.

**Pipeline per image:** generate → cold check (canon + continuity + counts) → `prototypes/grade.py raw/<id>.png graded/<id>.png --time <script>` (pulls white balance and saturation to the tone anchors, keeps character colours, applies the time step) → webp for the book.

### 2.7 Story state (what exists from which page on — both reading paths)
- **Red pennant:** planted on p5 at the east end of the bridge, north (upstream) side of the road, where the mill path turns off. Present in every later view of the east end (p5–p9), stirring in the wind.
- **Reed cradle:** made on p6 (round as a nutshell, woven green-grey reeds, cream wool and dry moss inside, light as a leaf). On p7 (revised 2026-10-21) it first stands on the broad capstone a forearm's length from the crack, steadied by the basket maker, with Gustaw's shield held flat under it; the mice reach it either along a trail of bread crumbs laid by Oliwia (`crumbs`) or along a strip of capstone the dragon has warmed to a soft gold sheen (`warm-path`). Then it is carried to its **new home: the dry grass on the east bank just downstream (south) of the bridge, among the reeds at the foot of the bank wall**, where the basket maker cuts reeds. From p7 on it stays there; in p9/p10 the three mice sleep in it.
- **The dragon after p8:** has moved off the deck; it rests on the east bank beside the cradle, on a flat warm stone at the foot of the bridge (p8–p10).
- **Endings (revised 2026-10-20):** `name-promise` — the thanked dragon gives the bridge one copper scale (palm-sized, rounded), set flush into the outer (downstream) face of the parapet just below the loose capstone; it glows softly at night like a little lantern and everyone slows down and tiptoes past it; the dragon keeps watch, eyes open (p9). `wave-goodnight` — the dragon falls asleep curled round the cradle for the first time since the stone came loose; villagers tiptoe and shush; its sleepy breath rises as five or six small gold-edged puffs circling the cradle like warm fireflies (p9). p10 in both variants is a closing emblem (colophon roundel) paired with the title emblem. The old gold tablet and three flowers are retired.
- **The inn:** windows dark until p8; from p8 on its three upper windows glow gold.

## 3. Set blocks (paste into prompts)

**SET — bridge (any view):** "The old bridge is a narrow humpbacked packhorse bridge of rough grey-olive stone with exactly ONE semicircular arch over a shallow brook. The deck is cobbled. Low parapets on both sides, knee-high to the knight, built of rough blocks topped with broad flat mossy capstones with a few tiny white flowers. Trailing ivy on the downstream face left of the arch. At each end the parapets flare out into a low dry-stone wall. Reeds along both banks; an old oak at the west end."

**SET — the nest:** "The loose stone is one capstone of the downstream parapet, slightly tilted and thick with moss; along its inner edge (the deck side) runs one narrow mossy crack, two fingers wide — the mice's door. It is the only opening."

**SET — east bank:** "Beyond the east end of the bridge the road climbs to a small village of whitewashed houses with steep thatched roofs and small square windows and one squat stone church tower with a short wooden spire; the timber-framed inn is the last building at the top. The mill path turns off north along the brook at the east end of the bridge; upstream on the east bank stands the watermill: stone ground floor, timber upper floor, thatched roof, a wooden water wheel. Central European trees only: oak, alder, willow, birch."
