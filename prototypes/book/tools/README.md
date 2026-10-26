# Book texture tools

Rebuild the 3D book's baked textures (needed after changing `SQUARE`/`HINGE` in `src/book/book.js`).

- `art/` — source art generated once with Codex (prompts in `prompts/`, generator `gen1.sh <dir> <id>`).
- `bake_art.py art/ ../../../public/assets/book3d/textures/ cover parchment runner boardin spine feather` — derives colour/normal/metal-roughness maps and draws the procedural textures (run from this folder).
- `bake_lib.py` — downscales/converts library downloads (Poly Haven, ambientCG); see `public/assets/book3d/LICENSES.md`.
