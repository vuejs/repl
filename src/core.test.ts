import {
  useStore,
  File,
  useVueImportMap,
  mergeImportMap,
  compileFile,
  languageToolsVersion,
} from './core'
import type { ImportMap } from './core'
import { ref } from 'vue'

describe('core exports', () => {
  it('should export useStore function', () => {
    expect(useStore).toBeDefined()
    expect(typeof useStore).toBe('function')
  })

  it('should export File class', () => {
    expect(File).toBeDefined()
    expect(typeof File).toBe('function')
  })

  it('should export useVueImportMap function', () => {
    expect(useVueImportMap).toBeDefined()
    expect(typeof useVueImportMap).toBe('function')
  })

  it('should export mergeImportMap function', () => {
    expect(mergeImportMap).toBeDefined()
    expect(typeof mergeImportMap).toBe('function')
  })

  it('should export compileFile function', () => {
    expect(compileFile).toBeDefined()
    expect(typeof compileFile).toBe('function')
  })

  it('should export languageToolsVersion', () => {
    expect(languageToolsVersion).toBeDefined()
    expect(typeof languageToolsVersion).toBe('string')
  })
})

describe('File class', () => {
  it('should create a File instance with filename', () => {
    const file = new File('test.vue')
    expect(file.filename).toBe('test.vue')
    expect(file.code).toBe('')
    expect(file.hidden).toBe(false)
  })

  it('should create a File instance with filename and code', () => {
    const file = new File('test.vue', '<template></template>')
    expect(file.filename).toBe('test.vue')
    expect(file.code).toBe('<template></template>')
    expect(file.hidden).toBe(false)
  })

  it('should create a File instance with all parameters', () => {
    const file = new File('test.vue', '<template></template>', true)
    expect(file.filename).toBe('test.vue')
    expect(file.code).toBe('<template></template>')
    expect(file.hidden).toBe(true)
  })

  it('should have compiled property with default values', () => {
    const file = new File('test.vue')
    expect(file.compiled).toEqual({
      js: '',
      css: '',
      ssr: '',
      clientMap: '',
      ssrMap: '',
    })
  })

  it('should have editorViewState property initialized to null', () => {
    const file = new File('test.vue')
    expect(file.editorViewState).toBeNull()
  })

  it('should return correct language for .vue files', () => {
    const file = new File('test.vue')
    expect(file.language).toBe('vue')
  })

  it('should return correct language for .html files', () => {
    const file = new File('test.html')
    expect(file.language).toBe('html')
  })

  it('should return correct language for .css files', () => {
    const file = new File('test.css')
    expect(file.language).toBe('css')
  })

  it('should return correct language for .ts files', () => {
    const file = new File('test.ts')
    expect(file.language).toBe('typescript')
  })

  it('should return correct language for .js files', () => {
    const file = new File('test.js')
    expect(file.language).toBe('javascript')
  })
})

describe('useVueImportMap', () => {
  it('should return an object with expected properties', () => {
    const result = useVueImportMap()
    expect(result).toHaveProperty('productionMode')
    expect(result).toHaveProperty('importMap')
    expect(result).toHaveProperty('vueVersion')
    expect(result).toHaveProperty('defaultVersion')
  })

  it('should create importMap with vue and server-renderer imports', () => {
    const result = useVueImportMap()
    const importMap = result.importMap.value
    expect(importMap.imports).toBeDefined()
    expect(importMap.imports?.vue).toBeDefined()
    expect(importMap.imports?.['vue/server-renderer']).toBeDefined()
  })

  it('should accept vueVersion option', () => {
    const result = useVueImportMap({ vueVersion: '3.4.0' })
    expect(result.vueVersion.value).toBe('3.4.0')
  })
})

describe('mergeImportMap', () => {
  it('should merge two import maps', () => {
    const a: ImportMap = {
      imports: { vue: 'https://example.com/vue' },
      scopes: { scope1: { lib: 'https://example.com/lib' } },
    }
    const b: ImportMap = {
      imports: { 'vue/server-renderer': 'https://example.com/sr' },
      scopes: { scope2: { lib2: 'https://example.com/lib2' } },
    }
    const result = mergeImportMap(a, b)
    expect(result.imports?.vue).toBe('https://example.com/vue')
    expect(result.imports?.['vue/server-renderer']).toBe(
      'https://example.com/sr',
    )
    expect(result.scopes?.scope1?.lib).toBe('https://example.com/lib')
    expect(result.scopes?.scope2?.lib2).toBe('https://example.com/lib2')
  })

  it('should handle empty import maps', () => {
    const result = mergeImportMap({}, {})
    expect(result).toEqual({ imports: {}, scopes: {} })
  })

  it('should handle import maps with only imports', () => {
    const a: ImportMap = { imports: { vue: 'https://example.com/vue' } }
    const b: ImportMap = {
      imports: { 'vue/server-renderer': 'https://example.com/sr' },
    }
    const result = mergeImportMap(a, b)
    expect(result.imports?.vue).toBe('https://example.com/vue')
    expect(result.imports?.['vue/server-renderer']).toBe(
      'https://example.com/sr',
    )
  })

  it('should handle import maps with only scopes', () => {
    const a: ImportMap = {
      scopes: { scope1: { lib: 'https://example.com/lib' } },
    }
    const b: ImportMap = {
      scopes: { scope2: { lib2: 'https://example.com/lib2' } },
    }
    const result = mergeImportMap(a, b)
    expect(result.scopes?.scope1?.lib).toBe('https://example.com/lib')
    expect(result.scopes?.scope2?.lib2).toBe('https://example.com/lib2')
  })
})

describe('useStore', () => {
  it('should create a store with default options', () => {
    const store = useStore()
    expect(store).toBeDefined()
    expect(store.files).toBeDefined()
    expect(store.errors).toBeDefined()
    expect(store.showOutput).toBe(false)
  })

  it('should create a store with custom options', () => {
    const store = useStore({
      mainFile: ref('src/Custom.vue'),
      showOutput: ref(true),
    })
    expect(store.mainFile).toBe('src/Custom.vue')
    expect(store.showOutput).toBe(true)
  })

  it('should have init method', () => {
    const store = useStore()
    expect(typeof store.init).toBe('function')
  })

  it('should have setActive method', () => {
    const store = useStore()
    expect(typeof store.setActive).toBe('function')
  })

  it('should have addFile method', () => {
    const store = useStore()
    expect(typeof store.addFile).toBe('function')
  })

  it('should have deleteFile method', () => {
    const store = useStore()
    expect(typeof store.deleteFile).toBe('function')
  })

  it('should have renameFile method', () => {
    const store = useStore()
    expect(typeof store.renameFile).toBe('function')
  })

  it('should have getImportMap method', () => {
    const store = useStore()
    expect(typeof store.getImportMap).toBe('function')
  })

  it('should have setImportMap method', () => {
    const store = useStore()
    expect(typeof store.setImportMap).toBe('function')
  })

  it('should have getTsConfig method', () => {
    const store = useStore()
    expect(typeof store.getTsConfig).toBe('function')
  })

  it('should have serialize method', () => {
    const store = useStore()
    expect(typeof store.serialize).toBe('function')
  })

  it('should have deserialize method', () => {
    const store = useStore()
    expect(typeof store.deserialize).toBe('function')
  })

  it('should have getFiles method', () => {
    const store = useStore()
    expect(typeof store.getFiles).toBe('function')
  })

  it('should have setFiles method', () => {
    const store = useStore()
    expect(typeof store.setFiles).toBe('function')
  })
})

describe('compileFile', () => {
  it('should return empty array for empty code', async () => {
    const store = useStore()
    const file = new File('test.vue', '')
    const result = await compileFile(store, file)
    expect(result).toEqual([])
  })

  it('should compile CSS files', async () => {
    const store = useStore()
    const file = new File('test.css', '.test { color: red; }')
    const result = await compileFile(store, file)
    expect(result).toEqual([])
    expect(file.compiled.css).toBe('.test { color: red; }')
  })

  it('should return empty array for unknown file types', async () => {
    const store = useStore()
    const file = new File('test.txt', 'some text')
    const result = await compileFile(store, file)
    expect(result).toEqual([])
  })

  it('should compile JSON files', async () => {
    const store = useStore()
    const file = new File('test.json', '{"key": "value"}')
    const result = await compileFile(store, file)
    expect(result).toEqual([])
    expect(file.compiled.js).toBe('export default {"key":"value"}')
    expect(file.compiled.ssr).toBe('export default {"key":"value"}')
  })

  it('should return error for invalid JSON', async () => {
    const store = useStore()
    const file = new File('test.json', '{invalid json}')
    const result = await compileFile(store, file)
    expect(result.length).toBeGreaterThan(0)
  })
})
