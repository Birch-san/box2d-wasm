#!/usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

if ! [[ "$PWD" -ef "$DIR/build" ]]; then
  echo "This script is meant to be run from <repository_root>/box2d-wasm/build"
  exit 1
fi

LINK_OPTS='--bind -DEMSCRIPTEN_HAS_UNBOUND_TYPE_NAMES=0 -s MODULARIZE=1 -s EXPORT_NAME="Box2D" -s NO_FILESYSTEM=1 -s EXPORT_BINDINGS=1 -s RESERVED_FUNCTION_POINTERS=20 --post-js box2d_glue.js --memory-init-file 0 -s NO_EXIT_RUNTIME=1 -s NO_FILESYSTEM=1 -s EXPORTED_RUNTIME_METHODS=[]'

case "$TARGET_TYPE" in
  Debug)
    FLAVOUR_LINK_OPTS='-g -s ASSERTIONS=2 -s DEMANGLE_SUPPORT=1'
    ;;
  
  RelWithDebInfo)
    FLAVOUR_LINK_OPTS='-g4 -O3 --llvm-lto 1 --closure 1 -s IGNORE_CLOSURE_COMPILER_ERRORS=1'
    ;;
  
  *)
    echo "Please set TARGET_TYPE to 'Debug' or 'RelWithDebInfo'. For example, with:"
    echo "export TARGET_TYPE='Debug'"
    exit 1
    ;;
esac

EMIT_OPTS=-fno-rtti
TARGET_EMIT_OPTS="-s ALLOW_MEMORY_GROWTH=1 -o Box2D.js"

emcc $LINK_OPTS $FLAVOUR_LINK_OPTS -I "$DIR/../box2d/include" '--post-js' "$DIR/glue_stub.js" "$DIR/glue_stub.cpp" src/libbox2d.a $EMIT_OPTS $TARGET_EMIT_OPTS