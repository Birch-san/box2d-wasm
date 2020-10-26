#!/usr/bin/env bash
set -euo pipefail
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

Red='\033[0;31m'
Purple='\033[0;35m'
NC='\033[0m' # No Color

if ! [[ "$PWD" -ef "$DIR/build" ]]; then
  >&2 echo -e "${Red}This script is meant to be run from <repository_root>/box2d-wasm/build${NC}"
  exit 1
fi

if test -d "${EMSCRIPTEN-}"; then
  >&2 echo -e "Using the following Emscripten libexec directory: $EMSCRIPTEN"
else
  >&2 echo -e "${Red}EMSCRIPTEN variable empty/unset. Please set to the location of your Emscripten libexec directory.${NC}"
  >&2 echo -e "You can set EMSCRIPTEN based on the location of an Emscripten command on your PATH like so:"
  >&2 echo -e "${Purple}"'export EMSCRIPTEN="$(realpath "$(dirname $(realpath "$(which emcc)"))/../libexec")"'"${NC}"
  exit 1
fi

if [[ -f "${PYTHON-}" && -x "${PYTHON-}" ]]; then
  >&2 echo -e "Using the following Python binary: $PYTHON"
else
  >&2 echo -e "${Red}PYTHON variable empty/unset/non-executable. Please set to the location of a Python 3 binary.${NC}"
  >&2 echo -e "You can set PYTHON based on the location of a python3 binary on your PATH like so:"
  >&2 echo -e "${Purple}"'export PYTHON="$(which python3)"'"${NC}"
  exit 1
fi

if [ ! -f "$EMSCRIPTEN/tools/webidl_binder.py" ]; then
    >&2 echo -e "${Red}WebIDL binder not found at expected location of $EMSCRIPTEN/tools/webidl_binder.py${NC}"
fi

set -x
exec "$PYTHON" "$EMSCRIPTEN/tools/webidl_binder.py" "$DIR/Box2D.idl" box2d_glue