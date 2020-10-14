declare module 'box2d-wasm' {
  // sorry
  const Box2D: () => Promise<Record<string, any>>;
  export = Box2D;
}
// declare module "box2d-wasm" {
//   export namespace Box2D {
//       export class b2Contact {
//           GetManifold(): b2Manifold;
//           GetWorldManifold(manifold: b2WorldManifold): void;
//           IsTouching(): boolean;
//           SetEnabled(flag: boolean): void;
//           IsEnabled(): boolean;
//           GetNext(): b2Contact;
//           GetFixtureA(): b2Fixture;
//           GetChildIndexA(): number;
//           GetFixtureB(): b2Fixture;
//           GetChildIndexB(): number;
//           SetFriction(friction: number): void;
//           GetFriction(): number;
//           ResetFriction(): void;
//           SetRestitution(restitution: number): void;
//           GetRestitution(): number;
//           ResetRestitution(): void;
//           SetTangentSpeed(speed: number): void;
//           GetTangentSpeed(): number;
//       }
//       type PointerWrappable = {
//         [Key in keyof typeof Box2D]: typeof Box2D[Key] extends { new(...args: any[]): Box2D[Key] } ? typeof Box2D[Key] : never;
//       };
//       export const wrapPointer: <Class extends PointerWrappable[keyof PointerWrappable]>(pointer: number, targetType: Class) => Class;
//   }
//   const Box2DFactory: () => Promise<typeof Box2D>;
//   export = Box2DFactory;
// }