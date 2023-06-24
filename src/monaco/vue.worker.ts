// @ts-ignore
import * as worker from 'monaco-editor-core/esm/vs/editor/editor.worker'
import type * as monaco from 'monaco-editor-core'
import * as ts from 'typescript'
import { Config, resolveConfig } from '@vue/language-service'
import { createLanguageService } from '@volar/monaco/worker'
import createTypeScriptService, { IDtsHost } from 'volar-service-typescript'

self.onmessage = () => {
  worker.initialize(
    (
      ctx: monaco.worker.IWorkerContext<IDtsHost>,
      { tsconfig }: { tsconfig: any }
    ) => {
      const { options: compilerOptions } = ts.convertCompilerOptionsFromJson(
        tsconfig?.compilerOptions || {},
        ''
      )

      const baseConfig: Config = {
        services: {
          typescript: createTypeScriptService({ dtsHost: ctx.host }),
        },
      }

      return createLanguageService({
        workerContext: ctx,
        config: resolveConfig(
          baseConfig,
          compilerOptions,
          tsconfig.vueCompilerOptions || {},
          ts as any
        ),
        typescript: {
          module: ts as any,
          compilerOptions,
        },
      })
    }
  )
}
