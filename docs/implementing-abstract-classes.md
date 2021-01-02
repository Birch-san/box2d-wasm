## Implementing abstract classes

You'll encounter methods that ask for you to implement an interface in order to receive a callback, such as `b2World#RayCast()`:

```ts
export class b2World extends WrapperObject {
  RayCast(callback: b2RayCastCallback | number, point1: b2Vec2 | number, point2: b2Vec2 | number): void;
}
```

`b2RayCastCallback` cannot be constructed directly (its constructor throws an error); it's an abstract class.  
Instead, you should construct its subclass, `JSRayCastCallback`, and override all the methods that it declares in its TypeScript typings (just `ReportFixture` in this case):

```ts
export class JSRayCastCallback extends b2RayCastCallback {
  ReportFixture(fixture: b2Fixture | number, point: b2Vec2 | number, normal: b2Vec2 | number, fraction: number): number;
}
```

One syntax that works for this is:

```js
const callback = Object.assign(new JSRayCastCallback(), {
  ReportFixture: (fixture_p, point_p, normal_p, fraction) => {
    return 0;
  }
}
```

An implementation of `JSRayCastCallback` (`b2RayCastCallback`) is provided in the [raycasting docs](./raycasting.md).

An implementation of `JSDraw` (`b2Draw`) is provided [in the demos]([`debugDraw.js`](../demo/modern/public/debugDraw.js)).