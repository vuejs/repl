<script setup lang="ts">
import { ref, watch } from 'vue'
import type { CompilerError } from 'vue/compiler-sfc'

const props = defineProps<{
  err?: string | Error | false
  warn?: string | Error
}>()

const dismissed = ref(false)

watch(
  () => [props.err, props.warn],
  () => {
    dismissed.value = false
  },
)

function formatMessage(err: string | Error): string {
  if (typeof err === 'string') {
    return err
  } else {
    let msg = err.message
    const loc = (err as CompilerError).loc
    if (loc && loc.start) {
      msg = `(${loc.start.line}:${loc.start.column}) ` + msg
    }
    return msg
  }
}
</script>

<template>
  <Transition name="fade">
    <div
      v-if="!dismissed && (err || warn)"
      class="msg"
      :class="err ? 'err' : 'warn'"
    >
      <pre>{{ formatMessage(err || warn!) }}</pre>
      <button class="dismiss" @click="dismissed = true">✕</button>
    </div>
  </Transition>
</template>

<style scoped>
.msg.err {
  --color: #f56c6c;
  --bg-color: #fef0f0;
}

.dark .msg.err {
  --bg-color: #2b1d1d;
}

.msg.warn {
  --color: #e6a23c;
  --bg-color: #fdf6ec;
}

.dark .msg.warn {
  --bg-color: #292218;
}

pre {
  margin: 0;
  padding: 12px 20px;
  overflow: auto;
}

.msg {
  position: absolute;
  bottom: 0;
  left: 8px;
  right: 8px;
  z-index: 20;
  border: 2px solid transparent;
  border-radius: 6px;
  font-family: var(--font-code);
  white-space: pre-wrap;
  margin-bottom: 8px;
  max-height: calc(100% - 300px);
  min-height: 40px;
  display: flex;
  align-items: stretch;
  color: var(--color);
  border-color: var(--color);
  background-color: var(--bg-color);
}

.dismiss {
  position: absolute;
  top: 2px;
  right: 2px;
  width: 18px;
  height: 18px;
  line-height: 18px;
  border-radius: 9px;
  text-align: center;
  display: block;
  font-size: 9px;
  padding: 0;
  color: var(--bg-color);
  background-color: var(--color);
}

@media (max-width: 720px) {
  .dismiss {
    top: -9px;
    right: -9px;
  }

  .msg {
    bottom: 50px;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.15s ease-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translate(0, 10px);
}
</style>
