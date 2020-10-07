import type { Helpers } from './helpers';

/**
 * Forked from Box2D.js
 * @see https://github.com/kripken/box2d.js/blob/49dddd6/helpers/embox2d-html5canvas-debugDraw.js
 * @author dmagunov + fork contributions from Alex Birch
 * @license Zlib https://opensource.org/licenses/Zlib
 * License evidence: https://github.com/kripken/box2d.js/blob/master/README.markdown#box2djs
 *   "box2d.js is zlib licensed, just like Box2D."
 */
export class CanvasDebugDraw {
  constructor(
    private readonly box2D: any,
    private readonly helpers: Helpers,
    private readonly context: CanvasRenderingContext2D
    ) {
  }

  drawAxes(): void {
    this.context.strokeStyle = 'rgb(192,0,0)';
    this.context.beginPath();
    this.context.moveTo(0, 0);
    this.context.lineTo(1, 0);
    this.context.stroke();
    this.context.strokeStyle = 'rgb(0,192,0)';
    this.context.beginPath();
    this.context.moveTo(0, 0);
    this.context.lineTo(0, 1);
    this.context.stroke();
  }
  
  setColorFromDebugDrawCallback(color: any): void {
    const { wrapPointer, b2Color } = this.box2D;
    const col = wrapPointer(color, b2Color);
    const red = (col.get_r() * 255)|0;
    const green = (col.get_g() * 255)|0;
    const blue = (col.get_b() * 255)|0;
    const colStr = `${red},${green},${blue}`;
    this.context.fillStyle = `rgba(${colStr},0.5)`;
    this.context.strokeStyle = `rgb(${colStr})`;
  }
  
  drawSegment(vert1: any, vert2: any): void {
    const { wrapPointer, b2Vec2 } = this.box2D;
    const vert1V = wrapPointer(vert1, b2Vec2);
    const vert2V = wrapPointer(vert2, b2Vec2);                    
    this.context.beginPath();
    this.context.moveTo(vert1V.get_x(), vert1V.get_y());
    this.context.lineTo(vert2V.get_x(), vert2V.get_y());
    this.context.stroke();
  }
  
  drawPolygon(vertices: any, vertexCount: any, fill: any): void {
    const { wrapPointer, b2Vec2 } = this.box2D;
    this.context.beginPath();
    for(let tmpI=0; tmpI < vertexCount; tmpI++) {
      const vert = wrapPointer(vertices+(tmpI*8), b2Vec2);
      if (tmpI === 0) {
        this.context.moveTo(vert.get_x(), vert.get_y());
      } else {
        this.context.lineTo(vert.get_x(), vert.get_y());
      }
    }
    this.context.closePath();
    if (fill) {
      this.context.fill();
    }
    this.context.stroke();
  }
  
  drawCircle(center: any, radius: any, axis: any, fill: any): void {
    const { wrapPointer, b2Vec2 } = this.box2D;
    const { copyVec2, scaledVec2 } = this.helpers;
    const centerV = wrapPointer(center, b2Vec2);
    const axisV = wrapPointer(axis, b2Vec2);
    
    this.context.beginPath();
    this.context.arc(centerV.get_x(),centerV.get_y(), radius, 0, 2 * Math.PI, false);
    if (fill) {
      this.context.fill();
    }
    this.context.stroke();
    
    if (fill) {
      //render axis marker
      const vert2V = copyVec2(centerV);
      vert2V.op_add( scaledVec2(axisV, radius) );
      this.context.beginPath();
      this.context.moveTo(centerV.get_x(),centerV.get_y());
      this.context.lineTo(vert2V.get_x(),vert2V.get_y());
      this.context.stroke();
    }
  }
  
  drawTransform(transform: any): void {
    const { wrapPointer, b2Transform } = this.box2D;
    var trans = wrapPointer(transform, b2Transform);
    var pos = trans.get_p();
    var rot = trans.get_q();
    
    this.context.save();
    this.context.translate(pos.get_x(), pos.get_y());
    this.context.scale(0.5,0.5);
    this.context.rotate(rot.GetAngle());
    this.context.lineWidth *= 2;
    this.drawAxes();
    this.context.restore();
  }

  constructJSDraw() {
    const { JSDraw, b2Vec2 } = this.box2D;
    const debugDraw = Object.assign(new JSDraw(), {
      DrawSegment: (vert1: any, vert2: any, color: any) => {
        this.setColorFromDebugDrawCallback(color);
        this.drawSegment(vert1, vert2);
      },
      DrawPolygon: (vertices: any, vertexCount: any, color: any) => {
        this.setColorFromDebugDrawCallback(color);
        this.drawPolygon(vertices, vertexCount, false);
      },
      DrawSolidPolygon: (vertices: any, vertexCount: any, color: any) => {
        this.setColorFromDebugDrawCallback(color);
        this.drawPolygon(vertices, vertexCount, true);
      },
      DrawCircle: (center: any, radius: any, color: any) => {
        this.setColorFromDebugDrawCallback(color);
        const dummyAxis = b2Vec2(0,0);
        this.drawCircle(center, radius, dummyAxis, false);
      },
      DrawSolidCircle: (center: any, radius: any, axis: any, color: any) => {
        this.setColorFromDebugDrawCallback(color);
        this.drawCircle(center, radius, axis, true);
      },
      DrawTransform: (transform: any) => {
        this.drawTransform(transform);
      }
    });
    return debugDraw;
  }
}
