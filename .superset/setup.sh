#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

root="${SUPERSET_ROOT_PATH:?SUPERSET_ROOT_PATH is not set}"

# Copy gitignored env files (API keys for Claude/OpenAI tooling) from the main checkout.
# Existing files are left alone so re-running setup never clobbers local edits.
for src in "$root"/.env "$root"/.env.*; do
  [ -f "$src" ] || continue
  name="$(basename "$src")"
  if [ -e "$name" ]; then
    echo "Keeping existing $name"
  else
    cp "$src" "$name"
    echo "Copied $name from main checkout"
  fi
done

npm ci --no-audit --no-fund

port="$(./.superset/port.sh claim)"
echo "Dev server port for this workspace: $port"
