# Bakes the painted far wall of the room behind the desk (prompts/room-wall.txt) into the texture
# the book loads (textures/room_wall.webp, see CHAMBER_ART in src/book/main.js and "the chamber" in
# src/book/room.js): softly out of focus, a touch darker, its edges falling off into the room's dark.
# Prints where the fire's bright centre sits, for HEARTH in room.js.
#   bake_room.py <raw png> <out webp> [blur]   e.g. bake_room.py ../../raw/room-wall.png ../../../public/assets/book3d/textures/room_wall.webp
import sys
import numpy as np
from PIL import Image
from texlib import save, blur, smoothstep

src, out = sys.argv[1], sys.argv[2]
# The painting's own 1536 x 1024 over the wall's 12.6 x 8.4 units (~122 texels a unit). A phone
# held upright opens on a far, steep view that frames only the hearth and the bookcase, a third of
# the painting each way, a texel to 1.5 canvas px; the wall's shader (room.js, smoothSampled)
# then melts what magnification is left like a lens out of focus, never showing the texel grid.
W, H = 1536, 1024
im = Image.open(src).convert("RGB")
if im.size != (W, H):
    im = im.resize((W, H), Image.LANCZOS)
a = np.asarray(im, dtype=np.float32) / 255.0

# out of focus: the wall stands some ten units behind the desk the camera is focused on; soft
# enough to stay quiet behind the book, sharp enough that the hearth's stones, the kettle and the
# books still read on a phone (sigma in texels of this size)
a = blur(a, float(sys.argv[3]) if len(sys.argv) > 3 else 2.4)
# a little darker and warmer overall, the fire kept bright (the room's own dimming is in room.js)
lum = a @ np.array([0.2126, 0.7152, 0.0722], dtype=np.float32)
a = a * (0.86 + 0.14 * smoothstep(0.55, 0.9, lum))[..., None]
a = a * np.array([1.0, 0.96, 0.9], dtype=np.float32)
# the edges fall off into the dark (#0b0604), the floor line kept
y, x = np.mgrid[0:H, 0:W].astype(np.float32)
u, v = x / (W - 1), 1 - y / (H - 1)  # v up from the floor
edge = smoothstep(0.0, 0.12, u) * smoothstep(0.0, 0.12, 1 - u) * smoothstep(0.0, 0.25, 1 - v)
dark = np.array([11, 6, 4], dtype=np.float32) / 255.0
a = dark + (a - dark) * edge[..., None]
# high quality: smooth, blurred gradients are where WebP's blocks show once magnified
save(a, out, q=90)

# where is the fire? the brightest warm patch in the lowest third
low = blur(lum, 18)[int(H * 0.66):, :]
iy, ix = np.unravel_index(np.argmax(low), low.shape)
print(f"{out}: {W}x{H}; fire at u={ix / (W - 1):.2f}, v={1 - (iy + int(H * 0.66)) / (H - 1):.2f} (HEARTH in room.js)")
