/// <reference types="emscripten" />
/// <reference path="build/Box2D.d.ts" />
declare module "box2d-wasm" {
  /**
   * merge in an extra {@link b2RopeDef} property; we were unable to describe this (pointer to array of floats)
   * with WebIDL, so created bindings to it more manually.
   */
  namespace Box2D {
    /** forward-declare */
    export class WrapperObject {
    }
    export class b2RopeDef {
      /** pointer to float */
      masses: number;
      /** @return pointer to float */
      get_masses(): number;
      /** @param masses pointer to float */
      set_masses(masses: Box2D.WrapperObject | number): void;
    }
  }
  const Box2DFactory: EmscriptenModuleFactory<typeof Box2D & EmscriptenModule>;
  export = Box2DFactory;
}