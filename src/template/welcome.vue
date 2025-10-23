<script setup>
import { ref } from 'vue'
import { SomeComponent, SomeOtherComponent, Box } from 'sample-vue-library'
</script>

<template>
  <Box border="shadow">
    <SomeComponent foo="world!" />
  </Box>

  <Box border="grey">
    <SomeOtherComponent :bar="9" />
  </Box>
</template>
