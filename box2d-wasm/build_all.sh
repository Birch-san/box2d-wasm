#!/usr/bin/env bash
set -eo pipefail
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

# This script just does what the README says, except with some extra validation and interactivity.
# If you're more interested in going through step-by-step, and avoiding rebuilds of files you've 
# already built: you'll probably prefer to cherry-pick lines from the README.

Red='\033[0;31m'
Purple='\033[0;35m'
NC='\033[0m' # No Color

if ! [[ "$PWD" -ef "$DIR" ]]; then
  >&2 echo -e "${Red}This script is meant to be run from <repository_root>/box2d-wasm${NC}"
  exit 1
fi

case "$TARGET_TYPE" in
  Debug | RelWithDebInfo)
    >&2 echo -e "TARGET_TYPE is $TARGET_TYPE"
    ;;
  
  *)
    >&2 echo -e "${Red}TARGET_TYPE not set.${NC}"
    >&2 echo -e "Please set TARGET_TYPE to 'Debug' or 'RelWithDebInfo'. For example, with:"
    >&2 echo -e "${Purple}export TARGET_TYPE='Debug'${NC}"
    exit 1
    ;;
esac

mkdir -p build
pushd build > /dev/null

>&2 echo -e '\nGenerating Makefile with emcmake'
emcmake cmake -DCMAKE_BUILD_TYPE="$TARGET_TYPE" ../../box2d -DBOX2D_BUILD_UNIT_TESTS=OFF -DBOX2D_BUILD_DOCS=OFF -DBOX2D_BUILD_TESTBED=OFF

>&2 echo -e '\nCompiling C++ to LLVM IR (creates ./src/libbox2d.a archive)'
emmake make

# use Box2D.idl to create ./box2d_glue.{js,cpp} for invoking functionality from libbox2d
>&2 echo -e '\nbuild_idl_bindings.sh:'
../build_idl_bindings.sh

# generate Box2D_*.{wasm,js} from glue code + libbox2d.a
>&2 echo -e '\nbuild_wasm.sh:'
../build_wasm.sh
popd > /dev/null

>&2 echo -e '\nbuild_typings.sh:'
./build_typings.sh