## Developing this package

Ensure that you have a recent [emscripten](https://emscripten.org/) installed.

**Requires Emscripten 2.0.17 or higher**

### Overview

Navigate to `<repository root>/box2d-wasm`, then:

```bash
export TARGET_TYPE=Debug
# if you installed emscripten via emsdk: source emsdk_env.sh, then configure tools directory like so:
export EMSCRIPTEN_TOOLS="$(realpath "$(dirname "$(realpath "$(which emcc)")")/tools")"
# if you installed emscripten via brew: configure tools directory like so:
export EMSCRIPTEN_TOOLS="$(realpath "$(dirname "$(realpath "$(which emcc)")")/../libexec/tools")"
export PYTHON3="${EMSDK_PYTHON:-"$(which python3)"}"
./build_all.sh
```

### Step-by-step

If you're prefer not to use [`build_all.sh`](build_all.sh), here's each step laid bare.

Navigate to `<repository root>/box2d-wasm`, then:

```bash
mkdir build
cd build

# TARGET_TYPE
#   Debug: fast compilation (for fast iteration when developing locally)
#   Release: optimized for high-performance (longer compile time, for release builds)
#   RelWithDebInfo: Release, but with debug source-maps (and with closure optimizations disabled)
# used for C++ -> LLVM IR, and for LLVM IR -> WASM. Debug
# both provided for your copy-paste convenience
export TARGET_TYPE=RelWithDebInfo
export TARGET_TYPE=Release
export TARGET_TYPE=Debug

# generate Makefiles compatible with emscripten
../build_makefile.sh

# compile C++ to LLVM IR (creates ./bin/libbox2d.a archive)
emmake make

# ensure EMSCRIPTEN_TOOLS environment variable points at the directory in which webidl_binder.py can be found.
# you can determine this based on the location of the `emcc` executable on your PATH.
# if you installed emscripten via emsdk: source emsdk_env.sh, then set the variable like so:
export EMSCRIPTEN_TOOLS="$(realpath "$(dirname "$(realpath "$(which emcc)")")/tools")"
# if you installed emscripten via brew: set the variable like so:
export EMSCRIPTEN_TOOLS="$(realpath "$(dirname "$(realpath "$(which emcc)")")/../libexec/tools")"

# ensure PYTHON3 environment variable points to a Python 3 binary:
export PYTHON3="${EMSDK_PYTHON:-"$(which python3)"}"

# use Box2D.idl to create ./box2d_glue.{js,cpp} for invoking functionality from libbox2d
../build_idl_bindings.sh

# generate Box2D.{wasm,js} from glue code + libbox2d.a
../build_wasm.sh

# generate Box2D.d.ts from Box2D.idl
../build_typings.sh
```