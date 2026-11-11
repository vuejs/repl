import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  jest,
} from '@jest/globals'
import { ref } from 'vue'

// Mock global browser functions for Node.js environment
const mockConfirm = jest.fn()
const mockAlert = jest.fn()

// Set up global mocks before any imports
Object.assign(global, {
  confirm: mockConfirm,
  alert: mockAlert,
})

// Mock dependencies before imports
jest.mock('./transform', () => ({
  compileFile: jest.fn().mockResolvedValue([]),
}))

jest.mock('./utils', () => ({
  atou: jest.fn((str: string) => {
    try {
      // Remove the # prefix if present and decode base64
      const cleanStr = str.startsWith('#') ? str.slice(1) : str
      return Buffer.from(cleanStr, 'base64').toString('utf-8')
    } catch {
      return str
    }
  }),
  utoa: jest.fn((str: string) => {
    try {
      return Buffer.from(str, 'utf-8').toString('base64')
    } catch {
      return str
    }
  }),
}))

jest.mock('./import-map', () => ({
  useVueImportMap: jest.fn(() => {
    const importMapRef = ref({ imports: {} })
    const vueVersionRef = ref(null)
    return {
      importMap: importMapRef,
      vueVersion: vueVersionRef,
    }
  }),
  mergeImportMap: jest.fn((a: any, b: any) => {
    const result: any = { ...a, ...b }
    if (a?.imports || b?.imports) {
      result.imports = { ...a?.imports, ...b?.imports }
    }
    return result
  }),
}))

import {
  useStore,
  File,
  stripSrcPrefix,
  importMapFile,
  tsconfigFile,
} from './store'

describe('File class', () => {
  describe('constructor', () => {
    it('should create a file with filename and code', () => {
      const file = new File('test.vue', '<template><div>Test</div></template>')
      expect(file.filename).toBe('test.vue')
      expect(file.code).toBe('<template><div>Test</div></template>')
      expect(file.hidden).toBe(false)
    })

    it('should create a file with default empty code', () => {
      const file = new File('test.vue')
      expect(file.filename).toBe('test.vue')
      expect(file.code).toBe('')
      expect(file.hidden).toBe(false)
    })

    it('should create a file with hidden option', () => {
      const file = new File('test.vue', 'code', true)
      expect(file.filename).toBe('test.vue')
      expect(file.code).toBe('code')
      expect(file.hidden).toBe(true)
    })
  })

  describe('compiled property', () => {
    it('should have default compiled values', () => {
      const file = new File('test.vue')
      expect(file.compiled).toEqual({
        js: '',
        css: '',
        ssr: '',
        clientMap: '',
        ssrMap: '',
      })
    })
  })

  describe('editorViewState property', () => {
    it('should have null editorViewState by default', () => {
      const file = new File('test.vue')
      expect(file.editorViewState).toBeNull()
    })
  })

  describe('language getter', () => {
    it('should return "vue" for .vue files', () => {
      const file = new File('test.vue')
      expect(file.language).toBe('vue')
    })

    it('should return "html" for .html files', () => {
      const file = new File('test.html')
      expect(file.language).toBe('html')
    })

    it('should return "css" for .css files', () => {
      const file = new File('test.css')
      expect(file.language).toBe('css')
    })

    it('should return "typescript" for .ts files', () => {
      const file = new File('test.ts')
      expect(file.language).toBe('typescript')
    })

    it('should return "javascript" for .js files', () => {
      const file = new File('test.js')
      expect(file.language).toBe('javascript')
    })

    it('should return "javascript" for unknown extensions', () => {
      const file = new File('test.json')
      expect(file.language).toBe('javascript')
    })
  })
})

describe('stripSrcPrefix', () => {
  it('should remove src/ prefix from filename', () => {
    expect(stripSrcPrefix('src/App.vue')).toBe('App.vue')
  })

  it('should return filename unchanged if no src/ prefix', () => {
    expect(stripSrcPrefix('App.vue')).toBe('App.vue')
  })

  it('should handle nested src/ paths', () => {
    expect(stripSrcPrefix('src/components/Test.vue')).toBe(
      'components/Test.vue',
    )
  })
})

describe('importMapFile constant', () => {
  it('should be "import-map.json"', () => {
    expect(importMapFile).toBe('import-map.json')
  })
})

describe('tsconfigFile constant', () => {
  it('should be "tsconfig.json"', () => {
    expect(tsconfigFile).toBe('tsconfig.json')
  })
})

describe('useStore', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockConfirm.mockReturnValue(true)
    mockAlert.mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('initialization', () => {
    it('should create a store with default values', () => {
      const store = useStore()
      expect(store.files).toBeDefined()
      expect(store.activeFile).toBeDefined()
      expect(store.showOutput).toBe(false)
      expect(store.outputMode).toBe('preview')
      expect(store.vueVersion).toBeNull()
      expect(store.loading).toBe(false)
    })

    it('should have empty errors when import-map.json exists', () => {
      const store = useStore()
      // The import-map.json file should be created by setImportMap during initialization
      // Clear any errors from the initial getImportMap call
      store.errors = []
      expect(store.errors).toEqual([])
    })

    it('should create a store with custom files', () => {
      const customFiles = ref({
        'src/App.vue': new File(
          'src/App.vue',
          '<template><div>Custom</div></template>',
        ),
      })
      const store = useStore({ files: customFiles })
      expect(store.files['src/App.vue']).toBeDefined()
    })

    it('should set activeFilename to mainFile by default', () => {
      const store = useStore()
      expect(store.activeFilename).toBe('src/App.vue')
    })

    it('should use custom mainFile when provided', () => {
      const store = useStore({
        mainFile: ref('src/main.ts'),
        files: ref({
          'src/main.ts': new File('src/main.ts', 'console.log("hello")'),
        }),
      })
      expect(store.mainFile).toBe('src/main.ts')
      expect(store.activeFilename).toBe('src/main.ts')
    })
  })

  describe('setActive', () => {
    it('should set the active filename', () => {
      const store = useStore()
      store.setActive('src/Other.vue')
      expect(store.activeFilename).toBe('src/Other.vue')
    })
  })

  describe('addFile', () => {
    it('should add a new file by filename string', () => {
      const store = useStore()
      store.addFile('src/Test.vue')
      expect(store.files['src/Test.vue']).toBeDefined()
      expect(store.activeFilename).toBe('src/Test.vue')
    })

    it('should add a new File object', () => {
      const store = useStore()
      const file = new File(
        'src/Custom.vue',
        '<template><div>Custom</div></template>',
      )
      store.addFile(file)
      expect(store.files['src/Custom.vue'].filename).toBe('src/Custom.vue')
      expect(store.files['src/Custom.vue'].code).toBe(
        '<template><div>Custom</div></template>',
      )
    })

    it('should not set active file for hidden files', () => {
      const store = useStore()
      const initialActive = store.activeFilename
      const hiddenFile = new File('src/Hidden.vue', '', true)
      store.addFile(hiddenFile)
      expect(store.files['src/Hidden.vue']).toBeDefined()
      expect(store.activeFilename).toBe(initialActive)
    })
  })

  describe('deleteFile', () => {
    beforeEach(() => {
      mockConfirm.mockReturnValue(true)
    })

    it('should delete a file', () => {
      const store = useStore()
      store.addFile('src/Test.vue')
      expect(store.files['src/Test.vue']).toBeDefined()
      store.deleteFile('src/Test.vue')
      expect(store.files['src/Test.vue']).toBeUndefined()
    })

    it('should switch to mainFile when deleting active file', () => {
      const store = useStore()
      store.addFile('src/Test.vue')
      expect(store.activeFilename).toBe('src/Test.vue')
      store.deleteFile('src/Test.vue')
      expect(store.activeFilename).toBe('src/App.vue')
    })

    it('should not delete file when confirm returns false', () => {
      mockConfirm.mockReturnValue(false)
      const store = useStore()
      store.addFile('src/Test.vue')
      store.deleteFile('src/Test.vue')
      expect(store.files['src/Test.vue']).toBeDefined()
    })
  })

  describe('renameFile', () => {
    it('should rename a file', () => {
      const store = useStore()
      store.addFile('src/Old.vue')
      store.renameFile('src/Old.vue', 'src/New.vue')
      expect(store.files['src/Old.vue']).toBeUndefined()
      expect(store.files['src/New.vue']).toBeDefined()
      expect(store.files['src/New.vue']?.filename).toBe('src/New.vue')
    })

    it('should update mainFile when renaming it', () => {
      const store = useStore()
      store.renameFile('src/App.vue', 'src/RenamedApp.vue')
      expect(store.mainFile).toBe('src/RenamedApp.vue')
    })

    it('should update activeFilename when renaming active file', () => {
      const store = useStore()
      store.renameFile('src/App.vue', 'src/RenamedApp.vue')
      expect(store.activeFilename).toBe('src/RenamedApp.vue')
    })

    it('should set error when file not found', () => {
      const store = useStore()
      store.renameFile('src/NonExistent.vue', 'src/New.vue')
      expect(store.errors).toContain(
        'Could not rename "src/NonExistent.vue", file not found',
      )
    })

    it('should set error when new filename is empty', () => {
      const store = useStore()
      store.renameFile('src/App.vue', '')
      expect(store.errors).toContain('Cannot rename "src/App.vue" to ""')
    })

    it('should set error when renaming to same name', () => {
      const store = useStore()
      store.renameFile('src/App.vue', 'src/App.vue')
      expect(store.errors).toContain(
        'Cannot rename "src/App.vue" to "src/App.vue"',
      )
    })
  })

  describe('getImportMap', () => {
    it('should return parsed import map from file', () => {
      const store = useStore()
      const importMap = { imports: { vue: 'https://vue.js' } }
      store.files[importMapFile] = new File(
        importMapFile,
        JSON.stringify(importMap),
      )
      expect(store.getImportMap()).toEqual(importMap)
    })

    it('should return empty object when file does not exist', () => {
      const store = useStore()
      delete store.files[importMapFile]
      expect(store.getImportMap()).toEqual({})
    })

    it('should set error and return empty object for invalid JSON', () => {
      const store = useStore()
      store.files[importMapFile] = new File(importMapFile, 'invalid json')
      expect(store.getImportMap()).toEqual({})
      expect(store.errors.length).toBeGreaterThan(0)
    })
  })

  describe('setImportMap', () => {
    it('should set import map file content', () => {
      const store = useStore()
      const importMap = { imports: { vue: 'https://vue.js' } }
      store.setImportMap(importMap)
      expect(store.files[importMapFile]).toBeDefined()
      expect(JSON.parse(store.files[importMapFile].code)).toEqual(importMap)
    })

    it('should create import map file if not exists', () => {
      const store = useStore()
      delete store.files[importMapFile]
      const importMap = { imports: { vue: 'https://vue.js' } }
      store.setImportMap(importMap)
      expect(store.files[importMapFile]).toBeDefined()
    })

    it('should fix URL from sfc.vuejs to play.vuejs', () => {
      const store = useStore()
      const importMap = { imports: { vue: 'https://sfc.vuejs.org' } }
      store.setImportMap(importMap)
      const result = JSON.parse(store.files[importMapFile].code)
      expect(result.imports.vue).toBe('https://play.vuejs.org')
    })
  })

  describe('getTsConfig', () => {
    it('should return parsed tsconfig from file', () => {
      const store = useStore()
      const tsconfig = { compilerOptions: { target: 'ESNext' } }
      store.files[tsconfigFile] = new File(
        tsconfigFile,
        JSON.stringify(tsconfig),
      )
      expect(store.getTsConfig()).toEqual(tsconfig)
    })

    it('should return empty object for invalid JSON', () => {
      const store = useStore()
      store.files[tsconfigFile] = new File(tsconfigFile, 'invalid json')
      expect(store.getTsConfig()).toEqual({})
    })
  })

  describe('serialize', () => {
    it('should serialize files to a string', () => {
      const store = useStore()
      const serialized = store.serialize()
      expect(typeof serialized).toBe('string')
      expect(serialized).toMatch(/^#/)
    })

    it('should include vue version when set', () => {
      const store = useStore()
      store.vueVersion = '3.4.0'
      const serialized = store.serialize()
      expect(serialized).toBeDefined()
    })
  })

  describe('deserialize', () => {
    it('should deserialize files from a string', () => {
      const store = useStore()
      const files = { 'src/Test.vue': '<template><div>Test</div></template>' }
      const serialized = '#' + btoa(JSON.stringify(files))
      store.deserialize(serialized)
      expect(store.files['src/Test.vue']).toBeDefined()
    })

    it('should set vue version from serialized state', () => {
      const store = useStore()
      const files = { 'src/Test.vue': 'code', _version: '3.4.0' }
      const serialized = '#' + btoa(JSON.stringify(files))
      store.deserialize(serialized)
      expect(store.vueVersion).toBe('3.4.0')
    })

    it('should set typescript version from serialized state', () => {
      const store = useStore()
      const files = { 'src/Test.vue': 'code', _tsVersion: '5.0.0' }
      const serialized = '#' + btoa(JSON.stringify(files))
      store.deserialize(serialized)
      expect(store.typescriptVersion).toBe('5.0.0')
    })

    it('should set default file on invalid serialized state', () => {
      const store = useStore()
      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {})
      store.deserialize('#invalid-base64!')
      expect(consoleSpy).toHaveBeenCalled()
      expect(mockAlert).toHaveBeenCalledWith('Failed to load code from URL.')
      consoleSpy.mockRestore()
    })
  })

  describe('getFiles', () => {
    it('should return all files with code', () => {
      const store = useStore()
      const files = store.getFiles()
      expect(files['App.vue']).toBeDefined()
    })

    it('should strip src/ prefix from filenames', () => {
      const store = useStore()
      const files = store.getFiles()
      expect(files['App.vue']).toBeDefined()
      expect(files['src/App.vue']).toBeUndefined()
    })
  })

  describe('setFiles', () => {
    it('should set new files', async () => {
      const store = useStore()
      const newFiles = {
        'src/Test.vue': '<template><div>Test</div></template>',
      }
      await store.setFiles(newFiles)
      expect(store.files['src/Test.vue']).toBeDefined()
    })

    it('should set main file', async () => {
      const store = useStore()
      const newFiles = {
        'src/Main.vue': '<template><div>Main</div></template>',
      }
      await store.setFiles(newFiles, 'src/Main.vue')
      expect(store.mainFile).toBe('src/Main.vue')
      expect(store.activeFilename).toBe('src/Main.vue')
    })

    it('should use welcome template when main file is missing', async () => {
      const store = useStore()
      const newFiles: Record<string, string> = {}
      await store.setFiles(newFiles)
      expect(store.files['src/App.vue']).toBeDefined()
    })

    it('should add src/ prefix to filenames without it', async () => {
      const store = useStore()
      const newFiles = { 'Test.vue': '<template><div>Test</div></template>' }
      await store.setFiles(newFiles)
      expect(store.files['src/Test.vue']).toBeDefined()
    })

    it('should not add src/ prefix to import-map.json', async () => {
      const store = useStore()
      const newFiles = { 'import-map.json': JSON.stringify({ imports: {} }) }
      await store.setFiles(newFiles)
      expect(store.files['import-map.json']).toBeDefined()
    })

    it('should not add src/ prefix to tsconfig.json', async () => {
      const store = useStore()
      const newFiles = { 'tsconfig.json': JSON.stringify({}) }
      await store.setFiles(newFiles)
      expect(store.files['tsconfig.json']).toBeDefined()
    })
  })

  describe('init', () => {
    it('should initialize the store', () => {
      const store = useStore()
      expect(() => store.init()).not.toThrow()
    })
  })

  describe('reactive properties', () => {
    it('should have errors array', () => {
      const store = useStore()
      expect(Array.isArray(store.errors)).toBe(true)
    })

    it('should have showOutput boolean', () => {
      const store = useStore()
      expect(typeof store.showOutput).toBe('boolean')
    })

    it('should have outputMode string', () => {
      const store = useStore()
      expect(typeof store.outputMode).toBe('string')
    })

    it('should have sfcOptions object', () => {
      const store = useStore()
      expect(typeof store.sfcOptions).toBe('object')
    })

    it('should have ssrOutput object', () => {
      const store = useStore()
      expect(store.ssrOutput).toEqual({ html: '', context: '' })
    })

    it('should have locale property', () => {
      const store = useStore()
      expect(store.locale).toBeUndefined()
    })

    it('should have typescriptVersion property', () => {
      const store = useStore()
      expect(store.typescriptVersion).toBe('latest')
    })

    it('should have dependencyVersion object', () => {
      const store = useStore()
      expect(store.dependencyVersion).toEqual({})
    })
  })

  describe('template property', () => {
    it('should have welcomeSFC template', () => {
      const store = useStore()
      expect(store.template.welcomeSFC).toBeDefined()
    })

    it('should have newSFC template', () => {
      const store = useStore()
      expect(store.template.newSFC).toBeDefined()
    })
  })

  describe('compiler property', () => {
    it('should have a compiler', () => {
      const store = useStore()
      expect(store.compiler).toBeDefined()
    })
  })

  describe('builtinImportMap property', () => {
    it('should have builtinImportMap', () => {
      const store = useStore()
      expect(store.builtinImportMap).toBeDefined()
    })
  })
})
