declare module 'box2d-wasm' {
  // sorry
  const Box2D: (importOptions: Record<string, any>) => Promise<Record<string, any>>;
  export = Box2D;
}