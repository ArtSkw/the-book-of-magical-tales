#!/usr/bin/env bash
# One Codex image generation call. gen1.sh <gen-dir> <id>
set -euo pipefail
G="$1"; id="$2"; out="$G/out/$id.png"
first="$(head -1 "$G/prompts/$id.txt")"; ref="${first#REF: }"
brief="$(tail -n +2 "$G/prompts/$id.txt")"
imgs=(); [ "$ref" != "none" ] && imgs=(-i "$G/refs/$ref")
codex exec --skip-git-repo-check -s workspace-write -C "$G" ${imgs[@]+"${imgs[@]}"} - <<PROMPT
You are producing one texture asset for a 3D scene. Attached images (if any) are style references as explained in the brief.
Use your built-in image generation tool exactly ONCE to create the image described below. Do not generate variations, do not edit the result, do not draw it with code.
Then copy the generated image file (the file your image generation call just produced, under ~/.codex/generated_images/) to: $out
Reply only with the final path.

=== BRIEF ===
$brief
PROMPT
test -f "$out" && echo "OK $id"
