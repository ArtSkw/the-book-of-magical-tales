#!/usr/bin/env bash
# One Codex ImageGen call per asset, clean references only, no edits.
# Usage: prototypes/gen.sh <asset-id>   (prompt: prototypes/prompts/<id>.txt)
set -euo pipefail
root="$(cd "$(dirname "$0")" && pwd -P)"
id="$1"; out="$root/raw/$id.png"
first="$(head -1 "$root/prompts/$id.txt")"
images=()
IFS=',' read -ra refs <<<"${first#REFS:}"
for r in ${refs[@]+"${refs[@]}"}; do r="$(echo "$r" | xargs)"; [ -n "$r" ] && images+=(-i "$root/refs/$r"); done
brief="$(tail -n +2 "$root/prompts/$id.txt")"
codex exec --skip-git-repo-check -s workspace-write -C "$root" ${images[@]+"${images[@]}"} - <<PROMPT
You are producing one illustration asset. Attached images (if any) are references whose roles are explained in the brief.
Use your built-in image generation tool exactly ONCE to create the image described below, landscape orientation unless the brief says otherwise. Do not generate variations, do not edit the result, do not draw it with code. If the brief asks for transparency, keep the alpha channel.
Then copy the generated image file (newest file under ~/.codex/generated_images/) to: $out
Reply only with the final path.

=== BRIEF ===
$brief
PROMPT
test -f "$out" && echo "OK $id"
