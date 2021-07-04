# Demo (classic)

This package shows how you could install `box2d-wasm` into a webpage, using old-school techniques (`<script />` tag, UMD module).

![](https://birchlabs.co.uk/box2d-wasm/webpage-50fps.gif)

## Setup

Grab yourself a copy of this repository, install the demo's dependencies with npm:

```bash
git clone https://github.com/Birch-san/box2d-wasm.git
cd box2d-wasm/demo/classic
npm ci
```

Now continue to either "easy setup" **or** "full install".

### Easy install

Copy `Box2D.wasm` and `Box2D.js` into the `public` folder (where the demo will be served from):

```bash
cp node_modules/box2d-wasm/build/flavour/standard/umd/Box2D.{js,wasm} public
```

### Full install

This is a little more complex, but enables [WebAssembly SIMD](https://v8.dev/features/simd) acceleration in supported browsers (recent Chrome/Firefox), with a fallback for other browsers.

We include the `wasm-feature-detect` library, and load Box2D via an entrypoint which conditionall loads the SIMD version or the fallback.

[`public/simd.html`](public/simd.html) does half of the work, we just need to ensure that the files it's looking for are served in the same directory.

The files we need are inside `node_modules/wasm-feature-detect` and `node_modules/box2d-wasm`. We'll copy them into `public`, where the demo will be served from:

```bash
mkdir -p public/build/flavour/{simd,standard}/umd
cp node_modules/wasm-feature-detect/dist/umd/index.js public/wasm-feature-detect.js
cp node_modules/box2d-wasm/entry/umd/entry.js public
cp node_modules/box2d-wasm/build/flavour/simd/umd/Box2D.simd.{js,wasm} public/build/flavour/simd/umd
cp node_modules/box2d-wasm/build/flavour/standard/umd/Box2D.{js,wasm} public/build/flavour/standard/umd
```

## Run

Serve the web application:

```bash
npm start
```

Navigate to [localhost:5000](http://localhost:5000), (or [localhost:5000/simd.html](http://localhost:5000/simd.html) if you did "full install").