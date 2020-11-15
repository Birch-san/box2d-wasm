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

>&2 echo -e '\nGenerating Makefile with emcmake'

# emcmake already enforces the following overrides (see build/CMakeCache.txt after running emcmake)
#   CMAKE_CXX_FLAGS_DEBUG:STRING=-g
#   CMAKE_CXX_FLAGS_MINSIZEREL:STRING=-DNDEBUG -Os
#   CMAKE_CXX_FLAGS_RELEASE:STRING=-DNDEBUG -O2
#   CMAKE_CXX_FLAGS_RELWITHDEBINFO:STRING=-DNDEBUG -O2
# these flags are applied *after* ours, which means they have precedence.
# see how the flags get resolved in build/src/CMakeFiles/box2d.dir/flags.make
CMAKE_CXX_FLAGS=()

case "$TARGET_TYPE" in
  RelWithDebInfo)
    # -flto can succeed here, but causes the emcc after this to fail during wasm-emscripten-finalize (possibly due to source maps)
    CMAKE_CXX_FLAGS=(-g)
    ;;
  Release)
    CMAKE_CXX_FLAGS=(-flto)
    ;;
  Debug)
    # emcmake already gives us -g
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
emcmake cmake -DCMAKE_BUILD_TYPE="$TARGET_TYPE" -DCMAKE_CXX_FLAGS="$CMAKE_CXX_FLAGS" ../../box2d -DBOX2D_BUILD_UNIT_TESTS=OFF -DBOX2D_BUILD_DOCS=OFF -DBOX2D_BUILD_TESTBED=OFF