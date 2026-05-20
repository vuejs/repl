import * as indexExports from './index'
import {
  useStore,
  File,
  useVueImportMap,
  mergeImportMap,
  compileFile,
  languageToolsVersion,
} from './core'
import Repl from './Repl.vue'
import Preview from './output/Preview.vue'
import Sandbox from './output/Sandbox.vue'

describe('index.ts exports', () => {
  it('should export Repl component', () => {
    expect(indexExports.Repl).toBeDefined()
    expect(indexExports.Repl).toBe(Repl)
  })

  it('should export Preview component', () => {
    expect(indexExports.Preview).toBeDefined()
    expect(indexExports.Preview).toBe(Preview)
  })

  it('should export Sandbox component', () => {
    expect(indexExports.Sandbox).toBeDefined()
    expect(indexExports.Sandbox).toBe(Sandbox)
  })

  it('should export useStore from core', () => {
    expect(indexExports.useStore).toBeDefined()
    expect(indexExports.useStore).toBe(useStore)
  })

  it('should export File from core', () => {
    expect(indexExports.File).toBeDefined()
    expect(indexExports.File).toBe(File)
  })

  it('should export useVueImportMap from core', () => {
    expect(indexExports.useVueImportMap).toBeDefined()
    expect(indexExports.useVueImportMap).toBe(useVueImportMap)
  })

  it('should export mergeImportMap from core', () => {
    expect(indexExports.mergeImportMap).toBeDefined()
    expect(indexExports.mergeImportMap).toBe(mergeImportMap)
  })

  it('should export compileFile from core', () => {
    expect(indexExports.compileFile).toBeDefined()
    expect(indexExports.compileFile).toBe(compileFile)
  })

  it('should export languageToolsVersion from core', () => {
    expect(indexExports.languageToolsVersion).toBeDefined()
    expect(indexExports.languageToolsVersion).toBe(languageToolsVersion)
  })

  it('should export all core exports', () => {
    expect(indexExports.useStore).toBeDefined()
    expect(indexExports.File).toBeDefined()
    expect(indexExports.useVueImportMap).toBeDefined()
    expect(indexExports.mergeImportMap).toBeDefined()
    expect(indexExports.compileFile).toBeDefined()
    expect(indexExports.languageToolsVersion).toBeDefined()
  })
})

describe('Repl component', () => {
  it('should be exported', () => {
    expect(indexExports.Repl).toBeDefined()
  })
})

describe('Preview component', () => {
  it('should be exported', () => {
    expect(indexExports.Preview).toBeDefined()
  })
})

describe('Sandbox component', () => {
  it('should be exported', () => {
    expect(indexExports.Sandbox).toBeDefined()
  })
})

describe('File class via index', () => {
  it('should create a File instance with filename', () => {
    const file = new indexExports.File('test.vue')
    expect(file.filename).toBe('test.vue')
    expect(file.code).toBe('')
    expect(file.hidden).toBe(false)
  })

  it('should create a File instance with filename and code', () => {
    const file = new indexExports.File('test.vue', '<template></template>')
    expect(file.filename).toBe('test.vue')
    expect(file.code).toBe('<template></template>')
    expect(file.hidden).toBe(false)
  })

  it('should return correct language for .vue files', () => {
    const file = new indexExports.File('test.vue')
    expect(file.language).toBe('vue')
  })

  it('should return correct language for .ts files', () => {
    const file = new indexExports.File('test.ts')
    expect(file.language).toBe('typescript')
  })

  it('should return correct language for .js files', () => {
    const file = new indexExports.File('test.js')
    expect(file.language).toBe('javascript')
  })

  it('should return correct language for .css files', () => {
    const file = new indexExports.File('test.css')
    expect(file.language).toBe('css')
  })

  it('should return correct language for .html files', () => {
    const file = new indexExports.File('test.html')
    expect(file.language).toBe('html')
  })
})

describe('useStore via index', () => {
  it('should create a store with default options', () => {
    const store = indexExports.useStore()
    expect(store).toBeDefined()
    expect(store.files).toBeDefined()
    expect(store.errors).toBeDefined()
  })

  it('should have all expected methods', () => {
    const store = indexExports.useStore()
    expect(typeof store.init).toBe('function')
    expect(typeof store.setActive).toBe('function')
    expect(typeof store.addFile).toBe('function')
    expect(typeof store.deleteFile).toBe('function')
    expect(typeof store.renameFile).toBe('function')
    expect(typeof store.getImportMap).toBe('function')
    expect(typeof store.setImportMap).toBe('function')
    expect(typeof store.getTsConfig).toBe('function')
    expect(typeof store.serialize).toBe('function')
    expect(typeof store.deserialize).toBe('function')
    expect(typeof store.getFiles).toBe('function')
    expect(typeof store.setFiles).toBe('function')
  })
})

describe('useVueImportMap via index', () => {
  it('should return an object with expected properties', () => {
    const result = indexExports.useVueImportMap()
    expect(result).toHaveProperty('productionMode')
    expect(result).toHaveProperty('importMap')
    expect(result).toHaveProperty('vueVersion')
    expect(result).toHaveProperty('defaultVersion')
  })

  it('should create importMap with vue and server-renderer imports', () => {
    const result = indexExports.useVueImportMap()
    const importMap = result.importMap.value
    expect(importMap.imports).toBeDefined()
    expect(importMap.imports?.vue).toBeDefined()
    expect(importMap.imports?.['vue/server-renderer']).toBeDefined()
  })
})

describe('mergeImportMap via index', () => {
  it('should merge two import maps', () => {
    const a = {
      imports: { vue: 'https://example.com/vue' },
      scopes: { scope1: { lib: 'https://example.com/lib' } },
    }
    const b = {
      imports: { 'vue/server-renderer': 'https://example.com/sr' },
      scopes: { scope2: { lib2: 'https://example.com/lib2' } },
    }
    const result = indexExports.mergeImportMap(a, b)
    expect(result.imports?.vue).toBe('https://example.com/vue')
    expect(result.imports?.['vue/server-renderer']).toBe(
      'https://example.com/sr',
    )
    expect(result.scopes?.scope1?.lib).toBe('https://example.com/lib')
    expect(result.scopes?.scope2?.lib2).toBe('https://example.com/lib2')
  })

  it('should handle empty import maps', () => {
    const result = indexExports.mergeImportMap({}, {})
    expect(result).toEqual({ imports: {}, scopes: {} })
  })
})

describe('compileFile via index', () => {
  it('should return empty array for empty code', async () => {
    const store = indexExports.useStore()
    const file = new indexExports.File('test.vue', '')
    const result = await indexExports.compileFile(store, file)
    expect(result).toEqual([])
  })

  it('should compile CSS files', async () => {
    const store = indexExports.useStore()
    const file = new indexExports.File('test.css', '.test { color: red; }')
    const result = await indexExports.compileFile(store, file)
    expect(result).toEqual([])
    expect(file.compiled.css).toBe('.test { color: red; }')
  })

  it('should compile JSON files', async () => {
    const store = indexExports.useStore()
    const file = new indexExports.File('test.json', '{"key": "value"}')
    const result = await indexExports.compileFile(store, file)
    expect(result).toEqual([])
    expect(file.compiled.js).toBe('export default {"key":"value"}')
    expect(file.compiled.ssr).toBe('export default {"key":"value"}')
  })

  it('should return error for invalid JSON', async () => {
    const store = indexExports.useStore()
    const file = new indexExports.File('test.json', '{invalid json}')
    const result = await indexExports.compileFile(store, file)
    expect(result.length).toBeGreaterThan(0)
  })
})

describe('languageToolsVersion via index', () => {
  it('should be a string', () => {
    expect(typeof indexExports.languageToolsVersion).toBe('string')
  })

  it('should be a non-empty string', () => {
    expect(indexExports.languageToolsVersion.length).toBeGreaterThan(0)
  })
})
