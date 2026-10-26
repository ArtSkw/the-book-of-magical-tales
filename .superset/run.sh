#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

[ -d node_modules ] || npm ci --no-audit --no-fund

port="$(./.superset/port.sh get)"
# Something outside Superset (e.g. `npm run dev` in the main checkout) grabbed our port.
if lsof -nP -iTCP:"$port" -sTCP:LISTEN -t >/dev/null 2>&1; then
  ./.superset/port.sh release
  port="$(./.superset/port.sh claim)"
fi

echo "Dev server: http://127.0.0.1:$port/the-book-of-magical-tales/"
exec npm run dev -- --port "$port" --strictPort
