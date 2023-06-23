<script setup lang="ts">
import FileSelector from './FileSelector.vue'
import Message from '../Message.vue'
import { debounce } from '../utils'
import { inject, ref } from 'vue'
import { Store } from '../store'
import MessageToggle from './MessageToggle.vue'
import type { EditorComponentType } from './types'

const props = defineProps<{
  editorComponent: EditorComponentType
}>()

const store = inject('store') as Store
const showMessage = ref(true)

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
    <template v-if="editorComponent.editorType !== 'monaco'">
      <Message
        v-if="showMessage"
        :err="store.state.errors[0]"
      />
      <MessageToggle v-model="showMessage" />
    </template>
  </div>
</template>

<style scoped>
.editor-container {
  height: calc(100% - var(--header-height));
  overflow: hidden;
  position: relative;
}
</style>
