import { simd } from 'wasm-feature-detect'

export default async (...args) => {
  const hasSIMD = await simd();
  const Box2DModule = await (
    hasSIMD
      ? import('../../build/flavour/simd/es/Box2D.simd.js')
      : import('../../build/flavour/standard/es/Box2D.js')
  );
  const { 'default': Box2DFactory } = Box2DModule;
  return await Box2DFactory(...args);
};