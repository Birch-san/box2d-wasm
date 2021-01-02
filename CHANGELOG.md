See https://github.com/Birch-san/box2d-wasm/releases

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