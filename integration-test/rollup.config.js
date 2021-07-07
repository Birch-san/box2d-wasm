/* eslint-env node */
import svelte from 'rollup-plugin-svelte';
import nodePolyfills from 'rollup-plugin-node-polyfills';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import serve from 'rollup-plugin-serve'
import copy from 'rollup-plugin-copy'
import { terser } from 'rollup-plugin-terser';
import sveltePreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';

const production = !process.env.ROLLUP_WATCH;

export default {
	input: 'src/main.ts',
	output: {
		sourcemap: true,
		format: 'esm',
		name: 'app',
		dir: 'public/build'
	},
	plugins: [
		svelte({
			// enable run-time checks when not in production
			dev: !production,
			// we'll extract any component CSS out into
			// a separate file - better for performance
			css: css => {
				css.write('bundle.css');
			},
			preprocess: sveltePreprocess(),
    }),
    nodePolyfills(),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
			dedupe: ['svelte']
		}),
		typescript({
			sourceMap: true,
			inlineSources: !production
		}),

    copy({
      targets: [
        { src: 'node_modules/box2d-wasm/dist/es/Box2D.wasm', dest: 'public' },
        { src: 'node_modules/box2d-wasm/dist/es/Box2D.simd.wasm', dest: 'public' },
      ]
    }),

		// In dev mode, call `npm run start` once
		// the bundle has been generated
		!production && serve({
      contentBase: [
        'public',
        'node_modules/box2d-wasm/dist/es'
      ],
      port: 4000
    }),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload('public'),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser()
	],
	watch: {
		clearScreen: false
	}
};
