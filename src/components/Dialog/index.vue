<script lang="ts" setup>
import { computed } from "vue";
import IconClose from "../Icon/IconClose.vue";

interface Props {
    modelValue: boolean
  title?: string
  width?: string | number
}

const props = withDefaults(defineProps<Props>(),{
  title: '',
  width: 500
})

const emits = defineEmits<{
    (e: 'update:modelValue', val: boolean): void
}>()

const visible = computed({
  get() {
    return props.modelValue
  },
  set(val) {
      emits('update:modelValue', val)
  }
})

</script>

<template>
  <div v-if="visible" class="dialog-overlay">
      <div class="dialog-container" :style="{ width: `${width}px` }">
          <div class="dialog-header">
              <div>{{title}}</div>
              <div class="close" @click="visible = false"><IconClose/></div>
          </div>
          <div class="dialog-body" >
              <slot class="">121212121</slot>
          </div>
      </div>
  </div>
</template>

<style scoped>
.dialog-overlay {
  position: fixed;
  z-index: 1000;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
    color: var(--text-light);
}
.dialog-header{
    display: flex;
    height: 40px;
    padding: 0 16px;
    border-bottom:1px solid var(--border);
    justify-content: space-between;
    align-items: center;

}
.dialog-header .close{
    cursor: pointer;
}
.dialog-container{
    background-color: var(--bg-soft);
    border-radius: 4px;
}
.dialog-body {
  border-radius: 4px;
}
</style>
