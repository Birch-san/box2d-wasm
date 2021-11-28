# Memory model

## Every `new` needs a corresponding `destroy()`

_See the next section for an explanation of what we're doing with `LeakMitigator`'s `recordLeak` / `freeLeaked`._

Any object that you create with `new`: it is your responsibility to destroy that object via `destroy()`:

```js
import Box2DFactory from 'box2d-wasm';
const { b2_dynamicBody, b2BodyDef, b2Vec2, b2PolygonShape, b2World, destroy, getPointer, LeakMitigator, NULL } = await Box2DFactory();
const { freeLeaked, recordLeak } = new LeakMitigator()

// Emscripten class constructors invoke Emscripten's malloc(), which grows the WASM heap
const gravity = new b2Vec2(0, 10);
// in this particular case, Box2D does **not** retain a reference to our b2Vec2;
// it takes a copy.
const world = new b2World(gravity);
// we are finished using the b2Vec2
// destroy() frees the malloc()ed memory from the WASM heap, and deletes the reference
// to the gravity JS object retained in b2Vec2::__cache__.
destroy(gravity);

// now we'll demonstrate how a b2Vec2 can be re-used (instead of throwing it away immediately)
const tmp = new b2Vec2(0, 0);
const bd = new b2BodyDef();
bd.set_type(b2_dynamicBody);
// b2BodyDef#set_position takes a _copy_ of our b2Vec2
bd.set_position(tmp);
// it's safe to destroy tmp now, but let's keep it alive so we can re-use it.

// b2BodyDef is a _template_. b2World#CreateBody() takes a _copy_ of it.
// Box2D will use its internal object allocators (which *may* invoke malloc() -- growing
// the WASM heap -- or may re-use older memory that's since been marked as reusable).
// we use recordLeak() to track the fact that world#CreateBody() stores a reference to
// the b2Body JS object in b2Body::__cache__ -- we will evict this cache entry later.
const body = recordLeak(world.CreateBody(bd));
// world#CreateBody() does not retain a reference to `bd`; safe to destroy
destroy(bd);

// b2PolygonShape is a _template_. b2Body#CreateFixture() takes a _copy_ of it.
const square = new b2PolygonShape();
square.SetAsBox(1, 1);
// any method which return a JS object, needs to be recorded in our LeakMitigator
recordLeak(body.CreateFixture(square, 1));
// it's safe to destroy square now, because Box2D took copies of it rather than retaining a reference
destroy(square);

// let's re-use tmp
tmp.Set(1, 1);
// b2Body#SetTransform takes a _copy_ of our b2Vec2
body.SetTransform(tmp, 0);
// it's safe to destroy tmp, because Box2D took copies of it rather than retaining a reference
destroy(tmp);

world.Step(1/60, 1, 1);

// we wrap world#GetBodyList() and body#GetNext() with recordLeak() because they're
// methods which return JS objects.
// some of these bodies are already recorded in our LeakMitigator (because we recorded the body
// leaked by world#CreateBody()). LeakMitigator ignores duplicates, so this is fine.
// the list ends with a reference to NULL. this is reference leaks too, so we record it.
for (
  let body = recordLeak(world.GetBodyList());
  getPointer(body) !== getPointer(NULL);
  body = recordLeak(body.GetNext())
  ) {
  // what happens when we invoke a getter which returns an object?
  // that's right, we need recordLeak().
  // but we don't need `destroy()` (this b2Vec2 wasn't created via `new`).
  const position = recordLeak(body.GetPosition());
  const { x, y } = position;
  console.log(x, y);

  // now let's delete the body.
  // we don't need `destroy()` (this b2Body wasn't created via `new`).
  // this b2Body was created with b2World#CreateBody(), so Box2D manages the memory, not us.
  // this also destroys all fixtures on the body, and b2Vec2s like the "position" we read above.
  world.DestroyBody(body);
}

// we are finished using the world
destroy(world);

freeLeaked();
```

## JS objects returned by functions require manual eviction from Emscripten cache

Calling `new` on an Emscripten object does two things:  
- allocates memory on the WASM heap with `malloc()`
- creates an Emscripten-wrapped JS object using `wrapPointer()`.

When you're done with the Emscripten-wrapped JS object, you should `destroy()` it.
`destroy()` does two things:  
- invokes the class's `__destroy__`, which performs `free()`
  - this frees the dynamically-allocated memory from the WASM heap
- deletes from the class's cache, the reference it retains to the Emscripten-wrapped JS object
  - this eliminates a JS memory leak

There's a couple of gaps here.  
- how should we clean up after we ourselves invoke `wrapPointer()`?
- how should we clean up after we receive an Emscripten-wrapped JS object from a method?

`LeakMitigator` provides helper methods to solve those gaps.

### using `freeFromCache` to free a single reference

```js
import Box2DFactory from 'box2d-wasm';
const { b2BodyDef, b2Vec2, b2World, getPointer, LeakMitigator } = await Box2DFactory()
const { freeFromCache } = LeakMitigator

// we invoked `new`; we should `destroy()` when we're done with it
const gravity = new b2Vec2(0, 10)

// b2World takes a copy-by-value of gravity; we are done with it
const world = new b2World(gravity)
// free from WASM heap + delete cached JS reference
destroy(gravity)

const bd_ground = new b2BodyDef()

// world#CreateBody() returns a JS object built via wrapPointer
// b2Body::__cache__ retains a reference to the object
const ground = world.CreateBody(bd_ground)

// if we have created all the bodies we need from this template, we are free to destroy it.
// world#CreateBody() does not retain any reference to it (it accepts b2BodyDef via copy-by-value)
destroy(bd_ground)

// when we are done with `ground`:
world.DestroyBody(ground);
// delete the reference to the `ground` JS object in b2Body's __cache__
freeFromCache(ground);
```

### using `recordLeak`/`freeLeaked` to free many references in one go

```js
import Box2DFactory from 'box2d-wasm';
const { b2BodyDef, b2Vec2, b2World, getPointer, LeakMitigator } = await Box2DFactory()
const { freeLeaked, recordLeak } = new LeakMitigator()

// we invoked `new`; we should `destroy()` when we're done with it
const gravity = new b2Vec2(0, 10)

// b2World takes a copy-by-value of gravity; we are done with it
const world = new b2World(gravity)
// free from WASM heap + delete cached JS reference
destroy(gravity)

const bd_ground = new b2BodyDef()

// world#CreateBody() returns a JS object built via wrapPointer
// b2Body::__cache__ retains a reference to the object
const ground = recordLeak(world.CreateBody(bd_ground))

// if we have created all the bodies we need from this template, we are free to destroy it.
// world#CreateBody() does not retain any reference to it (it accepts b2BodyDef via copy-by-value)
destroy(bd_ground)

// fast-forward to later, where we tear down the Box2D experiment...

// we wrap world#GetBodyList() and body#GetNext() with recordLeak() because they're
// methods which return JS objects.
// some of these bodies are already recorded in our LeakMitigator (because we recorded the body
// leaked by world#CreateBody()). LeakMitigator ignores duplicates, so this is fine.
// the list ends with a reference to NULL. this is reference leaks too, so we record it.
for (
  let body = recordLeak(world.GetBodyList());
  getPointer(body) !== getPointer(NULL);
  body = recordLeak(body.GetNext())
  ) {
  // this b2Body was created with b2World#CreateBody(), so Box2D manages the memory, not us.
  // we should not use destroy(body). instead we should use b2World#DestroyBody()
  // this also destroys all fixtures on the body.
  world.DestroyBody(body);
}

// delete from the __cache__ of applicable b2* classes:
// every JS object reference that this LeakMitigator recorded
freeLeaked()
```

## Memory re-use

Recognising memory leaks in Box2D is difficult. If you `b2World#CreateBody()`, Box2D's small block allocator will grow the WASM heap. But if you `b2World#DestroyBody()` afterwards, the small block allocator will _designate the memory as reusable_ but will **not** shrink the heap.

This is not necessarily a memory leak; your next `b2World#CreateBody()` may be able to reuse that memory **without growing the heap further**.

A consequence of this re-use is that you should avoid assigning custom properties to objects that you receive via factory functions such as `b2World#CreateBody()`. See the [managing user data](user-data.md) docs for further detail.

`new` grows the heap (because it calls `malloc()`), and  
`destroy()` shrinks the heap (because it calls `free()`).