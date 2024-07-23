<template>
  <div ref="el" class="editor" />
</template>

<script setup lang="ts">
import type { ModeSpec, ModeSpecOptions } from 'codemirror'
import { inject, onMounted, ref, watch, watchEffect } from 'vue'
import { debounce } from '../utils'
import CodeMirror from './codemirror'

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

const el = ref<HTMLDivElement>()
const needAutoResize = inject('autoresize')
const autoSave = inject<boolean>('autosave')

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

  const editor = CodeMirror(el.value!, {
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

  if (needAutoResize) {
    window.addEventListener(
      'resize',
      debounce(() => {
        editor.refresh()
      }),
    )
  }

  const editorChangeEvent = () => {
    emit('change', editor.getValue())
  }
  const saveKeydownEvent = (e: KeyboardEvent) => {
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault()
      emit('change', editor.getValue())
    }
  }

  watch(
    () => autoSave,
    (newVal) => {
      if (newVal) {
        el.value!.removeEventListener('keydown', saveKeydownEvent)
        editor.on('change', editorChangeEvent)
      } else {
        editor.off('change', editorChangeEvent)
        el.value!.addEventListener('keydown', saveKeydownEvent)
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
