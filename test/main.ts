import { createApp, h, watchEffect } from 'vue'
import { Repl, ReplStore } from '../src'
;(window as any).process = { env: {} }

const App = {
  setup() {
    const query = new URLSearchParams(location.search)
    const store = new ReplStore({
      serializedState: location.hash.slice(1),
      showOutput: query.has('so'),
      outputMode: query.get('om') || 'preview',
      defaultVueRuntimeURL: import.meta.env.PROD
        ? undefined
        : `${location.origin}/src/vue-dev-proxy`,
      defaultVueServerRendererURL: import.meta.env.PROD
        ? undefined
        : `${location.origin}/src/vue-server-renderer-dev-proxy`
    })

    store.setImportMap({
      imports: {
        "casual-ui-vue":
          "https://unpkg.com/casual-ui-vue/dist/casual-ui-vue.es.js",
      },
    });

    watchEffect(() => history.replaceState({}, '', store.serialize()))

    // setTimeout(() => {
    // store.setFiles(
    //   {
    //     'index.html': '<h1>yo</h1>',
    //     'main.js': 'document.body.innerHTML = "<h1>hello</h1>"',
    //     'foo.js': 'document.body.innerHTML = "<h1>hello</h1>"',
    //     'bar.js': 'document.body.innerHTML = "<h1>hello</h1>"',
    //     'baz.js': 'document.body.innerHTML = "<h1>hello</h1>"'
    //   },
    //   'index.html'
    // )
    // }, 1000);

    // store.setVueVersion('3.2.8')

    return () =>
      h(Repl, {
        store,
        // layout: 'vertical',
        sfcOptions: {
          script: {
            // inlineTemplate: false
          },
        },
        previewOptions: {
          headHTML:
            '<link rel="stylesheet" href="https://unpkg.com/casual-ui-vue/dist/style.css">',
          customCode: {
            importCode: `import CUI from 'casual-ui-vue'`,
            useCode: 'app.use(CUI)'
          }
        },
        // showCompileOutput: false,
        // showImportMap: false
      });
  }
}

createApp(App).mount('#app')
