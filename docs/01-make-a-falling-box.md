# Make a falling box

_Please ensure you have completed the previous step, [Integrating `box2d-wasm` into your application](00-importing-box2d-wasm.md)._

Once you've got your `box2D` instance: you can create instances of the classes on it.

Let's make a world, and define inside that world a square-shaped dynamic body:

```js
const { b2BodyDef, b2_dynamicBody, b2PolygonShape, b2Vec2, b2World } = box2D;

// in metres per second squared
const gravity = new b2Vec2(0, 10);
const world = new b2World(gravity);

const sideLengthMetres = 1;
const square = new b2PolygonShape();
square.SetAsBox(sideLengthMetres/2, sideLengthMetres/2);

const zero = new b2Vec2(0, 0);

const bd = new b2BodyDef();
bd.set_type(b2_dynamicBody);
bd.set_position(zero);

const body = world.CreateBody(bd);
body.CreateFixture(square, 1);
body.SetTransform(zero, 0);
body.SetLinearVelocity(zero);
body.SetAwake(true);
body.SetEnabled(true);
```

Now let's start running the physics simulation:

```js
// calculate no more than a 60th of a second during one world.Step() call
const maxTimeStepMs = 1/60*1000;
const velocityIterations = 1;
const positionIterations = 1;

/**
 * Advances the world's physics by the requested number of milliseconds
 * @param {number} deltaMs
 */
const step = (deltaMs) => {
  const clampedDeltaMs = Math.min(deltaMs, maxTimeStepMs);
  world.Step(clampedDeltaMs/1000, velocityIterations, positionIterations);
};

/**
 * Prints out the vertical position of our falling square
 * (this is easier than writing a full renderer)
 */
const whereIsOurSquare = () => {
  {
    const {x, y} = body.GetLinearVelocity();
    console.log("Square's velocity is:", x, y);
  }
  {
    const {x, y} = body.GetPosition();
    console.log("Square's position is:", x, y);
  }
};

/** @type {number} you can use this handle to cancel the callback via cancelAnimationFrame */
let handle;
(function loop(prevMs) {
  const nowMs = window.performance.now();
  handle = requestAnimationFrame(loop.bind(null, nowMs));
  const deltaMs = nowMs-prevMs;
  step(deltaMs);
  whereIsOurSquare();
}(window.performance.now()));
```

This should tell us that the x position and velocity remain at zero, but that y velocity increases (until terminal velocity) and y position increases at an accelerating rate.