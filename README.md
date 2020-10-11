# box2d-wasm

Box2D compiled to WebAssembly. Project aims (compared to existing [`box2d.js`](https://github.com/kripken/box2d.js/)):

- Support Box2D v2.4.0 (for better ropes)
- Support Box2D v2.4.0's new cmake build system
- Add source maps back to original C++ source (could be fun!)
- Demo should demonstrate how to consume library via TypeScript
- Strive for nice development experience (try to eliminate steps that involve manual copying of build artifacts)
- Generate TypeScript declarations for WebIDL interface (…somehow)
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

Compatibility: Box2D v2.4.0+ @[f0f9d50](https://github.com/erincatto/box2d/tree/f0f9d50a328a709cc3a287a61b864e7d0e3ef35f)

Status:

- Demo application currently demonstrates basic behaviour. Performs well
- Rope bindings not yet exposed
- No TypeScript declarations
- No package published to npm
- No release distributed

## License

[Zlib-licensed](LICENSE.zlib.txt).  
Links against MIT-licensed code from Erin Catto's [box2d](https://github.com/erincatto/box2d).  
Compiles Zlib-licensed code from Alon Zakai's [box2d-js](https://github.com/kripken/box2d.js).

## Setup

### Clone repository

Clone this repository using --recursive, to ensure that the [`box2d`](https://github.com/erincatto/box2d) submodule is available.  
_Tutorial: [Using submodules in Git](https://www.vogella.com/tutorials/GitSubmodules/article.html)_

```bash
# start in root of repository
git clone --recursive git@github.com:Birch-san/box2d-wasm.git
cd box2d-wasm
```

### Compile WASM

See README of [`box2d-wasm`](box2d-wasm) package.

### Build demo

[`pnpm`](https://pnpm.js.org/) is used to manage packages in this monorepo. In particular, it creates a symlink that enables `demo` to consume build artifacts from `box2d-wasm`.

```bash
# from root of repository
npm i -g pnpm
pnpm i
```