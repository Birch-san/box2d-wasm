b2RopeDef.prototype['get_masses'] = b2RopeDef.prototype.get_masses = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_b2RopeDef_get_masses_0(self), b2Vec2);
};
b2RopeDef.prototype['set_masses'] = b2RopeDef.prototype.set_masses = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_b2RopeDef_set_masses_1(self, arg0);
};
Object.defineProperty(b2RopeDef.prototype, 'masses', { get: b2RopeDef.prototype.get_masses, set: b2RopeDef.prototype.set_masses });

/**
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
 * Compute the point states given two manifolds. The states pertain to the transition from manifold1
 * to manifold2. So state1 is either persist or remove while state2 is either add or persist.
 * @param {number} state1 a b2PointState enum value
 * @param {number} state2 a b2PointState enum value
 * @param {{ptr:number}|number} manifold1
 * @param {{ptr:number}|number} manifold2
 * @return {void}
 */
Module['b2GetPointStates'] = (state1, state2, manifold1, manifold2) => {
  const state1_p = getPointerFromUnion(state1);
  const state2_p = getPointerFromUnion(state2);
  const manifold1_p = getPointerFromUnion(manifold1);
  const manifold2_p = getPointerFromUnion(manifold2);
  _emscripten_bind_b2GetPointStates_4(state1_p, state2_p, manifold1_p, manifold2_p);
};

/**
 * Compute the collision manifold between two circles.
 * @param {{ptr:number}|number} manifold
 * @param {{ptr:number}|number} circleA
 * @param {{ptr:number}|number} xfA
 * @param {{ptr:number}|number} circleB
 * @param {{ptr:number}|number} xfB
 * @return {void}
 */
Module['b2CollideCircles'] = (manifold, circleA, xfA, circleB, xfB) => {
  const manifold_p = getPointerFromUnion(manifold);
  const circleA_p = getPointerFromUnion(circleA);
  const xfA_p = getPointerFromUnion(xfA);
  const circleB_p = getPointerFromUnion(circleB);
  const xfB_p = getPointerFromUnion(xfB);
  _emscripten_bind_b2CollideCircles_5(manifold_p, circleA_p, xfA_p, circleB_p, xfB_p);
};

/**
 * Compute the collision manifold between a polygon and a circle.
 * @param {{ptr:number}|number} manifold
 * @param {{ptr:number}|number} polygonA
 * @param {{ptr:number}|number} xfA
 * @param {{ptr:number}|number} circleB
 * @param {{ptr:number}|number} xfB
 * @return {void}
 */
Module['b2CollidePolygonAndCircle'] = (manifold, polygonA, xfA, circleB, xfB) => {
  const manifold_p = getPointerFromUnion(manifold);
  const polygonA_p = getPointerFromUnion(polygonA);
  const xfA_p = getPointerFromUnion(xfA);
  const circleB_p = getPointerFromUnion(circleB);
  const xfB_p = getPointerFromUnion(xfB);
  _emscripten_bind_b2CollidePolygonAndCircle_5(manifold_p, polygonA_p, xfA_p, circleB_p, xfB_p);
};

/**
 * Compute the collision manifold between two polygons.
 * @param {{ptr:number}|number} manifold
 * @param {{ptr:number}|number} polygonA
 * @param {{ptr:number}|number} xfA
 * @param {{ptr:number}|number} polygonB
 * @param {{ptr:number}|number} xfB
 * @return {void}
 */
Module['b2CollidePolygons'] = (manifold, polygonA, xfA, polygonB, xfB) => {
  const manifold_p = getPointerFromUnion(manifold);
  const polygonA_p = getPointerFromUnion(polygonA);
  const xfA_p = getPointerFromUnion(xfA);
  const polygonB_p = getPointerFromUnion(polygonB);
  const xfB_p = getPointerFromUnion(xfB);
  _emscripten_bind_b2CollidePolygons_5(manifold_p, polygonA_p, xfA_p, polygonB_p, xfB_p);
};

/**
 * Compute the collision manifold between an edge and a circle.
 * @param {{ptr:number}|number} manifold
 * @param {{ptr:number}|number} edgeA
 * @param {{ptr:number}|number} xfA
 * @param {{ptr:number}|number} circleB
 * @param {{ptr:number}|number} xfB
 * @return {void}
 */
Module['b2CollideEdgeAndCircle'] = (manifold, edgeA, xfA, circleB, xfB) => {
  const manifold_p = getPointerFromUnion(manifold);
  const edgeA_p = getPointerFromUnion(edgeA);
  const xfA_p = getPointerFromUnion(xfA);
  const circleB_p = getPointerFromUnion(circleB);
  const xfB_p = getPointerFromUnion(xfB);
  _emscripten_bind_b2CollideEdgeAndCircle_5(manifold_p, edgeA_p, xfA_p, circleB_p, xfB_p);
};

/**
 * Compute the collision manifold between an edge and a polygon.
 * @param {{ptr:number}|number} manifold
 * @param {{ptr:number}|number} edgeA
 * @param {{ptr:number}|number} xfA
 * @param {{ptr:number}|number} polygonB
 * @param {{ptr:number}|number} xfB
 * @return {void}
 */
Module['b2CollideEdgeAndPolygon'] = (manifold, edgeA, xfA, polygonB, xfB) => {
  const manifold_p = getPointerFromUnion(manifold);
  const edgeA_p = getPointerFromUnion(edgeA);
  const xfA_p = getPointerFromUnion(xfA);
  const polygonB_p = getPointerFromUnion(polygonB);
  const xfB_p = getPointerFromUnion(xfB);
  _emscripten_bind_b2CollideEdgeAndPolygon_5(manifold_p, edgeA_p, xfA_p, polygonB_p, xfB_p);
};

/**
 * Clipping for contact manifolds.
 * @param {{ptr:number}|number} vOut
 * @param {{ptr:number}|number} vIn
 * @param {{ptr:number}|number} normal
 * @param {number} offset
 * @param {number} vertexIndexA
 * @return {number}
 */
Module['b2ClipSegmentToLine'] = (vOut, vIn, normal, offset, vertexIndexA) => {
  const vOut_p = getPointerFromUnion(vOut);
  const vIn_p = getPointerFromUnion(vIn);
  const normal_p = getPointerFromUnion(normal);
  return _emscripten_bind_b2ClipSegmentToLine_5(vOut_p, vIn_p, normal_p, offset, vertexIndexA);
};

/**
 * Determine if two AABBs overlap.
 * @param {{ptr:number}|number} a
 * @param {{ptr:number}|number} b
 * @return {boolean}
 */
const b2TestOverlap_2 = (a, b) => {
  const a_p = getPointerFromUnion(a);
  const b_p = getPointerFromUnion(b);
  return !!_emscripten_bind_b2TestOverlap_2(a_p, b_p);
};

/**
 * Determine if two generic shapes overlap.
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
 * Determine if two AABBs overlap.
 * @param {{ptr:number}|number} a_or_shapeA
 * @param {{ptr:number}|number} b_or_indexA
 * 
 * @function
 * Determine if two generic shapes overlap.
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
  Array.from(
    { length: numElements },
    (_, index) =>
      wrapPointer(array_p + index * elementSize, ctor)
  )

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
  const b2Vec2Arr_p = Module['_malloc'](floatArray.byteLength);
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
  // see https://becominghuman.ai/passing-and-returning-webassembly-array-parameters-a0f572c65d97
  const floatsPerB2Vec2 = 2; // b2Vec2 is a struct of `float x, y`
  const floatArray = new Float32Array(points.length * floatsPerB2Vec2);

  for (let i = 0; i < points.length; i++) {
    const [x, y] = points[i];
    floatArray[i*2] = x;
    floatArray[i*2+1] = y;
  }

  /** @type number */
  const b2Vec2Arr_p = Module['_malloc'](floatArray.byteLength);
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
  const floatArr_p = Module['_malloc'](floatArray.byteLength);
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
  const a = new ctor();
  const b = new ctor();
  const size = b.ptr-a.ptr;
  b.__destroy__();
  a.__destroy__();
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

/**
 * Utility to compute linear stiffness values from frequency and damping ratio.
 * The result will be written-out into the {@link stiffness} and {@link damping} parameters you provide.
 * @example
 * const { _malloc, _free, b2LinearStiffness, HEAPF32 } = box2D;
 * // allocate two 4-byte floats on emscripten heap
 * const output_p = _malloc(Float32Array.BYTES_PER_ELEMENT * 2);
 * // give Box2D pointers to our floats on the heap, so it can mutate them
 * b2LinearStiffness(output_p, output_p + Float32Array.BYTES_PER_ELEMENT, 0.9, 0.3, bodyA, bodyB)
 * // create a Float32Array view over our heap offset, destructure two floats out of it
 * const [stiffness, damping] = HEAPF32.subarray(output_p >> 2)
 * // free the memory we allocated
 * _free(output_p);
 * @param {{ptr:number}|number} stiffness a WrapperObject (or its pointer) pointing to 4 bytes of heap
 * @param {{ptr:number}|number} damping a WrapperObject (or its pointer) pointing to 4 bytes of heap
 * @param {number} frequencyHertz (float)
 * @param {number} dampingRatio (float)
 * @param {{ptr:number}|number} bodyA
 * @param {{ptr:number}|number} bodyB
 * @return {void}
 */
 Module['b2LinearStiffness'] = (stiffness, damping, frequencyHertz, dampingRatio, bodyA, bodyB) => {
  const stiffness_p = getPointerFromUnion(stiffness);
  const damping_p = getPointerFromUnion(damping);
  const bodyA_p = getPointerFromUnion(bodyA);
  const bodyB_p = getPointerFromUnion(bodyB);
  _emscripten_bind_b2LinearStiffness_6(stiffness_p, damping_p, frequencyHertz, dampingRatio, bodyA_p, bodyB_p);
};

/**
 * Utility to compute rotational stiffness values frequency and damping ratio.
 * The result will be written-out into the {@link stiffness} and {@link damping} parameters you provide.
 * @example
 * const { _malloc, _free, b2AngularStiffness, HEAPF32 } = box2D;
 * // allocate two 4-byte floats on emscripten heap
 * const output_p = _malloc(Float32Array.BYTES_PER_ELEMENT * 2);
 * // give Box2D pointers to our floats on the heap, so it can mutate them
 * b2AngularStiffness(output_p, output_p + Float32Array.BYTES_PER_ELEMENT, 0.9, 0.3, bodyA, bodyB)
 * // create a Float32Array view over our heap offset, destructure two floats out of it
 * const [stiffness, damping] = HEAPF32.subarray(output_p >> 2)
 * // free the memory we allocated
 * _free(output_p);
 * @param {{ptr:number}|number} stiffness a WrapperObject (or its pointer) pointing to 4 bytes of heap
 * @param {{ptr:number}|number} damping a WrapperObject (or its pointer) pointing to 4 bytes of heap
 * @param {number} frequencyHertz (float)
 * @param {number} dampingRatio (float)
 * @param {{ptr:number}|number} bodyA
 * @param {{ptr:number}|number} bodyB
 * @return {void}
 */
 Module['b2AngularStiffness'] = (stiffness, damping, frequencyHertz, dampingRatio, bodyA, bodyB) => {
  const stiffness_p = getPointerFromUnion(stiffness);
  const damping_p = getPointerFromUnion(damping);
  const bodyA_p = getPointerFromUnion(bodyA);
  const bodyB_p = getPointerFromUnion(bodyB);
  _emscripten_bind_b2AngularStiffness_6(stiffness_p, damping_p, frequencyHertz, dampingRatio, bodyA_p, bodyB_p);
};