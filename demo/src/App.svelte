<script lang="typescript">
  import { box2D } from './box2d';
  import { onMount } from 'svelte';
  import { CanvasDebugDraw } from './debugDraw';
  import { Helpers } from './helpers';
  import { WorldFactory } from './world';

  interface Point {
    x: number;
    y: number;
  }

  let canvas: HTMLCanvasElement;

	onMount(async () => {
    const { b2Vec2 } = box2D;
    const helpers = new Helpers();
    const ctx = canvas.getContext('2d');
    const canvasOffset: Point = {
      x: canvas.width/2,
      y: canvas.height/2
    };
    const viewCenterPixel: Point = {
      x: canvas.width/2,
      y: canvas.height/2
    };
    const debugDraw = new CanvasDebugDraw(helpers, ctx!).constructJSDraw();
    const { world, rope, destroy } = new WorldFactory().create(debugDraw);

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
      rope.Draw(debugDraw);
      
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
			rope.Step(delta/1000, 3, new b2Vec2(3, 0));
      draw();
		}(window.performance.now()));

		return () => {
      cancelAnimationFrame(handle!);
      destroy();
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
