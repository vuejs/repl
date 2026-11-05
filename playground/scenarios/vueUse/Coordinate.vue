<template>
  <div class="coordinate">
    <span class="coordinate-value">{{ value }}</span>
    <span class="coordinate-label"> Mouse {{ label }} </span>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  label: string
  value: number
}>()
</script>

<style scoped>
.coordinate {
  font-family: monospace;
  background-color: #f3f4f6; /* light-500 */
  color: #111827; /* dark-900 */
  display: flex;
  flex-direction: column;
  text-align: center;
  padding: 0.5rem;
  border-radius: 0.5rem;
}
.coordinate-value {
  font-size: 2.25rem; /* text-4xl */
}
.coordinate-label {
  font-size: 0.875rem; /* text-sm */
  margin-top: 0.5rem;
  color: #2563eb; /* blue-600, 更明显 */
  opacity: 0.8;
}
</style>
