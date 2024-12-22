<script setup lang="ts">
import { computed, ref } from 'vue'
import JsonNode from './JsonNode.vue'
import { parse } from '../utils'

const props = defineProps({
  keyData: {
    key: String,
    default: 'root',
  },
  data: [Object, Number, String],
  marginOffset: {
    type: Number,
    default: 1,
  },
})

const open = ref(false)

const entries = computed(() => parse(props.data))
</script>

<template>
  <JsonNode
    :keyData="keyData"
    :value="data"
    :margin-offset="marginOffset"
    :open="open"
    @click="open = !open"
  />
  <template v-if="entries && open">
    <div class="hah">
      <JsonTree
        v-for="([k, v], idx) in entries"
        :key="idx"
        :key-data="k"
        :data="v"
        :margin-offset="marginOffset + 1"
      />
    </div>
  </template>
</template>

<style>
.hah {
  display: inline-block;
  width: 100%;
}
</style>
