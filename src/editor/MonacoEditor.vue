<script setup lang="ts">
import Monaco from '../monaco/Monaco.vue'
import type { EditorEmits, EditorMethods, EditorProps } from '../types'
import { useTemplateRef } from 'vue'

defineProps<EditorProps>()
const emit = defineEmits<EditorEmits>()

defineOptions({
  editorType: 'monaco',
})

const monacoRef = useTemplateRef('monaco')

const onChange = (code: string) => {
  emit('change', code)
}

defineExpose({
  getEditorIns: (() =>
    monacoRef.value?.getEditorIns()) as EditorMethods['getEditorIns'],
  getMonacoEditor: () => monacoRef.value?.getMonacoEditor(),
})
</script>

<template>
  <Monaco
    ref="monaco"
    :filename="filename"
    :value="value"
    :readonly="readonly"
    :mode="mode"
    @change="onChange"
  />
</template>
