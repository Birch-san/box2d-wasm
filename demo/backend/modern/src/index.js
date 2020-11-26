import Box2DFactory from 'box2d-wasm';
import { assertFloatEqual } from './assertFloatEqual';

const { b2BodyDef, b2_dynamicBody, b2PolygonShape, b2Vec2, b2World } = await Box2DFactory();

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

const timeStepMillis = 1/60;
const velocityIterations = 1;
const positionIterations = 1;
const floatCompareTolerance = 0.01;

const iterations = 6;
for (let i=0; i<iterations; i++) {
  const timeElapsedMillis = timeStepMillis*i;
  {
    const {y} = body.GetLinearVelocity();
    assertFloatEqual(y, gravity.y*timeElapsedMillis, floatCompareTolerance);
    {
      const {y} = body.GetPosition();
      assertFloatEqual(y, 0.5*gravity.y*timeElapsedMillis**2, floatCompareTolerance);
    }
  }
  world.Step(timeStepMillis, velocityIterations, positionIterations);
}

console.log(`👍 Ran ${iterations} iterations of a falling body. Body had the expected position on each iteration.`);