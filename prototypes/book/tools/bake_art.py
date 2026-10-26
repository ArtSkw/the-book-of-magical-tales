# Derives the book's texture sets from the generated art and draws the procedural ones.
#   bake_art.py <gen-out dir> <bake dir> <job...>   jobs: cover parchment runner boardin spine feather
import sys, os, colorsys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from texlib import load, save, tile, blur, smoothstep, normal_from_height, blend_normals, fbm

src, out = sys.argv[1], sys.argv[2]
jobs = set(sys.argv[3:])
os.makedirs(out, exist_ok=True)
kb = lambda p: f"{os.path.getsize(p) // 1024} KB"

# Book dimensions (must match src/book/book.js)
W, D, SQUARE, HINGE, R = 1.0, 1.38, 0.058, 0.012, 0.006
BW, BD = W + SQUARE + HINGE, D + SQUARE * 2           # board
CW, CH = 1024, int(round(1024 * (BD - 2 * R) / (BW - 2 * R)))  # cover / inner-face texture

leather_n = load(os.path.join(out, "leather_nor.webp"))
leather_c = load(os.path.join(out, "leather_diff.webp"))
leather_r = load(os.path.join(out, "leather_rough.webp"), "L")

def hsv(a):
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    mx, mn = a.max(-1), a.min(-1)
    v = mx
    s = np.where(mx > 1e-4, (mx - mn) / np.maximum(mx, 1e-4), 0)
    d = np.maximum(mx - mn, 1e-4)
    h = np.where(mx == r, ((g - b) / d) % 6, np.where(mx == g, (b - r) / d + 2, (r - g) / d + 4)) * 60
    return h, s, v

if "cover" in jobs:
    im = Image.open(os.path.join(src, "cover.png")).convert("RGB").resize((CW, CH), Image.LANCZOS)
    a = np.asarray(im, np.float32) / 255
    h, s, v = hsv(a)
    lum = a @ np.array([0.299, 0.587, 0.114], np.float32)
    hue_gold = smoothstep(18, 30, h) * (1 - smoothstep(55, 68, h))
    gold = hue_gold * smoothstep(0.36, 0.55, v) * smoothstep(0.22, 0.4, s)
    gold = np.clip(blur(gold, 0.6) * 1.15, 0, 1)
    enamel = (1 - hue_gold) * smoothstep(0.28, 0.42, v) * smoothstep(0.18, 0.35, s) * (1 - gold)
    # cartouche interior and plain leather keep their grain; tooling reads as raised gold
    height = blur(gold, 1.2) * 0.8 + blur(enamel, 1.0) * 0.35 + (lum - blur(lum, 3)) * 1.5
    nrm = normal_from_height(height, 7.0)
    nrm = blend_normals(nrm, tile(leather_n, CW, CH, 340) * [1, 1, 1] * 0.35 + np.array([0.5, 0.5, 1.0]) * 0.65)
    rough = 0.72 - 0.1 * lum + (tile(leather_r, CW, CH, 340) - 0.5) * 0.15
    rough = rough * (1 - gold) + 0.3 * gold
    rough = rough * (1 - enamel) + 0.34 * enamel
    metal = gold * 0.95
    orm = np.stack([np.ones_like(lum), np.clip(rough, 0.05, 1), metal], -1)
    # albedo: metals keep their colour, leather a touch deeper
    alb = a * (1 - gold[..., None]) * np.array([0.95, 0.92, 0.9]) + a * gold[..., None] * np.array([1.05, 1.0, 0.92])
    for name, arr, q in (("cover_diff", alb, 86), ("cover_nor", nrm, 86), ("cover_orm", orm, 84)):
        p = os.path.join(out, name + ".webp"); save(arr, p, q); print(name, CW, CH, kb(p))

if "parchment" in jobs:
    im = Image.open(os.path.join(src, "parchment.png")).convert("RGB")
    PW, PH = 1024, int(round(1024 * 1.38))
    top = (im.size[1] - PH) // 2
    a = np.asarray(im.crop((0, top, PW, top + PH)), np.float32) / 255
    lum = a @ np.array([0.299, 0.587, 0.114], np.float32)
    # calm the formation a little so ink keeps its contrast, keep the fibres
    base = blur(lum, 12)
    detail = lum - base
    tone = fbm(PW, PH, [380, 190, 90], 7)
    yy, xx = np.mgrid[0:PH, 0:PW].astype(np.float32)
    ex = np.minimum(xx, PW - 1 - xx) / PW
    ey = np.minimum(yy, PH - 1 - yy) / PW
    e = np.minimum(ex, ey)
    rim = 1 - smoothstep(0.0, 0.045, e)                      # darker, warmer edge
    broad = 1 - smoothstep(0.0, 0.28, e)                      # soft ageing towards the edge
    paper = np.array([0.95, 0.9, 0.785], np.float32)          # warm ivory
    age = np.array([0.74, 0.58, 0.38], np.float32)
    shade = 1 + detail[..., None] * 1.25 + (tone[..., None] - 0.5) * 0.07
    col = paper * shade
    col = col * (1 - (0.12 * broad + 0.3 * rim * rim)[..., None]) + age * (0.12 * broad + 0.3 * rim * rim)[..., None] * 0.55
    # keep the paper's own specks and foxing (darker, warmer than its formation)
    specks = np.clip((base - lum) * 3.0, 0, 1)
    col = col * (1 - specks[..., None] * np.array([0.25, 0.35, 0.5]))
    col = np.clip(col, 0, 1)
    p = os.path.join(out, "parchment.webp"); save(col, p, 86); print("parchment", PW, PH, kb(p))
    # fibre relief for the 3D page (shared by every page, tiled once)
    nrm = normal_from_height(blur(detail, 0.8), 9.0)
    p = os.path.join(out, "parchment_nor.webp"); save(nrm, p, 80); print("parchment_nor", kb(p))

if "runner" in jobs:
    im = Image.open(os.path.join(src, "runner.png")).convert("RGB")
    a = np.asarray(im, np.float32) / 255
    H, Wd = a.shape[:2]
    # make it tile left-right: cross-fade the last band into the first
    bw = 160
    t = smoothstep(0, 1, np.linspace(0, 1, bw, dtype=np.float32))[None, :, None]
    left = a[:, :bw]; right = a[:, Wd - bw:]
    a2 = a[:, : Wd - bw].copy()
    a2[:, :bw] = right * (1 - t) + left * t
    im2 = Image.fromarray((np.clip(a2, 0, 1) * 255).astype(np.uint8)).resize((1024, 768), Image.LANCZOS)
    p = os.path.join(out, "runner_diff.webp"); im2.save(p, "WEBP", quality=84, method=6); print("runner", im2.size, kb(p))

if "boardin" in jobs:
    # inside of a board: leather turn-ins with gold fillets and a dotted roll; pastedown hidden by pages
    S = 4  # supersample for crisp lines
    w, h = CW * S, CH * S
    px = (w / (BW - 2 * R))
    m = Image.new("L", (w, h), 0)      # gold mask
    bl = Image.new("L", (w, h), 0)     # blind tooling (pressed, no gold)
    dg, db = ImageDraw.Draw(m), ImageDraw.Draw(bl)
    def frame(draw, inset, width, sides=(1, 1, 1, 1)):
        i, lw = inset * px, max(1, int(width * px))
        x0, y0, x1, y1 = i, i, w - i, h - i
        # u = 0 is the spine side (left of the image); fore-edge on the right
        draw.line([(0, y0), (x1, y0)], fill=255, width=lw)
        draw.line([(0, y1), (x1, y1)], fill=255, width=lw)
        draw.line([(x1, y0 - lw / 2), (x1, y1 + lw / 2)], fill=255, width=lw)
    frame(dg, 0.012, 0.0028)
    frame(dg, 0.031, 0.0016)
    frame(db, 0.040, 0.0022)
    # dotted roll between the fillets, with a small lozenge every few dots
    step = 0.0072 * px; r0 = 0.0016 * px; yi = 0.0215 * px
    def dots(xa, ya, xb, yb):
        n = int(np.hypot(xb - xa, yb - ya) / step)
        for k in range(n + 1):
            x = xa + (xb - xa) * k / max(n, 1); y = ya + (yb - ya) * k / max(n, 1)
            if k % 5 == 0:
                q = r0 * 2.1
                dg.polygon([(x - q, y), (x, y - q), (x + q, y), (x, y + q)], fill=255)
            else:
                dg.ellipse([x - r0, y - r0, x + r0, y + r0], fill=255)
    dots(0, yi, w - yi, yi); dots(0, h - yi, w - yi, h - yi); dots(w - yi, yi, w - yi, h - yi)
    m = np.asarray(m.resize((CW, CH), Image.LANCZOS), np.float32) / 255
    bl = np.asarray(bl.resize((CW, CH), Image.LANCZOS), np.float32) / 255
    yy, xx = np.mgrid[0:CH, 0:CW].astype(np.float32)
    e = np.minimum(np.minimum(CW - 1 - xx, yy), CH - 1 - yy) / CW
    wear = 1 - smoothstep(0.0, 0.03, e)
    lc = tile(leather_c, CW, CH, 300)
    lum = lc @ np.array([0.299, 0.587, 0.114], np.float32)
    choc = np.array([0.33, 0.2, 0.13], np.float32) * (0.75 + 0.6 * lum[..., None])
    choc = choc * (1 - 0.35 * wear[..., None]) * (1 - 0.35 * bl[..., None])
    rub = fbm(CW, CH, [60, 20, 7], 3)
    gold = m * smoothstep(0.25, 0.6, rub * 0.6 + 0.55)
    goldc = np.array([0.86, 0.66, 0.34], np.float32) * (0.85 + 0.3 * rub[..., None])
    alb = choc * (1 - gold[..., None]) + goldc * gold[..., None]
    height = -blur(m, 0.8) * 0.6 - blur(bl, 0.9) * 0.8
    nrm = blend_normals(normal_from_height(height, 6.0), tile(leather_n, CW, CH, 300))
    rough = (0.62 + (tile(leather_r, CW, CH, 300) - 0.5) * 0.3) * (1 - gold) + 0.3 * gold
    orm = np.stack([np.ones_like(rough), np.clip(rough, 0.05, 1), gold], -1)
    for name, arr, q in (("boardin_diff", alb, 84), ("boardin_nor", nrm, 84), ("boardin_orm", orm, 82)):
        p = os.path.join(out, name + ".webp"); save(arr, p, q); print(name, kb(p))

if "spine" in jobs:
    # u across the spine (0 = back board hinge .. 1 = front board hinge), v head -> tail
    SW, SH = 384, 1536
    BANDS = [0.2, 0.35, 0.5, 0.65, 0.8]
    S = 3
    w, h = SW * S, SH * S
    m = Image.new("L", (w, h), 0); dg = ImageDraw.Draw(m)
    def hline(v, lw):
        y = v * h
        dg.line([(0.12 * w, y), (0.88 * w, y)], fill=255, width=max(1, int(lw * S)))
    for b in BANDS:
        for dv in (-0.0175, 0.0175):
            hline(b + dv, 3)
            hline(b + dv * 1.35, 1.5)
        # beading on the band itself
        y = b * h
        for k in range(14):
            x = (0.16 + 0.68 * k / 13) * w
            dg.ellipse([x - 3 * S, y - 3 * S, x + 3 * S, y + 3 * S], fill=255)
    panels = [0.08] + [(BANDS[i] + BANDS[i + 1]) / 2 for i in range(len(BANDS) - 1)] + [0.92]
    def fleuron(cx, cy, r):
        for k in range(4):
            ang = k * np.pi / 2
            ex, ey = cx + np.cos(ang) * r * 0.55, cy + np.sin(ang) * r * 0.55
            dg.ellipse([ex - r * 0.42, ey - r * 0.42, ex + r * 0.42, ey + r * 0.42], fill=255)
        dg.ellipse([cx - r * 0.3, cy - r * 0.3, cx + r * 0.3, cy + r * 0.3], fill=0)
        dg.ellipse([cx - r * 0.16, cy - r * 0.16, cx + r * 0.16, cy + r * 0.16], fill=255)
        for k in range(4):
            ang = np.pi / 4 + k * np.pi / 2
            ex, ey = cx + np.cos(ang) * r * 1.1, cy + np.sin(ang) * r * 1.1
            dg.ellipse([ex - r * 0.12, ey - r * 0.12, ex + r * 0.12, ey + r * 0.12], fill=255)
    for i, c in enumerate(panels[1:-1]):
        fleuron(0.5 * w, c * h, 0.16 * w)
        for sy in (-1, 1):
            for sx in (-1, 1):
                fleuron((0.5 + sx * 0.24) * w, (c + sy * 0.045) * h, 0.05 * w)
    m = np.asarray(m.resize((SW, SH), Image.LANCZOS), np.float32) / 255
    lc = tile(leather_c, SW, SH, 200)
    lum = lc @ np.array([0.299, 0.587, 0.114], np.float32)
    choc = np.array([0.2, 0.115, 0.075], np.float32) * (0.75 + 0.6 * lum[..., None])
    rub = fbm(SW, SH, [40, 14, 5], 5)
    gold = m * smoothstep(0.25, 0.6, rub * 0.6 + 0.55)
    goldc = np.array([0.86, 0.66, 0.34], np.float32) * (0.85 + 0.3 * rub[..., None])
    alb = choc * (1 - gold[..., None]) + goldc * gold[..., None]
    nrm = blend_normals(normal_from_height(-blur(m, 0.8) * 0.6, 5.0), tile(leather_n, SW, SH, 200))
    rough = (0.6 + (tile(leather_r, SW, SH, 200) - 0.5) * 0.3) * (1 - gold) + 0.3 * gold
    orm = np.stack([np.ones_like(rough), np.clip(rough, 0.05, 1), gold], -1)
    for name, arr, q in (("spine_diff", alb, 84), ("spine_nor", nrm, 84), ("spine_orm", orm, 82)):
        p = os.path.join(out, name + ".webp"); save(arr, p, q); print(name, kb(p))

if "feather" in jobs:
    im = Image.open(os.path.join(src, "feather.png")).convert("RGB")
    a = np.asarray(im, np.float32) / 255
    lum = a.max(-1)
    alpha = smoothstep(0.05, 0.16, lum)
    alpha = np.asarray(Image.fromarray((alpha * 255).astype(np.uint8)).filter(ImageFilter.MinFilter(3)), np.float32) / 255
    ys, xs = np.nonzero(alpha > 0.5)
    x0, x1, y0, y1 = xs.min() - 6, xs.max() + 7, ys.min() - 6, ys.max() + 7
    # un-premultiply the dark fringe so edges do not go black
    rgb = a / np.maximum(alpha[..., None], 0.25)
    rgba = np.concatenate([np.clip(rgb, 0, 1), alpha[..., None]], -1)[y0:y1, x0:x1]
    img = Image.fromarray((rgba * 255).astype(np.uint8), "RGBA")
    img = img.resize((256, int(256 * img.size[1] / img.size[0])), Image.LANCZOS)
    p = os.path.join(out, "feather.webp"); img.save(p, "WEBP", quality=86, method=6); print("feather", img.size, kb(p))
