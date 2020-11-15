/**
 * Forked from Box2D.js
 * @see https://github.com/kripken/box2d.js/blob/f75077b/helpers/embox2d-helpers.js
 * @author dmagunov + Huy Nguyen + fork contributions from Alex Birch
 * @see https://github.com/kripken/box2d.js/blob/49dddd6/helpers/embox2d-html5canvas-debugDraw.js
 * @author dmagunov + fork contributions from Alex Birch
 * @see https://github.com/kripken/box2d.js/blob/925a279/demo/webgl/box2d.wasm.html
 * @author Alon Zakai + Huy Nguyen + fork contributions from Alex Birch
 * @license Zlib https://opensource.org/licenses/Zlib
 * License evidence: https://github.com/kripken/box2d.js/blob/master/README.markdown#box2djs
 *   "box2d.js is zlib licensed, just like Box2D."
 * @type {import('box2d-wasm')}
 */
const Box2DFactory = Box2D;
Box2DFactory().then(box2D => {
  const {
    b2_dynamicBody,
    b2BodyDef,
    b2CircleShape,
    b2Color,
    b2Draw: { e_shapeBit },
    b2EdgeShape,
    b2Transform,
    b2Vec2,
    b2PolygonShape,
    b2World,
    JSDraw,
    wrapPointer
  } = box2D;

  /** @type {HTMLCanvasElement} */
  const canvas = document.getElementById("demo-canvas");
  const ctx = canvas.getContext('2d');

  const pixelsPerMeter = 32;
  const cameraOffsetMetres = {
    x: 0,
    y: 0
  };

  const gravity = new b2Vec2(0, 10);
  const world = new b2World(gravity);

  const bd_ground = new b2BodyDef();
  const ground = world.CreateBody(bd_ground);

  // ramp which boxes fall onto initially
  {
    const shape = new b2EdgeShape();
    shape.SetTwoSided(new b2Vec2(3, 4), new b2Vec2(6, 7));
    ground.CreateFixture(shape, 0);
  }
  // floor which boxes rest on
  {
    const shape = new b2EdgeShape();
    shape.SetTwoSided(new b2Vec2(3, 18), new b2Vec2(22, 18));
    ground.CreateFixture(shape, 0);
  }

  const sideLengthMetres = 1;
  const square = new b2PolygonShape();
  square.SetAsBox(sideLengthMetres/2, sideLengthMetres/2);
  const circle = new b2CircleShape();
  circle.set_m_radius(sideLengthMetres/2);

  const ZERO = new b2Vec2(0, 0);
  const temp = new b2Vec2(0, 0);
  /**
   * @param {Box2D.b2Body} body
   * @param {number} index
   * @returns {void}
   */
  const initPosition = (body, index) => {
    temp.Set(4 + sideLengthMetres*(Math.random()-0.5), -sideLengthMetres*index);
    body.SetTransform(temp, 0);
    body.SetLinearVelocity(ZERO);
    body.SetAwake(1);
    body.SetEnabled(1);
  }

  // make falling boxes
  const boxCount = 10;
  for (let i = 0; i < boxCount; i++) {
    const bd = new b2BodyDef();
    bd.set_type(b2_dynamicBody);
    bd.set_position(ZERO);
    const body = world.CreateBody(bd);
    body.CreateFixture(i % 2 ? square : circle, 1);
    initPosition(body, i);
  }

  /**
   * to replace original C++ operator =
   * @param {Box2D.b2Vec2} vec
   * @returns {Box2D.b2Vec2}
   */
  const copyVec2 = vec =>
    new b2Vec2(vec.get_x(), vec.get_y());

  /**
   * to replace original C++ operator *= (float) 
   * @param {Box2D.b2Vec2} vec
   * @param {number} scale
   * @returns {Box2D.b2Vec2}
   */
  const scaledVec2 = (vec, scale) =>
    new b2Vec2(scale * vec.get_x(), scale * vec.get_y());

  /**
   * @param {Box2D.b2Color} color
   * @returns {string}
   */
  const getRgbStr = (color) => {
    const red = (color.get_r() * 255)|0;
    const green = (color.get_g() * 255)|0;
    const blue = (color.get_b() * 255)|0;
    return `${red},${green},${blue}`;
  };

  /**
   * @param {string} rgbStr
   * @returns {void}
   */
  const setCtxColor = (rgbStr) => {
    ctx.fillStyle = `rgba(${rgbStr},0.5)`;
    ctx.strokeStyle = `rgb(${rgbStr})`;
  };

  /**
   * @param {Box2D.b2Vec2[]} vertices
   * @param {boolean} fill
   * @returns {void}
   */
  const drawPolygon = (vertices, fill) => {
    ctx.beginPath();
    let first = true;
    for (const vertex of vertices) {
      if (first) {
        ctx.moveTo(vertex.get_x(), vertex.get_y());
        first = false;
      } else {
        ctx.lineTo(vertex.get_x(), vertex.get_y());
      }
    }
    ctx.closePath();
    if (fill) {
      ctx.fill();
    }
    ctx.stroke();
  };

  /**
   * @param {Box2D.b2Vec2} center
   * @param {number} radius
   * @param {Box2D.b2Vec2} axis
   * @param {boolean} fill
   * @returns {void}
   */
  const drawCircle = (center, radius, axis, fill) => {
    ctx.beginPath();
    ctx.arc(center.get_x(), center.get_y(), radius, 0, 2 * Math.PI, false);
    if (fill) {
      ctx.fill();
    }
    ctx.stroke();
    
    if (fill) {
      //render axis marker
      const vertex = copyVec2(center);
      vertex.op_add(scaledVec2(axis, radius));
      ctx.beginPath();
      ctx.moveTo(center.get_x(), center.get_y());
      ctx.lineTo(vertex.get_x(), vertex.get_y());
      ctx.stroke();
    }
  };

  /**
   * @param {Box2D.b2Vec2} vert1
   * @param {Box2D.b2Vec2} vert2
   * @returns {void}
   */
  const drawSegment = (vert1, vert2) => {
    ctx.beginPath();
    ctx.moveTo(vert1.get_x(), vert1.get_y());
    ctx.lineTo(vert2.get_x(), vert2.get_y());
    ctx.stroke();
  };

  /**
   * @param {Box2D.b2Vec2} vertex
   * @param {number} sizeMetres
   * @returns {void}
   */
  const drawPoint = (vertex, sizeMetres) => {
    const sizePixels = sizeMetres/pixelsPerMeter;
    ctx.fillRect(
      vertex.get_x()-sizePixels/2,
      vertex.get_y()-sizePixels/2,
      sizePixels,
      sizePixels
      );
  };

  /**
   * @param {Box2D.b2Transform} transform
   * @param {number} sizeMetres
   * @returns {void}
   */
  const drawTransform = transform => {
    const pos = transform.get_p();
    const rot = transform.get_q();
    
    ctx.save();
    ctx.translate(pos.get_x(), pos.get_y());
    ctx.scale(0.5, 0.5);
    ctx.rotate(rot.GetAngle());
    ctx.lineWidth *= 2;
    ctx.restore();
  }

  /** {@link Box2D.b2Vec2} is a struct of `float x, y` */
  const sizeOfB2Vec = Float32Array.BYTES_PER_ELEMENT * 2;

  /**
   * @param {number} array_p pointer to {@link Box2D.b2Vec2}
   * @param {number} numElements length of array
   * @param {number} sizeOfElement size of an instance of the array element
   * @param {typeof Box2D.b2Vec2} ctor constructor for the array element
   * @return {Box2D.b2Vec2[]}
   */
  const reifyArray = (array_p, numElements, sizeOfElement, ctor) =>
    Array(numElements)
      .fill(undefined)
      .map((_, index) =>
        wrapPointer(array_p + index * sizeOfElement, ctor)
      );

  const debugDraw = Object.assign(new JSDraw(), {
    /**
     * @param {number} vert1_p pointer to {@link Box2D.b2Vec2}
     * @param {number} vert2_p pointer to {@link Box2D.b2Vec2}
     * @param {number} color_p pointer to {@link Box2D.b2Color}
     * @returns {void}
     */
    DrawSegment(vert1_p, vert2_p, color_p) {
      const color = wrapPointer(color_p, b2Color);
      setCtxColor(getRgbStr(color));
      const vert1 = wrapPointer(vert1_p, b2Vec2);
      const vert2 = wrapPointer(vert2_p, b2Vec2);
      drawSegment(vert1, vert2);
    },
    /**
     * @param {number} vertices_p pointer to Array<{@link Box2D.b2Vec2}>
     * @param {number} vertexCount
     * @param {number} color_p pointer to {@link Box2D.b2Color}
     * @returns {void}
     */
    DrawPolygon(vertices_p, vertexCount, color_p) {
      const color = wrapPointer(color_p, b2Color);
      setCtxColor(getRgbStr(color));
      const vertices = reifyArray(vertices_p, vertexCount, sizeOfB2Vec, b2Vec2);
      drawPolygon(vertices, vertexCount, false);
    },
    /**
     * @param {number} vertices_p pointer to Array<{@link Box2D.b2Vec2}>
     * @param {number} vertexCount
     * @param {number} color_p pointer to {@link Box2D.b2Color}
     * @returns {void}
     */
    DrawSolidPolygon(vertices_p, vertexCount, color_p) {
      const color = wrapPointer(color_p, b2Color);
      setCtxColor(getRgbStr(color));
      const vertices = reifyArray(vertices_p, vertexCount, sizeOfB2Vec, b2Vec2);
      drawPolygon(vertices, vertexCount, true);
    },
    /**
     * @param {number} center_p pointer to {@link Box2D.b2Vec2}
     * @param {number} radius
     * @param {number} color_p pointer to {@link Box2D.b2Color}
     * @returns {void}
     */
    DrawCircle(center_p, radius, color_p) {
      const color = wrapPointer(color_p, b2Color);
      setCtxColor(getRgbStr(color));
      const center = wrapPointer(center_p, b2Vec2);
      const dummyAxis = new b2Vec2(0,0);
      drawCircle(center, radius, dummyAxis, false);
    },
    /**
     * @param {number} center_p pointer to {@link Box2D.b2Vec2}
     * @param {number} radius
     * @param {number} axis_p pointer to {@link Box2D.b2Vec2}
     * @param {number} color_p pointer to {@link Box2D.b2Color}
     * @returns {void}
     */
    DrawSolidCircle(center_p, radius, axis_p, color_p) {
      const color = wrapPointer(color_p, b2Color);
      setCtxColor(getRgbStr(color));
      const center = wrapPointer(center_p, b2Vec2);
      const axis = wrapPointer(axis_p, b2Vec2);
      drawCircle(center, radius, axis, true);
    },
    /**
     * @param {number} transform_p pointer to {@link Box2D.b2Transform}
     * @returns {void}
     */
    DrawTransform(transform_p) {
      const transform = wrapPointer(transform_p, b2Transform);
      drawTransform(transform);
    },
    /**
     * @param {number} vertex_p pointer to {@link Box2D.b2Vec2}
     * @param {number} sizeMetres
     * @param {number} pointer to {@link Box2D.b2Color}
     * @returns {void}
     */
    DrawPoint(vertex_p, sizeMetres, color_p) {
      const color = wrapPointer(color_p, b2Color);
      setCtxColor(getRgbStr(color));
      const vertex = wrapPointer(vertex_p, b2Vec2);
      drawPoint(vertex, sizeMetres);
    }
  });
  debugDraw.SetFlags(e_shapeBit);
  world.SetDebugDraw(debugDraw);

  // calculate no more than a 60th of a second during one world.Step() call
  const maxTimeStepMs = 1/60*1000;
  /** @param {number} deltaMs */
  const step = (deltaMs) => {
    const clampedDeltaMs = Math.min(deltaMs, maxTimeStepMs);
    world.Step(clampedDeltaMs/1000, 3, 2);
  };

  const drawCanvas = () => {
    ctx.fillStyle = 'rgb(0,0,0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.scale(pixelsPerMeter, pixelsPerMeter);
    const { x, y } = cameraOffsetMetres;
    ctx.translate(x, y);
    ctx.lineWidth /= pixelsPerMeter;
    
    ctx.fillStyle = 'rgb(255,255,0)';
    world.DebugDraw();

    ctx.restore();
  };

  /** @type {?number} */
  let handle;
  (function loop(prevMs) {
    const nowMs = window.performance.now();
    handle = requestAnimationFrame(loop.bind(null, nowMs));
    const deltaMs = nowMs-prevMs;
    step(deltaMs);
    drawCanvas();
  }(window.performance.now()));
});