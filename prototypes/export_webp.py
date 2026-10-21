#!/usr/bin/env python3
"""Export one graded master into the book as webp (quality 88, at most 1280 px wide).

    python3 prototypes/export_webp.py <graded.png> <out.webp> [--plate FOCUS]

--plate FOCUS crops a landscape master to the 5:4 plate first, at full height: a 1536x1024
generation becomes exactly 1280x1024, so nothing is upscaled. FOCUS (0..1) sets where the window
sits across the picture: 0 keeps the left edge, 0.5 the centre, 1 the right edge. Pick it so every
figure and story prop stays inside (see the crop table in prototypes/book/pages.js).

Used by export_v2.sh; call it directly to re-export from prototypes/graded/ without regrading.
Transparent images (emblems, ornaments) are trimmed to their drawing, as before.
"""
import argparse
import sys

from PIL import Image

PLATE = 5 / 4  # pageArt.js PLATE.aspect
MAX_W = 1280

ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
ap.add_argument("src")
ap.add_argument("dst")
ap.add_argument("--plate", type=float, metavar="FOCUS", help="crop to the 5:4 plate; FOCUS 0..1 = left..right")
a = ap.parse_args()

im = Image.open(a.src)
if im.mode == "RGBA":
    im = im.crop(im.getchannel("A").point(lambda v: 255 if v > 16 else 0).getbbox())
if a.plate is not None:
    if not 0 <= a.plate <= 1:
        sys.exit(f"--plate focus must be 0..1, got {a.plate}")
    w = round(im.height * PLATE)
    if w > im.width:
        sys.exit(f"{a.src} is {im.width}x{im.height}: too narrow for a 5:4 plate (needs {w} px)")
    x0 = round((im.width - w) * a.plate)
    im = im.crop((x0, 0, x0 + w, im.height))
if im.width > MAX_W:
    im = im.resize((MAX_W, round(im.height * MAX_W / im.width)), Image.LANCZOS)
im.save(a.dst, "WEBP", quality=88, method=6)
print(a.dst, im.size)
