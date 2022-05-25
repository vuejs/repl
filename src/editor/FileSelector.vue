<script setup lang="ts">
import { Store } from '../store'
import { computed, inject, ref, VNode, Ref } from 'vue'

const store = inject('store') as Store

const pending = ref(false)
const pendingFilename = ref('Comp.vue')
const importMapFile = 'import-map.json'
const showImportMap = inject('import-map') as Ref<boolean>
const files = computed(() =>
  Object.entries(store.state.files)
    .filter(([name, file]) => name !== importMapFile && !file.hidden)
    .map(([name]) => name)
)

function startAddFile() {
  let i = 0
  let name = `Comp.vue`

  while (true) {
    let hasConflict = false
    for (const file in store.state.files) {
      if (file === name) {
        hasConflict = true
        name = `Comp${++i}.vue`
        break
      }
    }
    if (!hasConflict) {
      break
    }
  }

  pendingFilename.value = name
  pending.value = true
}

function cancelAddFile() {
  pending.value = false
}

function focus({ el }: VNode) {
  ;(el as HTMLInputElement).focus()
}

function doneAddFile() {
  if (!pending.value) return
  const filename = pendingFilename.value

  if (!/\.(vue|js|ts|css)$/.test(filename)) {
    store.state.errors = [
      `Playground only supports *.vue, *.js, *.ts, *.css files.`
    ]
    return
  }

  if (filename in store.state.files) {
    store.state.errors = [`File "${filename}" already exists.`]
    return
  }

  store.state.errors = []
  cancelAddFile()
  store.addFile(filename)
}

const fileSel = ref(null)
function horizontalScroll(e: WheelEvent) {
  e.preventDefault()
  const el = fileSel.value! as HTMLElement
  const direction =
    Math.abs(e.deltaX) >= Math.abs(e.deltaY) ? e.deltaX : e.deltaY
  const distance = 30 * (direction > 0 ? 1 : -1)
  el.scrollTo({
    left: el.scrollLeft + distance
  })
}
</script>

<template>
  <div
    class="file-selector"
    :class="{ 'has-import-map': showImportMap }"
    @wheel="horizontalScroll"
    ref="fileSel"
  >
    <div
      v-for="(file, i) in files"
      class="file"
      :class="{ active: store.state.activeFile.filename === file }"
      @click="store.setActive(file)"
    >
      <span class="label">{{
        file === importMapFile ? 'Import Map' : file
      }}</span>
      <span v-if="i > 0" class="remove" @click.stop="store.deleteFile(file)">
        <svg class="icon" width="12" height="12" viewBox="0 0 24 24">
          <line stroke="#999" x1="18" y1="6" x2="6" y2="18"></line>
          <line stroke="#999" x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </span>
    </div>
    <div v-if="pending" class="file pending">
      <input
        v-model="pendingFilename"
        spellcheck="false"
        @blur="doneAddFile"
        @keyup.enter="doneAddFile"
        @keyup.esc="cancelAddFile"
        @vnodeMounted="focus"
      />
    </div>
    <button class="add" @click="startAddFile">+</button>

    <div v-if="showImportMap" class="import-map-wrapper">
      <div
        class="file import-map"
        :class="{ active: store.state.activeFile.filename === importMapFile }"
        @click="store.setActive(importMapFile)"
      >
        <span class="label">Import Map</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.file-selector {
  display: flex;
  box-sizing: border-box;
  border-bottom: 1px solid var(--border);
  background-color: var(--bg);
  overflow-y: hidden;
  overflow-x: auto;
  white-space: nowrap;
  position: relative;
  height: var(--header-height);
}

.file-selector::-webkit-scrollbar {
  height: 1px;
}

.file-selector::-webkit-scrollbar-track {
  background-color: var(--border);
}

.file-selector::-webkit-scrollbar-thumb {
  background-color: var(--color-branding);
}

.file-selector.has-import-map .add {
  margin-right: 10px;
}

.file {
  display: inline-block;
  font-size: 13px;
  font-family: var(--font-code);
  cursor: pointer;
  color: var(--text-light);
  box-sizing: border-box;
}
.file.active {
  color: var(--color-branding);
  border-bottom: 3px solid var(--color-branding);
  cursor: text;
}
.file span {
  display: inline-block;
  padding: 8px 10px 6px;
  line-height: 20px;
}
.file.pending input {
  width: 90px;
  height: 30px;
  line-height: 30px;
  outline: none;
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 0 0 0 10px;
  margin-top: 2px;
  margin-left: 6px;
  font-family: var(--font-code);
  font-size: 12px;
}
.file .remove {
  display: inline-block;
  vertical-align: middle;
  line-height: 12px;
  cursor: pointer;
  padding-left: 0;
}
.add {
  font-size: 18px;
  font-family: var(--font-code);
  color: #999;
  vertical-align: middle;
  margin-left: 6px;
  position: relative;
  top: -1px;
}
.add:hover {
  color: var(--color-branding);
}
.icon {
  margin-top: -1px;
}
.import-map-wrapper {
  position: sticky;
  margin-left: auto;
  top: 0;
  right: 0;
  padding-left: 30px;
  background-color: var(--bg);
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 1) 25%
  );
}
.dark .import-map-wrapper {
  background: linear-gradient(
    90deg,
    rgba(26, 26, 26, 0) 0%,
    rgba(26, 26, 26, 1) 25%
  );
}
</style>
