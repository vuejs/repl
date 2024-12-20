
<script setup lang="ts">
import { computed, ref, type PropType } from 'vue'
import JsonNode from './JsonNode.vue';
import { parse } from '../utils';

const props = defineProps({
  key: {
    key: String,
    default: 'root',
  },
  data: Object as PropType<Record<string, any>>,
  marginOffset: {
    type: Number,
    default: 1,
  }
})

const open = ref(false)

const entries = computed(() => parse(props.data))
</script>

<template>
  <JsonNode :key="key" :value="data" :margin-offset="marginOffset" />
  <template v-if="entries && open">
    <JsonTree v-for="[k, v] in entries" :key="k" :data="v" :margin-offset="marginOffset + 1" />
  </template>
</template>
