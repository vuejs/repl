import editorWorker from 'monaco-editor-core/esm/vs/editor/editor.worker?worker'
import vueWorker from './vue.worker?worker'
import * as onigasm from 'onigasm'
import onigasmWasm from 'onigasm/lib/onigasm.wasm?url'
import { editor, languages, Uri } from 'monaco-editor-core'
import * as volar from '@volar/monaco'
import { Store } from '../store'
import { createJsDelivrDtsHost } from 'volar-service-typescript'
import { getOrCreateModel } from './utils'

export function loadWasm() {
  return onigasm.loadWASM(onigasmWasm)
}

export function loadMonacoEnv(store: Store) {
  ;(self as any).MonacoEnvironment = {
    async getWorker(_: any, label: string) {
      if (label === 'vue') {
        return new vueWorker()
      }
      return new editorWorker()
    },
  }
  languages.register({ id: 'vue', extensions: ['.vue'] })
  languages.register({ id: 'javascript', extensions: ['.js'] })
  languages.register({ id: 'typescript', extensions: ['.ts'] })
  languages.onLanguage('vue', async () => {
    const worker = editor.createWebWorker<any>({
      moduleId: 'vs/language/vue/vueWorker',
      label: 'vue',
      host: createJsDelivrDtsHost(
        !store.vueVersion
          ? {}
          : {
              vue: store.vueVersion,
              '@vue/compiler-core': store.vueVersion,
              '@vue/compiler-dom': store.vueVersion,
              '@vue/compiler-sfc': store.vueVersion,
              '@vue/compiler-ssr': store.vueVersion,
              '@vue/reactivity': store.vueVersion,
              '@vue/runtime-core': store.vueVersion,
              '@vue/runtime-dom': store.vueVersion,
              '@vue/shared': store.vueVersion,
            },
        (filename, text) => {
          getOrCreateModel(Uri.file(filename), undefined, text)
        }
      ),
    })
    const languageId = ['vue', 'javascript', 'typescript']
    const getSyncUris = () =>
      Object.keys(store.state.files).map((filename) =>
        Uri.parse(`file:///${filename}`)
      )
    volar.editor.activateMarkers(worker, languageId, 'vue', getSyncUris, editor)
    volar.editor.activateAutoInsertion(worker, languageId, getSyncUris, editor)
    volar.languages.registerProvides(worker, languageId, getSyncUris, languages)
  })
}
