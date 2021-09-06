<script setup lang="ts">
import SplitPane from './SplitPane.vue'
import Editor from './editor/Editor.vue'
import Output from './output/Output.vue'
import { ReplStore } from './store'
import { provide } from 'vue'

const props = withDefaults(
  defineProps<{
    store?: ReplStore
    showCompileOutput?: boolean
  }>(),
  {
    store: () => new ReplStore(),
    showCompileOutput: false
  }
)

provide('store', props.store)
</script>

<template>
  <div class="vue-repl">
    <SplitPane>
      <template #left>
        <Editor />
      </template>
      <template #right>
        <Output :showCompileOutput="props.showCompileOutput" />
      </template>
    </SplitPane>
  </div>
</template>

<style scoped>
.vue-repl {
  font-size: 13px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  color: var(--base);
  margin: 0;
  background-color: #f8f8f8;
  --base: #444;
  --font-code: 'Source Code Pro', monospace;
  --color-branding: #3ca877;
  --color-branding-dark: #416f9c;
}

:deep(button) {
  border: none;
  outline: none;
  cursor: pointer;
  margin: 0;
  background-color: transparent;
}
</style>
