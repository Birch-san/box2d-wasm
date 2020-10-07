#!/usr/bin/env bash
# please execute from inside the build directory
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
BUILD=debug

LINK_OPTS='-s MODULARIZE=1 -s EXPORT_NAME="Box2D" -s NO_FILESYSTEM=1 -s EXPORT_BINDINGS=1 -s RESERVED_FUNCTION_POINTERS=20 --post-js box2d_glue.js --memory-init-file 0 -s NO_EXIT_RUNTIME=1 -s NO_FILESYSTEM=1 -s EXPORTED_RUNTIME_METHODS=[]'

if [ "$BUILD" = 'debug' ]; then
  # OPTS='-O0 -g2'
  FLAVOUR_LINK_OPTS='-g -s ASSERTIONS=2 -s DEMANGLE_SUPPORT=1'
else
  # OPTS=-O3
  FLAVOUR_LINK_OPTS='-O3 --llvm-lto 1 --closure 1 -s IGNORE_CLOSURE_COMPILER_ERRORS=1'
fi

EMIT_OPTS=-fno-rtti
TARGET_EMIT_OPTS="-s WASM=1 -s ALLOW_MEMORY_GROWTH=1 -o Box2D_$BUILD.wasm.js"

emcc $LINK_OPTS $FLAVOUR_LINK_OPTS -I ../include ../glue_stub.cpp src/libbox2d.a $EMIT_OPTS $TARGET_EMIT_OPTS