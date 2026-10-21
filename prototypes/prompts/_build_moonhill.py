#!/usr/bin/env python3
"""Scene prompts for "The Bell of Moonhill" — same assembly as _build_a2.py, this tale's canon.
Sources: docs/pilot/SET_BIBLE_moonhill-bell.md. Run from this folder: python3 _build_moonhill.py
"""
import _build_a2 as m

m.PAGES.clear()
m.REVISION.clear()
m.REVISION.update({k: k + "b" for k in ["mh-p2", "mh-p9-ring-gently", "mh-p9-share-song", "mh-p10-ring-gently", "mh-p10-share-song"]})  # continuity fails: moon phase, cypresses
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
m.TIME["deepdusk"] = "TIME (colour script): night by candle and lantern light; muted slate-blue night outside the windows with a few gold-dot stars and the moon; warm light only from candles and lanterns; figures keep their full colours."
page = m.page

page("mh-p1", "full", "evening", ["gustaw", "oliwia", "mare", "villagers"], ["square", "tower"], [],
     "CAMERA: the default view — in the square, south of the tower, looking north at the tower's front. Portrait framing: Gustaw, Oliwia and the mare large in the lower foreground, the square with the well and the gathered families in the middle, the tower rising at the top.",
     "SCENE (page 1, \"When the Bell Did Not Call\"): evening; blue smoke curls from the chimneys. Families stand in the square in wool shawls with small horn lanterns, all looking up at the silent bell tower and listening. In the foreground, Gustaw with his hand on his shield and Oliwia beside him look up too — but Koniczynka the mare turns her head and stretches her nose to the right, toward the path that runs round the east side of the tower to the orchard, where a few small silver moths glimmer like silver leaves. Oliwia has noticed and glances at the mare.",
     "\"That evening, the bell tower was silent. Families came out into the square in woollen shawls, with horn lanterns in their hands, and everyone looked up and listened. Oliwia noticed that Koniczynka was stretching her nose toward the path to the old orchard, where moths glimmered like silver leaves.\"",
     "Gustaw, Oliwia, one mare, a few families (small); one tower; no bell rope hanging in the square.",
     "no text; no ringing; no sound lines; no castle; no cypresses.")

page("mh-p2", "plate", "evening", ["oliwia", "reeve", "baker", "mare"], ["square", "tower"], [],
     "CAMERA: close, at Oliwia's eye level, in the square near the tower door; the tower's foot and door at the left, houses behind.",
     "SCENE (page 2, \"Two Ways Into the Mystery\"): Oliwia stands in the middle listening carefully, a little worried, hands together. On the left the reeve holds up the big iron key to the tower and looks at it, thinking. Beside him the baker shades his eyes and looks up at the belfry where the rope should hang. On the right, two village children point toward the orchard path, and Koniczynka's head and neck reach in from the right edge, gazing the same way, between the pear trees beyond.",
     "\"The reeve thought of the key to the tower. The baker looked at the bell rope. And the children looked toward the orchard, because Koniczynka kept gazing between the pear trees. Oliwia felt a little knot in her tummy, but she listened to everyone in turn.\"",
     "Oliwia, reeve, baker, two children, the mare's head; no Gustaw in frame.",
     "no text; no rope visible; no ringing; Central European trees only — no cypresses or poplars.")

for var, desc, who in [
    ("follow-clover", "Koniczynka has led everyone round the tower: the mare stands at the left, her nose pointing up at the tree, Gustaw holding her bridle and Oliwia beside her, all looking up. Small silver moths circle around the tangled rope.", ["gustaw", "oliwia", "mare", "finches"]),
    ("ask-elders", "Grandmother Janina stands at the left, leaning on her stick and pointing it up at the big branch that bends toward the shutter; Oliwia and Gustaw beside her look up where she points.", ["gustaw", "oliwia", "janina", "finches"]),
]:
    page(f"mh-p3-{var}", "full", "evening", who, ["tower", "pear"], ["rope-tree"],
         "CAMERA: behind the tower, in the orchard, low, looking up: the back (north) face of the tower at the right with the green-grey shutter open high up, the old pear tree at the left and centre, its big branch reaching to the shutter. Portrait framing: the people at the bottom, the branch with the rope and nest in the upper middle.",
         f"SCENE (page 3, \"The Rope in the Pear Tree\", variant {var}): the bell rope has slipped out of the open shutter and is tangled in loops high in the big branch of the pear tree, pear leaves caught in it; a hand's width from it, in the fork, the small finch nest with the mother finch and three chicks asleep. {desc} Golden evening light through the leaves.",
         "\"Behind the tower, the bell rope had slipped out through an open shutter and tangled itself high in the branches of the old pear tree. Right beside it, finches slept in a nest. One hard tug, and the little nest could fall.\"",
         "one rope; one nest with one mother finch and three chicks; the people named above; no other people.",
         "no text; no ladder yet; nobody pulling the rope.")

page("mh-p4", "plate", "dusk", ["carpenter", "baker", "oliwia", "mare", "finches"], ["tower", "pear"], ["rope-tree"],
     "CAMERA: in the orchard at the foot of the pear tree, at standing height, the tower's back face at the right edge.",
     "SCENE (page 4, \"Quiet by the Nest\"): the carpenter, on tiptoe, very carefully leans a light ash ladder against the pear tree's trunk without a sound; the baker kneels and wraps the bottom rung in a cloth; Oliwia stands with her hands pressed to her chest, looking up at the fluffy nest high in the fork beside the tangled rope; Koniczynka stands perfectly still behind them, even her tail still. A lantern on the grass. Everyone moves as quietly as they can.",
     "\"The carpenter brought an ash ladder and set it down so softly that not even the stones by the wall heard a thing. The baker wrapped the bottom rung in cloth, Oliwia kept her eyes on the fluffy nest, and Koniczynka stood perfectly still.\"",
     "carpenter, baker, Oliwia, the mare; one ladder; one nest; one rope.",
     "no text; nobody on the ladder yet.")

page("mh-p5-move-slowly", "vignette", "dusk", ["carpenter", "oliwia", "finches"], [], [],
     "CAMERA: close, eye level with the top of the ladder; the group composed as one compact silhouette: the top of the ladder against a piece of the pear branch, Oliwia below.",
     "SCENE (page 5, \"The Freed Rope\", variant move-slowly): the carpenter at the top of the ladder untangles the last loop of the bell rope from the pear branch with slow, careful fingers; a hand's width away the mother finch sleeps on her three chicks in the nest. At the foot of the ladder Oliwia looks up, and one pear leaf drifts down onto her sleeve. A few pear leaves and one small pear on the branch.",
     "\"Loop by loop, the rope came loose, and every hand moved as slowly as dust drifting in lantern light. A pear leaf drifted down onto Oliwia's sleeve.\"",
     "carpenter, Oliwia, one nest with one mother finch and three chicks, one ladder, one rope.",
     "no text; no background or sky; no frame.")

page("mh-p5-steady-ladder", "vignette", "dusk", ["carpenter", "gustaw", "baker", "oliwia", "finches"], [], [],
     "CAMERA: from the side, the whole ladder; the group composed as one tall compact silhouette with a piece of the pear branch at the top.",
     "SCENE (page 5, \"The Freed Rope\", variant steady-ladder): Gustaw and the baker hold the foot of the ladder firmly with both hands; the carpenter at the top lowers the freed bell rope with both hands without touching the branch; the nest with the sleeping mother finch and chicks sits untouched in the fork. Oliwia stands beside the ladder, a pear leaf on her sleeve.",
     "\"The ladder stood firm under the carpenter's boots, so he reached the knot without brushing a single branch. When the last knot slipped free, the carpenter lowered the rope with both hands.\"",
     "Gustaw, baker, carpenter, Oliwia; one ladder; one rope; one nest.",
     "no text; no background or sky; no frame.")

page("mh-p6", "full", "deepdusk", ["carpenter", "oliwia", "gustaw"], ["belfry"], ["crack"],
     "CAMERA: inside the belfry, close to the bell, at the height of its rim. Portrait framing: the bell large, filling the upper half; faces lit from below by the lantern.",
     "SCENE (page 6, \"The Crack in the Bell\"): Oliwia holds a lantern very close to the bell's rim, and in its light a crack as thin as a hair shows on the rim. The carpenter touches the bell beside the crack with two fingers and nods calmly, kindly. Gustaw kneels behind them, watching. Through an arched window behind, a rising moon.",
     "\"Inside the tower, along the rim of the bronze bell, ran a crack as thin as a hair. They only saw it when they brought the lantern very close. The carpenter touched the bell with two fingers and nodded.\"",
     "Oliwia, carpenter, Gustaw; one bell; one lantern.",
     "no text; no fire; the crack is small, the bell is not broken in pieces.")

page("mh-p7-invite-smith", "plate", "deepdusk", ["smith", "carpenter", "baker", "oliwia"], ["belfry"], ["rivets"],
     "CAMERA: inside the belfry, a little above, the group in a circle around the bell.",
     "SCENE (page 7, \"The Village Mends the Bell\", variant invite-smith): by candlelight and moonlight, the blacksmith kneels at the bell's rim and taps the last of three small shining rivets into place across the crack with her little hammer; the carpenter holds the oak beam steady; the baker passes a basket of oat rolls; Oliwia polishes the bell with a linen cloth, and the lantern light gleams inside it. Candles on the floor planks, the moon in an arched window.",
     "\"By candlelight and moonlight, the blacksmith worked in the circle with a little hammer and shiny rivets. The carpenter held the beam steady, and the baker passed oat rolls from hand to hand.\"",
     "blacksmith, carpenter, baker, Oliwia; one bell; exactly three rivets.",
     "no text; no fire or forge flames.")

page("mh-p7-thank-bell", "plate", "deepdusk", ["smith", "carpenter", "baker", "oliwia", "janina"], ["belfry"], ["rivets"],
     "CAMERA: inside the belfry, eye level, the group in a circle around the bell.",
     "SCENE (page 7, \"The Village Mends the Bell\", variant thank-bell): by candlelight and moonlight, the villagers — Grandmother Janina, the baker, the carpenter, the blacksmith and Oliwia — gently lay their hands on the bell, eyes half closed, smiling, thanking it for all the evenings it called them home. Oliwia holds a linen cloth. On the rim, the three small rivets already shine across the old crack.",
     "\"By candlelight and moonlight, the villagers first laid their hands on the bell and thanked it for every evening it had called them home.\"",
     "five people; one bell; exactly three rivets.",
     "no text; no fire.")

page("mh-p8", "full", "deepdusk", ["oliwia", "gustaw", "mare", "villagers"], ["square", "tower"], ["rivets"],
     "CAMERA: low in the square, behind the children, looking up at the tower. Portrait framing: the children's heads and shoulders in the foreground, the tower rising to the top of the frame, the moon above it.",
     "SCENE (page 8, \"Welcoming the New Voice\"): the moon rises above the bell tower; through the belfry arch the mended bell is visible, still silent. In the square the children hold their breath, Oliwia among them; behind, Gustaw with Koniczynka and the families with lanterns all wait and listen. On the right, the top of the pear tree with the finches stirring in their nest.",
     "\"The moon rose above the tower. The finches stirred in the orchard, and the children in the square held their breath. The whole village was listening and waiting.\"",
     "Oliwia, Gustaw, the mare, a few villagers and children; one tower; one moon.",
     "no text; no ringing yet.")

for var, desc in [
    ("ring-gently", "the baker gently pulls the rope at the tower door; the bell's soft voice is shown only as three or four thin, flat gold-leaf rings drifting from the belfry over the roofs. The villagers listen with quiet smiles; Koniczynka, very proud, has a white smudge of flour on her nose."),
    ("share-song", "the villagers hum together with the bell, faces lifted, mouths softly open; a single flat gold-leaf ribbon of melody winds from the belfry down among them. Koniczynka stands among them; in the pear tree the finches sleep calmly."),
]:
    page(f"mh-p9-{var}", "plate", "night", ["gustaw", "oliwia", "mare", "baker", "smith", "carpenter", "villagers"], ["square", "tower"], ["rivets", "moon"],
         "CAMERA: the default view, a visual rhyme with page 1 — in the square, south of the tower, looking north; wider and a little higher than page 1.",
         f"SCENE (page 9, \"The Bell Sounds Different\", variant {var}): night, the thin crescent moon high above the tower. The whole village is gathered in the square around the well — parents, children, elders, the baker, the blacksmith, the carpenter, Gustaw, Oliwia and Koniczynka — and {desc} Warm lantern light in the windows.",
         "\"The bell rang more softly than before, but its voice was clear and sweet. It did not reach across the whole valley, yet it filled the village from window to window.\"",
         "the named people plus a few families; one tower; one moon; one mare.",
         "no text, no musical-note symbols, no letters; no fireworks; no black sky.")

page("mh-p10-ring-gently", "vignette", "night", [], ["tower"], ["rivets", "moon"],
     "CAMERA: a compact silhouette: the top of the bell tower — the belfry and its red-tiled roof with the crescent-moon weathervane — with a thin crescent moon behind it.",
     "SCENE (page 10, \"A Goodnight Song\", variant ring-gently): long after supper, the mended bell rests in the belfry, its three small rivets glimmering in the moonlight, and one small clear silver-gold ring of sound still seems to linger by its rim. Quiet, sleepy.",
     "\"Long after supper, the bell kept watch in the tower above the village, and one clear silver note still seemed to linger by its mended rim.\"",
     "one tower top, one bell, one moon.",
     "no text; no people; no background sky beyond a small moon disc; no frame.")

page("mh-p10-share-song", "vignette", "night", ["finches"], ["tower", "pear"], ["rivets", "moon"],
     "CAMERA: a compact silhouette: the top of the bell tower with the pear tree's branch beside it and a thin crescent moon behind.",
     "SCENE (page 10, \"A Goodnight Song\", variant share-song): the mended bell rests in the belfry; a thin flat gold-leaf ribbon of melody still floats beneath the moon; on the pear branch beside the tower the finches sleep in their nest.",
     "\"Long after supper, the bell kept watch in the tower above the village, and the tune the neighbours had hummed still seemed to float beneath the moon.\"",
     "one tower top, one bell, one nest, one moon.",
     "no text, no musical-note symbols; no people; no frame.")

if __name__ == "__main__":
    for pid, p in m.PAGES.items():
        m.build(m.REVISION.get(pid, pid), p)
        print(pid, p["layout"], p["time"])
