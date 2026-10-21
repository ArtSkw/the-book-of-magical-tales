# Shared helpers for the baked book textures (numpy + PIL only).
import numpy as np
from PIL import Image, ImageFilter

def load(p, mode="RGB"):
    return np.asarray(Image.open(p).convert(mode), dtype=np.float32) / 255.0

def save(arr, p, q=82, mode=None):
    a = np.clip(arr * 255.0 + 0.5, 0, 255).astype(np.uint8)
    im = Image.fromarray(a, mode) if mode else Image.fromarray(a)
    im.save(p, "WEBP", quality=q, method=6)
    return im

def tile(arr, w, h, period):
    """Tile a square texture so one tile spans `period` pixels."""
    src = Image.fromarray(np.clip(arr * 255, 0, 255).astype(np.uint8))
    src = src.resize((period, period), Image.LANCZOS)
    s = np.asarray(src, dtype=np.float32) / 255.0
    reps_y, reps_x = h // period + 1, w // period + 1
    big = np.tile(s, (reps_y, reps_x, 1) if s.ndim == 3 else (reps_y, reps_x))
    return big[:h, :w]

def blur(a, r):
    """Separable Gaussian blur of a float array (2D or 3D), radius = sigma in pixels."""
    if r <= 0:
        return a
    k = int(np.ceil(r * 3))
    x = np.arange(-k, k + 1, dtype=np.float32)
    g = np.exp(-0.5 * (x / r) ** 2); g /= g.sum()
    out = a.astype(np.float32)
    for axis in (0, 1):
        pad = [(0, 0)] * out.ndim; pad[axis] = (k, k)
        p_ = np.pad(out, pad, mode="reflect")
        acc = np.zeros_like(out)
        n = out.shape[axis]
        for i, wgt in enumerate(g):
            sl = [slice(None)] * out.ndim; sl[axis] = slice(i, i + n)
            acc += p_[tuple(sl)] * wgt
        out = acc
    return out

def smoothstep(e0, e1, x):
    t = np.clip((x - e0) / (e1 - e0), 0, 1)
    return t * t * (3 - 2 * t)

def normal_from_height(h, strength):
    """OpenGL-convention tangent-space normal map from a height field (rows go down the image)."""
    gy, gx = np.gradient(h)
    n = np.stack([-gx * strength, gy * strength, np.ones_like(h)], -1)
    n /= np.linalg.norm(n, axis=-1, keepdims=True)
    return n * 0.5 + 0.5

def blend_normals(a, b):
    """Whiteout blend of two encoded normal maps."""
    na, nb = a * 2 - 1, b * 2 - 1
    n = np.stack([na[..., 0] + nb[..., 0], na[..., 1] + nb[..., 1], na[..., 2] * nb[..., 2]], -1)
    n /= np.linalg.norm(n, axis=-1, keepdims=True)
    return n * 0.5 + 0.5

def value_noise(w, h, cell, seed):
    rng = np.random.default_rng(seed)
    gw, gh = w // cell + 2, h // cell + 2
    g = rng.random((gh, gw)).astype(np.float32)
    im = Image.fromarray(g, "F").resize((gw * cell, gh * cell), Image.BICUBIC)
    return np.asarray(im, dtype=np.float32)[:h, :w]

def fbm(w, h, cells, seed):
    out = np.zeros((h, w), np.float32)
    amp, tot = 1.0, 0.0
    for i, c in enumerate(cells):
        out += value_noise(w, h, c, seed + i) * amp
        tot += amp
        amp *= 0.55
    return out / tot
