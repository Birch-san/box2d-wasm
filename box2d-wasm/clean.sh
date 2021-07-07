#!/usr/bin/env bash
set -euo pipefail
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

rm -rf "$DIR"/build
rm -f "$DIR"/dist/Box2D.d.ts
rm -f "$DIR"/dist/{es,umd}/Box2D{.simd,}.{wasm,js}