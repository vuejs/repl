<script setup lang="ts">
import SplitPane from './SplitPane.vue'
import Output from './output/Output.vue'
import { type Store, useStore } from './store'
import { computed, provide, ref, toRef } from 'vue'
import { type EditorComponentType, injectKeyStore } from './types'
import EditorContainer from './editor/EditorContainer.vue'

export interface Props {
  theme?: 'dark' | 'light'
  previewTheme?: boolean
  editor: EditorComponentType
  store?: Store
  autoResize?: boolean
  autoSave?: boolean // auto save and compile, default to true, if false, user need to press ctrl + s to save and compile
  showCompileOutput?: boolean
  showImportMap?: boolean
  showTsConfig?: boolean
  clearConsole?: boolean
  layout?: 'horizontal' | 'vertical'
  layoutReverse?: boolean
  ssr?: boolean
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
  editorOptions?: {
    ShowErrorText?: string
  }
  splitPaneOptions?: {
    CodeTogglerButtonText?: string
    OutputTogglerButtonText?: string
  }
  isEmbedMode?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  theme: 'light',
  previewTheme: false,
  store: () => useStore(),
  autoResize: true,
  autoSave: true,
  showCompileOutput: true,
  showImportMap: true,
  showTsConfig: true,
  clearConsole: true,
  layoutReverse: false,
  ssr: false,
  previewOptions: () => ({
    headHTML: '',
    bodyHTML: '',
    placeholderHTML: '',
    customCode: {
      importCode: '',
      useCode: '',
    },
    showRuntimeError: true,
    showRuntimeWarning: true,
  }),
  layout: 'horizontal',
  editorOptions: () => ({
    ShowErrorText: 'Show Error',
  }),
  splitPaneOptions: () => ({
    CodeTogglerButtonText: '< Code',
    OutputTogglerButtonText: 'Output >',
  }),
  isEmbedMode: false
})

if (!props.editor) {
  throw new Error('The "editor" prop is now required.')
}

const outputRef = ref<InstanceType<typeof Output>>()

props.store.init()

const editorSlotName = computed(() => (props.layoutReverse ? 'right' : 'left'))
const outputSlotName = computed(() => (props.layoutReverse ? 'left' : 'right'))

provide(injectKeyStore, props.store)
provide('autoresize', props.autoResize)
provide('autosave', props.autoSave)
provide('import-map', toRef(props, 'showImportMap'))
provide('tsconfig', toRef(props, 'showTsConfig'))
provide('clear-console', toRef(props, 'clearConsole'))
provide('preview-options', props.previewOptions)
provide('editor-options', props.editorOptions)
provide('theme', toRef(props, 'theme'))
provide('preview-theme', toRef(props, 'previewTheme'))
provide('preview-ref', () => outputRef.value?.previewRef?.container)
provide('split-pane-options', props.splitPaneOptions)
provide('is-embed-mode', props.isEmbedMode)

/**
 * Reload the preview iframe
 */
function reload() {
  outputRef.value?.reload()
}

defineExpose({ reload })
</script>

<template>
  <div class="vue-repl">
    <SplitPane :layout="layout">
      <template #[editorSlotName]>
        <EditorContainer :editor-component="editor" />
      </template>
      <template #[outputSlotName]>
        <Output
          ref="outputRef"
          :editor-component="editor"
          :show-compile-output="props.showCompileOutput"
          :ssr="!!props.ssr"
        />
      </template>
    </SplitPane>
  </div>
</template>

<style>
.vue-repl {
  --bg: #fff;
  --bg-soft: #f8f8f8;
  --border: #ddd;
  --text-light: #888;
  --font-code: Menlo, Monaco, Consolas, 'Courier New', monospace;
  --color-branding: #42b883;
  --color-branding-dark: #416f9c;
  --header-height: 38px;

  height: 100%;
  margin: 0;
  overflow: hidden;
  font-size: 13px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  background-color: var(--bg-soft);
}

.dark .vue-repl {
  --bg: #1a1a1a;
  --bg-soft: #242424;
  --border: #383838;
  --text-light: #aaa;
  --color-branding: #42d392;
  --color-branding-dark: #89ddff;
}

.vue-repl button {
  border: none;
  outline: none;
  cursor: pointer;
  margin: 0;
  background-color: transparent;
}
</style>
