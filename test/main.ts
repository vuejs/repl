import { createApp, h, ref, watchEffect } from 'vue'
import { type OutputModes, Repl, useStore, useVueImportMap } from '../src'
import MonacoEditor from '../src/editor/MonacoEditor.vue'
// import CodeMirrorEditor from '../src/editor/CodeMirrorEditor.vue'

const window = globalThis.window as any
window.process = { env: {} }

const App = {
  setup() {
    const query = new URLSearchParams(location.search)
    const { importMap: builtinImportMap, vueVersion } = useVueImportMap({
      runtimeDev: import.meta.env.PROD
        ? undefined
        : `${location.origin}/src/vue-dev-proxy`,
      serverRenderer: import.meta.env.PROD
        ? undefined
        : `${location.origin}/src/vue-server-renderer-dev-proxy`,
    })
    const store = (window.store = useStore(
      {
        builtinImportMap,
        vueVersion,
        showOutput: ref(query.has('so')),
        outputMode: ref((query.get('om') as OutputModes) || 'preview'),
      },
      location.hash,
    ))
    console.info(store)

    watchEffect(() => history.replaceState({}, '', store.serialize()))

    // setTimeout(() => {
    //   store.setFiles(
    //     {
    //       'src/index.html': '<h1>yo</h1>',
    //       'src/main.js': 'document.body.innerHTML = "<h1>hello</h1>"',
    //       'src/foo.js': 'document.body.innerHTML = "<h1>hello</h1>"',
    //       'src/bar.js': 'document.body.innerHTML = "<h1>hello</h1>"',
    //       'src/baz.js': 'document.body.innerHTML = "<h1>hello</h1>"',
    //     },
    //     'src/index.html',
    //   )
    // }, 1000)

    store.vueVersion = '3.4.1'

    return () =>
      h(Repl, {
        store,
        theme: 'dark',
        editor: MonacoEditor,
        // layout: 'vertical',
        ssr: true,
        sfcOptions: {
          script: {
            // inlineTemplate: false
          },
        },
        // showCompileOutput: false,
        // showImportMap: false
      })
  },
}

createApp(App).mount('#app')
