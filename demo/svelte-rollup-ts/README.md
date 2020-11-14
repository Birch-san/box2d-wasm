# Demo ([Svelte](https://svelte.dev/) + [Rollup](https://rollupjs.org/guide/en/) + [TypeScript](https://www.typescriptlang.org/))

This package shows how you could install `box2d-wasm` into a modern web application (npm, TypeScript, ES imports, bundler, UI framework).

Unlike [`integration-test`](../../integration-test), it consumes an already-built [`box2d-wasm` package from npm](https://www.npmjs.com/package/box2d-wasm).

## Setup

Grab yourself a copy of this repository, then install the demo's dependencies with npm:

```bash
git clone https://github.com/Birch-san/box2d-wasm.git
cd demo/svelte-rollup-ts
npm ci
```

## Run

Serve the Svelte application:

```bash
npm start
```

Navigate to [localhost:5000](http://localhost:5000).

## Bundle for production

```bash
npm run build
```

## Serve in production

## Changing the application

If you're using [Visual Studio Code](https://code.visualstudio.com/): consider the official extension [Svelte for VS Code](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode).