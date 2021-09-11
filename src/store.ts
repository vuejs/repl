import { version, reactive, watchEffect } from 'vue'
import * as defaultCompiler from '@vue/compiler-sfc'
import { compileFile, MAIN_FILE } from './transform'
import { utoa, atou } from './utils'

const welcomeCode = `
<script setup>
import { ref } from 'vue'

const msg = ref('Hello World!')
</script>

<template>
  <h1>{{ msg }}</h1>
  <input v-model="msg">
</template>
`.trim()

export class File {
  filename: string
  code: string
  compiled = {
    js: '',
    css: '',
    ssr: ''
  }

  constructor(filename: string, code = '') {
    this.filename = filename
    this.code = code
  }
}

export interface StoreState {
  files: Record<string, File>
  activeFile: File
  errors: (string | Error)[]
  vueRuntimeURL: string
}

export class ReplStore {
  state: StoreState
  compiler = defaultCompiler
  defaultVueRuntimeURL: string
  pendingCompiler: Promise<any> | null = null

  constructor({
    serializedState = '',
    defaultVueRuntimeURL = `https://unpkg.com/@vue/runtime-dom@${version}/dist/runtime-dom.esm-browser.js`
  }: {
    serializedState?: string
    defaultVueRuntimeURL?: string
  } = {}) {
    let files: StoreState['files'] = {}

    if (serializedState) {
      const saved = JSON.parse(atou(serializedState))
      for (const filename in saved) {
        files[filename] = new File(filename, saved[filename])
      }
    } else {
      files = {
        [MAIN_FILE]: new File(MAIN_FILE, welcomeCode)
      }
    }

    this.defaultVueRuntimeURL = defaultVueRuntimeURL

    this.state = reactive({
      files,
      activeFile: files[MAIN_FILE],
      errors: [],
      vueRuntimeURL: this.defaultVueRuntimeURL
    })

    this.initImportMap()

    watchEffect(() => compileFile(this, this.state.activeFile))

    for (const file in this.state.files) {
      if (file !== MAIN_FILE) {
        compileFile(this, this.state.files[file])
      }
    }
  }

  setActive(filename: string) {
    this.state.activeFile = this.state.files[filename]
  }

  addFile(filename: string) {
    this.state.files[filename] = new File(filename)
    this.setActive(filename)
  }

  deleteFile(filename: string) {
    if (confirm(`Are you sure you want to delete ${filename}?`)) {
      if (this.state.activeFile.filename === filename) {
        this.state.activeFile = this.state.files[MAIN_FILE]
      }
      delete this.state.files[filename]
    }
  }

  serialize() {
    return '#' + utoa(JSON.stringify(this.getFiles()))
  }

  getFiles() {
    const exported: Record<string, string> = {}
    for (const filename in this.state.files) {
      exported[filename] = this.state.files[filename].code
    }
    return exported
  }

  async setFiles(newFiles: Record<string, string>) {
    const files: Record<string, File> = {}
    for (const filename in newFiles) {
      files[filename] = new File(filename, newFiles[filename])
    }
    if (!files[MAIN_FILE]) {
      files[MAIN_FILE] = new File(MAIN_FILE, welcomeCode)
    }
    for (const file in files) {
      await compileFile(this, files[file])
    }
    this.state.files = files
    this.initImportMap()
    this.setActive(MAIN_FILE)
  }

  private initImportMap() {
    if (!this.state.files['import-map.json']) {
      this.state.files['import-map.json'] = new File(
        'import-map.json',
        JSON.stringify({ imports: {} }, null, 2)
      )
    }
  }

  getImportMap() {
    try {
      return JSON.parse(this.state.files['import-map.json'].code)
    } catch (e) {
      this.state.errors = [
        `Syntax error in import-map.json: ${(e as Error).message}`
      ]
      return {}
    }
  }

  setImportMap(map: {
    imports: Record<string, string>
    scopes?: Record<string, Record<string, string>>
  }) {
    this.state.files['import-map.json']!.code = JSON.stringify(map, null, 2)
  }

  async setVueVersion(version: string) {
    const compilerUrl = `https://unpkg.com/@vue/compiler-sfc@${version}/dist/compiler-sfc.esm-browser.js`
    const runtimeUrl = `https://unpkg.com/@vue/runtime-dom@${version}/dist/runtime-dom.esm-browser.js`
    this.pendingCompiler = import(/* @vite-ignore */ compilerUrl)
    this.compiler = await this.pendingCompiler
    this.pendingCompiler = null
    this.state.vueRuntimeURL = runtimeUrl
    console.info(`[@vue/repl] Now using Vue version: ${version}`)
  }

  resetVueVersion() {
    this.compiler = defaultCompiler
    this.state.vueRuntimeURL = this.defaultVueRuntimeURL
  }
}
