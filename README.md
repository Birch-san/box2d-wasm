# box2d-wasm

Box2D compiled to WebAssembly. [Demo](https://birchlabs.co.uk/box2d-wasm/demo/).

![](https://birchlabs.co.uk/box2d-wasm/webpage-50fps.gif)

## Usage

Install the [`box2d-wasm` npm package](https://www.npmjs.com/package/box2d-wasm)

```bash
npm i --save box2d-wasm
```

Then check out the [documentation](docs).

## License

[Zlib-licensed](LICENSE.zlib.txt).  
Links against MIT-licensed code from Erin Catto's [Box2D](https://github.com/erincatto/box2d).  
Compiles Zlib-licensed code from Alon Zakai's [`box2d.js`](https://github.com/kripken/box2d.js).

## Project

Compared to the existing [`box2d.js`](https://github.com/kripken/box2d.js/) package: `box2d-wasm` aims to support Box2D v2.4.0+ and TypeScript.

- [Comparison with `box2d.js`](README.comparison-with-box2d-js.md)
- [Project aims](README.project-aims.md)

## Developing in this monorepo

See [`README.dev.md`](README.dev.md).