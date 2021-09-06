<template>
  <div class="editor" ref="el"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, watchEffect } from 'vue'
import CodeMirror from './codemirror'

const el = ref()

const props = defineProps({
  mode: {
    type: String,
    default: 'htmlmixed'
  },
  value: {
    type: String,
    default: ''
  },
  readonly: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits<(e: 'change', value: string) => void>()

onMounted(() => {
  const addonOptions = {
    autoCloseBrackets: true,
    autoCloseTags: true,
    foldGutter: true,
    gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter']
  }

  const editor = CodeMirror(el.value!, {
    value: '',
    mode: props.mode,
    readOnly: props.readonly,
    tabSize: 2,
    lineWrapping: true,
    lineNumbers: true,
    ...addonOptions
  })

  editor.on('change', () => {
    emit('change', editor.getValue())
  })

  watchEffect(() => {
    editor.setValue(props.value)
  })
  watchEffect(() => {
    editor.setOption('mode', props.mode)
  })

  setTimeout(() => {
    editor.refresh()
  }, 50)
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
