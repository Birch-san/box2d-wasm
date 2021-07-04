import { simd } from 'wasm-feature-detect'

export default (async () => {
  const hasSIMD = await simd();
  const module = await (
    hasSIMD
      ? import('../../build/flavour/simd/es/Box2D.simd.js')
      : import('../../build/flavour/standard/es/Box2D.js')
  );
  return module;
})();