# Book texture tools

Rebuild the 3D book's baked textures (needed after changing `SQUARE`/`HINGE` in `src/book/book.js`).

- `art/` — source art generated once with Codex (prompts in `prompts/`, generator `gen1.sh <dir> <id>`).
- `bake_art.py art/ ../../../public/assets/book3d/textures/ cover parchment runner boardin spine feather` — derives colour/normal/metal-roughness maps and draws the procedural textures (run from this folder).
- `bake_lib.py` — downscales/converts library downloads (Poly Haven, ambientCG); see `public/assets/book3d/LICENSES.md`.
- `bake_room.py <raw png> ../../../public/assets/book3d/textures/room_wall.webp` — the painted far wall of the room (prompt `../../prompts/room-wall.txt`), out of focus; prints the fire's centre (`HEARTH` in `src/book/room.js`).
- `bake_room_fire.py ../../../public/assets/book3d/textures/room_wall.webp ../../../public/assets/book3d/textures/room_fire.webp` — the hearth's mask (flames, embers, firelit stone) the wall's shader animates; re-run after re-baking the wall (prints `FIRE` for `room.js`).
