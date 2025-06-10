<script setup lang="ts">
import Preview from './Preview.vue'
import SsrOutput from './SsrOutput.vue'
import { computed, inject, useTemplateRef, watchEffect } from 'vue'
import {
  type EditorComponentType,
  type OutputModes,
  injectKeyProps,
} from '../types'

const props = defineProps<{
  editorComponent: EditorComponentType
  showCompileOutput?: boolean
  showSsrOutput?: boolean
  ssr: boolean
}>()

const { store } = inject(injectKeyProps)!
const previewRef = useTemplateRef('preview')
const modes = computed(() => {
  const outputModes: OutputModes[] = ['preview']
  if (props.showCompileOutput) {
    outputModes.push('js', 'css', 'ssr')
  }
  if (props.ssr && props.showSsrOutput) {
    outputModes.push('ssr output')
  }
  return outputModes
})

const mode = computed<OutputModes>({
  get: () => store.value.outputMode,
  set: (value) => (store.value.outputMode = value),
})

watchEffect(() => {
  if (!modes.value.includes(mode.value)) {
    mode.value = modes.value[0]
  }
})

function reload() {
  previewRef.value?.reload()
}

defineExpose({ reload, previewRef })
</script>

<template>
  <div class="tab-buttons">
    <button
      v-for="m of modes"
      :key="m"
      :class="{ active: mode === m }"
      @click="mode = m"
    >
      <span>{{ m }}</span>
    </button>
  </div>

  <div class="output-container">
    <Preview ref="preview" :show="mode === 'preview'" :ssr="ssr" />
    <SsrOutput
      v-if="mode === 'ssr output'"
      :context="store.ssrOutput.context"
      :html="store.ssrOutput.html"
    />
    <props.editorComponent
      v-else-if="mode !== 'preview'"
      readonly
      :filename="store.activeFile.filename"
      :value="store.activeFile.compiled[mode]"
      :mode="mode"
    />
  </div>
</template>

<style scoped>
.output-container {
  height: calc(100% - var(--header-height));
  overflow: hidden;
  position: relative;
}

.tab-buttons {
  box-sizing: border-box;
  border-bottom: 1px solid var(--border);
  background-color: var(--bg);
  height: var(--header-height);
  overflow: hidden;
}
.tab-buttons button {
  padding: 0;
  box-sizing: border-box;
}
.tab-buttons span {
  font-size: 13px;
  font-family: var(--font-code);
  text-transform: uppercase;
  color: var(--text-light);
  display: inline-block;
  padding: 8px 16px 6px;
  line-height: 20px;
}
button.active {
  color: var(--color-branding-dark);
  border-bottom: 3px solid var(--color-branding-dark);
}
</style>
