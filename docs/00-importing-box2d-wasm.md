## Integrating `box2d-wasm` into your project

_See the [demos](../demo) for full examples of how to integrate `box2d-wasm` into your application._

Importing `box2d-wasm` is fiddly for two reasons:

- it gives you a factory function, which returns a Promise you'll need to wait upon
- the factory function tries to download a `Box2D.wasm` file
  - uses the browser `fetch()` API
  - you'll need to serve the .wasm file somewhere that the browser can access it

Let's make a webpage, `index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <script src='demo.js' type="module"></script>
</head>
<body></body>
</html>
```

Let's make a `demo.js`, which imports `box2d-wasm` via an ES import:

```js
import Box2DFactory from './Box2D.js';
Box2DFactory().then(box2D => {
  // finished downloading Box2D.wasm
  console.log(box2D);
});
```

To host our webpage, we'll need to [run an HTTP server](http://expressjs.com/en/starter/static-files.html) which serves up a directory containing the following:

- `index.html`
- `Box2D.js`
- `Box2D.wasm`
  - best served with [MIME type `application/wasm`](https://emscripten.org/docs/compiling/WebAssembly.html#web-server-setup)!

You can grab `Box2D.js` and `Box2D.wasm` from your `node_modules`:

```
node_modules/box2d-wasm/build/es/Box2D.js
node_modules/box2d-wasm/build/es/Box2D.wasm
```

You may find that your browser tries to download `Box2D.wasm` from an inconvenient location.  
You can get a bit more control over this by passing the `locateFile` option into your `Box2DFactory()` call:

```js
Box2DFactory({
  /**
   * This is the default implementation of locateFile.
   * Modify this logic if your Box2D.wasm lives in a different directory.
   */
  locateFile: (url, scriptDirectory) => `${scriptDirectory}${url}`
})
```

If you want to code in JS, but would like your IDE to use `box2d-wasm`'s TypeScript declarations to assist you: we can use JSDoc to provide typings.

```js
import Box2DFactory from './Box2D.js';
/**
 * Make a copy of the Box2DFactory variable (this is a workaround to change its type).
 * Tell our IDE that the typings for this variable can be found inside node_modules/box2d-wasm
 * @type {import('box2d-wasm')}
 */
const Box2DFactory_ = Box2DFactory;
Box2DFactory_().then(box2D => {
  // if you hover over the box2D variable with your mouse: your IDE may now give you some information about its type
  console.log(box2D);
});
```

### TypeScript

We can get type-safety more simply:

```ts
/**
 * importing from 'box2d-wasm' like this requires you to have
 * {
 *   compilerOptions: {
 *     moduleResolution: "node"
 *   }
 * }
 * in your tsconfig.json
 */
import Box2DFactory from 'box2d-wasm';

Box2DFactory().then((box2D: typeof Box2D & EmscriptenModule) => {
  console.log(box2D);
});
```