<script lang="typescript">
  import Box2D from 'Box2D';
  import { onMount } from 'svelte';
  import { CanvasDebugDraw } from './debugDraw';
  import { Helpers } from './helpers';

	let canvas: HTMLCanvasElement;

	onMount(async () => {
    const box2D = await Box2D();

    const ctx = canvas.getContext('2d');

    const { b2BodyDef, b2CircleShape, b2EdgeShape, b2Vec2, b2World, b2_dynamicBody } = box2D;
    const helpers = new Helpers(box2D);
    const { createPolygonShape, createRandomPolygonShape, createChainShape } = helpers;
    const debugDraw = new CanvasDebugDraw(box2D, helpers, ctx!).constructJSDraw();
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

    //falling shapes
    const ZERO = new b2Vec2(0, 0);
    const temp = new b2Vec2(0, 0);
    new Array(2).fill(undefined).forEach((_, index: number) => {
      const bd = new b2BodyDef();
      bd.set_type(b2_dynamicBody);
      bd.set_position(ZERO);
      const body = world.CreateBody(bd);
      const randomValue = Math.random();
      const shape = randomValue < 0.2 ? cshape : createRandomPolygonShape(0.5);
      body.CreateFixture(shape, 1.0);
      temp.Set(16*(Math.random()-0.5), 4.0 + 2.5*index);
      body.SetTransform(temp, 0.0);
      body.SetLinearVelocity(ZERO);
      body.SetAwake(1);
      // body.SetActive(1); // no longer exists
    });

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

		// let handle: number | undefined;

		// (function loop() {
		// 	handle = requestAnimationFrame(loop);

		// 	const imageData = ctx!.getImageData(0, 0, canvas.width, canvas.height);

		// 	for (let p = 0; p < imageData.data.length; p += 4) {
		// 		const i = p / 4;
		// 		const x = i % canvas.width;
		// 		const y = i / canvas.height >>> 0;

		// 		const t = window.performance.now();

		// 		const r = 64 + (128 * x / canvas.width) + (64 * Math.sin(t / 1000));
		// 		const g = 64 + (128 * y / canvas.height) + (64 * Math.cos(t / 1000));
		// 		const b = 128;

		// 		imageData.data[p + 0] = r;
		// 		imageData.data[p + 1] = g;
		// 		imageData.data[p + 2] = b;
		// 		imageData.data[p + 3] = 255;
		// 	}

		// 	ctx!.putImageData(imageData, 0, 0);
		// }());

		// return () => {
		// 	cancelAnimationFrame(handle!);
		// };
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
