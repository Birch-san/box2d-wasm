// these typings are provided in case you wish to bypass the NodeJS module specifier
// (i.e. 'box2d-wasm') and import the entrypoint directly.
declare const module: typeof import('box2d-wasm');
export default module;