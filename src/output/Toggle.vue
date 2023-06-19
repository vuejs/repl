<script setup lang="ts">
  withDefaults(defineProps<{
    modelValue: boolean
  }>(), {
    modelValue: false
  })

  defineEmits<{
    (e: 'update:modelValue', next: boolean): void 
  }>()
</script>
<template>
  <div class="toggle" :class="[{ active: modelValue }]" @click="$emit('update:modelValue', !modelValue)">
    <div class="indicator">
      {{ modelValue ? 'on' : 'off' }}
    </div>
  </div>
</template>
<style scoped>
.toggle {
  display: inline-block;
  width: 48px;
  cursor: pointer;
  height: 24px;
  border-radius: 12px;
  position: relative;
  background-color: var(--border);
}

.indicator {
  background-color: var(--text-light);
  width: 20px;  
  height: 20px;
  border-radius: 16px;
  transition: transform ease-in-out .2s;
  position: absolute;
  left: 2px;
  top: 2px;
  color: var(--bg);
  text-align: center;
}

.active .indicator {
  background-color: var(--color-branding);
  transform: translateX(24px);
  color: white;
}
</style>