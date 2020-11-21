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

/**
 * If Box2D sends you a number, but you know it's (for example) a pointer to
 * an array of Box2D.b2Vec2: use this to convert the pointer to JS objects.
 * @param {number} array_p pointer to subclass of Box2D.WrapperObject
 * @param {number} numElements length of array
 * @param {number} elementSize size of an instance of the array element (in bytes)
 * @param {Function} ctor constructor for the array element
 * @return {{ptr:number}[]}
 */
Module['reifyArray'] = (array_p, numElements, elementSize, ctor) =>
  Array(numElements)
    .fill(undefined)
    .map((_, index) =>
      wrapPointer(array_p + index * elementSize, ctor)
    );

/**
 * If you need to give to Box2D an array of Box2D.b2Vec2: use this to turn JS objects
 * into a Box2D.b2Vec2 object (which can be used to locate an array of b2Vec2s).
 * @param {{x:number,y:number}[]} points
 * @return {[{ptr:number}, ()=>void]} Tuple containing 0: A Box2D.b2Vec2 object, whose pointer can be taken to locate an array of b2Vec2s. 1: A destructor.
 */
Module['pointsToVec2Array'] = (points) => {
  const floatsPerB2Vec2 = 2; // b2Vec2 is a struct of `float x, y`
  const floatArray = new Float32Array(points.length * floatsPerB2Vec2);

  for (let i = 0; i < points.length; i++) {
    const { x, y } = points[i];
    floatArray[i*2] = x;
    floatArray[i*2+1] = y;
  }

  /** @type number */
  const b2Vec2Arr_p = Module['_malloc'](floatArray.length * floatsPerB2Vec2 * floatArray.BYTES_PER_ELEMENT);
  HEAPF32.set(floatArray, b2Vec2Arr_p >> 2);

  const wrappedVertices = wrapPointer(b2Vec2Arr_p, b2Vec2);
  return [wrappedVertices, () => Module['_free'](b2Vec2Arr_p)];
};

/**
 * If you need to give to Box2D an array of Box2D.b2Vec2: use this to turn JS objects
 * into a Box2D.b2Vec2 object (which can be used to locate an array of b2Vec2s).
 * @param {[x:number,y:number][]} points
 * @return {[{ptr:number}, ()=>void]} Tuple containing 0: A Box2D.b2Vec2 object, whose pointer can be taken to locate an array of b2Vec2s. 1: A destructor.
 */
Module['tuplesToVec2Array'] = (points) => {
  const floatsPerB2Vec2 = 2; // b2Vec2 is a struct of `float x, y`
  const floatArray = new Float32Array(points.length * floatsPerB2Vec2);

  for (let i = 0; i < points.length; i++) {
    const [x, y] = points[i];
    floatArray[i*2] = x;
    floatArray[i*2+1] = y;
  }

  /** @type number */
  const b2Vec2Arr_p = Module['_malloc'](floatArray.length * floatsPerB2Vec2 * floatArray.BYTES_PER_ELEMENT);
  HEAPF32.set(floatArray, b2Vec2Arr_p >> 2);

  const wrappedVertices = wrapPointer(b2Vec2Arr_p, b2Vec2);
  return [wrappedVertices, () => Module['_free'](b2Vec2Arr_p)];
};

/**
 * If you need to give to Box2D an array of floats: use this to turn JS numbers
 * into a Box2D.WrapperObject (which can be used to locate an array of floats).
 * @param {number[]} floats
 * @return {[{ptr:number}, ()=>void]} Tuple containing 0: A Box2D.WrapperObject object, whose pointer can be taken to locate an array of floats. 1: A destructor.
 */
Module['toFloatArray'] = (floats) => {
  const floatArray = new Float32Array(floats);

  /** @type number */
  const floatArr_p = Module['_malloc'](floatArray.length * floatsPerB2Vec2 * floatArray.BYTES_PER_ELEMENT);
  HEAPF32.set(floatArray, floatArr_p >> 2);

  const wrappedVertices = wrapPointer(floatArr_p);
  return [wrappedVertices, () => Module['_free'](floatArr_p)];
};

/**
 * Reveals the size (in bytes) of the instance constructed by any Box2D.WrapperObject subclass.
 * Works by creating two instances, and calculating the difference between their pointers.
 * This is not a *good* way to do this. For exploration only!
 * @param {Function} ctor constructor for a subclass of Box2D.WrapperObject
 * @return {number} Size of the element which ctor constructs
 */
Module['sizeof'] = (ctor) => {
  const { ptr, __destroy__ } = new ctor();
  const { ptr: ptr2, __destroy__: __destroy__2 } = new ctor();
  const size = ptr2-ptr;
  __destroy__2();
  __destroy__();
  return size;
};

/**
 * If you need to give to Box2D an output param: use this to allocate the memory. We wrap it in a
 * Box2D.WrapperObject subclass instance, so that you can read its members once Box2D fills them in.
 * @param {Function} ctor constructor for the array element
 * @param {number} elementSizeBytes
 * @param {number} [elements=1]
 * @return {[{ptr:number}, ()=>void]} Tuple containing 0: Instance of Box2D.WrapperObject subclass (i.e. your ctor), whose pointer can be taken to locate your memory. 1: A destructor.
 */
Module['allocateArray'] = (ctor, elementSizeBytes, elements=1) => {
  const array = new ArrayBuffer(elementSizeBytes * elements);

  /** @type number */
  const arr_p = Module['_malloc'](array.byteLength);
  HEAPU8.set(array, arr_p);

  const wrappedVertices = wrapPointer(arr_p, ctor);
  return [wrappedVertices, () => Module['_free'](arr_p)];
};