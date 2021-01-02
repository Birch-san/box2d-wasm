See https://github.com/Birch-san/box2d-wasm/releases

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

## [BREAKING] Typings of helper functions simplified

Helper functions such as `wrapPointer`, `getPointer`, `castObject`, `compare` `getCache`, `destroy`, `getClass` and the helper constant `NULL` are now simplified to not rely on teh presence of now-private properties such as `__cache__`, `__class__` and `ptr`.

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