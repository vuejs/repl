import type { UserConfig } from '@unocss/core'
import { $fetch } from 'ofetch'

const AsyncFunction = Object.getPrototypeOf(async () => {}).constructor

const CDN_BASE = 'https://esm.sh/'

type ModuleCache = Map<string, Promise<unknown> | unknown>

const globalCache: ModuleCache = new Map()

export function clearGlobalModuleCache() {
  globalCache.clear()
}

export async function evaluateUserConfig<U = UserConfig>(
  configStr: string,
  version: string = 'latest',
): Promise<U | undefined> {
  const modulesCache = globalCache
  const moduleMap =
    version === 'latest'
      ? unocssBundle
      : new Map(
          unocssBundle
            .keys()
            .map((p) => [
              p,
              () => import(/* @vite-ignore */ `https://esm.sh/${p}@${version}`),
            ]),
        )

  const code = configStr
    .replace(
      /import\s(.*?)\sfrom\s*(['"])unocss\2/g,
      'const $1 = await __import("unocss");',
    )
    .replace(
      /import\s*(\{[\s\S]*?\})\s*from\s*(['"])([\w@/-]+)\2/g,
      'const $1 = await __import("$3");',
    )
    .replace(
      /import\s(.*?)\sfrom\s*(['"])([\w@/-]+)\2/g,
      'const $1 = (await __import("$3")).default;',
    )
    .replace(/export default /, 'return ')
    .replace(/\bimport\s*\(/, '__import(')

  // bypass vite interop
  // eslint-disable-next-line no-new-func
  const _import = new Function('a', 'return import(a);')
  const __import = (name: string): any => {
    if (!modulesCache.has(name)) {
      modulesCache.set(
        name,
        moduleMap.has(name)
          ? moduleMap.get(name)!()
          : name.endsWith('.json')
            ? $fetch(CDN_BASE + name, { responseType: 'json' }).then((r) => ({
                default: r,
              }))
            : _import(CDN_BASE + name),
      )
    }
    return modulesCache.get(name)
  }

  const fn = new AsyncFunction('__import', code)
  const result = await fn(__import)

  if (result) return result
}

const unocssBundle = new Map([
  ['@unocss/autocomplete', () => import('@unocss/autocomplete')] as any,
  ['@unocss/core', () => import('@unocss/core')] as any,
  [
    '@unocss/extractor-arbitrary-variants',
    () => import('@unocss/extractor-arbitrary-variants'),
  ] as any,
  ['@unocss/rule-utils', () => import('@unocss/rule-utils')] as any,
  [
    '@unocss/transformer-attributify-jsx',
    () => import('@unocss/transformer-attributify-jsx'),
  ] as any,
  [
    '@unocss/transformer-compile-class',
    () => import('@unocss/transformer-compile-class'),
  ] as any,
  [
    '@unocss/transformer-directives',
    () => import('@unocss/transformer-directives'),
  ] as any,
  [
    '@unocss/transformer-variant-group',
    () => import('@unocss/transformer-variant-group'),
  ] as any,
  ['unocss', () => import('unocss')] as any,
]) as Map<string, () => Promise<any>>
