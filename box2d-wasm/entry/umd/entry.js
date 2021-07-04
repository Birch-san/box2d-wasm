const { simd } = require('wasm-feature-detect');

module.exports = async (...args) => {
  const hasSIMD = await simd();
  const Box2DFactory = (
    hasSIMD
      ? require('../../build/flavour/simd/umd/Box2D.simd.js')
      : require('../../build/flavour/standard/umd/Box2D.js')
  );
  return Box2DFactory(...args);
};