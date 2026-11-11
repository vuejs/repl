import {
  getVersions,
  isVaporSupported,
  useVueImportMap,
  mergeImportMap,
} from './import-map'
import { version as currentVersion } from 'vue'

describe('getVersions', () => {
  it('should parse version string into number array', () => {
    expect(getVersions('3.4.0')).toEqual([3, 4, 0])
  })

  it('should handle two-part version', () => {
    expect(getVersions('3.6')).toEqual([3, 6])
  })

  it('should handle single version', () => {
    expect(getVersions('3')).toEqual([3])
  })

  it('should handle version with extra parts', () => {
    expect(getVersions('3.4.5.6')).toEqual([3, 4, 5, 6])
  })
})

describe('isVaporSupported', () => {
  it('should return true for version 3.6', () => {
    expect(isVaporSupported('3.6.0')).toBe(true)
  })

  it('should return true for version greater than 3.6', () => {
    expect(isVaporSupported('3.7.0')).toBe(true)
    expect(isVaporSupported('4.0.0')).toBe(true)
  })

  it('should return false for version less than 3.6', () => {
    expect(isVaporSupported('3.5.0')).toBe(false)
    expect(isVaporSupported('3.0.0')).toBe(false)
    expect(isVaporSupported('2.7.0')).toBe(false)
  })
})

describe('useVueImportMap', () => {
  it('should return default structure with current version', () => {
    const { productionMode, importMap, vueVersion, defaultVersion } =
      useVueImportMap()

    expect(productionMode.value).toBe(false)
    expect(vueVersion.value).toBe(null)
    expect(defaultVersion).toBe(currentVersion)
    expect(importMap.value.imports).toBeDefined()
    expect(importMap.value.imports?.vue).toBeDefined()
    expect(importMap.value.imports?.['vue/server-renderer']).toBeDefined()
  })

  it('should use runtimeDev default when provided and no vueVersion', () => {
    const { importMap } = useVueImportMap({
      runtimeDev: 'https://custom.dev/vue.js',
    })

    expect(importMap.value.imports?.vue).toBe('https://custom.dev/vue.js')
  })

  it('should use runtimeProd default when provided and productionMode is true', () => {
    const { productionMode, importMap } = useVueImportMap({
      runtimeProd: 'https://custom.prod/vue.js',
    })

    productionMode.value = true

    expect(importMap.value.imports?.vue).toBe('https://custom.prod/vue.js')
  })

  it('should use serverRenderer default when provided and no vueVersion', () => {
    const { importMap } = useVueImportMap({
      serverRenderer: 'https://custom.server/renderer.js',
    })

    expect(importMap.value.imports?.['vue/server-renderer']).toBe(
      'https://custom.server/renderer.js',
    )
  })

  it('should use vueVersion from defaults', () => {
    const { vueVersion, importMap } = useVueImportMap({
      vueVersion: '3.5.0',
    })

    expect(vueVersion.value).toBe('3.5.0')
    expect(importMap.value.imports?.vue).toContain('3.5.0')
  })

  it('should generate CDN URL for version < 3.6', () => {
    const { vueVersion, importMap } = useVueImportMap({
      vueVersion: '3.4.0',
    })

    expect(vueVersion.value).toBe('3.4.0')
    expect(importMap.value.imports?.vue).toContain('@vue/runtime-dom')
    expect(importMap.value.imports?.vue).toContain('3.4.0')
    expect(importMap.value.imports?.vue).not.toContain('.prod')
  })

  it('should generate CDN URL with vapor for version >= 3.6', () => {
    const { vueVersion, importMap } = useVueImportMap({
      vueVersion: '3.6.0',
    })

    expect(vueVersion.value).toBe('3.6.0')
    expect(importMap.value.imports?.vue).toContain('vue.runtime-with-vapor')
    expect(importMap.value.imports?.vue).toContain('3.6.0')
  })

  it('should generate production URL when productionMode is true', () => {
    const { productionMode, importMap } = useVueImportMap({
      vueVersion: '3.6.0',
    })

    productionMode.value = true

    expect(importMap.value.imports?.vue).toContain('.prod.js')
  })

  it('should update importMap when vueVersion changes', () => {
    const { vueVersion, importMap } = useVueImportMap()

    vueVersion.value = '3.3.0'
    expect(importMap.value.imports?.vue).toContain('3.3.0')

    vueVersion.value = '3.7.0'
    expect(importMap.value.imports?.vue).toContain('3.7.0')
  })

  it('should use function defaults for runtimeDev', () => {
    const { importMap } = useVueImportMap({
      runtimeDev: () => 'https://dynamic.dev/vue.js',
    })

    expect(importMap.value.imports?.vue).toBe('https://dynamic.dev/vue.js')
  })

  it('should use function defaults for runtimeProd', () => {
    const { productionMode, importMap } = useVueImportMap({
      runtimeProd: () => 'https://dynamic.prod/vue.js',
    })

    productionMode.value = true

    expect(importMap.value.imports?.vue).toBe('https://dynamic.prod/vue.js')
  })

  it('should use function defaults for serverRenderer', () => {
    const { importMap } = useVueImportMap({
      serverRenderer: () => 'https://dynamic.server/renderer.js',
    })

    expect(importMap.value.imports?.['vue/server-renderer']).toBe(
      'https://dynamic.server/renderer.js',
    )
  })
})

describe('mergeImportMap', () => {
  it('should merge two import maps with imports', () => {
    const a: ImportMap = {
      imports: {
        vue: 'https://a/vue.js',
      },
    }
    const b: ImportMap = {
      imports: {
        'vue/server-renderer': 'https://b/renderer.js',
      },
    }

    const result = mergeImportMap(a, b)

    expect(result.imports?.vue).toBe('https://a/vue.js')
    expect(result.imports?.['vue/server-renderer']).toBe(
      'https://b/renderer.js',
    )
  })

  it('should merge two import maps with scopes', () => {
    const a: ImportMap = {
      scopes: {
        'https://a.com': { vue: 'https://a/vue.js' },
      },
    }
    const b: ImportMap = {
      scopes: {
        'https://b.com': { vue: 'https://b/vue.js' },
      },
    }

    const result = mergeImportMap(a, b)

    expect(result.scopes?.['https://a.com']?.vue).toBe('https://a/vue.js')
    expect(result.scopes?.['https://b.com']?.vue).toBe('https://b/vue.js')
  })

  it('should handle empty import maps', () => {
    const result = mergeImportMap({}, {})

    expect(result.imports).toEqual({})
    expect(result.scopes).toEqual({})
  })

  it('should override imports from first map with second map', () => {
    const a: ImportMap = {
      imports: {
        vue: 'https://a/vue.js',
      },
    }
    const b: ImportMap = {
      imports: {
        vue: 'https://b/vue.js',
      },
    }

    const result = mergeImportMap(a, b)

    expect(result.imports?.vue).toBe('https://b/vue.js')
  })
})

interface ImportMap {
  imports?: Record<string, string | undefined>
  scopes?: Record<string, Record<string, string>>
}
