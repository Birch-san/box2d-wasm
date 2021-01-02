## Managing user data

If you've used Box2D before, you may recall that it has a concept of userData (see `b2Body#GetUserData()` and `b2BodyUserData`). We cannot make use of this system easily in `box2d-wasm`; it would require modifying the WASM heap (e.g. with API calls into the C++ program). We've not exposed any helpers to modify the Box2D userData because it's difficult and not very useful (you'd be very limited in what kinds of information you could store on it).

Let's explore other ways to store your metadata.

You'll find that you **cannot** safely assign properties to the JS objects that you receive from `box2d-wasm`. The following is dangerous:

```js
const body = world.CreateBody(bd);
// this is dangerous! you'll see why soon..
body.favouriteDessert = 'pie';
const bodyPointer = getPointer(body);
world.DestroyBody(body);

// ..because b2World#CreateBody() recycles memory freed by b2World#DestroyBody()
const body2 = world.CreateBody(bd);
const body2Pointer = getPointer(body);
// it points to the same memory on the WASM heap as our previous b2Body
// ..well, this part isn't a problem. Box2D resets all the properties that Box2D manages.
console.log(bodyPointer === body2Pointer) // true
// the *bigger problem* is that it re-uses the same JS object as our previous b2Body
console.log(body === body2) // true
// and so it still has all the same properties we assigned to our previous b2Body
console.log(body2.favouriteDessert) // 'pie'
```

To be safe from Emscripten's JS object re-use: you should store metadata _outside_ of your JS object:

```js
/** @type {Object.<number, unknown}} */
const metadata = {}

const body = world.CreateBody(bd);

// create metadata for this body
metadata[getPointer(body)] = {
  favouriteDessert: 'pie'
}

// whenever we destroy a body, we should also destroy its metadata
world.DestroyBody(body)
delete metadata[getPointer(body)]
}
```

You could even skip the `getPointer(body)`, and take advantage of the fact that b2Body references are reused:

```js
/** @type {Object.<Box2D.b2Body, unknown}} */
const metadata = {}
metadata[body] = {
  favouriteDessert: 'pie'
}
world.DestroyBody(body)
delete metadata[body]
```

If you would prefer to feel more like your metadata lives _on_ the JS object, you can create that illusion using JavaScript's prototypical inheritance:

```js
/** @type {Object.<Box2D.b2Body, Box2D.b2Body}} */
const hydratedInstances = {}
hydratedInstances[body] = Object.setPrototypeOf({
  favouriteDessert: 'pie'
}, body)

// you can retrieve metadata
console.log(hydratedInstances[body].favouriteDessert)
// you can invoke b2Body functionality too
console.log(hydratedInstances[body].GetMass())

world.DestroyBody(body)
delete hydratedInstances[body]
```