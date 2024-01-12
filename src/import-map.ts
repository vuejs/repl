import { computed, version as currentVersion, ref } from 'vue'

export function useVueImportMap(
  defaults: {
    runtimeDev?: string
    runtimeProd?: string
    serverRenderer?: string
  } = {},
) {
  const productionMode = ref(false)
  const vueVersion = ref<string | undefined>()
  const importMap = computed<ImportMap>(() => {
    const vue =
      (!vueVersion.value &&
        (productionMode.value ? defaults.runtimeProd : defaults.runtimeDev)) ||
      `https://cdn.jsdelivr.net/npm/@vue/runtime-dom@${
        vueVersion.value || currentVersion
      }/dist/runtime-dom.esm-browser${productionMode.value ? `.prod` : ``}.js`

    const serverRenderer =
      (!vueVersion.value && defaults.serverRenderer) ||
      `https://cdn.jsdelivr.net/npm/@vue/server-renderer@${
        vueVersion.value || currentVersion
      }/dist/server-renderer.esm-browser.js`
    return {
      imports: {
        vue,
        'vue/server-renderer': serverRenderer,
      },
    }
  })

  return {
    productionMode,
    vueVersion,
    importMap,
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
