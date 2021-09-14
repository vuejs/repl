<script setup lang="ts">
import { ReplStore } from '../store'
import { computed, inject, ref, VNode, Ref } from 'vue'

const store = inject('store') as ReplStore

const pending = ref(false)
const pendingFilename = ref('Comp.vue')
const importMapFile = 'import-map.json'
const showImportMap = inject('import-map') as Ref<boolean>
const files = computed(() =>
  Object.keys(store.state.files).filter((f) => {
    return showImportMap.value || f !== importMapFile
  })
)

function startAddFile() {
  pending.value = true
}

function cancelAddFile() {
  pending.value = false
}

function focus({ el }: VNode) {
  ;(el as HTMLInputElement).focus()
}

function doneAddFile() {
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
  pending.value = false
  store.addFile(filename)
  pendingFilename.value = 'Comp.vue'
}
</script>

<template>
  <div class="file-selector">
    <div
      v-for="(file, i) in files"
      class="file"
      :class="{ active: store.state.activeFile.filename === file }"
      @click="store.setActive(file)"
    >
      <span class="label">{{ file }}</span>
      <span
        v-if="i > 0 && file !== importMapFile"
        class="remove"
        @click.stop="store.deleteFile(file)"
      >
        <svg class="icon" width="12" height="12" viewBox="0 0 24 24">
          <line stroke="#999" x1="18" y1="6" x2="6" y2="18"></line>
          <line stroke="#999" x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </span>
    </div>
    <div v-if="pending" class="file">
      <input
        v-model="pendingFilename"
        spellcheck="false"
        @keyup.enter="doneAddFile"
        @keyup.esc="cancelAddFile"
        @vnodeMounted="focus"
      />
    </div>
    <button class="add" @click="startAddFile">+</button>
  </div>
</template>

<style scoped>
.file-selector {
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
  background-color: var(--bg-soft);
}

.file-selector::-webkit-scrollbar-thumb {
  background-color: var(--color-branding);
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
.file input {
  width: 80px;
  outline: none;
  border: 1px solid var(--border);
  border-radius: 3px;
  padding: 4px 6px;
  margin-left: 6px;
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
.import-map {
  position: absolute;
  top: 0;
  right: 0;
  background-color: var(--bg);
}
</style>
