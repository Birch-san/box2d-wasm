// this file will be copied into the build/es folder
const { simd } = require('wasm-feature-detect');

module.exports = (async () => {
  const hasSIMD = await simd();
  const module = (
    hasSIMD
      ? require('../../build/flavour/simd/umd/Box2D.simd.js')
      : require('../../build/flavour/standard/umd/Box2D.js')
  );
  return module;
})();