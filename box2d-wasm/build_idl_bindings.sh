#!/usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

if ! [[ "$PWD" -ef "$DIR/build" ]]; then
  echo "This script is meant to be run from <repository_root>/box2d-wasm/build"
  exit 1
fi

if test -n "${EMSCRIPTEN-}"; then
  echo "Using the following Emscripten libexec directory: $EMSCRIPTEN"
else
  echo "EMSCRIPTEN variable empty/unset. Please set to the location of your Emscripten libexec directory."
  echo "You can set EMSCRIPTEN based on the location of an Emscripten command on your PATH like so:"
  echo 'export EMSCRIPTEN="$(realpath "$(dirname $(realpath "$(which emcc)"))/../libexec")"'
  exit 1
fi

if [[ -f "${PYTHON-}" && -x "${PYTHON-}" ]]; then
  echo "Using the following Python binary: $PYTHON"
else
  echo "PYTHON variable empty/unset/non-executable. Please set to the location of a Python 3 binary."
  echo "You can set PYTHON based on the location of a python3 binary on your PATH like so:"
  echo 'export PYTHON="$(which python3)"'
  exit 1
fi

if [ ! -f "$EMSCRIPTEN/tools/webidl_binder.py" ]; then
    echo "WebIDL binder not found at expected location of $EMSCRIPTEN/tools/webidl_binder.py"
fi

"$PYTHON" "$EMSCRIPTEN/tools/webidl_binder.py" "$DIR/Box2D.idl" box2d_glue