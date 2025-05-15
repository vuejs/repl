<template>
  <div class="container">
    <ScenarioSelector
      :options="configs"
      :defaltValue="configs[0].value"
      v-model="selectedScenario"
    ></ScenarioSelector>
    <Repl v-if="currentScenario" v-bind="replConfigs" />
  </div>
</template>

<script setup lang="ts">
import { type OutputModes, Repl, useStore, useVueImportMap } from '../../src'
import ScenarioSelector from './ScenarioSelector.vue'
import MonacoEditor from '../../src/editor/MonacoEditor.vue'
// @ts-ignore
import playgroundFiles from 'virtual:playground-files'
import { ref, computed, watchEffect } from 'vue'

const selectedScenario = ref('')

const configs = Object.keys(playgroundFiles).map((key) => {
  return {
    value: key,
    label: key,
  }
})
const currentScenario = computed(() => {
  return playgroundFiles[selectedScenario.value]
})

watchEffect(() => {
  console.log('currentScenario', currentScenario.value)
  if (currentScenario.value) {
    const scenario = currentScenario.value
    store.setFiles(scenario.files, scenario.mainFile)
  }
})

const store = useStore()

const replConfigs = computed(() => ({
  store,
  editor: MonacoEditor,
  editorOptions: {
    autoSaveText: '💾',
  },
  ...(currentScenario.value.ReplOptions || {}),
}))
</script>

<style scoped>
.container {
  height: 100vh;
}
</style>
