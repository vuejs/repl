<script setup lang="ts">
import FileSelector from './FileSelector.vue'
import CodeMirror from '../codemirror/CodeMirror.vue'
import Message from '../Message.vue'
import { debounce } from '../utils'
import { ref, watch, computed, inject } from 'vue'
import { ReplStore } from '../store'

const store = inject('store') as ReplStore

const onChange = debounce((code: string) => {
  store.activeFile.code = code
}, 250)

const activeCode = ref(store.activeFile.code)
const activeMode = computed(() =>
  store.state.activeFilename.endsWith('.vue') ? 'htmlmixed' : 'javascript'
)

watch(
  () => store.state.activeFilename,
  () => {
    activeCode.value = store.activeFile.code
  }
)
</script>

<template>
  <FileSelector />
  <div class="editor-container">
    <CodeMirror @change="onChange" :value="activeCode" :mode="activeMode" />
    <Message :err="store.state.errors[0]" />
  </div>
</template>

<style scoped>
.editor-container {
  height: calc(100% - 35px);
  overflow: hidden;
  position: relative;
}
</style>
