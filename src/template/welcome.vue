<script setup>
import { ref } from 'vue'
import { FusionAppContainer, FusionButton } from '@fds/fusion'

const count = ref(0)
</script>

<template>
  <FusionAppContainer>
    <FusionButton @press="count++"
      >You've clicked this button {{ count }} times!</FusionButton
    >
  </FusionAppContainer>
</template>
