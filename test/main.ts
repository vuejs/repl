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

    // store.setVueVersion('3.2.8')

    return () =>
      h(Repl, {
        store,
        // showCompileOutput: false,
        // showImportMap: false
      })
  }
}

createApp(App).mount('#app')
