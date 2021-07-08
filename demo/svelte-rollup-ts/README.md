# Demo ([Svelte](https://svelte.dev/) + [Rollup](https://rollupjs.org/guide/en/) + [TypeScript](https://www.typescriptlang.org/))

This package shows how you could install `box2d-wasm` into a modern web application (npm, TypeScript, ES imports, bundler, UI framework).

![](https://birchlabs.co.uk/box2d-wasm/svelte-50fps.gif)

Unlike [`integration-test`](../../integration-test), it consumes an already-built [`box2d-wasm` package from npm](https://www.npmjs.com/package/box2d-wasm).

## Setup

Grab yourself a copy of this repository, then install the demo's dependencies with npm:

```bash
git clone https://github.com/Birch-san/box2d-wasm.git
cd box2d-wasm/demo/svelte-rollup-ts
npm ci
```

## Run

Run the Svelte application:

```bash
npm start
```

Navigate to [localhost:4000](http://localhost:4000).

## Bundle for production

Build a production bundle into `public/build`:

```bash
# clean any build artifacts left from npm start
rm -rf public/build
npm run build
```

## Verify the production bundle

Serve the `public` folder:

```bash
npm run serve
```

Navigate to [localhost:5000](http://localhost:5000).

You probably have your own solution for serving in production. Refer to the Emscripten docs for advice on [how to serve `.wasm` files with the correct MIME type (`application/wasm`)](https://emscripten.org/docs/compiling/WebAssembly.html#web-server-setup).

## Changing the application

If you're using [Visual Studio Code](https://code.visualstudio.com/): consider the official extension [Svelte for VS Code](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode).