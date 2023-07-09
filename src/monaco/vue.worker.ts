// @ts-ignore
import * as worker from 'monaco-editor-core/esm/vs/editor/editor.worker'
import type * as monaco from 'monaco-editor-core'
import {
  createJsDelivrFs,
  createJsDelivrUriResolver,
  decorateServiceEnvironment,
} from '@volar/cdn'
import { VueCompilerOptions, resolveConfig } from '@vue/language-service'
import {
  createLanguageService,
  createLanguageHost,
  createServiceEnvironment,
} from '@volar/monaco/worker'
import type { WorkerHost, WorkerMessage } from './env'

export interface CreateData {
  tsconfig: {
    compilerOptions?: import('typescript').CompilerOptions
    vueCompilerOptions?: Partial<VueCompilerOptions>
  }
  dependencies: Record<string, string>
}

let locale: string

let ts: typeof import('typescript')
let tsLocalized: any

self.onmessage = async (msg: MessageEvent<WorkerMessage>) => {
  if (msg.data?.event === 'init') {
    if (msg.data.tsLocale) {
      locale = msg.data.tsLocale
    }

    ;[ts, tsLocalized] = await Promise.all([
      importTsFromCdn(msg.data.tsVersion),
      locale &&
        fetchJson(
          `https://cdn.jsdelivr.net/npm/typescript@${msg.data.tsVersion}/lib/${locale}/diagnosticMessages.generated.json`
        ),
    ])
    self.postMessage('inited')
    return
  }

  worker.initialize(
    (
      ctx: monaco.worker.IWorkerContext<WorkerHost>,
      { tsconfig, dependencies }: CreateData
    ) => {
      const { options: compilerOptions } = ts.convertCompilerOptionsFromJson(
        tsconfig?.compilerOptions || {},
        ''
      )
      const env = createServiceEnvironment()
      const host = createLanguageHost(
        ctx.getMirrorModels,
        env,
        '/src',
        compilerOptions
      )
      const jsDelivrFs = createJsDelivrFs(ctx.host.onFetchCdnFile)
      const jsDelivrUriResolver = createJsDelivrUriResolver(
        '/node_modules',
        dependencies
      )

      if (locale) {
        env.locale = locale
      }
      if (tsLocalized) {
        host.getLocalizedDiagnosticMessages = () => tsLocalized
      }

      decorateServiceEnvironment(env, jsDelivrUriResolver, jsDelivrFs)

      return createLanguageService(
        { typescript: ts as any },
        env,
        resolveConfig(
          {},
          compilerOptions,
          tsconfig.vueCompilerOptions || {},
          ts as any
        ),
        host
      )
    }
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

async function fetchJson<T>(url: string) {
  try {
    const res = await fetch(url)
    if (res.status === 200) {
      return await res.json()
    }
  } catch {
    // ignore
  }
}
