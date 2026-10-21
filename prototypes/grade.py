#!/usr/bin/env python3
"""Tone-match a generated illustration to the tale's approved tone anchors.

Codex renders each picture with its own white balance and saturation, so the
same sky can come out warm on one page and cool on the next. This pulls every
image toward the colour balance of pages the user approved for tone (never the
location sheet: it is a layout reference and its colours are washed out), then
applies the page's time-of-day step from the colour script, so changes in light
come from the story, not from the generator.

Usage: grade.py <in.png> <out.png> [--time evening|dusk|deepdusk|night]
                [--anchor refs/tone-x.png:dusk ...] [--strength 0.8]
Each anchor names the story time it was approved at, so its time step is
removed before matching and steps never compound.
"""
import argparse
import numpy as np

np.seterr(all="ignore")  # numpy 2 + Accelerate reports spurious matmul warnings
from PIL import Image

# Colour script: Lab offsets (dL, da, db) per story time. Only a/b are applied (as the
# target cast); dL documents the intended darkening, which the prompt asks Codex to paint.
# "day" is the neutral base the anchors are reduced to; later times only darken and cool.
TIME = {
    "day": (0, 0, 0),
    "evening": (-2, 1, 3),      # p1–p3: low sun, a touch warmer
    "dusk": (-7, 0, -4),        # p4–p7: cold, misty
    "deepdusk": (-13, 1, -9),   # p8
    "night": (-20, 2, -15),     # p9–p10
}

M = np.array([[0.4124, 0.3576, 0.1805], [0.2126, 0.7152, 0.0722], [0.0193, 0.1192, 0.9505]])
WHITE = np.array([0.95047, 1.0, 1.08883])


def to_lab(rgb):
    c = rgb / 255.0
    c = np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)
    xyz = c @ M.T / WHITE
    f = np.where(xyz > 0.008856, np.cbrt(xyz), 7.787 * xyz + 16 / 116)
    return np.stack([116 * f[..., 1] - 16, 500 * (f[..., 0] - f[..., 1]), 200 * (f[..., 1] - f[..., 2])], -1)


def to_rgb(lab):
    fy = (lab[..., 0] + 16) / 116
    f = np.stack([fy + lab[..., 1] / 500, fy, fy - lab[..., 2] / 200], -1)
    xyz = np.where(f ** 3 > 0.008856, f ** 3, (f - 16 / 116) / 7.787) * WHITE
    c = xyz @ np.linalg.inv(M).T
    c = np.where(c <= 0.0031308, 12.92 * c, 1.055 * np.clip(c, 0, None) ** (1 / 2.4) - 0.055)
    return np.clip(c * 255 + 0.5, 0, 255).astype(np.uint8)


def stats(lab):
    flat = lab.reshape(-1, 3)
    return flat.mean(0), flat.std(0)


def anchor_stats(anchors):
    """Pooled chroma statistics of the approved pages, reduced to "day"."""
    labs = []
    for spec in anchors:
        path, _, t = spec.partition(":")
        img = Image.open(path).convert("RGB")
        img.thumbnail((512, 512))
        labs.append(to_lab(np.asarray(img, float)).reshape(-1, 3) - np.array(TIME[t or "day"]))
    return stats(np.concatenate(labs))


def grade(src, anchor, strength, time, mask=None):
    """Match white balance and overall saturation, leave lightness to the story.

    Only the chroma (a, b) statistics move: the mean (colour cast) is pulled to
    the anchor's, the spread (saturation) is scaled within a narrow band so the
    characters' fixed colours (copper dragon, red cloak, teal dress) survive.
    """
    lab = to_lab(src)
    (m, s), (am, as_) = stats(lab[mask] if mask is not None else lab), anchor
    # Codex already paints the time of day into lightness, so L is left alone;
    # the colour script only moves the target colour cast (cooler toward night).
    shift = np.array(TIME[time])
    out = lab.copy()
    for ch in (1, 2):
        ratio = np.clip(as_[ch] / max(s[ch], 1e-6), 0.85, 1.1)
        target = (lab[..., ch] - m[ch]) * ratio + am[ch] + shift[ch]
        out[..., ch] = lab[..., ch] + strength * (target - lab[..., ch])
    return to_rgb(out)


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("src")
    ap.add_argument("dst")
    ap.add_argument("--anchor", nargs="+", default=[
        "prototypes/refs/tone-dragon-bridge-p4.png:dusk",
        "prototypes/refs/tone-dragon-bridge-p5.png:dusk",
    ])
    ap.add_argument("--strength", type=float, default=0.8)
    ap.add_argument("--time", default="day", choices=TIME)
    a = ap.parse_args()
    img = Image.open(a.src)
    alpha = img.getchannel("A") if "A" in img.getbands() else None
    rgb = np.asarray(img.convert("RGB"), float)
    # Vignettes are transparent: measure the picture only, not the empty ground.
    mask = np.asarray(alpha) > 16 if alpha else None
    out = Image.fromarray(grade(rgb, anchor_stats(a.anchor), a.strength, a.time, mask))
    if alpha:
        out.putalpha(alpha)
    out.save(a.dst)
    print(a.dst)
