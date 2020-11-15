# box2d-wasm

Box2D compiled to WebAssembly. [Demo](https://birchlabs.co.uk/box2d-wasm/demo/).  
_Demo includes sourcemaps to original C++ source._

Compatibility: Box2D [v2.4.1](https://github.com/erincatto/box2d/releases/tag/v2.4.1)

| Asset | Purpose | Size | Size (.gz) |
| --- | --- | --- | --- |
| `Box2D.js` | Provides helpers for you to invoke functionality from `Box2D.wasm` | 290kB | **40kB** | 
| `Box2D.wasm` | Box2D physics engine | 213kB | **78kB** | 

Detailed TypeScript declarations are included (generated via [`webidl-to-ts`](../webidl-to-ts) from [WebIDL bindings](../box2d-wasm/Box2D.idl)).

## Installation

Install the [`box2d-wasm` npm package](https://www.npmjs.com/package/box2d-wasm)

```bash
npm i --save box2d-wasm
```

## Usage

The package is bundled for use on the Web platform only.

```ts
import Box2DFactory from 'box2d-wasm';
import type { Box2DEmscriptenModule } from 'box2d-wasm';

// I'm relying on top-level await here; lookup alternatives if this is unavailable on your platform
const box2D: Box2DEmscriptenModule = await Box2DFactory();
const { b2BodyDef, b2Vec2, b2World } = box2D;
const gravity = new b2Vec2(0, 10);
const world = new b2World(gravity);
const ground = new b2BodyDef();
const groundBody = world.CreateBody(ground);
// see "demo" package in this repository for more
```

`Box2DFactory` is gonna attempt to download `Box2D.wasm` using the browser `fetch()` API.  
If you'd like a bit more control over where it downloads the `.wasm` from, invoke `Box2DFactory` like so:

```ts
Box2DFactory({
  locateFile(url: string, scriptDirectory: string): string {
    // this is the default; tweak if you need something different
    return `${scriptDirectory}${url}`;
  }
})
```

A lot more is needed for a minimum working example, so refer to the [demos](../demo) for more inspiration.

## License

[Zlib-licensed](LICENSE.zlib.txt).  
Links against MIT-licensed code from Erin Catto's [box2d](https://github.com/erincatto/box2d).  
Compiles Zlib-licensed code from Alon Zakai's [box2d-js](https://github.com/kripken/box2d.js).

## Developing this package

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
export PYTHON="${PYTHON:-"$(which python3)"}"

# use Box2D.idl to create ./box2d_glue.{js,cpp} for invoking functionality from libbox2d
../build_idl_bindings.sh

# generate Box2D.{wasm,js} from glue code + libbox2d.a
../build_wasm.sh

# generate Box2D.d.ts from Box2D.idl
../build_typings.sh
```