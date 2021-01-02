/// <reference types="emscripten" />
/// <reference path="Box2DModuleAugmentations.d.ts" />
/// <reference path="build/Box2D.d.ts" />
declare module "box2d-wasm" {
  const Box2DFactory: EmscriptenModuleFactory<typeof Box2D & EmscriptenModule>;
  export = Box2DFactory;
}