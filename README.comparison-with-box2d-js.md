# Comparison with `box2d.js`

Compared to the existing [`box2d.js`](https://github.com/kripken/box2d.js/) package: `box2d-wasm` aims to support Box2D v2.4.0+ and TypeScript.

The most important user-facing differences are:

| Criteria | [`box2d.js`](https://github.com/kripken/box2d.js) | [`box2d-wasm`](https://github.com/Birch-san/box2d-wasm) 
| --- | --- | --- |
| [Box2D](https://github.com/erincatto/box2d) version compatibility | v2.3.1 | v2.4.1 (latest) |
| TypeScript declarations | No | Yes |
| Distributes UMD module | Yes | Yes |
| Distributes ES module | No | Yes |
| Distributes WebAssembly | Yes | Yes |
| Distributes asm.js | Yes | No |
| JS+WASM Size, kB | 467 | 537 |
| JS+WASM Size, kB (.gz) | 111 | 121 |

_Summary: I dropped older practices (asm.js) and adopted newer practices (ES modules, TypeScript)._

`box2d-wasm` is 9% bigger (but exports more+newer functionality).  
The performance is likely to be identical (they're compiled with moreorless the same Emscripten flags).

The featureset is similar; `box2d-wasm` exports Box2D functionality via the same WebIDL bindings `box2d.js` used, but adds some updates for Box2D v2.4.1.  
`box2d-wasm` additionally exposes some array properties and collision functions.

The invocation is similar; functionality is bound in the same way, so existing `box2d.js` examples and documentation should be broadly compatible with `box2d-wasm` (except for API differences specific to Box2D v2.4.1).

`box2d-wasm` provides a small number of [helper functions](box2d-wasm/Box2DModuleAugmentations.d.ts) for working with Emscripten types.

## Development differences

As for _how it's developed_, the differences from `box2d.js` are:

- Different build system, to support the newer cmake build system introduced in Box2D v2.4.0.
- Different approach to version controlling source code and build output

More detail at [`README.project-aims.md`](README.project-aims.md).