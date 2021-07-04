(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD
    define(['wasm-feature-detect', 'require'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // NodeJS
    module.exports = factory(require('wasm-feature-detect'), require);
  } else {
    // Browser globals (root is window)
    const loadModule = (path) => new Promise((resolve, reject) => {
      const tag = root.document.createElement("script");
      tag.onload = () => {
        resolve(root.Box2D);
        return false;
      };
      tag.onerror = ({ target: { src } }) => {
        reject(new Error(`Failed to load '${src}'`));
        return false;
      };
      tag.src = path;
      root.document.getElementsByTagName("head")[0].appendChild(tag);
    });
    root.Box2D = factory(root.wasmFeatureDetect, loadModule, true);
  }
}(typeof self !== 'undefined' ? self : this, ({ simd }, require, requireIsAsync) =>
  async (...args) => {
    const hasSIMD = await simd();
    const module = (
      hasSIMD
        ? require('../../build/flavour/simd/umd/Box2D.simd.js')
        : require('../../build/flavour/standard/umd/Box2D.js')
    );
    const Box2DFactory = requireIsAsync
      ? await module
      : module;
    return Box2DFactory(...args);
}));