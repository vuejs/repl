<template>
  <div>
    <h1>Welcome to Pinia Demo</h1>
    <p>Store message: {{ store.message }}</p>
    <button @click="updateMessage">Update Message</button>
  </div>
</template>

<script setup>
import { useMainStore } from './store'

const store = useMainStore()

function updateMessage() {
  store.updateMessage('Message updated at ' + new Date().toLocaleTimeString())
}
</script>
