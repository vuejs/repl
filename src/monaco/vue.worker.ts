// @ts-ignore
import * as worker from 'monaco-editor-core/esm/vs/editor/editor.worker'
import type * as monaco from 'monaco-editor-core'
import * as ts from 'typescript'
import { createJsDelivrFs, createJsDelivrUriResolver, decorateServiceEnvironment } from '@volar/cdn'
import { VueCompilerOptions, resolveConfig } from '@vue/language-service'
import { createLanguageService, createLanguageHost, createServiceEnvironment } from '@volar/monaco/worker'
import type { WorkerHost } from './env'

export interface CreateData {
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
      { tsconfig, dependencies }: CreateData
    ) => {
      const { options: compilerOptions } = ts.convertCompilerOptionsFromJson(
        tsconfig?.compilerOptions || {},
        ''
      )
      const env = createServiceEnvironment();
      const host = createLanguageHost(ctx.getMirrorModels, env, '/src', compilerOptions)
      const jsDelivrFs = createJsDelivrFs(ctx.host.onFetchCdnFile)
      const jsDelivrUriResolver = createJsDelivrUriResolver('/node_modules', dependencies)

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
