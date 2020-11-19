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
}