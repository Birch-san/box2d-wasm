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

LINK_OPTS='--bind -DEMSCRIPTEN_HAS_UNBOUND_TYPE_NAMES=1 -s MODULARIZE=1 -s EXPORT_NAME="Box2D" -s NO_FILESYSTEM=1 -s EXPORT_BINDINGS=1 -s RESERVED_FUNCTION_POINTERS=20 --post-js box2d_glue.js --memory-init-file 0 -s NO_EXIT_RUNTIME=1 -s EXPORTED_RUNTIME_METHODS=[]'


# I decided to keep assertions, because in Box2D v2.4.1 an assertion (inertia must be positive)
# actually failed, and it was good that it told me that.
RELEASE_OPTS_NOMINAL='-O3 -s ASSERTIONS=2 --llvm-lto 1'

case "$TARGET_TYPE" in
  Debug)
    FLAVOUR_LINK_OPTS='-g4 -s ASSERTIONS=2 -s DEMANGLE_SUPPORT=1'
    ;;

  RelWithDebInfo)
    # --source-map-base http://localhost:5000
    FLAVOUR_LINK_OPTS="-g4 $RELEASE_OPTS_NOMINAL"
    ;;
  
  Release)
    FLAVOUR_LINK_OPTS="--closure 1 -s IGNORE_CLOSURE_COMPILER_ERRORS=1 $RELEASE_OPTS_NOMINAL"
    ;;
  
  *)
    >&2 echo -e "${Red}TARGET_TYPE not set.${NC}"
    >&2 echo -e "Please set TARGET_TYPE to 'Debug' or 'Release'. For example, with:"
    >&2 echo -e "${Purple}export TARGET_TYPE='Debug'${NC}"
    exit 1
    ;;
esac

# we need RTTI in order to use unbound types, to use collision helpers
EMIT_OPTS='' #-fno-rtti
TARGET_EMIT_OPTS="-s ALLOW_MEMORY_GROWTH=1 -o Box2D.js"

set -x
exec emcc $LINK_OPTS $FLAVOUR_LINK_OPTS -I "$DIR/../box2d/include" '--post-js' "$DIR/glue_stub.js" "$DIR/glue_stub.cpp" src/libbox2d.a $EMIT_OPTS $TARGET_EMIT_OPTS