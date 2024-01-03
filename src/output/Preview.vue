<script setup lang="ts">
import Message from '../Message.vue'
import SplitPanel from '../SplitPane.vue'
import {
  ref,
  onUnmounted,
  watchEffect,
  watch,
  WatchStopHandle,
  inject,
  Ref,
  onBeforeUnmount,
} from 'vue'
import srcdoc from './srcdoc.html?raw'
import { compileModulesForPreview } from './moduleCompiler'
import { Store } from '../store'
import { Props } from '../Repl.vue'

import chobitsuEmbed from './chobitsu-embed.ts?braw'

import devtoolsHtml from './devtools.html?raw'
import { debounceAsync } from '../utils'

const props = defineProps<{ show: boolean; ssr: boolean }>()

const store = inject('store') as Store
const clearConsole = inject('clear-console') as Ref<boolean>

const previewOptions = inject('preview-options') as Props['previewOptions']

const container = ref()
const runtimeError = ref()
const runtimeWarning = ref()

let stopUpdateWatcher: WatchStopHandle | undefined

// reset sandbox when import map changes
watch(
  () => store.getImportMap(),
  () => {
    try {
      createSandbox()
    } catch (e: any) {
      store.state.errors = [e as Error]
      return
    }
  }
)

// reset sandbox when version changes
watch(() => store.state.resetFlip, createSandbox)

onUnmounted(() => {
  stopUpdateWatcher && stopUpdateWatcher()
})

const useDevtoolsSrc = () => {
  const devtoolsRawUrl = URL.createObjectURL(
    new Blob([devtoolsHtml.replace("SCRIPT_CHII", `\<script type="module" src="${location.origin}/dist/repl.js"\>\<\/script\>`)], { type: 'text/html' })
  )
  onUnmounted(() => URL.revokeObjectURL(devtoolsRawUrl))
  return `${devtoolsRawUrl}#?embedded=${encodeURIComponent(location.origin)}`
}

const devtoolsSrc = useDevtoolsSrc()
const devtoolsIframe = ref<HTMLIFrameElement>()

const previewIframe = ref<HTMLIFrameElement>()
watch(previewIframe, (iframe) => {
  if (iframe) createSandbox()
})

const messageListener = (event: MessageEvent) => {
  if (!devtoolsIframe.value || !previewIframe.value) return

  if (event.source === previewIframe.value.contentWindow) {
    devtoolsIframe.value.contentWindow!.postMessage(event.data, '*')
  }
  if (event.source === devtoolsIframe.value.contentWindow) {
    previewIframe.value.contentWindow!.postMessage(
      { event: 'DEV', data: event.data },
      '*'
    )
  }
}
window.addEventListener('message', messageListener)

const previewSrc = ref('')
function createSandbox(): void {
  if (previewSrc.value) URL.revokeObjectURL(previewSrc.value)

  stopUpdateWatcher?.()

  const importMap = store.getImportMap()
  if (!importMap.imports) {
    importMap.imports = {}
  }
  if (!importMap.imports.vue) {
    importMap.imports.vue = store.state.vueRuntimeURL
  }
  const sandboxSrc = srcdoc
    .replace(/<!--IMPORT_MAP-->/, JSON.stringify(importMap))
    .replace(
      /PREVIEW_OPTIONS_HEAD/,
      (previewOptions?.headHTML || '') +
      `\<script type="module"\>${chobitsuEmbed}\<\/script\>`
    )
    .replace(
      /PREVIEW_OPTIONS_PLACEHOLDER/,
      previewOptions?.placeholderHTML || ''
    )

  stopUpdateWatcher = watchEffect(updatePreview)
  previewSrc.value = URL.createObjectURL(
    new Blob([sandboxSrc], { type: 'text/html' })
  )
}

const previewEvalDelay = debounceAsync(previewEval, 300)
async function updatePreview() {
  if (import.meta.env.PROD && clearConsole.value) {
    //console.clear()
  }
  runtimeError.value = null
  runtimeWarning.value = null

  let isSSR = props.ssr
  if (store.vueVersion) {
    const [major, minor, patch] = store.vueVersion
      .split('.')
      .map((v) => parseInt(v, 10))
    if (major === 3 && (minor < 2 || (minor === 2 && patch < 27))) {
      alert(
        `The selected version of Vue (${store.vueVersion}) does not support in-browser SSR.` +
        ` Rendering in client mode instead.`
      )
      isSSR = false
    }
  }

  try {
    const mainFile = store.state.mainFile

    const codeToEval: string[] = []
    // if SSR, generate the SSR bundle and eval it to render the HTML
    if (isSSR && mainFile.endsWith('.vue')) {
      const ssrModules = compileModulesForPreview(store, true)
      console.log(
        `[@vue/repl] successfully compiled ${ssrModules.length} modules for SSR.`
      )
      codeToEval.push(
        ...[
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
         window.__ssr_promise__ = _renderToString(app).then(html => {
           document.body.innerHTML = '<div id="app">' + html + '</div>' + \`${previewOptions?.bodyHTML || ''
          }\`
         }).catch(err => {
           console.error("SSR Error", err)
         })
        `,
        ]
      )

      console.log('run done ')
    }

    // compile code to simulated module system
    const modules = compileModulesForPreview(store)
    console.log(
      `[@vue/repl] successfully compiled ${modules.length} module${modules.length > 1 ? `s` : ``
      }.`
    )

    codeToEval.push(
      ...[
        `window.__modules__ = {};window.__css__ = [];` +
        `if (window.__app__) window.__app__.unmount();` +
        (isSSR
          ? ``
          : `document.body.innerHTML = '<div id="app"></div>' + \`${previewOptions?.bodyHTML || ''
          }\``),
        ...modules,
        `setTimeout(()=> {
        document.querySelectorAll('style[css]').forEach(el => el.remove())
        document.head.insertAdjacentHTML('beforeend', window.__css__.map(s => \`<style css>\${s}</style>\`).join('\\n'))
      }, 1)`,
      ]
    )
    // if main file is a vue file, mount it.
    if (mainFile.endsWith('.vue')) {
      codeToEval.push(
        `import { ${isSSR ? `createSSRApp` : `createApp`
        } as _createApp } from "vue"
        ${previewOptions?.customCode?.importCode || ''}
        const _mount = () => {
          const AppComponent = __modules__["${mainFile}"].default
          AppComponent.name = 'Repl'
          const app = window.__app__ = _createApp(AppComponent)
          if (!app.config.hasOwnProperty('unwrapInjectedRef')) {
            app.config.unwrapInjectedRef = true
          }
          app.config.errorHandler = e => console.error(e)
          ${previewOptions?.customCode?.useCode || ''}
          app.mount('#app')
        }
        if (window.__ssr_promise__) {
          window.__ssr_promise__.then(_mount)
        } else {
          _mount()
        }`
      )
    }

    // eval code in sandbox
    await previewEvalDelay(codeToEval)
  } catch (e: any) {
    console.error(e)
    runtimeError.value = (e as Error).message
  }
}

/**
 * Reload the preview iframe
 */
function reload() {
  previewIframe.value?.contentWindow?.location.reload()
}

defineExpose({ reload })

const cleaners: (() => void)[] = []
onBeforeUnmount(() => cleaners.forEach((cleaner) => cleaner()))
function previewEval(script: string[]) {
  return new Promise<void>((resolve, reject) => {
    const id = Math.random().toString(36)

    const handler = (event: MessageEvent) => {
      if (event.data.event === 'MYEVAL') {
        if (id === event.data.id) {
          if (event.data.error) reject(new Error(event.data.error))
          else resolve()
          cleaner()
          cleaners.splice(cleaners.indexOf(cleaner) >>> 0, 1)
        }
      }
    }
    const cleaner = () => window.removeEventListener('message', handler)
    cleaners.push(cleaner)
    window.addEventListener('message', handler)
    previewIframe.value?.contentWindow!.postMessage(
      { event: 'MYEVAL', id, data: { script } },
      '*'
    )
  })
}

const devtoolsLoaded = ref(false)
const previewLoaded = ref(false)

function onLoadPreview() {
  previewLoaded.value = true
  if (devtoolsLoaded.value)
    previewIframe.value?.contentWindow!.postMessage({ event: 'LOADED' }, '*')
  updatePreview()
}
function onLoadDevtools() {
  devtoolsLoaded.value = true
  if (previewLoaded.value)
    previewIframe.value?.contentWindow!.postMessage({ event: 'LOADED' }, '*')
}
</script>

<template>
  <div class="iframe-container" v-show="show" ref="container">
    <SplitPanel layout="vertical" :default-split="100 - 43">
      <template #left>
        <iframe
          sandbox="allow-popups-to-escape-sandbox allow-scripts allow-popups allow-forms allow-pointer-lock allow-top-navigation allow-modals allow-same-origin"
          ref="previewIframe" @load="onLoadPreview" :src="previewSrc" class="preview" />
      </template>
      <template #right>
        <iframe class="devtools" :src="`${devtoolsSrc}`" ref="devtoolsIframe" @load="onLoadDevtools" />
      </template>
    </SplitPanel>
  </div>

  <Message :err="runtimeError" />
  <Message v-if="!runtimeError" :warn="runtimeWarning" />
</template>

<style scoped>
.iframe-container,
.iframe-container .preview {
  width: 100%;
  height: 100%;
  border: none;
  background-color: #fff;
}

.devtools {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
