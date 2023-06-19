<script setup lang="ts">
import Preview from './Preview.vue'
import CodeMirror from '../codemirror/CodeMirror.vue'
import { Store } from '../store'
import { inject, ref, computed, Ref } from 'vue'
import type { OutputModes } from './types'
import Toggle from './Toggle.vue'

const props = defineProps<{
  showCompileOutput?: boolean
  ssr: boolean
}>()

const store = inject('store') as Store
const modes = computed(() =>
  props.showCompileOutput
    ? (['preview', 'js', 'css', 'ssr'] as const)
    : (['preview'] as const)
)

const mode = ref<OutputModes>(
  (modes.value as readonly string[]).includes(store.initialOutputMode)
    ? store.initialOutputMode as OutputModes
    : 'preview'
)

const showMessage = inject('showMessage') as Ref<boolean>

</script>

<template>
  <div class="top-panel">
    <div class="tab-buttons">
      <button
        v-for="m of modes"
        :class="{ active: mode === m }"
        @click="mode = m"
      >
        <span>{{ m }}</span>
      </button>
    </div>
    <div class="message-toggle">
      Message
      <Toggle v-model="showMessage" />
    </div>
  </div>

  <div class="output-container">
    <Preview :show="mode === 'preview'" :ssr="ssr" />
    <CodeMirror
      v-if="mode !== 'preview'"
      readonly
      :mode="mode === 'css' ? 'css' : 'javascript'"
      :value="store.state.activeFile.compiled[mode]"
    />
  </div>
</template>

<style scoped>
.top-panel {
  background-color: var(--bg);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.message-toggle {
  color: var(--text-light);
  display: flex;
  align-items: center;
  gap: 12px;
}

.output-container {
  height: calc(100% - var(--header-height));
  overflow: hidden;
  position: relative;
}

.tab-buttons {
  box-sizing: border-box;
  border-bottom: 1px solid var(--border);
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
