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

/**
 * Calling `new` on an Emscripten object does two things:
 * - allocates memory on the emscripten heap with {@link Box2D.malloc}()
 * - creates an Emscripten-wrapped JS object using {@link Box2D.wrapPointer}().
 * 
 * When you're done with the Emscripten-wrapped JS object, you should {@link Box2D.destroy}() it.
 * destroy() does two things:
 * - invokes the class's __destroy__, which performs {@link Box2D.free}()
 *   - this frees the dynamically-allocated memory from the WASM heap
 * - deletes from the class's cache, the reference it retains to the Emscripten-wrapped JS object
 *   - this eliminates a JS memory leak
 * 
 * There's a couple of gaps here.
 * - how should we clean up after we ourselves invoke wrapPointer()?
 * - how should we clean up after we receive an Emscripten-wrapped JS object from a method?
 * 
 * LeakMitigator provides helper methods to solve those gaps.
 * 
 * @example
 * // This example demonstrates how to use recordLeak/freeLeaked to free many references in one go
 * import Box2DFactory from 'box2d-wasm';
 * const { b2BodyDef, b2Vec2, b2World, getPointer, LeakMitigator }: typeof Box2D & EmscriptenModule = await Box2DFactory()
 * const { freeLeaked, recordLeak } = new LeakMitigator()
 * 
 * // we invoked `new`; we should `destroy()` when we're done with it
 * const gravity = new b2Vec2(0, 10)
 * 
 * // b2World takes a copy-by-value of gravity; we are done with it
 * const world = new b2World(gravity)
 * // free from WASM heap + delete cached JS reference
 * destroy(gravity)
 * 
 * const bd_ground = new b2BodyDef()
 * 
 * // world#CreateBody() returns a JS object built via wrapPointer
 * // b2Body::__cache__ retains a reference to the object
 * const ground: Box2D.b2Body = recordLeak(world.CreateBody(bd_ground))
 * 
 * // if we have created all the bodies we need from this template, we are free to destroy it.
 * // world#CreateBody() does not retain any reference to it (it accepts b2BodyDef via copy-by-value)
 * destroy(bd_ground)
 * 
 * // fast-forward to later, where we tear down the Box2D experiment...
 * 
 * for (let body: Box2D.b2Body = world.GetBodyList(); getPointer(body) !== getPointer(NULL); body = body.GetNext()) {
 *   // this b2Body was created with b2World#CreateBody(), so Box2D manages the memory, not us.
 *   // we should not use destroy(body). instead we should use b2World#DestroyBody()
 *   // this also destroys all fixtures on the body.
 *   world.DestroyBody(body);
 * }
 * 
 * // delete from the __cache__ of applicable b2* classes:
 * // every JS object reference that this LeakMitigator recorded
 * freeLeaked()
 * @example
 * // This example demonstrates how to use freeFromCache to free a single reference
 * import Box2DFactory from 'box2d-wasm';
 * const { b2BodyDef, b2Vec2, b2World, getPointer, LeakMitigator }: typeof Box2D & EmscriptenModule = await Box2DFactory()
 * const { freeFromCache } = LeakMitigator
 * 
 * // we invoked `new`; we should `destroy()` when we're done with it
 * const gravity = new b2Vec2(0, 10)
 * 
 * // b2World takes a copy-by-value of gravity; we are done with it
 * const world = new b2World(gravity)
 * // free from WASM heap + delete cached JS reference
 * destroy(gravity)
 * 
 * const bd_ground = new b2BodyDef()
 * 
 * // world#CreateBody() returns a JS object built via wrapPointer
 * // b2Body::__cache__ retains a reference to the object
 * const ground: Box2D.b2Body = world.CreateBody(bd_ground)
 * 
 * // if we have created all the bodies we need from this template, we are free to destroy it.
 * // world#CreateBody() does not retain any reference to it (it accepts b2BodyDef via copy-by-value)
 * destroy(bd_ground)
 * 
 * // when we are done with `ground`:
 * world.DestroyBody(ground);
 * // delete the reference to the `ground` JS object in b2Body's __cache__
 * freeFromCache(ground);
 */
function LeakMitigator() {
  this.instances = new Map()
  this['recordLeak'] = this['recordLeak'].bind(this);
  this['safeWrapPointer'] = this['safeWrapPointer'].bind(this);
  this['freeLeaked'] = this['freeLeaked'].bind(this);
}
LeakMitigator.prototype.constructor = LeakMitigator;

LeakMitigator['freeFromCache'] =
/**
 * Convenience method to free an object from an Emscripten class's __cache__
 */
function freeFromCache(
  instance,
  b2Class = Module['getClass'](instance)
) {
  const cache = Module['getCache'](b2Class)
  delete cache[Module['getPointer'](instance)]
}

LeakMitigator.prototype['recordLeak'] =
/**
 * wrap this around any Emscripten method which returns an object.
 * records the instance, so that we can free it from cache later
 */
function recordLeak(
  instance,
  b2Class = Module['getClass'](instance)
) {
  const instances = this.instances.get(b2Class) ?? new Set()
  instances.add(instance)
  this.instances.set(b2Class, instances)
  return instance
}

LeakMitigator.prototype['safeWrapPointer'] =
/**
 * prefer this over {@link Box2D.wrapPointer}.
 * records the instance that's created, so that we can free it from cache later
 */
function safeWrapPointer(
  pointer,
  targetType
) {
  return this.recordLeak(
    Module['wrapPointer'](pointer, targetType),
    targetType
  )
}

LeakMitigator.prototype['freeLeaked'] =
/**
* access the cache structure of each Emscripten class for which we recorded instances,
* then free from cache every instance that we recorded.
*/
function freeLeaked() {
  // using Array#forEach because acorn optimizer couldn't parse the for..of
  Array.from(this.instances.entries()).forEach(([b2Class, instances]) => {
    const cache = Module['getCache'](b2Class)
    for (const instance of instances) {
      delete cache[Module['getPointer'](instance)]
    }
  })
  this.instances.clear()
};

Module['LeakMitigator'] = LeakMitigator