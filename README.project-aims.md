## Project aims

Project aims (compared to existing [`box2d.js`](https://github.com/kripken/box2d.js/)):

- Support Box2D v2.4.0+ and its new cmake build system
- ~~Add source maps back to original C++ source~~
  - This works (you can play around with it in the [demo](https://birchlabs.co.uk/box2d-wasm/demo/))
  - Isn't super helpful
  - Pretty fiddly to deploy
  - Smaller build is preferable (build encounteres errors if both link-time optimizations and source maps are enabled)
- Demonstrate via demo how to consume library via TypeScript
- Strive for nice development experience (try to eliminate steps that involve manual copying of build artifacts)
- Generate TypeScript declarations for WebIDL interface
- Avoid pulling Box2D C++ into repository (prefer git submodule)
- Keep build artifacts out of git (prefer to publish to npm)
- If multiple versions of Box2D are to be maintained, this should be done via branches (and changing the commit of the box2d submodule)
- TypeScript declarations are the primary documentation provided
- ~~Offload processing to web worker~~
  - This is possible, but the development experience (in rollup at least) is horrid (no debugging, no livereload)
  - Project structure, build system and serving get pretty complicated
  - Proof-of-concept: https://github.com/Birch-san/box2d-wasm/tree/web-workers
    - The only remaining step would be to implement a renderer (make the worker `postMessage()` the world data to the UI thread for rendering)
    - But it could be fiddly to work out "when should I clear the canvas" between draws