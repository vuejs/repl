<script setup lang="ts">
import Preview from './Preview.vue'
import SplitPane from '../SplitPane.vue'
import {
  computed,
  inject,
  onMounted,
  ref,
  useTemplateRef,
  watch,
  type WatchHandle,
} from 'vue'
import LunaConsole from 'luna-console'
import {
  type EditorComponentType,
  type LogPayload,
  type OutputModes,
  injectKeyProps,
} from '../types'

const props = defineProps<{
  editorComponent: EditorComponentType
  showCompileOutput?: boolean
  ssr: boolean
}>()

const { store, showConsole, theme } = inject(injectKeyProps)!
const previewRef = useTemplateRef('preview')
const consoleContainerRef = useTemplateRef('console-container')
const lunaConsole = ref<LunaConsole>()
let lunaWatcher: WatchHandle | undefined = undefined

onMounted(createConsole)

watch(
  showConsole,
  (val) => {
    if (val) {
      createConsole()
    } else {
      lunaConsole.value = undefined
      lunaWatcher?.stop()
    }
  },
  { flush: 'post' },
)

function createConsole() {
  if (!consoleContainerRef.value || lunaConsole.value) return
  lunaConsole.value = new LunaConsole(consoleContainerRef.value, {
    theme: theme.value || 'light',
  })
  lunaWatcher ??= watch(() => store.value.activeFile.code, clearLunaConsole)
  lunaWatcher.resume()
}

const modes = computed(() =>
  props.showCompileOutput
    ? (['preview', 'js', 'css', 'ssr'] as const)
    : (['preview'] as const),
)

const mode = computed<OutputModes>({
  get: () =>
    (modes.value as readonly string[]).includes(store.value.outputMode)
      ? store.value.outputMode
      : 'preview',
  set(value) {
    if ((modes.value as readonly string[]).includes(store.value.outputMode)) {
      store.value.outputMode = value
    }
  },
})

function onLog({ logLevel, data = [] }: LogPayload) {
  ;(lunaConsole.value?.[logLevel] as any)?.(...data)
}

function clearLunaConsole() {
  lunaConsole.value?.clear(true)
}

function reload() {
  previewRef.value?.reload()
  clearLunaConsole()
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
    <SplitPane v-if="showConsole" layout="vertical">
      <template #left>
        <Preview
          ref="preview"
          :show="mode === 'preview'"
          :ssr="ssr"
          @log="onLog"
        />
      </template>
      <template #right>
        <div ref="console-container" />
        <button class="clear-btn" @click="clearLunaConsole">clear</button>
      </template>
    </SplitPane>
    <Preview v-else ref="preview" :show="mode === 'preview'" :ssr="ssr" />
    <props.editorComponent
      v-if="mode !== 'preview'"
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
