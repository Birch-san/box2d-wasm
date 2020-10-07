#!/usr/bin/env bash
# please execute from inside the build directory
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
python3 /usr/local/Cellar/emscripten/2.0.5/libexec/tools/webidl_binder.py "$DIR/Box2D.idl" box2d_glue