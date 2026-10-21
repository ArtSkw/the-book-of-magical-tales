#!/usr/bin/env bash
# Headless capture with virtual time, so CSS/WebGL animations actually run.
# Usage: prototypes/shot.sh <path-and-query> <out.png> [width] [height] [ms]
set -euo pipefail
B="$(find ~/Library/Caches/ms-playwright -name chrome-headless-shell -type f | sort | tail -1)"
url="http://127.0.0.1:${PORT:-5173}/the-book-of-magical-tales/$1"
prof="$(mktemp -d)"
"$B" --headless --hide-scrollbars --user-data-dir="$prof" --disk-cache-size=1 --use-angle=swiftshader --enable-unsafe-swiftshader \
  --window-size="${3:-1280},${4:-860}" --virtual-time-budget="${5:-7000}" \
  --screenshot="$2" "$url" >/dev/null 2>&1
rm -rf "$prof"
echo "$2"
