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
EMCC_OPTS=(
  -fno-rtti
  -s MODULARIZE=1
  -s EXPORT_NAME=Box2D
  -s ALLOW_TABLE_GROWTH=1
  --post-js box2d_glue.js
  --memory-init-file 0
  -s FILESYSTEM=0
  -s SUPPORT_LONGJMP=0
  -s EXPORTED_FUNCTIONS=_malloc,_free
  -s ALLOW_MEMORY_GROWTH=1
  -s WASM=2
  )
RELEASE_OPTS=(-O3)

case "$TARGET_TYPE" in
  Debug)
    EMCC_OPTS=(
      ${EMCC_OPTS[@]}
      -g4
      -s ASSERTIONS=2
      -s DEMANGLE_SUPPORT=1
      )
    ;;

  RelWithDebInfo)
    # consider setting --source-map-base if you know where
    # Box2D will be served from.
    EMCC_OPTS=(
      ${EMCC_OPTS[@]}
      ${RELEASE_OPTS[@]}
      -g4
      )
    ;;
  
  Release)
    EMCC_OPTS=(
      ${EMCC_OPTS[@]}
      ${RELEASE_OPTS[@]}
      -flto
      --closure 1
      -s IGNORE_CLOSURE_COMPILER_ERRORS=1
      )
    ;;
  
  *)
    >&2 echo -e "${Red}TARGET_TYPE not set.${NC}"
    >&2 echo -e "Please set TARGET_TYPE to 'Debug' or 'Release'. For example, with:"
    >&2 echo -e "${Purple}export TARGET_TYPE='Debug'${NC}"
    exit 1
    ;;
esac
>&2 echo -e "TARGET_TYPE is $TARGET_TYPE"


BASENAME='Box2D'
BARE_WASM="$BASENAME.bare.wasm"

>&2 echo -e "${Blue}Building bare WASM${NC}"
set -x
emcc "$DIR/glue_stub.cpp" bin/libbox2d.a -I "$DIR/../box2d/include" "${EMCC_OPTS[@]}" --oformat=bare -o "$BARE_WASM"
{ set +x; } 2>&-
>&2 echo -e "${Green}Successfully built $BARE_WASM${NC}\n"

UMD_DIR='umd'
ES_DIR='es'
mkdir -p "$UMD_DIR" "$ES_DIR"

>&2 echo -e "${Blue}Building post-link targets${NC}"

LINK_OPTS=(--post-link "$BARE_WASM" --post-js "$DIR/glue_stub.js" ${EMCC_OPTS[@]})

ES_FILE="$ES_DIR/$BASENAME.js"
>&2 echo -e "${Blue}Building ES module, $ES_DIR/$BASENAME.{js,wasm{,.js}}${NC}"
set -x
emcc "${LINK_OPTS[@]}" -s EXPORT_ES6=1 -o "$ES_FILE"
{ set +x; } 2>&-
>&2 echo -e "${Green}Successfully built $ES_DIR/$BASENAME.{js,wasm{,.js}}${NC}\n"

UMD_FILE="$UMD_DIR/$BASENAME.js"
if [ "$BUILD_UMD_FROM_SCRATCH" = "1" ]; then
  >&2 echo -e "${Blue}Building UMD module, $UMD_DIR/$BASENAME.{js,wasm{,.js}} from scratch${NC}"
  set -x
  emcc "${LINK_OPTS[@]}" -o "$UMD_FILE"
  { set +x; } 2>&-
else
  >&2 echo -e "${Blue}Building UMD module, $UMD_DIR/$BASENAME.{js,wasm{,.js}} by replacing header & footer of ES module${NC}"
  escape_for_sed_replace () {
    echo "$1" | sed -e 's/&/\\\&/g' -e '$!s/$/\\n/' | tr -d '\n'
  }

  ES6_HEADER='  var _scriptDir = import.meta.url;'
  UMD_HEADER="  var _scriptDir = typeof document !== 'undefined' && document.currentScript ? document.currentScript.src : undefined;
  if (typeof __filename !== 'undefined') _scriptDir = _scriptDir || __filename;"
  UMD_HEADER_ESCAPED=`escape_for_sed_replace "$UMD_HEADER"`

  ES6_FOOTER='export default Box2D;'
  UMD_FOOTER="if (typeof exports === 'object' && typeof module === 'object')
      module.exports = Box2D;
    else if (typeof define === 'function' && define['amd'])
      define([], function() { return Box2D; });
    else if (typeof exports === 'object')
      exports['Box2D'] = Box2D;
    
"
  UMD_FOOTER_ESCAPED=`escape_for_sed_replace "$UMD_FOOTER"`

  sed -e "s/^$ES6_HEADER$/$UMD_HEADER_ESCAPED/" -e "s/^$ES6_FOOTER$/$UMD_FOOTER_ESCAPED/" "$ES_FILE" > "$UMD_FILE"
  cp "$ES_DIR/$BASENAME.wasm"{,.js} "$UMD_DIR"
fi
>&2 echo -e "${Green}Successfully built $UMD_DIR/$BASENAME.{js,wasm{,.js}}${NC}\n"