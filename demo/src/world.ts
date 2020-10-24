import type { Box2DEmscriptenModule } from 'box2d-wasm';
import { Helpers } from './helpers';

export interface WorldParams {
  box2D: Box2DEmscriptenModule;
  debugDraw: Box2D.JSDraw;
}
export interface World {
  world: Box2D.b2World;
  rope: Box2D.b2Rope;
  destroy(): void;
}

export const createWorld = ({
  box2D,
  debugDraw
}: WorldParams): World => {
  const { b2_dynamicBody, b2BodyDef, b2CircleShape, b2Draw: { e_jointBit, e_shapeBit }, b2EdgeShape, b2Fixture,
    b2Rope, b2RopeDef, b2RopeTuning,
    b2Vec2, b2World, destroy, JSQueryCallback, wrapPointer, _malloc, _free, HEAPF32 } = box2D;
  const myQueryCallback = new JSQueryCallback();

  myQueryCallback.ReportFixture = (fixturePtr: number): boolean => {
      const fixture = wrapPointer( fixturePtr, b2Fixture );
      if ( fixture.GetBody().GetType() != b2_dynamicBody ) //mouse cannot drag static bodies around
        return true;
      console.log(fixture);
      return false;
  };
  const helpers = new Helpers(box2D);
  const { createPolygonShape, createRandomPolygonShape, createChainShape } = helpers;
  debugDraw.SetFlags(e_shapeBit | e_jointBit);
  const world = new b2World(new b2Vec2(0.0, -10.0));
  world.SetDebugDraw(debugDraw);
  const bd_ground = new b2BodyDef();
  const groundBody = world.CreateBody(bd_ground);

  //ground edges
  const shape0 = new b2EdgeShape();
  shape0.SetTwoSided(new b2Vec2(-40.0, -6.0), new b2Vec2(40.0, -6.0));
  groundBody.CreateFixture(shape0, 0.0);
  shape0.SetTwoSided(new b2Vec2(-9.0, -6.0), new b2Vec2(-9.0, -4.0));
  groundBody.CreateFixture(shape0, 0.0);
  shape0.SetTwoSided(new b2Vec2(9.0, -6.0), new b2Vec2(9.0, -4.0));
  groundBody.CreateFixture(shape0, 0.0);

  const cshape = new b2CircleShape();
  cshape.set_m_radius(0.5);

  {
    //falling shapes
    const ZERO = new b2Vec2(0, 0);
    const temp = new b2Vec2(0, 0);
    for (let i = 0; i < 20; i++) {
      const bd = new b2BodyDef();
      bd.set_type(b2_dynamicBody);
      bd.set_position(ZERO);
      const body = world.CreateBody(bd);
      const randomValue = Math.random();
      const shape = randomValue < 0.2 ? cshape : createRandomPolygonShape(0.5);
      body.CreateFixture(shape, 1.0);
      temp.Set(16*(Math.random()-0.5), 4.0 + 2.5 * i);
      body.SetTransform(temp, 0.0);
      body.SetLinearVelocity(ZERO);
      body.SetEnabled(true);
    }
  }


  // rope
  let massesBuffer: number | undefined;
  let verticesBuffer: number | undefined;
  const rope = new b2Rope();
  {
    const ropeLen = 20;
    const masses = new Float32Array(ropeLen);
    // https://csharp.hotexamples.com/examples/Box2D.Rope/b2RopeDef/-/php-b2ropedef-class-examples.html
    // https://becominghuman.ai/passing-and-returning-webassembly-array-parameters-a0f572c65d97
    masses.fill(1);
    masses[0] = 0;
    masses[1] = 0;

    const floatsPerVertex = 2; // b2Vec is a struct of `float x, y`
    const vertices = new Float32Array(ropeLen * floatsPerVertex);

    // Populate the array with the values
    for (let i = 0; i < ropeLen; i++) {
      vertices[i*2] = 0;
      vertices[i*2+1] = 5 - 0.25 * i;
    }

    // Allocate some space in the heap for the data (making sure to use the appropriate memory size of the elements)
    massesBuffer = _malloc(masses.length * masses.BYTES_PER_ELEMENT);
    verticesBuffer = _malloc(vertices.length * floatsPerVertex * vertices.BYTES_PER_ELEMENT);

    // Assign the data to the heap - Keep in mind bytes per element
    HEAPF32.set(masses, massesBuffer >> 2);
    HEAPF32.set(vertices, verticesBuffer >> 2);

    const tuning = new b2RopeTuning();
    // tuning.set_damping(0.1);

    const ropeDef = new b2RopeDef();
    // for (let i = 0; i < 2; i ++)
    //   ropeDef.set_masses(i, 0);
    // for (let i = 2; i < ropeLen; i ++)
    //   ropeDef.set_masses(i, 1);
    const wrappedMasses = wrapPointer(massesBuffer);
    const wrappedVertices = wrapPointer(verticesBuffer, box2D.b2Vec2);
    ropeDef.set_masses(wrappedMasses);
    ropeDef.set_vertices(wrappedVertices);
    // ropeDef.set_vertices(wrapPointer(verticesBuffer, b2Vec2));
    ropeDef.set_count(ropeLen);
    ropeDef.set_gravity(new b2Vec2(0, -10));
    ropeDef.set_tuning(tuning);
    ropeDef.set_position(new b2Vec2(3, 0));

    rope.Create(ropeDef);
  }

  //static polygon and chain shapes
  {
    const verts = [];
    verts.push( new b2Vec2( 7,-1) );
    verts.push( new b2Vec2( 8,-2) );
    verts.push( new b2Vec2( 9, 3) );
    verts.push( new b2Vec2( 7, 1) );
    const polygonShape = createPolygonShape(verts);
    groundBody.CreateFixture(polygonShape, 0.0);
    
    //mirror vertices in x-axis and use for chain shape
    for (let i = 0; i < verts.length; i++)
        verts[i].set_x( -verts[i].get_x() );
    verts.reverse();
    const chainShape = createChainShape(verts, true);//true for closed loop *** some problem with this atm
    // polygonShape = createPolygonShape(verts);
    groundBody.CreateFixture(chainShape, 0.0);
  }
  return {
    world,
    rope,
    destroy() {
      destroy(world);
      _free(massesBuffer!);
      _free(verticesBuffer!);
    }
  };
}