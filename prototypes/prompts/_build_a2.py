#!/usr/bin/env python3
"""Assemble the style-A v2 scene prompts for "The Dragon on the Old Bridge".

Each prompt = style block + character canon (only who is present) + set blocks
(only the parts of the place in view) + story state + camera + scene + counts.
Sources: docs/pilot/MANUSCRIPT_BIBLE.md (characters, shots) and
docs/pilot/SET_BIBLE_dragon-bridge.md (place, colour script, story state).
Run from this folder: python3 _build_a2.py
"""
from pathlib import Path

HERE = Path(__file__).parent
STYLE = (HERE / "_style-a2.txt").read_text().strip()
REFROLE = (HERE / "_ref-a2.txt").read_text().strip()
BASE_REFS = ["pentiment-stylesheet.png", "pentiment-farm.png", "tone-dragon-bridge-p3ask.png",  # p4 had a marshy background (user, 2026-10-20)
             "tone-dragon-bridge-p5.png", "set-dragon-bridge.png"]

C = {
    "dragon": "The dragon — copper-coloured (#c8742c) with lighter copper-orange belly plates (#e39a4f); about the size of a horse: lying down, its back reaches a grown man's waist and its head is longer than a man's torso. A rounded soft snout with small nostrils and a closed mouth with a gentle smile line; almond eyes with heavy upper lids and dark-brown irises; two long pale striped horns (#d8c08a) swept back and a second, shorter pale pair in front; a ridge of short copper spines down the neck; small wings always folded flat on its back; a long plain tail; four-toed paws with pale claws. A worried, kindly grandfather. Never teeth, flames, red eyes or spread wings.",
    "gustaw": "Sir Gustaw — a young knight of about twenty: chin-length wavy blond hair, no beard, long oval face. Grey mail shirt to mid-thigh over grey hose, grey knee plates, tall brown boots, a sword always sheathed in a brown scabbard at his left hip. Red cloak (#8a3a2c) clasped at the right shoulder with a round gold brooch. Red kite shield (#9b2f2a) with a golden rampant griffin.",
    "oliwia": "Oliwia — a girl of about nine, two heads shorter than Gustaw (her head reaches his chest): long wavy chestnut-brown hair past her waist with a thin braid around the crown, dark brows, oval face; ankle-length teal-green dress (#3f7d78) with narrow gold trim at neck, cuffs and hem; a brown leather satchel on a strap across her chest; brown ankle boots; small tan hands.",
    "mice": "The three river mice — always exactly three, real mice (no clothes, never standing like people), told apart by size and colour: Big — grey-brown (#8b7b66), upright ears, long tail; Middle — warm tawny brown (#a3805a), slimmer, a white tip to its tail; Smallest — pale sandy (#c9a97e), round as a hazelnut, oversized pink ears, stubby tail. Cream bellies, dark bead eyes, fine whiskers. Each is the height of a thumb.",
    "miller": "The miller — about fifty-five, dark beard streaked with grey, white head-cloth tied like a cap, brown knee-length tunic (#7a5a3c) under a cream apron dusted with flour, grey hose, brown shoes.",
    "baker": "The baker — a woman of about forty, round kind face, rosy cheeks, hair fully covered by a white kerchief, brick-red dress (#9b3b2e) with a cream apron over a slate-blue underskirt.",
    "basket": "The basket maker — about twenty-five, light-brown hair under a green cap (#4e6b4a), thin moustache, cream shirt with rolled sleeves under a laced red vest (#b24a35), teal trousers, brown boots.",
    "villagers2": "Two more villagers: an old woman in a grey wool shawl and a brown dress, and a boy of about ten in a brown hood and green tunic.",
}
SHEETS = {"dragon": "m-sheet-dragon.png", "gustaw": "m-sheet-heroes.png", "oliwia": "m-sheet-heroes.png",
          "mice": "m-sheet-mice.png", "miller": "m-sheet-helpers.png", "baker": "m-sheet-helpers.png",
          "basket": "m-sheet-helpers.png"}

SET = {
    "bridge": "SET — the old bridge (must match the attached location sheet exactly): a narrow humpbacked packhorse bridge of rough grey-olive stone with exactly ONE semicircular arch over a shallow clear brook with pebbles. The deck is cobbled. Low parapets on both sides, knee-high to the knight, built of rough blocks topped with broad flat mossy capstones with a few tiny white flowers. Trailing ivy on the downstream face left of the arch. At each end the parapets flare out into a low dry-stone wall along the bank. Reeds along both banks; an old oak at the west end. Central European countryside: oak, alder, willow, birch — never cypresses.",
    "nest": "SET — the nest: the loose stone is one capstone of the downstream parapet on the east half of the bridge (the third capstone east of the crown), slightly tilted, darker and thick with moss; along its inner edge (the deck side) runs one narrow mossy crack, two fingers wide — the mice's only door. Inside the parapet, under that capstone, is their nest.",
    "east": "SET — east bank: beyond the east end the road climbs a low rounded hill to a small village of whitewashed houses with steep thatched roofs and small square windows, one squat stone church tower with a short wooden spire, and at the top of the road the inn: two storeys, timber-framed, a blank hanging wooden sign, three small square windows on the upper floor. Upstream on the east bank a small watermill: stone ground floor, timber upper floor, thatched roof, wooden water wheel.",
    "cradlehome": "SET — the cradle's new home: the dry grass on the east bank just downstream (south) of the bridge, among the reeds at the foot of the low bank wall.",
}
STATE = {
    "pennant": "STATE: the red pennant (#b6392e) on a plain wooden staff stands planted at the east end of the bridge, on the upstream (north) side of the road where the mill path turns off.",
    "inn-lit": "STATE: the inn's three upper windows glow gold — painted as flat gold-leaf shapes.",
}
TIME = {
    "evening": "TIME (colour script): early evening; low sun from the west; pale cream sky at the horizon fading to pale grey-blue above, a few small soft clouds. Same tone as the tone references, a touch warmer.",
    "dusk": "TIME (colour script): cool dusk; pale grey-blue to muted slate sky, no sunset colours; slightly darker and cooler than the tone references; the lantern or the dragon's breath are the only warm accents. The air is clear: the far bank stays crisp and readable.",
    "deepdusk": "TIME (colour script): deep dusk; muted slate sky with the first few stars as tiny gold dots; darker and cool; the gold windows are the warm notes. Figures keep their full colours.",
    "night": "TIME (colour script): night; deep muted blue-grey sky (never black) with small gold-dot stars and, if any moon shows, only a thin crescent — never a full or round moon; the darkest page, cool; figures keep their full colours, softly lit.",
}
LAND = ("LANDSCAPE (same in every picture of this tale): the brook is shallow, clear and lively, running over round pebbles between firm grassy banks with clumps of reeds; "
        "beyond it gentle green meadows, single alders, willows and oaks, low rolling hills — the friendly countryside of the tone reference with the helpers walking onto the bridge. "
        "Never a marsh, swamp, bog, pond or still murky water; no fog banks or mist hiding the land; no dead trees, no cypresses or poplars; nothing gloomy.")
SIZES = {
    "full": "SIZE: 1024x1536, PORTRAIT (taller than wide). The picture fills the whole canvas edge to edge, no border.",
    # the book shows plates at 5:4: export_webp.py --plate <focus> keeps a 1280x1024 window of this canvas
    "plate": "SIZE: 1536x1024, landscape. The picture fills the whole canvas edge to edge, no border. "
             "SAFE AREA: the book shows only the central 1280x1024 part (5:4); about 128 px at the left and right edges are trimmed. "
             "Keep every figure, face, hand, prop and story detail named in this brief inside the central 5:4 area, "
             "never touching or crossing its side edges; fill the outer side strips only with scenery that may be lost (sky, foliage, stones, water, grass).",
    "vignette": "SIZE: 1024x1024, square, TRANSPARENT BACKGROUND (alpha channel, PNG). A spot illustration: the group is composed as one compact silhouette standing on a small irregular patch of ground that belongs to it; everything outside the silhouette is fully transparent — no sky, no background, no frame, no paper colour, no shadow on the empty area.",
}

PAGES = {}
REVISION = {"a2-p1": "a2-p1c", "a2-p3-ask": "a2-p3-askb", "a2-p5-bread": "a2-p5-breadb",  # regenerated after a continuity fail
            "a2-p2": "a2-p2b", "a2-p3-listen": "a2-p3-listenb", "a2-p4": "a2-p4c",  # 2026-10-20 user review
            "a2-p6": "a2-p6c", "a2-p8": "a2-p8e",  # p8b mill downstream, p8c second arch, p8d pennant on the right
            "a2-p7-crumbs": "a2-p7-crumbsb", "a2-p7-warm-path": "a2-p7-warm-pathb",  # p7: people beyond the parapet
            "a2-p9-name-promise": "a2-p9-name-promiseb", "a2-p9-wave-goodnight": "a2-p9-wave-goodnightd"}


def page(pid, layout, time, who, sets, states, camera, scene, text, counts, negatives, extra_refs=()):
    PAGES[pid] = dict(layout=layout, time=time, who=who, sets=sets, states=states, camera=camera,
                      scene=scene, text=text, counts=counts, negatives=negatives, extra_refs=extra_refs)


page("a2-p1", "full", "evening", ["gustaw", "oliwia", "dragon"], ["bridge", "nest", "east"], [],
     "CAMERA: the default view — we stand on the downstream (south) bank a little way from the bridge, looking north at its downstream face. West is on the left, east on the right; the brook flows toward us out of the one arch. Portrait framing: the brook and reeds in the foreground at the bottom, the whole bridge across the middle, the village small on its hill at the upper right, the sky above.",
     "SCENE (page 1, \"An Unexpected Meeting\"): toward evening, Sir Gustaw and Oliwia have just arrived on the road at the west (left) end of the bridge, under the old oak, and stopped: Gustaw a step ahead with his shield on his arm, Oliwia beside him holding her satchel strap, both looking with quiet surprise toward the middle of the bridge. There, at the crown of the bridge, sits a small copper dragon — small for a dragon, about the size of a horse — sitting upright ON THE COBBLED DECK, BEHIND the near (downstream) parapet, in the calm, dignified pose of a guardian: like a stone lion at a gate — chest up, neck raised, head held level and turned toward the travellers, both front paws planted firmly side by side on the capstone in front of it. From our side view the knee-high parapet hides its hind feet and the lower part of its legs, and its body rises above the parapet from the hips up. Its paws are NOT raised, not folded, not pleading — it is keeping watch, not asking for anything. Its long tail comes over the parapet a little east of the crown and wraps around the one loose, mossy capstone, as if guarding something very fragile. Its face is watchful and quietly worried under heavy lids, never frightening, never pleading. Moss soft as a green blanket grows between the stones; the brook whispers under the arch; reeds at the water's edge.",
     "\"Toward evening, Sir Gustaw and little Oliwia stood before an old bridge… Moss grew between the stones, soft as a green blanket; a brook whispered beneath the arches; and there, in the very middle, sat a small copper dragon. To their surprise, it looked deeply worried. It did not roar. It only held its paws beneath its chin and wrapped its tail around one loose stone, as if guarding something very fragile.\"",
     "exactly two people (Gustaw, Oliwia) and one dragon; no mice visible; no other people or animals; one bridge with one arch.",
     "no text; no second arch; no fire; no teeth; no spread wings; nobody standing or sitting on top of a parapet; the dragon is not perched on the parapet; no cypresses or poplars; no saturated sunset.")

page("a2-p2", "plate", "evening", ["dragon"], ["bridge"], [],
     "CAMERA: we stand down on the downstream (south) bank, a little below the bridge, looking up at its downstream face, close to the dragon. West is on the left, east on the right. Landscape framing.",
     "SCENE (page 2, \"A Voice Below the Bridge\"): a close, intimate portrait. The dragon lies on the cobbled deck behind the downstream parapet; its head and long neck lean out over the parapet, in three-quarter profile facing left, filling the right half of the frame; its two front paws rest on the broad mossy capstones. It has just let out one tiny puff from its nostrils — small enough to fit in a milk cup — a small soft cloud with gold-leaf edges, drifting slowly DOWN past the ivy on the downstream face toward the water under the arch. The dragon's eye is gentle and worried, half-lidded, following the puff down: it is listening for something tiny under the stones. The one arch and the clear brook at the lower left, reeds leaning in the wind as if listening too.",
     "\"The dragon sighed and let out a puff so small it could have fitted in a milk cup. The puff was golden at the edges, and it drifted down under the bridge slowly, ever so slowly. Then, from beneath the stones, came a tiny sound: peep, peep, peep.\"",
     "exactly one dragon; exactly one puff; no people, no mice visible, no other animals.",
     "no text; no people; no mice; no teeth; no fire, no flames, no grey smoke; no spread wings; no cypresses; no saturated sunset.")

page("a2-p3-ask", "full", "evening", ["oliwia", "dragon", "gustaw", "mice"], ["bridge", "nest"], [],
     "CAMERA: over Oliwia's shoulder. We stand on the cobbled deck on the east half of the bridge, just behind and above Oliwia, looking down at the downstream parapet (on our right as the deck runs away to the east). Portrait framing: Oliwia large in the lower left foreground from behind, the loose capstone and the crack in the centre, the dragon's head at the upper right, the brook and the far bank beyond the parapet at the top.",
     "SCENE (page 3, \"The Stone's Secret\", variant: Oliwia asked): Oliwia kneels on the cobbles by the knee-high downstream parapet, seen from behind and a little from the side — her face in soft three-quarter profile, wondering. The dragon lies ON THE COBBLED DECK to the right, on the same side of the parapet as Oliwia (nothing of the dragon is beyond the parapet or above the water); it has lowered its big head close to the stones and gently presses ONE claw on the end of the loose mossy capstone so that its inner edge lifts by a finger's width, opening the crack wider: inside, under the stone, a snug nest tucked between moss, lime mortar and tiny grass roots, where Big and Middle mouse sit and look up at Oliwia. The Smallest mouse hides further back behind a small stone that glows softly warm (a thin pale-gold halo around it, warmed by the dragon's breath) — only its oversized pink ears and stubby tail show. Gustaw stands a step behind on the left, very still, his shield resting against his knee, watching kindly.",
     "\"When Oliwia asked what had happened, the dragon tapped one claw against the loose stone and lowered its head toward the gap. There she found a nest of river mice tucked between moss, lime, and tiny grass roots. The smallest mouse had hidden behind a stone warmed by the dragon's breath.\"",
     "exactly three mice (two visible in the nest, the smallest only ears and tail behind the warm stone); one dragon; Gustaw; Oliwia. No other people or animals.",
     "no text; no fourth mouse; no fire; no teeth; the capstone is only lifted slightly, never removed; nobody on top of the parapet; no part of the dragon beyond the parapet or over the water.")

page("a2-p3-listen", "full", "evening", ["oliwia", "dragon", "gustaw", "mice"], ["bridge", "nest"], [],
     "CAMERA: over Oliwia's shoulder, closer than in the 'ask' variant. We stand on the cobbled deck on the east half of the bridge just behind Oliwia, looking down at the downstream parapet (on our right). Portrait framing: Oliwia large in the foreground, the crack in the centre, the dragon's head and front paws at the right, the brook and green meadows beyond the parapet at the top.",
     "SCENE (page 3, \"The Stone's Secret\", variant: Oliwia listened): Oliwia lies forward on the cobbles by the knee-high downstream parapet, her cheek and ear turned toward the narrow mossy crack along the inner edge of the loose capstone, eyes half-closed, listening, one hand resting flat on the moss — her face in profile, calm and attentive. In the crack, where moss half covers it, two small mice (Big and Middle) peek out at her; the Smallest shivers further back behind a small stone that glows softly warm (a thin pale-gold halo), only its oversized pink ears and stubby tail showing. The dragon lies very still along the deck at the right, its big head lowered on its paws at Oliwia's eye level, face clearly visible in three-quarter view — the same dragon, drawn the same way, as in the attached dragon rendering reference — watching her kindly, not pointing. Gustaw stands a few steps back on the left, frozen mid-step with his boot lifted carefully so as not to shake the bridge.",
     "\"Oliwia stayed quiet long enough for the smallest peep to return. It came from the edge of the bridge, where moss covered a narrow gap between the stones. Inside was a nest of river mice tucked between lime and tiny grass roots. The smallest mouse shivered behind a stone warmed by the dragon's breath.\"",
     "exactly three mice; one dragon; Gustaw; Oliwia. No other people or animals.",
     "no text; no fourth mouse; no fire; no teeth; nobody on top of the parapet.")

page("a2-p4", "plate", "dusk", ["oliwia", "gustaw", "dragon", "mice"], ["bridge", "nest"], [],
     "CAMERA: we stand on the cobbled deck of the bridge, on its east half, just behind Oliwia, looking down over her shoulder at the downstream parapet. The parapet runs across the picture from left (toward the crown, west) to right (east); beyond it, below, the clear brook and the green far bank. Landscape framing.",
     "SCENE (page 4, \"A Plan for the Little Mice\"): Oliwia kneels on the cobbles in the foreground at the bottom-left, seen from behind and slightly above: her long chestnut hair with the thin braid around the crown, her teal shoulder and the satchel strap. The knee-high parapet is in front of her. In the middle lies the loose capstone — tilted, darker, thick with moss — and along its inner edge, facing us, the narrow mossy crack; peeking out of it, huddled together, exactly three river mice, whiskers trembling, looking up. Oliwia's two small hands rest half a loaf of dark rye bread on a square of cream linen on the capstone beside the crack, very gently. On the left, Sir Gustaw kneels on one knee on the cobbles by the parapet, face visible, calm and careful, holding the bronze lantern low and still above the crack by its ring; its warm light falls on the loose stone and the mice. On the right, the dragon lies ON THE BRIDGE DECK, on the same side of the parapet as the heroes, its big copper head lowered close to the crack, breathing out warmth so gently it would not blow out a candle (a faint gold shimmer, no smoke). Below, over the clear brook, lies ONE thin white ribbon of mist, low on the water only — the banks, meadows and trees beyond stay clear and green.",
     "\"The evening grew chilly, and mist rose from the brook like a white ribbon. In the mossy crack, the mice trembled and twitched their whiskers. Gustaw held a lantern, Oliwia held half a loaf of rye bread wrapped in linen, and the dragon breathed out warmth so gently it would not have blown out a candle.\"",
     "exactly three mice; one lantern; one half loaf on one linen; one dragon; one Gustaw; one Oliwia. No other people or animals.",
     "no text; no part of the dragon beyond the parapet or above the water; no fourth mouse; no fire or flames; nobody on top of the parapet; no second crack; no marsh, no fog over the land.")

page("a2-p5-bread", "plate", "dusk", ["mice", "miller", "baker", "basket"], ["bridge", "nest", "east"], ["pennant"],
     "CAMERA: a mouse's-eye view. The camera sits low on top of the downstream parapet's broad capstones, right beside the crack, looking east along the parapet and up at the deck. The mossy capstones run away from us; to the left, a little lower, the cobbled deck; beyond, the east end of the bridge with the planted red pennant, the road climbing to the village. In this view upstream (north) is on the LEFT and downstream on the RIGHT: if the watermill shows at all it is small, on the left, beyond the deck; on the right, below the parapet, only the brook and reeds. There is only this one bridge — no other bridge or arch anywhere in the picture.",
     "SCENE (page 5, \"Help Comes From the Mill\", variant: the bread was shared): in the foreground on the capstone lies a square of cream linen with half a dark rye loaf (crust #a56a35, pale crumb), and a little trail of crumbs runs from it to the narrow mossy crack along the loose stone. Out of the crack the three mice push their heads and noses, whiskers forward, drawn by the scent — Big, Middle and Smallest side by side. Arriving along the deck from the east end, seen from below so they look big and kind, are the three helpers, faces visible, smiling gently and looking down at the mice, stepping carefully: the miller with an armful of cream sheep's wool, the baker with a folded clean white cloth with two thin red stripes, the basket maker with a bundle of green-grey reeds over his shoulder. Behind them the red pennant stirs at the east end.",
     "\"Gustaw planted a red pennant by the path to the mill while crumbs of warm bread waited near the mossy crack. Drawn by the scent, the mice poked out their noses as the miller arrived with sheep's wool, the baker with a clean kerchief, and the basket maker with reeds smelling of rain.\"",
     "exactly three mice; exactly three people (miller, baker, basket maker); one half loaf on one linen; one pennant. No Gustaw, no Oliwia, no dragon, no other animals.",
     "no text; no fourth mouse; no fire; mice are real mice, not standing like people; no second bridge or arch; no mill on the right; no saturated sunset.")

page("a2-p6", "plate", "dusk", ["basket", "dragon", "mice", "oliwia"], ["bridge", "nest"], [],
     "CAMERA: on the cobbled deck of the bridge on its east half, at the height of a kneeling person, looking toward the downstream parapet (behind the group) with the clear brook, the grassy far bank and green meadows beyond it. Landscape framing, close: the group fills the width — Oliwia at the left, the basket maker with the cradle in the centre, the dragon's head and neck at the right; the parapet with the mice runs across the middle behind them; a band of cool dusk sky above.",
     "SCENE (page 6, \"A Cradle of Reeds and Moss\"): the basket maker kneels on the cobbles and holds up, in both careful hands, a just-finished little cradle — round as a nutshell, woven of green-grey reeds, lined with cream sheep's wool and dry moss, light as a leaf; it is EMPTY. The dragon, lying on the deck at the right, lowers its snout over the cradle and warms it with one tiny breath: a small soft cloud of gold leaf the size of a milk cup. On the capstone of the parapet beside them, at the mouth of the mossy crack, the three mice sit in a row and blink at the cradle, whiskers trembling, not running away. Oliwia kneels at the left, hands in her lap, watching with a quiet smile. Leftover reed ends and a tuft of wool lie on the cobbles.",
     "\"The basket maker wove a cradle from reeds, wool, and dry moss. It was round as a nutshell and light as a spring leaf. The dragon lowered its snout and warmed it with one tiny breath. The mice blinked, their whiskers trembling, but not one of them ran.\"",
     "one basket maker, one Oliwia, one dragon, exactly three mice (outside the cradle); one empty cradle. No other people or animals.",
     "no text; no mice inside the cradle; no fire, no flames; no teeth; nobody on top of the parapet.")

# p6 choice (user, 2026-10-21): how the mice are coaxed into the cradle, not who carries it.
# Both variants share one set-up: the cradle stands on the broad capstone right next to the crack,
# so a thumb-sized mouse never has to climb down; the basket maker steadies it, Gustaw holds his
# shield flat against the deck side of the parapet just under it.
P7_SETUP = ("the round reed cradle (green-grey reeds, cream wool and dry moss inside) stands on the broad flat capstone of the downstream parapet, about a forearm's length along from the narrow mossy crack at the loose stone; "
            "the basket maker kneels on the cobbles of the deck in front of the parapet (on the deck side, like everyone) and steadies the cradle's rim with two fingers; Gustaw kneels beside him on the cobbles and holds his red griffin shield flat against the deck-side face of the parapet, its top edge just under the cradle, so no one could fall. "
            "EVERY person and the dragon are on the cobbled deck, on the same side of the parapet as the camera; NOBODY is on the far side of the parapet — beyond it there is only the drop to the brook.")
P7_CAMERA = ("CAMERA: on the cobbled deck of the bridge, a few steps east of the group, low (at the eye level of the kneeling people), looking WEST along the bridge toward its crown. "
             "The downstream parapet runs from the right foreground diagonally into the picture toward the crown; its broad mossy capstones are knee-high to the kneeling people. The cobbled deck fills the left and the bottom of the picture; the people kneel on it, facing the parapet, seen in three-quarter view so their faces show. "
             "Over the parapet, on the right, only the drop to the clear brook, the grassy far bank and green meadows under a cool dusk sky. The crack is on the capstone nearer the crown, the cradle on the capstone nearer to us. Landscape framing, a full picture edge to edge.")
P7_DRAGON = ("WHERE THE DRAGON IS: it lies ON THE COBBLED DECK on OUR side of the parapet, its body on the cobbles nearer to us than the parapet; nothing of the dragon is on top of or beyond the parapet, and the brook behind the parapet shows no part of it.")

page("a2-p7-crumbs", "plate", "dusk", ["oliwia", "basket", "gustaw", "dragon", "mice"], ["bridge", "nest"], [],
     P7_CAMERA,
     "SCENE (page 7, \"The Little Paws Move Home\", variant: a trail of crumbs): " + P7_SETUP + " Oliwia kneels at the left by the crack, holding the dark rye crust in one hand and placing the very last crumb with the other; a neat dotted trail of small pale bread crumbs runs along the capstone from the mouth of the crack to the rim of the cradle. Big mouse already sits on the wool inside the cradle; Middle mouse is stepping over the rim; the Smallest sits halfway along the trail, holding one crumb in its front paws and nibbling it, cheeks round — the funny detail of the picture. Oliwia and the basket maker smile at it; Gustaw looks on calmly. " + P7_DRAGON + " It lies at the right edge, its head resting low on the cobbles, one heavy-lidded eye watching the Smallest with fond patience. Faces visible, gentle and amused.",
     "\"Oliwia crumbled the crust of her bread and laid a trail of crumbs from the crack all the way to the cradle. The first mouse followed it, crumb by crumb, until it stepped onto the wool. Then the second. The smallest stopped at every single crumb and ate it up.\"",
     "Oliwia, basket maker, Gustaw, the dragon (head and front of the body), exactly three mice, one cradle, one shield, one crust, one trail of about ten crumbs. No other people or animals.",
     "no text; no frame; no fourth mouse; no loaf on the capstone (only the crust in Oliwia's hand); no fire; nobody on top of the parapet; no part of the dragon beyond the parapet; the cradle is not on the ground.")

page("a2-p7-warm-path", "plate", "dusk", ["dragon", "mice", "basket", "gustaw", "oliwia"], ["bridge", "nest"], [],
     P7_CAMERA,
     "SCENE (page 7, \"The Little Paws Move Home\", variant: the dragon's warm path): " + P7_SETUP + " " + P7_DRAGON + " It lies in the right foreground with its long neck stretched low, its snout just above the capstone near the crack; it has breathed gently along the top of the capstone, and a strip of the stone from the crack to the cradle glows with a soft warm gold sheen, painted as a faint gold-leaf shimmer with three or four tiny gold wisps of warm air curling up from it — like sunlight on a stone, never fire, never embers, never flames. The three mice walk along the glowing strip toward the cradle as if on a rug, whiskers forward, content: Big mouse is stepping onto the wool, Middle mouse right behind it, the Smallest last of all, following the dragon's warm nose. Oliwia kneels at the left by the crack, hands held open and still, watching with wonder. Faces visible, calm and delighted.",
     "\"The dragon leaned over the bridge and breathed on the stones, one after another, from the crack all the way to the cradle. The stones grew warm and shone a soft gold. The first mouse crossed them as if on a rug and stepped onto the wool. Then the second. The smallest came last, following the dragon's warm nose.\"",
     "the dragon (head and front of the body), Oliwia, basket maker, Gustaw, exactly three mice, one cradle, one shield, one glowing strip of stone. No other people or animals.",
     "no text; no frame; no fourth mouse; no fire, no flames, no embers, no smoke; no teeth; nobody on top of the parapet; no part of the dragon beyond the parapet; the cradle is not on the ground.")

page("a2-p8", "plate", "deepdusk", ["gustaw", "oliwia", "dragon"], ["bridge", "east", "cradlehome"], ["pennant", "inn-lit"],
     "CAMERA: on the cobbled deck at the west half of the bridge, behind Gustaw and Oliwia, looking EAST along the deck (like the location sheet's view along the bridge). The downstream parapet is on the RIGHT, the upstream parapet on the LEFT. Landscape framing, wide: the two heroes left of centre in the lower two thirds, the open deck rising ahead of them to the east end; at the right, beyond the end of the right parapet, the dragon by the cradle on the bank, large enough to read its face; the road climbing to the village and the inn across the top, a band of deep-dusk sky above.",
     "SCENE (page 8, \"A Promise on the Old Bridge\"): the bridge is open again and empty ahead. Gustaw and Oliwia walk slowly, side by side, in no hurry, seen from behind and in three-quarter view — Gustaw's face in profile turned toward the dragon, calm; Oliwia looking up at him. At Gustaw's left hip the hilt of his sheathed sword shows one small four-pointed gold star of light. The dragon has moved off the deck: it sits calmly on the east bank just beyond the end of the right (downstream) parapet, beside the little reed cradle in the dry grass among the reeds, and looks back at the heroes. At the east end of the bridge the red pennant stands planted on the LEFT side of the road, just beyond the end of the LEFT parapet — on the opposite side of the road from the dragon; nothing stands at the end of the right parapet. Beyond, the road climbs the low hill to the village; at the top the timber-framed inn with its three upper windows glowing gold.",
     "\"When the mice were safe, the dragon moved aside. The bridge opened again, but nobody hurried across it. Gustaw's sword shone in its scabbard — not because anyone had won, but because someone smaller had been helped. The path led the travelers onward toward an inn full of candles.\"",
     "Gustaw, Oliwia, one dragon; one cradle (the mice inside are not visible); one pennant. No other people or animals.",
     "no text; no drawn or raised sword; no fire; nobody on a parapet; no dragon on the deck; NO watermill and no other building anywhere near the dragon or on the right half of the picture (the mill is upstream, out of view to the left); no cypresses; NO second arch, culvert, tunnel or opening in any wall — the bridge's one arch is under the deck we walk on and is hidden from this view, and the low bank wall beyond the right parapet is solid.")

# Endings (user, 2026-10-20): thanks -> the dragon gives the bridge a glowing copper scale, a lasting
# "tread gently" sign; goodnight -> the guardian sleeps at last, its sleepy breath keeps the cradle warm.
SCALE = ("one small copper dragon scale, the size of a child's palm and shaped like a rounded shield, set flush into the OUTER (downstream) face of the parapet "
         "just below the loose mossy capstone (the third capstone east of the crown), glowing softly like a little lantern: a warm gold-leaf centre and a small pale-gold halo on the stones around it")
PUFFS = ("a gentle trail of five or six small round puffs of breath FLOATING IN THE AIR: they leave the sleeping dragon's nostrils one after another and rise in a soft curve up and over the cradle, "
         "each a little cream-white cloud no bigger than a milk cup with a curly gold-leaf edge and a faint warm glow, like warm fireflies hovering in the night air above the sleeping mice; "
         "they are drawn against the dark grass, reeds and night air, clearly separate from the dragon — never on its body, never spots or patterns on its scales; the dragon's scales are plain copper with no gold spots")
ENDINGS = {
    "name-promise": dict(
        crossing="cross the bridge slowly from left to right on tiptoe; as each one passes the glowing scale they slow down, and the baker and the old woman glance down at it with quiet smiles",
        dragon="The dragon lies on a flat warm stone at the foot of the bridge beside the cradle, head raised, EYES OPEN, keeping calm watch, peaceful and proud.",
        key=SCALE,
        text="The dragon gave the bridge one of its own copper scales and set it into the wall right beside the mice's old home. At night the scale glowed like a little lantern. Everyone who crossed slowed down beside it and went on tiptoe. The dragon kept watch by the cradle with its eyes wide open.",
        counts="one glowing copper scale in the parapet",
        neg="no golden puffs; no tablet; no flowers; the dragon is awake"),
    "wave-goodnight": dict(
        crossing="tiptoe across the bridge from left to right in a quiet line; the boy in the hood holds one finger to his lips, the baker gently shushes the miller, all looking fondly down toward the sleeping dragon",
        dragon="The dragon is curled round the cradle like a sleeping cat, EYES CLOSED, deeply and peacefully asleep for the first time in many nights, its chin resting by the cradle rim.",
        key=PUFFS,
        text="The dragon curled itself around the cradle and fell asleep. The villagers tiptoed across the bridge and shushed one another in whispers so as not to wake it. With every sleepy breath a little golden puff drifted up, circling over the cradle like warm fireflies.",
        counts="five or six small golden puffs above the cradle",
        neg="no glowing scale; no tablet; no flowers; no fire or smoke; the dragon is asleep"),
}
for variant, e in ENDINGS.items():
    page(f"a2-p9-{variant}", "plate", "night", ["dragon", "mice", "miller", "baker", "basket", "villagers2"],
         ["bridge", "east", "cradlehome"], ["pennant", "inn-lit"],
         "CAMERA: the default view, a visual rhyme with page 1 — on the downstream (south) bank, looking north at the downstream face of the bridge. West on the left, east on the right. The east bank foot of the bridge with the cradle is in the right foreground.",
         f"SCENE (page 9, \"The Bridge Opens Again\", variant: {variant}): night. The villagers — the miller, the baker, the basket maker, the old woman in the shawl and the boy in the hood — {e['crossing']}; small figures in a calm line on the deck, faces visible. In the right foreground, on the east bank at the foot of the bridge among the reeds and dry grass, the little reed cradle with the three mice asleep in the wool. {e['dragon']} Detail: {e['key']}. The pennant stirs at the east end; the inn's windows glow gold on the hill.",
         f"\"{e['text']}\"",
         f"exactly five villagers on the bridge; one dragon; exactly three sleeping mice in one cradle; one pennant; {e['counts']}. No Gustaw, no Oliwia, no other animals.",
         f"no text, no letters or runes anywhere; no second arch; no fire; no black sky; {e['neg']}.")

EMBLEM_MOTIF = {
    "name-promise": "the copper dragon (match the attached dragon sheet and rendering reference) lying awake and watchful on a tuft of dry grass and reeds at the foot of a tiny stylised stone bridge pier, eyes open and kind, its tail curled around the little round reed cradle in which three tiny mice sleep in cream wool; in the stone wall just above them one small copper scale, set into the wall, glows like a little lantern with a gold-leaf halo",
    "wave-goodnight": "the copper dragon (match the attached dragon sheet and rendering reference) fast asleep, curled like a cat around the little round reed cradle in which three tiny mice sleep in cream wool, on a tuft of dry grass and reeds at the foot of a tiny stylised stone bridge pier; from its nostrils rise five small soft puffs with gold-leaf edges, drifting in a gentle ring above the cradle like warm fireflies",
}


def emblem(pid, variant):
    style = (HERE / "_style-orn.txt").read_text().strip()
    body = [
        "REFS: pentiment-margins-1.png, pentiment-margins-2.png, orn-title-clean.png, m-sheet-dragon.png, dragon-render.png, m-sheet-mice.png, tone-dragon-bridge-p3ask.png",
        "SIZE: 1024x1024, square", "", style, "",
        "MOTIF: the closing emblem (the colophon) of the tale \"The Dragon on the Old Bridge\" — the companion of the attached frontispiece emblem, which opens the tale: the same kind of precious illuminated roundel, the same double ring of burnished gold leaf with a fine punched-dot border, the same deep muted blue ground (#2f4a73) scattered with tiny four-pointed gold stars, the same lively ink-vine margin growing out of it on all sides — but now as an ending: "
        f"inside the roundel, {EMBLEM_MOTIF[variant]}. A thin silver crescent moon in the upper part of the roundel. Around the roundel: delicate ink vines with reeds and bulrushes, small willow leaves, wild strawberries, a few cornflowers, gold-leaf dots and curls, and at the bottom centre a small gold-leaf fleuron like the final flourish of a manuscript. Calm, warm, enchanting — the feeling of a tale ending well, a quiet goodnight.",
        "", "COUNTS: one dragon; exactly three mice; one cradle. No people.",
        "NEGATIVES: absolutely no text, letters, numbers or runes; no frame other than the gold roundel; no background outside the motif; no fire; no teeth.",
        "", "REFERENCE ROLES: the frontispiece emblem defines the format, the gold ring, the blue starry ground and the margin vines — this emblem must look like its pair from the same book, but with a different scene inside. The Pentiment margin pages define the line and lightness of the vines. The dragon sheet and the rendering reference define the dragon exactly (copper colour, horns, face); the mice sheet defines the three mice. Never copy a composition from a reference.",
    ]
    (HERE / f"{pid}.txt").write_text("\n".join(body) + "\n")


def build(pid, p):
    render = ["dragon-render.png"] if "dragon" in p["who"] else []
    refs = list(dict.fromkeys([SHEETS[w] for w in p["who"] if w in SHEETS] + render + BASE_REFS + list(p["extra_refs"])))
    who = "\n".join(C[w] for w in p["who"])
    parts = [f"REFS: {', '.join(refs)}", SIZES[p["layout"]], "", STYLE, "",
             "CHARACTERS (match the attached sheets for identity):", who, ""]
    land = [LAND] if p["layout"] != "vignette" else []
    parts += [SET[s] for s in p["sets"]] + land + [STATE[s] for s in p["states"]] + [TIME[p["time"]], "", p["camera"], "", p["scene"], "",
              f"TEXT IT ILLUSTRATES: {p['text']}", f"COUNTS: {p['counts']}", f"NEGATIVES: {p['negatives']}", "",
              "QUALITY: clear focal point readable at a glance by a 5-year-old; detail concentrated on the characters and the key object; calm simplified background; finished, never sketchy or empty.",
              "", REFROLE] + (["The DRAGON RENDERING REFERENCE (a crop of an approved page of this book) shows exactly how the dragon must be drawn and coloured: the same copper wash, scale texture, line weight, horn stripes and face — match it closely."] if render else [])
    (HERE / f"{pid}.txt").write_text("\n".join(parts) + "\n")


if __name__ == "__main__":
    for pid, p in PAGES.items():
        build(REVISION.get(pid, pid), p)
        print(pid, p["layout"], p["time"])
    for variant in EMBLEM_MOTIF:
        emblem(f"a2-p10-{variant}b", variant)
        print(f"a2-p10-{variant}b emblem")
