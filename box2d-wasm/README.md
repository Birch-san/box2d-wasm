### Compile WASM

Confirmed working with emscripten 2.0.5.

```bash
mkdir build
cd build

# TARGET_TYPE
#   Debug: fast compilation (for fast iteration when developing locally)
#   RelWithDebInfo: optimized for high-performance (longer compile time, for release builds)
# used for C++ -> LLVM IR, and for LLVM IR -> WASM. Debug
# both provided for your copy-paste convenience
export TARGET_TYPE=RelWithDebInfo
export TARGET_TYPE=Debug

# generate Makefiles compatible with emscripten
emcmake cmake -DCMAKE_BUILD_TYPE="$TARGET_TYPE" ../../box2d -DBOX2D_BUILD_UNIT_TESTS=OFF -DBOX2D_BUILD_DOCS=OFF -DBOX2D_BUILD_TESTBED=OFF

# compile C++ to LLVM IR (creates ./src/libbox2d.a archive)
emmake make

# ensure EMSCRIPTEN environment variable is set appropriately for your computer
export EMSCRIPTEN="${EMSCRIPTEN:-"$(realpath "$(dirname $(realpath "$(which emcc)"))/../libexec")"}"

# ensure PYTHON environment variable points to a Python 3 binary:
export PYTHON="${EMSCRIPTEN:-"$(which python3)"}"

# use Box2D.idl to create ./box2d_glue.{js,cpp} for invoking functionality from libbox2d
../build_idl_bindings.sh

# generate Box2D_*.{wasm,js} from glue code + libbox2d.a
../build_wasm.sh
```