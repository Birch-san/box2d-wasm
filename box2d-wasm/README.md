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

Then check out the [documentation](../docs).

## License

[Zlib-licensed](LICENSE.zlib.txt).  
Links against MIT-licensed code from Erin Catto's [box2d](https://github.com/erincatto/box2d).  
Compiles Zlib-licensed code from Alon Zakai's [box2d-js](https://github.com/kripken/box2d.js).

## Developing this package

See [`README.dev.md`](README.dev.md).