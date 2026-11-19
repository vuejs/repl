import { computed, version as currentVersion, ref } from 'vue'

type DynamicGenPath = (version: string, productionMode: boolean) => string

export function getVersions(version: string): number[] {
  return version.split('.').map((v) => parseInt(v, 10))
}

export function isVaporSupported(version: string): boolean{
  const [major, minor] = getVersions(version)
  // vapor mode is supported in v3.6+
  return major > 3 || (major === 3 && minor >= 6)
}

export function useVueImportMap(
  defaults: {
    runtimeDev?: string | DynamicGenPath
    runtimeProd?: string | DynamicGenPath
    serverRenderer?: string | DynamicGenPath
    vueVersion?: string | null
  } = {},
) {
  function normalizePath(defaults?: string | DynamicGenPath) {
    if (!defaults) return

    const version = vueVersion.value
    const defaultIsStr = typeof defaults === 'string' 
    return !defaultIsStr ? defaults(version || currentVersion, productionMode.value) : (!version && defaults || undefined)
  }

  const productionMode = ref(false)
  const vueVersion = ref<string | null>(defaults.vueVersion || null)

  function getVueURL() {
    const version = vueVersion.value || currentVersion
    return isVaporSupported(version)
      ? `https://cdn.jsdelivr.net/npm/vue@${version}/dist/vue.runtime-with-vapor.esm-browser${productionMode.value ? `.prod` : ``}.js`
      : `https://cdn.jsdelivr.net/npm/@vue/runtime-dom@${version}/dist/runtime-dom.esm-browser${productionMode.value ? `.prod` : ``}.js`
  }

  const importMap = computed<ImportMap>(() => {
    const vue =
      normalizePath(
        productionMode.value ? defaults.runtimeProd : defaults.runtimeDev,
      ) ||
      getVueURL()

    const serverRenderer =
      normalizePath(defaults.serverRenderer) ||
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
