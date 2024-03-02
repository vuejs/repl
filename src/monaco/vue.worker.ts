// @ts-expect-error
import * as worker from 'monaco-editor-core/esm/vs/editor/editor.worker'
import type * as monaco from 'monaco-editor-core'
import {
  type ServiceEnvironment,
  activateAutomaticTypeAcquisition,
  createTypeScriptWorkerService,
} from '@volar/monaco/worker'
import {
  type VueCompilerOptions,
  createVueLanguagePlugin,
  createVueServicePlugins,
  resolveVueCompilerOptions,
} from '@vue/language-service'
import type { WorkerMessage } from './env'

export interface CreateData {
  tsconfig: {
    compilerOptions?: import('typescript').CompilerOptions
    vueCompilerOptions?: Partial<VueCompilerOptions>
  }
  dependencies: Record<string, string>
}

let ts: typeof import('typescript')
let locale: string | undefined

self.onmessage = async (msg: MessageEvent<WorkerMessage>) => {
  if (msg.data?.event === 'init') {
    locale = msg.data.tsLocale
    ts = await importTsFromCdn(msg.data.tsVersion)
    self.postMessage('inited')
    return
  }

  const env: ServiceEnvironment = {
    workspaceFolder: 'file:///',
    locale,
    typescript: {
      uriToFileName: (uri) => uri.substring('file://'.length),
      fileNameToUri: (fileName) => 'file://' + fileName,
    },
  }

  worker.initialize(
    (
      ctx: monaco.worker.IWorkerContext,
      {
        tsconfig,
        // TODO
        dependencies,
      }: CreateData,
    ) => {
      const { options: compilerOptions } = ts.convertCompilerOptionsFromJson(
        tsconfig?.compilerOptions || {},
        '',
      )
      const vueCompilerOptions = resolveVueCompilerOptions(
        tsconfig.vueCompilerOptions || {},
      )

      activateAutomaticTypeAcquisition(env)
      return createTypeScriptWorkerService({
        typescript: ts,
        compilerOptions,
        workerContext: ctx,
        env,
        languagePlugins: [
          createVueLanguagePlugin(
            ts,
            env.typescript!.uriToFileName,
            compilerOptions,
            vueCompilerOptions,
          ),
        ],
        servicePlugins: createVueServicePlugins(ts, () => vueCompilerOptions),
      })
    },
  )
}

async function importTsFromCdn(tsVersion: string) {
  const _module = globalThis.module
  ;(globalThis as any).module = { exports: {} }
  const tsUrl = `https://cdn.jsdelivr.net/npm/typescript@${tsVersion}/lib/typescript.js`
  await import(/* @vite-ignore */ tsUrl)
  const ts = globalThis.module.exports
  globalThis.module = _module
  return ts as typeof import('typescript')
}
