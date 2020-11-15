# Demo (classic)

This package shows how you could install `box2d-wasm` into a legacy web application.

## Setup

Grab yourself a copy of this repository, install the demo's dependencies with npm, and copy `Box2D.js` & `Box2D.wasm` into `public`, where the demo will be served from:

```bash
git clone https://github.com/Birch-san/box2d-wasm.git
cd demo/classic
npm ci
cp node_modules/box2d-wasm/build/umd/Box2D.js public
cp node_modules/box2d-wasm/build/umd/Box2D.wasm public
```

## Run

Serve the web application:

```bash
npm start
```

Navigate to [localhost:5000](http://localhost:5000).