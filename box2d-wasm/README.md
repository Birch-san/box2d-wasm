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

See [README.dev.md](README.dev.md).