#!/usr/bin/env bash
# Runs the full verification suite: Rust workspace tests, halma-opslag SQLite tests,
# WebAssembly core build, Svelte/TypeScript type check, Vite site build, Vitest suite,
# and the unoptimized timing test for the computer opponent.
# Exit code: 0 if all checks pass, 1 otherwise.
set -uo pipefail
cd "$(dirname "$0")/.."

[ -d /usr/local/cargo ] && export CARGO_HOME="${CARGO_HOME:-/usr/local/cargo}" RUSTUP_HOME="${RUSTUP_HOME:-/usr/local/rustup}"
export PATH="${CARGO_HOME:-$HOME/.cargo}/bin:$PATH"
# Vitest krijgt elke kern, tot 8: de Rust-tests zijn klaar voordat de web-tests goed op gang zijn (gemeten 2026-11-13).
kernen=$(nproc 2>/dev/null || echo 4)
export VITEST_MAX_WORKERS="${VITEST_MAX_WORKERS:-$(( kernen < 8 ? kernen : 8 ))}"

logs=$(mktemp -d)
start=$(date +%s)
verlopen() { echo $(( $(date +%s) - $1 )); }
faal() { echo "FAILED: $1 (logboek: $2)"; tail -n 60 "$2"; exit 1; }

# 1. npm ci en de Rust-toolchain (rust-toolchain.toml: stable plus doelen) tegelijk: ze hebben niets met elkaar te maken.
npm --prefix web ci --no-audit --no-fund >"$logs/npm-ci.log" 2>&1 &
npm_pid=$!
rustc --version >"$logs/toolchain.log" 2>&1 || faal "Rust-toolchain installeren" "$logs/toolchain.log"
wait "$npm_pid" || faal "npm ci" "$logs/npm-ci.log"

# 2. Rust en web tegelijk.
(
  set -e
  t=$(date +%s)
  cargo test --workspace
  cargo test -p halma-opslag --features rusqlite
  echo "Rust-tests klaar in $(verlopen "$t") s"
) >"$logs/rust.log" 2>&1 &
rust_pid=$!
(
  set -e
  t=$(date +%s)
  export CARGO_TARGET_DIR="$PWD/target-web"
  # Eerst de wasm: de site en de tests hebben hem allebei nodig. Daarna lopen de typecontrole met de site-build en de tests tegelijk.
  npm --prefix web run wasm
  npm --prefix web run build:site >"$logs/web-bouw.log" 2>&1 &
  bouw_pid=$!
  (cd web && npx vitest run) >"$logs/web-tests.log" 2>&1 &
  tests_pid=$!
  bouw_code=0; tests_code=0
  wait "$bouw_pid" || bouw_code=$?
  wait "$tests_pid" || tests_code=$?
  # Het deel dat faalde komt onderaan, zodat het einde van het logboek de fout toont.
  if [ "$bouw_code" -ne 0 ]; then cat "$logs/web-tests.log" "$logs/web-bouw.log"; else cat "$logs/web-bouw.log" "$logs/web-tests.log"; fi
  # Met || exit: set -e stopt niet op een mislukte eerste toets in een &&-reeks.
  [ "$bouw_code" -eq 0 ] && [ "$tests_code" -eq 0 ] || exit 1
  echo "Web klaar in $(verlopen "$t") s"
) >"$logs/web.log" 2>&1 &
web_pid=$!
wait "$rust_pid"; rust_code=$?
wait "$web_pid"; web_code=$?
[ "$rust_code" -eq 0 ] || faal "Rust-tests" "$logs/rust.log"
[ "$web_code" -eq 0 ] || faal "web-build en web-tests" "$logs/web.log"

# 3. De test die echte tijd meet, alleen en op een stille machine. halma-core draait in de gewone tests met opt-level 2 (Cargo.toml);
#    deze test meet juist de ongeoptimaliseerde debug-build, zoals vóór die wijziging, en houdt zo dezelfde grens van 500 ms.
cargo test -p halma-core --config 'profile.dev.package.halma-core.opt-level=0' -- --ignored zet_kiezen_kost_weinig_tijd >"$logs/tijdtest.log" 2>&1 \
  && grep -q "zet_kiezen_kost_weinig_tijd ... ok" "$logs/tijdtest.log" \
  || faal "zet_kiezen_kost_weinig_tijd (draait niet of faalt)" "$logs/tijdtest.log"

rust_tests=$(grep -h "^test result" "$logs/rust.log" | sed -E 's/.* ok\. ([0-9]+) passed.*/\1/' | awk '{s+=$1} END{print s}')
web_tests=$(sed 's/\x1b\[[0-9;]*m//g' "$logs/web.log" | sed -nE 's/^ *Tests +([0-9]+) passed.*/\1/p' | tail -1)
echo "$(grep -h "klaar in" "$logs/rust.log"), $(grep -h "klaar in" "$logs/web.log")"
echo "Volledige check groen in $(verlopen "$start") s: $rust_tests Rust-tests, $web_tests web-tests, plus de tijdtest."
