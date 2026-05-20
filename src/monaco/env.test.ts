import { describe, it, expect, beforeEach, jest } from '@jest/globals'

// Set up browser globals for the test environment
beforeAll(() => {
  // @ts-ignore - mock browser global
  global.self = global
  // @ts-ignore - mock browser global
  global.MonacoEnvironment = undefined
})

// Mock external dependencies before importing the module
jest.mock('@volar/monaco', () => ({
  activateMarkers: jest.fn(() => ({ dispose: jest.fn() })),
  activateAutoInsertion: jest.fn(() => ({ dispose: jest.fn() })),
  registerProviders: jest.fn(() => Promise.resolve({ dispose: jest.fn() })),
}))

jest.mock('monaco-editor-core/esm/vs/editor/editor.worker?worker', () => ({
  default: jest.fn(),
}))

jest.mock('./vue.worker?worker', () => ({
  default: jest.fn(() => ({
    addEventListener: jest.fn((event, callback) => {
      if (event === 'message') {
        setTimeout(() => callback({ data: 'inited' }), 0)
      }
    }),
    postMessage: jest.fn(),
  })),
}))

jest.mock('vue', () => ({
  watchEffect: jest.fn((fn) => fn()),
}))

jest.mock('./utils', () => ({
  getOrCreateModel: jest.fn(),
}))

jest.mock('./language-configs', () => ({
  vue: {},
  js: {},
  ts: {},
  css: {},
}))

jest.mock('../utils', () => ({
  debounce: jest.fn((fn) => fn),
}))

describe('monaco/env', () => {
  let initMonaco: typeof import('./env').initMonaco
  let WorkerHost: typeof import('./env').WorkerHost
  let reloadLanguageTools: typeof import('./env').reloadLanguageTools
  let loadMonacoEnv: typeof import('./env').loadMonacoEnv
  let editor: typeof import('monaco-editor-core').editor
  let languages: typeof import('monaco-editor-core').languages
  let Uri: typeof import('monaco-editor-core').Uri
  let __mockModels: Map<string, any>
  let getOrCreateModel: jest.Mock

  beforeEach(async () => {
    // Reset modules to get fresh state for each test
    jest.resetModules()

    // Import after mocks
    const env = await import('./env')
    const monacoCore = await import('monaco-editor-core')
    const utils = await import('./utils')

    initMonaco = env.initMonaco
    WorkerHost = env.WorkerHost
    reloadLanguageTools = env.reloadLanguageTools
    loadMonacoEnv = env.loadMonacoEnv
    editor = monacoCore.editor
    languages = monacoCore.languages
    Uri = monacoCore.Uri
    __mockModels = (monacoCore as any).__mockModels
    getOrCreateModel = utils.getOrCreateModel

    // Clear mock state
    __mockModels.clear()
    jest.clearAllMocks()
  })

  describe('initMonaco', () => {
    const createMockStore = (overrides?: Partial<any>) => ({
      files: {},
      dependencyVersion: {},
      vueVersion: null,
      typescriptVersion: null,
      locale: 'en',
      getTsConfig: jest.fn(),
      setActive: jest.fn(),
      setActiveFile: { filename: 'test.vue' },
      reloadLanguageTools: jest.fn(),
      ...overrides,
    })

    it('should call getModels to check existing models', () => {
      const store = createMockStore()
      initMonaco(store)
      expect(editor.getModels).toHaveBeenCalled()
    })

    it('should not reinitialize if already initted', () => {
      const store = createMockStore()
      initMonaco(store)
      const callCount = editor.getModels.mock.calls.length
      initMonaco(store)
      expect(editor.getModels.mock.calls.length).toBe(callCount)
    })

    it('should create models for files in store that do not exist', () => {
      const store = createMockStore({
        files: {
          'test.vue': { language: 'vue', code: 'test code' },
        },
      })
      initMonaco(store)
      expect(getOrCreateModel).toHaveBeenCalled()
    })

    it('should dispose models not in store (excluding node_modules and inmemory)', () => {
      const mockModel = {
        uri: { toString: () => 'file:///other.vue' },
        dispose: jest.fn(),
      }
      __mockModels.set('file:///other.vue', mockModel)

      const store = createMockStore({ files: {} })
      initMonaco(store)

      expect(mockModel.dispose).toHaveBeenCalled()
    })

    it('should not dispose node_modules models', () => {
      const mockModel = {
        uri: { toString: () => 'file:///node_modules/test.vue' },
        dispose: jest.fn(),
      }
      __mockModels.set('file:///node_modules/test.vue', mockModel)

      const store = createMockStore({ files: {} })
      initMonaco(store)

      expect(mockModel.dispose).not.toHaveBeenCalled()
    })

    it('should not dispose inmemory models', () => {
      const mockModel = {
        uri: { toString: () => 'inmemory://test' },
        dispose: jest.fn(),
      }
      __mockModels.set('inmemory://test', mockModel)

      const store = createMockStore({ files: {} })
      initMonaco(store)

      expect(mockModel.dispose).not.toHaveBeenCalled()
    })
  })

  describe('WorkerHost', () => {
    it('should call getOrCreateModel with parsed uri', () => {
      const host = new WorkerHost()
      const uri = 'file:///test.vue'
      const text = 'test content'

      host.onFetchCdnFile(uri, text)

      expect(getOrCreateModel).toHaveBeenCalledWith(
        expect.any(Object),
        undefined,
        text,
      )
    })
  })

  describe('reloadLanguageTools', () => {
    const createMockStore = (overrides?: Partial<any>) => ({
      files: {
        'test.vue': { language: 'vue', code: '' },
      },
      dependencyVersion: {},
      vueVersion: null,
      typescriptVersion: null,
      locale: 'en',
      getTsConfig: jest.fn(() => ({})),
      setActive: jest.fn(),
      setActiveFile: { filename: 'test.vue' },
      reloadLanguageTools: jest.fn(),
      ...overrides,
    })

    it('should create web worker with correct config', async () => {
      const mockWorker = {
        addEventListener: jest.fn(),
        postMessage: jest.fn(),
      }
      editor.createWebWorker.mockReturnValue(mockWorker as any)

      const store = createMockStore({
        dependencyVersion: { 'some-dep': '1.0.0' },
        vueVersion: '3.3.0',
        typescriptVersion: '5.0.0',
      })

      await reloadLanguageTools(store)

      expect(editor.createWebWorker).toHaveBeenCalledWith({
        moduleId: 'vs/language/vue/vueWorker',
        label: 'vue',
        host: expect.any(WorkerHost),
        createData: {
          tsconfig: {},
          dependencies: {
            'some-dep': '1.0.0',
            vue: '3.3.0',
            '@vue/compiler-core': '3.3.0',
            '@vue/compiler-dom': '3.3.0',
            '@vue/compiler-sfc': '3.3.0',
            '@vue/compiler-ssr': '3.3.0',
            '@vue/reactivity': '3.3.0',
            '@vue/runtime-core': '3.3.0',
            '@vue/runtime-dom': '3.3.0',
            '@vue/shared': '3.3.0',
            typescript: '5.0.0',
          },
        },
      })
    })

    it('should handle store without vueVersion', async () => {
      const mockWorker = {
        addEventListener: jest.fn(),
        postMessage: jest.fn(),
      }
      editor.createWebWorker.mockReturnValue(mockWorker as any)

      const store = createMockStore({
        vueVersion: null,
        typescriptVersion: '5.0.0',
      })

      await reloadLanguageTools(store)

      expect(editor.createWebWorker).toHaveBeenCalledWith(
        expect.objectContaining({
          createData: expect.objectContaining({
            dependencies: {
              typescript: '5.0.0',
            },
          }),
        }),
      )
    })

    it('should handle store without typescriptVersion', async () => {
      const mockWorker = {
        addEventListener: jest.fn(),
        postMessage: jest.fn(),
      }
      editor.createWebWorker.mockReturnValue(mockWorker as any)

      const store = createMockStore({
        vueVersion: '3.3.0',
        typescriptVersion: null,
      })

      await reloadLanguageTools(store)

      expect(editor.createWebWorker).toHaveBeenCalledWith(
        expect.objectContaining({
          createData: expect.objectContaining({
            dependencies: expect.objectContaining({
              vue: '3.3.0',
            }),
          }),
        }),
      )
    })

    it('should call volar functions with correct parameters', async () => {
      const mockWorker = {
        addEventListener: jest.fn(),
        postMessage: jest.fn(),
      }
      editor.createWebWorker.mockReturnValue(mockWorker as any)

      const store = createMockStore()

      await reloadLanguageTools(store)

      expect((await import('@volar/monaco')).activateMarkers).toHaveBeenCalled()
      expect(
        (await import('@volar/monaco')).activateAutoInsertion,
      ).toHaveBeenCalled()
      expect(
        (await import('@volar/monaco')).registerProviders,
      ).toHaveBeenCalled()
    })
  })

  describe('loadMonacoEnv', () => {
    const createMockStore = (overrides?: Partial<any>) => ({
      files: {},
      dependencyVersion: {},
      vueVersion: null,
      typescriptVersion: null,
      locale: 'en',
      getTsConfig: jest.fn(),
      setActive: jest.fn(),
      setActiveFile: { filename: 'test.vue' },
      reloadLanguageTools: undefined,
      ...overrides,
    })

    it('should set up MonacoEnvironment with getWorker function', () => {
      const store = createMockStore({ typescriptVersion: '5.0.0' })
      loadMonacoEnv(store)

      expect((globalThis as any).MonacoEnvironment).toBeDefined()
      expect(typeof (globalThis as any).MonacoEnvironment.getWorker).toBe(
        'function',
      )
    })

    it('should register languages', () => {
      const store = createMockStore()
      loadMonacoEnv(store)

      expect(languages.register).toHaveBeenCalledTimes(4)
    })

    it('should set language configurations', () => {
      const store = createMockStore()
      loadMonacoEnv(store)

      expect(languages.setLanguageConfiguration).toHaveBeenCalledTimes(4)
    })

    it('should register onLanguage handler for vue', () => {
      const store = createMockStore()
      loadMonacoEnv(store)

      expect(languages.onLanguage).toHaveBeenCalledWith(
        'vue',
        expect.any(Function),
      )
    })

    it('should register editor opener for go to definition', () => {
      const store = createMockStore()
      loadMonacoEnv(store)

      expect(editor.registerEditorOpener).toHaveBeenCalled()
    })

    it('should set up debounced reloadLanguageTools on store', () => {
      const store = createMockStore()
      loadMonacoEnv(store)

      expect(store.reloadLanguageTools).toBeDefined()
    })
  })
})
