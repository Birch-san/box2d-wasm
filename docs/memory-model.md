## Memory model

Any object that you create with `new`: it is your responsibility to destroy that object via `destroy()`:

```js
import Box2DFactory from 'box2d-wasm';
const { b2_dynamicBody, b2BodyDef, b2Vec2, b2PolygonShape, b2World, destroy, getPointer, NULL } = await Box2DFactory();

const gravity = new b2Vec2(0, 10);
// in this particular case, Box2D does **not** retain a reference to our b2Vec2
// it takes a copy instead.
const world = new b2World(gravity);
// we are finished using the b2Vec2, and we know Box2D will not use it either.
destroy(gravity);

// now we'll demonstrate how a b2Vec2 can be re-used (instead of throwing it away immediately)
const tmp = new b2Vec2(0, 0);
const bd = new b2BodyDef();
bd.set_type(b2_dynamicBody);
// b2BodyDef#set_position takes a _copy_ of our b2Vec2
bd.set_position(tmp);
// it's safe to destroy tmp now, but let's keep it alive so we can re-use it.

// b2BodyDef is a _template_. b2World#CreateBody() takes a _copy_ of it.
const body = world.CreateBody(bd);
destroy(bd);

// b2PolygonShape is a _template_. b2Body#CreateFixture() takes a _copy_ of it.
const square = new b2PolygonShape();
square.SetAsBox(1, 1);
body.CreateFixture(square, 1);
// it's safe to destroy square now, because Box2D took copies of it rather than retaining a reference
destroy(square);

// let's re-use tmp
tmp.Set(1, 1);
// b2Body#SetTransform takes a _copy_ of our b2Vec2
body.SetTransform(tmp, 0);
// it's safe to destroy tmp, because Box2D took copies of it rather than retaining a reference
destroy(tmp);

world.Step(1/60, 1, 1);

for (let body = world.GetBodyList(); getPointer(body) !== getPointer(NULL); body = body.GetNext()) {
  // Box2D owns the b2Vec2 returned by b2Body#GetPosition(); we do not need to destroy it
  const { x, y } = body.GetPosition();
  console.log(x, y);

  // now let's tidy up
  // this b2Body was created with b2World#CreateBody(), so Box2D manages the memory, not us.
  // we should not use destroy(body). instead we should use b2World#DestroyBody()
  // this also destroys all fixtures on the body.
  world.DestroyBody(body);
}

// we are finished using the world
destroy(world);
```

## Memory re-use

Recognising memory leaks in Box2D is difficult. If you `b2World#CreateBody()`, Box2D's small block allocator will grow the WASM heap. But if you `b2World#DestroyBody()` afterwards, the small block allocator will _designate the memory as reusable_ but will **not** shrink the heap.

This is not necessarily a memory leak; your next `b2World#CreateBody()` may be able to reuse that memory **without growing the heap further**.

A consequence of this re-use is that you should avoid assigning custom properties to objects that you receive via factory functions such as `b2World#CreateBody()`. See the [managing user data](user-data.md) docs for further detail.

`new` grows the heap, and `destroy()` shrinks the heap. I've measured this and the heap didn't always go back down to quite the same size. Maybe my measurements are wrong though.