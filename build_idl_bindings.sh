#!/usr/bin/env bash
# please execute from inside the box2d/build directory
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
python3 "$EMSCRIPTEN/tools/webidl_binder.py" "$DIR/Box2D.idl" box2d_glue