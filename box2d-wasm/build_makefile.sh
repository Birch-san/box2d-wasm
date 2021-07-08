#!/usr/bin/env bash
set -eo pipefail
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

Red='\033[0;31m'
Purple='\033[0;35m'
NC='\033[0m' # No Color

CMAKE_CXX_FLAGS=()
case "$FLAVOUR" in
  standard)
    ;;
  simd)
    CMAKE_CXX_FLAGS=(${CMAKE_CXX_FLAGS[@]} -msimd128)
    ;;
  *)
    >&2 echo -e "${Red}FLAVOUR not set.${NC}"
    >&2 echo -e "Please set FLAVOUR to 'standard' or 'simd'. For example, with:"
    >&2 echo -e "${Purple}export FLAVOUR='simd'${NC}"
    exit 1
    ;;
esac

if ! [[ "$PWD" -ef "$DIR/build/flavour/$FLAVOUR" ]]; then
  >&2 echo -e "${Red}This script is meant to be run from <repository_root>/box2d-wasm/build/flavour/$FLAVOUR${NC}"
  exit 1
fi

>&2 echo -e '\nGenerating Makefile with emcmake'

case "$TARGET_TYPE" in
  RelWithDebInfo | Release | Debug)
    ;;
  *)
    >&2 echo -e "${Red}TARGET_TYPE not set.${NC}"
    >&2 echo -e "Please set TARGET_TYPE to 'Debug', 'Release', or 'RelWithDebInfo'. For example, with:"
    >&2 echo -e "${Purple}export TARGET_TYPE='Debug'${NC}"
    exit 1
    ;;
esac
>&2 echo -e "TARGET_TYPE is $TARGET_TYPE"

set -x
emcmake cmake -DCMAKE_BUILD_TYPE="$TARGET_TYPE" -DCMAKE_CXX_FLAGS="${CMAKE_CXX_FLAGS[@]}" "$DIR/../box2d" -DBOX2D_BUILD_UNIT_TESTS=OFF -DBOX2D_BUILD_DOCS=OFF -DBOX2D_BUILD_TESTBED=OFF