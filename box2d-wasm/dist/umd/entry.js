(function (root, factory) {
  /**
   * This validation expression comes from wasm-feature-detect:
   * https://github.com/GoogleChromeLabs/wasm-feature-detect
   * 
   * Copyright 2019 Google Inc. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *     http://www.apache.org/licenses/LICENSE-2.0
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  const hasSIMD = WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,5,1,96,0,1,123,3,2,1,0,10,10,1,8,0,65,0,253,15,253,98,11]));
  const asset = hasSIMD
  ? './Box2D.simd.js'
  : './Box2D.js';
  if (typeof define === 'function' && define.amd) {
    // AMD
    define([asset], factory);
  } else if (typeof module === 'object' && module.exports) {
    // NodeJS
    const module = require(asset);
    module.exports = factory(module);
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
    root.Box2D = factory(loadModule(asset));
  }
}(
  typeof self !== 'undefined' ? self : this,
  /**
   * @param {import('box2d-wasm')|Promise<import('box2d-wasm')>} module
   * @return {import('box2d-wasm')}
   */
  (module) =>
    /**
     * @param {Parameters<import('box2d-wasm')>} args
     * @return {ReturnType<import('box2d-wasm')>}
     */
    async (...args) => {
      const Box2DFactory = await Promise.resolve(module);
      // awaiting gives us a better stack trace (at the cost of an extra microtask)
      return await Box2DFactory(...args);
  })
);