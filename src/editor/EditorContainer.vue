<script setup lang="ts">
import FileSelector from './FileSelector.vue'
import Message from '../Message.vue'
import { debounce } from '../utils'
import { inject, ref, watch } from 'vue'
import ToggleButton from './ToggleButton.vue'
import { type EditorComponentType, injectKeyProps } from '../types'

const SHOW_ERROR_KEY = 'repl_show_error'

const props = defineProps<{
  editorComponent: EditorComponentType
}>()

const { store, autoSave, editorOptions } = inject(injectKeyProps)!
const showMessage = ref(getItem())

const onChange = debounce((code: string) => {
  store.value.activeFile.code = code
}, 250)

function setItem() {
  localStorage.setItem(SHOW_ERROR_KEY, showMessage.value ? 'true' : 'false')
}

function getItem() {
  const item = localStorage.getItem(SHOW_ERROR_KEY)
  return !(item === 'false')
}

watch(showMessage, () => {
  setItem()
})
</script>

<template>
  <FileSelector />
  <div class="editor-container">
    <props.editorComponent
      :value="store.activeFile.code"
      :filename="store.activeFile.filename"
      @change="onChange"
    />
    <Message v-show="showMessage" :err="store.errors[0]" />

    <div class="editor-floating">
      <ToggleButton
        v-if="editorOptions?.showErrorText !== false"
        v-model="showMessage"
        :text="editorOptions?.showErrorText || 'Show Error'"
      />
      <ToggleButton
        v-if="editorOptions?.autoSaveText !== false"
        v-model="autoSave"
        :text="editorOptions?.autoSaveText || 'Auto Save'"
      />
    </div>
  </div>
</template>

<style scoped>
.editor-container {
  height: calc(100% - var(--header-height));
  overflow: hidden;
  position: relative;
}

.editor-floating {
  position: absolute;
  bottom: 16px;
  right: 16px;
  z-index: 11;
  display: flex;
  flex-direction: column;
  align-items: end;
  gap: 8px;
  background-color: var(--bg);
  color: var(--text-light);
  padding: 8px;
}
</style>
