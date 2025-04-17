<script setup lang="ts">
import { inject, onMounted, ref, useTemplateRef, watch } from 'vue'
import LunaConsole from 'luna-console'
import { type LogPayload, injectKeyProps } from '../types'
import 'luna-object-viewer/luna-object-viewer.css'
import 'luna-data-grid/luna-data-grid.css'
import 'luna-dom-viewer/luna-dom-viewer.css'
import 'luna-console/luna-console.css'

const { store, theme } = inject(injectKeyProps)!
const lunaRef = useTemplateRef('luna-ref')
const lunaConsole = ref<LunaConsole>()

onMounted(() => {
  if (!lunaRef.value) return
  lunaConsole.value = new LunaConsole(lunaRef.value, {
    theme: theme.value || 'light',
  })
  store.value.executeLog = ({ logLevel, data = [] }: LogPayload) => {
    ;(lunaConsole.value?.[logLevel] as any)?.(...data)
  }
})

function clearLunaConsole() {
  lunaConsole.value?.clear(true)
}

watch(() => store.value.activeFile.code, clearLunaConsole)
</script>

<template>
  <div class="console-container">
    <div ref="luna-ref" />
    <button class="clear-btn" @click="clearLunaConsole">clear</button>
  </div>
</template>

<style scoped>
.console-container {
  height: 100%;
  width: 100%;
}
.luna-console-theme-dark {
  background-color: var(--bg) !important;
}
.clear-btn {
  position: absolute;
  font-size: 18px;
  font-family: var(--font-code);
  color: #999;
  top: 10px;
  right: 10px;
  z-index: 99;
  padding: 8px 10px 6px;
  background-color: var(--bg);
  border-radius: 4px;
  border: 1px solid var(--border);
  &:hover {
    color: var(--color-branding);
  }
}
</style>
