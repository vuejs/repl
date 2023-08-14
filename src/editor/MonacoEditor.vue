<script setup lang="ts">
import Monaco from '../monaco/Monaco.vue'
import type { EditorEmits, EditorProps } from './types'

defineProps<EditorProps>()
const emit = defineEmits<EditorEmits>()

defineOptions({
  editorType: 'monaco',
})

const onSave = (code: string) => {
  emit('save', code)
}
</script>

<template>
  <Monaco
    @save="onSave"
    :filename="filename"
    :value="value"
    :readonly="readonly"
    :mode="mode"
  />
</template>
