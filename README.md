# box2d-wasm


<p>
    <a href="https://badge.fury.io/js/box2d-wasm"><img src="https://badge.fury.io/js/box2d-wasm.svg" alt="npm version" height="18"></a>
    <a href="LICENSE.zlib.txt">
        <img src="https://img.shields.io/badge/License-Zlib-lightgrey.svg"/>
    </a>
    <a href="https://twitter.com/intent/follow?screen_name=Birchlabs">
        <img src="https://img.shields.io/twitter/follow/Birchlabs.svg?style=social&logo=twitter"/>
    </a>
</p>

Box2D compiled to WebAssembly.

![](https://birchlabs.co.uk/box2d-wasm/webpage-50fps.gif)

## Showcase

- [Shapes and rope](https://birchlabs.co.uk/box2d-wasm/demo/)
- [Lunar Survey](https://birchlabs.co.uk/lunar-survey/)
  - Demonstrates custom gravity
- [Fluid simulation](https://birchlabs.co.uk/liquidfun-wasm/)
  - Uses [liquidfun](https://github.com/Birch-san/box2d-wasm/releases/tag/liquidfun-v6.0.4-lf.1) release
  - High-performance main loop
  - WebGL rendering

## Usage

Install the [`box2d-wasm` npm package](https://www.npmjs.com/package/box2d-wasm)

```bash
npm i box2d-wasm
```

Then check out the [documentation](docs).

## Alternative distributions

For additional functionality:

- fluid simulation
- particle simulation
- soft-body collisions

You can install from the [liquidfun](https://github.com/Birch-san/box2d-wasm/releases/tag/liquidfun-v6.0.4-lf.1) branch like so:

```bash
npm i "box2d-wasm@npm:liquidfun-wasm@6.0.4-lf.1"
```

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
