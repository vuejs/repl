<script setup lang="ts">
import {ref} from "vue";

const keyword = ref('')
</script>

<template>
<div>
    <input type="text" v-model="keyword">
</div>
</template>

<style scoped>

</style>
