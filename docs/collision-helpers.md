# Collision helpers

- [`b2TestOverlap(a, b)`](#b2testoverlapa-b)
- [`b2TestOverlap(shapeA, indexA, shapeB, indexB, xfA, xfB)`](#b2testoverlapshapea-indexa-shapeb-indexb-xfa-xfb)
- [`b2CollidePolygonAndCircle(shapeA, indexA, shapeB, indexB, xfA, xfB)`](#b2collidepolygonandcircleshapea-indexa-shapeb-indexb-xfa-xfb)
- `b2CollideCircles(manifold, circleA, xfA, circleB, xfB)`
- `b2CollidePolygons(manifold, polygonA, xfA, polygonB, xfB)`
- `b2CollideEdgeAndCircle(manifold, edgeA, xfA, circleB, xfB)`
- `b2CollideEdgeAndPolygon(manifold, edgeA, xfA, polygonB, xfB)`
- `b2ClipSegmentToLine(vOut, vIn, normal, offset, vertexIndexA)`
- `b2GetPointStates(state1, state2, manifold1, manifold2)`

See [`box2d-wasm/Box2DModuleAugmentations.d.ts`](../box2d-wasm/Box2DModuleAugmentations.d.ts) for detailed type declarations.

## `b2TestOverlap(a, b)`

```ts
/** determine if two AABBs overlap */
b2TestOverlap(a: Box2D.b2AABB | number, b: Box2D.b2AABB | number): boolean;
```

Let's make three boxes. From left-to-right, they'll be: 0, 1, 2.  
Each has a side length of 1 meter, and they're lined up edge-to-edge.

<img width="148" alt="image" src="https://user-images.githubusercontent.com/6141784/99731024-30235080-2ab5-11eb-99b8-e1771832b107.png">

We use `b2Shape#ComputeAABB(3)` to compute axis-aligned bounding boxes for each box.  
Then we use `b2TestOverlap(2)` to determine whether those AABBs overlap.

0 overlaps with 1 (just barely; they share an edge).  
0 does not overlap with 2.

```ts
const { b2_dynamicBody, b2AABB, b2TestOverlap, b2BodyDef, b2PolygonShape,
  b2Vec2 } = box2D;
const sideLengthMetres = 1;
const square = new b2PolygonShape();
square.SetAsBox(sideLengthMetres/2, sideLengthMetres/2);

const ZERO = new b2Vec2(0, 0);
const temp = new b2Vec2(0, 0);
const initPosition = (body: Box2D.b2Body, index: number): void => {
  temp.Set(sideLengthMetres*index, 0);
  body.SetTransform(temp, 0);
  body.SetLinearVelocity(ZERO);
  body.SetAwake(true);
  body.SetEnabled(true);
}

const aabbs: Box2D.b2AABB[] = [];
const boxCount = 3;
for (let i = 0; i < boxCount; i++) {
  const bd = new b2BodyDef();
  bd.set_type(b2_dynamicBody);
  bd.set_position(ZERO);
  const body = world.CreateBody(bd);
  body.CreateFixture(square, 1);
  initPosition(body, i);
  const aABB = new b2AABB();
  // the third parameter, childIndex, is unused in b2PolygonShape's implementation of ComputeAABB
  square.ComputeAABB(aABB, body.GetTransform(), 0);
  aabbs.push(aABB);
}
console.log(b2TestOverlap(aabbs[0], aabbs[1])); // true; 0's right edge overlaps 1's left edge
console.log(b2TestOverlap(aabbs[0], aabbs[2])); // false; 0's right edge is a meter horizontally left of 2's left edge
```

## `b2TestOverlap(shapeA, indexA, shapeB, indexB, xfA, xfB)`

```ts
/** determine if two generic shapes overlap */
b2TestOverlap(
  shapeA: Box2D.b2Shape | number, indexA: number,
  shapeB: Box2D.b2Shape | number, indexB: number,
  xfA: Box2D.b2Transform | number, xfB: Box2D.b2Transform | number,
): boolean;
```

Let's make a variety of shapes. From left-to-right, they'll be: 0, 1, 2 (circle, square, circle).  
Each has a side length of 1 meter, and they're lined up edge-to-edge.

<img width="123" alt="image" src="https://user-images.githubusercontent.com/6141784/99733247-c9a03180-2ab8-11eb-8c32-89b7c1e9213f.png">

We use `b2TestOverlap(6)` to determine whether they overlap.

0 overlaps with 1 (just barely; its tangent grazes 1's left edge).  
0 does not overlap with 2.

```ts
const { b2_dynamicBody, b2TestOverlap, b2BodyDef, b2PolygonShape, b2CircleShape,
  b2Vec2 } = box2D;
const sideLengthMetres = 1;
const square = new b2PolygonShape();
square.SetAsBox(sideLengthMetres/2, sideLengthMetres/2);
const circle = new b2CircleShape();
circle.set_m_radius(sideLengthMetres/2);

const ZERO = new b2Vec2(0, 0);
const temp = new b2Vec2(0, 0);
const initPosition = (body: Box2D.b2Body, index: number): void => {
  temp.Set(sideLengthMetres*index, 0);
  body.SetTransform(temp, 0);
  body.SetLinearVelocity(ZERO);
  body.SetAwake(true);
  body.SetEnabled(true);
}

/** encapsulates properties each body needs for calculating collisions */
interface CollisionParams {
  shape: Box2D.b2Shape;
  transform: Box2D.b2Transform;
  childIndex: number;
}
const collisionParams: CollisionParams[] = [];
const bodyCount = 3;
for (let i = 0; i < bodyCount; i++) {
  const bd = new b2BodyDef();
  bd.set_type(b2_dynamicBody);
  bd.set_position(ZERO);
  const body = world.CreateBody(bd);
  const shape = i % 2 ? square : circle;
  body.CreateFixture(shape, 1);
  initPosition(body, i);
  collisionParams.push({
    shape,
    transform: body.GetTransform(),
    /**
     * only chain shapes have child shapes inside them.
     * for other shapes (circle, edge, polygon): childIndex is unused
     */
    childIndex: 0
  });
}

// convenience function for feeding CollisionParams structure into b2TestOverlap
const testOverlap = (
  {
    shape: shape0,
    transform: transform0,
    childIndex: childIndex0
  }: CollisionParams,
  {
    shape: shape1,
    transform: transform1,
    childIndex: childIndex1
  }: CollisionParams,
): boolean => b2TestOverlap(
  shape0,
  childIndex0,
  shape1,
  childIndex1,
  transform0,
  transform1
  );
console.log(testOverlap(collisionParams[0], collisionParams[1])); // true; 0's tangent grazes 1's left edge.
console.log(testOverlap(collisionParams[0], collisionParams[2])); // false; 0 does not overlap 2.
```

## `b2CollidePolygonAndCircle(shapeA, indexA, shapeB, indexB, xfA, xfB)`

```ts
/** Compute the collision manifold between a polygon and a circle. */
  export const b2CollidePolygonAndCircle: (
    manifold: Box2D.b2Manifold | number,
    polygonA: Box2D.b2PolygonShape | number, xfA: Box2D.b2Transform | number,
    circleB: Box2D.b2CircleShape | number, xfB: Box2D.b2Transform | number
    ) => void;
```

This is a void function which mutates the `manifold` that you pass in.

<img width="82" alt="image" src="https://user-images.githubusercontent.com/6141784/99889009-39ddbd00-2c49-11eb-85d3-da7d66c4cb43.png">

The square just barely touches the circle.

We can store the contact points of the collision into a manifold using `b2CollidePolygonAndCircle()`.  
Then, we convert those contact points into world coordinates.

The square is created with a center at `(0,0)`, with side length of `1`.  
The circle is created with a center at `(1,0)`, with diameter of `1`.

A contact point is found at the middle-right of the square: `(0.5,0)`.

```ts
t { b2_dynamicBody, b2Manifold, b2CollidePolygonAndCircle, b2BodyDef, b2PolygonShape, b2CircleShape,
  b2Vec2, b2WorldManifold } = box2D;
const sideLengthMetres = 1;
const square = new b2PolygonShape();
square.SetAsBox(sideLengthMetres/2, sideLengthMetres/2);
const circle = new b2CircleShape();
circle.set_m_radius(sideLengthMetres/2);

const ZERO = new b2Vec2(0, 0);
const temp = new b2Vec2(0, 0);
const initPosition = (body: Box2D.b2Body, index: number): void => {
  temp.Set(sideLengthMetres*index, 0);
  body.SetTransform(temp, 0);
  body.SetLinearVelocity(ZERO);
  body.SetAwake(true);
  body.SetEnabled(true);
}

const transforms: Box2D.b2Transform[] = [];
const bodyCount = 2;
for (let i = 0; i < bodyCount; i++) {
  const bd = new b2BodyDef();
  bd.set_type(b2_dynamicBody);
  bd.set_position(ZERO);
  const body = world.CreateBody(bd);
  const shape = i % 2 ? circle : square;
  body.CreateFixture(shape, 1);
  initPosition(body, i);
  transforms.push(body.GetTransform());
}
const m = new b2Manifold();
b2CollidePolygonAndCircle(m, square, transforms[0], circle, transforms[1]);
console.log(m);
// any collisions?
if (m.pointCount > 0) {
  // transform the contact points into world coordinates
  const w = new b2WorldManifold();
  w.Initialize(m, transforms[0], square.m_radius, transforms[1], circle.m_radius)
  console.log(w);
  const { x, y } = w.get_points(0);
  console.log(x, y); // 0.5049999952316284, 0
}
```