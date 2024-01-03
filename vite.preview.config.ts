import { defineConfig, Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import replace from '@rollup/plugin-replace'
import esbuild from 'esbuild'
import Chii from './src/vite-plugin-chii'

import { rmSync } from 'fs'

rmSync(`${__dirname}/dist`, { recursive: true, force: true })

function vitePluginBuildRaw(): Plugin {
  return {
    name: 'vite-plugin-build-raw',
    transform(src, id) {
      if (id.endsWith('?braw')) {
        id = id.replace(/\?braw$/, '')
        // console.log({ id })
        const code = esbuild.buildSync({
          entryPoints: [id],
          format: 'iife',
          bundle: true,
          minify:
            id.includes('&minify') || process.env.NODE_ENV === 'production',
          treeShaking: true,
          write: false,
          // sourcemap: true
          // sideEff,
          define: Object.fromEntries(
            Object.entries(process.env).map(([name, value]) => [
              `process.env.${name.replace(/[^\w\d_$]/g, '_')}`,
              JSON.stringify(value),
            ])
          ),
        })
        const { text } = code.outputFiles[0]

        return {
          code: `export default ${JSON.stringify(text)}`,

          map: null,
        }
      }
    },
  }
}

export default defineConfig({
  plugins: [
    vitePluginBuildRaw(),
    vue({
      script: {
        defineModel: true,
      },
    }),
    Chii(),
  ],
  resolve: {
    alias: {
      '@vue/compiler-dom': '@vue/compiler-dom/dist/compiler-dom.cjs.js',
      '@vue/compiler-core': '@vue/compiler-core/dist/compiler-core.cjs.js',
    },
  },
  build: {
    emptyOutDir: false,
    commonjsOptions: {
      ignore: ['typescript'],
    },
  },
  worker: {
    format: 'es',
    plugins: () => [
      replace({
        preventAssignment: true,
        values: {
          'process.env.NODE_ENV': JSON.stringify('production'),
        },
      }),
    ],
  },
})
