<script lang="ts" setup>
import {
  computed,
  inject,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  shallowRef,
  useTemplateRef,
  watch,
} from 'vue'
import * as monaco from 'monaco-editor-core'
import { initMonaco } from './env'
import { getOrCreateModel } from './utils'
import { type EditorMode, injectKeyProps } from '../types'

const props = withDefaults(
  defineProps<{
    filename: string
    value?: string
    readonly?: boolean
    mode?: EditorMode
  }>(),
  {
    readonly: false,
    value: '',
    mode: undefined,
  },
)

const emit = defineEmits<{
  (e: 'change', value: string): void
}>()

const containerRef = useTemplateRef('container')
const ready = ref(false)
const editor = shallowRef<monaco.editor.IStandaloneCodeEditor>()
const {
  store,
  autoSave,
  theme: replTheme,
  editorOptions,
} = inject(injectKeyProps)!

initMonaco(store.value)

const lang = computed(() => (props.mode === 'css' ? 'css' : 'javascript'))

onMounted(async () => {
  const theme = await import('./highlight').then((r) => r.registerHighlighter())
  ready.value = true
  await nextTick()

  if (!containerRef.value) {
    throw new Error('Cannot find containerRef')
  }

  const editorInstance = monaco.editor.create(containerRef.value, {
    ...(props.readonly
      ? { value: props.value, language: lang.value }
      : { model: null }),
    fontSize: 13,
    tabSize: 2,
    theme: replTheme.value === 'light' ? theme.light : theme.dark,
    readOnly: props.readonly,
    automaticLayout: true,
    scrollBeyondLastLine: false,
    minimap: {
      enabled: false,
    },
    inlineSuggest: {
      enabled: false,
    },
    fixedOverflowWidgets: true,
    ...editorOptions.value.monacoOptions,
  })
  editor.value = editorInstance

  // Support for semantic highlighting
  const t = (editorInstance as any)._themeService._theme
  t.semanticHighlighting = true
  t.getTokenStyleMetadata = (
    type: string,
    modifiers: string[],
    _language: string,
  ) => {
    const _readonly = modifiers.includes('readonly')
    switch (type) {
      case 'function':
      case 'method':
        return { foreground: 12 }
      case 'class':
        return { foreground: 11 }
      case 'variable':
      case 'property':
        return { foreground: _readonly ? 19 : 9 }
      default:
        return { foreground: 0 }
    }
  }

  watch(
    () => props.value,
    (value) => {
      if (editorInstance.getValue() === value) return
      editorInstance.setValue(value || '')
    },
    { immediate: true },
  )

  watch(lang, (lang) =>
    monaco.editor.setModelLanguage(editorInstance.getModel()!, lang),
  )

  if (!props.readonly) {
    watch(
      () => props.filename,
      (_, oldFilename) => {
        if (!editorInstance) return
        const file = store.value.files[props.filename]
        if (!file) return null
        const model = getOrCreateModel(
          monaco.Uri.parse(`file:///${props.filename}`),
          file.language,
          file.code,
        )

        const oldFile = oldFilename ? store.value.files[oldFilename] : null
        if (oldFile) {
          oldFile.editorViewState = editorInstance.saveViewState()
        }

        editorInstance.setModel(model)

        if (file.editorViewState) {
          editorInstance.restoreViewState(file.editorViewState)
          editorInstance.focus()
        }
      },
      { immediate: true },
    )
  }

  editorInstance.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
    // ignore save event
  })

  const editorChangeEvent = () => {
    emit('change', editorInstance.getValue())
  }
  const saveKeydownEvent = (e: KeyboardEvent) => {
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault()
      emit('change', editorInstance.getValue())
    }
  }

  let disposable: monaco.IDisposable
  watch(
    autoSave,
    (newVal) => {
      if (newVal) {
        containerRef.value!.removeEventListener('keydown', saveKeydownEvent)
        disposable = editorInstance.onDidChangeModelContent(editorChangeEvent)
      } else {
        disposable && disposable.dispose()
        containerRef.value!.addEventListener('keydown', saveKeydownEvent)
      }
    },
    { immediate: true },
  )

  // update theme
  watch(replTheme, (n) => {
    editorInstance.updateOptions({
      theme: n === 'light' ? theme.light : theme.dark,
    })
  })
})

onBeforeUnmount(() => {
  editor.value?.dispose()
})
</script>

<template>
  <div ref="container" class="editor" />
</template>

<style>
.editor {
  position: relative;
  height: 100%;
  width: 100%;
  overflow: hidden;
}
</style>
