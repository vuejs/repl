<script lang="ts" setup>
import {
  onMounted,
  onBeforeUnmount,
  ref,
  shallowRef,
  nextTick,
  watchEffect,
  inject,
  watch,
  computed
} from 'vue'
import * as monaco from 'monaco-editor-core'
import { getOrCreateModel } from './utils'
import { loadGrammars, loadTheme } from 'monaco-volar'
import { Store } from '../store'
import type { PreviewMode } from '../types'
import { loadMonacoEnv, loadWasm } from './env'

const props = withDefaults(
  defineProps<{
    filename: string
    value?: string
    readonly?: boolean
    mode?: PreviewMode
  }>(),
  {
    readonly: false
  }
)

const emits = defineEmits<{
  (e: 'change', value: string): void
}>()

let init = false
const containerRef = ref<HTMLDivElement | null>()
const ready = ref(false)
const editor = shallowRef<monaco.editor.IStandaloneCodeEditor | undefined>(
  undefined
)
const store = inject('store') as Store

if (!init) {
  init = true
  loadMonacoEnv(store)
  loadWasm()
}

if (!props.readonly) {
  watchEffect(() => {
    // create a model for each file in the store
    for (const filename in store.state.files) {
      const file = store.state.files[filename]
      if (monaco.editor.getModel(monaco.Uri.parse(`file:///${filename}`)))
        continue
      getOrCreateModel(
        monaco.Uri.parse(`file:///${filename}`),
        file.language,
        file.code
      )
    }

    // dispose of any models that are not in the store
    for (const model of monaco.editor.getModels()) {
      if (store.state.files[model.uri.toString().substring('file:///'.length)])
        continue
      if (model.uri.toString().startsWith('file:///node_modules/')) continue
      model.dispose()
    }
  })
}

const lang = computed(() => (props.mode === 'css' ? 'css' : 'javascript'))

onMounted(async () => {
  const theme = await loadTheme(monaco.editor)
  ready.value = true
  await nextTick()

  if (!containerRef.value) {
    throw new Error('Cannot find containerRef')
  }

  const editorInstance = monaco.editor.create(containerRef.value, {
    ...(props.readonly
      ? { value: props.value, language: lang.value }
      : { model: null }),
    theme,
    readOnly: props.readonly,
    automaticLayout: true,
    scrollBeyondLastLine: false,
    minimap: {
      enabled: false
    },
    inlineSuggest: {
      enabled: false
    },
    'semanticHighlighting.enabled': true
  })
  editor.value = editorInstance

  // Support for semantic highlighting
  const t = (editorInstance as any)._themeService._theme;
  t.getTokenStyleMetadata = (
    type: string,
    modifiers: string[],
    _language: string
  ) => {
    const _readonly = modifiers.includes('readonly');
    switch (type) {
      case 'function':
      case 'method':
        return { foreground: 12 };
      case 'class':
        return { foreground: 11 };
      case 'variable':
      case 'property':
        return { foreground: _readonly ? 21 : 9 };
      default:
        return { foreground: 0 };
    }
  };

  if (props.readonly) {
    watch(
      () => props.value,
      value => {
        editorInstance.setValue(value || '')
        monaco.editor.setModelLanguage(editorInstance.getModel()!, lang.value)
      }
    )
  } else {
    watch(
      () => props.filename,
      () => {
        if (!editorInstance) return
        const file = store.state.files[props.filename]
        if (!file) return null
        const model = getOrCreateModel(
          monaco.Uri.parse(`file:///${props.filename}`),
          file.language,
          file.code
        )
        editorInstance.setModel(model)
      },
      { immediate: true }
    )
  }

  await loadGrammars(monaco, editorInstance)

  editorInstance.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
    // ignore save event
  })

  editorInstance.onDidChangeModelContent(() => {
    emits('change', editorInstance.getValue())
  })
})

onBeforeUnmount(() => {
  editor.value?.dispose()
})
</script>

<template>
  <div class="editor" ref="containerRef"></div>
</template>

<style>
.editor {
  position: relative;
  height: 100%;
  width: 100%;
  overflow: hidden;
}
</style>
