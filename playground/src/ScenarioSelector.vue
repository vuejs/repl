<template>
  <div class="scenario-switcher">
    <label>
      scenarios:
      <select v-model="model">
        <option
          v-for="option in options"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
    </label>
  </div>
</template>

<script setup lang="ts">
interface Option {
  value: string
  label: string
}

const props = defineProps<{
  options: Option[]
  defaltValue?: string
}>()
const model = defineModel<string>()
model.value = props.defaltValue || props.options?.[0]?.value
</script>

<style scoped>
.scenario-switcher {
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.8);
  padding: 10px;
  border-radius: 4px;
  color: white;
  font-family: sans-serif;
  font-size: 12px;
}
.scenario-switcher select {
  margin-left: 5px;
  padding: 2px;
}
</style>
