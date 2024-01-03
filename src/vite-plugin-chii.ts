import { build, type Plugin } from 'vite'
import { resolve } from 'node:path'

export default function vitePluginChii(conf?: { baseUrl: string }): Plugin {
  let outDir: string, isProd: boolean
  return {
    name: 'vite-plugin-chii',
    configResolved(config) {
      outDir = config.build.outDir
      isProd = config.isProduction
    },
    resolveId(id) {
      if (id === 'virtual:chii') {
        return 'virtual:chii'
      }
    },
    async load(id) {
      if (id === 'virtual:chii') {
        if (!isProd)
          return `export default new URL("${resolve(
            __dirname,
            '../chii/entrypoints/chii_app/chii_app.js'
          )}", import.meta.url).toString()`

        await build({
          configFile: false,
          build: {
            emptyOutDir: false,
            target: 'esnext',
            minify: false,
            assetsInlineLimit: 0,
            lib: {
              entry: {
                chii: resolve(
                  __dirname,
                  '..',
                  'chii/entrypoints/chii_app/chii_app.js'
                ),
              },
              formats: ['es'],
              fileName: () => '[name].js',
            },
            outDir,
          },
        })

        // return the path of the compiled file
        return `export default ${
          conf?.baseUrl
            ? `${conf.baseUrl}/chii.js`
            : '`${location.origin}/chii.js`'
        }`
      }
    },
  }
}
