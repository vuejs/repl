// @ts-ignore
import * as worker from 'monaco-editor-core/esm/vs/editor/editor.worker'
import type * as monaco from 'monaco-editor-core'
import * as ts from 'typescript'
import { createJsDelivrFs, createJsDelivrUriResolver, decorateServiceEnvironment } from '@volar/cdn'
import { VueCompilerOptions, resolveConfig } from '@vue/language-service'
import { createLanguageService, createLanguageHost, createServiceEnvironment } from '@volar/monaco/worker'
import type { WorkerHost } from './env'

export interface CreateData {
  locale: string
  tsLocalized: any
  tsconfig: {
    compilerOptions?: ts.CompilerOptions
    vueCompilerOptions?: Partial<VueCompilerOptions>
  }
  dependencies: {}
}

self.onmessage = () => {
  worker.initialize(
    (
      ctx: monaco.worker.IWorkerContext<WorkerHost>,
      { tsconfig, dependencies, locale, tsLocalized }: CreateData
    ) => {
      const { options: compilerOptions } = ts.convertCompilerOptionsFromJson(
        tsconfig?.compilerOptions || {},
        ''
      )
      const env = createServiceEnvironment();
      const host = createLanguageHost(ctx.getMirrorModels, env, '/src', compilerOptions)
      const jsDelivrFs = createJsDelivrFs(ctx.host.onFetchCdnFile)
      const jsDelivrUriResolver = createJsDelivrUriResolver('/node_modules', dependencies)

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
