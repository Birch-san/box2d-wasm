/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} pixelsPerMeter
 * @param {import('box2d-wasm').Box2DEmscriptenModule} box2D
 */
export const makeDebugDraw = (ctx, pixelsPerMeter, {
    b2Color,
    b2Draw: { e_shapeBit },
    b2Vec2,
    JSDraw,
    wrapPointer
  }) => {
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
     * @param {Box2D.b2Vec2 | number} center_p
     * @param {number} radius
     * @param {Box2D.b2Color | number} color_p
     * @returns {void}
     */
    DrawCircle(center_p, radius, color_p) {
      // this.setColorFromDebugDrawCallback(color_p);
      // const dummyAxis = new b2Vec2(0,0);
      // const dummyAxis_p = getPointer(dummyAxis);
      // this.drawCircle(center_p, radius, dummyAxis_p, false);
    },
    /**
     * @param {Box2D.b2Vec2 | number} center_p
     * @param {number} radius
     * @param {Box2D.b2Vec2 | number} axis_p
     * @param {Box2D.b2Color | number} color_p
     * @returns {void}
     */
    DrawSolidCircle(center_p, radius, axis_p, color_p) {
      // this.setColorFromDebugDrawCallback(color_p);
      // this.drawCircle(center_p, radius, axis_p, true);
    },
    /**
     * @param {Box2D.b2Transform | number} transform_p
     * @returns {void}
     */
    DrawTransform(transform_p) {
      // this.drawTransform(transform_p);
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
  return debugDraw;
};