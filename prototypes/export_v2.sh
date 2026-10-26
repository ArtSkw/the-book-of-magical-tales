#!/usr/bin/env bash
# Grade one raw generation and export it into the book:
#   prototypes/export_v2.sh <raw-id> <tale-dir> <page-name> <time> [plate-focus]
# e.g. export_v2.sh a2-p1c dragon-bridge p1 evening          (time "none" skips grading, for emblems)
#      export_v2.sh a2-p8e dragon-bridge p8 deepdusk 0.4     (a plate: the 1536x1024 master is cropped
#                                                             to 5:4 = 1280x1024; 0 = keep the left
#                                                             edge, 0.5 = centre, 1 = keep the right)
# The graded master keeps the full frame, so a plate can be re-cropped later without regrading:
#   python3 prototypes/export_webp.py prototypes/graded/a2-p8.png public/assets/illustrations/v2/dragon-bridge/p8.webp --plate 0.4
set -euo pipefail
root="$(cd "$(dirname "$0")" && pwd -P)"
raw="$root/raw/$1.png"
case "$1" in a2-*) graded="$root/graded/a2-$3.png";; mh-*) graded="$root/graded/mh-$3.png";; esac
if [ "$4" = none ]; then cp "$raw" "$graded"; else (cd "$root/.." && python3 prototypes/grade.py "$raw" "$graded" --time "$4"); fi
python3 "$root/export_webp.py" "$graded" "$root/../public/assets/illustrations/v2/$2/$3.webp" ${5:+--plate "$5"}
