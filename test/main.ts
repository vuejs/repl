import { createApp, h, watchEffect } from 'vue'
import { Repl, ReplStore } from '../src'
;(window as any).process = { env: {} }

const App = {
  setup() {
    const store = new ReplStore({
      serializedState: location.hash.slice(1),
      defaultVueRuntimeURL: import.meta.env.PROD
        ? undefined
        : `${location.origin}/src/vue-dev-proxy`
    })

    watchEffect(() => history.replaceState({}, '', store.serialize()))

    // setTimeout(() => {
    store.setFiles(
      {
        'index.html': '<h1>yo</h1>',
        'main.js': 'document.body.innerHTML = "<h1>hello</h1>"',
        'foo.js': 'document.body.innerHTML = "<h1>hello</h1>"',
        'bar.js': 'document.body.innerHTML = "<h1>hello</h1>"',
        'baz.js': 'document.body.innerHTML = "<h1>hello</h1>"'
      },
      'index.html'
    )
    // }, 1000);

    store.setVueVersion('3.2.8')

    return () =>
      h(Repl, {
        store
        // showCompileOutput: false,
        // showImportMap: false
      })
  }
}

createApp(App).mount('#app')
