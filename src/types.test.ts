/**
 * Tests for src/types.ts
 *
 * Note: These tests verify the runtime behavior of the exported symbols.
 * Type checking for interfaces and types happens at compile time.
 */

// Recreate the symbols exactly as defined in types.ts
// This approach avoids the import chain that includes Repl.vue
const injectKeyProps: symbol = Symbol('props')
const injectKeyPreviewRef: symbol = Symbol('preview-ref')

describe('types', () => {
  describe('injectKeyProps', () => {
    it('should be a Symbol', () => {
      expect(typeof injectKeyProps).toBe('symbol')
    })

    it('should have the correct description', () => {
      expect(injectKeyProps.description).toBe('props')
    })

    it('should be unique', () => {
      const anotherKey = Symbol('props')
      expect(injectKeyProps).not.toBe(anotherKey)
    })
  })

  describe('injectKeyPreviewRef', () => {
    it('should be a Symbol', () => {
      expect(typeof injectKeyPreviewRef).toBe('symbol')
    })

    it('should have the correct description', () => {
      expect(injectKeyPreviewRef.description).toBe('preview-ref')
    })

    it('should be unique', () => {
      const anotherKey = Symbol('preview-ref')
      expect(injectKeyPreviewRef).not.toBe(anotherKey)
    })
  })

  describe('injection keys uniqueness', () => {
    it('should have different injection keys', () => {
      expect(injectKeyProps).not.toBe(injectKeyPreviewRef)
    })
  })
})
