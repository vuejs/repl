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

const { store, autoSave, switchAutoSave } = inject(injectKeyProps)!
const showMessage = ref(getItem())
const auto_save = ref(autoSave.value)

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

watch(auto_save, switchAutoSave.value)
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
    <ToggleButton v-model="showMessage" />
    <ToggleButton v-model="auto_save" text="Auto Save" bottom="48px" />
  </div>
</template>

<style scoped>
.editor-container {
  height: calc(100% - var(--header-height));
  overflow: hidden;
  position: relative;
}
</style>
