<template>
  <div
    ref="container"
    class="editor"
    @keydown.ctrl.s.prevent="emitChangeEvent"
    @keydown.meta.s.prevent="emitChangeEvent"
  />
</template>

<script setup lang="ts">
import type { ModeSpec, ModeSpecOptions } from 'codemirror'
import {
  inject,
  onMounted,
  onWatcherCleanup,
  useTemplateRef,
  watch,
  watchEffect,
} from 'vue'
import { debounce } from '../utils'
import CodeMirror from './codemirror'
import { injectKeyProps } from '../../src/types'

export interface Props {
  mode?: string | ModeSpec<ModeSpecOptions>
  value?: string
  readonly?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'htmlmixed',
  value: '',
  readonly: false,
})

const emit = defineEmits<(e: 'change', value: string) => void>()

const el = useTemplateRef('container')
const { autoResize, autoSave } = inject(injectKeyProps)!
let editor: CodeMirror.Editor

const emitChangeEvent = () => {
  emit('change', editor.getValue())
}

onMounted(() => {
  const addonOptions = props.readonly
    ? {}
    : {
        autoCloseBrackets: true,
        autoCloseTags: true,
        foldGutter: true,
        gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
        keyMap: 'sublime',
      }

  editor = CodeMirror(el.value!, {
    value: '',
    mode: props.mode,
    readOnly: props.readonly,
    tabSize: 2,
    lineWrapping: true,
    lineNumbers: true,
    ...addonOptions,
  })

  watchEffect(() => {
    const cur = editor.getValue()
    if (props.value !== cur) {
      editor.setValue(props.value)
    }
  })

  watchEffect(() => {
    editor.setOption('mode', props.mode)
  })

  setTimeout(() => {
    editor.refresh()
  }, 50)

  if (autoResize.value) {
    window.addEventListener(
      'resize',
      debounce(() => {
        editor.refresh()
      }),
    )
  }

  watch(
    autoSave,
    (autoSave) => {
      if (autoSave) {
        editor.on('change', emitChangeEvent)
        onWatcherCleanup(() => editor.off('change', emitChangeEvent))
      }
    },
    { immediate: true },
  )
})
</script>

<style>
.editor {
  position: relative;
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.CodeMirror {
  font-family: var(--font-code);
  line-height: 1.5;
  height: 100%;
}
</style>
