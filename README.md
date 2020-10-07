# box2d-wasm

## License

[Zlib-licensed](LICENSE.zlib.txt).  
Links against MIT-licensed code from Erin Catto's [box2d](https://github.com/erincatto/box2d).  
Compiles Zlib-licensed code from Alon Zakai's [box2d-js](https://github.com/kripken/box2d.js).

## Setup

Clone this repository using --recursive, to ensure that the `box2d` submodule is available.  
_Tutorial: [Using submodules in Git](https://www.vogella.com/tutorials/GitSubmodules/article.html)_

```bash
git clone --recursive git@github.com:Birch-san/box2d-wasm.git
cd box2d-wasm
```

Confirmed working with emscripten 2.0.5.

```bash
# in the box2d submodule, make a build folder for cmake output
mkdir -p box2d/build
cd box2d/build
# generate Makefiles compatible with emscripten
emcmake cmake .. -DBOX2D_BUILD_UNIT_TESTS=OFF -DBOX2D_BUILD_DOCS=OFF -DBOX2D_BUILD_TESTBED=OFF
# compile C++ to LLVM IR (creates ./src/libbox2d.a archive)
emmake make
# ensure EMSCRIPTEN environment variable is set appropriately for your computer
export EMSCRIPTEN=/usr/local/Cellar/emscripten/2.0.5/libexec
# use Box2D.idl to create ./box2d_glue.{js,cpp} for invoking functionality from libbox2d
../../build_idl_bindings.sh
# generate Box2D_*.{wasm,js} from glue code + libbox2d.a
../../build_wasm.sh
```