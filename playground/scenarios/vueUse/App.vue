<template>
  <div class="app-container">
    <Coordinate label="X" :value="x" />
    <Coordinate label="Y" :value="y" />
  </div>
</template>

<script lang="ts" setup>
import { useMouse } from '@vueuse/core'
import Coordinate from './Coordinate.vue'

const { x, y } = useMouse()
</script>

<style scoped>
.app-container {
  display: grid;
  grid-auto-flow: column;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-family: monospace;
}
</style>
