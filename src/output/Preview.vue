<script setup lang="ts">
import Message from '../Message.vue'
import {
  ref,
  onMounted,
  onUnmounted,
  watchEffect,
  watch,
  WatchStopHandle,
  inject,
  Ref
} from 'vue'
import srcdoc from './srcdoc.html?raw'
import { PreviewProxy } from './PreviewProxy'
import { compileModulesForPreview } from './moduleCompiler'
import { ReplStore } from '../store'

const store = inject('store') as ReplStore
const clearConsole = inject('clear-console') as Ref<boolean>
const container = ref()
const runtimeError = ref()
const runtimeWarning = ref()

let sandbox: HTMLIFrameElement
let proxy: PreviewProxy
let stopUpdateWatcher: WatchStopHandle | undefined

// create sandbox on mount
onMounted(createSandbox)

// reset sandbox when import map changes
watch(
  () => store.state.files['import-map.json'].code,
  (raw) => {
    try {
      const map = JSON.parse(raw)
      if (!map.imports) {
        store.state.errors = [`import-map.json is missing "imports" field.`]
        return
      }
      createSandbox()
    } catch (e: any) {
      store.state.errors = [e as Error]
      return
    }
  }
)

// reset sandbox when version changes
watch(() => store.state.vueRuntimeURL, createSandbox)

onUnmounted(() => {
  proxy.destroy()
  stopUpdateWatcher && stopUpdateWatcher()
})

function createSandbox() {
  if (sandbox) {
    // clear prev sandbox
    proxy.destroy()
    stopUpdateWatcher && stopUpdateWatcher()
    container.value.removeChild(sandbox)
  }

  sandbox = document.createElement('iframe')
  sandbox.setAttribute(
    'sandbox',
    [
      'allow-forms',
      'allow-modals',
      'allow-pointer-lock',
      'allow-popups',
      'allow-same-origin',
      'allow-scripts',
      'allow-top-navigation-by-user-activation'
    ].join(' ')
  )

  const importMap = store.getImportMap()
  if (!importMap.imports) {
    importMap.imports = {}
  }
  if (!importMap.imports.vue) {
    importMap.imports.vue = store.state.vueRuntimeURL
  }
  const sandboxSrc = srcdoc.replace(
    /<!--IMPORT_MAP-->/,
    JSON.stringify(importMap)
  )
  sandbox.srcdoc = sandboxSrc
  container.value.appendChild(sandbox)

  proxy = new PreviewProxy(sandbox, {
    on_fetch_progress: (progress: any) => {
      // pending_imports = progress;
    },
    on_error: (event: any) => {
      const msg =
        event.value instanceof Error ? event.value.message : event.value
      if (
        msg.includes('Failed to resolve module specifier') ||
        msg.includes('Error resolving module specifier')
      ) {
        runtimeError.value =
          msg.replace(/\. Relative references must.*$/, '') +
          `.\nTip: add an "import-map.json" file to specify import paths for dependencies.`
      } else {
        runtimeError.value = event.value
      }
    },
    on_unhandled_rejection: (event: any) => {
      let error = event.value
      if (typeof error === 'string') {
        error = { message: error }
      }
      runtimeError.value = 'Uncaught (in promise): ' + error.message
    },
    on_console: (log: any) => {
      if (log.duplicate) {
        return
      }
      if (log.level === 'error') {
        if (log.args[0] instanceof Error) {
          runtimeError.value = log.args[0].message
        } else {
          runtimeError.value = log.args[0]
        }
      } else if (log.level === 'warn') {
        if (log.args[0].toString().includes('[Vue warn]')) {
          runtimeWarning.value = log.args
            .join('')
            .replace(/\[Vue warn\]:/, '')
            .trim()
        }
      }
    },
    on_console_group: (action: any) => {
      // group_logs(action.label, false);
    },
    on_console_group_end: () => {
      // ungroup_logs();
    },
    on_console_group_collapsed: (action: any) => {
      // group_logs(action.label, true);
    }
  })

  sandbox.addEventListener('load', () => {
    proxy.handle_links()
    stopUpdateWatcher = watchEffect(updatePreview)
  })
}

async function updatePreview() {
  if (import.meta.env.PROD && clearConsole.value) {
    console.clear()
  }
  runtimeError.value = null
  runtimeWarning.value = null

  try {
    // compile code to simulated module system
    const modules = compileModulesForPreview(store)
    console.log(`[@vue/repl] successfully compiled ${modules.length} modules.`)

    const codeToEval = [
      `window.__modules__ = {};window.__css__ = '';` +
        `if (window.__app__) window.__app__.unmount();` +
        `document.body.innerHTML = '<div id="app"></div>'`,
      ...modules,
      `document.getElementById('__sfc-styles').innerHTML = window.__css__`
    ]

    // if main file is a vue file, mount it.
    const mainFile = store.state.mainFile
    if (mainFile.endsWith('.vue')) {
      codeToEval.push(
        `import { createApp as _createApp } from "vue"
        const app = window.__app__ = _createApp(__modules__["${mainFile}"].default)
        app.config.errorHandler = e => console.error(e)
        app.mount('#app')`.trim()
      )
    }

    // eval code in sandbox
    await proxy.eval(codeToEval)
  } catch (e: any) {
    runtimeError.value = (e as Error).message
  }
}
</script>

<template>
  <div class="vue-repl-preview-container" ref="container"></div>
  <Message :err="runtimeError" />
  <Message v-if="!runtimeError" :warn="runtimeWarning" />
</template>

<style>
.vue-repl-preview-container,
.vue-repl-preview-container iframe {
  width: 100%;
  height: 100%;
  border: none;
  background-color: #fff;
}
</style>
