<script setup lang="ts">
import Message from '../Message.vue'
import {
  type WatchStopHandle,
  inject,
  onMounted,
  onUnmounted,
  ref,
  toRefs,
  useTemplateRef,
  watch,
  watchEffect,
} from 'vue'
import srcdoc from './srcdoc.html?raw'
import { PreviewProxy } from './PreviewProxy'
import { compileModulesForPreview } from './moduleCompiler'
import type { Store } from '../store'
import { injectKeyProps } from '../types'

export interface SandboxProps {
  store: Store
  show?: boolean
  ssr?: boolean
  clearConsole?: boolean
  theme?: 'dark' | 'light'
  previewOptions?: {
    headHTML?: string
    bodyHTML?: string
    placeholderHTML?: string
    customCode?: {
      importCode?: string
      useCode?: string
    }
    showRuntimeError?: boolean
    showRuntimeWarning?: boolean
  }
  /** @default true */
  autoStoreInit?: boolean
}

const props = withDefaults(defineProps<SandboxProps>(), {
  show: true,
  ssr: false,
  theme: 'light',
  clearConsole: true,
  previewOptions: () => ({}),
  autoStoreInit: true,
})
const { store, theme, clearConsole, previewOptions } = toRefs(props)

const keyProps = inject(injectKeyProps)
if (keyProps === undefined && props.autoStoreInit) {
  props.store?.init?.()
}

const containerRef = useTemplateRef('container')
const runtimeError = ref<string>()
const runtimeWarning = ref<string>()

let sandbox: HTMLIFrameElement
let proxy: PreviewProxy
let stopUpdateWatcher: WatchStopHandle | undefined

// create sandbox on mount
onMounted(createSandbox)

// reset sandbox when import map changes
watch(
  () => store.value.getImportMap(),
  () => {
    try {
      createSandbox()
    } catch (e: any) {
      store.value.errors = [e as Error]
      return
    }
  },
)

function switchPreviewTheme() {
  const html = sandbox.contentDocument?.documentElement
  if (html) {
    html.className = theme.value
  } else {
    // re-create sandbox
    createSandbox()
  }
}

watch(theme, switchPreviewTheme)

onUnmounted(() => {
  proxy.destroy()
  stopUpdateWatcher && stopUpdateWatcher()
})

function createSandbox() {
  if (sandbox) {
    // clear prev sandbox
    proxy.destroy()
    stopUpdateWatcher && stopUpdateWatcher()
    containerRef.value?.removeChild(sandbox)
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
      'allow-top-navigation-by-user-activation',
    ].join(' '),
  )

  const importMap = store.value.getImportMap()
  const sandboxSrc = srcdoc
    .replace(/<html>/, `<html class="${theme.value}">`)
    .replace(/<!--IMPORT_MAP-->/, JSON.stringify(importMap))
    .replace(
      /<!-- PREVIEW-OPTIONS-HEAD-HTML -->/,
      previewOptions.value?.headHTML || '',
    )
    .replace(
      /<!--PREVIEW-OPTIONS-PLACEHOLDER-HTML-->/,
      previewOptions.value?.placeholderHTML || '',
    )
  sandbox.srcdoc = sandboxSrc
  containerRef.value?.appendChild(sandbox)

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
          `.\nTip: edit the "Import Map" tab to specify import paths for dependencies.`
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
    },
  })

  sandbox.addEventListener('load', () => {
    proxy.handle_links()
    stopUpdateWatcher = watchEffect(updatePreview)
    switchPreviewTheme()
  })
}

async function updatePreview() {
  if (import.meta.env.PROD && clearConsole.value) {
    console.clear()
  }
  runtimeError.value = undefined
  runtimeWarning.value = undefined

  let isSSR = props.ssr
  if (store.value.vueVersion) {
    const [major, minor, patch] = store.value.vueVersion
      .split('.')
      .map((v) => parseInt(v, 10))
    if (major === 3 && (minor < 2 || (minor === 2 && patch < 27))) {
      alert(
        `The selected version of Vue (${store.value.vueVersion}) does not support in-browser SSR.` +
          ` Rendering in client mode instead.`,
      )
      isSSR = false
    }
  }

  try {
    const { mainFile } = store.value

    // if SSR, generate the SSR bundle and eval it to render the HTML
    if (isSSR && mainFile.endsWith('.vue')) {
      const ssrModules = compileModulesForPreview(store.value, true)
      console.info(
        `[@vue/repl] successfully compiled ${ssrModules.length} modules for SSR.`,
      )
      store.value.ssrOutput.html = store.value.ssrOutput.context = ''
      const response = await proxy.eval([
        `const __modules__ = {};`,
        ...ssrModules,
        `import { renderToString as _renderToString } from 'vue/server-renderer'
         import { createSSRApp as _createApp } from 'vue'
         const AppComponent = __modules__["${mainFile}"].default
         AppComponent.name = 'Repl'
         const app = _createApp(AppComponent)
         if (!app.config.hasOwnProperty('unwrapInjectedRef')) {
           app.config.unwrapInjectedRef = true
         }
         app.config.warnHandler = () => {}
         const rawContext = {}
         window.__ssr_promise__ = _renderToString(app, rawContext).then(html => {
           document.body.innerHTML = '<div id="app">' + html + '</div>' + \`${
             previewOptions.value?.bodyHTML || ''
           }\`
           const safeContext = {}
           const isSafe = (v) =>
             v === null ||
             typeof v === 'boolean' ||
             typeof v === 'string' ||
             Number.isFinite(v)
           const toSafe = (v) => (isSafe(v) ? v : '[' + typeof v + ']')
           for (const prop in rawContext) {
             const value = rawContext[prop]
             safeContext[prop] = isSafe(value)
               ? value
               : Array.isArray(value)
                 ? value.map(toSafe)
                 : typeof value === 'object'
                   ? Object.fromEntries(
                       Object.entries(value).map(([k, v]) => [k, toSafe(v)]),
                     )
                   : toSafe(value)
           }
           return { ssrHtml: html, ssrContext: safeContext }
         }).catch(err => {
           console.error("SSR Error", err)
         })
        `,
      ])

      if (response) {
        store.value.ssrOutput.html = String((response as any).ssrHtml ?? '')
        store.value.ssrOutput.context = (response as any).ssrContext || ''
      }
    }

    // compile code to simulated module system
    const modules = compileModulesForPreview(store.value)
    console.info(
      `[@vue/repl] successfully compiled ${modules.length} module${
        modules.length > 1 ? `s` : ``
      }.`,
    )

    const codeToEval = [
      `window.__modules__ = {};window.__css__ = [];` +
        `if (window.__app__) window.__app__.unmount();` +
        (isSSR
          ? ``
          : `document.body.innerHTML = '<div id="app"></div>' + \`${
              previewOptions.value?.bodyHTML || ''
            }\``),
      ...modules,
      `document.querySelectorAll('style[css]').forEach(el => el.remove())
        document.head.insertAdjacentHTML('beforeend', window.__css__.map(s => \`<style css>\${s}</style>\`).join('\\n'))`,
    ]

    // if main file is a vue file, mount it.
    if (mainFile.endsWith('.vue')) {
      codeToEval.push(
        `import { ${
          isSSR ? `createSSRApp` : `createApp`
        } as _createApp } from "vue"
        ${previewOptions.value?.customCode?.importCode || ''}
        const _mount = () => {
          const AppComponent = __modules__["${mainFile}"].default
          AppComponent.name = 'Repl'
          const app = window.__app__ = _createApp(AppComponent)
          if (!app.config.hasOwnProperty('unwrapInjectedRef')) {
            app.config.unwrapInjectedRef = true
          }
          app.config.errorHandler = e => console.error(e)
          ${previewOptions.value?.customCode?.useCode || ''}
          app.mount('#app')
        }
        if (window.__ssr_promise__) {
          window.__ssr_promise__.then(_mount)
        } else {
          _mount()
        }`,
      )
    }

    // eval code in sandbox
    await proxy.eval(codeToEval)
  } catch (e: any) {
    console.error(e)
    runtimeError.value = (e as Error).message
  }
}

/**
 * Reload the preview iframe
 */
function reload() {
  sandbox.contentWindow?.location.reload()
}

defineExpose({ reload, container: containerRef })
</script>

<template>
  <div
    v-show="props.show"
    ref="container"
    class="iframe-container"
    :class="theme"
  />
  <Message :err="(previewOptions?.showRuntimeError ?? true) && runtimeError" />
  <Message
    v-if="!runtimeError && (previewOptions?.showRuntimeWarning ?? true)"
    :warn="runtimeWarning"
  />
</template>

<style scoped>
.iframe-container,
.iframe-container :deep(iframe) {
  width: 100%;
  height: 100%;
  border: none;
  background-color: #fff;
}
.iframe-container.dark :deep(iframe) {
  background-color: #1e1e1e;
}
</style>
