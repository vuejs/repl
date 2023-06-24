import { watchEffect } from 'vue'
import * as monaco from 'monaco-editor-core'
import editorWorker from 'monaco-editor-core/esm/vs/editor/editor.worker?worker'
import vueWorker from './vue.worker?worker'
import * as onigasm from 'onigasm'
import onigasmWasm from 'onigasm/lib/onigasm.wasm?url'
import { editor, languages, Uri } from 'monaco-editor-core'
import * as volar from '@volar/monaco'
import { Store } from '../store'
import { createJsDelivrDtsHost } from 'volar-service-typescript'
import { getOrCreateModel } from './utils'

let initted = false
export function initMonaco(store: Store) {
  if (initted) return
  loadMonacoEnv(store)
  loadWasm()

  watchEffect(() => {
    // create a model for each file in the store
    for (const filename in store.state.files) {
      const file = store.state.files[filename]
      if (monaco.editor.getModel(monaco.Uri.parse(`file:///${filename}`)))
        continue
      getOrCreateModel(
        monaco.Uri.parse(`file:///${filename}`),
        file.language,
        file.code
      )
    }

    // dispose of any models that are not in the store
    for (const model of monaco.editor.getModels()) {
      const uri = model.uri.toString()
      if (store.state.files[uri.substring('file:///'.length)]) continue
      if (uri.startsWith('file:///node_modules/')) continue
      if (uri.startsWith('inmemory://')) continue

      model.dispose()
    }
  })

  // Support for go to definition
  monaco.editor.registerEditorOpener({
    openCodeEditor(_, resource) {
      const path = resource.path
      if (/^\//.test(path) && !/^\/node_modules/.test(path)) {
        const fileName = path.replace('/', '')
        if (fileName !== store.state.activeFile.filename) {
          store.setActive(fileName)
          return true
        }
      }

      return false
    },
  })

  initted = true
}

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
