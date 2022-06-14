<script setup lang="ts">
import CodeMirror from '../codemirror/CodeMirror.vue'
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

const activeMode = computed(() => {
  const filename = props.filename
  return filename.endsWith('.vue') || filename.endsWith('.html')
    ? 'htmlmixed'
    : filename.endsWith('.css')
    ? 'css'
    : 'javascript'
})
</script>

<template>
  <CodeMirror
    @change="onChange"
    :value="value"
    :mode="activeMode"
  />
</template>

