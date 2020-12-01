<script lang="typescript">
  import Box2DFactory from 'box2d-wasm';
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
    const box2D: typeof Box2D & EmscriptenModule = await Box2DFactory({
      /**
       * By default, this looks for Box2D.wasm relative to public/build/bundle.js:
       * @example (url, scriptDirectory) => `${scriptDirectory}${url}`
       * But we want to look for Box2D.wasm relative to public/index.html instead.
       */
      locateFile: url => url
    });
    const { b2Vec2, b2Draw: { e_shapeBit } } = box2D;
    const helpers = new Helpers(box2D);
    const ctx = canvas.getContext('2d');
    const canvasOffset: Point = {
      x: canvas.width/2,
      y: canvas.height/2
    };
    const viewCenterPixel: Point = {
      x: canvas.width/2,
      y: canvas.height/2
    };

    const pixelsPerMeter = 32;

    const renderer = new CanvasDebugDraw(box2D, helpers, ctx!, pixelsPerMeter).constructJSDraw();
    renderer.SetFlags(e_shapeBit);
    const { step, draw, destroy } = new WorldFactory(box2D, helpers).create(renderer);

    const myRound = (val: number, places: number) => {
        let c = 1;
        for (let i = 0; i < places; i++)
          c *= 10;
        return Math.round(val*c)/c;
    }

    const getWorldPointFromPixelPoint = (pixelPoint: Point) => ({
      x: (pixelPoint.x - canvasOffset.x)/pixelsPerMeter,
      y: (pixelPoint.y - (canvas.height - canvasOffset.y))/pixelsPerMeter
    });

    const setViewCenterWorld = (pos: Box2D.b2Vec2, instantaneous: boolean): void => {
      const currentViewCenterWorld = getWorldPointFromPixelPoint(viewCenterPixel);
      const toMoveX = pos.get_x() - currentViewCenterWorld.x;
      const toMoveY = pos.get_y() - currentViewCenterWorld.y;
      const fraction = instantaneous ? 1 : 0.25;
      canvasOffset.x -= myRound(fraction * toMoveX * pixelsPerMeter, 0);
      canvasOffset.y += myRound(fraction * toMoveY * pixelsPerMeter, 0);
    };
    setViewCenterWorld( new b2Vec2(0,0), true );

    const drawCanvas = () => {
      //black background
      ctx!.fillStyle = 'rgb(0,0,0)';
      ctx!.fillRect( 0, 0, canvas.width, canvas.height );

      ctx!.save();
      ctx!.translate(canvasOffset.x, canvasOffset.y);
      ctx!.scale(pixelsPerMeter, -pixelsPerMeter);
      ctx!.lineWidth /= pixelsPerMeter;
      
      // CanvasDebugDraw.drawAxes(ctx!);
      
      ctx!.fillStyle = 'rgb(255,255,0)';
      draw();
      
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

    let handle: number | undefined;

    (function loop(prevMs: number) {
      const nowMs = window.performance.now();
      handle = requestAnimationFrame(loop.bind(null, nowMs));
      const deltaMs = nowMs-prevMs;
			step(deltaMs);
      drawCanvas();
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
	width={800}
	height={700}
></canvas>
