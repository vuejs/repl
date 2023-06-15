<script setup lang="ts">
import CodeMirror, { type Props } from '../codemirror/CodeMirror.vue'
import { computed } from 'vue'

const props = defineProps<{
  value: string;
  filename: string;
  readonly?: boolean
}>()

const emits = defineEmits<{
  (e: 'change', code: string): void;
}>()

const onChange = (code: string) => {
  emits('change', code)
}

const modes: Record<string, Props['mode']> = {
  css: 'css',
  html: 'htmlmixed',
  js: {
    name: 'javascript',
  },
  json: {
    name: 'javascript',
    json: true,
  },
  ts: {
    name: 'javascript',
    typescript: true,
  },
  vue: 'htmlmixed',
}

const activeMode = computed(() => {
  const { filename } = props
  const mode = modes[filename.split('.').pop()!]

  return filename.lastIndexOf('.') !== -1 && mode
    ? mode
    : modes.js
})
</script>

<template>
  <CodeMirror
    @change="onChange"
    :value="value"
    :mode="activeMode"
  />
</template>

