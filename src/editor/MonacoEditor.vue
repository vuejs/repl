<script lang="ts">
export default {
  editorType: 'monaco'
}
</script>

<script setup lang="ts">
import Monaco from '../monaco/Monaco.vue'

defineProps<{
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
</script>

<template>
  <Monaco
    @change="onChange"
    :filename="filename"
    :readonly="readonly"
  />
</template>
