<script setup lang="ts">
import { computed, inject, useTemplateRef } from 'vue'
import { injectKeyProps } from '../../src/types'
import Sandbox from './Sandbox.vue'
import LunaConsole from 'luna-console'

const props = defineProps<{
  show: boolean
  ssr: boolean
  lunaConsole?: LunaConsole
}>()

const { store, clearConsole, theme, previewTheme, previewOptions } =
  inject(injectKeyProps)!

const sandboxTheme = computed(() =>
  previewTheme.value ? theme.value : undefined,
)

const sandboxRef = useTemplateRef('sandbox')
const container = computed(() => sandboxRef.value?.container)

defineExpose({
  reload: () => sandboxRef.value?.reload(),
  container,
})
</script>

<template>
  <Sandbox
    ref="sandbox"
    :show="props.show"
    :store="store"
    :theme="sandboxTheme"
    :preview-options="previewOptions"
    :ssr="props.ssr"
    :clear-console="clearConsole"
    :luna-console="props.lunaConsole"
  />
</template>
