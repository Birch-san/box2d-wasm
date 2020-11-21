/// <reference path="build/Box2D.d.ts" />
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
   * If Box2D sends you a number, but you know it's (for example) a pointer to
   * an array of {@link b2Vec2}: use this to convert the pointer to JS objects.
   * @param array_p pointer to (subclass of {@link WrapperObject})
   * @param numElements length of array
   * @param elementSize size of an instance of the array element (in bytes)
   * @param ctor constructor for the array element
   */
  export const reifyArray: <TargetClass extends {
    new (...args: any[]): InstanceType<TargetClass>;
    readonly __cache__: {
        [ptr: number]: InstanceType<TargetClass>;
    };
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
  export const pointsToVec2Array: (points: Point[]) => [Box2D.b2Vec2, () => void];
  /**
   * If you need to give to Box2D an array of Box2D.b2Vec2: use this to turn JS objects
   * into a Box2D.b2Vec2 object (which can be used to locate an array of b2Vec2s).
   * @param tuples
   * @return Tuple containing 0: A Box2D.b2Vec2 object, whose pointer can be taken to locate an array of b2Vec2s. 1: A destructor.
   */
  export const tuplesToVec2Array: (tuples: [x: number, y: number][]) => [Box2D.b2Vec2, () => void];

  /**
   * If you need to give to Box2D an array of floats: use this to turn JS numbers
   * into a Box2D.WrapperObject (which can be used to locate an array of floats).
   * @param floats
   * @return Tuple containing 0: A Box2D.WrapperObject object, whose pointer can be taken to locate an array of floats. 1: A destructor.
   */
  export const toFloatArray: (floats: number[]) => [Box2D.WrapperObject, () => void];

  /**
   * Reveals the size (in bytes) of the instance constructed by any Box2D.WrapperObject subclass.
   * Works by creating two instances, and calculating the difference between their pointers.
   * This is not a *good* way to do this. For exploration only!
   * @param ctor constructor for a subclass of Box2D.WrapperObject
   * @return Size of the element which ctor constructs
   */
  export const sizeof: <TargetClass extends {
    new (...args: any[]): InstanceType<TargetClass>;
    readonly __cache__: {
        [ptr: number]: InstanceType<TargetClass>;
    };
  }>(ctor: TargetClass) => number;

  /**
   * If you need to give to Box2D an output param: use this to allocate the memory. We wrap it in a
   * Box2D.WrapperObject subclass instance, so that you can read its members once Box2D fills them in.
   * @param ctor constructor for the array element
   * @param elementSizeBytes Size of array element in bytes
   * @param {number} [elements=1] Number of array elements to allocate
   * @return Tuple containing 0: Instance of Box2D.WrapperObject subclass (i.e. your ctor), whose pointer can be taken to locate your memory. 1: A destructor.
   */
  export const allocateArray: <TargetClass extends {
    new (...args: any[]): InstanceType<TargetClass>;
    readonly __cache__: {
        [ptr: number]: InstanceType<TargetClass>;
    };
  }>(
    ctor: TargetClass,
    elementSizeBytes: number,
    elements?: number
    ) => [InstanceType<TargetClass>, () => void];
}