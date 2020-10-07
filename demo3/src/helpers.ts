/**
 * Forked from Box2D.js
 * @see https://github.com/kripken/box2d.js/blob/f75077b/helpers/embox2d-helpers.js
 * @author dmagunov + Huy Nguyen + fork contributions from Alex Birch
 * @license Zlib https://opensource.org/licenses/Zlib
 * License evidence: https://github.com/kripken/box2d.js/blob/master/README.markdown#box2djs
 *   "box2d.js is zlib licensed, just like Box2D."
 */
export class Helpers {
  constructor(private readonly box2D: any) {
  }

  /** to replace original C++ operator = */
  copyVec2(vec: any) {
    const { b2Vec2 } = this.box2D;
    return new b2Vec2(vec.get_x(), vec.get_y());
  }

  /** to replace original C++ operator * (float) */
  scaleVec2(vec: any, scale: any): void {
    vec.set_x( scale * vec.get_x() );
    vec.set_y( scale * vec.get_y() );            
  }

  /** to replace original C++ operator *= (float) */
  scaledVec2(vec: any, scale: any) {
    const { b2Vec2 } = this.box2D;
    return new b2Vec2(scale * vec.get_x(), scale * vec.get_y());
  }
}