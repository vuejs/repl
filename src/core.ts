export {
  useStore,
  File,
  type SFCOptions,
  type StoreState,
  type Store,
  type ReplStore,
} from './store'
export { useVueImportMap, mergeImportMap, type ImportMap } from './import-map'
export { compileFile } from './transform'
export type { Props as ReplProps } from './Repl.vue'
export type { SandboxProps } from './output/Sandbox.vue'
export type { OutputModes } from './types'
export { version as languageToolsVersion } from '@vue/language-service/package.json'
