#!/usr/bin/env python3
"""Scene prompts for "The Forest Oath" — same assembly as _build_a2.py, this tale's canon.
Sources: docs/pilot/SEED_forest-oath.md (story) and docs/pilot/SET_BIBLE_forest-oath.md (cast, place,
state, colour script, scene cards). Run from this folder: python3 _build_forest.py
Writes fo-*.txt (scenes and the closing emblems), orn-title-forest.txt, set-forest-oath.txt and
m-sheet-forest.txt (the two reference sheets, generated first).
"""
import _build_a2 as m

m.PAGES.clear()
m.REVISION.clear()

m.BASE_REFS = ["pentiment-stylesheet.png", "pentiment-farm.png", "tone-dragon-bridge-p3ask.png",
               "tone-dragon-bridge-p4.png", "set-forest-oath.png"]
m.REFROLE = (m.REFROLE
             .replace("the kneeling scene on the bridge and the helpers walking onto the bridge", "two scenes on the bridge of another tale")
             .replace("the bridge, the nest crack, the banks, the buildings", "the charcoal clearing with its kiln, hut and cart, the path, the Heartwood with its plain fence and its one gate with a carved star, the fallen branch"))

STAR = ("one small flat gold-leaf FOUR-POINTED STAR (#c9972b, crisp ink edge, the size of a child's palm; EXACTLY four long slim points — up, down, left, right — never five or six, as on the character sheet) on the stag's brow between the bases of its antlers, like a blaze of gold — "
        "never a halo, glow, rays, sparkles or beam of light; nothing else on the stag shines")
m.C.update({
    "mare": "Koniczynka — Gustaw's gentle cream-white palfrey mare: flaxen mane and tail, soft grey muzzle, dark kind eyes, a red caparison cloth with a narrow gold border over her back, a brown leather bridle. Calm and curious.",
    "dobrochna": "Agata the charcoal burner — a sturdy woman of about fifty with a weathered, kind, practical face and laugh lines, grey-streaked dark hair under a rust-brown kerchief tied at the nape, a slate-grey wool dress with sleeves rolled to the elbow, a long dark-brown leather apron with soot smudges on the apron only (her face and hands are clean, cheeks rosy), brown boots; her one tool is a long-handled wooden rake.",
    "marcin": "Marcin the swineherd — a boy of about ten, a little taller than Oliwia (his head reaches Gustaw's shoulder): short dark-brown hair in a ragged bowl cut, freckles, big honest eyes; oatmeal linen shirt under a weld-yellow ochre wool tunic belted with a cord, a short brown hood with a shoulder cape pushed back, brown hose patched at one knee, soft leather shoes; one thin hazel switch.",
    "piglets": "The three piglets — always exactly three real little pigs the size of a cat, curly tails, forward-flopping ears, small kind eyes, never clothed, never standing like people: Big is pink with one large dark saddle patch over its back; Middle is pink with many small dark spots; Smallest is all pink with one dark ear.",
    "stag": "The star stag — a calm, gentle red deer stag: warm red-brown coat, darker shaggy neck mane, pale cream rump, dark kind lashed eyes (never glowing), his shoulder as high as a man's shoulder; symmetrical pale bone-ochre antlers with five points on each side; " + STAR + ".",
    "doe": "The doe and her fawn — a slim red deer hind (no antlers, red-brown) and her small fawn, knee-high to a man, with big ears and a few faint pale spots fading on its back.",
    "herd": "The herd — two more red deer hinds, drawn small and quiet.",
})
m.SHEETS = {"gustaw": "m-sheet-heroes.png", "oliwia": "m-sheet-heroes.png", "mare": "m-sheet-moonhill.png",
            **{k: "m-sheet-forest.png" for k in ["dobrochna", "marcin", "piglets", "stag", "doe", "herd"]}}
m.SET = {
    "clearing": "SET — Agata's charcoal clearing (must match the attached location sheet): a round mossy clearing ringed by big oaks. In it THE KILN: a low round dome of dark earth and turf sods, as tall as a man and as wide as three people lying end to end, with a ring of small vent holes plugged with turf — a quiet earth mound with absolutely no smoke, steam, glow or flame. At the west edge a small low hut of split logs with a turf roof, one plank door and one small square window, a wooden bucket by the door; in front of it a two-wheeled wooden cart with wicker sides and a few full charcoal sacks, shafts resting on the ground. At the east edge neat stacks of oak billets. The path leaves the clearing at its north edge between two great oaks.",
    "path": "SET — the path: a narrow earth track with moss, roots, fallen oak leaves and acorn cups, running north from the clearing between big oaks to the Heartwood.",
    "corner": "SET — the Heartwood (must match the location sheet): a roughly square enclosure of exactly five ancient oaks with huge trunks and wide golden-ochre crowns, soft moss on the ground inside. Round it a LOW FENCE of split oak, waist-high to a man: exactly TWO horizontal rails between plain squared oak posts with rounded tops. In the middle of its SOUTH side, facing the path, ONE small GATE: a waist-high gate of three upright planks held by one broad horizontal CROSSBAR board across the top, hung between two taller squared gate posts. The crossbar carries ONE CARVED FOUR-POINTED STAR in its centre (a slim, pointed compass-rose star cut into the wood, never a cross) — the ONLY star anywhere on the fence; every post and rail is plain, with no stars.",
    "broken": "SET — the storm damage at the Heartwood's south side (facing the path): the GATE has been torn off by the storm and lies flat in the grass just outside the gateway; its crossbar is CRACKED right across, through the middle of the carved star, so the star is split into two halves; the gateway between the two gate posts stands open. The rest of the fence stands whole.",
    "branch": "SET — the fallen branch: a big storm-broken oak branch with twigs and brown leaves lies ACROSS the deer trail just east of the Heartwood, as high as a fawn's back.",
}
m.STATE = {
    "cups": "STATE: the ground inside the Heartwood is strewn with EMPTY ACORN CUPS and almost no acorns.",
    "post-up": "STATE: the broken gate has been lifted off the ground and now leans against one of the gate posts, its cracked crossbar with the split star facing the path; the gateway is still open; every fence post is plain, without stars.",
    "sack": "STATE: Marcin's hemp sack of acorns (pale hemp, tied with a cord) is here.",
    "mended": "STATE: a NEW GATE of fresh pale wood hangs in the gateway, its crossbar with a freshly carved four-pointed star — the only star on the fence; the old broken gate with its cracked star leans against the fence beside it; every other post and rail is old, grey and plain, without stars; acorns lie on the moss inside the Heartwood.",
}
m.LAND = ("LANDSCAPE (same in every picture of this tale): Dębowy Bór, an old oak forest in October — broad old oaks with round, cloud-like crowns of ochre, russet and olive leaves, a few hornbeams and birches, carpets of moss, brown bracken, fallen oak leaves and acorn cups underfoot; trees as calm rounded cluster shapes with a few leaf marks. "
          "The forest is friendly and open, never dark, dense, tangled or frightening: no dead or twisted trees, no faces in bark, no marsh, no deep shadows. "
          "TREES: only broadleaf trees with round crowns — absolutely no pointed conifers, spruces, firs, pines, cypresses or poplars. "
          "MIST, when there is any: painted as a few FLAT, pale, semi-transparent horizontal bands lying between the far trunks, like the flat bands of a medieval miniature — never a grey wall that hides a figure, never curling wisps, threads or smoke shapes; every figure and object named in this brief stays crisp and clearly readable in front of it.")
BRIGHTER = (" This tale moves from mist toward full day: never darker than the tone references."
            " IN THE FOREST, NO DISTANT VIEW (first takes of p1 and p4 opened onto a valley or lake): the background is always more oak trunks and crowns, the farther ones fainter, fading into thin flat mist — never a valley, lake, river, open field or far hills.")
m.TIME.update({
    "mist": "TIME (colour script): just before dawn on an October morning, and the mist has not lifted: soft milky pearl-grey and pale blue light, calm and gentle; the far trees fade to pale grey-blue shapes behind flat bands of mist; the sky between the crowns a flat pale pearl wash. Gentle and quiet, never dark, gloomy or black; the figures keep their full colours and crisp ink lines." + BRIGHTER + " Rime frost on the tips of the grass. NO DISTANT VIEW (p1 first take showed a sunny valley): behind the nearest oak trunks the forest disappears into the mist — no valley, lake, far hills or far trees; the sky between the crowns is flat pale pearl-grey, never blue, with no sunlight.",
    "dawn": "TIME (colour script): dawn, but the forest is still drowned in milky mist (the stag has not come): the mist is a little brighter and warmer than before dawn, a faint pale-cream glow inside it, the far trunks still fading into pale grey; no sky visible, no sun, no sunlight patches, no cast shadows; muted colours; the figures keep their colours and crisp lines." + BRIGHTER + " Frost whitens the tips of the grass.",
    # 2026-10-31: the stag has not come yet on p7-p8, so no sun and no blue sky (law of magic); first p7 take came out sunny and orange
    "morning": "TIME (colour script): late morning, but the stag has not come yet, so the mist has not lifted: the mist is thinner and brighter, a warm pale cream, lying in flat bands between the farther trunks; NO SKY VISIBLE — between the crowns only pale cream mist; no sun, no sunlight patches, no cast shadows; soft even light. The oak leaves are muted ochre, russet and dull gold, softened by the mist — never bright or saturated orange." + BRIGHTER,
    "day": "TIME (colour script): bright noon, the brightest picture of the tale: the mist is gone except for the last flat pale bands rolling away at the far edges; the oaks are golden and ochre in full sun, the sky a clear pale blue between the crowns; warm, bright and joyful, but still the same muted manuscript palette — never saturated, never a glowing sky, no sun rays.",
})
NEG = "no text, letters or numbers; no smoke, steam or glow from the kiln; no fire, torch, lantern or candle; no light rays or beams; no birds, dogs or other animals; no conifers or poplars"
page = m.page

# p1 — WIDE, plate (a "Did you know" note about the kiln is expected under it)
page("fo-p1", "plate", "mist", ["dobrochna", "gustaw", "oliwia", "mare", "piglets"], ["clearing", "path"], [],
     "CAMERA: the default view — at the clearing's south edge, standing height, looking north. West is on the left, east on the right. Landscape framing with everything important in the middle four-fifths of the width: the hut and the cart at the left, the kiln mound in the centre-left, the woodpiles at the right, the path into the forest right of centre between the two great oaks, the people in the middle ground, a strip of mossy ground in the foreground at the bottom.",
     "SCENE (page 1, the morning that did not come): it should be dawn, but the mist has not lifted. Agata stands beside the earth kiln, one hand on her rake, the other lifted a little toward the path as she explains, her face turned toward the forest, calm but puzzled. Gustaw stands beside her with Koniczynka's bridle in his hand; Oliwia stands close to Gustaw, her satchel across her chest. All three faces are clearly visible in three-quarter view, turned toward the path, where, out of the flat bands of mist between the two great oaks, three little piglets come trotting toward them, ears flopping, one after another. THE PICTURE CLUE (not pointed at by anyone, but plain to a careful child): in the mossy foreground at the bottom centre lie a few EMPTY ACORN CUPS and a little trail of SMALL CLOVEN HOOFPRINTS pressed into the moss, coming from the path.",
     "\"Dawn should have come to Dębowy Bór, but the mist did not lift. Agata said the stag with a star between its antlers brings the morning — and it had not come. Then three piglets trotted out of the mist.\"",
     "Agata, Gustaw, Oliwia: exactly three people; one mare; exactly three piglets; one kiln; one hut; one cart; a few empty acorn cups and small hoofprints in the foreground; no deer.",
     NEG + "; no stag yet; nobody points at the hoofprints.")

# p2 — LOW, plate, choice: follow-piglets / call-back (unresolved)
page("fo-p2", "plate", "mist", ["oliwia", "dobrochna", "gustaw", "mare", "piglets"], ["clearing", "path"], [],
     "CAMERA: low, at a piglet's eye level, on the east side of the path just north of the clearing, looking WEST across the path. In this view NORTH (the forest, the mist and the way to the Heartwood) is on the RIGHT, and the clearing with the kiln mound is on the LEFT edge, softly. Landscape framing: the three piglets big in the foreground in the lower middle, the people behind them in the middle ground, their faces in clear profile and three-quarter view, all turned to the right.",
     "SCENE (page 2, a voice in the mist): somebody calls from the mist on the right, far away. The three piglets stand in a row in the foreground, heads up, ears pricked and twitching toward the right, one forefoot lifted, ready to trot off that way. Oliwia crouches beside them, one hand open near the smallest piglet, her face turned to the right, listening, curious. Agata, a step behind, cups one hand behind her ear, listening. Gustaw stands with Koniczynka's bridle in his hand, the mare's ears pricked toward the right too. The path runs away to the right into flat pale bands of mist between the oak trunks. Nobody has decided yet.",
     "\"Somebody called in the mist: 'Kosia, kosia!' The piglets twitched their ears.\"",
     "Oliwia, Agata, Gustaw: exactly three people; one mare; exactly three piglets; no other figure, the caller is not seen.",
     NEG + "; no sound lines or symbols; no figure in the mist.")

# p3 — THRESHOLD, portrait, variants from p2
P3_CAMERA = ("CAMERA: on the path just south of the Heartwood, standing height, looking NORTH into the Heartwood through its broken south fence. Portrait framing: two great old oak trunks rise up the left and right edges like the sides of a doorway, their crowns meeting overhead; between them, across the middle of the picture, the low plain fence with its open gateway in the middle and the broken gate lying flat in the grass in front of it, its cracked crossbar with the split carved star clearly visible; beyond the gap the moss of the Heartwood under the five ancient oaks, the ground strewn with empty acorn cups, flat mist bands behind. "
             "In the foreground at the bottom, Oliwia kneels on the path.")
for var, desc in [
    ("follow-piglets", "The three piglets have led them here: they trot through the gap into the Heartwood toward Marcin, the swineherd boy, who stands just inside the fence among the empty cups, his hazel switch in his hand, startled and a little guilty, one step back, his face clearly visible. In the foreground Oliwia kneels on the path holding one EMPTY ACORN CUP up in her open palm, looking at it and then at the empty ground beyond — she is beginning to understand; her face in clear three-quarter profile. Behind her on the path Gustaw and Agata have stopped, looking in; Koniczynka's head and neck show behind Gustaw's shoulder."),
    ("call-back", "Marcin, the swineherd boy, has come out of the mist to their call: he stands at the gap with the three piglets crowding at his feet, his hazel switch in his hand, and stands with his head bowed and his eyes on the ground, ashamed and quiet, his face still visible; he does not smile and does not point. In the foreground Oliwia kneels on the path holding one EMPTY ACORN CUP up in her open palm, looking at it and then at the empty ground beyond; her face in clear three-quarter profile. Behind her Gustaw and Agata look in; Koniczynka's head and neck show behind Gustaw's shoulder."),
]:
    page(f"fo-p3-{var}", "full", "mist", ["oliwia", "marcin", "gustaw", "dobrochna", "mare", "piglets"], ["corner", "broken"], ["cups"],
         P3_CAMERA,
         f"SCENE (page 3, the Heartwood, variant {var}): {desc}",
         "\"The piglets led them to the Heartwood, where the oldest oaks grow behind a fence whose one gate is marked with a carved star. The storm had broken the gate, and under the oaks lay only empty acorn cups. Marcin the swineherd stood there. Oliwia understood: the piglets were hungry, and the deer had gone because their acorns were eaten.\"",
         "Oliwia, Marcin, Gustaw, Agata: exactly four people; the mare's head and neck only; exactly three piglets; exactly five ancient oaks in the Heartwood; one broken gate with one split star lying in the grass; no star on any fence post; no deer.",
         NEG + "; the fence has two rails, never more; the stars are carved four-pointed stars, never crosses; no deer, no stag.")

# p4 — CLOSE, plate, choice: ask-kindly / show-tracks (unresolved)
page("fo-p4", "plate", "dawn", ["marcin", "oliwia", "gustaw", "dobrochna", "piglets"], ["corner", "broken"], ["cups"],
     "CAMERA: close, at the children's eye level, at the gap in the Heartwood's south fence. Landscape framing with everything important in the middle four-fifths: Marcin and Oliwia as half figures in the centre, filling most of the height; at the left of the centre area the empty gateway with the broken gate lying in the grass, its cracked star crossbar visible; Gustaw and Agata a step behind on the right, smaller but faces visible; at the bottom edge a strip of soft dark earth at the gap with small cloven hoofprints in it; beyond them the old oaks and thin mist bands, quiet and simple.",
     "SCENE (page 4, Marcin is scared): Marcin stands with his eyes down, cheeks flushed, twisting his hazel switch in one hand, his mouth half open as he stammers that the storm broke the gate. Oliwia, beside him, gently takes his other hand in hers and looks at him kindly, her face calm and warm. Behind Marcin's legs the three piglets huddle together and peek out. Gustaw and Agata stand a step behind on the right, quiet and kind, not scolding. The first warm dawn light lies in soft flat patches on the ground and on the children's faces. Nobody has decided yet what to say.",
     "\"Marcin stammered that the storm had broken the gate. He said nothing about his piglets. He was scared, so Oliwia took his hand.\"",
     "Marcin, Oliwia, Gustaw, Agata: exactly four people; exactly three piglets; one broken gate lying on the ground; no star on any fence post; small cloven hoofprints in the earth at the bottom.",
     NEG + "; nobody is angry; no pointing finger yet.")

# p5 — LOW, portrait, variants from p4
P5_CAMERA = ("CAMERA: low, close to the ground at the open gateway, looking up. Landscape framing (a 5:4 plate; everything important in the middle four-fifths): the three piglets curled together in the fallen leaves in the foreground at the bottom; above them the people seen from slightly below, faces clearly visible; Gustaw in the centre lifting the broken gate off the ground with both hands, its cracked crossbar with the split star facing us; the old oaks' trunks and golden crowns above against a pale dawn sky.")
for var, desc in [
    ("ask-kindly", "Marcin, asked kindly, tells the truth: he stands at the left, one hand on his chest, his face open and honest, mouth softly open as he speaks, his eyes meeting Oliwia's; Oliwia holds his other hand; Agata rests a hand on his shoulder and nods. Nobody scolds him. Gustaw, at the right of centre, lifts the broken gate off the ground with both hands, steady and calm, its cracked crossbar with the split four-pointed star facing us."),
    ("show-tracks", "Oliwia kneels and gently points to the small cloven hoofprints in the soft earth at the gap; Marcin, beside her, nods and tells the truth, one hand on his chest, his face open and honest; Agata rests a hand on his shoulder. Nobody scolds him. Gustaw, at the right of centre, lifts the broken gate off the ground with both hands, its cracked crossbar with the split four-pointed star facing us."),
]:
    page(f"fo-p5-{var}", "plate", "dawn", ["marcin", "oliwia", "dobrochna", "gustaw", "piglets"], ["corner", "broken"], ["cups"],
         P5_CAMERA,
         f"SCENE (page 5, the truth, variant {var}): {desc} Warm dawn light lies in soft flat patches on the moss and on their faces; the mist has thinned to flat pale bands far behind.",
         "\"Marcin told the truth: his piglets had eaten the acorns, because outside the Heartwood there were almost none this year. Nobody scolded him. Gustaw lifted the broken gate; on its cracked crossbar was the carved star of the old oath.\"",
         "Marcin, Oliwia, Agata, Gustaw: exactly four people; exactly three piglets; one broken gate with a split star, lifted by Gustaw; no star on any fence post.",
         NEG + "; nobody is angry or ashamed-looking in a cruel way; the star is never a cross.")

# p6 — HIGH, plate, choice: give-sack / gather-forest (unresolved)
page("fo-p6", "plate", "dawn", ["dobrochna", "marcin", "oliwia", "gustaw", "piglets"], ["corner"], ["post-up", "cups"],
     "CAMERA: close, standing height, at the Heartwood's open gateway in the south fence (rewritten 2026-10-31 to match the text: the sack is still in Marcin's hut). Landscape framing with everything important in the middle four-fifths: the broken gate leaning against a gate post in the centre, its cracked crossbar with the split star facing us, Agata's hand resting on it; the four people close round it as half and three-quarter figures, faces clearly visible; the frosty ground at the bottom.",
     "SCENE (page 6, the hard part): Agata rests one hand on the broken gate leaning against the gate post and looks at its cracked, split star, thoughtful and serious, as she says that they promised the deer these acorns, but the piglets need to eat too. Marcin stands beside her, worried, biting his lip, looking down at his three piglets, who nose hopefully among the EMPTY acorn cups in the frosty grass at his feet and find nothing. Oliwia looks from the star to Marcin, thinking; Gustaw stands quietly behind her, a hand on her shoulder. White frost is spreading over the grass and the fallen leaves — winter is coming. Nobody has decided yet.",
     "\"'We promised the deer these acorns,' said Agata, looking at the cracked star. 'But the piglets need to eat too.' The frost was already whitening the grass.\"",
     "Agata, Marcin, Oliwia, Gustaw: exactly four people; exactly three piglets; one broken gate with a split star leaning against a gate post; no star on any fence post; empty acorn cups only; NO sack and no basket of acorns.",
     NEG + "; no sack; no pile of acorns; the piglets are not eating; no deer yet.")

# p7 — MEDIUM group, portrait, variants from p6
# 2026-10-31 cold check of give-sack a: from outside, the acorns fell on our side, by the piglets; so the camera is INSIDE the Heartwood
P7_CAMERA = ("CAMERA: eye level, INSIDE the Heartwood on its moss, looking SOUTH at its south fence from within. Landscape framing (a 5:4 plate; everything important in the middle four-fifths): the fence runs across the middle of the picture; the people stand OUTSIDE it, on the far side, working along it and leaning over the rail toward us; the acorns they give fall over the rail onto the moss of the Heartwood on OUR side, in the foreground, where they lie scattered in the leaves; big old oak trunks of the Heartwood at the picture's edges and the forest beyond the people; the three piglets asleep in a heap in the leaves OUTSIDE the fence, behind the people, beside the mare's hooves.")
for var, desc, who in [
    ("give-sack", "Koniczynka stands at the left with Marcin's open hemp sack slung across her back over the red caparison; Oliwia scoops acorns from it in her two hands and scatters them over the rail onto the moss inside; Agata tips a small basket of her own acorns over the rail beside her. In the centre Gustaw holds the NEW PALE GATE steady in the gateway. At the right Marcin kneels at the NEW PALE GATE, his left hand on it and the edge of a small wood chisel set against the middle of its crossbar, where a four-pointed star is HALF-CARVED (only two of its four points cut so far, fresh pale chips on the ground); his tongue between his teeth, proud. The chisel touches the crossbar; he holds nothing else. Beside him the OLD broken gate leans against the fence, its cracked star showing — his pattern.",
     ["mare", "oliwia", "dobrochna", "gustaw", "marcin", "piglets"]),
    ("gather-forest", "Everyone has gathered acorns from the whole forest: Oliwia pours acorns over the rail from the flap of her satchel, Agata from her gathered-up apron; the three piglets nose acorns out of the leaves by the fence; Koniczynka stands at the left without a load. In the centre Gustaw holds the NEW PALE GATE steady in the gateway. At the right Marcin kneels at the NEW PALE GATE, his left hand on it and the edge of a small wood chisel set against the middle of its crossbar, where a four-pointed star is HALF-CARVED (only two of its four points cut so far, fresh pale chips on the ground), proud. The chisel touches the crossbar; he holds nothing else. Beside him the OLD broken gate leans against the fence, its cracked star showing — his pattern.",
     ["mare", "oliwia", "dobrochna", "gustaw", "marcin", "piglets"]),
]:
    page(f"fo-p7-{var}", "plate", "morning", who, ["corner"], ["mended"],
         P7_CAMERA if var == "give-sack" else P7_CAMERA.replace("asleep in a heap in the leaves OUTSIDE the fence, behind the people, beside the mare's hooves", "OUTSIDE the fence, nosing acorns out of the leaves at the people's feet"),
         f"SCENE (page 7, the oath kept, variant {var}): {desc} Acorns lie on the moss inside the Heartwood. The old grey posts and rails are plain, without stars. Late morning: patches of mist low between the far trunks, ochre oak leaves, soft light; no blue sky yet (the stag has not come), only pale milky mist between the far trunks.",
         "\"Together they gave the Heartwood back its acorns and mended the fence. Marcin carved the star on the new gate's crossbar.\"",
         "Oliwia, Agata, Gustaw, Marcin: exactly four people; one mare; exactly three piglets OUTSIDE the fence; one new pale gate with one half-carved star on its crossbar; the old broken gate leaning beside it; no star on any fence post.",
         NEG + "; the chisel is a small woodworking tool, never a knife or weapon; Marcin is not whittling anything in his hands; no deer yet; no blue sky; no sunlight; no bright orange foliage.")

# p8 — FOLLOWING, plate, choice: make-way / help-fawn (unresolved)
page("fo-p8", "plate", "morning", ["gustaw", "oliwia", "marcin", "dobrochna", "stag", "doe", "herd"], ["corner", "branch"], ["mended"],
     "CAMERA: just behind the group, standing height, at the Heartwood's east side, looking NORTH-EAST along the deer trail into the forest. Landscape framing with everything important in the middle four-fifths: the four people in the foreground at the lower left and centre, seen from three-quarter behind with their faces turned in clear profile toward each other and the deer; the plain old fence along the left with the NEW PALE GATE and the carved star on its crossbar; the deer trail running away into the middle distance; the fallen branch lying across the trail in the middle ground; the stag beyond it in the centre-right.",
     "SCENE (page 8, the star in the mist): out of a band of late-morning mist on the deer trail, the star stag steps calmly into view — first the small gold star on its brow, then the antlers, now its head and chest clear, its kind dark eyes on the people. Beside it stands the doe; behind them two more hinds are pale quiet silhouettes in the mist. Across the trail lies the big storm-broken oak branch, and behind it the little fawn stands stuck, unable to get over, looking at its mother. In the foreground Oliwia holds Marcin's hand, both in profile, eyes wide with wonder, smiling; Gustaw and Agata stand still beside them, Agata's hand on her heart. Nobody moves toward the deer; nobody has decided yet.",
     "\"A gold star appeared in the mist, and then antlers. The stag had come, and the herd behind it. But the youngest fawn was stuck behind a branch the storm had brought down.\"",
     "Gustaw, Oliwia, Marcin, Agata: exactly four people; one stag with one small gold star; one doe; one fawn behind the branch; exactly two more hinds, faint; one fallen branch; no piglets in this picture.",
     NEG + "; no halo, glow, rays or sparkles around the stag or its star; the stag is calm, never rearing; no second stag; the people do not bow or kneel.")

# p9 — WIDE, portrait (rhyme with p1), variants from p8
# 2026-10-31 make-wayb: a frontal camera put the stag side by side with the children, no mist, far hills; now a side view
# make-wayc: a side view put everyone in one long row wider than the 5:4 crop; now depth instead of a row
P9_CAMERA = ("CAMERA: standing height, at the edge of the path, at bright noon. Landscape framing (a 5:4 plate): the path CURVES from the background at the upper right toward the foreground at the lower left. The stag walks down the path in the LEFT-CENTRE middle ground toward the lower left, in calm three-quarter view, its face, antlers and the small gold star on its brow clearly visible; it is the size of a real red deer stag, its back lower than the mare's. Just ahead of it, at the left, the LAST flat pale band of mist parts to both sides like a curtain; behind it the golden oaks stand in warm sun. FARTHER BACK UP THE CURVING PATH, at the right of centre, smaller with distance, the people follow CLOSE TOGETHER as one compact group, overlapping: Oliwia and Marcin hand in hand in front, Gustaw leading Koniczynka and Agata just behind them; between the stag and the children an empty stretch of path. Everything, the stag's antlers and every figure, sits well inside the middle four-fifths of the width; the outer side strips hold only oak trunks and bracken. Small in the background, the plain fence of the Heartwood with its new pale gate standing open.")
for var, desc in [
    ("make-way", "They made way for the deer: far up the path the herd — the doe, the fawn and two hinds — grazes on the acorns inside the mended Heartwood. The stag walks down the path toward the clearing, calm and unhurried, and where it walks the last flat bands of mist roll back to both sides and the golden oaks stand in full sun."),
    ("help-fawn", "They helped the fawn: the big branch now lies along the edge of the trail far up the path, and the fawn trots close beside its mother just behind the stag, safe; two hinds graze inside the mended Heartwood. The stag walks down the path toward the clearing, calm and unhurried, and where it walks the last flat bands of mist roll back to both sides and the golden oaks stand in full sun."),
]:
    page(f"fo-p9-{var}", "plate", "day", ["stag", "doe", "herd", "oliwia", "marcin", "gustaw", "mare", "dobrochna", "piglets"], ["path", "clearing"], ["mended"],
         P9_CAMERA,
         f"SCENE (page 9, the morning comes, variant {var}): {desc} Behind the stag, at a respectful distance, Oliwia walks hand in hand with Marcin; with her other hand she tucks one acorn in its cup into her satchel. Gustaw walks beside them leading Koniczynka; Agata follows with her rake over her shoulder, smiling; the three piglets trot along at Marcin's heels. Everyone is smiling, faces turned toward the sun.",
         "\"The stag walked on, and wherever it went the mist parted. Hand in hand, step by step, they followed it into the bright noon. Oliwia kept one acorn to plant by the next road.\"",
         "Oliwia, Marcin, Gustaw, Agata: exactly four people; one mare; exactly three piglets; one stag with one small gold star; the doe, the fawn and two hinds small in the distance" + (" (the fawn and doe near the stag)" if var == "help-fawn" else "") + "; one acorn in Oliwia's hand.",
         NEG + "; no sun rays; no halo around the stag; nobody touches the deer; nobody walks beside the stag; no mist hiding anyone; no distant hills, valley or open landscape; no clouds; only small pale blue patches of sky between the crowns; no saturated orange.")



# Corrections after the cold check: regenerate from the first take (prototypes/refs/<pid>-composition.png) with one change.
def fix(pid, rev, keep, change, counts="", neg=""):
    P = m.PAGES[pid]
    P["text"] = P["text"].split(" COMPOSITION:")[0]
    P["text"] += (f" COMPOSITION: the attached COMPOSITION REFERENCE is the first take of THIS picture — keep it exactly ({keep}); "
                  f"the only change: {change} (This overrides the rule below about not copying compositions.)")
    P["counts"] += (" " + counts) if counts else ""
    P["negatives"] += ("; " + neg) if neg else ""
    P["extra_refs"] = list(dict.fromkeys(list(P["extra_refs"]) + [f"{pid}-composition.png"]))
    m.REVISION[pid] = rev


CLOSED_MIST = ("the background. There is NO distant view at all — no valley, no far hills, no lake, no far trees: the clearing is closed in on every side by the big oak trunks, and directly behind the nearest trunks the forest disappears into a soft, milky, pearl-grey and pale blue mist, painted as flat pale bands, so only the near oaks show, the next ones are faint grey shapes and beyond them there is only mist. "
               "The sky between the crowns is a flat pale pearl-grey, not blue, with no sunlight: it is the grey half-light just before dawn, so the whole picture is a little cooler and softer than the reference, while the figures keep their colours. "
               "The mist bands lie only between the far trunks — none drift over the kiln, and nothing rises from the kiln.")
fix("fo-p1", "fo-p1b", "camera, the hut, the cart, the kiln, the woodpiles, Gustaw, Oliwia, Koniczynka, Agata and their poses and faces, the three piglets on the path, the empty acorn cups and hoofprints in the foreground",
    CLOSED_MIST, neg="no distant landscape; no conifers or pointed trees anywhere; no blue sky; no sunlight")
fix("fo-p3-follow-piglets", "fo-p3-follow-pigletsb", "camera, the two framing oak trunks, the Heartwood with its oaks and empty cups, the broken fence with its star posts and fallen rails, Oliwia kneeling with the cup, Marcin, the three piglets, the light and colours",
    "WHERE THE GROWN-UPS STAND: Gustaw, Agata and Koniczynka are OUTSIDE the Heartwood, on the path on OUR side of the fence, together with Oliwia — they stand a step behind her and a little to the left, and the fence's left section with its two rails runs BEHIND them (we see the rails behind their legs and cloaks, never in front of them). Only Marcin and the piglets are inside the Heartwood. Marcin looks startled and a little guilty: shoulders up, his switch held close, glancing at the piglets.",
    neg="no adult or horse inside the Heartwood; no rail in front of Gustaw, Agata or the mare")
fix("fo-p4", "fo-p4b", "the children Marcin and Oliwia holding hands, their faces, poses and costumes, the three piglets behind Marcin's legs, Gustaw and Agata and their faces, the leaning star post and fallen rails at the left, the hoofprints in the earth, the light and colours",
    "(1) the whole group sits a little closer together and further from the right edge: Agata, her rake and her hands are fully inside the central 5:4 area, with a strip of oak trunk and fence at the right edge beyond her; (2) the background behind the people is the oak forest — big trunks and golden crowns, the farther ones fainter in thin flat bands of dawn mist — with NO open valley, lake, field or far hills.",
    neg="no valley, lake or open land in the background; nobody crossing the side safe-area edges")
STAR4 = ("the gold star on the stag's brow has EXACTLY FOUR POINTS — up, down, left and right, long and slim with gently concave sides, like the four-pointed sparkle of a medieval manuscript and exactly like the star on the attached character sheet — never five or six points; draw it clearly larger than before — about as wide as the stag's eye-to-eye distance — so it reads at small size")
fix("fo-p8", "fo-p8b", "camera, the four people, their poses and faces, the stag, the doe, the fawn, the two faint hinds, the fallen branch, the trail, the mist bands, the oaks, the light and colours",
    "(1) " + STAR4 + "; (2) the fence at the left is the OLD fence: weathered silver-grey posts and rails, each post with its small carved four-pointed star, and only ONE post among them is new, pale fresh-cut wood with a fresh star.",
    neg="no five-pointed or six-pointed star")

# Emblems: the title (frontispiece) opens the tale, p10 closes it — a pair, and a pair with the other tales' emblems.
EMBLEM_REFS = "pentiment-margins-1.png, pentiment-margins-2.png, orn-title-moonhill-clean.png, orn-title-clean.png, m-sheet-forest.png, set-forest-oath.png, tone-dragon-bridge-p4.png"
VINES = ("delicate ink vines of oak twigs with ochre and russet oak leaves and acorns in their cups, a few curled bracken fronds, gold-leaf dots and curls")


def emblem_prompt(pid, motif, ground, counts, extra_neg="", extra_refs=""):
    style = (m.HERE / "_style-orn.txt").read_text().strip()
    body = [
        f"REFS: {EMBLEM_REFS}{extra_refs}",
        "SIZE: 1024x1024, square", "", style, "",
        f"MOTIF: {motif} The roundel: a precious illuminated medallion framed by a double ring of burnished gold leaf with a fine punched-dot border, exactly the kind of roundel shown in the two attached emblems from the other tales of this book; {ground} Around the roundel, growing out of it to all sides like the margins of an illuminated page: {VINES}, balanced but hand-drawn and lively, with a small gold-leaf fleuron at the bottom centre.",
        "", f"COUNTS: {counts}",
        "NEGATIVES: absolutely no text, letters, numbers or runes; no frame other than the gold roundel; no background outside the motif; no people; no halo, rays or sparkles around the stag or its star; the star is four-pointed, never a cross; no smoke; no conifers or pointed trees" + (f"; {extra_neg}" if extra_neg else "") + ".",
        "", "REFERENCE ROLES: the two attached emblems from the other tales of this book define the format — the gold double ring, the punched dots, the lively ink-vine margin and the transparent background — this emblem must look like their sibling from the same book, with this tale's own scene inside (never copy their towers, bridges or dragons). The Pentiment margin pages define the line and lightness of the vines. The character sheet defines the star stag, the doe and the fawn; the location sheet defines the fence and its star posts. Never copy a composition from a reference.",
    ]
    if "orn-title-forest-clean" in extra_refs:
        body.append("The attached frontispiece of THIS tale (the stag's head on a deep blue pre-dawn ground) is this emblem's pair: the same gold ring, the same oak-and-acorn vines, the same stag and star; only the scene inside and the ground colour change.")
    (m.HERE / f"{pid}.txt").write_text("\n".join(body) + "\n")


TITLE = ("the frontispiece emblem that opens the tale \"The Forest Oath\": inside the roundel, the head and neck of the star stag (match the attached character sheet: a red deer stag with a red-brown coat, darker neck mane, dark kind eyes, symmetrical pale bone-ochre antlers with five points each side) in calm three-quarter view, looking kindly at us from between two old oak trunks; on its brow between the bases of the antlers, " + STAR + "; below it a few flat pale pearl-grey bands of mist; one small oak twig with two acorns in the lower corner.",
         "inside it a deep muted blue pre-dawn ground (#2f4a73) scattered with tiny gold four-pointed stars, like the other emblems.")
ENDINGS = {
    "make-way": ("the closing emblem (the colophon) of the tale \"The Forest Oath\", the companion of its frontispiece: inside the roundel, the Heartwood at noon — a golden old oak, beneath it a short stretch of the low plain split-oak fence with a small new gate standing open (three upright pale planks held by one broad crossbar across their tops, square-topped, no pickets, no brace), a four-pointed star carved in the centre of that crossbar; behind the fence the doe and her small fawn graze on acorns in the moss, and the star stag stands beside them with its head raised, calm: a red-brown stag with a darker brown neck mane and pale cream antlers, a crisp small gold four-pointed star on its brow; a small flat gold sun disc in the sky, without rays.",
                 "one stag with one small gold star; one doe; one fawn; one gate with one carved star; no star on any post; one sun disc."),
    "help-fawn": ("the closing emblem (the colophon) of the tale \"The Forest Oath\", the companion of its frontispiece: inside the roundel, under golden oaks at noon, the small fawn pressed close against its mother's side, safe, her head bent to it; the star stag stands behind them, calm: a red-brown stag with a darker brown neck mane and pale cream antlers, a crisp small gold four-pointed star on its brow; the storm-broken oak branch — one long grey-brown bough with forked twigs and a few brown leaves, not a stump — lies flat along the edge of the moss, pulled aside; a small flat gold sun disc in the sky, without rays.",
                  "one stag with one small gold star; one doe; one fawn; one branch lying aside; one sun disc."),
}
# help-fawn (a): the stag had dark antlers and no mane, the branch read as a stump
EMBLEM_REV = {"help-fawn": "fo-p10-help-fawnb"}
DAY_GROUND = "inside it a clear, pale day-blue ground (#a9c3cf) with a few soft cream cloud shapes — the morning has come (the frontispiece of this tale is the same roundel on a deep blue pre-dawn ground)."


def sheets():
    style = m.STYLE
    (m.HERE / "set-forest-oath.txt").write_text("\n".join([
        "REFS: pentiment-stylesheet.png, pentiment-farm.png, tone-dragon-bridge-p4.png, tone-dragon-bridge-p5.png",
        "SIZE: 1536x1024, landscape.", "", style, "",
        "TASK: a LOCATION MODEL SHEET for an illustrated book — one forest place drawn from several fixed views on a plain warm parchment background, like a production design sheet in the Pentiment style. No people, no animals. Clear daylight, NO mist on this sheet (it shows the layout only). Generous empty parchment between views, no boxes, no labels, no text.",
        "",
        "THE PLACE (identical in every view): Dębowy Bór, an old October oak forest — broad old oaks with round, cloud-like crowns of ochre, russet and olive leaves, moss, brown bracken, fallen leaves. "
        "In the south of the forest, AGATA'S CHARCOAL CLEARING: a round mossy clearing ringed by oaks. In it THE KILN: a low round dome of dark earth and turf sods, as tall as a man and as wide as three people lying end to end, with a ring of small vent holes plugged with turf — a quiet mound with NO smoke, steam or glow. At the WEST edge a small low hut of split logs with a turf roof, one plank door and one small square window, a wooden bucket by the door; in front of it a two-wheeled wooden cart with wicker sides and a few full charcoal sacks, shafts resting on the ground. At the EAST edge neat stacks of oak billets. "
        "THE PATH leaves the clearing at its NORTH edge between two great oaks and runs north to THE HEARTWOOD: a roughly square enclosure of exactly FIVE ancient oaks with huge trunks and wide golden-ochre crowns, soft moss inside, ringed by a LOW FENCE of split oak, waist-high to a man: exactly TWO horizontal rails between plain squared oak posts with rounded tops. In the middle of its SOUTH side, facing the path, ONE small GATE: a waist-high gate of three upright planks held by one broad horizontal CROSSBAR board across the top, hung between two taller squared gate posts. The crossbar carries ONE CARVED FOUR-POINTED STAR in its centre (a slim, pointed compass-rose star cut into the wood, never a cross) — the ONLY star anywhere on the fence; every post and rail is plain, with no stars. "
        "The storm damage: the GATE has been torn off by the storm and lies flat in the grass just outside the gateway; its crossbar is CRACKED right across, through the middle of the carved star, so the star is split into two halves; the gateway between the two gate posts stands open. The rest of the fence stands whole. "
        "THE DEER TRAIL comes from the deep forest in the NORTH-EAST to the Heartwood's EAST side; across it, just east of the Heartwood, lies a big storm-broken oak branch with twigs and brown leaves, as high as a fawn's back.",
        "",
        "VIEWS:",
        "1. Top half, large: the clearing seen from its south edge looking north — the hut and the cart at the left, the kiln mound in the centre-left, the woodpiles at the right, the path leaving between two great oaks right of centre.",
        "2. Bottom left: the Heartwood seen from the path, from the south: the low plain two-rail fence, the open gateway in the middle with the broken gate lying in the grass, its split star visible, the five ancient oaks inside.",
        "3. Bottom middle: a simple plan from above: the round clearing in the south with the kiln, the hut (west) and the woodpiles (east); the path running north; the square Heartwood with its five oaks and the open gateway in its south fence; the deer trail coming from the north-east to the Heartwood's east side, with the fallen branch across it.",
        "4. Bottom right: two close details side by side: the whole gate (three planks and the crossbar with its one carved four-pointed star) as it stood before the storm; the fallen oak branch lying across the deer trail.",
        "",
        "NEGATIVES: no text or labels; no people; no animals; no smoke, steam or fire; no mist; no conifers, poplars or cypresses; no saturated colours.",
    ]) + "\n")
    sb = (m.HERE / "set-forest-oath.txt").read_text().replace("REFS: ", "REFS: set-forest-oath-composition.png, ", 1)
    sb += ("COMPOSITION: the attached COMPOSITION REFERENCE is the first version of THIS sheet — keep it exactly (every view, the clearing, the kiln, "
           "the hut, the cart, the path, the oaks, the plan, the branch); the only change: the fence of the Heartwood, as described above — plain posts "
           "without stars, one gate with one star on its crossbar, shown fallen and cracked in view 2 and whole in view 4.\n")
    (m.HERE / "set-forest-oathb.txt").write_text(sb)
    (m.HERE / "m-sheet-forest.txt").write_text("\n".join([
        "REFS: m-sheet-heroes.png, m-sheet-moonhill.png, pentiment-stylesheet.png, tone-dragon-bridge-p4.png",
        "SIZE: 1536x1024, landscape.", "", style, "",
        "TASK: a CHARACTER MODEL SHEET for an illustrated book, in exactly the format of the attached model sheet with the white mare and the villagers: full figures standing in a row on a plain warm parchment background, then animals below, generous empty parchment between them, no boxes, no labels, no text. Same scale for everyone; the girl Oliwia at the right edge for height (match the attached heroes sheet).",
        "",
        "TOP ROW, full figures standing, facing three-quarter front, calm kind expressions, faces clearly drawn:",
        "1. " + m.C["dobrochna"] + " Shown holding her rake upright.",
        "2. The same Agata from the side, rake over her shoulder.",
        "3. " + m.C["marcin"] + " Shown front, a little shy, holding the switch down at his side.",
        "4. The same Marcin from the side with a full pale hemp sack (tied with a cord) on his back.",
        "5. Oliwia for scale (exactly as on the heroes sheet: teal dress, long chestnut hair, leather satchel across her chest); Marcin is a little taller than her.",
        "",
        "BOTTOM ROW, animals at the same scale:",
        "6. " + m.C["piglets"] + " The three side by side in a row, left to right Big, Middle, Smallest, a little apart so each is countable.",
        "7. " + m.C["stag"] + " Full body side view, standing calmly, head turned three-quarter toward us so the gold star between the antlers shows.",
        "8. A close head study of the same stag, front three-quarter view: the two antlers with five points each, the small flat gold four-pointed star on the brow exactly between their bases.",
        "9. " + m.C["doe"] + " Side by side, the fawn close to its mother's flank.",
        "",
        "NEGATIVES: no text or labels; no background scenery other than a small tuft of grass under each figure; no halo, glow, rays or sparkles anywhere; the stag's star is a flat gold four-pointed star, never a cross and never glowing; no weapons; no knives; no other animals.",
    ]) + "\n")
    # b (2026-10-31 cold check): a's star had six to eight points; keep the approved sheet, fix only the star
    s = (m.HERE / "m-sheet-forest.txt").read_text()
    s = s.replace("REFS: m-sheet-heroes.png,", "REFS: m-sheet-forest-composition.png, m-sheet-heroes.png,")
    s += ("COMPOSITION: the attached COMPOSITION REFERENCE (m-sheet-forest-composition.png) is the approved version of THIS sheet — keep it exactly: every figure, pose, face, costume, the piglets, the stag, the head study, the doe and fawn, the layout and colours. "
          "The only change: the gold star on the stag's brow, in BOTH the full-body view and the head study, has EXACTLY FOUR POINTS — one pointing up, one down, one left, one right, long and slim, with slightly concave sides between them, like a compass-rose star or the four-pointed sparkle in a medieval manuscript — and NO smaller points in between (never six, never eight points). Draw it a little larger and crisp, flat gold leaf with a fine ink outline, so its four points are countable.\n")
    (m.HERE / "m-sheet-forestb.txt").write_text(s)


# Mist first (coordinator review 2026-10-31: the text says the forest "drowned in milky mist" until the stag
# returns on p8; first takes read as a bright orange autumn day). Changed approach: the atmosphere is the first
# constraint, before the style block; blue sky, sun and shadows are negatives; fo-p1c, once accepted, is the
# mist reference for p2–p6.
ATMOSPHERE = ("ATMOSPHERE — THE FIRST RULE OF THIS PICTURE: the whole forest is DROWNED IN A SOFT, MILKY MIST. Behind the figures the oaks fade step by step: the nearest trunks clear, the next ones pale grey-brown, the farther ones only pale grey ghost shapes, and beyond them nothing but milky pearl-white. "
              "NO SKY IS VISIBLE AT ALL — above and between the crowns there is only milky mist. The colours are muted and softened by the mist: leaves dull ochre, grey-olive and soft russet, never bright orange. "
              "No sun, no sunlight, no light patches, no cast shadows: the light is soft, even and shadowless. The figures in the foreground keep crisp ink lines, their own colours and clearly readable faces; the mist never covers them.")
MIST_NEG = "no blue sky; no clouds; no sunshine or sunlight patches; no cast shadows; no bright orange foliage; no clear distant trees"
MIST_REF = "fo-p1c.png"
MIST_REF_ROLE = " The attached MIST REFERENCE (fo-p1c.png, an approved page of this tale) shows the misty atmosphere, muted colours and fading trunks every picture up to page 6 must share."


def mist_first(pid, rev, keep=None, mist_ref=True):
    P = m.PAGES[pid]
    if keep:
        fix(pid, rev, keep, "the atmosphere, as described in the ATMOSPHERE rule at the top of this brief: the forest behind the figures is drowned in milky mist, no sky, no sun, no shadows, colours muted.")
    m.REVISION[pid] = rev
    P["negatives"] += "; " + MIST_NEG
    if mist_ref:
        P["extra_refs"] = list(dict.fromkeys(list(P["extra_refs"]) + [MIST_REF]))
        P["text"] += MIST_REF_ROLE
    MIST_FIRST.add(rev)


MIST_FIRST = set()
mist_first("fo-p1", "fo-p1c", "camera, the hut, the cart, the kiln, the woodpiles, Gustaw, Oliwia, Koniczynka, Agata and their poses and faces, the three piglets on the path, the empty acorn cups and hoofprints in the foreground", mist_ref=False)
mist_first("fo-p2", "fo-p2b", "camera, the clearing at the left, Gustaw with Koniczynka, Oliwia crouching, Agata cupping her ear, the three piglets and their poses and faces")
mist_first("fo-p3-follow-piglets", "fo-p3-follow-pigletsc", "camera, the two framing oak trunks, the broken fence with its star posts and fallen rails, the empty cups, Oliwia kneeling with the cup, Gustaw, Agata and Koniczynka outside the fence, Marcin and the three piglets inside, every pose and face")
mist_first("fo-p4", "fo-p4c", "the children Marcin and Oliwia holding hands, their faces, poses and costumes, the three piglets behind Marcin's legs, Gustaw and Agata fully inside the picture, the leaning star post and fallen rails, the hoofprints")
mist_first("fo-p5-ask-kindly", "fo-p5-ask-kindlyb")  # a new 5:4 plate (the note sits under it), not a fix of the portrait take
mist_first("fo-p6", "fo-p6b")
# pages with a "Did you know" note (5, 7, 9) are 5:4 plates: new takes, not fixes of the portrait first takes
m.REVISION["fo-p7-give-sack"] = "fo-p7-give-sackc"  # b: Marcin whittled in his hands, star already cut; sunny orange
m.REVISION["fo-p9-make-way"] = "fo-p9-make-wayd"  # b: stag beside children; c: one long row, too wide


# Second variants (author approved the first variants 2026-10-31): each keeps its approved sibling's camera,
# place, light and colours (the sibling's take is the composition reference) and changes only the scene.
SIBLING = "the people and animals and what they do, exactly as described in SCENE above."
mist_first("fo-p3-call-back", "fo-p3-call-back")
fix("fo-p3-call-back", "fo-p3-call-back", "camera, the two framing oak trunks, the broken fence with its star posts and fallen rails, the empty cups, Oliwia kneeling with the cup and her pose, Gustaw, Agata and Koniczynka outside the fence, the mist, light and colours", SIBLING)
mist_first("fo-p5-show-tracks", "fo-p5-show-tracks")
fix("fo-p5-show-tracks", "fo-p5-show-tracks", "camera, the Heartwood's oaks and fence, Gustaw setting the star post upright, Agata's hand on Marcin's shoulder, the snapped stump and fallen rails, the mist, light and colours", SIBLING)
fix("fo-p7-gather-forest", "fo-p7-gather-forest", "camera, the fence with the new pale rails and the new pale post, Gustaw fitting the rail, Marcin kneeling and carving the half-cut star with the chisel, Agata and Oliwia at the rail, Koniczynka at the left, the acorns on the moss, the light and colours", SIBLING + " Koniczynka carries NO sack.", neg="no sack; no basket")
fix("fo-p9-help-fawn", "fo-p9-help-fawn", "camera, the curving path, the stag and its pose, the group of people following far behind it and their poses, the mended Heartwood in the background, the parting mist, light and colours", SIBLING + " The doe and the fawn walk just behind the stag, between it and the people, with an empty stretch of path before the children.")


# 2026-10-31 author's reading (docs/DECISIONS.md): the oath's star is on ONE thing, the gate's crossbar; every fence
# post is plain. Each approved take is regenerated from itself (its composition reference), changing only the fence,
# so the approved cameras, faces and light stay. p3 call-back also gets Marcin's bowed head, as in the text.
GATE_FIX = ("the fence and its star, exactly as described in SET and STATE above: NO star on any fence post or rail — every post is plain; "
            "the ONLY star is the one carved on the crossbar of the single GATE. ")
GATE_NEG = "no star on any fence post; no star anywhere on the fence except the gate's crossbar; no leaning or snapped post"
FENCE_KEEP = "every person and animal, their poses, faces and costumes, the camera, the oaks, the mist, the light and colours"
for pid, rev, change in [
    ("fo-p3-follow-piglets", "fo-p3-follow-pigletsd", "In the gap where the leaning and snapped posts were, there is now an open gateway between two plain gate posts, and the broken gate lies flat in the grass in front of it, its crossbar cracked through the middle of the carved star."),
    ("fo-p3-call-back", "fo-p3-call-backb", "In the gap where the leaning and snapped posts were, there is now an open gateway between two plain gate posts, and the broken gate lies flat in the grass in front of it, its crossbar cracked through the middle of the carved star. ALSO: Marcin stands with his head bowed and his eyes on the ground, ashamed and quiet, his switch held down; he does not smile and does not point."),
    ("fo-p4", "fo-p4d", "The leaning star post at the left becomes a plain gate post; at its foot the broken gate lies flat in the grass, its crossbar cracked through the middle of the carved star, clearly visible."),
    ("fo-p5-ask-kindly", "fo-p5-ask-kindlyc", "Gustaw no longer holds a post: in the same pose he lifts the broken GATE off the ground with both hands — three planks and a crossbar, the crossbar cracked through the middle of its carved star, the split star facing us; the fence behind is plain."),
    ("fo-p5-show-tracks", "fo-p5-show-tracksb", "Gustaw no longer holds a post: in the same pose he lifts the broken GATE off the ground with both hands — three planks and a crossbar, the crossbar cracked through the middle of its carved star, the split star facing us; the fence behind is plain."),
    ("fo-p6", "fo-p6c", "The star post Agata touches becomes the broken GATE leaning against a plain gate post: Agata's hand rests on its crossbar, which is cracked through the middle of its carved star, the split star facing us; the other posts are plain."),
    ("fo-p7-give-sack", "fo-p7-give-sackd", "The new pale post becomes a NEW PALE GATE hung in the gateway (three pale planks and a crossbar); Gustaw holds it steady; Marcin, in the same pose, carves the half-finished star in the middle of the gate's crossbar; beside him the old broken grey gate with its cracked star leans against the fence; the old posts are plain grey, without stars."),
    ("fo-p8", "fo-p8d", "The fence at the left: plain old grey posts and rails without stars, and in it one NEW PALE GATE with a freshly carved four-pointed star on its crossbar, where the new post was. ALSO: Agata's rake is never left standing by itself or leaning on her: she HOLDS it, her free hand (the one not doing anything else) closed round the handle, the rake upright beside her."),
    ("fo-p9-make-way", "fo-p9-make-waye", "The small fence of the Heartwood in the background: plain posts without stars, and in its middle one new pale gate standing open, a small carved star on its crossbar."),
]:
    fix(pid, rev, FENCE_KEEP, GATE_FIX + change, neg=GATE_NEG)
    if pid.startswith(("fo-p3", "fo-p4", "fo-p5", "fo-p6")):
        MIST_FIRST.add(rev)
# author 2026-10-31: on p2 the rake stood upright by itself while both her hands were busy elsewhere
fix("fo-p2", "fo-p2c", "every person and animal, their poses, faces and costumes, Agata cupping her ear, the camera, the clearing, the oaks, the mist, the light and colours",
    "Agata's rake: she HOLDS it upright in her other hand, the hand that was hanging at her side, her fingers closed round the handle; the rake no longer stands by itself.",
    neg="no rake standing by itself; no tool leaning on nothing")
MIST_FIRST.add("fo-p2c")
# p2c kept the free-standing rake and gave Agata a bare stick: build on p2c and turn THAT stick into the rake
fix("fo-p2", "fo-p2d", "every person and animal, their poses, faces and costumes, Agata cupping her ear with her right hand, her lowered left hand gripping the wooden handle, the camera, the clearing, the oaks, the mist, the light and colours",
    "(1) The wooden handle Agata grips in her lowered left hand becomes her rake: the SAME handle, continuing up past her hand to a toothed rake head just above her shoulder; its foot rests on the ground by her boot. (2) The separate rake standing on its own to the right of Agata is REMOVED completely: in its place only misty oaks, ferns and fallen leaves. Agata has exactly ONE rake, the one in her hand.",
    neg="no second rake; no rake standing by itself; no tool leaning on nothing; no bare stick")
MIST_FIRST.add("fo-p2d")
# second pass on the gate block: each from its own last take, one detail
fix("fo-p6", "fo-p6d", "every person and animal, their poses, faces and costumes, Agata's hand on the gate and her rake, the broken gate leaning against the post, the fence, the camera, the mist, the light and colours",
    "The star on the old gate's crossbar is CARVED into the grey wood (a cut groove, the same weathered grey-brown as the wood, no gold, no paint), and a CRACK splits the crossbar straight through the star: the star is broken in two halves by the crack.",
    neg="no gold star; no painted star; no whole, unbroken star; no star on any post")
MIST_FIRST.add("fo-p6d")
fix("fo-p7-give-sack", "fo-p7-give-sacke", "every person and animal, their poses, faces and costumes, the new pale gate and its half-carved star, the old broken gate leaning at the right, the acorns, the camera, the light and colours",
    "Marcin's tool is a small WOOD CHISEL, not a knife: a short wooden handle and a narrow straight steel shank ending in a flat, square cutting edge set against the star's groove; he pushes it with his hand like a carpenter.",
    neg="no knife; no pointed blade; no whittling")
fix("fo-p8", "fo-p8e", "every person and animal, their poses, faces and costumes, the fence and the new gate with its star, the old broken gate, the deer behind the fallen branch, the camera, the mist, the light and colours",
    "Agata's hand that was resting on her chest now GRIPS the rake handle right beside it, her fingers closed round the wood at chest height; the rake's teeth rest on the ground. Her other hand hangs at her side.",
    neg="no hand on her heart; no rake leaning on her with no hand on it; no rake standing by itself")
# the siblings not generated yet: from their brother's new take (copied to <pid>-composition.png once accepted)
fix("fo-p7-gather-forest", "fo-p7-gather-forestb", "camera, the fence and the NEW PALE GATE with the half-carved star, Gustaw holding the gate, Marcin kneeling and carving the star on its crossbar with the chisel, the old broken gate leaning beside him, Agata and Oliwia at the rail, Koniczynka at the left, the acorns on the moss, the light and colours", SIBLING + " Koniczynka carries NO sack.", neg="no sack; no basket; " + GATE_NEG)
fix("fo-p9-help-fawn", "fo-p9-help-fawnb", "camera, the curving path, the stag and its pose, the group of people following far behind it and their poses, the Heartwood's plain fence with its open new gate in the background, the parting mist, light and colours", SIBLING + " The doe and the fawn walk just behind the stag, between it and the people, with an empty stretch of path before the children; far back, the oak branch lies pulled aside along the edge of the trail.", neg=GATE_NEG)


# Third pass after the fresh-context review (2026-11-01): one new-gate design everywhere (p7's),
# the old gate only on p7 as Marcin's pattern, the fawn really cut off on p8, a mallet-and-chisel.
NEW_GATE = ("the NEW GATE has one design on every page: three upright pale fresh-wood planks side by side, "
            "held by ONE broad pale crossbar across their tops, and ONE four-pointed star carved in the centre "
            "of that crossbar (a cut groove in the wood, not gold, not painted); square-topped planks, no pickets, "
            "no diagonal brace, no ledged door")
NO_OLD_GATE = "no old grey gate anywhere; exactly one gate and one carved star in the whole picture"
def again(pid, old, new, keep, change, neg=""):
    fix(pid, new, keep, change, neg=neg)
    if old in MIST_FIRST:
        MIST_FIRST.add(new)
again("fo-p2", "fo-p2d", "fo-p2e", FENCE_KEEP + ", Agata holding her one rake",
      "Gustaw's hand by the bridle holds ONLY the reins: no dagger, no knife, no blade anywhere in his hand or on his belt in view.",
      neg="no dagger; no knife; no drawn blade")
again("fo-p3-call-back", "fo-p3-call-backb", "fo-p3-call-backc", FENCE_KEEP + ", the open gateway and the broken gate lying flat",
      "Marcin's switch is ONE single straight thin stick held in his lowered hand, its tip resting on the ground; no forked or second stick.",
      neg="no forked stick; no stick standing by itself")
again("fo-p5-ask-kindly", "fo-p5-ask-kindlyc", "fo-p5-ask-kindlyd", FENCE_KEEP + ", the broken gate Gustaw lifts with its cracked star",
      "Gustaw's face is young and CLEAN-SHAVEN exactly as on the hero sheet: smooth cheeks and chin, no stubble, no beard, no wrinkles.",
      neg="no stubble; no beard; no wrinkles on Gustaw")
again("fo-p7-give-sack", "fo-p7-give-sacke", "fo-p7-give-sackf",
      "every person and animal, their poses, faces and costumes, the new pale gate and its half-carved star, the acorns, the camera, the light and colours",
      "(1) Marcin carves the star the carpenter's way: in one hand he holds a short flat-edged wood chisel set against the star's groove, in the other a small round wooden MALLET raised to tap its handle. (2) The OLD grey gate leaning at the right shows its star CRACKED in two by a split running through the crossbar. " + NEW_GATE + ".",
      neg="no knife; no awl; no pointed blade; no whole star on the old gate")
again("fo-p8", "fo-p8e", "fo-p8f",
      "the people, their poses, faces and costumes, Agata gripping her rake, the stag and the doe and their poses, the fallen branch, the camera, the mist, the light and colours",
      "(1) The fawn is CUT OFF from its mother by the fallen branch: the stag and the doe stand on the FAR side of the branch, and the small fawn stands alone on the NEAR side, between the branch and the people, looking back across the branch at the doe, who looks at it. (2) The old grey broken gate is REMOVED: there the plain fence continues. " + NEW_GATE + ".",
      neg="no fawn beside the doe; " + NO_OLD_GATE)
for pid, old, new, extra in [("fo-p9-make-way", "fo-p9-make-waye", "fo-p9-make-wayf", "The small fawn in the distance stands on the grass inside the fence, not on the gate. Behind the fence only deer, oaks and moss; no dark animal shape."),
                        ("fo-p9-help-fawn", "fo-p9-help-fawnb", "fo-p9-help-fawnc", "")]:
    again(pid, old, new,
          "every person and animal, their poses, faces and costumes, the stag in front, the path, the camera, the light and colours",
          "(1) The old grey broken gate leaning by the fence is REMOVED: there the plain fence continues. (2) " + NEW_GATE + ", standing open in the fence. " + extra,
          neg=NO_OLD_GATE)


# Fourth pass (fresh review of the shipped pictures). The whole-picture regenerations kept drifting the
# gate, so each take now changes ONE thing and only that region is pasted back into the shipped take
# (scratchpad composite, like gather-forestc): the rest of every picture stays pixel for pixel.
CARVED = "the star is a cut groove in the wood, darker brown in its shadow, the same colour family as the wood; never gold, never raised, never painted"
again("fo-p7-give-sack", "fo-p7-give-sackf", "fo-p7-give-sackg", "everything except the old grey gate's crossbar",
      "On the OLD grey gate leaning at the right, its crossbar clearly shows the old carved four-pointed star, and the crack runs right THROUGH the middle of that star, splitting it into two halves (" + CARVED + ").",
      neg="no old gate without a star")
again("fo-p7-gather-forest", "fo-p7-gather-forestb", "fo-p7-gather-forestd", "everything except Oliwia's bags",
      "Oliwia has exactly ONE leather satchel on a strap across her body: she has swung it forward over the rail and pours the acorns out of it; there is no second bag at her hip.",
      neg="no second bag on Oliwia")
again("fo-p8", "fo-p8f", "fo-p8g", "everything except the new gate in the fence",
      NEW_GATE + "; the planks end UNDER the crossbar, which closes the gate's top; " + CARVED + ".",
      neg="no gold star on the gate; no rounded or pointed planks; no planks rising above the crossbar")
again("fo-p9-help-fawn", "fo-p9-help-fawnc", "fo-p9-help-fawnd", "everything except the new gate in the fence",
      NEW_GATE + "; the planks end UNDER the crossbar, which closes the gate's top; " + CARVED + ".",
      neg="no gold star on the gate; no planks rising above the crossbar")
again("fo-p4", "fo-p4d", "fo-p4e", "everything except the star on the broken gate's crossbar",
      "The star on the broken gate is the old carved four-pointed star (" + CARVED.replace("brown", "grey-brown") + "), and the crack in the crossbar runs right THROUGH the middle of the star, splitting it into two halves.",
      neg="no gold or bronze star; no whole star on the broken gate")
again("fo-p3-follow-piglets", "fo-p3-follow-pigletsd", "fo-p3-follow-pigletse", "everything except where the fence rails pass Gustaw",
      "Gustaw stands wholly in FRONT of the fence, on our side: both fence rails pass BEHIND his legs and cloak and are hidden by them; no rail crosses in front of any part of him.",
      neg="no rail in front of Gustaw")
again("fo-p2", "fo-p2e", "fo-p2f", "everything except the acorns in the foreground",
      "There are NO whole acorns anywhere in the picture: in the foreground moss lie only a few EMPTY acorn cups and fallen leaves (the piglets have eaten every acorn outside the Heartwood).",
      neg="no whole acorns")


# fo-p7-gather-forestc is not a generation: gather-forestb kept Marcin's old knife and a whole star on
# the old gate (its prompt predates this pass), so the right side (x >= 990, a 60 px soft seam inside
# Gustaw's body) is taken from fo-p7-give-sackf, which shares the composition pixel for pixel.
# Fourth pass, shipped: give-sackg, p8g, p9-help-fawnd and p4e whole (they changed only the asked region).
# fo-p7-gather-foreste = gather-forestb left, give-sackg right (same seam), Oliwia's box (372,300)-(680,740)
# from gather-forestd, which had dropped Marcin's mallet. fo-p10-make-wayb = fo-p10-make-way with the gate's
# gold star recoloured by hand to a brown carved groove (pixels around (566,841)).
# fo-p3-follow-pigletsf = pigletsd with only the regions pigletse changed (blurred diff > 14, inside
# (0,250)-(700,1250)), so Gustaw stands wholly in front of the fence. fo-p2g = p2e with the changed regions of
# p2f inside y >= 760 (empty cups only); fo-p2h = p2g with the one cup still holding a nut, at (859,942),
# replaced by a copy of the empty cup at (972,946).


# Fifth pass, author's reading of the whole book 2026-11-01 (docs/DECISIONS.md): (1) the old gate's split star
# looked different on every page, so it now has one canonical form with a detail reference cut from the approved
# p3 follow-piglets take; (2) Gustaw sets his shield down when his hands are busy; (3) the p8 stag drew legs at two
# angles at once. Same method as the fourth pass: one change per take, only the changed region is pasted back.
OLD_STAR_REF = "fo-old-star-setting.png"
OLD_STAR = ("the OLD grey gate's star has ONE form on every page, exactly as in the attached OLD STAR DETAIL (" + OLD_STAR_REF + ", cut "
            "from an approved page of this tale): the old grey crossbar is SNAPPED clean through in its middle, and the break runs "
            "straight through the CENTRE of the carved four-pointed star, so each broken half of the crossbar carries one half of the "
            "star, the two halves a little apart and out of line; the star is a dark cut groove in the grey wood. ")
OLD_STAR_NEG = "no whole star on the old gate; no crack beside the star; no second crack; no gold star on the old gate"
SHIELD_DOWN = ("Gustaw's hands are busy, so he does NOT carry his shield: nothing on his arm or his back. His red griffin shield is "
               "set down nearby, {where}, the gold griffin facing us, whole and clearly visible. ")


def fifth(pid, old, new, keep, change, neg="", star=False):
    again(pid, old, new, keep, (OLD_STAR if star else "") + change, neg="; ".join(x for x in [OLD_STAR_NEG if star else "", neg] if x))
    if star:
        P = m.PAGES[pid]
        P["extra_refs"] = list(dict.fromkeys(list(P["extra_refs"]) + [OLD_STAR_REF]))


fifth("fo-p4", "fo-p4e", "fo-p4f", "everything except the star on the broken gate's crossbar",
      "The broken gate keeps its place, size and planks; only its crossbar and star change.", star=True)
fifth("fo-p5-ask-kindly", "fo-p5-ask-kindlyd", "fo-p5-ask-kindlye", "everything except Gustaw's shield and the star on the gate he lifts",
      SHIELD_DOWN.format(where="leaning upright against the plain fence post at the right edge of the gateway") +
      "He still lifts the broken gate with both hands in the same pose.", neg="no shield on Gustaw's arm or back", star=True)
fifth("fo-p6", "fo-p6d", "fo-p6e", "everything except the star on the broken gate's crossbar",
      "The broken gate keeps leaning against the gate post under Agata's hand; only its crossbar and star change.", star=True)
fifth("fo-p7-give-sack", "fo-p7-give-sackg", "fo-p7-give-sackh", "everything except Gustaw's shield and the old grey gate's crossbar",
      SHIELD_DOWN.format(where="leaning upright against the old grey fence post just left of the new gate, on the far side of the fence") +
      "He still holds the new pale gate steady with both hands in the same pose. " + NEW_GATE + ".", neg="no shield on Gustaw's arm or back", star=True)
again("fo-p8", "fo-p8g", "fo-p8h", "everything except the stag's legs and body",
      "The stag stands calmly with EXACTLY FOUR LEGS, all drawn from the same three-quarter angle as its body: two forelegs under its "
      "chest and two hind legs under its rump, each leg clearly joined to the body; no leg is drawn twice and no leg comes from a "
      "second body angle. Its head, antlers, gold star, coat and place stay the same.",
      neg="no extra legs; no fifth or sixth leg; no doubled body outline")

# Shipped composites (changed regions only, blurred diff > 14, feathered): fo-p8i = p8g + the deer from p8h;
# fo-p5-ask-kindlyf = ask-kindlyd + the gate star and set-down shield from ask-kindlye; fo-p4g = p4e + the star
# from p4f; fo-p6f = p6d + the star from p6e; fo-p7-give-sacki = give-sackg + the set-down shield and Gustaw from
# give-sackh, Marcin (who lost the mallet in h) kept from g, and of h's old gate only its top crossbar
# (1390,444)-(1534,520), since h drew a second split star on a lower crossbar.

# (4) Each second variant gets its own camera, layout and content from its own text (briefs by the art director,
# Fable, 2026-11-01). These are new takes, not fixes: no composition reference. The first variants stay.
m.STATE["mended-new"] = ("STATE: a NEW GATE of fresh pale wood hangs in the gateway, its crossbar with a carved four-pointed star — "
                         "the only star on the fence; the old broken gate is gone; every other post and rail is old, grey and plain.")
page("fo-p3-call-back", "full", "mist", ["oliwia", "marcin", "gustaw", "dobrochna", "mare", "piglets"], ["corner", "broken"], ["cups"],
     "CAMERA: INSIDE the Heartwood, a little above standing height (as if standing on a thick root), looking SOUTH out through the open gateway toward the path. Portrait framing: the mossy floor of the Heartwood fills the lower half, strewn with empty acorn cups; the low plain fence crosses the picture a little below its middle with the open gateway in the centre; just beyond the gateway, on the path side, the broken gate lies flat in the grass with its cracked crossbar and split star turned toward us; the people stand on the path beyond it as whole figures, faces toward us; behind them the two great oaks of the path fade into flat mist bands at the top; the huge trunks of two of the Heartwood's ancient oaks cut the left and right edges in the foreground.",
     "SCENE (page 3, the Heartwood, variant call-back): the piglets have raced back ahead of everyone: all three trot through the open gateway toward us, the Smallest in front, already among the empty cups in the foreground, snouts down and finding nothing. Marcin has stopped at the gateway just beyond the fallen gate, his one hazel switch lowered with its tip on the ground, head bowed, eyes on the split star at his feet, ashamed and quiet, his face still visible. Behind him Oliwia, hurrying after the piglets, has just stopped too and looks past him at the empty cups, beginning to understand, her face in three-quarter view; Agata beside her holds her rake upright in one hand and lifts the other toward her mouth as she whispers; Gustaw a step behind, calm, his shield on his arm, Koniczynka's head and neck over his shoulder. Nobody steps over the fence; only the piglets are inside. " + OLD_STAR,
     "\"Oliwia called out, and Marcin the swineherd came out of the mist. The piglets ran round him and raced back between the old oaks, and everyone followed. The gate lay on the ground, broken by the storm, and everywhere lay empty acorn cups. Marcin bowed his head.\"",
     "Oliwia, Marcin, Gustaw, Agata: exactly four people, all OUTSIDE the fence on the path; the mare's head and neck only; exactly three piglets INSIDE the Heartwood; one broken gate with one split star lying flat just outside the gateway; no star on any fence post; no deer.",
     NEG + "; no adult, child or horse inside the fence; nobody climbing or stepping over the fence; not a bird's-eye view, the horizon stays inside the picture; no sky; the old star is a carved groove, never gold; no second gate; no forked or second stick; " + OLD_STAR_NEG)
page("fo-p5-show-tracks", "plate", "dawn", ["oliwia", "marcin", "dobrochna", "gustaw", "piglets"], ["corner", "broken"], ["cups"],
     "CAMERA: HIGH, looking steeply down from a little above head height, like a tilted-ground miniature: the mossy earth at the gateway fills almost the whole picture as a flat ground seen from above; the fence rails and the open gateway cut across the top edge, the five ancient oaks appear only as trunk bases in the top corners; the figures are seen from above AND in front, so their faces turn up toward us and stay readable. Landscape framing (a 5:4 plate; everything important in the middle four-fifths): one line of small cloven hoofprints runs diagonally across the centre of the moss from the lower left up toward the gateway, beside a scatter of empty acorn cups.",
     "SCENE (page 5, the truth, variant show-tracks): Oliwia crouches at the left of the prints, her satchel swung forward, one finger pointing at the clearest hoofprint, saying nothing, her face turned up to Marcin with a small kind smile. Marcin crouches opposite her at the right of the prints, looking from them to her, cheeks red, lips parted as he sighs and begins to tell the truth, one hand on his chest, his hazel switch lying on the moss beside him. The Smallest piglet stands at the end of the line of prints, its own trotters pressing the same small marks into the moss, nosing an empty cup; Big and Middle sit close behind it. Agata stands bent forward at the top centre, both hands round her rake's handle, looking down at Marcin and nodding, warm. Gustaw at the top right, seen from above, has lifted the broken gate off the ground with both hands and holds it tilted so its cracked crossbar and split star turn up toward us; his red griffin shield leans against the gate post beside him, the griffin toward us. " + OLD_STAR,
     "\"Oliwia crouched and showed Marcin the little hoofprints in the moss, right beside the empty cups. She said nothing, only smiled at him. Marcin sighed and told them everything. Gustaw lifted the broken gate; on its cracked crossbar was the carved star of the old oath.\"",
     "Marcin, Oliwia, Agata, Gustaw: exactly four people; exactly three piglets; one line of small cloven hoofprints the size of the piglets' trotters; empty acorn cups; one broken gate with one split star, lifted by Gustaw; one shield on the ground; no star on any fence post.",
     NEG + "; not a straight-down aerial or map view — every face stays visible; no deer or horse hoofprints — the prints are small and cloven, never round; nobody points at Marcin; nobody scolds; no shield on Gustaw's arm or back; the old star is a carved groove, never gold; no sky; " + OLD_STAR_NEG)
page("fo-p7-gather-forest", "plate", "morning", ["dobrochna", "gustaw", "mare", "oliwia", "marcin", "piglets"], [], [],
     "CAMERA: standing height, a wide view of the open oak forest a few steps south of the Heartwood, which stays OUT of the picture (no fence, no gate): big oak trunks stand at different depths like the columns of a hall, the farther ones fading into thin flat bands of cream mist; the mossy floor rises gently to the top of the picture and no sky shows. Landscape framing (a 5:4 plate; everything important in the middle four-fifths): the figures are spread across the whole width at different depths, each about a third of the picture's height, all within sight of each other; right of centre one BEECH tree — a smooth pale-grey trunk and copper-brown leaves, round-crowned like the oaks — with the piglets beneath it.",
     "SCENE (page 7, the oath kept, variant gather-forest): everyone searches the forest floor for acorns. At the left Agata draws fallen leaves aside with her rake, held in both hands, looking over at the children; left of centre Gustaw bends with cupped hands full of acorns, his red griffin shield leaning against the nearest oak trunk, the griffin toward us, Koniczynka standing behind him with nothing on her back. Oliwia kneels in the centre foreground lifting a leaf with one hand and holding her satchel flap open with the other, half full of acorns, her face turned to Marcin. Marcin stands right of centre with both hands full of acorns, his hazel switch under one arm, smiling broadly at the three piglets under the beech: they crunch BEECHNUTS — small triangular brown nuts spilling from spiky husks among the copper leaves — the Smallest with a husk stuck on its snout. Under the beech only beechnuts; acorns only in the people's hands and satchel. All four faces readable in three-quarter view, glad.",
     "\"They all spread out through the forest, but not too far, so they could hear each other. Under the beeches the piglets found beechnuts and munched them happily. 'Those are for them, and the acorns are for the deer,' said Marcin.\"",
     "Oliwia, Agata, Gustaw, Marcin: exactly four people; one mare without a load; exactly three piglets under the beech; one beech tree among oaks; one shield leaning against a trunk; no fence, no gate, no star, no deer; no sack, no basket.",
     NEG + "; no sack; no basket; no fence or gate; no star anywhere; no chestnuts or sweet-chestnut burrs — beechnuts are small and triangular; the piglets eat beechnuts, never acorns; no shield on Gustaw's arm or back; no second rake; no sky; no sunlight; no bright orange foliage; no distant view")
page("fo-p9-help-fawn", "plate", "day", ["stag", "doe", "herd", "mare", "gustaw", "oliwia", "marcin", "dobrochna"], ["corner", "branch"], ["mended-new"],
     "CAMERA: LOW, at a fawn's eye level, on the deer trail just east of the Heartwood, looking WEST toward the Heartwood's fence; the middle-ground figures are whole, not cut by the frame. Landscape framing (a 5:4 plate; everything important in the middle four-fifths): the doe and the fawn big in the right foreground; the pulled-aside branch lying along the trail's edge in the left foreground, the rope from its far end running back to the mare in the left middle ground; the stag in the centre middle ground; behind it the fence with the NEW GATE standing open; the children and Agata in the right middle ground under an oak; golden crowns above with small pale-blue patches of sky; the last flat band of mist rolling away at the far left.",
     "SCENE (page 9, the morning comes, variant help-fawn): the branch has just been drawn aside. Koniczynka stands at the left with a hemp rope still tied from her saddle to the far end of the branch, which now lies along the edge of the trail; Gustaw holds her bridle with one hand and strokes her neck with the other, his red griffin shield hung from her saddle, the griffin toward us. The little fawn has darted across the cleared trail and presses against its mother's flank, the doe's head bent down to it, both in the right foreground. The stag stands calm in the centre in three-quarter view, the small gold star on its brow clear, looking at the people with kind eyes before it leads the herd in; behind it two hinds already step through the open new gate into the Heartwood. At the right, well back, Oliwia and Marcin hold hands, Agata beside them with her rake upright in her hand, all three faces turned to the fawn, happy and still: nobody goes near the deer. Where the stag stands the mist is gone and the oaks are golden in full sun. " + NEW_GATE + ".",
     "\"Gustaw tied a rope to the far end of the branch, and Koniczynka slowly pulled it aside. Nobody went near the fawn. The little one darted to its mother and pressed against her side. The stag looked at them calmly and led the herd through the new gate into the Heartwood.\"",
     "Oliwia, Marcin, Gustaw, Agata: exactly four people; one mare with one rope and the shield on her saddle; one stag with one small gold star; one doe; one fawn pressed to the doe; exactly two hinds at the gate; one branch lying along the trail; one new gate with one carved star; no piglets.",
     NEG + "; no rope on or near any deer — the rope touches only the branch and the saddle; nobody touches a deer; nobody pulls the rope by hand; no shield on Gustaw's arm or back; no halo, glow or rays; no sun rays; no old grey gate; no star on any post; no fawn behind the branch; no piglets; no distant hills; no clouds; no saturated orange")
for pid, rev in [("fo-p3-call-back", "fo-p3-call-backd"), ("fo-p5-show-tracks", "fo-p5-show-tracksc"),
                 ("fo-p7-gather-forest", "fo-p7-gather-forestf"), ("fo-p9-help-fawn", "fo-p9-help-fawne")]:
    m.REVISION[pid] = rev
    if pid.startswith(("fo-p3", "fo-p5")):
        mist_first(pid, rev)
        m.PAGES[pid]["extra_refs"] = list(dict.fromkeys(list(m.PAGES[pid]["extra_refs"]) + [OLD_STAR_REF]))
# Cold check of the new takes: call-backd shipped whole; three single-region fixes.
fifth("fo-p5-show-tracks", "fo-p5-show-tracksc", "fo-p5-show-tracksd", "everything except the star on the broken gate Gustaw lifts",
      "In show-tracksc the whole star sat on the left half next to the break; now the break runs through the star's centre.", star=True)
again("fo-p7-gather-forest", "fo-p7-gather-forestf", "fo-p7-gather-forestg", "everything except what lies on the ground under the beech",
      "Under the beech lie real BEECHNUTS: tiny shiny brown three-sided nuts, each as small as a fingertip (much smaller than a piglet's "
      "nostril), and their small open woody husks, each split into four little lobes with short soft bristles, no bigger than a thumbnail. "
      "The piglets nose and munch them. Nothing else changes.",
      neg="no chestnuts; no big round spiky chestnut burrs; no conkers; no nut bigger than a fingertip")
again("fo-p9-help-fawn", "fo-p9-help-fawne", "fo-p9-help-fawnf", "everything except the open gate and the deer stepping through it",
      "(1) " + NEW_GATE + "; it stands open. (2) EXACTLY TWO hinds step through the open gate into the Heartwood, one behind the other; "
      "no third deer at the gate.", neg="no third hind; no bottom rail or diagonal on the gate")
# Shipped: fo-p3-call-backd whole; fo-p5-show-trackse = show-tracksc + the star from d (crop focus 0.9 keeps the shield);
# fo-p9-help-fawng = help-fawne + the gate and two hinds from f (focus 0.75).
# gather-foresth = gather-forestf + the beechnuts from g; its figures span the whole width, so the 5:4 crop cut Agata or the piglets
again("fo-p7-gather-forest", "fo-p7-gather-foresth", "fo-p7-gather-foresti", "every person and animal, their poses, faces and costumes, the beech, the beechnuts, the shield against the oak, the light and colours",
      "the FRAMING only: the camera steps back so the same group stands a little smaller and closer together; every figure, the shield and all three piglets sit inside the middle four-fifths of the width, and the outer fifth on each side holds only oak trunks, bracken and leaves.",
      neg="no figure or piglet touching the left or right edge")
# Shipped: fo-p7-gather-foresti whole (focus 0.5); the beechnuts stayed small and the group fits the 5:4 crop.
# Fresh review of the fifth pass: p9 make-way had a hind with two heads and one standing on the gate; the new gate on both p9 takes
# had plank tops above the crossbar; p7 gather-forest lost Koniczynka's caparison.
GATE_FLUSH = "the NEW GATE in the Heartwood fence, standing open: exactly THREE upright pale planks whose tops end FLUSH UNDER one broad pale crossbar, so nothing rises above the crossbar; one four-pointed star carved in the centre of that crossbar as a darker groove"
again("fo-p9-make-way", "fo-p9-make-wayf", "fo-p9-make-wayg", "everything except the deer and the gate in the background",
      "(1) Every deer in the background has exactly ONE head, four legs and one body; the hinds graze or stand on the grass INSIDE the fence, none touching the gate or standing on it. (2) " + GATE_FLUSH + ".", neg="no deer with two heads; no deer on or over the gate; no plank above the crossbar")
again("fo-p9-help-fawn", "fo-p9-help-fawng", "fo-p9-help-fawnh", "everything except the open gate itself",
      GATE_FLUSH + "; the two hinds still step through it.", neg="no plank above the crossbar; no fourth plank")
again("fo-p7-gather-forest", "fo-p7-gather-foresti", "fo-p7-gather-forestj", "everything except Koniczynka's back",
      "Koniczynka wears her red caparison cloth with its narrow gold border over her back, as on every other page; no sack or load on it.", neg="no sack; no load on the mare")
# The old gate's split star failed twice by generation, so it is painted by hand from one template (scratchpad star.py: a chip-carved
# four-pointed groove whose centre sits on the break, each half on its own broken board): fo-p3-call-backe, fo-p5-show-tracksf,
# fo-p6g and fo-p7-give-sackj. p3 follow-piglets, p4 and p5 ask-kindly already had that form.
again("fo-p7-give-sack", "fo-p7-give-sackj", "fo-p7-give-sackk", "everything except Gustaw's shield",
      "Gustaw's red griffin shield leans against the old grey fence post on the FAR side of the fence, Gustaw's side (outside the Heartwood), partly behind the rail, the griffin still visible; nothing stands on the moss on our side of the fence.", neg="no shield on our side of the fence; no shield on Gustaw's arm or back")


if __name__ == "__main__":
    sheets()
    print("set-forest-oath", "m-sheet-forest", "sheets")
    for pid, p in m.PAGES.items():
        rev = m.REVISION.get(pid, pid)
        m.build(rev, p)
        if rev in MIST_FIRST:
            f = m.HERE / f"{rev}.txt"
            ls = f.read_text().split("\n")
            f.write_text("\n".join(ls[:2] + ["", ATMOSPHERE] + ls[2:]))
        print(rev, p["layout"], p["time"])
    emblem_prompt("orn-title-forest", TITLE[0], TITLE[1], "one stag with one small gold star; one oak twig with two acorns.")
    print("orn-title-forest", "emblem")
    for variant, (motif, counts) in ENDINGS.items():
        pid = EMBLEM_REV.get(variant, f"fo-p10-{variant}")
        emblem_prompt(pid, motif, DAY_GROUND, counts, extra_refs=", orn-title-forest-clean.png")
        print(pid, "emblem")
