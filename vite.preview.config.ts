import { defineConfig, Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import replace from '@rollup/plugin-replace'
import esbuild from 'esbuild'
import { build } from 'vite'

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
function vitePluginbraw2(): Plugin {
  return {
    name: 'vite-plugin-braw2',
    apply: 'build',
    enforce: 'post',
    async load(id) {
      if (id.endsWith('?braw2')) {
        const file = id.slice(0, -5) // remove '?braw2' from the end

        await build({
          configFile: false,
          build: {
            emptyOutDir: false,
            target: 'esnext',
            minify: false,
            assetsInlineLimit: 0,
            lib: {
              entry: { chii: file },
              formats: ['es'],
              fileName: () => '[name].js',
            },
            outDir: __dirname + '/dist',
          },
        })

        // return the path of the compiled file
        return `export default \`\${location.origin}/chii.js\``
      }
    },
  }
}

export default defineConfig({
  plugins: [
    vitePluginBuildRaw(),
    vitePluginbraw2(),
    vue({
      script: {
        defineModel: true,
      },
    }),
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
