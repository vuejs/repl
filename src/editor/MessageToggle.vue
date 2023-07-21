<script setup lang="ts">
const visible = defineModel<boolean>()
</script>

<template>
  <div class="wrapper" @click="visible = !visible">
    <span>Show Error</span>
    <div class="toggle" :class="[{ active: modelValue }]">
      <div class="indicator" />
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  position: absolute;
  bottom: 8px;
  right: 15px;
  z-index: 11;
  display: flex;
  align-items: center;
  background-color: var(--bg);
  color: var(--text-light);
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 2px;
  user-select: none;
}
.toggle {
  display: inline-block;
  margin-left: 4px;
  width: 32px;
  height: 18px;
  border-radius: 12px;
  position: relative;
  background-color: var(--border);
}

.indicator {
  font-size: 12px;
  background-color: var(--text-light);
  width: 14px;
  height: 14px;
  border-radius: 50%;
  transition: transform ease-in-out 0.2s;
  position: absolute;
  left: 2px;
  top: 2px;
  color: var(--bg);
  text-align: center;
}

.active .indicator {
  background-color: var(--color-branding);
  transform: translateX(14px);
  color: white;
}
</style>
