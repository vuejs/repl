<template>
  <div>
    <h3>About Page</h3>
    <p>This is a demo of Vue Router in a sandbox environment</p>
    <button @click="goHome">Go Home</button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function goHome() {
  router.push('/')
}
</script>
