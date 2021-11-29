See https://github.com/Birch-san/box2d-wasm/releases

# v7.0.0

Closes https://github.com/Birch-san/box2d-wasm/issues/38  
Closes https://github.com/Birch-san/box2d-wasm/issues/36  
Closes https://github.com/Birch-san/box2d-wasm/issues/35

Exposed new Box2D functionality:

- `b2BodyDef#enabled` attribute (resolves https://github.com/Birch-san/box2d-wasm/issues/38)
- `b2Body#ApplyLinearImpulseToCenter` method (resolves https://github.com/Birch-san/box2d-wasm/issues/36)

Added `LeakMitigator` for freeing retained references from Emscripten's JS object caches.  
See [documentation](https://github.com/Birch-san/box2d-wasm/blob/master/docs/memory-model.md).

Breaking changes:

- Deleted (unreachable) type `JSContactListenerWithoutSolveCallbacks` (resolves https://github.com/Birch-san/box2d-wasm/issues/35); the performance problem it was designed to solve (eliminating WASM->JS calls) is [not a problem nowadays](https://hacks.mozilla.org/2018/10/calls-between-javascript-and-webassembly-are-finally-fast-%F0%9F%8E%89/). Prefer `JSContactListener`.

# v6.0.4

Added `.d.ts` declarations accompanying `entry.js`, `Box2D.js` and `Box2D.simd.js` (in case anybody wants to bypass the Node module specifier or the entrypoint and import an asset directly).

# v6.0.3

Updated UMD entrypoint to be better statically-analysable by Parcel.

# v6.0.2

[Fixed](https://github.com/Birch-san/box2d-wasm/commit/b7dab1d61d96cb28e268e2923dfb916211aa6432#diff-885c90134a4da6981f7c2fb931312d27389c9c0695d79fb5d4cbc7593cdcc2ff) substantial performance & size [regression](https://github.com/Birch-san/box2d-wasm/commit/6ec863d23d28bc8aced657d4d3280a66e656d07f#diff-885c90134a4da6981f7c2fb931312d27389c9c0695d79fb5d4cbc7593cdcc2ffR34) introduced in [`v5.0.0`](https://github.com/Birch-san/box2d-wasm/releases/tag/v5.0.0). We now correctly set optimization level.

Box2D.js is still 319kB.
Box2D.simd.js is still 319kB.
Box2D.wasm is 161kB (down from 226kB).
Box2D.simd.wasm is 162kB (down from 226kB).

Performance is back to normal now, so it's now possible to try out SIMD properly.

# v6.0.1

**Do not use: suffers from performance/size regression introduced in [`v5.0.0`](https://github.com/Birch-san/box2d-wasm/releases/tag/v5.0.0). Prefer [`v6.0.2`](https://github.com/Birch-san/box2d-wasm/releases/tag/v6.0.2)**

Added a mechanism to the 'browser global' loader in the UMD entrypoint that enables you to specify the directory from which you serve Box2D.js, via the `data-box2d-dir` attribute on its `<script>` tag:

```html
<script data-box2d-dir="Box2D" src='Box2D/entry.js'></script>
```

This tells `entry.js` that `Box2D.js` can be found at `Box2D/Box2D.js`.

# v6.0.0

**Do not use: suffers from performance/size regression introduced in [`v5.0.0`](https://github.com/Birch-san/box2d-wasm/releases/tag/v5.0.0). Prefer [`v6.0.2`](https://github.com/Birch-san/box2d-wasm/releases/tag/v6.0.2)**

Simplified (i.e. flattened) directory structure introduced in v5.0.0, to make it easier to import the library and serve deferred assets.

Inlined SIMD feature detection, eliminating dependency on `wasm-feature-detect`. This simplifies the entrypoints (fewer files to locate and load in).

Eliminated "ES explicit" entrypoint (now that we are zero-dependency again, we no longer need to cater for differences in ES module resolution).

Simplified UMD entrypoint by writing bespoke loaders for each of CommonJS, AMD and Browser globals.

Tested AMD entrypoint and confirmed working. Can be used by serving a folder with the following assets:

```
entry.js
Box2D.js
Box2D.wasm
Box2D.simd.js
Box2D.simd.wasm
index.html
main.js
require.js
```

```html
<!-- load RequireJS library, import main.js -->
<script data-main="main" src="require.js"></script>
```

```js
// main.js
// import Box2D's umd/entry.js
requirejs(['./entry.js'], function (Box2DFactory) {
  (async () => {
    const box2D = await Box2DFactory();
    console.log(box2D);
  })();
});
```

# v5.0.3

**Do not use: suffers from performance/size regression introduced in [`v5.0.0`](https://github.com/Birch-san/box2d-wasm/releases/tag/v5.0.0). Prefer [`v6.0.2`](https://github.com/Birch-san/box2d-wasm/releases/tag/v6.0.2)**

**Additionally: UMD release appears to be broken** (was built using a text-replace trick which doesn't work in newer Emscripten)

Updated from Emscripten `2.0.17`->`2.0.26`.

Box2D.js is still 319kB.
Box2D.wasm is 226kB (up from 162kB).

Hopefully the extra code means more performance (more inlining?).  
The most dramatic change in [the changelog](https://github.com/emscripten-core/emscripten/blob/main/ChangeLog.md) is the LLVM library/runtime updates in Emscripten 2.0.23.

Emscripten 2.0.21 introduces some hints that will help your bundler locate the `.wasm` asset (and obviate the need to implement `locateFile`). Will try to determine whether there's any instructions that can be simplified as a result of this.

# v5.0.2

**Do not use: suffers from performance/size regression introduced in [`v5.0.0`](https://github.com/Birch-san/box2d-wasm/releases/tag/v5.0.0). Prefer [`v6.0.2`](https://github.com/Birch-san/box2d-wasm/releases/tag/v6.0.2)**

The ES module entrypoint `es/entry.js` introduced in v5.0.0 relied on [NodeJS-style import resolution](https://nodejs.org/api/esm.html#esm_customizing_esm_specifier_resolution_algorithm) of the library `wasm-feature-detect`. This worked in environments where a bundler is available, but not on the Web. An additional entrypoint, `es-explicit/entry.js` is provided to support ES imports on the Web.

The ["modern" demo](https://github.com/Birch-san/box2d-wasm/tree/v5.0.3/demo/modern) demonstrates a working configuration of SIMD, and a simpler configuration without SIMD.

# v5.0.1

**Do not use: suffers from performance/size regression introduced in [`v5.0.0`](https://github.com/Birch-san/box2d-wasm/releases/tag/v5.0.0). Prefer [`v6.0.2`](https://github.com/Birch-san/box2d-wasm/releases/tag/v6.0.2)**

The UMD module distribution in v5.0.0 was a misnomer — it was actually only ever a CJS module.

5.0.1 introduces a real UMD module, which has been confirmed working in NodeJS and on the Web. It includes an attempt at AMD support, but this is untested.

On the Web, `entry.js` expects the [`wasm-feature-detect`](wasm-feature-detect) UMD module to be already-loaded into your webpage, inserted as a `<script>` tag prior to Box2D's. Additionally it expects
`node_modules/box2d-wasm/build/flavour/simd/umd/Box2D.simd.{js,wasm}` to be served from `/build/flavour/simd/umd`, and `node_modules/box2d-wasm/build/flavour/standard/umd/Box2D.{js,wasm}` to be served from `/build/flavour/standard/umd`.

The ["classic" demo](https://github.com/Birch-san/box2d-wasm/tree/v5.0.3/demo/classic) demonstrates a working configuration of SIMD, and a simpler configuration without SIMD.

# v5.0.0

**Do not use: introduces performance/size regression. Prefer [`v6.0.2`](https://github.com/Birch-san/box2d-wasm/releases/tag/v6.0.2)**

Added support for [WebAssembly SIMD acceleration](https://v8.dev/features/simd) (in supported browsers). This can make specific parts of the code 4x faster (but performance overall is unlikely to be dramatically different).

package.json now specifies the entrypoint to the library as `entry.js` (rather than pointing directly to `Box2D.js`). `entry.js` uses [`wasm-feature-detect`](wasm-feature-detect) to determine whether SIMD is available on your platform. It will then load in either `Box2D.js` or `Box2D.simd.js` as appropriate (after which, said .js file will load in `Box2D.wasm` or `Box2D.simd.wasm` respectively).

If you import the ES module distribution of `box2d-wasm`: `entry.js` will use ES2020 dynamic `import()` and ES2017 `await` to load in `Box2D.js` or `Box2D.simd.js`.  
The browsers which support [dynamic import](https://caniuse.com/?search=dynamic%20import) and [`async/await`](https://caniuse.com/?search=await) are very similar to the ones which support [WebAssembly](https://caniuse.com/?search=webassembly).  
You may find that you need to reconfigure your bundler. The [Svelte/Rollup demo](demo/svelte-rollup-ts/rollup.config.js) demonstrates a working configuration (`format: 'esm'` is the important part).

If you import the UMD module distribution of `box2d-wasm`: `entry.js` will use CommonJS `require()` to load in `Box2D.js` or `Box2D.simd.js`.

# v4.1.0

Updated Emscripten 2.0.16->2.0.17. This uses LLVM's new pass manager:

> ﻿﻿Use LLVM's new pass manager by default, as LLVM does. This changes a bunch of things about how LLVM optimizes and inlines, so it may cause noticeable changes in compile times, code size, and speed, either for better or for worse.

In practice, code size seems comparable:  
Box2D.js is still 319kB.  
Box2D.wasm is 162kB (down from 163kB).

If you encounter any performance regressions, please say so (in case we need to tune `--one-caller-inline-max-function-size` https://github.com/emscripten-core/emscripten/issues/13899, or revert to legacy pass manager).

Exposed new helpers `b2LinearStiffness` and `b2AngularStiffness`:

```ts
const { _malloc, _free, b2LinearStiffness, HEAPF32 } = box2D;
// allocate two 4-byte floats on emscripten heap
const output_p = _malloc(Float32Array.BYTES_PER_ELEMENT * 2);
// give Box2D pointers to our floats on the heap, so it can mutate them
b2LinearStiffness(output_p, output_p + Float32Array.BYTES_PER_ELEMENT, 0.9, 0.3, bodyA, bodyB)
// create a Float32Array view over our heap offset, destructure two floats out of it
const [stiffness, damping] = HEAPF32.subarray(output_p >> 2)
// free the memory we allocated
_free(output_p);
```

```ts
const { _malloc, _free, b2AngularStiffness, HEAPF32 } = box2D;
// allocate two 4-byte floats on emscripten heap
const output_p = _malloc(Float32Array.BYTES_PER_ELEMENT * 2);
// give Box2D pointers to our floats on the heap, so it can mutate them
b2AngularStiffness(output_p, output_p + Float32Array.BYTES_PER_ELEMENT, 0.9, 0.3, bodyA, bodyB)
// create a Float32Array view over our heap offset, destructure two floats out of it
const [stiffness, damping] = HEAPF32.subarray(output_p >> 2)
// free the memory we allocated
_free(output_p);
```

# v4.0.0

The `Box2DModule` type alias has been removed (again), because (in VSCode) neither `.js` files using CommonJS imports (`const Box2DFactory = require('box2d-wasm')`) nor `.js` files using JSDoc hints (`@type {import('box2d-wasm')}` or `@type {import('box2d-wasm').default}`) were able to detect the type exported as `export default Box2DFactory` in `Box2DModule.d.ts`.

`Box2DModule.d.ts` now exports `Box2DFactory` via export assignment, like it did in v2.0.0:

```ts
export = Box2DFactory;
```

This is a CommonJS style which seems to be more compatible when imported via legacy mechanisms (CommonJS import or from global namespace).

# v3.0.0

Making the TypeScript typings more correct.

## `Box2DModule` type alias

We once again export a type `Box2DModule` (same as the `Box2DEmscriptenModule` which existed pre-v2.0.0). You can use it as a shorthand to refer to the value returned from `Box2DFactory`:

```ts
import type { Box2DModule } from 'box2d-wasm'
import Box2DFactory from 'box2d-wasm';

const box2D: Box2DModule = await Box2DFactory();
```

You can shorten this further if your tsconfig's `compilerOptions` specifies `"importsNotUsedAsValues": "remove"` (i.e. the default):

```ts
import Box2DFactory, { Box2DModule } from 'box2d-wasm';

const box2D: Box2DModule = await Box2DFactory();
```

The longhand still works:

```ts
import Box2DFactory from 'box2d-wasm';

const box2D: typeof Box2D & EmscriptenModule = await Box2DFactory();
```

## [BREAKING] Mangled properties are now private

`Box2D.WrapperObject` and it subclasses used to have public properties `__cache__`, `__class__`, and `ptr`. These do exist at runtime, but with different names (due to mangling in the build process).

These properties are now private.

Prefer `getPointer()` to lookup the value of `ptr`.  
Prefer `getCache()` to lookup the value of `__cache__`.  
Prefer `getClass()` to lookup the value of `__class__`. In TypeScript the subclass will not be inferred, so you will need to cast the result.

## No-arg constructors are now exposed

Classes such as `Box2D.b2Vec2` have (in addition to their 2-arg constructor) a no-args constructor. This was not originally exposed (since it's not useful; it just throws an error).

These no-args constructor are now declared, in order to make such classes structurally compatible with their superclass, `Box2D.WrapperObject`. It has been annotated with `@deprecated` to discourage accidental usage.

## [BREAKING] Removed `HasPointer` interface

The `HasPointer` interface has been removed, since it was used to indicate the presence of a property `ptr` (whose name would be mangled at runtime).

## [BREAKING] Typings of helper functions simplified

Helper functions such as `wrapPointer`, `getPointer`, `castObject`, `compare` `getCache`, `destroy`, `getClass` and the helper constant `NULL` are now simplified to not rely on the presence of now-private properties such as `__cache__`, `__class__` and `ptr`, or removed interfaces such as `HasPointer`.

`getPointer` is now more permissive; you do not need to assert truthiness of an instance's `ptr` to use it. Optional `ptr` was only ever used to model edge-cases (casting of a manually-created `WrapperObject` to a more specific class) — in usual use we can expect `ptr` to be set.

Inference of specific subclasses is less powerful as a result (e.g. on `getClass`).

# v2.0.1

Fixes final compile error in TypeScript type declarations.

# v2.0.0

Fix errors in TypeScript type declarations.

Breaking change: we no longer export a type `Box2DEmscriptenModule`. Instead, use `typeof Box2D & EmscriptenModule`. These two types are made available as ambient declarations in all your TypeScript source files, provided you `import Box2DFactory from 'box2d-wasm';` in at least once place in your project.

# v1.3.0

Added support for NodeJS (tested on v14.13.0).

Exposed collision helpers and array helpers.

# v1.2.0

Compile WebAssembly with -O3 optimizations (previously -O2).

# v1.1.0
# v1.0.3
# v1.0.2
# v1.0.1
# v1.0.0