<script lang="typescript">
  import Box2D from 'box2d-wasm';
  import { onMount } from 'svelte';
  import { CanvasDebugDraw } from './debugDraw';
  import { Helpers } from './helpers';

  let canvas: HTMLCanvasElement;
  
  interface Point {
    x: number;
    y: number;
  }

	onMount(async () => {
    const box2D = await Box2D();

    const ctx = canvas.getContext('2d');
    const canvasOffset: Point = {
      x: canvas.width/2,
      y: canvas.height/2
    };
    const viewCenterPixel: Point = {
      x: canvas.width/2,
      y: canvas.height/2
    };

    const { b2_dynamicBody, b2BodyDef, b2CircleShape, b2Draw: { e_jointBit, e_shapeBit }, b2EdgeShape, b2Fixture,
      b2Rope, b2RopeDef, b2RopeTuning,
      b2Vec2, b2World, destroy, JSQueryCallback, wrapPointer, _malloc, _free, HEAPF32 } = box2D;
    const myQueryCallback = new JSQueryCallback();

    myQueryCallback.ReportFixture = (fixturePtr: any) => {
        const fixture = wrapPointer( fixturePtr, b2Fixture );
        if ( fixture.GetBody().GetType() != b2_dynamicBody ) //mouse cannot drag static bodies around
          return true;
        console.log(fixture);
        return false;
    };
    const helpers = new Helpers(box2D);
    const { createPolygonShape, createRandomPolygonShape, createChainShape } = helpers;
    const debugDraw = new CanvasDebugDraw(box2D, helpers, ctx!).constructJSDraw();
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
        body.SetEnabled(1);
      }
    }


    // rope
    let massesBuffer: any | undefined;
    let verticesBuffer: any | undefined;
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
      for (let i = 0; i < ropeLen; i += 2) {
        vertices[i] = 0;
        vertices[i+1] = 20 - 0.25 * i;
      }

      // Allocate some space in the heap for the data (making sure to use the appropriate memory size of the elements)
      massesBuffer = _malloc(masses.length * masses.BYTES_PER_ELEMENT);
      verticesBuffer = _malloc(vertices.length * floatsPerVertex * vertices.BYTES_PER_ELEMENT);

      // Assign the data to the heap - Keep in mind bytes per element
      HEAPF32.set(masses, massesBuffer >> 2);
      HEAPF32.set(vertices, verticesBuffer >> 2);

      const tuning = new b2RopeTuning();
      tuning.set_damping(0.1);

      const ropeDef = new b2RopeDef();
      // for (let i = 0; i < 2; i ++)
      //   ropeDef.set_masses(i, 0);
      // for (let i = 2; i < ropeLen; i ++)
      //   ropeDef.set_masses(i, 1);
      ropeDef.set_masses(massesBuffer);
      ropeDef.set_vertices(verticesBuffer);
      // ropeDef.set_vertices(wrapPointer(verticesBuffer, b2Vec2));
      ropeDef.set_count(ropeLen);
      ropeDef.set_gravity(new b2Vec2(0, -10));
      ropeDef.set_tuning(tuning);
      ropeDef.set_position(new b2Vec2(8, 0));

      const rope = new b2Rope();
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

    const PTM = 32;

    const myRound = (val: number, places: number) => {
        let c = 1;
        for (let i = 0; i < places; i++)
          c *= 10;
        return Math.round(val*c)/c;
    }

    const getWorldPointFromPixelPoint = (pixelPoint: Point) => ({
      x: (pixelPoint.x - canvasOffset.x)/PTM,
      y: (pixelPoint.y - (canvas.height - canvasOffset.y))/PTM
    });

    const setViewCenterWorld = (b2vecpos: any, instantaneous: any): void => {
      var currentViewCenterWorld = getWorldPointFromPixelPoint( viewCenterPixel );
      var toMoveX = b2vecpos.get_x() - currentViewCenterWorld.x;
      var toMoveY = b2vecpos.get_y() - currentViewCenterWorld.y;
      var fraction = instantaneous ? 1 : 0.25;
      canvasOffset.x -= myRound(fraction * toMoveX * PTM, 0);
      canvasOffset.y += myRound(fraction * toMoveY * PTM, 0);
    };
    setViewCenterWorld( new b2Vec2(0,0), true );


    const draw = () => {
      //black background
      ctx!.fillStyle = 'rgb(0,0,0)';
      ctx!.fillRect( 0, 0, canvas.width, canvas.height );

      ctx!.save();
      ctx!.translate(canvasOffset.x, canvasOffset.y);
      ctx!.scale(1,-1);                
      ctx!.scale(PTM, PTM);
      ctx!.lineWidth /= PTM;
      
      CanvasDebugDraw.drawAxes(ctx!);
      
      ctx!.fillStyle = 'rgb(255,255,0)';
      world.DebugDraw();
      
      // if ( mouseJoint != null ) {
      //     //mouse joint is not drawn with regular joints in debug draw
      //     var p1 = mouseJoint.GetAnchorB();
      //     var p2 = mouseJoint.GetTarget();
      //     ctx!.strokeStyle = 'rgb(204,204,204)';
      //     ctx!.beginPath();
      //     ctx!.moveTo(p1.get_x(),p1.get_y());
      //     ctx!.lineTo(p2.get_x(),p2.get_y());
      //     ctx!.stroke();
      // }
          
      ctx!.restore();
    };

    // calculate no more than a 20th of a second during one world.Step() call
    const maxTimeStep = 1/20*1000;

    let handle: number | undefined;

    (function loop(prevMs: number) {
      const nowMs = window.performance.now();
      handle = requestAnimationFrame(loop.bind(null, nowMs));
      const delta = Math.min(nowMs-prevMs, maxTimeStep);

			world.Step(delta/1000, 3, 2);
      draw();
		}(window.performance.now()));

		return () => {
      cancelAnimationFrame(handle!);
      destroy(world);
      _free(massesBuffer);
      _free(verticesBuffer);
		};
	});
</script>

<style>
  canvas {
    background-color: #ddd;
    /* -webkit-mask: url(logo.svg) 50% 50% no-repeat;
    mask: url(logo.svg) 50% 50% no-repeat; */
  }
</style>

<canvas
	bind:this={canvas}
	width={640}
	height={480}
></canvas>
