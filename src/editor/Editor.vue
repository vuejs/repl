<script setup lang="ts">
import FileSelector from './FileSelector.vue'
import CodeMirror, { type Props } from '../codemirror/CodeMirror.vue'
import Message from '../Message.vue'
import { debounce } from '../utils'
import { computed, inject } from 'vue'
import { Store } from '../store'

const store = inject('store') as Store

const modes: Record<string, Props['mode']> = {
  css: 'css',
  html: 'htmlmixed',
  js: {
    name: 'javascript',
  },
  json: {
    name: 'javascript',
    json: true,
  },
  ts: {
    name: 'javascript',
    typescript: true,
  },
  vue: 'htmlmixed',
}

const onChange = debounce((code: string) => {
  store.state.activeFile.code = code
}, 250)

const activeMode = computed(() => {
  const { filename } = store.state.activeFile
  const mode = modes[filename.split('.').pop()!]

  return filename.lastIndexOf('.') !== -1 && mode
    ? mode
    : modes.js
})
</script>

<template>
  <FileSelector />
  <div class="editor-container">
    <CodeMirror
      @change="onChange"
      :value="store.state.activeFile.code"
      :mode="activeMode"
    />
    <Message :err="store.state.errors[0]" />
  </div>
</template>

<style scoped>
.editor-container {
  height: calc(100% - var(--header-height));
  overflow: hidden;
  position: relative;
}
</style>
