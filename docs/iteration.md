## Iterating over lists

There are two ways in which Box2D lists are exposed — via methods, such as:

- `b2World#GetBodyList()`
- `b2Body#GetFixtureList()`

and via properties such as:

- `b2PolygonShape#m_vertices`
  - This isn't so useful (only lets you access the first item in the list)
- `b2PolygonShape#get_m_vertices(index?: number)`
  - If you don't specify an index, you will get the first item
- `b2PolygonShape#set_m_vertices(index: number, m_vertices_elem: b2Vec2)`

Sometimes a separate method exists to tell you the length. For example, `b2World#GetBodyList()` has a corresponding `b2World#GetBodyCount()`, and `b2PolygonShape#get_m_vertices(index?: number)` has a corresponding `b2PolygonShape#get_m_count()`.

All such functions give you a JS object representing some element in the list. You will have to use `getPointer()` to validate whether the JS object points to a valid element (there are no protections to warn you that you've gone past the end of the list, and the list may even be empty).

If the JS object you're given has a pointer of `0` (or `getPointer(NULL)`), then it does not represent any actual item; you've gone past the end of the list.

```js
import Box2DFactory from 'box2d-wasm';
const { b2Vec2, b2PolygonShape, b2World, getPointer, NULL } = await Box2DFactory();

const world = new b2World(new b2Vec2(0, 10));
for (let body = world.GetBodyList(); getPointer(body) !== getPointer(NULL); body = body.GetNext()) {
  for (let fixture = body.GetFixtureList(); getPointer(fixture) !== getPointer(NULL); fixture = fixture.GetNext()) {
  }
}

const square = new b2PolygonShape();
square.SetAsBox(1, 1);
for (let vertexIx = 0; vertexIx < square.get_m_count(); vertexIx++) {
  const vertex = square.get_m_vertices(vertexIx);
}
```