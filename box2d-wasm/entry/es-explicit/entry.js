// https://nodejs.org/api/esm.html#esm_customizing_esm_specifier_resolution_algorithm
// explicit ES module resolution (as opposed to using Node module resolution).
// this entrypoint is provided solely to support non-bundler use-cases.
// my expectation is that you would copy 'node_modules/wasm-feature-detect/dist/esm/index.js'
// and place it into a file ./wasm-feature-detect.js adjacent to where you serve this entrypoint.
import { simd } from './wasm-feature-detect.js'

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