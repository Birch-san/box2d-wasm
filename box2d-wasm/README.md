### Compile WASM

Confirmed working with emscripten 2.0.5.

The following steps are encoded in [`build_all.sh`](build_all.sh) too, with some added validation to ensure you're running from the correct directory and have variables set appropriately.

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

# compile C++ to LLVM IR (creates ./src/libbox2d.a archive)
emmake make

# ensure EMSCRIPTEN environment variable is set appropriately for your computer
export EMSCRIPTEN="${EMSCRIPTEN:-"$(realpath "$(dirname $(realpath "$(which emcc)"))/../libexec")"}"

# ensure PYTHON environment variable points to a Python 3 binary:
export PYTHON="${EMSCRIPTEN:-"$(which python3)"}"

# use Box2D.idl to create ./box2d_glue.{js,cpp} for invoking functionality from libbox2d
../build_idl_bindings.sh

# generate Box2D.{wasm,js} from glue code + libbox2d.a
../build_wasm.sh

# generate Box2D.d.ts from Box2D.idl
../build_typings.sh
```