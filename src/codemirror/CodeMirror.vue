<template>
  <div class="editor" ref="el"></div>
</template>

<script setup lang="ts">
import type { ModeSpec, ModeSpecOptions } from 'codemirror'
import { ref, onMounted, watchEffect, inject } from 'vue'
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

const emit = defineEmits<(e: 'save', value: string) => void>()

const el = ref()
const needAutoResize = inject('autoresize')

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

  function save() {
    emit('save', editor.getValue())
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

  let changeTimer: NodeJS.Timeout
  editor.on('change', (e) => {
    clearTimeout(changeTimer) // clear previous timer

    changeTimer = setTimeout(() => {
      save()
    }, 5000)
  })

  editor.on('blur', () => {
    save()
  })
  el.value.addEventListener('keydown', (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.code === 'KeyS') {
      e.preventDefault()
      save()
    }
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
      })
    )
  }
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
