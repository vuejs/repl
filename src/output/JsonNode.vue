<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { isObject, parse, word } from '../utils'
const emits = defineEmits<{
  click: []
}>()
const props = defineProps({
  keyData: {
    key: String,
    required: true,
  },
  value: [Object, Number, String],
  marginOffset: {
    type: Number,
    default: 0,
  },
  open: Boolean,
})

const renderValue = computed(() => {
  const value = props.value
  if (Array.isArray(value)) return value
  if (isObject(value)) {
    const t = value as any
    for (const k in t) if (isObject(t[k])) return '{...}'
  }
  return value
})

watchEffect(() => console.log(props.marginOffset))
</script>

<template>
  <div
    class="tree"
    :style="`margin-left: ${marginOffset}rem`"
    @click="emits('click')"
  >
    <svg
      v-if="Object.keys(parse(value)).length > 0"
      :class="{ open }"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      version="1.1"
      viewBox="0 0 960 560"
      enable-background="new 0 0 960 560"
    >
      <path
        d="M480,344.181L268.869,131.889c-15.756-15.859-41.3-15.859-57.054,0c-15.754,15.857-15.754,41.57,0,57.431l237.632,238.937   c8.395,8.451,19.562,12.254,30.553,11.698c10.993,0.556,22.159-3.247,30.555-11.698l237.631-238.937   c15.756-15.86,15.756-41.571,0-57.431s-41.299-15.859-57.051,0L480,344.181z "
      />
    </svg>
    <span v-if="keyData !== 'root'" class="tree__title"> {{ keyData }}: </span>
    <span>
      {{ renderValue }}
    </span>
  </div>
</template>

<style>
.tree {
  color: white;
  cursor: pointer;
  user-select: none;
  /* margin-bottom: 1em; */
  display: flex;
  align-items: center;
  gap: 0.2em;
  svg {
    transition: all 200ms;
    width: 1em;
    height: 1em;
    fill: currentColor;
  }

  svg:not(.open) {
    transform: rotate(-90deg);
  }
}

.tree__title {
  font-weight: 500;
}

.block {
  display: block;
}
</style>
