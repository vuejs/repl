import { compileFile, COMP_IDENTIFIER } from './transform'
import type { Store, File } from './store'
import * as defaultCompiler from 'vue/compiler-sfc'

function createMockStore(): Store {
  return {
    files: {},
    activeFile: null as any,
    mainFile: 'src/App.vue',
    errors: [],
    showOutput: false,
    outputMode: 'preview',
    sfcOptions: {},
    ssrOutput: { html: '', context: '' },
    compiler: defaultCompiler,
    vueVersion: null,
    locale: undefined,
    typescriptVersion: 'latest',
    dependencyVersion: {},
    init: () => {},
    setActive: () => {},
    addFile: () => {},
    deleteFile: () => {},
    renameFile: () => {},
    getImportMap: () => ({}),
    getTsConfig: () => ({}),
  }
}

function createMockFile(filename: string, code: string): File {
  return {
    filename,
    code,
    hidden: false,
    compiled: {
      js: '',
      css: '',
      ssr: '',
      clientMap: '',
      ssrMap: '',
    },
    editorViewState: null,
    get language() {
      if (this.filename.endsWith('.vue')) return 'vue'
      if (this.filename.endsWith('.html')) return 'html'
      if (this.filename.endsWith('.css')) return 'css'
      if (this.filename.endsWith('.ts')) return 'typescript'
      return 'javascript'
    },
  }
}

describe('compileFile', () => {
  let store: Store

  beforeEach(() => {
    store = createMockStore()
  })

  describe('empty files', () => {
    it('should return empty array for empty code', async () => {
      const file = createMockFile('src/test.vue', '')
      const errors = await compileFile(store, file)
      expect(errors).toEqual([])
    })

    it('should return empty array for whitespace-only code', async () => {
      const file = createMockFile('src/test.vue', '   \n\t  ')
      const errors = await compileFile(store, file)
      expect(errors).toEqual([])
    })
  })

  describe('CSS files', () => {
    it('should compile CSS files', async () => {
      const cssCode = '.test { color: red; }'
      const file = createMockFile('src/test.css', cssCode)
      const errors = await compileFile(store, file)
      expect(errors).toEqual([])
      expect(file.compiled.css).toBe(cssCode)
    })
  })

  describe('JavaScript files', () => {
    it('should compile JS files', async () => {
      const jsCode = 'export const foo = 42'
      const file = createMockFile('src/test.js', jsCode)
      const errors = await compileFile(store, file)
      expect(errors).toEqual([])
      expect(file.compiled.js).toBe(jsCode)
      expect(file.compiled.ssr).toBe(jsCode)
    })

    it('should compile TS files', async () => {
      const tsCode = 'export const foo: number = 42'
      const file = createMockFile('src/test.ts', tsCode)
      const errors = await compileFile(store, file)
      expect(errors).toEqual([])
      expect(file.compiled.js).toContain('export const foo = 42')
      expect(file.compiled.ssr).toContain('export const foo = 42')
    })

    it('should compile TSX files', async () => {
      const tsxCode = `export const Foo = () => <div>Hello</div>`
      const file = createMockFile('src/test.tsx', tsxCode)
      const errors = await compileFile(store, file)
      expect(errors).toEqual([])
      expect(file.compiled.js).toBeDefined()
      expect(file.compiled.ssr).toBeDefined()
    })

    it('should compile JSX files', async () => {
      const jsxCode = `export const Foo = () => <div>Hello</div>`
      const file = createMockFile('src/test.jsx', jsxCode)
      const errors = await compileFile(store, file)
      expect(errors).toEqual([])
      expect(file.compiled.js).toBeDefined()
      expect(file.compiled.ssr).toBeDefined()
    })
  })

  describe('JSON files', () => {
    it('should compile valid JSON files', async () => {
      const jsonCode = '{"name": "test", "value": 42}'
      const file = createMockFile('src/test.json', jsonCode)
      const errors = await compileFile(store, file)
      expect(errors).toEqual([])
      expect(file.compiled.js).toBe('export default {"name":"test","value":42}')
      expect(file.compiled.ssr).toBe(
        'export default {"name":"test","value":42}',
      )
    })

    it('should return error for invalid JSON', async () => {
      const invalidJson = '{invalid json}'
      const file = createMockFile('src/test.json', invalidJson)
      const errors = await compileFile(store, file)
      expect(errors.length).toBeGreaterThan(0)
    })
  })

  describe('Vue files', () => {
    it('should compile basic Vue SFC', async () => {
      const vueCode = `<template>
  <div>{{ msg }}</div>
</template>

<script>
export default {
  data() {
    return { msg: 'Hello' }
  }
}
</script>

<style>
div { color: red; }
</style>`
      const file = createMockFile('src/test.vue', vueCode)
      const errors = await compileFile(store, file)
      expect(errors).toEqual([])
      expect(file.compiled.js).toBeDefined()
      expect(file.compiled.ssr).toBeDefined()
      expect(file.compiled.css).toBeDefined()
    })

    it('should compile Vue SFC with script setup', async () => {
      const vueCode = `<template>
  <div>{{ msg }}</div>
</template>

<script setup>
import { ref } from 'vue'
const msg = ref('Hello')
</script>`
      const file = createMockFile('src/test.vue', vueCode)
      const errors = await compileFile(store, file)
      expect(errors).toEqual([])
      expect(file.compiled.js).toBeDefined()
      expect(file.compiled.ssr).toBeDefined()
    })

    it('should handle scoped styles', async () => {
      const vueCode = `<template>
  <div>Test</div>
</template>

<script setup>
</script>

<style scoped>
div { color: red; }
</style>`
      const file = createMockFile('src/test.vue', vueCode)
      const errors = await compileFile(store, file)
      expect(errors).toEqual([])
      expect(file.compiled.js).toContain('__scopeId')
    })

    it('should return error for Vue parse errors', async () => {
      const invalidVue = `<template>
  <div>Unclosed div
</template>`
      const file = createMockFile('src/test.vue', invalidVue)
      const errors = await compileFile(store, file)
      expect(errors.length).toBeGreaterThan(0)
    })

    it('should return error for unsupported template lang', async () => {
      const vueCode = `<template lang="pug">
div Test
</template>`
      const file = createMockFile('src/test.vue', vueCode)
      const errors = await compileFile(store, file)
      expect(errors.length).toBeGreaterThan(0)
      expect(errors[0]).toContain('lang="pug"')
    })

    it('should return error for unsupported style lang', async () => {
      const vueCode = `<template>
  <div>Test</div>
</template>

<style lang="scss">
div { color: red; }
</style>`
      const file = createMockFile('src/test.vue', vueCode)
      const errors = await compileFile(store, file)
      expect(errors.length).toBeGreaterThan(0)
      expect(errors[0]).toContain('lang="scss"')
    })

    it('should return error for unsupported script lang', async () => {
      const vueCode = `<template>
  <div>Test</div>
</template>

<script lang="py">
print('hello')
</script>`
      const file = createMockFile('src/test.vue', vueCode)
      const errors = await compileFile(store, file)
      expect(errors.length).toBeGreaterThan(0)
      expect(errors[0]).toContain('Unsupported lang "py"')
    })

    it('should handle CSS vars in SFC', async () => {
      const vueCode = `<template>
  <div>Test</div>
</template>

<script setup>
const color = 'red'
</script>

<style>
div { color: v-bind(color); }
</style>`
      const file = createMockFile('src/test.vue', vueCode)
      const errors = await compileFile(store, file)
      expect(errors).toEqual([])
    })

    it('should handle custom element mode', async () => {
      const storeWithCE = createMockStore()
      storeWithCE.sfcOptions = {
        script: {
          customElement: /\.ce\.vue$/,
        },
      }
      const vueCode = `<template>
  <div>Test</div>
</template>

<script setup>
</script>

<style>
div { color: red; }
</style>`
      const file = createMockFile('src/test.ce.vue', vueCode)
      const errors = await compileFile(storeWithCE, file)
      expect(errors).toEqual([])
      expect(file.compiled.js).toContain('.styles')
    })

    it('should handle module styles error', async () => {
      const vueCode = `<template>
  <div>Test</div>
</template>

<style module>
.test { color: red; }
</style>`
      const file = createMockFile('src/test.vue', vueCode)
      const errors = await compileFile(store, file)
      expect(errors.length).toBeGreaterThan(0)
      expect(errors[0]).toContain('<style module>')
    })

    it('should compile TypeScript in script', async () => {
      const vueCode = `<template>
  <div>{{ msg }}</div>
</template>

<script lang="ts">
export default {
  data(): { msg: string } {
    return { msg: 'Hello' }
  }
}
</script>`
      const file = createMockFile('src/test.vue', vueCode)
      const errors = await compileFile(store, file)
      expect(errors).toEqual([])
      expect(file.compiled.js).toBeDefined()
    })

    it('should compile TypeScript in script setup', async () => {
      const vueCode = `<template>
  <div>{{ msg }}</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const msg = ref<string>('Hello')
</script>`
      const file = createMockFile('src/test.vue', vueCode)
      const errors = await compileFile(store, file)
      expect(errors).toEqual([])
      expect(file.compiled.js).toBeDefined()
    })

    it('should include __file property', async () => {
      const vueCode = `<template>
  <div>Test</div>
</template>

<script setup>
</script>`
      const file = createMockFile('src/test.vue', vueCode)
      const errors = await compileFile(store, file)
      expect(errors).toEqual([])
      expect(file.compiled.js).toContain('__file')
      expect(file.compiled.js).toContain('src/test.vue')
    })

    it('should include analyzed bindings comment', async () => {
      const vueCode = `<template>
  <div>{{ msg }}</div>
</template>

<script setup>
import { ref } from 'vue'
const msg = ref('Hello')
</script>`
      const file = createMockFile('src/test.vue', vueCode)
      const errors = await compileFile(store, file)
      expect(errors).toEqual([])
      expect(file.compiled.js).toContain('Analyzed bindings')
    })
  })

  describe('unknown file types', () => {
    it('should return empty array for unknown file extensions', async () => {
      const file = createMockFile('src/test.md', '# Hello')
      const errors = await compileFile(store, file)
      expect(errors).toEqual([])
    })

    it('should return empty array for html files', async () => {
      const file = createMockFile('src/test.html', '<div>Hello</div>')
      const errors = await compileFile(store, file)
      expect(errors).toEqual([])
    })
  })

  describe('COMP_IDENTIFIER', () => {
    it('should be defined', () => {
      expect(COMP_IDENTIFIER).toBe('__sfc__')
    })
  })
})
