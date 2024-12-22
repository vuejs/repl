<script setup lang="ts">
import { CommandData } from '../types'
import ConsoleLine from './ConsoleLine.vue'

defineProps<{ logs: CommandData[] }>()
</script>

<template>
  <div class="container">
    <ConsoleLine v-for="(log, i) in logs" :log="log" :key="i" />
  </div>
</template>

<style>
.container {
  position: relative;
}
</style>
