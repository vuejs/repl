<script setup>
import { ref } from 'vue'
import { SomeComponent, SomeOtherComponent, Box } from 'sample-vue-library'

const msg = ref('Hello World!')
</script>

<template>
  <h1>{{ msg }}</h1>
  <input v-model="msg" />
</template>
