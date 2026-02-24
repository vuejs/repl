<script setup lang="ts">
import Message from './Message.vue';
import SplitPane from './SplitPane.vue'
import { computed } from 'vue'

const props = defineProps<{
  layout?: 'horizontal' | 'vertical'
  layoutReverse?: boolean
}>()

const editorSlotName = computed(() => (props.layoutReverse ? 'right' : 'left'))
const outputSlotName = computed(() => (props.layoutReverse ? 'left' : 'right'))
</script>

<template>
  <!-- Editor and Output -->
  <SplitPane v-if="$slots.editor && $slots.output" :layout="layout">
    <template #[editorSlotName]>
      <slot name="editor" />
    </template>
    <template #[outputSlotName]>
      <slot name="output" />
    </template>
  </SplitPane>
  <!-- Editor only -->
  <slot v-else-if="$slots.editor" name="editor" />
  <!-- Output only -->
  <slot v-else-if="$slots.output" name="output" />
  <!-- Warning -->
  <Message v-else warn="Nothing to show with !showOutput and !showEditor" permanent />
</template>
