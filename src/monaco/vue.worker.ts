/// <reference types="@volar/typescript" />

import { createNpmFileSystem } from '@volar/jsdelivr'
import {
  type LanguageServiceEnvironment,
  createTypeScriptWorkerLanguageService,
  Language,
} from '@volar/monaco/worker'
import {
  type VueCompilerOptions,
  VueVirtualCode,
  createVueLanguagePlugin,
  getDefaultCompilerOptions,
  generateGlobalTypes,
  getGlobalTypesFileName,
} from '@vue/language-core'
import {
  LanguageService,
  createVueLanguageServicePlugins,
} from '@vue/language-service'
import type * as monaco from 'monaco-editor-core'
// @ts-expect-error
import * as worker from 'monaco-editor-core/esm/vs/editor/editor.worker'
import { create as createTypeScriptPlugins } from 'volar-service-typescript'
import { URI } from 'vscode-uri'
import type { WorkerHost, WorkerMessage } from './env'

import { createVueLanguageServiceProxy } from '@vue/typescript-plugin/lib/common'
import { getComponentDirectives } from '@vue/typescript-plugin/lib/requests/getComponentDirectives'
import { getComponentEvents } from '@vue/typescript-plugin/lib/requests/getComponentEvents'
import { getComponentNames } from '@vue/typescript-plugin/lib/requests/getComponentNames'
import { getComponentProps } from '@vue/typescript-plugin/lib/requests/getComponentProps'
import { getComponentSlots } from '@vue/typescript-plugin/lib/requests/getComponentSlots'
import { getElementAttrs } from '@vue/typescript-plugin/lib/requests/getElementAttrs'
import { getElementNames } from '@vue/typescript-plugin/lib/requests/getElementNames'
import { getPropertiesAtLocation } from '@vue/typescript-plugin/lib/requests/getPropertiesAtLocation'

export interface CreateData {
  tsconfig: {
    compilerOptions?: import('typescript').CompilerOptions
    vueCompilerOptions?: Partial<VueCompilerOptions>
  }
  dependencies: Record<string, string>
}

const asFileName = (uri: URI) => uri.path
const asUri = (fileName: string): URI => URI.file(fileName)

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
      const vueCompilerOptions: VueCompilerOptions = {
        ...getDefaultCompilerOptions(),
        ...tsconfig.vueCompilerOptions,
      }
      const globalTypes = generateGlobalTypes(vueCompilerOptions)
      const globalTypesPath =
        '/node_modules/' + getGlobalTypesFileName(vueCompilerOptions)
      vueCompilerOptions.globalTypesPath = () => globalTypesPath
      const { stat, readFile } = env.fs!
      env.fs!.stat = (uri) => {
        if (uri.path === globalTypesPath) {
          return { type: 1, ctime: 0, mtime: 0, size: globalTypes.length }
        }
        return stat(uri)
      }
      env.fs!.readFile = async (uri) => {
        if (uri.path === globalTypesPath) {
          return globalTypes
        }
        return readFile(uri)
      }

      const vueLanguagePlugin = createVueLanguagePlugin(
        ts,
        compilerOptions,
        vueCompilerOptions,
        asFileName,
      )
      const ignoreVueServicePlugins = new Set([
        'vue-extract-file',
        'vue-document-drop',
        'vue-document-highlights',
        'typescript-semantic-tokens',
      ])
      const vueServicePlugins = createVueLanguageServicePlugins(ts, {
        collectExtractProps() {
          throw new Error('Not implemented')
        },
        getComponentDirectives(fileName) {
          return getComponentDirectives(ts, getProgram(), fileName)
        },
        getComponentEvents(fileName, tag) {
          return getComponentEvents(ts, getProgram(), fileName, tag)
        },
        getComponentNames(fileName) {
          return getComponentNames(ts, getProgram(), fileName)
        },
        getComponentProps(fileName, tag) {
          return getComponentProps(ts, getProgram(), fileName, tag)
        },
        getComponentSlots(fileName) {
          const { virtualCode } = getVirtualCode(fileName)
          return getComponentSlots(ts, getProgram(), virtualCode)
        },
        getElementAttrs(fileName, tag) {
          return getElementAttrs(ts, getProgram(), fileName, tag)
        },
        getElementNames(fileName) {
          return getElementNames(ts, getProgram(), fileName)
        },
        getImportPathForFile() {
          throw new Error('Not implemented')
        },
        getPropertiesAtLocation(fileName, position) {
          const { sourceScript, virtualCode } = getVirtualCode(fileName)
          return getPropertiesAtLocation(
            ts,
            languageService.context.language,
            getProgram(),
            sourceScript,
            virtualCode,
            position,
          )
        },
        getDocumentHighlights() {
          throw new Error('Not implemented')
        },
        getEncodedSemanticClassifications() {
          throw new Error('Not implemented')
        },
        async getQuickInfoAtPosition(fileName, position) {
          const uri = asUri(fileName)
          const sourceScript = languageService.context.language.scripts.get(uri)
          if (!sourceScript) {
            return
          }
          const hover = await languageService.getHover(uri, position)
          let text = ''
          if (typeof hover?.contents === 'string') {
            text = hover.contents
          } else if (Array.isArray(hover?.contents)) {
            text = hover.contents
              .map((c) => (typeof c === 'string' ? c : c.value))
              .join('\n')
          } else if (hover) {
            text = hover.contents.value
          }
          text = text.replace(/```typescript/g, '')
          text = text.replace(/```/g, '')
          text = text.replace(/---/g, '')
          text = text.trim()
          while (true) {
            const newText = text.replace(/\n\n/g, '\n')
            if (newText === text) {
              break
            }
            text = newText
          }
          text = text.replace(/\n/g, ' | ')
          return text
        },
      }).filter((plugin) => !ignoreVueServicePlugins.has(plugin.name!))

      const tsServicePlugins = createTypeScriptPlugins(ts)
      for (let i = 0; i < tsServicePlugins.length; i++) {
        const plugin = tsServicePlugins[i]
        if (plugin.name === 'typescript-semantic') {
          tsServicePlugins[i] = {
            ...plugin,
            create(context) {
              const created = plugin.create(context)
              if (!context.project.typescript) {
                return created
              }
              const tsLs = (
                created.provide as import('volar-service-typescript').Provide
              )['typescript/languageService']()
              const proxy = createVueLanguageServiceProxy(
                ts,
                new Proxy(
                  {},
                  {
                    get(_target, prop, receiver) {
                      return Reflect.get(
                        languageService.context.language,
                        prop,
                        receiver,
                      )
                    },
                  },
                ) as unknown as Language,
                tsLs,
                vueCompilerOptions,
                asUri,
              )
              tsLs.getCompletionsAtPosition = proxy.getCompletionsAtPosition
              tsLs.getCompletionEntryDetails = proxy.getCompletionEntryDetails
              tsLs.getCodeFixesAtPosition = proxy.getCodeFixesAtPosition
              tsLs.getDefinitionAndBoundSpan = proxy.getDefinitionAndBoundSpan
              tsLs.getQuickInfoAtPosition = proxy.getQuickInfoAtPosition
              return created
            },
          }
          break
        }
      }

      const workerService = createTypeScriptWorkerLanguageService({
        typescript: ts,
        compilerOptions,
        workerContext: ctx,
        env,
        uriConverter: {
          asFileName,
          asUri,
        },
        languagePlugins: [vueLanguagePlugin],
        languageServicePlugins: [...tsServicePlugins, ...vueServicePlugins],
      })
      const languageService = (workerService as any)
        .languageService as LanguageService

      return workerService

      function getProgram() {
        const tsService: import('typescript').LanguageService =
          languageService.context.inject('typescript/languageService')
        return tsService.getProgram()!
      }

      function getVirtualCode(fileName: string) {
        const uri = asUri(fileName)
        const sourceScript = languageService.context.language.scripts.get(uri)
        if (!sourceScript) {
          throw new Error('No source script found for file: ' + fileName)
        }
        const virtualCode = sourceScript.generated?.root
        if (!(virtualCode instanceof VueVirtualCode)) {
          throw new Error('No virtual code found for file: ' + fileName)
        }
        return {
          sourceScript,
          virtualCode,
        }
      }
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
