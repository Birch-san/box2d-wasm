# Draw the falling box

_Please ensure you have completed the previous step, [Make a falling box](01-make-a-falling-box.md)._

Add a canvas to your index.html:

```diff
- <body></body>
+ <body>
+   <canvas id="demo-canvas" width="800" height="700"></canvas>
+ </body>
```

Copy the file [`debugDraw.js`](../demo/modern/public/debugDraw.js) into your project, alongside `demo.js`.

`demo.js` needs to import `debugDraw.js`:

```diff
+ import { makeDebugDraw } from './debugDraw.js';
  import Box2DFactory from './Box2D.js';
```

`demo.js` needs to locate the canvas that we added to `index.html`, and pass it to `debugDraw`:

```js
/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("demo-canvas");
const ctx = canvas.getContext('2d');

const pixelsPerMeter = 32;
const cameraOffsetMetres = {
  x: 0,
  y: 0
};

const debugDraw = makeDebugDraw(ctx, pixelsPerMeter, box2D);
world.SetDebugDraw(debugDraw);
```

Delete `whereIsOurSquare()`:

```diff
- /**
- * Prints out the vertical position of our falling square
- * (this is easier than writing a full renderer)
- */
- const whereIsOurSquare = () => {
-   {
-     const {x, y} = body.GetLinearVelocity();
-     console.log("Square's velocity is:", x, y);
-   }
-   {
-     const {x, y} = body.GetPosition();
-     console.log("Square's position is:", x, y);
-   }
- };
  
  /** @type {number} you can use this handle to cancel the callback via cancelAnimationFrame */
  let handle;
  (function loop(prevMs) {
    const nowMs = window.performance.now();
    handle = requestAnimationFrame(loop.bind(null, nowMs));
    const deltaMs = nowMs-prevMs;
    step(deltaMs);
-   whereIsOurSquare();
  }(window.performance.now()));
```

Declare a new function, `drawCanvas()`:

```js
const drawCanvas = () => {
  ctx.fillStyle = 'rgb(0,0,0)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.scale(pixelsPerMeter, pixelsPerMeter);
  const { x, y } = cameraOffsetMetres;
  ctx.translate(x, y);
  ctx.lineWidth /= pixelsPerMeter;
  
  ctx.fillStyle = 'rgb(255,255,0)';
  world.DebugDraw();

  ctx.restore();
};
```

Modify our game loop such that it invokes `drawCanvas()`:

```diff
  /** @type {number} you can use this handle to cancel the callback via cancelAnimationFrame */
  let handle;
  (function loop(prevMs) {
    const nowMs = window.performance.now();
    handle = requestAnimationFrame(loop.bind(null, nowMs));
    const deltaMs = nowMs-prevMs;
    step(deltaMs);
-   whereIsOurSquare();
+   drawCanvas();
  }(window.performance.now()));
```

You should see a falling box now.

