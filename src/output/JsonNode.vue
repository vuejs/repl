<script setup lang="ts">
import { word } from '../utils';
defineProps({
  key: {
    key: String,
    required: true,
  },
  value: Object as any,
  marginOffset: {
    type: Number,
    default: 0,
  },
  open: Boolean,
})
</script>

<template>

  <div class="tree" :style="`margin-left: ${marginOffset}rem`">
    <span v-if="open && key">
      <
    </span>
    <span v-else-if="!open && key">
      >
    </span>
    <span v-if="key" class="tree__title">
      {{ key }}:
    </span>
    <span>
      {{typeof value === 'object' && value ? word(Object.keys(value).length, 'property', 'properties') : value}}
    </span>
  </div>

</template>

<style>
	.tree {
    color: white;
    cursor: 'pointer';
    user-select: none;
		margin-bottom: 1em;
		display: flex;
    align-items: center;
		gap: 0.2em;
	}

	.tree__title{
		font-weight: 500;
	}

	.block{
		display:block;
	}
</style>

