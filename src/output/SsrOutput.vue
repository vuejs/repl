<script setup lang="ts">
defineProps<{
  html: string
  context: unknown
}>()
</script>

<template>
  <div class="ssr-output">
    <strong>HTML</strong>
    <pre class="ssr-output-pre">{{ html }}</pre>
    <strong>Context</strong>
    <pre class="ssr-output-pre">{{ context }}</pre>
  </div>
</template>

<style scoped>
.ssr-output {
  background: var(--bg);
  box-sizing: border-box;
  color: var(--text-light);
  height: 100%;
  overflow: auto;
  padding: 10px;
  width: 100%;
}

.ssr-output-pre {
  font-family: var(--font-code);
  white-space: pre-wrap;
}
</style>
