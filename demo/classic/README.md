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

### Setup

Copy the UMD distribution of Box2D into the `public` folder (where the demo will be served from), and rename the copied folder to `Box2D`:

```bash
cp -R node_modules/box2d-wasm/dist/umd public
mv public/umd public/Box2D
```

## Run

Serve the web application:

```bash
npm start
```

Navigate to [localhost:5000](http://localhost:5000).