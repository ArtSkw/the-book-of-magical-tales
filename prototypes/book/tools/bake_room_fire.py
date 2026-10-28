# Bakes the mask that brings the painted hearth to life (textures/room_fire.webp, see "the chamber"
# in src/book/room.js): which parts of the painted wall (textures/room_wall.webp, bake_room.py) are
# flame, ember and firelit stone, so the wall's shader can lick the flames upwards, breathe the
# embers and let the stone, the hearth's step and the boards in front flicker with the fire.
# Derived from the baked painting itself (its brightness and warmth), kept to the hearth's shapes
# and away from the kettle and the andirons, which must stay still. Re-run after re-baking the wall.
# Prints FIRE (the painting's rectangle the mask covers) for room.js.
#   bake_room_fire.py <room_wall.webp> <out webp> [preview png]
#   e.g. bake_room_fire.py ../../../public/assets/book3d/textures/room_wall.webp ../../../public/assets/book3d/textures/room_fire.webp
#
# Channels (lossless: three independent masks, which lossy WebP's chroma subsampling would smear):
#   R  where the flames may lick, ramped from the logs (barely) to the tips (most), the kettle,
#      the andirons and the logs' outline kept out
#   G  the ember bed under and between the logs
#   B  how strongly the fire lights a surface: the back bricks and the arch's inner faces most,
#      the hearth's step and the floorboards in front, a little of the stone face and the plaster
import sys
import numpy as np
from PIL import Image
from texlib import load, blur, smoothstep

src, out = sys.argv[1], sys.argv[2]
preview = sys.argv[3] if len(sys.argv) > 3 else None
a = load(src)
H, W = a.shape[:2]
assert (W, H) == (1536, 1024), "the painting is baked at 1536 x 1024 (bake_room.py)"

# The painting's hearth, in its pixels (x from the left, y down from the top), read off the bake:
FIRE_C = (292, 800)  # the flames' bright heart
OPEN = dict(cx=298, cy=758, r=135, bottom=856)  # the hearth's mouth: a round arch over straight jambs
KETTLE = dict(cx=287, cy=726, rx=52, ry=47)  # the hanging kettle (its bottom ~ y 772)
IRONS = [(176, 190), (374, 388)]  # the andirons' posts (x), y ~ 785..850
FLAMES = dict(x0=212, x1=372, y0=748, y1=846)  # where the flames are and their tongues may reach
EMBERS = dict(x0=226, x1=358, y0=814, y1=852)
# The mask covers this rectangle of the painting, at a quarter of its resolution (the shader samples
# it bilinearly; every shape in it is soft): 512 x 512 px -> 128 x 128.
RECT = (64, 512, 576, 1024)  # x0, y0, x1, y1
SCALE = 4

y, x = np.mgrid[0:H, 0:W].astype(np.float32)
lum = 0.2126 * a[..., 0] + 0.7152 * a[..., 1] + 0.0722 * a[..., 2]  # (of the sRGB values)
warm = a[..., 1] / np.maximum(a[..., 0], 1e-3)  # green over red: yellow flame ~0.8, orange brick ~0.45


def box(x0, x1, y0, y1, soft):
    return smoothstep(x0 - soft, x0 + soft, x) * smoothstep(x1 + soft, x1 - soft, x) * smoothstep(y0 - soft, y0 + soft, y) * smoothstep(y1 + soft, y1 - soft, y)


def ellipse(cx, cy, rx, ry, soft):
    d = np.sqrt(((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2)
    return smoothstep(1.0 + soft, 1.0 - soft, d)


# ---- R: the flames, and the air just above them they lick into
lb = blur(lum, 2.0)
flame = smoothstep(0.30, 0.56, lb) * smoothstep(0.42, 0.62, blur(warm, 2.0)) * box(**FLAMES, soft=8)
# a tongue rises from the flame below it: spread each flame pixel up (fading over ~26 px) and a
# little sideways, so the dark just over a flame may light up when a tongue reaches it
reach = flame.copy()
for k in range(2, 28, 2):
    up = np.zeros_like(flame)
    up[:-k] = flame[k:]
    reach = np.maximum(reach, up * (1 - k / 30))
side = reach.copy()
for k in range(2, 8, 2):
    side = np.maximum(side, np.maximum(np.roll(reach, k, 1), np.roll(reach, -k, 1)) * (1 - k / 10))
# the tips move most, the base hardly (the logs must not wobble)
tips = 0.12 + 0.88 * smoothstep(846, 786, y)
still = ellipse(**KETTLE, soft=0.16)
for x0, x1 in IRONS:
    still = np.maximum(still, box(x0, x1, 782, 852, soft=5))
# the logs: the dark among the flames low down
still = np.maximum(still, smoothstep(0.24, 0.14, lb) * box(212, 372, 812, 852, soft=4))
lick = blur(np.clip(side, 0, 1) * tips * (1 - still), 3.0)

# ---- G: the embers glowing under and between the logs
embers = blur(smoothstep(0.17, 0.40, lb) * box(**EMBERS, soft=6) * (1 - 0.6 * flame), 2.5)

# ---- B: the fire's light on everything round it
d2 = ((x - FIRE_C[0]) / 175) ** 2 + ((y - FIRE_C[1]) / 150) ** 2
reach_light = np.exp(-d2)
inside = np.maximum(
    smoothstep(OPEN["r"] + 6, OPEN["r"] - 6, np.hypot(x - OPEN["cx"], y - OPEN["cy"])) * (y < OPEN["cy"]),
    box(OPEN["cx"] - OPEN["r"], OPEN["cx"] + OPEN["r"], OPEN["cy"], OPEN["bottom"], soft=6),
)
floor_in_front = smoothstep(848, 866, y)  # the hearth's step and the boards before it
surface = 0.5 + 0.5 * np.maximum(blur(inside, 6), 0.85 * floor_in_front)
lit = blur(reach_light * surface * (1 - 0.8 * flame) * (1 - 0.5 * still), 6.0)
lit /= lit.max()
x0, y0, x1, y1 = RECT
# and none of it at the rectangle's edges: the flicker must fade out across the plaster, never stop
# at a line
lit *= smoothstep(x0, x0 + 56, x) * smoothstep(x1, x1 - 56, x) * smoothstep(y0, y0 + 56, y) * smoothstep(y1, y1 - 56, y)

m = np.stack([lick, embers, lit], -1)[y0:y1, x0:x1]
im = Image.fromarray(np.clip(m * 255 + 0.5, 0, 255).astype(np.uint8)).resize(((x1 - x0) // SCALE, (y1 - y0) // SCALE), Image.BOX)
small = np.asarray(im).copy()
small[[0, -1], :] = 0  # nothing at the border: the shader clamps to the edge, so outside the rectangle is still
small[:, [0, -1]] = 0
im = Image.fromarray(small)
im.save(out, "WEBP", lossless=True, quality=100, method=6)
if preview:
    # the mask over the painting, for checking its shapes
    base = (a[y0:y1, x0:x1] * 0.55)
    big = np.asarray(im.resize((x1 - x0, y1 - y0), Image.BILINEAR), dtype=np.float32) / 255.0
    over = np.clip(base + big * np.array([0.9, 0.9, 0.9]) * 0.6, 0, 1)
    Image.fromarray((over * 255).astype(np.uint8)).save(preview)
# where it lies in the painting's uv (u from the left, v up from the bottom, as the wall's plane maps it)
print(f"{out}: {im.size[0]}x{im.size[1]}; FIRE = {{ u: {x0 / W:.5f}, v: {1 - y1 / H:.5f}, w: {(x1 - x0) / W:.5f}, h: {(y1 - y0) / H:.5f} }} (room.js)")
