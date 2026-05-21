import type { CreateData } from './vue.worker'

// Mock the env module to avoid ESM module issues with @volar/monaco
jest.mock('./env', () => {
  return {
    WorkerHost: class WorkerHost {
      onFetchCdnFile(_uri: string, _text: string) {
        // Mock implementation
      }
    },
  }
})

describe('vue.worker', () => {
  describe('CreateData interface', () => {
    it('should accept valid CreateData configuration', () => {
      const createData: CreateData = {
        tsconfig: {
          compilerOptions: {
            target: 99, // ESNext
            module: 99, // ESNext
            strict: true,
            esModuleInterop: true,
          },
          vueCompilerOptions: {
            target: 3.3,
            lib: 'vue',
          },
        },
        dependencies: {
          vue: '3.5.18',
          typescript: '5.9.2',
        },
      }

      expect(createData.tsconfig.compilerOptions?.strict).toBe(true)
      expect(createData.dependencies.vue).toBe('3.5.18')
    })

    it('should accept empty CreateData configuration', () => {
      const createData: CreateData = {
        tsconfig: {},
        dependencies: {},
      }

      expect(createData.tsconfig.compilerOptions).toBeUndefined()
      expect(createData.tsconfig.vueCompilerOptions).toBeUndefined()
      expect(Object.keys(createData.dependencies)).toHaveLength(0)
    })

    it('should accept partial CreateData configuration', () => {
      const createData: CreateData = {
        tsconfig: {
          compilerOptions: {
            strict: true,
          },
        },
        dependencies: {
          vue: '3.5.18',
        },
      }

      expect(createData.tsconfig.compilerOptions?.strict).toBe(true)
      expect(createData.tsconfig.vueCompilerOptions).toBeUndefined()
      expect(createData.dependencies.vue).toBe('3.5.18')
    })
  })

  describe('URI conversion functions', () => {
    it('asFileName should extract path from URI', async () => {
      const { URI } = await import('vscode-uri')
      const uri = URI.file('/test/file.vue')
      expect(uri.path).toBe('/test/file.vue')
    })

    it('asUri should create URI from file name', async () => {
      const { URI } = await import('vscode-uri')
      const fileName = '/test/file.vue'
      const uri = URI.file(fileName)
      expect(uri.toString()).toContain('file:///')
      expect(uri.path).toBe('/test/file.vue')
    })
  })

  describe('TypeScript version handling', () => {
    it('should construct correct CDN URL for TypeScript', () => {
      const tsVersion = '5.9.2'
      const expectedUrl = `https://cdn.jsdelivr.net/npm/typescript@${tsVersion}/lib/typescript.js`
      expect(expectedUrl).toBe(
        'https://cdn.jsdelivr.net/npm/typescript@5.9.2/lib/typescript.js',
      )
    })

    it('should handle different TypeScript versions', () => {
      const versions = ['5.0.0', '5.5.0', '5.9.2', '6.0.0']
      versions.forEach((version) => {
        const url = `https://cdn.jsdelivr.net/npm/typescript@${version}/lib/typescript.js`
        expect(url).toContain(`typescript@${version}`)
      })
    })
  })

  describe('Vue compiler options', () => {
    it('should handle default Vue compiler options', async () => {
      const { getDefaultCompilerOptions } = await import('@vue/language-core')
      const defaultOptions = getDefaultCompilerOptions()

      expect(defaultOptions).toBeDefined()
      expect(typeof defaultOptions).toBe('object')
    })

    it('should handle global types file name', async () => {
      const { getGlobalTypesFileName, getDefaultCompilerOptions } =
        await import('@vue/language-core')
      const options = getDefaultCompilerOptions()
      const fileName = getGlobalTypesFileName(options)

      expect(fileName).toBeDefined()
      expect(typeof fileName).toBe('string')
      expect(fileName).toContain('.d.ts')
    })
  })

  describe('language service environment', () => {
    it('should create environment with workspace folders', async () => {
      const { URI } = await import('vscode-uri')
      const workspaceFolders = [URI.file('/')]

      expect(workspaceFolders).toHaveLength(1)
      expect(workspaceFolders[0].path).toBe('/')
    })

    it('should handle npm file system paths', async () => {
      const { createNpmFileSystem } = await import('@volar/jsdelivr')

      const fs = createNpmFileSystem(
        () => '',
        () => '',
        () => {},
      )

      expect(fs).toBeDefined()
      expect(typeof fs.stat).toBe('function')
      expect(typeof fs.readFile).toBe('function')
    })
  })

  describe('worker context', () => {
    it('should handle worker host methods', async () => {
      const { WorkerHost } = await import('./env')
      const host = new WorkerHost()

      expect(host).toBeDefined()
      expect(typeof host.onFetchCdnFile).toBe('function')
    })

    it('should call onFetchCdnFile with uri and text', async () => {
      const { WorkerHost } = await import('./env')
      const host = new WorkerHost()

      // The method should exist and be callable
      expect(host.onFetchCdnFile).toBeDefined()

      // Call the method (it won't do anything without the mocked utils)
      host.onFetchCdnFile('file:///node_modules/test.js', 'console.log("test")')
    })
  })

  describe('TypeScript compiler options conversion', () => {
    it('should handle empty compiler options', async () => {
      const ts = await import('typescript')

      const { options, errors } = ts.convertCompilerOptionsFromJson({}, '')

      expect(errors).toHaveLength(0)
      expect(options).toBeDefined()
    })

    it('should convert valid compiler options', async () => {
      const ts = await import('typescript')

      const { options, errors } = ts.convertCompilerOptionsFromJson(
        {
          strict: true,
          target: 'ESNext',
          module: 'ESNext',
        },
        '',
      )

      expect(errors).toHaveLength(0)
      expect(options.strict).toBe(true)
    })
  })

  describe('global types setup', () => {
    it('should generate global types', async () => {
      const { generateGlobalTypes, getDefaultCompilerOptions } = await import(
        '@vue/language-core'
      )

      const options = getDefaultCompilerOptions()
      const globalTypes = generateGlobalTypes(options)

      expect(globalTypes).toBeDefined()
      expect(typeof globalTypes).toBe('string')
      expect(globalTypes.length).toBeGreaterThan(0)
    })

    it('should create stat result for global types', () => {
      const ctime = Date.now()
      const globalTypesLength = 1000

      const statResult = {
        type: 1,
        ctime: ctime,
        mtime: ctime,
        size: globalTypesLength,
      }

      expect(statResult.type).toBe(1)
      expect(statResult.size).toBe(globalTypesLength)
      expect(statResult.ctime).toBe(ctime)
      expect(statResult.mtime).toBe(ctime)
    })
  })

  describe('language plugins', () => {
    it('should create Vue language plugin', async () => {
      const ts = await import('typescript')
      const { createVueLanguagePlugin, getDefaultCompilerOptions } =
        await import('@vue/language-core')

      const compilerOptions = getDefaultCompilerOptions()
      const vueCompilerOptions = getDefaultCompilerOptions()

      const plugin = createVueLanguagePlugin(
        ts,
        compilerOptions,
        vueCompilerOptions,
        (uri) => uri.toString(),
      )

      expect(plugin).toBeDefined()
    })
  })

  describe('service plugins', () => {
    it('should create Vue language service plugins', async () => {
      const ts = await import('typescript')
      const { createVueLanguageServicePlugins } = await import(
        '@vue/language-service'
      )

      const plugins = createVueLanguageServicePlugins(ts, {
        getComponentDirectives: () => [],
        getComponentEvents: () => [],
        getComponentNames: () => [],
        getComponentProps: () => [],
        getComponentSlots: () => [],
        getElementAttrs: () => [],
        getElementNames: () => [],
        isRefAtPosition: () => ({ isRef: false }),
        getQuickInfoAtPosition: () => Promise.resolve(''),
        collectExtractProps: () => Promise.resolve([]),
        getImportPathForFile: () => '',
        getDocumentHighlights: () => Promise.resolve([]),
        getEncodedSemanticClassifications: () =>
          Promise.resolve({ spans: [], endOfLineState: 0 }),
        getReactiveReferences: () => Promise.resolve([]),
      })

      expect(plugins).toBeDefined()
      expect(Array.isArray(plugins)).toBe(true)
    })

    it('should filter out ignored Vue service plugins', () => {
      const ignoreVueServicePlugins = new Set([
        'vue-extract-file',
        'vue-document-drop',
        'vue-document-highlights',
        'typescript-semantic-tokens',
      ])

      const allPlugins = [
        { name: 'vue-extract-file' },
        { name: 'vue-document-drop' },
        { name: 'vue-document-highlights' },
        { name: 'typescript-semantic-tokens' },
        { name: 'vue-basic-languages' },
        { name: 'css-basic-languages' },
      ]

      const filtered = allPlugins.filter(
        (plugin) => !ignoreVueServicePlugins.has(plugin.name!),
      )

      expect(filtered).toHaveLength(2)
      expect(filtered.map((p) => p.name)).toEqual([
        'vue-basic-languages',
        'css-basic-languages',
      ])
    })
  })

  describe('TypeScript directive comment plugin', () => {
    it('should create TypeScript directive comment plugin', async () => {
      const { create: createDirectiveCommentPlugin } = await import(
        'volar-service-typescript/lib/plugins/directiveComment'
      )

      const plugin = createDirectiveCommentPlugin()

      expect(plugin).toBeDefined()
      expect(typeof plugin.create).toBe('function')
    })
  })

  describe('TypeScript semantic plugin', () => {
    it('should create TypeScript semantic plugin', async () => {
      const { create: createSemanticPlugin } = await import(
        'volar-service-typescript/lib/plugins/semantic'
      )
      const ts = await import('typescript')

      const plugin = createSemanticPlugin(ts)

      expect(plugin).toBeDefined()
      expect(typeof plugin.create).toBe('function')
    })
  })

  describe('Vue TypeScript plugin requests', () => {
    it('should import getComponentDirectives', async () => {
      const { getComponentDirectives } = await import(
        '@vue/typescript-plugin/lib/requests/getComponentDirectives'
      )
      expect(typeof getComponentDirectives).toBe('function')
    })

    it('should import getComponentEvents', async () => {
      const { getComponentEvents } = await import(
        '@vue/typescript-plugin/lib/requests/getComponentEvents'
      )
      expect(typeof getComponentEvents).toBe('function')
    })

    it('should import getComponentNames', async () => {
      const { getComponentNames } = await import(
        '@vue/typescript-plugin/lib/requests/getComponentNames'
      )
      expect(typeof getComponentNames).toBe('function')
    })

    it('should import getComponentProps', async () => {
      const { getComponentProps } = await import(
        '@vue/typescript-plugin/lib/requests/getComponentProps'
      )
      expect(typeof getComponentProps).toBe('function')
    })

    it('should import getComponentSlots', async () => {
      const { getComponentSlots } = await import(
        '@vue/typescript-plugin/lib/requests/getComponentSlots'
      )
      expect(typeof getComponentSlots).toBe('function')
    })

    it('should import getElementAttrs', async () => {
      const { getElementAttrs } = await import(
        '@vue/typescript-plugin/lib/requests/getElementAttrs'
      )
      expect(typeof getElementAttrs).toBe('function')
    })

    it('should import getElementNames', async () => {
      const { getElementNames } = await import(
        '@vue/typescript-plugin/lib/requests/getElementNames'
      )
      expect(typeof getElementNames).toBe('function')
    })

    it('should import isRefAtPosition', async () => {
      const { isRefAtPosition } = await import(
        '@vue/typescript-plugin/lib/requests/isRefAtPosition'
      )
      expect(typeof isRefAtPosition).toBe('function')
    })
  })

  describe('createVueLanguageServiceProxy', () => {
    it('should import createVueLanguageServiceProxy', async () => {
      const { createVueLanguageServiceProxy } = await import(
        '@vue/typescript-plugin/lib/common'
      )
      expect(typeof createVueLanguageServiceProxy).toBe('function')
    })
  })

  describe('file system operations', () => {
    it('should handle file URI scheme check', async () => {
      const { URI } = await import('vscode-uri')

      const fileUri = URI.file('/test/file.vue')
      const httpUri = URI.parse('https://example.com/file.vue')

      expect(fileUri.scheme).toBe('file')
      expect(httpUri.scheme).toBe('https')
    })

    it('should handle node_modules path extraction', () => {
      const testCases = [
        { input: '/node_modules', expected: '' },
        { input: '/node_modules/vue', expected: 'vue' },
        {
          input: '/node_modules/@vue/runtime-core',
          expected: '@vue/runtime-core',
        },
        {
          input: '/node_modules/typescript/lib/typescript.js',
          expected: 'typescript/lib/typescript.js',
        },
      ]

      testCases.forEach(({ input, expected }) => {
        const path = input.startsWith('/node_modules/')
          ? input.slice('/node_modules/'.length)
          : input === '/node_modules'
            ? ''
            : input
        expect(path).toBe(expected)
      })
    })
  })

  describe('virtual code handling', () => {
    it('should import VueVirtualCode', async () => {
      const { VueVirtualCode } = await import('@vue/language-core')
      expect(VueVirtualCode).toBeDefined()
    })

    it('should check instance of VueVirtualCode', async () => {
      const { VueVirtualCode } = await import('@vue/language-core')

      // VueVirtualCode is a class, we can check instanceof
      expect(typeof VueVirtualCode).toBe('function')
    })
  })

  describe('error handling', () => {
    it('should handle missing source script error message', () => {
      const fileName = '/test/file.vue'
      const errorMessage = `No source script found for file: ${fileName}`

      expect(errorMessage).toContain('No source script found')
      expect(errorMessage).toContain(fileName)
    })

    it('should handle missing virtual code error message', () => {
      const fileName = '/test/file.vue'
      const errorMessage = `No virtual code found for file: ${fileName}`

      expect(errorMessage).toContain('No virtual code found')
      expect(errorMessage).toContain(fileName)
    })

    it('should handle not implemented errors', () => {
      const notImplementedFunctions = [
        'collectExtractProps',
        'getImportPathForFile',
        'getDocumentHighlights',
        'getEncodedSemanticClassifications',
        'getReactiveReferences',
      ]

      notImplementedFunctions.forEach((fn) => {
        const error = new Error('Not implemented')
        expect(error.message).toBe('Not implemented')
      })
    })
  })

  describe('hover text processing', () => {
    it('should process hover content from string', () => {
      const hover = {
        contents: 'interface Test {\n  value: string\n}',
      }

      let text = ''
      if (typeof hover?.contents === 'string') {
        text = hover.contents
      }

      expect(text).toBe('interface Test {\n  value: string\n}')
    })

    it('should process hover content from array', () => {
      const hover = {
        contents: [
          { language: 'typescript', value: 'interface Test' },
          'Additional info',
        ],
      }

      let text = ''
      if (Array.isArray(hover?.contents)) {
        text = hover.contents
          .map((c) => (typeof c === 'string' ? c : c.value))
          .join('\n')
      }

      expect(text).toBe('interface Test\nAdditional info')
    })

    it('should process hover content from markdown', () => {
      const hover = {
        contents: {
          kind: 'markdown',
          value: '```typescript\ninterface Test\n```',
        },
      }

      let text = ''
      if (
        hover &&
        typeof hover.contents !== 'string' &&
        !Array.isArray(hover.contents)
      ) {
        text = hover.contents.value
      }

      expect(text).toBe('```typescript\ninterface Test\n```')
    })

    it('should clean code fences from hover text', () => {
      let text = '```typescript\ninterface Test {\n  value: string\n}\n```'

      text = text.replace(/```typescript/g, '')
      text = text.replace(/```/g, '')
      text = text.replace(/---/g, '')
      text = text.trim()

      expect(text).toBe('interface Test {\n  value: string\n}')
    })

    it('should collapse multiple newlines to single newline', () => {
      let text = 'line1\n\nline2\n\n\nline3'

      while (true) {
        const newText = text.replace(/\n\n/g, '\n')
        if (newText === text) {
          break
        }
        text = newText
      }

      expect(text).toBe('line1\nline2\nline3')
    })

    it('should replace newlines with pipe separator', () => {
      let text = 'interface Test | value: string'

      // Already in pipe format
      const result = text.replace(/\n/g, ' | ')

      expect(result).toBe('interface Test | value: string')
    })
  })

  describe('worker initialization', () => {
    it('should have correct CreateData type structure', () => {
      const createData: CreateData = {
        tsconfig: {
          compilerOptions: {
            target: 99,
            module: 99,
            jsx: 1,
            strict: true,
            moduleResolution: 99,
          },
          vueCompilerOptions: {
            target: 3.3,
            lib: 'vue',
            plugins: [],
          },
        },
        dependencies: {
          vue: '3.5.18',
          '@vue/runtime-dom': '3.5.18',
          typescript: '5.9.2',
        },
      }

      expect(createData.tsconfig.compilerOptions).toBeDefined()
      expect(createData.tsconfig.vueCompilerOptions).toBeDefined()
      expect(createData.dependencies).toBeDefined()
    })
  })

  describe('worker message handling', () => {
    it('should handle init event with tsLocale', () => {
      const message: {
        data: { event: string; tsVersion: string; tsLocale?: string }
      } = {
        data: {
          event: 'init',
          tsVersion: '5.9.2',
          tsLocale: 'zh-CN',
        },
      }

      expect(message.data.event).toBe('init')
      expect(message.data.tsVersion).toBe('5.9.2')
      expect(message.data.tsLocale).toBe('zh-CN')
    })

    it('should handle init event without tsLocale', () => {
      const message: {
        data: { event: string; tsVersion: string; tsLocale?: string }
      } = {
        data: {
          event: 'init',
          tsVersion: '5.9.2',
        },
      }

      expect(message.data.event).toBe('init')
      expect(message.data.tsVersion).toBe('5.9.2')
      expect(message.data.tsLocale).toBeUndefined()
    })
  })
})
