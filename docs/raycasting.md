# Raycasting

You can use `b2World#rayCast()` to query "would a line drawn from here to there intersect with any fixtures?"

```js
const { b2BodyDef, b2EdgeShape, b2Fixture, b2Vec2, JSRayCastCallback, wrapPointer, b2World } = box2D;
const callback = Object.assign(new JSRayCastCallback(), {
  /**
   * @param {number} fixture_p pointer to {@link Box2D.b2Fixture}
   * @param {number} point_p pointer to {@link Box2D.b2Vec2}
   * @param {number} normal_p pointer to {@link Box2D.b2Vec2}
   * @param {number} fraction
   * @returns {number} -1 to filter, 0 to terminate, fraction to clip the ray for closest hit, 1 to continue
   */
  ReportFixture: (fixture_p, point_p, normal_p, fraction) => {
    const fixture = wrapPointer(fixture_p, b2Fixture);
    const point = wrapPointer(point_p, b2Vec2);
    const normal = wrapPointer(normal_p, b2Vec2);
    console.log(fixture);
    return 0;
  }
});

const world = new b2World(new b2Vec(0, 10));

// make a line from left to right, vertically in the middle
const shape = new b2EdgeShape();
shape.SetTwoSided(new b2Vec2(0, 1), new b2Vec2(2, 1));

const bd_ground = new b2BodyDef();
const ground = world.CreateBody(bd_ground);
ground.CreateFixture(shape, 0);

// cast a ray from top-left to bottom-right
const point1 = new b2Vec2(0, 0);
const point2 = new b2Vec2(2, 2);
// this will trigger our callback, saying that the ray intersects our line fixture
world.RayCast(callback, point1, point2);
```