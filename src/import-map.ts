import { computed, version as currentVersion, ref } from 'vue'

export function useVueImportMap(
  defaults: {
    runtimeDev?: string | (() => string)
    runtimeProd?: string | (() => string)
    serverRenderer?: string | (() => string)
    vueVersion?: string | null
  } = {},
) {
  function normalizeDefaults(defaults?: string | (() => string)) {
    if (!defaults) return
    return typeof defaults === 'string' ? defaults : defaults()
  }

  const productionMode = ref(false)
  const vueVersion = ref<string | null>(defaults.vueVersion || null)
  const importMap = computed<ImportMap>(() => {
    const vue =
      (!vueVersion.value &&
        normalizeDefaults(
          productionMode.value ? defaults.runtimeProd : defaults.runtimeDev,
        )) ||
      `https://esmsh.factset.io/vue@${vueVersion.value || currentVersion}`

    return {
      imports: {
        vue,
        '@fds/fusion':
          'https://esmsh.factset.io/@fds/fusion?standalone&external=vue',
        '@fds/': 'https://esmsh.factset.io/@fds/',
      },
    }
  })

  return {
    productionMode,
    importMap,
    vueVersion,
    defaultVersion: currentVersion,
  }
}

export interface ImportMap {
  imports?: Record<string, string | undefined>
  scopes?: Record<string, Record<string, string>>
}

export function mergeImportMap(a: ImportMap, b: ImportMap): ImportMap {
  return {
    imports: { ...a.imports, ...b.imports },
    scopes: { ...a.scopes, ...b.scopes },
  }
}
