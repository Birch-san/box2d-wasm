#!/usr/bin/env bash
set -eo pipefail
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

Red='\033[0;31m'
Purple='\033[0;35m'
NC='\033[0m' # No Color

if ! [[ "$PWD" -ef "$DIR/build/common" ]]; then
  >&2 echo -e "${Red}This script is meant to be run from <repository_root>/box2d-wasm/build/common${NC}"
  exit 1
fi

: "${WEBIDL_TO_TS:="$DIR/node_modules/webidl-to-ts"}"
if test -d "${WEBIDL_TO_TS-}"; then
  >&2 echo -e "webidl-to-ts found at: $WEBIDL_TO_TS"
else
  >&2 echo -e "${Red}webidl-to-ts directory not found at: $WEBIDL_TO_TS${NC}"
  >&2 echo -e "A symlink node_modules/webidl-to-ts should be created when you install this package (box2d-wasm) via pnpm:${NC}"
  >&2 echo -e "${Purple}pnpm i${NC}"
  exit 1
fi

set -x
# change directory so that Node module resolution will search for its dependencies releative to where webidl-to-ts is installed, not box2d-wasm
cd $WEBIDL_TO_TS
# requires Node 14.0.0 for running ES modules
exec node --experimental-specifier-resolution=node --harmony "dist/index.js" -f "$DIR/Box2D.idl" -n Box2D -o "$DIR/dist/Box2D.d.ts"