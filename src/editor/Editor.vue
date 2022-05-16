<script setup lang="ts">
import FileSelector from './FileSelector.vue'
import Monaco from '../monaco/Monaco.vue'
import Message from '../Message.vue'
import { computed, inject } from 'vue'
import { Store } from '../store'

const store = inject('store') as Store

const onChange = (code: string) => {
  store.state.activeFile.code = code
}

const language = computed(() => {
  const { filename } = store.state.activeFile
  if (filename.endsWith('.vue')) {
    return 'vue'
  }
  if (filename.endsWith('.html')) {
    return 'html'
  }
  if (filename.endsWith('.css')) {
    return 'css'
  }
  if (filename.endsWith('.ts')) {
    return 'typescript'
  }
  return 'javascript'
})
</script>

<template>
  <FileSelector />
  <div class="editor-container">
    <Monaco
      :value="store.state.activeFile.code"
      :language="language"
      @save="onChange"
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
