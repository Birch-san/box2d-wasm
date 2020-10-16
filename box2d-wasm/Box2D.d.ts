declare module 'box2d-wasm' {
  // sorry
  const Box2D: () => Promise<Record<string, any>>;
  export = Box2D;
}
// declare module "box2d-wasm" {
//   // maybe rename to Module
//   export namespace Box2D {
//       export class WrapperObject {
//         static __class__: typeof WrapperObject;
//         readonly prototype: typeof WrapperObject;
//         ptr?: number;
//       }
//       export abstract class b2ContactListener extends WrapperObject {
//         // technically there's a constructor, but it throws
//         static __class__: typeof b2ContactListener;
//         readonly prototype: typeof b2ContactListener;
//         static __destroy__(): void;
//         static __cache__: { [ptr: number]: b2ContactListener };
//       }
//       export class b2Contact extends WrapperObject {
//         static __class__: typeof b2Contact;
//         readonly prototype: typeof b2Contact;
//         static __destroy__(): void;
//         ptr: number;
//         GetManifold(): b2Manifold;
//         GetWorldManifold(manifold: b2WorldManifold): void;
//         IsTouching(): boolean;
//         SetEnabled(flag: boolean): void;
//         IsEnabled(): boolean;
//         GetNext(): b2Contact;
//         GetFixtureA(): b2Fixture;
//         GetChildIndexA(): number;
//         GetFixtureB(): b2Fixture;
//         GetChildIndexB(): number;
//         SetFriction(friction: number): void;
//         GetFriction(): number;
//         ResetFriction(): void;
//         SetRestitution(restitution: number): void;
//         GetRestitution(): number;
//         ResetRestitution(): void;
//         SetTangentSpeed(speed: number): void;
//         GetTangentSpeed(): number;
//       }
//       export class b2Contact2 extends WrapperObject {
//         readonly prototype: typeof b2Contact2;
//       }
//       type PointerWrappable = {
//         [Key in keyof typeof Box2D]: typeof Box2D[Key] extends { new(...args: any[]): Box2D[Key] } ? typeof Box2D[Key] : never;
//       };
//       export const wrapPointer: <Class extends PointerWrappable[keyof PointerWrappable] = typeof WrapperObject>(pointer: number, targetType?: Class) => InstanceType<Class>;
//       export const getPointer: <Class extends PointerWrappable[keyof PointerWrappable]>(instance: InstanceType<Class>) => number;
//       export const castObject: <Class extends PointerWrappable[keyof PointerWrappable], TargetClass extends PointerWrappable[keyof PointerWrappable] = typeof WrapperObject>(instance: InstanceType<Class>, targetType?: TargetClass) => InstanceType<TargetClass>;
//       export const compare: <Class extends PointerWrappable[keyof PointerWrappable], Class2 extends PointerWrappable[keyof PointerWrappable]>(instance: InstanceType<Class>, instance2: InstanceType<Class2>) => boolean;
//       export const getCache: <Class extends PointerWrappable[keyof PointerWrappable] = WrapperObject>(type?: Class) => { [ptr: number]: InstanceType<Class> };
//       export const destroy: <Class extends PointerWrappable[keyof PointerWrappable]>(instance: InstanceType<Class>) => void;
//       // export const getClass: <Class extends PointerWrappable[keyof PointerWrappable]>(instance: InstanceType<infer Class>) => Class;
//       export const getClass: <Class extends PointerWrappable[keyof PointerWrappable]>(instance: { prototype: { __class__: Class } }) => Class;
//       export const NULL: WrapperObject & { ptr: 0 };
//   }
//   const Box2DFactory: () => Promise<typeof Box2D>;
//   export = Box2DFactory;
// }