# Assets of the 3D book scene (`index.html`, `src/book/`)

Every third-party file here is **CC0 1.0 (public domain)**; no attribution is required, but sources
are recorded so they can be re-downloaded or swapped. Everything else in this folder was made for
this project (generated or baked by script). Textures and models: about 5.2 MB; the sounds in
`sound/` are listed with their sources in `scripts/sfx/` (`picks.json`, `manifest.json`).

## Third-party (CC0)

| File | Source | Author | License | What was changed |
| --- | --- | --- | --- | --- |
| `textures/desk_diff.webp` (2048²) | Poly Haven "Wood Table Worn": https://polyhaven.com/a/wood_table_worn (`wood_table_worn_diff_2k.jpg`) | Dimitrios Savva, Rico Cilliers (Poly Haven) | CC0 1.0 | re-encoded to WebP q76 |
| `textures/desk_nor.webp` (1024²) | same asset, `wood_table_worn_nor_gl_1k.jpg` | Dimitrios Savva, Rico Cilliers | CC0 1.0 | WebP q82 |
| `textures/desk_rough.webp` (512²) | same asset, `wood_table_worn_rough_1k.jpg` | Dimitrios Savva, Rico Cilliers | CC0 1.0 | downscaled, WebP |
| `textures/leather_diff.webp` (1024²) | Poly Haven "Brown Leather": https://polyhaven.com/a/brown_leather (`brown_leather_albedo_1k.jpg`) | Rob Tuytel (Poly Haven) | CC0 1.0 | WebP q80 |
| `textures/leather_nor.webp` (1024²) | same asset, `brown_leather_nor_gl_1k.jpg` | Rob Tuytel | CC0 1.0 | WebP q82 |
| `textures/leather_rough.webp` (512²) | same asset, `brown_leather_rough_1k.jpg` | Rob Tuytel | CC0 1.0 | downscaled, WebP |
| `textures/brass_col.webp`, `brass_rough.webp` (512²) | ambientCG "Metal 007": https://ambientcg.com/view?id=Metal007 (1K-JPG: Color, Roughness) | ambientCG (Lennart Demes) | CC0 1.0 | downscaled, WebP; used as worn-brass patina and scratches |
| `textures/weave_nor.webp` (512²) | ambientCG "Fabric 030": https://ambientcg.com/view?id=Fabric030 (1K-JPG NormalGL) | ambientCG (Lennart Demes) | CC0 1.0 | downscaled, WebP; weave relief of the runner |
| `models/brass_pot.glb` | Poly Haven "Brass Pot 01": https://polyhaven.com/a/brass_pot_01 (1k glTF) | Rico Cilliers (Poly Haven) | CC0 1.0 | gltf-transform `optimize` (512 px WebP, quantised) |
| `models/brass_vase.glb` | Poly Haven "Brass Vase 03": https://polyhaven.com/a/brass_vase_03 (1k glTF) | Rico Cilliers (Poly Haven) | CC0 1.0 | gltf-transform `optimize` (512 px WebP, quantised) |
| `models/chest.glb` | Poly Haven "Treasure Chest": https://polyhaven.com/a/treasure_chest (1k glTF) | Rico Cilliers (Poly Haven) | CC0 1.0 | gltf-transform `optimize` (512 px WebP, quantised, simplified to ~12 % of the triangles) |
| `models/goblet.glb` | Poly Haven "Brass Goblets": https://polyhaven.com/a/brass_goblets (1k glTF) | Tina (Poly Haven) | CC0 1.0 | kept only `brass_goblet_01`, then gltf-transform `optimize` (512 px WebP, quantised) |
| `models/apple.glb` | Poly Haven "Food Apple 01": https://polyhaven.com/a/food_apple_01 (1k glTF) | Oliver Harries (Poly Haven) | CC0 1.0 | gltf-transform `optimize` (512 px WebP, quantised) |

Downloaded through the public Poly Haven API (`https://api.polyhaven.com/files/<id>`) and from
ambientCG (`https://ambientcg.com/get?file=<id>_1K-JPG.zip`) on 2026-10-19.
Licenses: https://polyhaven.com/license and https://docs.ambientcg.com/license/ (all CC0).

Note: the optimised `.glb` files use `KHR_mesh_quantization` and `EXT_texture_webp`; three.js
`GLTFLoader` supports both without extra decoders.

## Made for this project

Generated with the image generation tool in Codex (one call per image, flat and evenly lit so they
work as textures; no lettering was generated, all text is set at runtime in EB Garamond):

| File | How it was made |
| --- | --- |
| `textures/cover_diff.webp` (1024×1436) | generated: tooled dark-brown leather front board with gold filigree, enamel flowers and an empty cartouche (style reference: the cover of the earlier 2D edition, `public/assets/scene/premium-book-cover-closed-v1.webp`, now only in git history); resized to the board's aspect. The title is drawn into the cartouche at runtime (`book.js`, `coverMaps`) |
| `textures/cover_nor.webp`, `cover_orm.webp` | derived from the cover art with numpy/PIL: a gold mask (hue/saturation/value) drives metalness 0.95 and roughness 0.3; enamel is glossy; height from the gold and enamel masks plus fine leather grain → OpenGL normal map, blended with the leather normal. ORM = (AO 1, roughness, metalness). At runtime the title is embossed into the normal map and made metallic in the ORM |
| `textures/parchment.webp` (1024×1413) | generated: handmade rag paper (fibres, soft formation, faint foxing); calmed, warmed and aged towards the edges with numpy/PIL. Drawn under the text of every page (`pageArt.js`) |
| `textures/parchment_nor.webp` | derived from the parchment: fibre relief (high-passed luminance → normal map) for the 3D page material |
| `textures/runner_diff.webp` (1024×768) | generated: woven medieval tapestry runner (madder red, ochre, indigo); made to tile left–right by cross-fading the ends |
| `textures/feather.webp` (256×1113, alpha) | generated: a single quill feather on flat black; alpha keyed from the black background |
| `textures/room_wall.webp` (1536×1024) | generated: the far wall of the chamber behind the desk, a hearth, shelves and a door (`prototypes/prompts/room-wall.txt`); blurred out of focus, darkened towards its edges by `prototypes/book/tools/bake_room.py` |
| `textures/room_fire.webp` (128×128, lossless) | derived from `room_wall.webp` with numpy/PIL (`prototypes/book/tools/bake_room_fire.py`): where its hearth's flames (R), embers (G) and firelit stone and floor (B) are, for the wall's shader to bring the fire to life (`room.js`, "the living hearth") |

Baked procedurally with numpy/PIL (the brown leather above as grain):

| File | How it was made |
| --- | --- |
| `textures/boardin_diff/nor/orm.webp` | inside of the boards: leather turn-ins with two gold fillets, a dotted roll with lozenges and a blind-tooled line, laid out for the board size in `book.js` (`SQUARE`, `HINGE`, `RAD`) |
| `textures/spine_diff/nor/orm.webp` | spine: gold rules and beading at the five raised bands (`SPINE_BANDS` in `book.js`), fleurons in the panels |

Built in code at runtime (no files): the book geometry (rounded boards, brass corner pieces, clasps,
raised-band spine, page blocks with draped gilded fore-edges, curling pages, the pool of leaves that
riffle to a tale), the gilded leaf-edge texture, the candle and chamberstick with drips, the flame
(teardrop shader: blue base, dim wick zone, warm-white core, orange envelope) and its halo sprites,
the wax melt pool, the quill (curved V-shaped vane laid on the feather texture's own shaft line,
tapered ink-stained shaft, stood in the inkwell's neck), pewter inkwell, key, folded letter with a
wax seal, instanced lavender bundles, the runner's fringe, dust motes, page typography and
ornaments.

The four silk ribbon bookmarks (`src/book/ribbons.js`, one per tale in `tales.js`) are also
made at runtime: colour and roughness/metalness maps drawn on a canvas per ribbon (warp streaks,
woven selvedges, a gold-thread motif — flame, bell, star, trefoil — and a swallow-tail cut with a
few loose threads in alpha), a procedural taffeta-rib normal map, a physical silk material (sheen,
slight anisotropy) and a soft contact-shadow strip. The generic printed pages glimpsed on the
riffling leaves are drawn at runtime in EB Garamond (pseudo-words), like every other page.

The on-screen controls of `index.html` reuse `textures/leather_diff.webp` (Poly Haven
"Brown Leather", CC0, above) as the grain of their leather plaques; no other files were added for
them (gilt, icons and the gold-leaf thumb are CSS and inline SVG).

Font: EB Garamond (SIL Open Font License 1.1, `public/fonts/OFL.txt`), the variable-font files
Google Fonts serves (v33, font version 1.003), self-hosted in `public/fonts/`: the latin subsets as
served, the latin-ext subsets trimmed to Latin Extended-A (pyftsubset) for Polish.

Illustrations shown on the pages are the project's own art from `public/assets/illustrations/v2/`
(see `src/book/pages.js`), not part of this folder.
