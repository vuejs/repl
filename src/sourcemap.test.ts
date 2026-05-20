import { trimAnalyzedBindings, getSourceMap, toVisualizer } from './sourcemap'

describe('sourcemap', () => {
  describe('trimAnalyzedBindings', () => {
    it('should remove analyzed bindings comment from script code', () => {
      const input = `/* Analyzed bindings: { foo: "bar" } */
const x = 1`
      const expected = 'const x = 1'
      expect(trimAnalyzedBindings(input)).toBe(expected)
    })

    it('should handle multi-line analyzed bindings comment', () => {
      const input = `/* Analyzed bindings: {
  foo: "bar",
  baz: "qux"
} */
const x = 1`
      const expected = 'const x = 1'
      expect(trimAnalyzedBindings(input)).toBe(expected)
    })

    it('should return trimmed code when no comment present', () => {
      const input = `  const x = 1  `
      const expected = 'const x = 1'
      expect(trimAnalyzedBindings(input)).toBe(expected)
    })

    it('should return empty string for empty input', () => {
      expect(trimAnalyzedBindings('')).toBe('')
    })

    it('should return empty string for comment-only input', () => {
      const input = `/* Analyzed bindings: { foo: "bar" } */
`
      expect(trimAnalyzedBindings(input)).toBe('')
    })
  })

  describe('getSourceMap', () => {
    it('should return scriptMap when templateMap is not provided', () => {
      const scriptMap = {
        file: 'test.vue',
        sourceRoot: '',
        version: '3' as const,
        sources: ['test.vue'],
        sourcesContent: ['script content'],
        names: [],
        mappings: 'AAAA',
      }

      const result = getSourceMap(
        'test.vue',
        'script code',
        scriptMap,
        null as any,
      )
      expect(result).toEqual(scriptMap)
    })

    it('should return scriptMap when templateMap is undefined', () => {
      const scriptMap = {
        file: 'test.vue',
        sourceRoot: '',
        version: '3' as const,
        sources: ['test.vue'],
        sourcesContent: ['script content'],
        names: [],
        mappings: 'AAAA',
      }

      const result = getSourceMap(
        'test.vue',
        'script code',
        scriptMap,
        undefined as any,
      )
      expect(result).toEqual(scriptMap)
    })

    it('should merge scriptMap and templateMap when both are provided', () => {
      const scriptMap = {
        file: 'test.vue',
        sourceRoot: '',
        version: '3' as const,
        sources: ['test.vue'],
        sourcesContent: ['script content'],
        names: ['foo'],
        mappings: 'AAAA',
      }

      const templateMap = {
        file: 'test.vue',
        sourceRoot: '',
        version: '3' as const,
        sources: ['test.vue'],
        sourcesContent: ['template content'],
        names: ['bar'],
        mappings: 'AACA',
      }

      const scriptCode = 'const x = 1\nconst y = 2\n'

      const result = getSourceMap(
        'test.vue',
        scriptCode,
        scriptMap,
        templateMap,
      )
      expect(result).toBeDefined()
      expect(result.sourcesContent).toEqual(templateMap.sourcesContent)
    })

    it('should handle empty scriptMap when templateMap is provided', () => {
      const templateMap = {
        file: 'test.vue',
        sourceRoot: '',
        version: '3' as const,
        sources: ['test.vue'],
        sourcesContent: ['template content'],
        names: ['bar'],
        mappings: 'AACA',
      }

      const scriptCode = 'const x = 1\n'

      const result = getSourceMap(
        'test.vue',
        scriptCode,
        null as any,
        templateMap,
      )
      expect(result).toBeDefined()
      expect(result.sourcesContent).toEqual(templateMap.sourcesContent)
    })

    it('should offset template mappings by script line count', () => {
      const scriptMap = {
        file: 'test.vue',
        sourceRoot: '',
        version: '3' as const,
        sources: ['test.vue'],
        sourcesContent: ['script content'],
        names: [],
        mappings: 'AAAA',
      }

      const templateMap = {
        file: 'test.vue',
        sourceRoot: '',
        version: '3' as const,
        sources: ['test.vue'],
        sourcesContent: ['template content'],
        names: [],
        mappings: 'AAAA',
      }

      // Script with 3 newlines should offset template mappings by 3
      const scriptCode = 'const x = 1\nconst y = 2\nconst z = 3\n'

      const result = getSourceMap(
        'test.vue',
        scriptCode,
        scriptMap,
        templateMap,
      )
      expect(result).toBeDefined()
    })
  })

  describe('toVisualizer', () => {
    it('should generate a valid source-map-visualization URL', () => {
      const code = 'const x = 1'
      const sourceMap = {
        file: 'test.vue',
        sourceRoot: '',
        version: '3' as const,
        sources: ['test.vue'],
        sourcesContent: ['const x = 1'],
        names: [],
        mappings: 'AAAA',
      }

      const result = toVisualizer(code, sourceMap)
      expect(result).toMatch(
        /^https:\/\/evanw\.github\.io\/source-map-visualization#/,
      )
    })

    it('should generate different URLs for different code', () => {
      const sourceMap = {
        file: 'test.vue',
        sourceRoot: '',
        version: '3' as const,
        sources: ['test.vue'],
        sourcesContent: ['const x = 1'],
        names: [],
        mappings: 'AAAA',
      }

      const result1 = toVisualizer('const x = 1', sourceMap)
      const result2 = toVisualizer('const y = 2', sourceMap)
      expect(result1).not.toBe(result2)
    })

    it('should generate different URLs for different sourceMaps', () => {
      const code = 'const x = 1'
      const sourceMap1 = {
        file: 'test.vue',
        sourceRoot: '',
        version: '3' as const,
        sources: ['test.vue'],
        sourcesContent: ['const x = 1'],
        names: [],
        mappings: 'AAAA',
      }
      const sourceMap2 = {
        file: 'test.vue',
        sourceRoot: '',
        version: '3' as const,
        sources: ['test.vue'],
        sourcesContent: ['const x = 1'],
        names: [],
        mappings: 'AACA',
      }

      const result1 = toVisualizer(code, sourceMap1)
      const result2 = toVisualizer(code, sourceMap2)
      expect(result1).not.toBe(result2)
    })

    it('should handle empty code', () => {
      const sourceMap = {
        file: 'test.vue',
        sourceRoot: '',
        version: '3' as const,
        sources: ['test.vue'],
        sourcesContent: [''],
        names: [],
        mappings: '',
      }

      const result = toVisualizer('', sourceMap)
      expect(result).toMatch(
        /^https:\/\/evanw\.github\.io\/source-map-visualization#/,
      )
    })

    it('should handle empty mappings', () => {
      const code = 'const x = 1'
      const sourceMap = {
        file: 'test.vue',
        sourceRoot: '',
        version: '3' as const,
        sources: ['test.vue'],
        sourcesContent: ['const x = 1'],
        names: [],
        mappings: '',
      }

      const result = toVisualizer(code, sourceMap)
      expect(result).toMatch(
        /^https:\/\/evanw\.github\.io\/source-map-visualization#/,
      )
    })
  })
})
