#!/usr/bin/env bash
set -eo pipefail
CWD="$(pwd)"
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

# return to original directory upon completion of script
trap \
 '{ exit_code=$?; cd "$CWD"; exit $exit_code }' \
 SIGINT SIGTERM ERR EXIT

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

mkdir -p build
pushd build > /dev/null

set -x
../build_makefile.sh
{ set +x; } 2>&-

>&2 echo -e '\nCompiling C++ to LLVM IR (creates ./src/libbox2d.a archive)'
set -x
emmake make
{ set +x; } 2>&-
exit

# use Box2D.idl to create ./box2d_glue.{js,cpp} for invoking functionality from libbox2d
set -x
../build_idl_bindings.sh
{ set +x; } 2>&-

# generate Box2D_*.{wasm,js} from glue code + libbox2d.a
set -x
../build_wasm.sh
{ set +x; } 2>&-
popd > /dev/null

set -x
../build_typings.sh
{ set +x; } 2>&-