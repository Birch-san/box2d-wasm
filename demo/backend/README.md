# Demo

There are a variety of demos in this directory, which aim to show you how to integrate `box2d-wasm` into your backend.

## [Classic](classic)

Node.js with Common.js imports:

```js
const Box2DFactory = require('box2d-wasm');
```

## [Modern](modern)

Node.js with ES imports:

```js
import Box2DFactory from 'box2d-wasm';
```

## [Modern + TypeScript](modern-ts)

Node.js running TypeScript via [ts-node](https://github.com/TypeStrong/ts-node), configured in the style of https://github.com/dandv/typescript-modern-project

```ts
import Box2DFactory from 'box2d-wasm';
import type { Box2DEmscriptenModule } from 'box2d-wasm';
```