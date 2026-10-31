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
             .replace("the bridge, the nest crack, the banks, the buildings", "the charcoal clearing with its kiln, hut and cart, the path, the Oak Corner with its fence and star posts, the fallen branch"))

STAR = ("one small flat gold-leaf FOUR-POINTED STAR (#c9972b, crisp ink edge, the size of a child's palm; EXACTLY four long slim points — up, down, left, right — never five or six, as on the character sheet) on the stag's brow between the bases of its antlers, like a blaze of gold — "
        "never a halo, glow, rays, sparkles or beam of light; nothing else on the stag shines")
m.C.update({
    "mare": "Koniczynka — Gustaw's gentle cream-white palfrey mare: flaxen mane and tail, soft grey muzzle, dark kind eyes, a red caparison cloth with a narrow gold border over her back, a brown leather bridle. Calm and curious.",
    "dobrochna": "Dobrochna the charcoal burner — a sturdy woman of about fifty with a weathered, kind, practical face and laugh lines, grey-streaked dark hair under a rust-brown kerchief tied at the nape, a slate-grey wool dress with sleeves rolled to the elbow, a long dark-brown leather apron with soot smudges on the apron only (her face and hands are clean, cheeks rosy), brown boots; her one tool is a long-handled wooden rake.",
    "marcin": "Marcin the swineherd — a boy of about ten, a little taller than Oliwia (his head reaches Gustaw's shoulder): short dark-brown hair in a ragged bowl cut, freckles, big honest eyes; oatmeal linen shirt under a weld-yellow ochre wool tunic belted with a cord, a short brown hood with a shoulder cape pushed back, brown hose patched at one knee, soft leather shoes; one thin hazel switch.",
    "piglets": "The three piglets — always exactly three real little pigs the size of a cat, curly tails, forward-flopping ears, small kind eyes, never clothed, never standing like people: Big is pink with one large dark saddle patch over its back; Middle is pink with many small dark spots; Smallest is all pink with one dark ear.",
    "stag": "The star stag — a calm, gentle red deer stag: warm red-brown coat, darker shaggy neck mane, pale cream rump, dark kind lashed eyes (never glowing), his shoulder as high as a man's shoulder; symmetrical pale bone-ochre antlers with five points on each side; " + STAR + ".",
    "doe": "The doe and her fawn — a slim red deer hind (no antlers, red-brown) and her small fawn, knee-high to a man, with big ears and a few faint pale spots fading on its back.",
    "herd": "The herd — two more red deer hinds, drawn small and quiet.",
})
m.SHEETS = {"gustaw": "m-sheet-heroes.png", "oliwia": "m-sheet-heroes.png", "mare": "m-sheet-moonhill.png",
            **{k: "m-sheet-forest.png" for k in ["dobrochna", "marcin", "piglets", "stag", "doe", "herd"]}}
m.SET = {
    "clearing": "SET — Dobrochna's charcoal clearing (must match the attached location sheet): a round mossy clearing ringed by big oaks. In it THE KILN: a low round dome of dark earth and turf sods, as tall as a man and as wide as three people lying end to end, with a ring of small vent holes plugged with turf — a quiet earth mound with absolutely no smoke, steam, glow or flame. At the west edge a small low hut of split logs with a turf roof, one plank door and one small square window, a wooden bucket by the door; in front of it a two-wheeled wooden cart with wicker sides and a few full charcoal sacks, shafts resting on the ground. At the east edge neat stacks of oak billets. The path leaves the clearing at its north edge between two great oaks.",
    "path": "SET — the path: a narrow earth track with moss, roots, fallen oak leaves and acorn cups, running north from the clearing between big oaks to the Oak Corner.",
    "corner": "SET — the Oak Corner (must match the location sheet): a roughly square enclosure of exactly five ancient oaks with huge trunks and wide golden-ochre crowns, soft moss on the ground inside. Round it a LOW FENCE of split oak, waist-high to a man: exactly TWO horizontal rails between squared oak posts with rounded tops; every post carries one CARVED FOUR-POINTED STAR near its top on its outer face — a slim, pointed compass-rose star cut into the wood, never a cross.",
    "broken": "SET — the storm damage on the Corner's south fence (the side facing the path): one post LEANS sideways with its old carved star toward the path; the next post is SNAPPED at its base, its stump showing; two rails lie in the grass; the gap between them opens into the Corner.",
    "branch": "SET — the fallen branch: a big storm-broken oak branch with twigs and brown leaves lies ACROSS the deer trail just east of the Corner, as high as a fawn's back.",
}
m.STATE = {
    "cups": "STATE: the ground inside the Corner is strewn with EMPTY ACORN CUPS and almost no acorns.",
    "post-up": "STATE: the leaning post has been set upright again; its old carved star faces the path. The snapped post and the two fallen rails are still as they were.",
    "sack": "STATE: Marcin's hemp sack of acorns (pale hemp, tied with a cord) is here.",
    "mended": "STATE: the south fence is mended: two new rails of fresh pale wood, and in place of the snapped post a NEW PALE POST of fresh-cut wood with a freshly carved four-pointed star, beside the old grey posts with their old stars; acorns lie on the moss inside the Corner.",
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
    "morning": "TIME (colour script): late morning; only a few flat patches of mist remain low between the far trunks; the oak leaves are ochre, russet and gold; warm, even light, soft flat patches of sunlight on the moss; pale blue sky between the crowns." + BRIGHTER,
    "day": "TIME (colour script): bright noon, the brightest picture of the tale: the mist is gone except for the last flat pale bands rolling away at the far edges; the oaks are golden and ochre in full sun, the sky a clear pale blue between the crowns; warm, bright and joyful, but still the same muted manuscript palette — never saturated, never a glowing sky, no sun rays.",
})
NEG = "no text, letters or numbers; no smoke, steam or glow from the kiln; no fire, torch, lantern or candle; no light rays or beams; no birds, dogs or other animals; no conifers or poplars"
page = m.page

# p1 — WIDE, plate (a "Did you know" note about the kiln is expected under it)
page("fo-p1", "plate", "mist", ["dobrochna", "gustaw", "oliwia", "mare", "piglets"], ["clearing", "path"], [],
     "CAMERA: the default view — at the clearing's south edge, standing height, looking north. West is on the left, east on the right. Landscape framing with everything important in the middle four-fifths of the width: the hut and the cart at the left, the kiln mound in the centre-left, the woodpiles at the right, the path into the forest right of centre between the two great oaks, the people in the middle ground, a strip of mossy ground in the foreground at the bottom.",
     "SCENE (page 1, the morning that did not come): it should be dawn, but the mist has not lifted. Dobrochna stands beside the earth kiln, one hand on her rake, the other lifted a little toward the path as she explains, her face turned toward the forest, calm but puzzled. Gustaw stands beside her with Koniczynka's bridle in his hand; Oliwia stands close to Gustaw, her satchel across her chest. All three faces are clearly visible in three-quarter view, turned toward the path, where, out of the flat bands of mist between the two great oaks, three little piglets come trotting toward them, ears flopping, one after another. THE PICTURE CLUE (not pointed at by anyone, but plain to a careful child): in the mossy foreground at the bottom centre lie a few EMPTY ACORN CUPS and a little trail of SMALL CLOVEN HOOFPRINTS pressed into the moss, coming from the path.",
     "\"Dawn should have come to Dębowy Bór, but the mist did not lift. Dobrochna said the stag with a star between its antlers brings the morning — and it had not come. Then three piglets trotted out of the mist.\"",
     "Dobrochna, Gustaw, Oliwia: exactly three people; one mare; exactly three piglets; one kiln; one hut; one cart; a few empty acorn cups and small hoofprints in the foreground; no deer.",
     NEG + "; no stag yet; nobody points at the hoofprints.")

# p2 — LOW, plate, choice: follow-piglets / call-back (unresolved)
page("fo-p2", "plate", "mist", ["oliwia", "dobrochna", "gustaw", "mare", "piglets"], ["clearing", "path"], [],
     "CAMERA: low, at a piglet's eye level, on the east side of the path just north of the clearing, looking WEST across the path. In this view NORTH (the forest, the mist and the way to the Oak Corner) is on the RIGHT, and the clearing with the kiln mound is on the LEFT edge, softly. Landscape framing: the three piglets big in the foreground in the lower middle, the people behind them in the middle ground, their faces in clear profile and three-quarter view, all turned to the right.",
     "SCENE (page 2, a voice in the mist): somebody calls from the mist on the right, far away. The three piglets stand in a row in the foreground, heads up, ears pricked and twitching toward the right, one forefoot lifted, ready to trot off that way. Oliwia crouches beside them, one hand open near the smallest piglet, her face turned to the right, listening, curious. Dobrochna, a step behind, cups one hand behind her ear, listening. Gustaw stands with Koniczynka's bridle in his hand, the mare's ears pricked toward the right too. The path runs away to the right into flat pale bands of mist between the oak trunks. Nobody has decided yet.",
     "\"Somebody called in the mist: 'Kosia, kosia!' The piglets twitched their ears.\"",
     "Oliwia, Dobrochna, Gustaw: exactly three people; one mare; exactly three piglets; no other figure, the caller is not seen.",
     NEG + "; no sound lines or symbols; no figure in the mist.")

# p3 — THRESHOLD, portrait, variants from p2
P3_CAMERA = ("CAMERA: on the path just south of the Oak Corner, standing height, looking NORTH into the Corner through its broken south fence. Portrait framing: two great old oak trunks rise up the left and right edges like the sides of a doorway, their crowns meeting overhead; between them, across the middle of the picture, the low fence with the storm gap — the leaning post with its carved star on the left of the gap, the snapped post's stump on the right, two rails in the grass; beyond the gap the moss of the Corner under the five ancient oaks, the ground strewn with empty acorn cups, flat mist bands behind. "
             "In the foreground at the bottom, Oliwia kneels on the path.")
for var, desc in [
    ("follow-piglets", "The three piglets have led them here: they trot through the gap into the Corner toward Marcin, the swineherd boy, who stands just inside the fence among the empty cups, his hazel switch in his hand, startled and a little guilty, one step back, his face clearly visible. In the foreground Oliwia kneels on the path holding one EMPTY ACORN CUP up in her open palm, looking at it and then at the empty ground beyond — she is beginning to understand; her face in clear three-quarter profile. Behind her on the path Gustaw and Dobrochna have stopped, looking in; Koniczynka's head and neck show behind Gustaw's shoulder."),
    ("call-back", "Marcin, the swineherd boy, has come out of the mist to their call: he stands at the gap with the three piglets crowding at his feet, his hazel switch in his hand, and points shyly into the Corner, his face clearly visible, a little guilty. In the foreground Oliwia kneels on the path holding one EMPTY ACORN CUP up in her open palm, looking at it and then at the empty ground beyond; her face in clear three-quarter profile. Behind her Gustaw and Dobrochna look in; Koniczynka's head and neck show behind Gustaw's shoulder."),
]:
    page(f"fo-p3-{var}", "full", "mist", ["oliwia", "marcin", "gustaw", "dobrochna", "mare", "piglets"], ["corner", "broken"], ["cups"],
         P3_CAMERA,
         f"SCENE (page 3, the Oak Corner, variant {var}): {desc}",
         "\"The piglets led them to the Oak Corner, where the oldest oaks grow behind a fence with a star on every post. The fence was broken, and under the oaks lay only empty acorn cups. Marcin the swineherd stood there. Oliwia understood: the piglets were hungry, and the deer had gone because their acorns were eaten.\"",
         "Oliwia, Marcin, Gustaw, Dobrochna: exactly four people; the mare's head and neck only; exactly three piglets; exactly five ancient oaks in the Corner; one leaning star post and one snapped post; no deer.",
         NEG + "; the fence has two rails, never more; the stars are carved four-pointed stars, never crosses; no deer, no stag.")

# p4 — CLOSE, plate, choice: ask-kindly / show-tracks (unresolved)
page("fo-p4", "plate", "dawn", ["marcin", "oliwia", "gustaw", "dobrochna", "piglets"], ["corner", "broken"], ["cups"],
     "CAMERA: close, at the children's eye level, at the gap in the Corner's south fence. Landscape framing with everything important in the middle four-fifths: Marcin and Oliwia as half figures in the centre, filling most of the height; the leaning post with its carved star at the left of the centre area; Gustaw and Dobrochna a step behind on the right, smaller but faces visible; at the bottom edge a strip of soft dark earth at the gap with small cloven hoofprints in it; beyond them the old oaks and thin mist bands, quiet and simple.",
     "SCENE (page 4, Marcin is scared): Marcin stands with his eyes down, cheeks flushed, twisting his hazel switch in one hand, his mouth half open as he stammers that the storm broke the fence. Oliwia, beside him, gently takes his other hand in hers and looks at him kindly, her face calm and warm. Behind Marcin's legs the three piglets huddle together and peek out. Gustaw and Dobrochna stand a step behind on the right, quiet and kind, not scolding. The first warm dawn light lies in soft flat patches on the ground and on the children's faces. Nobody has decided yet what to say.",
     "\"Marcin stammered that the storm had broken the fence. He said nothing about his piglets. He was scared, so Oliwia took his hand.\"",
     "Marcin, Oliwia, Gustaw, Dobrochna: exactly four people; exactly three piglets; one leaning star post; small cloven hoofprints in the earth at the bottom.",
     NEG + "; nobody is angry; no pointing finger yet.")

# p5 — LOW, portrait, variants from p4
P5_CAMERA = ("CAMERA: low, close to the ground at the foot of the leaning fence post, looking up. Landscape framing (a 5:4 plate; everything important in the middle four-fifths): the three piglets curled together in the fallen leaves in the foreground at the bottom; above them the people seen from slightly below, faces clearly visible; Gustaw in the centre setting the post upright, its carved star near the top of the picture, facing us; the old oaks' trunks and golden crowns above against a pale dawn sky.")
for var, desc in [
    ("ask-kindly", "Marcin, asked kindly, tells the truth: he stands at the left, one hand on his chest, his face open and honest, mouth softly open as he speaks, his eyes meeting Oliwia's; Oliwia holds his other hand; Dobrochna rests a hand on his shoulder and nods. Nobody scolds him. Gustaw, at the right of centre, sets the leaning post upright with both hands, steady and calm, the carved four-pointed star at its top facing us."),
    ("show-tracks", "Oliwia kneels and gently points to the small cloven hoofprints in the soft earth at the gap; Marcin, beside her, nods and tells the truth, one hand on his chest, his face open and honest; Dobrochna rests a hand on his shoulder. Nobody scolds him. Gustaw, at the right of centre, sets the leaning post upright with both hands, the carved four-pointed star at its top facing us."),
]:
    page(f"fo-p5-{var}", "plate", "dawn", ["marcin", "oliwia", "dobrochna", "gustaw", "piglets"], ["corner", "broken"], ["cups"],
         P5_CAMERA,
         f"SCENE (page 5, the truth, variant {var}): {desc} Warm dawn light lies in soft flat patches on the moss and on their faces; the mist has thinned to flat pale bands far behind.",
         "\"Marcin told the truth: his piglets had eaten the acorns, because outside the Corner there were almost none this year. Nobody scolded him. Gustaw set the broken post upright, and the carved star faced them again.\"",
         "Marcin, Oliwia, Dobrochna, Gustaw: exactly four people; exactly three piglets; one star post being set upright; the snapped post's stump and two rails still on the ground.",
         NEG + "; nobody is angry or ashamed-looking in a cruel way; the star is never a cross.")

# p6 — HIGH, plate, choice: give-sack / gather-forest (unresolved)
page("fo-p6", "plate", "dawn", ["dobrochna", "marcin", "oliwia", "gustaw", "piglets"], ["corner"], ["post-up", "cups"],
     "CAMERA: close, standing height, at the Corner's mended-upright star post in the south fence (rewritten 2026-10-31 to match the text: the sack is still in Marcin's hut). Landscape framing with everything important in the middle four-fifths: the upright old post with its carved four-pointed star in the centre, Dobrochna's hand resting on it; the four people close round it as half and three-quarter figures, faces clearly visible; the frosty ground at the bottom.",
     "SCENE (page 6, the hard part): Dobrochna rests one hand on the old star post and looks at the carved star, thoughtful and serious, as she says that they promised the deer these acorns, but the piglets need to eat too. Marcin stands beside her, worried, biting his lip, looking down at his three piglets, who nose hopefully among the EMPTY acorn cups in the frosty grass at his feet and find nothing. Oliwia looks from the star to Marcin, thinking; Gustaw stands quietly behind her, a hand on her shoulder. White frost is spreading over the grass and the fallen leaves — winter is coming. Nobody has decided yet.",
     "\"'We promised the deer these acorns,' said Dobrochna, looking at the star on the post. 'But the piglets need to eat too.' The frost was already whitening the grass.\"",
     "Dobrochna, Marcin, Oliwia, Gustaw: exactly four people; exactly three piglets; one upright star post; empty acorn cups only; NO sack and no basket of acorns.",
     NEG + "; no sack; no pile of acorns; the piglets are not eating; no deer yet.")

# p7 — MEDIUM group, portrait, variants from p6
# 2026-10-31 cold check of give-sack a: from outside, the acorns fell on our side, by the piglets; so the camera is INSIDE the Corner
P7_CAMERA = ("CAMERA: eye level, INSIDE the Oak Corner on its moss, looking SOUTH at its south fence from within. Landscape framing (a 5:4 plate; everything important in the middle four-fifths): the fence runs across the middle of the picture; the people stand OUTSIDE it, on the far side, working along it and leaning over the rail toward us; the acorns they give fall over the rail onto the moss of the Corner on OUR side, in the foreground, where they lie scattered in the leaves; big old oak trunks of the Corner at the picture's edges and the forest beyond the people; the three piglets asleep in a heap in the leaves OUTSIDE the fence, behind the people, beside the mare's hooves.")
for var, desc, who in [
    ("give-sack", "Koniczynka stands at the left with Marcin's open hemp sack slung across her back over the red caparison; Oliwia scoops acorns from it in her two hands and scatters them over the rail onto the moss inside; Dobrochna tips a small basket of her own acorns over the rail beside her. In the centre Gustaw fits a fresh pale rail into place. At the right Marcin kneels at the NEW PALE POST and carves a four-pointed star near its top with a small wood chisel, his tongue between his teeth, proud.",
     ["mare", "oliwia", "dobrochna", "gustaw", "marcin", "piglets"]),
    ("gather-forest", "Everyone has gathered acorns from the whole forest: Oliwia pours acorns over the rail from the flap of her satchel, Dobrochna from her gathered-up apron; the three piglets nose acorns out of the leaves by the fence; Koniczynka stands at the left without a load. In the centre Gustaw fits a fresh pale rail into place. At the right Marcin kneels at the NEW PALE POST and carves a four-pointed star near its top with a small wood chisel, proud.",
     ["mare", "oliwia", "dobrochna", "gustaw", "marcin", "piglets"]),
]:
    page(f"fo-p7-{var}", "plate", "morning", who, ["corner"], ["mended"],
         P7_CAMERA if var == "give-sack" else P7_CAMERA.replace("asleep in a heap in the leaves OUTSIDE the fence, behind the people, beside the mare's hooves", "OUTSIDE the fence, nosing acorns out of the leaves at the people's feet"),
         f"SCENE (page 7, the oath kept, variant {var}): {desc} Acorns lie on the moss inside the Corner. Every old grey post shows its small carved four-pointed star near the top. Late morning: patches of mist low between the far trunks, ochre oak leaves, soft light; no blue sky yet (the stag has not come), only pale milky mist between the far trunks.",
         "\"Together they gave the Corner back its acorns and mended the fence. Marcin carved a new star on the new post.\"",
         "Oliwia, Dobrochna, Gustaw, Marcin: exactly four people; one mare; exactly three piglets; one new pale post with one star; exactly two rails.",
         NEG + "; the chisel is a small woodworking tool, never a knife or weapon; no deer yet.")

# p8 — FOLLOWING, plate, choice: make-way / help-fawn (unresolved)
page("fo-p8", "plate", "morning", ["gustaw", "oliwia", "marcin", "dobrochna", "stag", "doe", "herd"], ["corner", "branch"], ["mended"],
     "CAMERA: just behind the group, standing height, at the Corner's east side, looking NORTH-EAST along the deer trail into the forest. Landscape framing with everything important in the middle four-fifths: the four people in the foreground at the lower left and centre, seen from three-quarter behind with their faces turned in clear profile toward each other and the deer; the mended fence with the new pale star post along the left; the deer trail running away into the middle distance; the fallen branch lying across the trail in the middle ground; the stag beyond it in the centre-right.",
     "SCENE (page 8, the star in the mist): out of a band of late-morning mist on the deer trail, the star stag steps calmly into view — first the small gold star on its brow, then the antlers, now its head and chest clear, its kind dark eyes on the people. Beside it stands the doe; behind them two more hinds are pale quiet silhouettes in the mist. Across the trail lies the big storm-broken oak branch, and behind it the little fawn stands stuck, unable to get over, looking at its mother. In the foreground Oliwia holds Marcin's hand, both in profile, eyes wide with wonder, smiling; Gustaw and Dobrochna stand still beside them, Dobrochna's hand on her heart. Nobody moves toward the deer; nobody has decided yet.",
     "\"A gold star appeared in the mist, and then antlers. The stag had come, and the herd behind it. But the youngest fawn was stuck behind a branch the storm had brought down.\"",
     "Gustaw, Oliwia, Marcin, Dobrochna: exactly four people; one stag with one small gold star; one doe; one fawn behind the branch; exactly two more hinds, faint; one fallen branch; no piglets in this picture.",
     NEG + "; no halo, glow, rays or sparkles around the stag or its star; the stag is calm, never rearing; no second stag; the people do not bow or kneel.")

# p9 — WIDE, portrait (rhyme with p1), variants from p8
P9_CAMERA = ("CAMERA: a visual rhyme with page 1 — at the clearing's north edge, standing height, looking NORTH up the path between the big oaks, now in bright noon. Landscape framing (a 5:4 plate; everything important in the middle four-fifths): the corner of the earth kiln mound at the lower left; the path winding up the picture; the stag in the middle of the picture walking down the path toward us, its face, antlers and star clearly visible; the people following behind it, faces visible; far up the path at the top, small, the mended fence of the Oak Corner.")
for var, desc in [
    ("make-way", "They made way for the deer: far up the path the herd — the doe, the fawn and two hinds — grazes on the acorns inside the mended Corner. The stag walks down the path toward the clearing, calm and unhurried, and where it walks the last flat bands of mist roll back to both sides and the golden oaks stand in full sun."),
    ("help-fawn", "They helped the fawn: the big branch now lies along the edge of the trail far up the path, and the fawn trots close beside its mother just behind the stag, safe; two hinds graze inside the mended Corner. The stag walks down the path toward the clearing, calm and unhurried, and where it walks the last flat bands of mist roll back to both sides and the golden oaks stand in full sun."),
]:
    page(f"fo-p9-{var}", "plate", "day", ["stag", "doe", "herd", "oliwia", "marcin", "gustaw", "mare", "dobrochna", "piglets"], ["path", "clearing"], ["mended"],
         P9_CAMERA,
         f"SCENE (page 9, the morning comes, variant {var}): {desc} Behind the stag, at a respectful distance, Oliwia walks hand in hand with Marcin; with her other hand she tucks one acorn in its cup into her satchel. Gustaw walks beside them leading Koniczynka; Dobrochna follows with her rake over her shoulder, smiling; the three piglets trot along at Marcin's heels. Everyone is smiling, faces turned toward the sun.",
         "\"The stag walked on, and wherever it went the mist parted. Hand in hand, step by step, they followed it into the bright noon. Oliwia kept one acorn to plant by the next road.\"",
         "Oliwia, Marcin, Gustaw, Dobrochna: exactly four people; one mare; exactly three piglets; one stag with one small gold star; the doe, the fawn and two hinds small in the distance" + (" (the fawn and doe near the stag)" if var == "help-fawn" else "") + "; one acorn in Oliwia's hand.",
         NEG + "; no sun rays; no halo around the stag; nobody touches the deer; no mist hiding anyone.")



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
fix("fo-p1", "fo-p1b", "camera, the hut, the cart, the kiln, the woodpiles, Gustaw, Oliwia, Koniczynka, Dobrochna and their poses and faces, the three piglets on the path, the empty acorn cups and hoofprints in the foreground",
    CLOSED_MIST, neg="no distant landscape; no conifers or pointed trees anywhere; no blue sky; no sunlight")
fix("fo-p3-follow-piglets", "fo-p3-follow-pigletsb", "camera, the two framing oak trunks, the Corner with its oaks and empty cups, the broken fence with its star posts and fallen rails, Oliwia kneeling with the cup, Marcin, the three piglets, the light and colours",
    "WHERE THE GROWN-UPS STAND: Gustaw, Dobrochna and Koniczynka are OUTSIDE the Corner, on the path on OUR side of the fence, together with Oliwia — they stand a step behind her and a little to the left, and the fence's left section with its two rails runs BEHIND them (we see the rails behind their legs and cloaks, never in front of them). Only Marcin and the piglets are inside the Corner. Marcin looks startled and a little guilty: shoulders up, his switch held close, glancing at the piglets.",
    neg="no adult or horse inside the Corner; no rail in front of Gustaw, Dobrochna or the mare")
fix("fo-p4", "fo-p4b", "the children Marcin and Oliwia holding hands, their faces, poses and costumes, the three piglets behind Marcin's legs, Gustaw and Dobrochna and their faces, the leaning star post and fallen rails at the left, the hoofprints in the earth, the light and colours",
    "(1) the whole group sits a little closer together and further from the right edge: Dobrochna, her rake and her hands are fully inside the central 5:4 area, with a strip of oak trunk and fence at the right edge beyond her; (2) the background behind the people is the oak forest — big trunks and golden crowns, the farther ones fainter in thin flat bands of dawn mist — with NO open valley, lake, field or far hills.",
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
    "make-way": ("the closing emblem (the colophon) of the tale \"The Forest Oath\", the companion of its frontispiece: inside the roundel, the Oak Corner at noon — a golden old oak, beneath it a short stretch of the low split-oak fence with two rails and one new pale post carrying a freshly carved four-pointed star; behind the fence the doe and her small fawn graze on acorns in the moss, and the star stag stands beside them with its head raised, calm, the small gold star on its brow; a small flat gold sun disc in the sky, without rays.",
                 "one stag with one small gold star; one doe; one fawn; one new pale post with one carved star; one sun disc."),
    "help-fawn": ("the closing emblem (the colophon) of the tale \"The Forest Oath\", the companion of its frontispiece: inside the roundel, under golden oaks at noon, the small fawn pressed close against its mother's side, safe, her head bent to it; the star stag stands behind them, calm, the small gold star on its brow; the storm-broken oak branch lies aside along the edge of the moss; a small flat gold sun disc in the sky, without rays.",
                  "one stag with one small gold star; one doe; one fawn; one branch lying aside; one sun disc."),
}
DAY_GROUND = "inside it a clear, pale day-blue ground (#a9c3cf) with a few soft cream cloud shapes — the morning has come (the frontispiece of this tale is the same roundel on a deep blue pre-dawn ground)."


def sheets():
    style = m.STYLE
    (m.HERE / "set-forest-oath.txt").write_text("\n".join([
        "REFS: pentiment-stylesheet.png, pentiment-farm.png, tone-dragon-bridge-p4.png, tone-dragon-bridge-p5.png",
        "SIZE: 1536x1024, landscape.", "", style, "",
        "TASK: a LOCATION MODEL SHEET for an illustrated book — one forest place drawn from several fixed views on a plain warm parchment background, like a production design sheet in the Pentiment style. No people, no animals. Clear daylight, NO mist on this sheet (it shows the layout only). Generous empty parchment between views, no boxes, no labels, no text.",
        "",
        "THE PLACE (identical in every view): Dębowy Bór, an old October oak forest — broad old oaks with round, cloud-like crowns of ochre, russet and olive leaves, moss, brown bracken, fallen leaves. "
        "In the south of the forest, DOBROCHNA'S CHARCOAL CLEARING: a round mossy clearing ringed by oaks. In it THE KILN: a low round dome of dark earth and turf sods, as tall as a man and as wide as three people lying end to end, with a ring of small vent holes plugged with turf — a quiet mound with NO smoke, steam or glow. At the WEST edge a small low hut of split logs with a turf roof, one plank door and one small square window, a wooden bucket by the door; in front of it a two-wheeled wooden cart with wicker sides and a few full charcoal sacks, shafts resting on the ground. At the EAST edge neat stacks of oak billets. "
        "THE PATH leaves the clearing at its NORTH edge between two great oaks and runs north to THE OAK CORNER: a roughly square enclosure of exactly FIVE ancient oaks with huge trunks and wide golden-ochre crowns, soft moss inside, ringed by a LOW FENCE of split oak, waist-high to a man: exactly TWO horizontal rails between squared oak posts with rounded tops, and EVERY post carries one CARVED FOUR-POINTED STAR near its top on its outer face (a slim pointed compass-rose star cut into the wood, never a cross). "
        "On the Corner's SOUTH side, facing the path, the fence is storm-broken: one post LEANS sideways, the next is SNAPPED at the base, two rails lie in the grass, leaving a gap. "
        "THE DEER TRAIL comes from the deep forest in the NORTH-EAST to the Corner's EAST side; across it, just east of the Corner, lies a big storm-broken oak branch with twigs and brown leaves, as high as a fawn's back.",
        "",
        "VIEWS:",
        "1. Top half, large: the clearing seen from its south edge looking north — the hut and the cart at the left, the kiln mound in the centre-left, the woodpiles at the right, the path leaving between two great oaks right of centre.",
        "2. Bottom left: the Oak Corner seen from the path, from the south: the low two-rail fence with its star posts, the leaning post and the snapped post with the rails in the grass in the middle, the five ancient oaks inside.",
        "3. Bottom middle: a simple plan from above: the round clearing in the south with the kiln, the hut (west) and the woodpiles (east); the path running north; the square Corner with its five oaks and the broken gap in its south fence; the deer trail coming from the north-east to the Corner's east side, with the fallen branch across it.",
        "4. Bottom right: two close details side by side: one fence post with its carved four-pointed star at the top; the fallen oak branch lying across the deer trail.",
        "",
        "NEGATIVES: no text or labels; no people; no animals; no smoke, steam or fire; no mist; no conifers, poplars or cypresses; no saturated colours.",
    ]) + "\n")
    (m.HERE / "m-sheet-forest.txt").write_text("\n".join([
        "REFS: m-sheet-heroes.png, m-sheet-moonhill.png, pentiment-stylesheet.png, tone-dragon-bridge-p4.png",
        "SIZE: 1536x1024, landscape.", "", style, "",
        "TASK: a CHARACTER MODEL SHEET for an illustrated book, in exactly the format of the attached model sheet with the white mare and the villagers: full figures standing in a row on a plain warm parchment background, then animals below, generous empty parchment between them, no boxes, no labels, no text. Same scale for everyone; the girl Oliwia at the right edge for height (match the attached heroes sheet).",
        "",
        "TOP ROW, full figures standing, facing three-quarter front, calm kind expressions, faces clearly drawn:",
        "1. " + m.C["dobrochna"] + " Shown holding her rake upright.",
        "2. The same Dobrochna from the side, rake over her shoulder.",
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
mist_first("fo-p1", "fo-p1c", "camera, the hut, the cart, the kiln, the woodpiles, Gustaw, Oliwia, Koniczynka, Dobrochna and their poses and faces, the three piglets on the path, the empty acorn cups and hoofprints in the foreground", mist_ref=False)
mist_first("fo-p2", "fo-p2b", "camera, the clearing at the left, Gustaw with Koniczynka, Oliwia crouching, Dobrochna cupping her ear, the three piglets and their poses and faces")
mist_first("fo-p3-follow-piglets", "fo-p3-follow-pigletsc", "camera, the two framing oak trunks, the broken fence with its star posts and fallen rails, the empty cups, Oliwia kneeling with the cup, Gustaw, Dobrochna and Koniczynka outside the fence, Marcin and the three piglets inside, every pose and face")
mist_first("fo-p4", "fo-p4c", "the children Marcin and Oliwia holding hands, their faces, poses and costumes, the three piglets behind Marcin's legs, Gustaw and Dobrochna fully inside the picture, the leaning star post and fallen rails, the hoofprints")
mist_first("fo-p5-ask-kindly", "fo-p5-ask-kindlyb")  # a new 5:4 plate (the note sits under it), not a fix of the portrait take
mist_first("fo-p6", "fo-p6b")
# pages with a "Did you know" note (5, 7, 9) are 5:4 plates: new takes, not fixes of the portrait first takes
m.REVISION["fo-p7-give-sack"] = "fo-p7-give-sackb"
m.REVISION["fo-p9-make-way"] = "fo-p9-make-wayb"


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
        emblem_prompt(f"fo-p10-{variant}", motif, DAY_GROUND, counts, extra_refs=", orn-title-forest-clean.png")
        print(f"fo-p10-{variant}", "emblem")
