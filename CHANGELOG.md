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