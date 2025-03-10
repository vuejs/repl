// @ts-expect-error
import * as worker from 'monaco-editor-core/esm/vs/editor/editor.worker'
import type * as monaco from 'monaco-editor-core'
import {
  type LanguageServiceEnvironment,
  createTypeScriptWorkerLanguageService,
} from '@volar/monaco/worker'
import {
  type VueCompilerOptions,
  getFullLanguageServicePlugins,
  createVueLanguagePlugin,
  resolveVueCompilerOptions,
} from '@vue/language-service'
import type { WorkerHost, WorkerMessage } from './env'
import { URI } from 'vscode-uri'
import { createNpmFileSystem } from './resource'

export interface CreateData {
  tsconfig: {
    compilerOptions?: import('typescript').CompilerOptions
    vueCompilerOptions?: Partial<VueCompilerOptions>
  }
  dependencies: Record<string, string>
}

function createFunc(func?: string) {
  if (func && typeof func === 'string') {
    return Function(`return ${func}`)()
  }
  return undefined
}

let ts: typeof import('typescript')
let locale: string | undefined
let resourceLinks: Record<
  keyof Pick<
    WorkerMessage,
    'pkgDirUrl' | 'pkgFileTextUrl' | 'pkgLatestVersionUrl'
  >,
  ((...args: any[]) => string) | undefined
>

self.onmessage = async (msg: MessageEvent<WorkerMessage>) => {
  if (msg.data?.event === 'init') {
    locale = msg.data.tsLocale
    ts = await importTsFromCdn(
      msg.data.tsVersion,
      createFunc(msg.data.typescriptLib),
    )
    resourceLinks = {
      pkgDirUrl: createFunc(msg.data.pkgDirUrl),
      pkgFileTextUrl: createFunc(msg.data.pkgFileTextUrl),
      pkgLatestVersionUrl: createFunc(msg.data.pkgLatestVersionUrl),
    }
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
          {
            getPackageDirectoryUrl: resourceLinks.pkgDirUrl,
            getPackageFileTextUrl: resourceLinks.pkgFileTextUrl,
            getPackageLatestVersionUrl: resourceLinks.pkgLatestVersionUrl,
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

      return createTypeScriptWorkerLanguageService({
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
            compilerOptions,
            vueCompilerOptions,
            asFileName,
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

async function importTsFromCdn(
  tsVersion: string,
  getTsCdn?: (version?: string) => string,
) {
  const _module = globalThis.module
  ;(globalThis as any).module = { exports: {} }
  const tsUrl =
    getTsCdn?.(tsVersion) ||
    `https://cdn.jsdelivr.net/npm/typescript@${tsVersion}/lib/typescript.js`
  await import(/* @vite-ignore */ tsUrl)
  const ts = globalThis.module.exports
  globalThis.module = _module
  return ts as typeof import('typescript')
}
