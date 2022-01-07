<script setup lang="ts">
import { ref, reactive, computed } from 'vue'

const props = defineProps<{ layout?: string }>()
const isVertical = computed(() => props.layout === 'vertical')

const container = ref()

// mobile only
const showOutput = ref(false)

const state = reactive({
  dragging: false,
  split: 50
})

function boundSplit() {
  const { split } = state
  return split < 20 ? 20 : split > 80 ? 80 : split
}

let startPosition = 0
let startSplit = 0

function dragStart(e: MouseEvent) {
  state.dragging = true
  startPosition = isVertical.value ? e.pageY : e.pageX
  startSplit = boundSplit()
}

function dragMove(e: MouseEvent) {
  if (state.dragging) {
    const position = isVertical.value ? e.pageY : e.pageX
    const totalSize = isVertical.value
      ? container.value.offsetHeight
      : container.value.offsetWidth
    const dp = position - startPosition
    state.split = startSplit + ~~((dp / totalSize) * 100)
  }
}

function dragEnd() {
  state.dragging = false
}
</script>

<template>
  <div
    ref="container"
    class="split-pane"
    :class="{
      dragging: state.dragging,
      'show-output': showOutput,
      vertical: isVertical
    }"
    @mousemove="dragMove"
    @mouseup="dragEnd"
    @mouseleave="dragEnd"
  >
    <div
      class="left"
      :style="{ [isVertical ? 'height' : 'width']: boundSplit() + '%' }"
    >
      <slot name="left" />
      <div class="dragger" @mousedown.prevent="dragStart" />
    </div>
    <div
      class="right"
      :style="{ [isVertical ? 'height' : 'width']: 100 - boundSplit() + '%' }"
    >
      <slot name="right" />
    </div>

    <button class="toggler" @click="showOutput = !showOutput">
      {{ showOutput ? '< Code' : 'Output >' }}
    </button>
  </div>
</template>

<style scoped>
.split-pane {
  display: flex;
  height: 100%;
  position: relative;
}
.split-pane.dragging {
  cursor: ew-resize;
}
.dragging .left,
.dragging .right {
  pointer-events: none;
}
.left,
.right {
  position: relative;
  height: 100%;
}
.left {
  border-right: 1px solid var(--border);
}
.dragger {
  position: absolute;
  z-index: 3;
  top: 0;
  bottom: 0;
  right: -5px;
  width: 10px;
  cursor: ew-resize;
}
.toggler {
  display: none;
  z-index: 3;
  font-family: var(--font-code);
  color: var(--text-light);
  position: absolute;
  left: 50%;
  bottom: 20px;
  background-color: var(--bg);
  padding: 8px 12px;
  border-radius: 8px;
  transform: translateX(-50%);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.25);
}

.dark .toggler {
  background-color: var(--bg);
}

/* vertical */
@media (min-width: 721px) {
  .split-pane.vertical {
    display: block;
  }

  .split-pane.vertical.dragging {
    cursor: ns-resize;
  }

  .vertical .dragger {
    top: auto;
    height: 10px;
    width: 100%;
    left: 0;
    right: 0;
    bottom: -5px;
    cursor: ns-resize;
  }

  .vertical .left,
  .vertical .right {
    width: 100%;
  }
  .vertical .left {
    border-right: none;
    border-bottom: 1px solid var(--border);
  }
}

/* mobile */
@media (max-width: 720px) {
  .left,
  .right {
    width: 100% !important;
    height: 100% !important;
  }
  .dragger {
    display: none;
  }
  .split-pane .toggler {
    display: block;
  }
  .split-pane .right {
    display: none;
  }
  .split-pane.show-output .right {
    display: block;
  }
  .split-pane.show-output .left {
    display: none;
  }
}
</style>
