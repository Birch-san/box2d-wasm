declare module 'box2d-wasm' {
  // sorry
  const Box2D: () => Promise<Record<string, any>>;
  export = Box2D;
}