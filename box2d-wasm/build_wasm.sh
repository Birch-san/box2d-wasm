#!/usr/bin/env bash
set -eo pipefail
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

Red='\033[0;31m'
Green='\033[0;32m'
Blue='\033[0;34m'
Purple='\033[0;35m'
NC='\033[0m' # No Color

if ! [[ "$PWD" -ef "$DIR/build" ]]; then
  >&2 echo -e "${Red}This script is meant to be run from <repository_root>/box2d-wasm/build${NC}"
  exit 1
fi

# we used to use -s ENVIRONMENT=web for a slightly smaller build, until Node.js compatibility was requested in https://github.com/Birch-san/box2d-wasm/issues/8
EMCC_OPTS=(-s MODULARIZE=1 -s EXPORT_NAME=Box2D -s EXPORT_BINDINGS=1 -s RESERVED_FUNCTION_POINTERS=20 --post-js box2d_glue.js --memory-init-file 0 -s NO_EXIT_RUNTIME=1 -s NO_FILESYSTEM=1 -s EXPORTED_RUNTIME_METHODS=[] -s EXPORTED_FUNCTIONS="['_malloc','_free']" -fno-rtti -s ALLOW_MEMORY_GROWTH=0)

RELEASE_OPTS_NOMINAL=(-O3)

case "$TARGET_TYPE" in
  Debug)
    FLAVOUR_EMCC_OPTS=(-g4 -s ASSERTIONS=2 -s DEMANGLE_SUPPORT=1)
    ;;

  RelWithDebInfo)
    # consider setting --source-map-base if you know where
    # Box2D will be served from.
    FLAVOUR_EMCC_OPTS=(-g4 ${RELEASE_OPTS_NOMINAL[@]})
    ;;
  
  Release)
    FLAVOUR_EMCC_OPTS=(-flto --closure 1 -s IGNORE_CLOSURE_COMPILER_ERRORS=1 ${RELEASE_OPTS_NOMINAL[@]})
    ;;
  
  *)
    >&2 echo -e "${Red}TARGET_TYPE not set.${NC}"
    >&2 echo -e "Please set TARGET_TYPE to 'Debug' or 'Release'. For example, with:"
    >&2 echo -e "${Purple}export TARGET_TYPE='Debug'${NC}"
    exit 1
    ;;
esac
>&2 echo -e "TARGET_TYPE is $TARGET_TYPE"

EMCC_COMMAND_NOMINAL=("${EMCC_OPTS[@]}" "${FLAVOUR_EMCC_OPTS[@]}" -I "$DIR/../box2d/include" --post-js "$DIR/glue_stub.js" "$DIR/glue_stub.cpp" bin/libbox2d.a)

BASENAME='Box2D'

UMD_DIR='umd'
ES_DIR='es'
mkdir -p "$UMD_DIR" "$ES_DIR"

if [ "$SKIP_UMD_BUILD" = "1" ]; then
  >&2 echo -e "${Green}Skipped UMD build because we gotta go fast${NC}"
else
  UMD_FILE="$UMD_DIR/$BASENAME.js"
  >&2 echo -e "${Blue}Building UMD module, $UMD_FILE${NC}"
  set -x
  emcc "${EMCC_COMMAND_NOMINAL[@]}" -o "$UMD_FILE"
  { set +x; } 2>&-
  >&2 echo -e "${Green}Successfully built $UMD_FILE${NC}\n"
fi

ES_FILE="$ES_DIR/$BASENAME.js"
>&2 echo -e "${Blue}Building ES module, $ES_FILE${NC}"
set -x
emcc "${EMCC_COMMAND_NOMINAL[@]}" -s EXPORT_ES6=1 -o "$ES_FILE"
{ set +x; } 2>&-
>&2 echo -e "${Green}Successfully built $ES_FILE${NC}"