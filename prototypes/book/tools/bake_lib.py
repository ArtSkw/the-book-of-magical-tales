# Re-encode the downloaded CC0 textures into the book3d folder (resize + WebP).
import sys, os
from PIL import Image
dl, out = sys.argv[1], sys.argv[2]
os.makedirs(out, exist_ok=True)
jobs = [
    # (source, dest, size, quality, mode)
    ("ph_tex/wood_table_worn_diff_2k.jpg", "desk_diff.webp", 2048, 76, "RGB"),
    ("ph_tex/wood_table_worn_nor_gl_1k.jpg", "desk_nor.webp", 1024, 82, "RGB"),
    ("ph_tex/wood_table_worn_rough_1k.jpg", "desk_rough.webp", 512, 80, "L"),
    ("ph_tex/brown_leather_albedo_1k.jpg", "leather_diff.webp", 1024, 80, "RGB"),
    ("ph_tex/brown_leather_nor_gl_1k.jpg", "leather_nor.webp", 1024, 82, "RGB"),
    ("ph_tex/brown_leather_rough_1k.jpg", "leather_rough.webp", 512, 80, "L"),
    ("acg/Metal007/Metal007_1K-JPG_Color.jpg", "brass_col.webp", 512, 80, "RGB"),
    ("acg/Metal007/Metal007_1K-JPG_NormalGL.jpg", "brass_nor.webp", 512, 82, "RGB"),
    ("acg/Metal007/Metal007_1K-JPG_Roughness.jpg", "brass_rough.webp", 512, 80, "L"),
    ("acg/Paper002/Paper002_1K-JPG_NormalGL.jpg", "paper_nor.webp", 1024, 84, "RGB"),
    ("acg/Fabric030/Fabric030_1K-JPG_NormalGL.jpg", "weave_nor.webp", 512, 82, "RGB"),
]
for src, dst, size, q, mode in jobs:
    im = Image.open(os.path.join(dl, src)).convert(mode)
    if im.size[0] != size:
        im = im.resize((size, size), Image.LANCZOS)
    p = os.path.join(out, dst)
    im.save(p, "WEBP", quality=q, method=6)
    print(f"{dst:22s} {im.size} {os.path.getsize(p)//1024} KB")
