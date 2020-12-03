import type { Helpers } from './helpers';

export interface World {
  step(deltaMs: number): void;
  draw(): void;
  destroy(): void;
}

export class WorldFactory {
  constructor(
    private readonly box2D: typeof Box2D & EmscriptenModule,
    private readonly helpers: Helpers
    ) {
  }
  create(renderer: Box2D.JSDraw): World {
    const { b2_dynamicBody, b2BodyDef, b2Fixture,
    b2Vec2, b2World, destroy, JSQueryCallback, wrapPointer } = this.box2D;
    const myQueryCallback = new JSQueryCallback();

    myQueryCallback.ReportFixture = (fixturePtr: number): boolean => {
        const fixture = wrapPointer( fixturePtr, b2Fixture );
        if ( fixture.GetBody().GetType() != b2_dynamicBody ) //mouse cannot drag static bodies around
          return true;
        console.log(fixture);
        return false;
    };
    const world = new b2World(new b2Vec2(0.0, -10.0));
    world.SetDebugDraw(renderer);
    const bd_ground = new b2BodyDef();
    const groundBody = world.CreateBody(bd_ground);

    //ground edges
    this.createFixtures(groundBody);

    this.createFallingShapes(world);

    // rope
    const { rope, destroy: destroyRope } = this.createRope();

    this.createStaticPolygonAndChainShapes(groundBody);

    // calculate no more than a 60th of a second during one world.Step() call
    const maxTimeStepMs = 1/60*1000;

    return {
      step(deltaMs: number) {
        const clampedDeltaMs = Math.min(deltaMs, maxTimeStepMs);
        world.Step(clampedDeltaMs/1000, 3, 2);
        rope.Step(clampedDeltaMs/1000, 3, new b2Vec2(0, 0));
      },
      draw() {
        world.DebugDraw();
        rope.Draw(renderer);
      },
      destroy() {
        destroy(world);
        destroyRope();
      }
    };
  }

  /** ground edges */
  private createFixtures = (groundBody: Box2D.b2Body) => {
    const { b2EdgeShape, b2Vec2 } = this.box2D;
    const shape0 = new b2EdgeShape();
    shape0.SetTwoSided(new b2Vec2(-40.0, -6.0), new b2Vec2(40.0, -6.0));
    groundBody.CreateFixture(shape0, 0.0);
    shape0.SetTwoSided(new b2Vec2(-9.0, -6.0), new b2Vec2(-9.0, -4.0));
    groundBody.CreateFixture(shape0, 0.0);
    shape0.SetTwoSided(new b2Vec2(9.0, -6.0), new b2Vec2(9.0, -4.0));
    groundBody.CreateFixture(shape0, 0.0);
  };

  private createStaticPolygonAndChainShapes = (groundBody: Box2D.b2Body): void => {
    const { createChainShape, createPolygonShape } = this.helpers;
    const { b2Vec2 } = this.box2D;
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
  };

  private createFallingShapes = (world: Box2D.b2World): void => {
    const { createRandomPolygonShape } = this.helpers;
    const { b2BodyDef, b2CircleShape, b2Vec2, b2_dynamicBody } = this.box2D;

    const cshape = new b2CircleShape();
    cshape.set_m_radius(0.5);

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

  private createRope = (): {
    rope: Box2D.b2Rope;
    destroy(): void;
  } => {
    const { b2Rope, b2RopeDef, b2RopeTuning, b2Vec2, pointsToVec2Array, toFloatArray } = this.box2D;
    const rope = new b2Rope();
    const ropeLen = 37;
    // https://csharp.hotexamples.com/examples/Box2D.Rope/b2RopeDef/-/php-b2ropedef-class-examples.html
    const masses: number[] = Array(ropeLen).fill(1);
    masses[0] = 0;
    masses[masses.length-1] = 0;

    const vertices: Box2D.Point[] = Array(ropeLen)
      .fill(undefined)
      .map((_: undefined, index: number): Box2D.Point => ({
        x: -9 + 0.5 * index,
        y: -6
      }));
  
    const tuning = new b2RopeTuning();
    // tuning.set_damping(0.1);
  
    const ropeDef = new b2RopeDef();
    const [wrappedMasses, destroyMasses]: [Box2D.WrapperObject, () => void] = toFloatArray(masses);
    const [wrappedVertices, destroyVertices]: [Box2D.b2Vec2, () => void] = pointsToVec2Array(vertices);
    ropeDef.set_masses(wrappedMasses);
    ropeDef.set_vertices(wrappedVertices);
    ropeDef.set_count(ropeLen);
    ropeDef.set_gravity(new b2Vec2(0, -10));
    ropeDef.set_tuning(tuning);
    ropeDef.set_position(new b2Vec2(0, 0));
  
    rope.Create(ropeDef);
    return {
      rope,
      destroy() {
        destroyMasses();
        destroyVertices();
      }
    }
  };
}