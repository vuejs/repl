<script setup lang="ts">
import { ref, watch } from 'vue'
import { CompilerError } from '@vue/compiler-sfc'

const props = defineProps(['err', 'warn'])

const dismissed = ref(false)

watch(
  () => [props.err, props.warn],
  () => {
    dismissed.value = false
  }
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
      <pre>{{ formatMessage(err || warn) }}</pre>
      <button class="dismiss" @click="dismissed = true">✕</button>
    </div>
  </Transition>
</template>

<style scoped>
.msg {
  position: absolute;
  bottom: 0;
  left: 8px;
  right: 8px;
  z-index: 10;
  border: 2px solid transparent;
  border-radius: 6px;
  font-family: var(--font-code);
  white-space: pre-wrap;
  max-height: calc(100% - 300px);
  min-height: 42px;
  margin-bottom: 8px;
}

pre {
  margin: 0;
  padding: 12px 20px;
  overflow: scroll;
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
  background-color: red;
  color: #fff;
}

@media (max-width: 760px) {
  .dismiss {
    top: -9px;
    right: -9px;
  }
}

.msg.err {
  color: red;
  border-color: red;
  background-color: #ffd7d7;
}

.msg.warn {
  --color: rgb(105, 95, 27);
  color: var(--color);
  border-color: var(--color);
  background-color: rgb(247, 240, 205);
}

.msg.warn .dismiss {
  background-color: var(--color);
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
