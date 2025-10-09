import {
  type LanguageServiceEnvironment,
  createTypeScriptWorkerLanguageService,
  Language,
} from '@volar/monaco/worker'
import { createNpmFileSystem } from '../unpkg/npm'
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
import { create as createTypeScriptDirectiveCommentPlugin } from 'volar-service-typescript/lib/plugins/directiveComment'
import { create as createTypeScriptSemanticPlugin } from 'volar-service-typescript/lib/plugins/semantic'
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
import { isRefAtPosition } from '@vue/typescript-plugin/lib/requests/isRefAtPosition'

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
      setupGlobalTypes(vueCompilerOptions, env)

      const workerService = createTypeScriptWorkerLanguageService({
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
        languageServicePlugins: [
          ...getTsLanguageServicePlugins(),
          ...getVueLanguageServicePlugins(),
        ],
      })

      return workerService

      function setupGlobalTypes(
        options: VueCompilerOptions,
        env: LanguageServiceEnvironment,
      ) {
        const globalTypes = generateGlobalTypes(options)
        const globalTypesPath =
          '/node_modules/' + getGlobalTypesFileName(options)
        options.globalTypesPath = () => globalTypesPath
        const { stat, readFile } = env.fs!
        const ctime = Date.now()

        env.fs!.stat = async (uri) => {
          if (uri.path === globalTypesPath) {
            return {
              type: 1,
              ctime: ctime,
              mtime: ctime,
              size: globalTypes.length,
            }
          }
          return stat(uri)
        }
        env.fs!.readFile = async (uri) => {
          if (uri.path === globalTypesPath) {
            return globalTypes
          }
          return readFile(uri)
        }
      }

      function getTsLanguageServicePlugins() {
        const semanticPlugin = createTypeScriptSemanticPlugin(ts)
        const { create } = semanticPlugin
        semanticPlugin.create = (context) => {
          const created = create(context)
          const ls = created.provide[
            'typescript/languageService'
          ]() as import('typescript').LanguageService
          const proxy = createVueLanguageServiceProxy(
            ts,
            new Proxy(
              {},
              {
                get(_target, prop, receiver) {
                  return Reflect.get(context.language, prop, receiver)
                },
              },
            ) as unknown as Language,
            ls,
            vueCompilerOptions,
            asUri,
          )
          ls.getCompletionsAtPosition = proxy.getCompletionsAtPosition
          ls.getCompletionEntryDetails = proxy.getCompletionEntryDetails
          ls.getCodeFixesAtPosition = proxy.getCodeFixesAtPosition
          ls.getDefinitionAndBoundSpan = proxy.getDefinitionAndBoundSpan
          ls.getQuickInfoAtPosition = proxy.getQuickInfoAtPosition
          return created
        }
        return [semanticPlugin, createTypeScriptDirectiveCommentPlugin()]
      }

      function getVueLanguageServicePlugins() {
        const plugins = createVueLanguageServicePlugins(ts, {
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
          isRefAtPosition(fileName, position) {
            const { sourceScript, virtualCode } = getVirtualCode(fileName)
            return isRefAtPosition(
              ts,
              getLanguageService().context.language,
              getProgram(),
              sourceScript,
              virtualCode,
              position,
            )
          },
          async getQuickInfoAtPosition(fileName, position) {
            const uri = asUri(fileName)
            const sourceScript =
              getLanguageService().context.language.scripts.get(uri)
            if (!sourceScript) {
              return
            }
            const hover = await getLanguageService().getHover(uri, position)
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
          collectExtractProps() {
            throw new Error('Not implemented')
          },
          getImportPathForFile() {
            throw new Error('Not implemented')
          },
          getDocumentHighlights() {
            throw new Error('Not implemented')
          },
          getEncodedSemanticClassifications() {
            throw new Error('Not implemented')
          },
          getReactiveReferences() {
            throw new Error('Not implemented')
          },
        })
        const ignoreVueServicePlugins = new Set([
          'vue-extract-file',
          'vue-document-drop',
          'vue-document-highlights',
          'typescript-semantic-tokens',
        ])
        return plugins.filter(
          (plugin) => !ignoreVueServicePlugins.has(plugin.name!),
        )

        function getVirtualCode(fileName: string) {
          const uri = asUri(fileName)
          const sourceScript =
            getLanguageService().context.language.scripts.get(uri)
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

        function getProgram() {
          const tsService: import('typescript').LanguageService =
            getLanguageService().context.inject('typescript/languageService')
          return tsService.getProgram()!
        }

        function getLanguageService() {
          return (workerService as any).languageService as LanguageService
        }
      }
    },
  )
}

async function importTsFromCdn(tsVersion: string) {
  const tsUrl = `https://esmsh.factset.io/typescript@${tsVersion}/lib/typescript.js`
  return await import(/* @vite-ignore */ tsUrl)
}
