## Developing this package

Confirmed working with emscripten 2.0.5.

### Overview

Navigate to `<repository root>/box2d-wasm`, then:

```bash
export TARGET_TYPE=Debug
export EMSCRIPTEN="${EMSCRIPTEN:-"$(realpath "$(dirname $(realpath "$(which emcc)"))/../libexec")"}"
export PYTHON="${PYTHON:-"$(which python3)"}"
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

# ensure EMSCRIPTEN environment variable is set appropriately for your computer
export EMSCRIPTEN="${EMSCRIPTEN:-"$(realpath "$(dirname $(realpath "$(which emcc)"))/../libexec")"}"

# ensure PYTHON environment variable points to a Python 3 binary:
export PYTHON="${PYTHON:-"$(which python3)"}"

# use Box2D.idl to create ./box2d_glue.{js,cpp} for invoking functionality from libbox2d
../build_idl_bindings.sh

# generate Box2D.{wasm,js} from glue code + libbox2d.a
../build_wasm.sh

# generate Box2D.d.ts from Box2D.idl
../build_typings.sh
```