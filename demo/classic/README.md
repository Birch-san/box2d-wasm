# Demo (classic)

This package shows how you could install `box2d-wasm` into a webpage, using old-school techniques (`<script />` tag, UMD module).

![](https://birchlabs.co.uk/box2d-wasm/webpage-50fps.gif)

## Setup

Grab yourself a copy of this repository, install the demo's dependencies with npm, and copy the following files into `public`, where the demo will be served from:

```bash
git clone https://github.com/Birch-san/box2d-wasm.git
cd box2d-wasm/demo/classic
npm ci
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

Navigate to [localhost:5000](http://localhost:5000).