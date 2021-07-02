#!/usr/bin/env bash
set -eo pipefail
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

Red='\033[0;31m'
Purple='\033[0;35m'
NC='\033[0m' # No Color

if ! [[ "$PWD" -ef "$DIR/build" ]]; then
  >&2 echo -e "${Red}This script is meant to be run from <repository_root>/box2d-wasm/build${NC}"
  exit 1
fi

if test -d "${EMSCRIPTEN_TOOLS-}"; then
  >&2 echo -e "Using the following Emscripten tools directory: $EMSCRIPTEN_TOOLS"
else
  >&2 echo -e "${Red}EMSCRIPTEN_TOOLS variable empty/unset. Please set to the location of the directory in which Emscripten's webidl_binder.py can be found.${NC}"
  >&2 echo -e "You can set EMSCRIPTEN_TOOLS based on the location of an Emscripten command on your PATH."
  >&2 echo -e "if you installed emscripten via emsdk: source emsdk_env.sh, then set the variable like so:"
  >&2 echo -e "${Purple}"'export EMSCRIPTEN_TOOLS="$(realpath "$(dirname "$(realpath "$(which emcc)")")/tools")"'"${NC}"
  >&2 echo -e "if you installed emscripten via brew: set the variable like so:"
  >&2 echo -e "${Purple}"'export EMSCRIPTEN_TOOLS="$(realpath "$(dirname "$(realpath "$(which emcc)")")/../libexec/tools")"'"${NC}"
  exit 1
fi

if [[ -f "${PYTHON3-}" && -x "${PYTHON3-}" ]]; then
  >&2 echo -e "Using the following Python binary: $PYTHON3"
else
  >&2 echo -e "${Red}PYTHON3 variable empty/unset/non-executable. Please set to the location of a Python 3 binary.${NC}"
  >&2 echo -e "You can set PYTHON3 based on the location of a python3 binary on your PATH like so:"
  >&2 echo -e "${Purple}"'export PYTHON3="${EMSDK_PYTHON:-"$(which python3)"}"'"${NC}"
  exit 1
fi

if [ ! -f "$EMSCRIPTEN_TOOLS/webidl_binder.py" ]; then
    >&2 echo -e "${Red}WebIDL binder not found at expected location of $EMSCRIPTEN_TOOLS/webidl_binder.py${NC}"
fi

set -x
exec "$PYTHON3" "$EMSCRIPTEN_TOOLS/webidl_binder.py" "$DIR/Box2D.idl" box2d_glue