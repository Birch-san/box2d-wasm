# Integration test

If you're developing changes to [`box2d-wasm`](../box2d-wasm) in this monorepo, you can use this `integration-test` package to validate your changes.

![](https://birchlabs.co.uk/box2d-wasm/svelte-50fps.gif)

It's a [Svelte](https://svelte.dev/) web application, bundled with [Rollup](https://rollupjs.org/guide/en/).

This package demonstrates a realistic integration of `box2d-wasm` into a modern web application (npm, TypeScript, ES imports, bundler, UI framework).

## Setup

Follow the steps detailed in [Developing in this monorepo](../#developing-in-this-monorepo).

This should ensure that the following files exist:

```
node_modules/box2d-wasm/build/es/Box2D.js
node_modules/box2d-wasm/build/es/Box2D.wasm
node_modules/box2d-wasm/build/Box2D.d.ts
```

## Run

Serve the Svelte application:

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