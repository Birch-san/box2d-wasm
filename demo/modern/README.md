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

### Setup

Copy the ES module distribution of Box2D into the `public` folder (where the demo will be served from), and rename the copied folder to `Box2D`:

```bash
cp -R node_modules/box2d-wasm/dist/es public
mv public/es public/Box2D
```

## Run

Serve the web application:

```bash
npm start
```

Navigate to [localhost:5000](http://localhost:5000).