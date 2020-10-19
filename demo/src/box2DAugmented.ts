import type { Box2D } from 'box2d-wasm';
type Box2DAugmented = typeof Box2D & {
  /**
   * these are emscripten-specific, and not related to .idl
   * might want to consider including them in the generated typings though,
   * potentially in box2d-wasm rather than in the idl-to-ts generator
   */
  _malloc: any;
  _free: any;
  HEAPF32: any;
  /*
   * maybe this is a clue that we should describe the types using class-to-interface decomposition
   * https://github.com/joshtynjala/typescript-notes/blob/9b4ef98aa3298ccbaa6247047daae8bfd1fd1a11/Class-Decomposition.md
   */
  b2RopeDef: {
    new(...args: any[]): InstanceType<typeof Box2D.b2RopeDef> & {
      /**
       * Box2D.idl was not able to describe float* attribute, so it's absent from typings
       * these additional typings should probably be moved into box2d-wasm
       */
      masses: number; // pointer to float
      get_masses(): number; // pointer to float
      set_masses(masses: Box2D.WrapperObject /* pointer to float */): void;
    }
  }
};
export default Box2DAugmented;