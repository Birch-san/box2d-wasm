# Demo (modern)

This package shows how you could install `box2d-wasm` into a modern webpage. This uses `<script type="module" />` to consume the ES module distribution of Box2D.

![](https://birchlabs.co.uk/box2d-wasm/webpage-50fps.gif)

## Setup

Grab yourself a copy of this repository, install the demo's dependencies with npm:

```bash
git clone https://github.com/Birch-san/box2d-wasm.git
cd box2d-wasm/demo/modern
npm ci
```

### Easy install

Copy `Box2D.wasm` and `Box2D.js` into the `public` folder (where the demo will be served from):

```bash
cp node_modules/box2d-wasm/build/flavour/standard/es/Box2D.{js,wasm} public
```

### Full install

This is a little more complex, but enables [WebAssembly SIMD](https://v8.dev/features/simd) acceleration in supported browsers (recent Chrome/Firefox), with a fallback for other browsers.

```bash
mkdir -p public/build/flavour/{simd,standard}/es
cp node_modules/wasm-feature-detect/dist/esm/index.js public/wasm-feature-detect.js
cp node_modules/box2d-wasm/entry/es-explicit/entry.js public
cp node_modules/box2d-wasm/build/flavour/simd/es/Box2D.simd.{js,wasm} public/build/flavour/simd/es
cp node_modules/box2d-wasm/build/flavour/standard/es/Box2D.{js,wasm} public/build/flavour/standard/es
```

## Run

Serve the web application:

```bash
npm start
```

Navigate to [localhost:5000](http://localhost:5000), (or [localhost:5000/simd.html](http://localhost:5000/simd.html) if you did "full install").