<template>
  <div>
    <button @click="increment">Increment</button>
    <p>Counter: {{ counter }}</p>
  </div>
</template>

<script lang="ts" setup>
// a simple demo check Repl default config
import { ref } from 'vue'
const counter = ref(0)
const increment = () => {
  counter.value++
}
</script>
