<script lang="ts">
export default {
  editorType: 'monaco'
}
</script>

<script setup lang="ts">
import Monaco from '../monaco/Monaco.vue'
import type { PreviewMode } from '../types';

defineProps<{
  value: string;
  filename: string;
  readonly?: boolean
  mode?: PreviewMode
}>()

const emits = defineEmits<{
  (e: 'change', code: string): void;
}>()

const onChange = (code: string) => {
  emits('change', code)
}
</script>

<template>
  <Monaco
    @change="onChange"
    :filename="filename"
    :value="value"
    :readonly="readonly"
    :mode="mode"
  />
</template>
