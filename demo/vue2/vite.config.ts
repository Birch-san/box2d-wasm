import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

import { defineConfig } from 'vite'
import legacy from '@vitejs/plugin-legacy'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import { createVuePlugin as vue2 } from 'vite-plugin-vue2'
// @ts-ignore
import vueTemplateBabelCompiler from 'vue-template-babel-compiler'
import scriptSetup from 'unplugin-vue2-script-setup/vite'

// console.log(dirname(require.resolve('box2d-wasm')));
// process.exit(0)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    viteStaticCopy({
      targets: [{
        src: resolve(dirname(require.resolve('box2d-wasm')), 'Box2D.simd.wasm'),
        dest: '/'
      }, {
        src: resolve(dirname(require.resolve('box2d-wasm')), 'Box2D.wasm'),
        dest: '/'
      }]
    }),
    vue2({
      jsx: true,
      vueTemplateOptions: {
        compiler: vueTemplateBabelCompiler
      }
    }),
    scriptSetup(),
    legacy({
      targets: ['ie >= 11'],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime']
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
