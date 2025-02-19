import {
  type ToRefs,
  type UnwrapRef,
  computed,
  reactive,
  ref,
  shallowRef,
  watch,
  watchEffect,
} from 'vue'
import * as defaultCompiler from 'vue/compiler-sfc'
import { compileFile } from './transform'
import { atou, utoa } from './utils'
import type {
  SFCAsyncStyleCompileOptions,
  SFCScriptCompileOptions,
  SFCTemplateCompileOptions,
} from 'vue/compiler-sfc'
import type { OutputModes } from './types'
import type { editor } from 'monaco-editor-core'
import { type ImportMap, mergeImportMap, useVueImportMap } from './import-map'

import welcomeSFCCode from './template/welcome.vue?raw'
import newSFCCode from './template/new-sfc.vue?raw'

export const importMapFile = 'import-map.json'
export const tsconfigFile = 'tsconfig.json'

export function useStore(
  {
    files = ref(Object.create(null)),
    activeFilename = undefined!, // set later
    mainFile = ref('src/App.vue'),
    template = ref({
      welcomeSFC: welcomeSFCCode,
      newSFC: newSFCCode,
    }),
    builtinImportMap = undefined!, // set later

    errors = ref([]),
    showOutput = ref(false),
    outputMode = ref('preview'),
    sfcOptions = ref({}),
    compiler = shallowRef(defaultCompiler),
    vueVersion = ref(null),

    locale = ref(),
    typescriptVersion = ref('latest'),
    dependencyVersion = ref(Object.create(null)),
    reloadLanguageTools = ref(),
  }: Partial<StoreState> = {},
  serializedState?: string,
): ReplStore {
  if (!builtinImportMap) {
    ;({ importMap: builtinImportMap, vueVersion } = useVueImportMap({
      vueVersion: vueVersion.value,
    }))
  }
  const loading = ref(false)

  function applyBuiltinImportMap() {
    const importMap = mergeImportMap(builtinImportMap.value, getImportMap())
    setImportMap(importMap)
  }

  function init() {
    watchEffect(() => {
      compileFile(store, activeFile.value).then((errs) => (errors.value = errs))
    })

    watch(
      () => [
        files.value[tsconfigFile]?.code,
        typescriptVersion.value,
        locale.value,
        dependencyVersion.value,
        vueVersion.value,
      ],
      () => reloadLanguageTools.value?.(),
      { deep: true },
    )

    watch(
      builtinImportMap,
      () => {
        setImportMap(mergeImportMap(getImportMap(), builtinImportMap.value))
      },
      { deep: true },
    )

    watch(
      vueVersion,
      async (version) => {
        if (version) {
          const compilerUrl = `https://cdn.jsdelivr.net/npm/@vue/compiler-sfc@${version}/dist/compiler-sfc.esm-browser.js`
          loading.value = true
          compiler.value = await import(/* @vite-ignore */ compilerUrl).finally(
            () => (loading.value = false),
          )
          console.info(`[@vue/repl] Now using Vue version: ${version}`)
        } else {
          // reset to default
          compiler.value = defaultCompiler
          console.info(`[@vue/repl] Now using default Vue version`)
        }
      },
      { immediate: true },
    )

    watch(
      sfcOptions,
      () => {
        sfcOptions.value.script ||= {}
        sfcOptions.value.script.fs = {
          fileExists(file: string) {
            if (file.startsWith('/')) file = file.slice(1)
            return !!store.files[file]
          },
          readFile(file: string) {
            if (file.startsWith('/')) file = file.slice(1)
            return store.files[file].code
          },
        }
      },
      { immediate: true },
    )

    // init tsconfig
    if (!files.value[tsconfigFile]) {
      files.value[tsconfigFile] = new File(
        tsconfigFile,
        JSON.stringify(tsconfig, undefined, 2),
      )
    }

    // compile rest of the files
    errors.value = []
    for (const [filename, file] of Object.entries(files.value)) {
      if (filename !== mainFile.value) {
        compileFile(store, file).then((errs) => errors.value.push(...errs))
      }
    }
  }

  function setImportMap(map: ImportMap, merge = false) {
    if (merge) {
      map = mergeImportMap(getImportMap(), map)
    }

    if (map.imports)
      for (const [key, value] of Object.entries(map.imports)) {
        if (value) {
          map.imports![key] = fixURL(value)
        }
      }

    const code = JSON.stringify(map, undefined, 2)
    if (files.value[importMapFile]) {
      files.value[importMapFile].code = code
    } else {
      files.value[importMapFile] = new File(importMapFile, code)
    }
  }

  const setActive: Store['setActive'] = (filename) => {
    activeFilename.value = filename
  }
  const addFile: Store['addFile'] = (fileOrFilename) => {
    let file: File
    if (typeof fileOrFilename === 'string') {
      file = new File(
        fileOrFilename,
        fileOrFilename.endsWith('.vue') ? template.value.newSFC : '',
      )
    } else {
      file = fileOrFilename
    }
    files.value[file.filename] = file
    if (!file.hidden) setActive(file.filename)
  }
  const deleteFile: Store['deleteFile'] = (filename) => {
    if (
      !confirm(`Are you sure you want to delete ${stripSrcPrefix(filename)}?`)
    ) {
      return
    }

    if (activeFilename.value === filename) {
      activeFilename.value = mainFile.value
    }
    delete files.value[filename]
  }
  const renameFile: Store['renameFile'] = (oldFilename, newFilename) => {
    const file = files.value[oldFilename]

    if (!file) {
      errors.value = [`Could not rename "${oldFilename}", file not found`]
      return
    }

    if (!newFilename || oldFilename === newFilename) {
      errors.value = [`Cannot rename "${oldFilename}" to "${newFilename}"`]
      return
    }

    file.filename = newFilename
    const newFiles: Record<string, File> = {}

    // Preserve iteration order for files
    for (const [name, file] of Object.entries(files.value)) {
      if (name === oldFilename) {
        newFiles[newFilename] = file
      } else {
        newFiles[name] = file
      }
    }

    files.value = newFiles

    if (mainFile.value === oldFilename) {
      mainFile.value = newFilename
    }
    if (activeFilename.value === oldFilename) {
      activeFilename.value = newFilename
    } else {
      compileFile(store, file).then((errs) => (errors.value = errs))
    }
  }
  const getImportMap: Store['getImportMap'] = () => {
    try {
      return JSON.parse(files.value[importMapFile].code)
    } catch (e) {
      errors.value = [
        `Syntax error in ${importMapFile}: ${(e as Error).message}`,
      ]
      return {}
    }
  }
  const getTsConfig: Store['getTsConfig'] = () => {
    try {
      return JSON.parse(files.value[tsconfigFile].code)
    } catch {
      return {}
    }
  }
  const serialize: ReplStore['serialize'] = () => {
    const files = getFiles()
    const importMap = files[importMapFile]
    if (importMap) {
      const parsed = JSON.parse(importMap)
      const builtin = builtinImportMap.value.imports || {}

      if (parsed.imports) {
        for (const [key, value] of Object.entries(parsed.imports)) {
          if (builtin[key] === value) {
            delete parsed.imports[key]
          }
        }
        if (parsed.imports && !Object.keys(parsed.imports).length) {
          delete parsed.imports
        }
      }
      if (parsed.scopes && !Object.keys(parsed.scopes).length) {
        delete parsed.scopes
      }
      if (Object.keys(parsed).length) {
        files[importMapFile] = JSON.stringify(parsed, null, 2)
      } else {
        delete files[importMapFile]
      }
    }
    if (vueVersion.value) files._version = vueVersion.value
    if (typescriptVersion.value !== 'latest' || files._tsVersion) {
      files._tsVersion = typescriptVersion.value
    }
    return '#' + utoa(JSON.stringify(files))
  }
  const deserialize: ReplStore['deserialize'] = (
    serializedState: string,
    checkBuiltinImportMap = true,
  ) => {
    if (serializedState.startsWith('#'))
      serializedState = serializedState.slice(1)
    let saved: any
    try {
      saved = JSON.parse(atou(serializedState))
    } catch (err) {
      console.error(err)
      alert('Failed to load code from URL.')
      return setDefaultFile()
    }
    for (const filename in saved) {
      if (filename === '_version') {
        vueVersion.value = saved[filename]
      } else if (filename === '_tsVersion') {
        typescriptVersion.value = saved[filename]
      } else {
        setFile(files.value, filename, saved[filename])
      }
    }
    if (checkBuiltinImportMap) {
      applyBuiltinImportMap()
    }
  }
  const getFiles: ReplStore['getFiles'] = () => {
    const exported: Record<string, string> = {}
    for (const [filename, file] of Object.entries(files.value)) {
      const normalized = stripSrcPrefix(filename)
      exported[normalized] = file.code
    }
    return exported
  }
  const setFiles: ReplStore['setFiles'] = async (
    newFiles,
    mainFile = store.mainFile,
  ) => {
    const files: Record<string, File> = Object.create(null)

    mainFile = addSrcPrefix(mainFile)
    if (!newFiles[mainFile]) {
      setFile(files, mainFile, template.value.welcomeSFC || welcomeSFCCode)
    }
    for (const [filename, file] of Object.entries(newFiles)) {
      setFile(files, filename, file)
    }

    const errors = []
    for (const file of Object.values(files)) {
      errors.push(...(await compileFile(store, file)))
    }

    store.mainFile = mainFile
    store.files = files
    store.errors = errors
    applyBuiltinImportMap()
    setActive(store.mainFile)
  }
  const setDefaultFile = (): void => {
    setFile(
      files.value,
      mainFile.value,
      template.value.welcomeSFC || welcomeSFCCode,
    )
  }

  if (serializedState) {
    deserialize(serializedState, false)
  } else {
    setDefaultFile()
  }
  if (!files.value[mainFile.value]) {
    mainFile.value = Object.keys(files.value)[0]
  }
  activeFilename ||= ref(mainFile.value)
  const activeFile = computed(() => files.value[activeFilename.value])

  applyBuiltinImportMap()

  const store: ReplStore = reactive({
    files,
    activeFile,
    activeFilename,
    mainFile,
    template,
    builtinImportMap,

    errors,
    showOutput,
    outputMode,
    sfcOptions,
    compiler,
    loading,
    vueVersion,

    locale,
    typescriptVersion,
    dependencyVersion,
    reloadLanguageTools,

    init,
    setActive,
    addFile,
    deleteFile,
    renameFile,
    getImportMap,
    setImportMap,
    getTsConfig,
    serialize,
    deserialize,
    getFiles,
    setFiles,
  })
  return store
}

const tsconfig = {
  compilerOptions: {
    allowJs: true,
    checkJs: true,
    jsx: 'Preserve',
    target: 'ESNext',
    module: 'ESNext',
    moduleResolution: 'Bundler',
    allowImportingTsExtensions: true,
  },
  vueCompilerOptions: {
    target: 3.4,
  },
}

export interface SFCOptions {
  script?: Partial<SFCScriptCompileOptions>
  style?: Partial<SFCAsyncStyleCompileOptions>
  template?: Partial<SFCTemplateCompileOptions>
}

export type StoreState = ToRefs<{
  files: Record<string, File>
  activeFilename: string
  mainFile: string
  template: {
    welcomeSFC?: string
    newSFC?: string
  }
  builtinImportMap: ImportMap

  // output
  errors: (string | Error)[]
  showOutput: boolean
  outputMode: OutputModes
  sfcOptions: SFCOptions
  /** `@vue/compiler-sfc` */
  compiler: typeof defaultCompiler
  /* only apply for compiler-sfc */
  vueVersion: string | null

  // volar-related
  locale: string | undefined
  typescriptVersion: string
  /** \{ dependencyName: version \} */
  dependencyVersion: Record<string, string>
  reloadLanguageTools?: (() => void) | undefined
}>

export interface ReplStore extends UnwrapRef<StoreState> {
  activeFile: File
  /** Loading compiler */
  loading: boolean
  init(): void
  setActive(filename: string): void
  addFile(filename: string | File): void
  deleteFile(filename: string): void
  renameFile(oldFilename: string, newFilename: string): void
  getImportMap(): ImportMap
  setImportMap(map: ImportMap, merge?: boolean): void
  getTsConfig(): Record<string, any>
  serialize(): string
  /**
   * Deserializes the given string to restore the REPL store state.
   * @param serializedState - The serialized state string.
   * @param checkBuiltinImportMap - Whether to check the built-in import map. Default to true
   */
  deserialize(serializedState: string, checkBuiltinImportMap?: boolean): void
  getFiles(): Record<string, string>
  setFiles(newFiles: Record<string, string>, mainFile?: string): Promise<void>
}

export type Store = Pick<
  ReplStore,
  | 'files'
  | 'activeFile'
  | 'mainFile'
  | 'errors'
  | 'showOutput'
  | 'outputMode'
  | 'sfcOptions'
  | 'compiler'
  | 'vueVersion'
  | 'locale'
  | 'typescriptVersion'
  | 'dependencyVersion'
  | 'reloadLanguageTools'
  | 'init'
  | 'setActive'
  | 'addFile'
  | 'deleteFile'
  | 'renameFile'
  | 'getImportMap'
  | 'getTsConfig'
>

export class File {
  compiled = {
    js: '',
    css: '',
    ssr: '',
  }
  editorViewState: editor.ICodeEditorViewState | null = null

  constructor(
    public filename: string,
    public code = '',
    public hidden = false,
  ) {}

  get language() {
    if (this.filename.endsWith('.vue')) {
      return 'vue'
    }
    if (this.filename.endsWith('.html')) {
      return 'html'
    }
    if (this.filename.endsWith('.css')) {
      return 'css'
    }
    if (this.filename.endsWith('.ts')) {
      return 'typescript'
    }
    return 'javascript'
  }
}

function addSrcPrefix(file: string) {
  return file === importMapFile ||
    file === tsconfigFile ||
    file.startsWith('src/')
    ? file
    : `src/${file}`
}

export function stripSrcPrefix(file: string) {
  return file.replace(/^src\//, '')
}

function fixURL(url: string) {
  return url.replace('https://sfc.vuejs', 'https://play.vuejs')
}

function setFile(
  files: Record<string, File>,
  filename: string,
  content: string,
) {
  const normalized = addSrcPrefix(filename)
  files[normalized] = new File(normalized, content)
}
