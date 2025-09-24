<template>
  <div>
    <h2>Vue Router Demo</h2>
    <nav>
      <RouterLink to="/">Home</RouterLink> |
      <RouterLink to="/about">About</RouterLink>
    </nav>
    <router-view />
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
// Add your setup code here
</script>
