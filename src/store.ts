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
  activeFilename: string
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
        'App.vue': new File(MAIN_FILE, welcomeCode)
      }
    }

    this.defaultVueRuntimeURL = import.meta.env.PROD
      ? defaultVueRuntimeURL
      : `${location.origin}/src/vue-dev-proxy`

    this.state = reactive({
      files,
      activeFilename: MAIN_FILE,
      errors: [],
      vueRuntimeURL: this.defaultVueRuntimeURL
    })

    watchEffect(() => compileFile(this, this.activeFile))

    for (const file in this.state.files) {
      if (file !== MAIN_FILE) {
        compileFile(this, this.state.files[file])
      }
    }
  }

  get activeFile() {
    return this.state.files[this.state.activeFilename]
  }

  get importMap() {
    const file = this.state.files['import-map.json']
    return file && file.code
  }

  setActive(filename: string) {
    this.state.activeFilename = filename
  }

  addFile(filename: string) {
    const file = (this.state.files[filename] = new File(filename))

    if (filename === 'import-map.json') {
      file.code = `
{
  "imports": {

  }
}`.trim()
    }
    this.setActive(filename)
  }

  deleteFile(filename: string) {
    if (confirm(`Are you sure you want to delete ${filename}?`)) {
      if (this.state.activeFilename === filename) {
        this.state.activeFilename = MAIN_FILE
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

  setFiles(newFiles: Record<string, string>) {
    const files: Record<string, File> = {}
    for (const filename in newFiles) {
      files[filename] = new File(filename, newFiles[filename])
    }
    this.state.files = files
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
