import { jsDelivrUriBase } from '@volar/cdn'
import * as volar from '@volar/monaco'
import { editor, languages, Uri } from 'monaco-editor-core'
import editorWorker from 'monaco-editor-core/esm/vs/editor/editor.worker?worker'
import { watchEffect } from 'vue'
import { Store } from '../store'
import { getOrCreateModel } from './utils'
import type { CreateData } from './vue.worker'
import vueWorker from './vue.worker?worker'

let initted = false
export function initMonaco(store: Store) {
  if (initted) return
  loadMonacoEnv(store)

  watchEffect(() => {
    // create a model for each file in the store
    for (const filename in store.state.files) {
      const file = store.state.files[filename]
      if (editor.getModel(Uri.parse(`file:///${filename}`))) continue
      getOrCreateModel(
        Uri.parse(`file:///${filename}`),
        file.language,
        file.code
      )
    }

    // dispose of any models that are not in the store
    for (const model of editor.getModels()) {
      const uri = model.uri.toString()
      if (store.state.files[uri.substring('file:///'.length)]) continue
      if (uri.startsWith(jsDelivrUriBase + '/')) continue
      if (uri.startsWith('inmemory://')) continue

      model.dispose()
    }
  })

  // Support for go to definition
  editor.registerEditorOpener({
    openCodeEditor(_, resource) {
      if (resource.toString().startsWith(jsDelivrUriBase + '/')) {
        return true
      }

      const path = resource.path
      if (/^\//.test(path)) {
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

export class WorkerHost {
  onFetchCdnFile(uri: string, text: string) {
    getOrCreateModel(Uri.parse(uri), undefined, text)
  }
}

let disposeVue: undefined | (() => void)
export async function reloadLanguageTools(store: Store) {
  disposeVue?.()

  let dependencies: Record<string, string> = {
    ...store.state.dependencyVersion,
  }

  if (store.vueVersion) {
    dependencies = {
      ...dependencies,
      vue: store.vueVersion,
      '@vue/compiler-core': store.vueVersion,
      '@vue/compiler-dom': store.vueVersion,
      '@vue/compiler-sfc': store.vueVersion,
      '@vue/compiler-ssr': store.vueVersion,
      '@vue/reactivity': store.vueVersion,
      '@vue/runtime-core': store.vueVersion,
      '@vue/runtime-dom': store.vueVersion,
      '@vue/shared': store.vueVersion,
    }
  }

  if (store.state.typescriptVersion) {
    dependencies = {
      ...dependencies,
      typescript: store.state.typescriptVersion,
    }
  }

  const worker = editor.createWebWorker<any>({
    moduleId: 'vs/language/vue/vueWorker',
    label: 'vue',
    host: new WorkerHost(),
    createData: {
      tsconfig: store.getTsConfig?.() || {},
      dependencies,
    } satisfies CreateData,
  })
  const languageId = ['vue', 'javascript', 'typescript']
  const getSyncUris = () =>
    Object.keys(store.state.files).map((filename) =>
      Uri.parse(`file:///${filename}`)
    )
  const { dispose: disposeMarkers } = volar.editor.activateMarkers(
    worker,
    languageId,
    'vue',
    getSyncUris,
    editor
  )
  const { dispose: disposeAutoInsertion } = volar.editor.activateAutoInsertion(
    worker,
    languageId,
    getSyncUris,
    editor
  )
  const { dispose: disposeProvides } = await volar.languages.registerProvides(
    worker,
    languageId,
    getSyncUris,
    languages
  )

  disposeVue = () => {
    disposeMarkers()
    disposeAutoInsertion()
    disposeProvides()
  }
}

export interface WorkerMessage {
  event: 'init'
  tsVersion: string
  tsLocale?: string
}

export function loadMonacoEnv(store: Store) {
  ;(self as any).MonacoEnvironment = {
    async getWorker(_: any, label: string) {
      if (label === 'vue') {
        const worker = new vueWorker()
        const init = new Promise<void>((resolve) => {
          worker.addEventListener('message', (data) => {
            if (data.data === 'inited') {
              resolve()
            }
          })
          worker.postMessage({
            event: 'init',
            tsVersion: store.state.typescriptVersion,
            tsLocale: store.state.typescriptLocale || store.state.locale,
          } satisfies WorkerMessage)
        })
        await init
        return worker
      }
      return new editorWorker()
    },
  }
  languages.register({ id: 'vue', extensions: ['.vue'] })
  languages.register({ id: 'javascript', extensions: ['.js'] })
  languages.register({ id: 'typescript', extensions: ['.ts'] })

  store.reloadLanguageTools = () => reloadLanguageTools(store)
  languages.onLanguage('vue', () => store.reloadLanguageTools!())
}
