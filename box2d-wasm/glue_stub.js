Object.defineProperty(b2RopeDef.prototype, 'position', { get: b2RopeDef.prototype.get_position, set: b2RopeDef.prototype.set_position });
  b2RopeDef.prototype['get_masses'] = b2RopeDef.prototype.get_masses = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_b2RopeDef_get_masses_0(self), b2Vec2);
};
b2RopeDef.prototype['set_masses'] = b2RopeDef.prototype.set_masses = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_b2RopeDef_set_masses_1(self, arg0);
};

/**
 * @var {({ptr:number})=>number} getPointer
 */

/**
 * @function
 * @param {{ptr:number}|number} objOrNum
 * @returns {number}
 */
const getPointerFromUnion = (objOrNum) => {
  if (typeof objOrNum === 'object') {
    return getPointer(objOrNum);
  }
  return objOrNum;
};

/**
 * @function
 * @param {{ptr:number}|number} a
 * @param {{ptr:number}|number} b
 */
const b2TestOverlap_2 = (a, b) => {
  const a_p = getPointerFromUnion(a);
  const b_p = getPointerFromUnion(b);
  return !!_emscripten_bind_b2TestOverlap_2(a_p, b_p);
};

/**
 * @function
 * @param {{ptr:number}|number} shapeA
 * @param {number} indexA
 * @param {{ptr:number}|number} shapeB
 * @param {number} indexB
 * @param {{ptr:number}|number} xfA
 * @param {{ptr:number}|number} xfB
 */
const b2TestOverlap_6 = (shapeA, indexA, shapeB, indexB, xfA, xfB) => {
  const shapeA_p = getPointerFromUnion(shapeA);
  const shapeB_p = getPointerFromUnion(shapeB);
  const xfA_p = getPointerFromUnion(xfA);
  const xfB_p = getPointerFromUnion(xfB);
  
  return !!_emscripten_bind_b2TestOverlap_6(shapeA_p, indexA, shapeB_p, indexB, xfA_p, xfB_p);
};


/**
 * @function
 * @param {{ptr:number}|number} a_or_shapeA
 * @param {{ptr:number}|number} b_or_indexA
 * 
 * @function
 * @param {{ptr:number}|number} a_or_shapeA
 * @param {number} b_or_indexA
 * @param {{ptr:number}|number} shapeB
 * @param {number} indexB
 * @param {{ptr:number}|number} xfA
 * @param {{ptr:number}|number} xfB
 */
Module['b2TestOverlap'] = (a_or_shapeA, b_or_indexA, shapeB, indexB, xfA, xfB) => {
  if (shapeB === undefined) {
    return b2TestOverlap_2(a_or_shapeA, b_or_indexA);
  }
  return b2TestOverlap_6(a_or_shapeA, b_or_indexA, shapeB, indexB, xfA, xfB);
};