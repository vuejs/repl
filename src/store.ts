import {
  type ToRefs,
  type UnwrapRef,
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
import { type ImportMap, mergeImportMap } from './import-map'

import welcomeSFCCode from './template/welcome.vue?raw'
import newSFCCode from './template/new-sfc.vue?raw'

export const importMapFile = 'import-map.json'
export const tsconfigFile = 'tsconfig.json'

export function useStore(
  {
    files = ref(Object.create(null)),
    activeFile = undefined!, // set later
    mainFile = ref('src/App.vue'),
    template = ref({
      welcomeSFC: welcomeSFCCode,
      newSFC: newSFCCode,
    }),
    builtinImportMap = ref({}),

    errors = ref([]),
    showOutput = ref(false),
    outputMode = ref('preview'),
    sfcOptions = ref({}),
    compiler = shallowRef(defaultCompiler),
    vueVersion = ref(),

    locale = ref(),
    typescriptVersion = ref('latest'),
    dependencyVersion = ref(Object.create(null)),
    reloadLanguageTools = ref(),
  }: Partial<StoreState> = {},
  serializedState?: string,
): ReplStore {
  function applyBuiltinImportMap() {
    const importMap = mergeImportMap(builtinImportMap.value, getImportMap())
    setImportMap(importMap)
  }

  function init() {
    watchEffect(() =>
      compileFile(store, activeFile.value).then(
        (errs) => (errors.value = errs),
      ),
    )

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
      { deep: true, immediate: true },
    )

    watch(vueVersion, async (version) => {
      if (version) {
        const compilerUrl = `https://cdn.jsdelivr.net/npm/@vue/compiler-sfc@${version}/dist/compiler-sfc.esm-browser.js`
        compiler.value = await import(/* @vite-ignore */ compilerUrl)
        console.info(`[@vue/repl] Now using Vue version: ${version}`)
      } else {
        // reset to default
        compiler.value = defaultCompiler
        console.info(`[@vue/repl] Now using default Vue version`)
      }
    })

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

  function setImportMap(map: ImportMap) {
    if (map.imports)
      for (const [key, value] of Object.entries(map.imports)) {
        if (value) {
          map.imports![key] = fixURL(value)
        }
      }
    files.value[importMapFile] = new File(
      importMapFile,
      JSON.stringify(map, undefined, 2),
    )
  }

  const setActive: Store['setActive'] = (filename) => {
    activeFile.value = files.value[filename]
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

    if (activeFile.value.filename === filename) {
      activeFile.value = files.value[mainFile.value]
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

    compileFile(store, file).then((errs) => (errors.value = errs))
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
    return '#' + utoa(JSON.stringify(files))
  }
  const deserialize: ReplStore['deserialize'] = (serializedState: string) => {
    if (serializedState.startsWith('#'))
      serializedState = serializedState.slice(1)
    const saved = JSON.parse(atou(serializedState))
    for (const filename in saved) {
      setFile(files.value, filename, saved[filename])
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

  if (serializedState) {
    deserialize(serializedState)
  } else {
    setFile(
      files.value,
      mainFile.value,
      template.value.welcomeSFC || welcomeSFCCode,
    )
  }
  if (!files.value[mainFile.value]) {
    mainFile.value = Object.keys(files.value)[0]
  }
  activeFile ||= ref(files.value[mainFile.value])

  applyBuiltinImportMap()

  const store: ReplStore = reactive({
    files,
    activeFile,
    mainFile,
    template,
    builtinImportMap,

    errors,
    showOutput,
    outputMode,
    sfcOptions,
    compiler,
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
  activeFile: File
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
  vueVersion: string | undefined

  // volar-related
  locale: string | undefined
  typescriptVersion: string
  /** \{ dependencyName: version \} */
  dependencyVersion: Record<string, string>
  reloadLanguageTools?: (() => void) | undefined
}>

export interface ReplStore extends UnwrapRef<StoreState> {
  init(): void
  setActive(filename: string): void
  addFile(filename: string | File): void
  deleteFile(filename: string): void
  renameFile(oldFilename: string, newFilename: string): void
  getImportMap(): ImportMap
  getTsConfig(): Record<string, any>
  serialize(): string
  deserialize(serializedState: string): void
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
