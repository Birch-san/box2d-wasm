/// <reference path="Box2D.d.ts" />
declare namespace Box2D {
  /**
   * merge in an extra {@link b2RopeDef} property; we were unable to describe this (pointer to array of floats)
   * with WebIDL, so created bindings to it more manually.
   */
  export interface b2RopeDef {
    /** pointer to float */
    masses: number;
    /** @return pointer to float */
    get_masses(): number;
    /** @param masses pointer to float */
    set_masses(masses: Box2D.WrapperObject | number): void;
  }

  /**
   * Compute the point states given two manifolds. The states pertain to the transition from manifold1
   * to manifold2. So state1 is either persist or remove while state2 is either add or persist.
   * @param state1 a b2PointState enum value
   * @param state2 a b2PointState enum value
   */
  export const b2GetPointStates: (
    state1: number, state2: number,
    manifold1: Box2D.b2Manifold | number, manifold2: Box2D.b2Manifold | number
    ) => void;

  /** Compute the collision manifold between two circles. */
  export const b2CollideCircles: (
    manifold: Box2D.b2Manifold | number,
    circleA: Box2D.b2CircleShape | number, xfA: Box2D.b2Transform | number,
    circleB: Box2D.b2CircleShape | number, xfB: Box2D.b2Transform | number
    ) => void;

  /** Compute the collision manifold between a polygon and a circle. */
  export const b2CollidePolygonAndCircle: (
    manifold: Box2D.b2Manifold | number,
    polygonA: Box2D.b2PolygonShape | number, xfA: Box2D.b2Transform | number,
    circleB: Box2D.b2CircleShape | number, xfB: Box2D.b2Transform | number
    ) => void;

  /** Compute the collision manifold between two polygons. */
  export const b2CollidePolygons: (
    manifold: Box2D.b2Manifold | number,
    polygonA: Box2D.b2PolygonShape | number, xfA: Box2D.b2Transform | number,
    polygonB: Box2D.b2PolygonShape | number, xfB: Box2D.b2Transform | number
    ) => void;

  /** Compute the collision manifold between an edge and a circle. */
  export const b2CollideEdgeAndCircle: (
    manifold: Box2D.b2Manifold | number,
    edgeA: Box2D.b2EdgeShape | number, xfA: Box2D.b2Transform | number,
    circleB: Box2D.b2CircleShape | number, xfB: Box2D.b2Transform | number
    ) => void;

  /** Compute the collision manifold between an edge and a polygon. */
  export const b2CollideEdgeAndPolygon: (
    manifold: Box2D.b2Manifold | number,
    edgeA: Box2D.b2EdgeShape | number, xfA: Box2D.b2Transform | number,
    polygonB: Box2D.b2PolygonShape | number, xfB: Box2D.b2Transform | number
    ) => void;

  /** Clipping for contact manifolds. */
  export const b2ClipSegmentToLine: (
    vOut: Box2D.b2ClipVertex | number, vIn: Box2D.b2ClipVertex | number,
    normal: Box2D.b2Vec2 | number,
    offset: number,
    vertexIndexA: number
    ) => number;

  export const b2TestOverlap: {
    /** determine if two AABBs overlap */
    (a: Box2D.b2AABB | number, b: Box2D.b2AABB | number): boolean;
    /** determine if two generic shapes overlap */
    (
      shapeA: Box2D.b2Shape | number, indexA: number,
      shapeB: Box2D.b2Shape | number, indexB: number,
      xfA: Box2D.b2Transform | number, xfB: Box2D.b2Transform | number,
    ): boolean;
  };

  /**
   * Utility to compute linear stiffness values frequency and damping ratio.
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
   */
  export const b2LinearStiffness: (
    stiffness: Box2D.WrapperObject | number, damping: Box2D.WrapperObject | number,
    frequencyHertz: number, dampingRatio: number,
    bodyA: Box2D.b2Body | number, bodyB: Box2D.b2Body | number
    ) => void;
  
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
   */
  export const b2AngularStiffness: (
    stiffness: Box2D.WrapperObject | number, damping: Box2D.WrapperObject | number,
    frequencyHertz: number, dampingRatio: number,
    bodyA: Box2D.b2Body | number, bodyB: Box2D.b2Body | number
    ) => void;

  /**
   * If Box2D sends you a number, but you know it's (for example) a pointer to
   * an array of {@link b2Vec2}: use this to convert the pointer to JS objects.
   * @param array_p pointer to (subclass of {@link WrapperObject})
   * @param numElements length of array
   * @param elementSize size of an instance of the array element (in bytes)
   * @param ctor constructor for the array element
   */
  export const reifyArray: <TargetClass extends typeof WrapperObject & {
    new (...args: any[]): InstanceType<TargetClass>;
  } = typeof WrapperObject>(
      array_p: number,
      numElements: number,
      elementSize: number,
      ctor: TargetClass
    ) => InstanceType<TargetClass>[];

  export interface Point {
    x: number;
    y: number;
  }
  /**
   * If you need to give to Box2D an array of Box2D.b2Vec2: use this to turn JS objects
   * into a Box2D.b2Vec2 object (which can be used to locate an array of b2Vec2s).
   * @param points
   * @return Tuple containing 0: A Box2D.b2Vec2 object, whose pointer can be taken to locate an array of b2Vec2s. 1: A destructor.
   */
  export const pointsToVec2Array: (points: Point[]) => [vectors: Box2D.b2Vec2, destroy: () => void];
  /**
   * If you need to give to Box2D an array of Box2D.b2Vec2: use this to turn JS objects
   * into a Box2D.b2Vec2 object (which can be used to locate an array of b2Vec2s).
   * @param tuples
   * @return Tuple containing 0: A Box2D.b2Vec2 object, whose pointer can be taken to locate an array of b2Vec2s. 1: A destructor.
   */
  export const tuplesToVec2Array: (tuples: [x: number, y: number][]) => [vectors: Box2D.b2Vec2, destroy: () => void];

  /**
   * If you need to give to Box2D an array of floats: use this to turn JS numbers
   * into a Box2D.WrapperObject (which can be used to locate an array of floats).
   * @param floats
   * @return Tuple containing 0: A Box2D.WrapperObject object, whose pointer can be taken to locate an array of floats. 1: A destructor.
   */
  export const toFloatArray: (floats: number[]) => [wrapper: Box2D.WrapperObject, destroy: () => void];

  /**
   * Reveals the size (in bytes) of the instance constructed by any Box2D.WrapperObject subclass.
   * Works by creating two instances, and calculating the difference between their pointers.
   * This is not a *good* way to do this. For exploration only!
   * @param ctor constructor for a subclass of Box2D.WrapperObject
   * @return Size of the element which ctor constructs
   */
  export const sizeof: <TargetClass extends typeof WrapperObject & {
    new (...args: any[]): InstanceType<TargetClass>;
  }>(ctor: TargetClass) => number;

  /**
   * If you need to give to Box2D an output param: use this to allocate the memory. We wrap it in a
   * Box2D.WrapperObject subclass instance, so that you can read its members once Box2D fills them in.
   * @param ctor constructor for the array element
   * @param elementSizeBytes Size of array element in bytes
   * @param {number} [elements=1] Number of array elements to allocate
   * @return Tuple containing 0: Instance of Box2D.WrapperObject subclass (i.e. your ctor), whose pointer can be taken to locate your memory. 1: A destructor.
   */
  export const allocateArray: <TargetClass extends typeof WrapperObject & {
    new (...args: any[]): InstanceType<TargetClass>;
  }>(
    ctor: TargetClass,
    elementSizeBytes: number,
    elements?: number
    ) => [wrapper: InstanceType<TargetClass>, destroy: () => void];

  export class JSNodeCallback extends NodeCallback {
      protected static readonly __cache__: {
          [ptr: number]: JSNodeCallback;
      };
      protected readonly __class__: typeof JSNodeCallback;
      __destroy__(): void;
      protected ptr: number;
      op_call(a: number, b: number, c: number): void;
  }
}