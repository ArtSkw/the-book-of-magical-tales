#!/usr/bin/env python3
"""Scene prompts for "The Bell of Moonhill" — same assembly as _build_a2.py, this tale's canon.
Sources: docs/pilot/SET_BIBLE_moonhill-bell.md. Run from this folder: python3 _build_moonhill.py
"""
import _build_a2 as m

m.PAGES.clear()
m.REVISION.clear()
m.REVISION.update({k: k + "b" for k in ["mh-p2", "mh-p9-ring-gently", "mh-p9-share-song", "mh-p10-ring-gently", "mh-p10-share-song"]})  # continuity fails: moon phase, cypresses
m.REVISION.update({"mh-p1": "mh-p1c", "mh-p6": "mh-p6c", "mh-p8": "mh-p8c",  # 2026-10-21 review: plates; b failed (cypresses, round tower)
                   "mh-p10-ring-gently": "mh-p10-ring-gentlyc",  # 2026-10-21 review: moths on the rivets
                   "mh-p9-ring-gently": "mh-p9-ring-gentlyc",
                   "mh-p5-move-slowly": "mh-p5-move-slowlyb", "mh-p5-lullaby": "mh-p5-lullabyc"})  # p5: portraits, not vignettes; lullaby b broke the tower (two belfries)  # 2026-10-21 user review: rope hung outside the tower; sound drawn as extra moons
m.REVISION.update({"mh-p7-thank-bell": "mh-p7-thank-bellb",  # 2026-10-31: new scene (turning the bell); a: people at the canvas edges, a church spire in the window
                   "mh-p3-ask-elders": "mh-p3-ask-eldersb",  # 2026-10-24 user review: Janina held two sticks (leaning AND pointing)
                   "mh-p5-move-slowly": "mh-p5-move-slowlyc",  # the carpenter's leg melted into the trunk
                   "mh-p5-lullaby": "mh-p5-lullabyd", "mh-p9-share-song": "mh-p9-share-songd"})  # share-song d: c hung the rope outside the tower, belfry off-model  # the tune drawn as a gold rope; p9 b: cypresses, finch asleep instead of listening
# One way to draw a tune everywhere (user, 2026-10-24): airy gold notes, never a ribbon that reads as a second rope.
MELODY = ("a light, airy scatter of about eight tiny gold-leaf musical notes in the manner of a medieval chant book — small square and lozenge-shaped note heads, a few with one thin stem; no staff lines, no modern clefs, quavers or beamed notes — "
          "mixed with a few tiny four-pointed gold sparkles; they float loosely and far apart along a gentle invisible curve, each note separate, small and delicate, the farthest ones fading softly away; "
          "never a continuous line, ribbon, thread, rope, smoke or wave")
def composition(change):
    return (" COMPOSITION: the attached COMPOSITION REFERENCE is the approved version of THIS picture — keep it exactly (camera, people, poses, faces, the tree, the tower, the rope, the nest, the light and colours); "
            f"the only change: {change} (This overrides the rule below about not copying compositions.)")
m.BASE_REFS = ["pentiment-stylesheet.png", "pentiment-farm.png", "tone-dragon-bridge-p4.png",
               "tone-dragon-bridge-p5.png", "set-moonhill.png"]
m.REFROLE = m.REFROLE.replace("the bridge, the nest crack, the banks, the buildings", "the square, the bell tower, the pear tree, the belfry, the buildings")
m.C.update({
    "mare": "Koniczynka — Gustaw's gentle cream-white palfrey mare: flaxen mane and tail, soft grey muzzle, dark kind eyes, a red caparison cloth with a narrow gold border over her back, a brown leather bridle. Calm and curious.",
    "reeve": "The reeve — a man of about fifty, short grey-brown beard, round brown felt hat, knee-length green wool coat with a belt, a big iron key on the belt.",
    "baker": "The baker — a round, cheerful clean-shaven man of about forty, white cap, cream shirt, white apron dusted with flour.",
    "carpenter": "The carpenter — a man of about thirty-five, long brown hair tied back, brown beard, rust-brown tunic with rolled sleeves, leather apron.",
    "smith": "The blacksmith — a strong woman of about thirty, dark hair in a braid wrapped round her head, slate-blue dress under a sooty leather apron, a small hammer.",
    "janina": "Grandmother Janina — a small, slightly bent old woman, white kerchief, brown shawl over a grey dress, a walking stick, bright kind eyes.",
    "finches": "The finches — a mother chaffinch (rosy-brown breast, blue-grey cap) and three fluffy chicks asleep in a small cup nest of moss and grass.",
    "villagers": "Villagers of Moonhill — a few families in wool shawls and hoods with small horn lanterns, and their children.",
})
m.SHEETS = {"gustaw": "m-sheet-heroes.png", "oliwia": "m-sheet-heroes.png", **{k: "m-sheet-moonhill.png" for k in
            ["mare", "reeve", "baker", "carpenter", "smith", "janina", "finches"]}}
m.SET = {
    "square": "SET — the square (must match the attached location sheet): a cobbled, roughly round village square on a hilltop with a stone well with a small tiled roof in the middle, timber-framed houses with steep thatched and red-tiled roofs and small square windows around it, chimney smoke.",
    "tower": "SET — the bell tower (must match the location sheet): a slender tower, the lower two-thirds of rough grey stone, on top a timber-framed belfry with FOUR open round-arched windows, a steep red-tiled pyramid roof with a small iron crescent-moon weathervane; one iron-studded wooden door at the foot of the front (south) face; on the back (north) face, high at the belfry, one green-grey wooden shutter.",
    "pear": "SET — the old pear tree: one wide old pear tree with small green-gold pears stands just behind (north of) the tower; its biggest branch reaches toward the green-grey shutter; in the fork of that branch sits the finch nest, a hand's width from the rope.",
    "belfry": "SET — inside the belfry: plank floor with a ladder hatch, a thick oak beam, the bronze bell (warm brown-gold bronze, the size of a barrel) hanging from it, one bell rope; through the round-arched windows the night sky and the moon.",
}
m.STATE = {
    "rope-tree": "STATE: the bell rope has slipped out through the open north shutter and is tangled in loops high in the pear tree's big branch, right beside the nest.",
    "crack": "STATE: on the bell's rim there is one hair-thin crack.",
    "rivets": "STATE: the bell is mended: across the old crack on its rim sits a short row of exactly three small shining rivets.",
    "moon": "STATE: a thin crescent moon (the same crescent seen through the belfry windows earlier that night) rides high above the tower — never a full moon.",
}
m.LAND = "LANDSCAPE (same in every picture of this tale): a friendly hilltop village among green meadows and orchards, single oaks and limes, low rolling hills and far blue mountains to the north-west. Never a marsh, swamp, pond or murky water; no fog banks hiding the land; no dead trees; nothing gloomy. TREES: only broadleaf trees with round, cloud-like crowns (oak, lime, pear, apple, willow, alder), also in the far distance and through windows — absolutely no tall narrow columnar or spire-shaped trees (no cypresses, no poplars, no pointed conifers)."
m.TIME["deepdusk"] = "TIME (colour script): night by candle and lantern light; muted slate-blue night outside the windows with a few gold-dot stars and the moon; warm light only from candles and lanterns; figures keep their full colours."
page = m.page

page("mh-p1", "plate", "evening", ["gustaw", "oliwia", "mare", "villagers"], ["square", "tower"], [],
     "CAMERA: the default view — in the square, south of the tower, looking north at the tower's front, standing height. Landscape framing with everything important in the middle four-fifths of the width: the tower in the centre rising to near the top edge, the well and the gathered families in the middle ground, Gustaw and Oliwia at the left of centre in the foreground, Koniczynka at the right of centre, the orchard path curving away at the right behind her. The attached TOWER REFERENCE (a crop of an approved page of this book) shows exactly how this tower looks: SQUARE in plan with flat stone faces and sharp corners, a square timber-framed belfry with round-arched openings, a red-tiled pyramid roof and the crescent weathervane — match it closely (ignore the rope and the man in that crop).",
     "SCENE (page 1, \"When the Bell Did Not Call\"): evening; blue smoke curls from the chimneys. Families stand in the square in wool shawls with small horn lanterns, all looking up at the silent bell tower and listening. In the foreground, Gustaw (his shield resting at his side) tips his head back and listens, and Oliwia beside him looks up too — but Koniczynka the mare turns her head and stretches her nose to the right, toward the path that runs round the east side of the tower to the orchard, where a few small silver moths glimmer like silver leaves. Oliwia has noticed and glances at the mare.",
     "\"That evening, the bell tower was silent. Families came out into the square in woollen shawls, with horn lanterns in their hands, and everyone looked up and listened. Oliwia noticed that Koniczynka was stretching her nose toward the path to the old orchard, where moths glimmered like silver leaves.\"",
     "Gustaw, Oliwia, one mare, a few families (small); one tower; no bell rope hanging in the square.",
     "no text; no ringing; no sound lines; no castle; no cypresses; no round or octagonal tower.",
     ["mh-tower-p9.png"])

page("mh-p2", "plate", "evening", ["oliwia", "reeve", "baker", "mare"], ["square", "tower"], [],
     "CAMERA: close, at Oliwia's eye level, in the square near the tower door; the tower's foot and door at the left, houses behind.",
     "SCENE (page 2, \"Two Ways Into the Mystery\"): Oliwia stands in the middle listening carefully, a little worried, hands together. On the left the reeve holds up the big iron key to the tower and looks at it, thinking. Beside him the baker shades his eyes and looks up at the belfry where the rope should hang. On the right, two village children point toward the orchard path, and Koniczynka's head and neck reach in from the right edge, gazing the same way, between the pear trees beyond.",
     "\"The reeve thought of the key to the tower. The baker looked at the bell rope. And the children looked toward the orchard, because Koniczynka kept gazing between the pear trees. Oliwia felt a little knot in her tummy, but she listened to everyone in turn.\"",
     "Oliwia, reeve, baker, two children, the mare's head; no Gustaw in frame.",
     "no text; no rope visible; no ringing; Central European trees only — no cypresses or poplars.")

for var, desc, who in [
    ("follow-clover", "Koniczynka has led everyone round the tower: the mare stands at the left, her nose pointing up at the tree, Gustaw holding her bridle and Oliwia beside her, all looking up. Small silver moths circle around the tangled rope.", ["gustaw", "oliwia", "mare", "finches"]),
    ("ask-elders", "Grandmother Janina stands at the left; she has lifted her one walking stick off the ground and points it up at the big branch that bends toward the shutter, her other hand holding her shawl; Oliwia and Gustaw beside her look up where she points.", ["gustaw", "oliwia", "janina", "finches"]),
]:
    page(f"mh-p3-{var}", "full", "evening", who, ["tower", "pear"], ["rope-tree"],
         "CAMERA: behind the tower, in the orchard, low, looking up: the back (north) face of the tower at the right with the green-grey shutter open high up, the old pear tree at the left and centre, its big branch reaching to the shutter. Portrait framing: the people at the bottom, the branch with the rope and nest in the upper middle.",
         f"SCENE (page 3, \"The Rope in the Pear Tree\", variant {var}): the bell rope has slipped out of the open shutter and is tangled in loops high in the big branch of the pear tree, pear leaves caught in it; a hand's width from it, in the fork, the small finch nest with the mother finch and three chicks asleep. {desc} Golden evening light through the leaves.",
         "\"Behind the tower, the bell rope had slipped out through an open shutter and tangled itself high in the branches of the old pear tree. Right beside it, finches slept in a nest. One hard tug, and the little nest could fall.\"",
         "one rope; one nest with one mother finch and three chicks; the people named above; no other people.",
         "no text; no ladder yet; nobody pulling the rope.")
P = m.PAGES["mh-p3-ask-elders"]
P["text"] += composition("Grandmother Janina holds ONE single walking stick — the stick she walks with — lifted in her right hand and pointing up at the branch; her left hand holds her shawl. There is no second stick, and her stick is one straight unbroken piece of wood from her hand to its tip.")
P["counts"] += " Grandmother Janina has exactly one walking stick."
P["negatives"] = "no text; no ladder yet; nobody pulling the rope; no second stick; the stick never bends or splits into two pieces."
P["extra_refs"] = ["mh-p3-ask-elders-composition.png"]

page("mh-p4", "plate", "dusk", ["carpenter", "baker", "oliwia", "mare", "finches"], ["tower", "pear"], ["rope-tree"],
     "CAMERA: in the orchard at the foot of the pear tree, at standing height, the tower's back face at the right edge.",
     "SCENE (page 4, \"Quiet by the Nest\"): the carpenter, on tiptoe, very carefully leans a light ash ladder against the pear tree's trunk without a sound; the baker kneels and wraps the bottom rung in a cloth; Oliwia stands with her hands pressed to her chest, looking up at the fluffy nest high in the fork beside the tangled rope; Koniczynka stands perfectly still behind them, even her tail still. A lantern on the grass. Everyone moves as quietly as they can.",
     "\"The carpenter brought an ash ladder and set it down so softly that not even the stones by the wall heard a thing. The baker wrapped the bottom rung in cloth, Oliwia kept her eyes on the fluffy nest, and Koniczynka stood perfectly still.\"",
     "carpenter, baker, Oliwia, the mare; one ladder; one nest; one rope.",
     "no text; nobody on the ladder yet.")

# p5 (user, 2026-10-21): full portraits — nothing sits under the picture, so the right page is a 2:3 portrait
# (the earlier transparent vignettes broke the page rule, as they once did in the dragon tale).
P5_CAMERA = ("CAMERA: in the orchard behind the tower, low at the foot of the ladder, looking up. Portrait framing: the people at the foot of the ladder at the bottom, "
             "the ash ladder rising through the picture against the old pear tree's trunk, the carpenter near its top, and at the top the big branch reaching toward the open green-grey shutter "
             "on the tower's back (north) face at the right edge; the finch nest in the fork of that branch a hand's width from the rope. A lantern on the grass. Late dusk sky between the leaves.")

page("mh-p5-move-slowly", "full", "dusk", ["carpenter", "oliwia", "finches"], ["tower", "pear"], ["rope-tree"],
     P5_CAMERA,
     "SCENE (page 5, \"A Free Rope, a Hoarse Bell\", variant move-slowly): the carpenter at the top of the ladder untangles the last loop of the bell rope from the pear branch with slow, careful fingers; a hand's width away the mother finch sleeps on her three chicks in the nest. At the foot of the ladder Oliwia looks up, holding her breath, and one pear leaf drifts down onto her sleeve. A few pear leaves and small green-gold pears on the branch.",
     "\"Loop by loop, the rope came loose, and every hand moved as slowly as dust drifting in lantern light. A pear leaf drifted down onto Oliwia's sleeve.\"" + composition("the carpenter on the ladder is drawn whole: both legs in dark hose and both brown boots clearly visible, one foot on a higher rung and one on a lower rung, both legs in front of the ladder rails and clearly outlined against the bark, so that no part of him blends into the trunk."),
     "carpenter (two legs, two boots, both on rungs), Oliwia; one ladder; one rope; one nest with one mother finch and three chicks.",
     "no text; nobody pulling the rope; no cypresses; no limb hidden in or merging with the tree.",
     ["mh-p5-move-slowly-composition.png"])

page("mh-p5-lullaby", "full", "dusk", ["carpenter", "gustaw", "oliwia", "finches"], ["tower", "pear"], ["rope-tree"],
     P5_CAMERA,
     "SCENE (page 5, \"A Free Rope, a Hoarse Bell\", variant lullaby): at the foot of the ladder Oliwia and Gustaw hum a lullaby very softly, faces turned up to the nest, mouths gently open, eyes kind; their soft tune rises from them toward the nest as " + MELODY + ". The carpenter at the top of the ladder loosens the last loop of the bell rope from the pear branch in time with the tune. A hand's width away, in the fork, the mother finch sleeps on her three chicks; the smallest chick, eyes closed, has its tiny beak open as if humming in its sleep. A pear leaf rests on Oliwia's sleeve.",
     "\"Oliwia and Gustaw began to hum a lullaby very softly, and the carpenter loosened the rope loop by loop in time with it. The finches slept on, and the smallest one moved its beak as if humming in its sleep.\"" + composition("the gold line rising from Oliwia is gone; the tune is now the scatter of tiny gold notes and sparkles described above, so the bell rope is the only rope-like thing in the picture."),
     "Gustaw, Oliwia, carpenter; one ladder; one rope; one nest with one mother finch and three chicks; about eight tiny gold notes, no ribbon. THE TOWER at the right edge is the same tower as in the attached TOWER REFERENCE (ignore the rope and the man in that crop), seen from behind: only its upper stone part and its single timber-framed belfry with the open green-grey shutter show, the roof cut off by the top edge of the picture.",
     "no text, no letters; no gold ribbon, line or thread; nobody pulling the rope; no cypresses; the tower has ONE belfry, only at the top, and ONE roof, only at the very top — never a second belfry, roof or bell lower down the tower.",
     ["mh-tower-p9.png", "mh-p5-lullaby-composition.png"])

page("mh-p6", "plate", "deepdusk", ["carpenter", "oliwia", "janina", "gustaw"], ["belfry"], ["crack"],
     "CAMERA: inside the belfry, close to the bell, at the height of its rim. Landscape framing with everything important in the middle four-fifths of the width: the bell large in the centre, the people close round it on both sides, faces lit from below by the lantern.",
     "SCENE (page 6, \"The Crack in the Bell\"): Oliwia holds a lantern very close to the bell's rim, and in its light a crack as thin as a hair shows on the rim (on the side toward the east window). The carpenter touches the bell beside the crack with two fingers and nods calmly, kindly. On the other side Grandmother Janina strokes the bronze with her palm, remembering, a faint wistful smile. Gustaw kneels behind them, watching. Through an arched window behind, the thin crescent moon.",
     "\"Inside the tower, along the rim of the bronze bell, ran a crack as thin as a hair. The carpenter touched the bell with two fingers and nodded. Grandmother Janina stroked the bronze. 'This bell had a name once.'\"",
     "Oliwia, carpenter, Grandmother Janina, Gustaw; one bell; one lantern; one moon.",
     "no text, no letters or inscription on the bell; no fire; the crack is small, the bell is not broken in pieces; trees outside the windows are in summer leaf, no blossom; no cypresses.")

page("mh-p7-invite-smith", "plate", "deepdusk", ["smith", "carpenter", "baker", "oliwia"], ["belfry"], ["rivets"],
     "CAMERA: inside the belfry, a little above, the group in a circle around the bell.",
     "SCENE (page 7, \"The Village Mends the Bell\", variant invite-smith): by candlelight and moonlight, the blacksmith kneels at the bell's rim and taps the last of three small shining rivets into place across the crack with her little hammer; the carpenter holds the oak beam steady; the baker passes a basket of oat rolls; Oliwia polishes the bell with a linen cloth, and the lantern light gleams inside it. Candles on the floor planks, the moon in an arched window.",
     "\"By candlelight and moonlight, the blacksmith worked in the circle with a little hammer and shiny rivets. The carpenter held the beam steady, and the baker passed oat rolls from hand to hand.\"",
     "blacksmith, carpenter, baker, Oliwia; one bell; exactly three rivets.",
     "no text; no fire or forge flames.")

page("mh-p7-thank-bell", "plate", "deepdusk", ["gustaw", "carpenter", "baker", "oliwia", "janina"], ["belfry"], [],
     "CAMERA: inside the belfry, eye level, a little further back than a close group shot, so the bell, the oak beam (yoke) it hangs from and the two iron straps that hold it are all clearly visible, with the group gathered CLOSE around the bell. COMPOSITION: all five people stand within the middle three quarters of the width — Grandmother Janina just left of the bell (her face and her pointing hand well inside the picture, never at the edge), the baker just right of the carpenter (his whole basket inside the picture); the outer eighth of the canvas on each side holds only walls, windows and candles.",
     "SCENE (page 7, \"A Night in the Belfry\", variant thank-bell — the bell's name and its old rhyme remembered, 2026-10-31): Grandmother Janina has remembered the rhyme that says a hoarse bell must be turned toward the mountains. Gustaw and the carpenter, one on each side of the bell, have loosened the two iron straps on the oak beam and are turning the whole bell a quarter round on its beam, slowly and carefully, both with their hands flat on the bronze — a calm, practical effort, not a struggle. Grandmother Janina stands close with her walking stick, one hand raised toward the arched window that shows the far mountains (north-west), as if saying 'that way', smiling. Oliwia holds up the lantern so they can see the hair-thin crack on the rim, which is now turning away from us to the side. The baker stands by the ladder hatch holding a basket of oat rolls covered with a cloth. Candles on the floor planks, the thin crescent moon in an arched window.",
     "\"Gustaw and the carpenter loosened the fittings and turned Evensong toward the mountains. The baker brought warm oat rolls with honey for the long night's work.\"",
     "Gustaw, the carpenter, the baker, Grandmother Janina, Oliwia: exactly five people; one bell; one oak beam; NO rivets on the bell; one short hair-thin crack only.",
     "no text; no letters or inscription on the bell; no rivets; no fire or forge; no tools striking the bell; the blacksmith is not here; nobody at the left or right edge; through the windows only far mountains, dark hills, round-crowned trees and the night sky — no village, no church, no tower or spire, no pointed trees.")

page("mh-p8", "plate", "deepdusk", ["oliwia", "gustaw", "mare", "villagers"], ["square", "tower"], ["rivets"],
     "CAMERA: low in the square, behind the children, looking up at the tower. Landscape framing with everything important in the middle four-fifths of the width: the children's heads and shoulders in the foreground, the tower in the centre rising to near the top edge, the moon beside it, the top of the pear tree at the right of centre. The attached TOWER REFERENCE (a crop of an approved page of this book) shows exactly how this tower looks: SQUARE in plan with flat stone faces and sharp corners, a square timber-framed belfry with round-arched openings, a red-tiled pyramid roof and the crescent weathervane — match it closely (ignore the rope and the man in that crop).",
     "SCENE (page 8, \"Welcoming the New Voice\"): the thin crescent moon peeps out from behind a small cloud beside the bell tower; through the belfry arch the mended bell is visible, still silent. In the square the children hold their breath, Oliwia among them; behind, Gustaw with Koniczynka and the families with lanterns all wait and listen. On the right, the top of the pear tree with the finches stirring in their nest.",
     "\"The moon peeped out from the clouds above the tower. The finches stirred in the orchard, and the children in the square held their breath. The whole village was listening and waiting.\"",
     "Oliwia, Gustaw, the mare, a few villagers and children; one square tower; one moon; in the pear tree one nest with exactly one mother finch and three chicks, no other birds.",
     "no text; no ringing yet; no round or octagonal tower; no cypresses.",
     ["mh-tower-p9.png"])

for var, desc in [
    ("ring-gently", "the tower's iron-studded door stands open, and just inside it, in the warm lantern-lit doorway, the baker gently pulls the bell rope, which hangs straight down INSIDE the tower from the belfry (never outside along the wall); the bell's soft voice is shown only as two or three faint, wide, soft waves of warm golden air rolling gently out of the belfry arches over the roofs and thinning away — never rings, arcs, crescents or moon shapes. The villagers listen with quiet smiles; Koniczynka, very proud, has a white smudge of flour on her nose."),
    ("share-song", "the villagers hum together with the bell, faces lifted, mouths softly open, eyes smiling; the bell's note and their voices are drawn as " + MELODY + ", drifting from the belfry arches down among the villagers and rising from them, mingling in the air. Koniczynka stands among them; in the pear tree beside the tower, in a small nest, one little finch has lifted its head and listens."),
]:
    page(f"mh-p9-{var}", "plate", "night", ["gustaw", "oliwia", "mare", "baker", "smith", "carpenter", "villagers"], ["square", "tower"], ["rivets", "moon"],
         "CAMERA: the default view, a visual rhyme with page 1 — in the square, south of the tower, looking north; wider and a little higher than page 1.",
         f"SCENE (page 9, \"The Bell Sounds Different\", variant {var}): night, the thin crescent moon high above the tower. The whole village is gathered in the square around the well — parents, children, elders, the baker, the blacksmith, the carpenter, Gustaw, Oliwia and Koniczynka — and {desc} Warm lantern light in the windows.",
         "\"The bell rang more softly than before, but its voice was clear and sweet. It did not reach across the whole valley, yet it filled the village from window to window.\"",
         "the named people plus a few families; one tower; one moon; one mare.",
         "no text, no musical-note symbols, no letters; no fireworks; no black sky; exactly ONE crescent moon in the sky, no other crescent or moon shapes anywhere; no rope hanging outside the tower; no round or octagonal tower; no cypresses.")
P = m.PAGES["mh-p9-share-song"]
P["text"] += (" COMPOSITION: the attached COMPOSITION REFERENCE is the approved version of THIS picture — keep it exactly (camera, square, houses, well, pear tree with the listening finch, every person and pose, the tiny gold notes, the moon, light and colours). "
              "Correct only the tower, to match the location sheet: (1) THE BELL ROPE IS NEVER SEEN ON THE OUTSIDE OF THE TOWER — it hangs inside the tower and shows only within the lit open doorway, where the baker gently pulls it; the stone face between the belfry and the door is plain stone with no rope, line or cord on it. "
              "(2) The belfry is the tale's timber-framed belfry: dark timber frame with cream plaster, FOUR open round-arched windows with the bronze bell in them, a steep red-tiled pyramid roof topped by a small iron crescent-moon weathervane. (This overrides the rule below about not copying compositions.)")
P["counts"] += " About ten tiny gold notes; one nest with one finch awake and listening; the bell rope visible only inside the doorway."
P["negatives"] = "no text, no letters; no gold ribbon, line, thread or wave; no fireworks; no black sky; exactly ONE crescent moon in the sky, no other crescent or moon shapes anywhere except the small weathervane; no rope, cord or line on the outside of the tower; no round or octagonal tower; no cypresses, poplars or any tall narrow trees; no pole or post above the well."
P["extra_refs"] = ["mh-p9-share-song-composition.png"]

# 2026-10-25 continuity review: regenerate from the approved picture (prototypes/refs/<pid>-composition.png) with one change
def fix(pid, rev, keep, change, counts="", neg=""):
    P = m.PAGES[pid]
    P["text"] = P["text"].split(" COMPOSITION:")[0]  # one approved picture at a time: drop an earlier correction
    P["text"] += (f" COMPOSITION: the attached COMPOSITION REFERENCE is the approved version of THIS picture — keep it exactly ({keep}); "
                  f"the only change: {change} (This overrides the rule below about not copying compositions.)")
    P["counts"] += (" " + counts) if counts else ""
    P["negatives"] += ("; " + neg) if neg else ""
    P["extra_refs"] = list(dict.fromkeys(list(P["extra_refs"]) + [f"{pid}-composition.png"]))
    m.REVISION[pid] = rev


fix("mh-p2", "mh-p2c", "camera, the tower foot with its arched door at the left, the reeve with the key, the baker, Oliwia, the two children pointing, the mare, the well, the houses, the pear trees, the light and colours",
    "there is NO second bell tower in the background — the stone wall with the arched door at the left IS the bell tower, the only one; where the background tower stood, show tiled and thatched roofs, round-crowned trees and evening sky. All background trees are round-crowned oaks, limes and pear trees, never narrow pointed ones. The mare Koniczynka at the right edge turns her head to gaze up the orchard path between the pear trees, the way the children point.",
    counts="Exactly one bell tower: the one at the left edge.",
    neg="no second tower, belfry or bell anywhere in the background; no pointed or columnar trees")
fix("mh-p3-follow-clover", "mh-p3-follow-cloverb", "camera, the pear tree and branch, the tangled rope, the bell tower and belfry, Gustaw with Koniczynka, Oliwia, the light and colours",
    "the distant valley shows only low green hills with round-crowned oaks and limes and a few thatched roofs — no cypresses, no pointed trees, no villa; and the nest holds exactly three chicks beside the mother finch.",
    counts="Exactly three chicks in the nest.",
    neg="no cypresses, poplars or pointed trees; no villa; no Italian or Tuscan landscape")

NO_SHUTTER = "the right-hand (east) face of the tower is plain stone with no shutter — the one green-grey shutter is on the back (north) face, high at the belfry, out of sight from here or only just at its edge."
fix("mh-p1", "mh-p1d", "camera, the square, the families with lanterns, Gustaw, Oliwia, Koniczynka, the tower and belfry, the houses, the light and colours",
    "(1) " + NO_SHUTTER + " (2) the narrow pointed tree on the far hill becomes a round-crowned oak.", neg="no shutter low on the stone shaft; no pointed trees")
fix("mh-p8", "mh-p8d", "camera, the square, every person and pose, Koniczynka, the tower and belfry with the mended bell, the houses, the light and colours",
    NO_SHUTTER, neg="no shutter on the stone shaft")
fix("mh-p4", "mh-p4b", "camera, the pear tree, the rope, the tower, every person and animal and their poses, the light and colours",
    "the narrow pointed trees in the valley become round-crowned oaks and limes.", neg="no cypresses, firs, poplars or pointed trees")
fix("mh-p7-invite-smith", "mh-p7-invite-smithb", "camera, the belfry interior, the smith and every person and pose, the bell, the tools, the light and colours",
    "(1) the crack in the bell is a SHORT, hair-thin line on the lower rim only, with the three small rivets set across it — not a long jagged crack across the bell's waist; (2) the windows show only tiled roofs, round-crowned trees and dusk sky — no firs or pointed trees and no other tower.",
    neg="no long crack; no second tower; no pointed trees")
fix("mh-p5-lullaby", "mh-p5-lullabye", "camera, the pear tree, the ladder, the carpenter, Gustaw, Oliwia, the nest, the rope, the tower, the lantern",
    "(1) the sky is a muted slate-blue late dusk, not a saturated daytime blue; (2) the nest holds exactly three chicks beside the mother finch; (3) the carpenter stands on the ladder with BOTH boots visible, on two rungs; (4) the tune is " + MELODY + "; (5) the distant valley shows only roofs and round trees, no church or tower.",
    counts="Exactly three chicks.", neg="no modern quavers or beamed notes; no distant towers or spires")
fix("mh-p5-move-slowly", "mh-p5-move-slowlyd", "camera, the pear tree, the ladder, the carpenter and his pose, Oliwia, the lantern, the nest, the tower, the light and colours",
    "the rope from the shutter runs straight to the carpenter's raised hands, clearly in front of him and well clear of his head, neck and hair, so it can never read as a loop round his neck.",
    neg="the rope never passes behind or around his head or neck")
fix("mh-p9-ring-gently", "mh-p9-ring-gentlyd", "camera, the square, the open door with the baker and the rope inside, every villager and pose, Koniczynka, the soft waves of sound, the moon, the light and colours",
    "(1) the four belfry openings are semicircular ROUND arches, as on the location sheet, never pointed Gothic arches; (2) Koniczynka has a small white smudge of flour on her nose.",
    neg="no pointed arches")
fix("mh-p6", "mh-p6d", "camera, the belfry, the bell with its crack, the carpenter, Oliwia, Janina, Gustaw and their poses, the light and colours",
    "the carpenter touches the bell's rim with TWO fingers, not one.")

fix("mh-p5-move-slowly", "mh-p5-move-slowlye", "camera, the pear tree, the ladder, the carpenter's head, arms, hands and the rope, Oliwia, the lantern, the nest, the tower, the light and colours",
    "the carpenter's legs (user, 2026-10-25: the upper leg read as the wrong leg). He stands on the ladder facing it and the tree, seen from his left side: his LEFT leg — the one nearer to us — is on the higher rung, knee bent forward toward the ladder, its boot seen from the side with the toe pointing into the rung; his RIGHT leg is straight on a lower rung, a little behind the left one and partly hidden by it, its boot also pointing into the ladder. Both legs are natural and clearly belong to the same body; they never cross, twist or swap sides.",
    neg="the legs never cross or look swapped; no backward knee")

# p10 (user, 2026-10-21): the closing emblem (colophon roundel), the pair of the title emblem — as in the dragon tale.
EMBLEM_REVISION = {"ring-gently": "mh-p10-ring-gentlyd", "share-song": "mh-p10-share-songd"}  # d: the tune as gold notes, not a ribbon (user, 2026-10-24)
EMBLEM_MOTIF = {
    "ring-gently": "the belfry of the Moonhill bell tower seen close — square, timber-framed, one round-arched opening, a steep red-tiled pyramid roof with the small iron crescent-moon weathervane — and in the arch the mended bronze bell, polished, gleaming softly in the moonlight; across the old crack on its rim sit exactly three small shining rivets, and on each rivet rests one small silver moth (pale silver-white wings with a fine gold-leaf edge), the three shimmering like three little stars; one more moth flutters in through the arch",
    "share-song": "the old pear branch with small green-gold pears and summer leaves, and in its fork the small cup nest of moss and grass where the mother chaffinch (rosy-brown breast, blue-grey cap) sits with her three fluffy chicks, who, half asleep, sing back a tune with tiny open beaks; the tune is " + MELODY + ", drifting down to the nest from the belfry and a few rising from the chicks' beaks, from the belfry of the bell tower (square, timber-framed, red-tiled roof, the bell in its arch with three small rivets) in the background",
}


def emblem(pid, variant):
    style = (m.HERE / "_style-orn.txt").read_text().strip()
    body = [
        "REFS: pentiment-margins-1.png, pentiment-margins-2.png, orn-title-moonhill-clean.png, m-sheet-moonhill.png, set-moonhill.png, tone-dragon-bridge-p4.png" + (", mh-p10-share-song-composition.png" if variant == "share-song" else ""),
        "SIZE: 1024x1024, square", "", style, "",
        "MOTIF: the closing emblem (the colophon) of the tale \"The Bell of Moonhill\" — the companion of the attached frontispiece emblem, which opens the tale: the same kind of precious illuminated roundel, the same double ring of burnished gold leaf with a fine punched-dot border, the same deep muted blue night ground scattered with tiny four-pointed gold stars, the same lively ink-vine margin growing out of it on all sides — but now as an ending: "
        f"inside the roundel, {EMBLEM_MOTIF[variant]}. A thin silver crescent moon in the upper part of the roundel — never a full moon. Around the roundel: delicate ink vines of pear branches with small green-gold pears and summer leaves (no blossom), two or three pale moths, a few cornflowers, gold-leaf dots and curls, and at the bottom centre a small gold-leaf fleuron like the final flourish of a manuscript. Calm, warm, enchanting — the feeling of a tale ending well, a quiet goodnight.",
        "", "COUNTS: " + ("one bell; exactly three rivets with one moth on each, plus one moth in flight inside the roundel." if variant == "ring-gently" else "one nest; one mother finch and exactly three chicks; about eight tiny gold notes; one tower."),
        "NEGATIVES: absolutely no text, letters, numbers or runes, " + ("no musical-note symbols" if variant == "ring-gently" else "no gold ribbon, line or thread") + "; no frame other than the gold roundel; no background outside the motif; no people; no cypresses or pointed trees; no blossom.",
        "", "REFERENCE ROLES: the frontispiece emblem defines the format, the gold ring, the blue starry ground and the margin vines — this emblem must look like its pair from the same book, but with a different scene inside. The Pentiment margin pages define the line and lightness of the vines. The location sheet defines the tower and belfry; the character sheet defines the finches. Never copy a composition from a reference.",
    ] + (["", "COMPOSITION: the attached COMPOSITION REFERENCE is the approved version of THIS emblem — keep it exactly (the roundel, the branch, the nest, the finches, the tower, the moon, the margin vines and colours); the only change: the gold ribbon is gone and the tune is the scatter of tiny gold notes described above. (This overrides the rule above about not copying compositions.)"] if variant == "share-song" else [])
    (m.HERE / f"{pid}.txt").write_text("\n".join(body) + "\n")


if __name__ == "__main__":
    for pid, p in m.PAGES.items():
        m.build(m.REVISION.get(pid, pid), p)
        print(pid, p["layout"], p["time"])
    for variant, pid in EMBLEM_REVISION.items():
        emblem(pid, variant)
        print(pid, "emblem")
