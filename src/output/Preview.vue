<script setup lang="ts">
import { computed, inject, useTemplateRef } from 'vue'
import { injectKeyProps, SandboxEmits } from '../../src/types'
import Sandbox from './Sandbox.vue'

const props = defineProps<{
  show: boolean
  ssr: boolean
}>()
const emit = defineEmits<SandboxEmits>()

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
    @log="(p) => emit('log', p)"
  />
</template>
