# box2d-wasm

Box2D compiled to WebAssembly. [Demo](https://birchlabs.co.uk/box2d-wasm/demo/).  
_Demo includes sourcemaps to original C++ source._

Compatibility: Box2D v2.4.0+ @[f0f9d50](https://github.com/erincatto/box2d/tree/f0f9d50a328a709cc3a287a61b864e7d0e3ef35f)

| Asset | Purpose | Size | Size (.gz) |
| --- | --- | --- | --- |
| `Box2D.js` | Provides helpers for you to invoke functionality from `Box2D.wasm` | 290kB | **40kB** | 
| `Box2D.wasm` | Box2D physics engine | 212kB | **78kB** | 

Detailed TypeScript declarations are included (generated via [`webidl-to-ts`](webidl-to-ts) from [WebIDL bindings](box2d-wasm/Box2D.idl)).

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
const world = new b2World(new b2Vec2(0.0, 0.0));
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

A lot more is needed for a minimum working example, so refer to the [`demo`](demo) package to see how to make [something like this](https://birchlabs.co.uk/box2d-wasm/demo/).

## License

[Zlib-licensed](LICENSE.zlib.txt).  
Links against MIT-licensed code from Erin Catto's [box2d](https://github.com/erincatto/box2d).  
Compiles Zlib-licensed code from Alon Zakai's [box2d-js](https://github.com/kripken/box2d.js).

## Project aims

Project aims (compared to existing [`box2d.js`](https://github.com/kripken/box2d.js/)):

- Support Box2D v2.4.0 and its new cmake build system
- ~~Add source maps back to original C++ source~~
  - This works (you can play around with it in the [demo](https://birchlabs.co.uk/box2d-wasm/demo/))
  - Isn't super helpful
  - Pretty fiddly to deploy
  - Smaller build is preferable (build encounteres errors if both link-time optimizations and source maps are enabled)
- Demo should demonstrate how to consume library via TypeScript
- Strive for nice development experience (try to eliminate steps that involve manual copying of build artifacts)
- Generate TypeScript declarations for WebIDL interface
- Avoid pulling Box2D C++ into repository (prefer git submodule)
- Keep build artifacts out of git (prefer to publish to npm)
- If multiple versions of Box2D are to be maintained, this should be done via branches (and changing the commit of the box2d submodule)
- Documentation not currently planned, but TypeScript declarations and demos would be a start.
- ~~Offload processing to web worker~~
  - This is possible, but the development experience (in rollup at least) is horrid (no debugging, no livereload)
  - Project structure, build system and serving get pretty complicated
  - Proof-of-concept: https://github.com/Birch-san/box2d-wasm/tree/web-workers
    - The only remaining step would be to implement a renderer (make the worker `postMessage()` the world data to the UI thread for rendering)
    - But it could be fiddly to work out "when should I clear the canvas" between draws

## Developing in this monorepo

### Clone repository

Clone this repository using --recursive, to ensure that the [`box2d`](https://github.com/erincatto/box2d) submodule is available.  
_Tutorial: [Using submodules in Git](https://www.vogella.com/tutorials/GitSubmodules/article.html)_

```bash
# start in root of repository
git clone --recursive git@github.com:Birch-san/box2d-wasm.git
cd box2d-wasm
```

#### Instantiate packages

[`pnpm`](https://pnpm.js.org/) is used to manage packages in this monorepo. In particular, it creates a symlink that enables `demo` to consume build artifacts from `box2d-wasm`.

```bash
# from root of repository
npm i -g pnpm
pnpm i
# compile webidl-to-ts from TS to JS, so that box2d-wasm can consume it to generate typings
pnpm build --filter=webidl-to-ts
```

### Compile Box2D to WASM + generate .js and .d.ts bindings

See README of [`box2d-wasm`](box2d-wasm) package.

### Run demo

See README of [`demo`](demo) package.