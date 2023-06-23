<script setup lang="ts">
import FileSelector from './FileSelector.vue'
import Message from '../Message.vue'
import { debounce } from '../utils'
import { inject } from 'vue'
import { Store } from '../store'
import type { EditorComponentType } from './types'

const props = defineProps<{
  editorComponent: EditorComponentType
}>()

const store = inject('store') as Store

const onChange = debounce((code: string) => {
  store.state.activeFile.code = code
}, 250)
</script>

<template>
  <FileSelector />
  <div class="editor-container">
    <props.editorComponent
      @change="onChange"
      :value="store.state.activeFile.code"
      :filename="store.state.activeFile.filename"
    />
    <Message
      v-if="props.editorComponent.editorType !== 'monaco'"
      :err="store.state.errors[0]"
    />
  </div>
</template>

<style scoped>
.editor-container {
  height: calc(100% - var(--header-height));
  overflow: hidden;
  position: relative;
}
</style>
