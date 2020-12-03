# Helpers for working with Emscripten types

See [`box2d-wasm/Box2DModuleAugmentations.d.ts`](../box2d-wasm/Box2DModuleAugmentations.d.ts) for documentation on:

- `reifyArray(array_p, numElements, elementSize, ctor`
- `pointsToVec2Array(points)`
- `tuplesToVec2Array(tuples)`
- `toFloatArray(floats)`
- `sizeof(ctor)`
- `allocateArray(ctor, elementSizeBytes, elements?)`

Note also that the Box2D instance returned is a subtype of `EmscriptenModule`.  
You can lookup the helpers that Emscripten provides (such as `_malloc()` and `_free()`) at [`@types/emscripten`](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/emscripten/index.d.ts#L43).