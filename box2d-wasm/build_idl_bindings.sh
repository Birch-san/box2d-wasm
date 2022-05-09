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

if [ -f "${WEBIDL_BINDER-}" ]; then
  >&2 echo -e "Using the following webidl_binder.py location: $WEBIDL_BINDER"
else
  >&2 echo -e "${Red}WebIDL binder (the Emscripten tool, webidl_binder.py) was not found at expected location of $WEBIDL_BINDER${NC}"
  >&2 echo -e "You can set WEBIDL_BINDER based on the location of an Emscripten command on your PATH."
  >&2 echo -e "if you installed emscripten via emsdk: source emsdk_env.sh, then set the variable like so:"
  >&2 echo -e "${Purple}"'export WEBIDL_BINDER="$(realpath "$(dirname "$(realpath "$(which emcc)")")/tools/webidl_binder.py")"'"${NC}"
  >&2 echo -e "if you installed emscripten via brew: set the variable like so:"
  >&2 echo -e "${Purple}"'export WEBIDL_BINDER="$(realpath "$(dirname "$(realpath "$(which emcc)")")/../libexec/tools/webidl_binder.py")"'"${NC}"
  >&2 echo -e "if you installed emscripten via Nix: set the variable like so:"
  >&2 echo -e "${Purple}"'export WEBIDL_BINDER="$(realpath "$(dirname "$(realpath "$(which emcc)")")/../share/emscripten/tools/webidl_binder.py")"'"${NC}"
fi

if [[ -f "${PYTHON3-}" && -x "${PYTHON3-}" ]]; then
  >&2 echo -e "Using the following Python binary: $PYTHON3"
else
  >&2 echo -e "${Red}PYTHON3 variable empty/unset/non-executable. Please set to the location of a Python 3 binary.${NC}"
  >&2 echo -e "You can set PYTHON3 based on the location of a python3 binary on your PATH like so:"
  >&2 echo -e "${Purple}"'export PYTHON3="${EMSDK_PYTHON:-"$(which python3)"}"'"${NC}"
  exit 1
fi

set -x
"$PYTHON3" "$WEBIDL_BINDER" "$DIR/Box2D.idl" box2d_glue

# Fix for Emscripten 2.0.18+ (we have no main function so cannot use addOnPreMain)
sed -i'.original.js' '/addOnPreMain/ s/addOnPreMain/addOnPreRun/' box2d_glue.js