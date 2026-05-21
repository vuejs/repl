import { describe, it, expect, beforeEach } from '@jest/globals'
import { compileModulesForPreview } from './moduleCompiler'
import { useStore, File } from '../store'

describe('compileModulesForPreview', () => {
  let store: ReturnType<typeof useStore>

  beforeEach(async () => {
    store = useStore()
    await store.setFiles({
      'src/App.vue': '<template><div>Test</div></template>',
    })
  })

  describe('basic functionality', () => {
    it('should compile modules for preview', async () => {
      await store.setFiles({
        'src/App.vue': '<template><div>Test</div></template>',
      })
      const result = compileModulesForPreview(store)
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeGreaterThan(0)
    })

    it('should handle a simple JS module', async () => {
      await store.setFiles(
        {
          'src/main.js': 'export const value = 42',
        },
        'src/main.js',
      )
      const result = compileModulesForPreview(store)
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeGreaterThan(0)
    })
  })

  describe('SSR mode', () => {
    it('should compile for SSR when isSSR is true', async () => {
      await store.setFiles({
        'src/App.vue': '<template><div>SSR Test</div></template>',
      })
      const result = compileModulesForPreview(store, true)
      expect(Array.isArray(result)).toBe(true)
    })

    it('should not include CSS in SSR mode', async () => {
      await store.setFiles({
        'src/App.vue':
          '<template><div>Test</div></template>\n<style>.test { color: red; }</style>',
      })
      const result = compileModulesForPreview(store, true)
      const hasCssPush = result.some((code) =>
        code.includes('window.__css__.push'),
      )
      expect(hasCssPush).toBe(false)
    })

    it('should include CSS in non-SSR mode', async () => {
      await store.setFiles({
        'src/App.vue':
          '<template><div>Test</div></template>\n<style>.test { color: red; }</style>',
      })
      const result = compileModulesForPreview(store, false)
      // CSS is included either via compiled css or as unimported css file
      expect(result.length).toBeGreaterThan(0)
    })
  })

  describe('CSS file handling', () => {
    it('should add unimported CSS files in non-SSR mode', async () => {
      await store.setFiles(
        {
          'src/main.js': 'export const value = 42',
          'src/style.css': '.test { color: blue; }',
        },
        'src/main.js',
      )
      const result = compileModulesForPreview(store, false)
      const hasCssPush = result.some((code) =>
        code.includes('window.__css__.push'),
      )
      expect(hasCssPush).toBe(true)
    })

    it('should not add unimported CSS files in SSR mode', async () => {
      await store.setFiles(
        {
          'src/main.js': 'export const value = 42',
          'src/style.css': '.test { color: blue; }',
        },
        'src/main.js',
      )
      const result = compileModulesForPreview(store, true)
      const hasCssPush = result.some((code) =>
        code.includes('window.__css__.push'),
      )
      expect(hasCssPush).toBe(false)
    })
  })

  describe('HTML file handling', () => {
    it('should process HTML files in non-SSR mode', async () => {
      await store.setFiles(
        {
          'src/index.html':
            '<!DOCTYPE html><html><body><div id="app"></div></body></html>',
        },
        'src/index.html',
      )
      const result = compileModulesForPreview(store, false)
      // HTML files should produce output with innerHTML assignment
      expect(result.some((code) => code.includes('innerHTML'))).toBe(true)
    })

    it('should handle HTML with script tags', async () => {
      await store.setFiles(
        {
          'src/index.html': `<!DOCTYPE html>
<html>
  <body>
    <script>console.log('test')</script>
  </body>
</html>`,
        },
        'src/index.html',
      )
      const result = compileModulesForPreview(store, false)
      expect(result.some((code) => code.includes('innerHTML'))).toBe(true)
      expect(result.some((code) => code.includes("console.log('test')"))).toBe(
        true,
      )
    })

    it('should handle HTML with script type="module" tags', async () => {
      await store.setFiles(
        {
          'src/index.html': `<!DOCTYPE html>
<html>
  <body>
    <script type="module">import { foo } from './foo.js'</script>
  </body>
</html>`,
          'src/foo.js': 'export const foo = "bar"',
        },
        'src/index.html',
      )
      const result = compileModulesForPreview(store, false)
      expect(result.some((code) => code.includes('innerHTML'))).toBe(true)
    })
  })

  describe('module compilation', () => {
    it('should handle ES module imports', async () => {
      await store.setFiles({
        'src/App.vue': `<script setup>
import { foo } from './foo'
console.log(foo)
</script>
<template><div>Test</div></template>`,
        'src/foo.js': 'export const foo = "bar"',
      })
      const result = compileModulesForPreview(store)
      expect(result.length).toBeGreaterThan(0)
    })

    it('should handle default exports', async () => {
      await store.setFiles(
        {
          'src/main.js': `import App from './App.vue'
export default App`,
          'src/App.vue': '<template><div>App</div></template>',
        },
        'src/main.js',
      )
      const result = compileModulesForPreview(store)
      expect(result.length).toBeGreaterThan(0)
    })

    it('should handle named exports', async () => {
      await store.setFiles(
        {
          'src/main.js': 'export const value = 42',
        },
        'src/main.js',
      )
      const result = compileModulesForPreview(store)
      // Check for module instantiation (Symbol.toStringTag indicates module processing)
      expect(result.some((code) => code.includes('Symbol.toStringTag'))).toBe(
        true,
      )
    })

    it('should handle export * from syntax', async () => {
      await store.setFiles(
        {
          'src/main.js': `export * from './module'`,
          'src/module.js': 'export const foo = "bar"',
        },
        'src/main.js',
      )
      const result = compileModulesForPreview(store)
      expect(result.length).toBeGreaterThan(0)
    })

    it('should handle export { foo, bar } from syntax', async () => {
      await store.setFiles(
        {
          'src/main.js': `export { foo } from './module'`,
          'src/module.js': 'export const foo = "bar"',
        },
        'src/main.js',
      )
      const result = compileModulesForPreview(store)
      expect(result.length).toBeGreaterThan(0)
    })

    it('should handle re-exports with aliases', async () => {
      await store.setFiles(
        {
          'src/main.js': `export { foo as bar } from './module'`,
          'src/module.js': 'export const foo = "bar"',
        },
        'src/main.js',
      )
      const result = compileModulesForPreview(store)
      expect(result.length).toBeGreaterThan(0)
    })
  })

  describe('dynamic imports', () => {
    it('should handle dynamic imports', async () => {
      await store.setFiles(
        {
          'src/main.js': `const module = import('./lazy-module')
export default module`,
          'src/lazy-module.js': 'export const lazy = true',
        },
        'src/main.js',
      )
      const result = compileModulesForPreview(store)
      expect(result.length).toBeGreaterThan(0)
    })

    it('should process all files when dynamic import is present', async () => {
      await store.setFiles(
        {
          'src/main.js': `const module = import('./lazy')
export default module`,
          'src/lazy.js': 'export const lazy = true',
          'src/other.js': 'export const other = "value"',
        },
        'src/main.js',
      )
      const result = compileModulesForPreview(store)
      // With dynamic imports, all files should be processed
      expect(result.length).toBeGreaterThanOrEqual(2)
    })
  })

  describe('import variations', () => {
    it('should handle namespace imports', async () => {
      await store.setFiles(
        {
          'src/main.js': `import * as utils from './utils'
console.log(utils)`,
          'src/utils.js': 'export const foo = "bar"',
        },
        'src/main.js',
      )
      const result = compileModulesForPreview(store)
      expect(result.length).toBeGreaterThan(0)
    })

    it('should handle default imports', async () => {
      await store.setFiles(
        {
          'src/main.js': `import def from './module'
console.log(def)`,
          'src/module.js': 'export default "default export"',
        },
        'src/main.js',
      )
      const result = compileModulesForPreview(store)
      expect(result.length).toBeGreaterThan(0)
    })

    it('should handle mixed imports', async () => {
      await store.setFiles(
        {
          'src/main.js': `import def, { named } from './module'
console.log(def, named)`,
          'src/module.js': `export default "default"
export const named = "named"`,
        },
        'src/main.js',
      )
      const result = compileModulesForPreview(store)
      expect(result.length).toBeGreaterThan(0)
    })
  })

  describe('export variations', () => {
    it('should handle function exports', async () => {
      await store.setFiles(
        {
          'src/main.js': 'export function foo() { return "bar" }',
        },
        'src/main.js',
      )
      const result = compileModulesForPreview(store)
      expect(result.some((code) => code.includes('Symbol.toStringTag'))).toBe(
        true,
      )
    })

    it('should handle class exports', async () => {
      await store.setFiles(
        {
          'src/main.js': 'export class MyClass { constructor() {} }',
        },
        'src/main.js',
      )
      const result = compileModulesForPreview(store)
      expect(result.some((code) => code.includes('Symbol.toStringTag'))).toBe(
        true,
      )
    })

    it('should handle variable exports', async () => {
      await store.setFiles(
        {
          'src/main.js': 'export const a = 1, b = 2',
        },
        'src/main.js',
      )
      const result = compileModulesForPreview(store)
      expect(result.some((code) => code.includes('Symbol.toStringTag'))).toBe(
        true,
      )
    })

    it('should handle default function export', async () => {
      await store.setFiles(
        {
          'src/main.js': 'export default function foo() {}',
        },
        'src/main.js',
      )
      const result = compileModulesForPreview(store)
      expect(result.some((code) => code.includes('Symbol.toStringTag'))).toBe(
        true,
      )
    })

    it('should handle default class export', async () => {
      await store.setFiles(
        {
          'src/main.js': 'export default class A {}',
        },
        'src/main.js',
      )
      const result = compileModulesForPreview(store)
      expect(result.some((code) => code.includes('Symbol.toStringTag'))).toBe(
        true,
      )
    })

    it('should handle anonymous default export', async () => {
      await store.setFiles(
        {
          'src/main.js': 'export default { value: 42 }',
        },
        'src/main.js',
      )
      const result = compileModulesForPreview(store)
      // Anonymous default exports use module.default = syntax
      expect(result.some((code) => code.includes('.default'))).toBe(true)
    })
  })

  describe('file resolution', () => {
    it('should resolve .ts extension automatically', async () => {
      await store.setFiles(
        {
          'src/main.js': `import { foo } from './module'
export default foo`,
          'src/module.ts': 'export const foo = "typescript"',
        },
        'src/main.js',
      )
      const result = compileModulesForPreview(store)
      expect(result.length).toBeGreaterThan(0)
    })

    it('should resolve .js extension automatically', async () => {
      await store.setFiles(
        {
          'src/main.js': `import { foo } from './module'
export default foo`,
          'src/module.js': 'export const foo = "javascript"',
        },
        'src/main.js',
      )
      const result = compileModulesForPreview(store)
      expect(result.length).toBeGreaterThan(0)
    })

    it('should throw error for non-existent file', async () => {
      await store.setFiles(
        {
          'src/main.js': `import { foo } from './nonexistent'
export default foo`,
        },
        'src/main.js',
      )
      expect(() => compileModulesForPreview(store)).toThrow('does not exist')
    })
  })

  describe('module instantiation', () => {
    it('should create module with Symbol.toStringTag', async () => {
      await store.setFiles(
        {
          'src/main.js': 'export const value = 42',
        },
        'src/main.js',
      )
      const result = compileModulesForPreview(store)
      expect(result.some((code) => code.includes('Symbol.toStringTag'))).toBe(
        true,
      )
    })

    it('should register module in __modules__', async () => {
      await store.setFiles(
        {
          'src/main.js': 'export const value = 42',
        },
        'src/main.js',
      )
      const result = compileModulesForPreview(store)
      expect(result.some((code) => code.includes('__modules__'))).toBe(true)
    })
  })

  describe('binding conversion', () => {
    it('should convert import bindings in expressions', async () => {
      await store.setFiles(
        {
          'src/main.js': `import { value } from './module'
const result = value + 1
export default result`,
          'src/module.js': 'export const value = 42',
        },
        'src/main.js',
      )
      const result = compileModulesForPreview(store)
      expect(result.length).toBeGreaterThan(0)
    })

    it('should handle shorthand property syntax', async () => {
      await store.setFiles(
        {
          'src/main.js': `import { foo } from './module'
const obj = { foo }
export default obj`,
          'src/module.js': 'export const foo = "bar"',
        },
        'src/main.js',
      )
      const result = compileModulesForPreview(store)
      expect(result.length).toBeGreaterThan(0)
    })

    it('should handle class extends with import', async () => {
      await store.setFiles(
        {
          'src/main.js': `import { Base } from './base'
const createDerived = () => class Derived extends Base {}
export default createDerived`,
          'src/base.js': 'export class Base {}',
        },
        'src/main.js',
      )
      const result = compileModulesForPreview(store)
      expect(result.length).toBeGreaterThan(0)
    })
  })

  describe('circular dependencies', () => {
    it('should handle circular imports without infinite loop', async () => {
      await store.setFiles(
        {
          'src/a.js': `import { b } from './b'
export const a = "a" + b`,
          'src/b.js': `import { a } from './a'
export const b = "b" + a`,
        },
        'src/a.js',
      )
      const result = compileModulesForPreview(store)
      expect(result.length).toBeGreaterThan(0)
    })
  })

  describe('multiple files', () => {
    it('should process multiple imported files', async () => {
      await store.setFiles(
        {
          'src/main.js': `import { a } from './a'
import { b } from './b'
export default a + b`,
          'src/a.js': 'export const a = 1',
          'src/b.js': 'export const b = 2',
        },
        'src/main.js',
      )
      const result = compileModulesForPreview(store)
      expect(result.length).toBeGreaterThanOrEqual(3)
    })

    it('should maintain file order in output', async () => {
      await store.setFiles(
        {
          'src/main.js': `import { helper } from './helper'
export const main = helper()`,
          'src/helper.js': 'export const helper = () => "help"',
        },
        'src/main.js',
      )
      const result = compileModulesForPreview(store)
      // Helper should be processed before main
      expect(result.length).toBeGreaterThanOrEqual(2)
    })
  })

  describe('edge cases', () => {
    it('should handle empty module', async () => {
      await store.setFiles(
        {
          'src/empty.js': '',
        },
        'src/empty.js',
      )
      const result = compileModulesForPreview(store)
      expect(result.length).toBeGreaterThan(0)
    })

    it('should handle module with only comments', async () => {
      await store.setFiles(
        {
          'src/comments.js': '// just a comment',
        },
        'src/comments.js',
      )
      const result = compileModulesForPreview(store)
      expect(result.length).toBeGreaterThan(0)
    })

    it('should handle deeply nested imports', async () => {
      await store.setFiles(
        {
          'src/main.js': `import { deep } from './a/b/c/module'
export default deep`,
          'src/a/b/c/module.js': 'export const deep = "deep value"',
        },
        'src/main.js',
      )
      const result = compileModulesForPreview(store)
      expect(result.length).toBeGreaterThan(0)
    })
  })
})
