/// <reference types="emscripten" />
/// <reference path="Box2DModuleAugmentations.d.ts" />
/// <reference path="build/Box2D.d.ts" />
declare module "box2d-wasm" {
  export type Box2DEmscriptenModule = typeof Box2D & EmscriptenModule;
  const Box2DFactory: EmscriptenModuleFactory<Box2DEmscriptenModule>;
  export = Box2DFactory;
}