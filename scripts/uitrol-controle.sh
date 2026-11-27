#!/usr/bin/env bash
# Weigert een uitrol naar Spelers van een site zonder 3D-bord (feature 251).
# Zonder 3D-bord toont de app alleen het foutscherm: er is geen plat scherm meer.
# De volledige check bouwt de site bewust zonder 3D-bord; een uitrol mag dat nooit.
# Gebruik: scripts/uitrol-controle.sh [map van de gebouwde site]   (standaard web/dist)
# Exitcode: 0 als het 3D-bord erin zit, anders 1.
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"
dist="${1:-web/dist}"
[ -d "$dist/assets" ] || { echo "Deploy rejected: $dist/assets does not exist. Build first: npm --prefix web run wasm3d && npm --prefix web run build" >&2; exit 1; }
code=$(find "$dist/assets" -maxdepth 1 -name 'halma_bord3d-*.js' | head -1)
wasm=$(find "$dist/assets" -maxdepth 1 -name 'halma_bord3d_bg-*.wasm' | head -1)
if [ -z "$code" ] || [ -z "$wasm" ]; then
  echo "Deploy rejected: the 3D board WASM is missing from $dist." >&2
  echo "Build the 3D board and site first: npm --prefix web run wasm3d && npm --prefix web run build" >&2
  exit 1
fi
echo "3D-bord zit in $dist: $(basename "$wasm")"
[ -f "$wasm.xz" ] || echo "LET OP: $(basename "$wasm").xz ontbreekt (programma xz op de bouwmachine?): het 3D-bord komt ongeperst, 4,7 MB over de lijn in plaats van 3,2 MB." >&2
