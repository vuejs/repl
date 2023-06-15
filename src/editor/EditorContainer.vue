<script setup lang="ts">
import FileSelector from './FileSelector.vue'
import Message from '../Message.vue'
import { debounce } from '../utils'
import { inject, toRef } from 'vue'
import { Store } from '../store'
import { EditorComponentType } from '../types'

const props = defineProps<{
  editorComponent: EditorComponentType
}>()

const EditorComponent = toRef(props, 'editorComponent')

const store = inject('store') as Store

const onChange = debounce((code: string) => {
  store.state.activeFile.code = code
}, 250)
</script>

<template>
  <FileSelector />
  <div class="editor-container">
    <EditorComponent
      @change="onChange"
      :value="store.state.activeFile.code"
      :filename="store.state.activeFile.filename"
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
