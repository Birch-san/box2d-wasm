// our only import of box2d-wasm is inside App.svelte, which doesn't seem to talk to the other .ts files.
// this triple-slash directive is a workaround to load the Box2D.d.ts types into the TS context used by the .ts files
/// <reference types="box2d-wasm" />
// in a non-Svelte project, you probably wouldn't need this triple-slash directive -- importing box2d-wasm anywhere
// in your project would usually suffice to load its typings into your TS context.
import App from './App.svelte';

const app = new App({
	target: document.body
});

export default app;