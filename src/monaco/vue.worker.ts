// @ts-expect-error
import * as worker from 'monaco-editor-core/esm/vs/editor/editor.worker'
import type * as monaco from 'monaco-editor-core'
import {
  type LanguageServiceEnvironment,
  createTypeScriptWorkerService,
} from '@volar/monaco/worker'
import { createNpmFileSystem } from '../unpkg/npm'
import {
  type VueCompilerOptions,
  getFullLanguageServicePlugins,
  createVueLanguagePlugin,
  resolveVueCompilerOptions,
} from '@vue/language-service'
import type { WorkerHost, WorkerMessage } from './env'
import { URI } from 'vscode-uri'

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

  worker.initialize(
    (
      ctx: monaco.worker.IWorkerContext<WorkerHost>,
      { tsconfig, dependencies }: CreateData,
    ) => {
      const asFileName = (uri: URI) => uri.path
      const asUri = (fileName: string): URI => URI.file(fileName)
      const env: LanguageServiceEnvironment = {
        workspaceFolders: [URI.file('/')],
        locale,
        fs: createNpmFileSystem(
          (uri) => {
            if (uri.scheme === 'file') {
              if (uri.path === '/node_modules') {
                return ''
              } else if (uri.path.startsWith('/node_modules/')) {
                return uri.path.slice('/node_modules/'.length)
              }
            }
          },
          (pkgName) => dependencies[pkgName],
          (path, content) => {
            ctx.host.onFetchCdnFile(
              asUri('/node_modules/' + path).toString(),
              content,
            )
          },
        ),
      }

      const { options: compilerOptions } = ts.convertCompilerOptionsFromJson(
        tsconfig?.compilerOptions || {},
        '',
      )
      const vueCompilerOptions = resolveVueCompilerOptions(
        tsconfig.vueCompilerOptions || {},
      )

      return createTypeScriptWorkerService({
        typescript: ts,
        compilerOptions,
        workerContext: ctx,
        env,
        uriConverter: {
          asFileName,
          asUri,
        },
        languagePlugins: [
          createVueLanguagePlugin(
            ts,
            asFileName,
            () => '', // TODO getProjectVersion
            (fileName) => {
              const uri = asUri(fileName)
              for (const model of ctx.getMirrorModels()) {
                if (model.uri.toString() === uri.toString()) {
                  return true
                }
              }
              return false
            },
            compilerOptions,
            vueCompilerOptions,
          ),
        ],
        languageServicePlugins: getFullLanguageServicePlugins(ts),
        setup({ project }) {
          project.vue = { compilerOptions: vueCompilerOptions }
        },
      })
    },
  )
}

async function importTsFromCdn(tsVersion: string) {
  const _module = globalThis.module
  ;(globalThis as any).module = { exports: {} }
  const tsUrl = `https://esmsh.factset.io/typescript@${tsVersion}/lib/typescript.js?raw`
  await import(/* @vite-ignore */ tsUrl)
  const ts = globalThis.module.exports
  globalThis.module = _module
  return ts as typeof import('typescript')
}
