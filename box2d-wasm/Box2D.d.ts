declare module 'box2d-wasm' {
  // sorry
  const Box2D: () => Promise<Record<string, any>>;
  export = Box2D;
}
// declare module "box2d-wasm" {
//   // maybe rename to Module
//   export namespace Box2D {
//     export class WrapperObject {
//       static readonly __cache__: { [ptr: number]: WrapperObject };
//       readonly __class__: typeof WrapperObject;
//       ptr?: number;
//     }
//     export class b2ContactListener extends WrapperObject {
//       static readonly __cache__: { [ptr: number]: b2ContactListener };
//       readonly __class__: typeof b2ContactListener;
//       __destroy__(): void;
//     }
//     export class b2Contact extends WrapperObject {
//       static readonly __cache__: { [ptr: number]: b2Contact };
//       readonly __class__: typeof b2Contact;
//       ptr: number;
//       __destroy__(): void;
//       GetManifold(): b2Manifold;
//       GetWorldManifold(manifold: b2WorldManifold): void;
//       IsTouching(): boolean;
//       SetEnabled(flag: boolean): void;
//       IsEnabled(): boolean;
//       GetNext(): b2Contact;
//       GetFixtureA(): b2Fixture;
//       GetChildIndexA(): number;
//       GetFixtureB(): b2Fixture;
//       GetChildIndexB(): number;
//       SetFriction(friction: number): void;
//       GetFriction(): number;
//       ResetFriction(): void;
//       SetRestitution(restitution: number): void;
//       GetRestitution(): number;
//       ResetRestitution(): void;
//       SetTangentSpeed(speed: number): void;
//       GetTangentSpeed(): number;
//     }
//     export class b2Contact2 extends WrapperObject {
//       static readonly __cache__: { [ptr: number]: b2Contact2 };
//       readonly __class__: typeof b2Contact2;
//       ptr: number;
//       __destroy__(): void;
//     }
//     interface HasPointer {
//       ptr: number;
//     }
//     export const wrapPointer: <TargetClass extends {
//       new(...args: any[]): InstanceType<TargetClass>;
//       readonly __cache__: { [ptr: number]: InstanceType<TargetClass> }
//     } = typeof WrapperObject>(pointer: number, targetType?: TargetClass) => InstanceType<TargetClass>;
//     export const getPointer: (instance: HasPointer) => number;
//     export const castObject: <TargetClass extends {
//       new(...args: any[]): InstanceType<TargetClass>;
//       readonly __cache__: { [ptr: number]: InstanceType<TargetClass> }
//     } = typeof WrapperObject>(instance: HasPointer, targetType?: TargetClass) => InstanceType<TargetClass>;
//     export const compare: (instance: HasPointer, instance2: HasPointer) => boolean;
//     export const getCache: <Class extends {
//       readonly __cache__;
//     } = typeof WrapperObject>(type?: Class) => Class['__cache__'];
//     export const destroy: <Instance extends {
//       __destroy__(): void;
//       readonly __class__: {
//         readonly __cache__: { [ptr: number]: Instance }
//       };
//     }>(instance: Instance) => void;
//     export const getClass: <Obj extends {
//       readonly __class__;
//     }>(instance: Obj) => Obj['__class__'];
//     export const NULL: WrapperObject & { ptr: 0 };
//   }
//   const Box2DFactory: () => Promise<typeof Box2D>;
//   export = Box2DFactory;
// }