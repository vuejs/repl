<script setup lang="ts">
import { computed, inject, useTemplateRef } from 'vue'
import { injectKeyProps } from '../../src/types'
import Sandbox from './Sandbox.vue'

const props = defineProps<{ show: boolean; ssr: boolean }>()

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
  />
</template>
