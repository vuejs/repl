<script lang="ts">
import { loadMonacoEnv, loadWasm } from './env';
loadMonacoEnv();
loadWasm();
</script>

<script lang="ts" setup>
import { onMounted, onBeforeUnmount, ref, shallowRef, nextTick, watchEffect, inject, watch } from 'vue';
import * as monaco from 'monaco-editor-core';
import { getOrCreateModel } from './utils';
import { loadGrammars, loadTheme } from 'monaco-volar'
import { Store } from '../store';

const props = withDefaults(defineProps<{
  filename: string;
  readonly?: boolean;
}>(), {
  readonly: false
})

const emits = defineEmits<{
  (e: 'change', value: string): void,
  (e: 'save', value: string): void
}>()

const containerRef = ref<HTMLDivElement | null>();
const ready = ref(false);
const editor = shallowRef<monaco.editor.IStandaloneCodeEditor | undefined>(undefined);
const store = inject('store') as Store;

watchEffect(() => {
  // create a model for each file in the store
  for (const filename in store.state.files) {
    const file = store.state.files[filename];
    if (monaco.editor.getModel(monaco.Uri.parse(`file:///${filename}`)))
      continue;
    getOrCreateModel(
      monaco.Uri.parse(`file:///${filename}`),
      file.language,
      file.code
    );
  }

  // dispose of any models that are not in the store
  for (const model of monaco.editor.getModels()) {
    if (store.state.files[model.uri.toString().substring('file:///'.length)])
      continue;
    model.dispose();
  }
});

onMounted(async () => {
  const theme = await loadTheme();
  ready.value = true;
  await nextTick();

  if (!containerRef.value) {
    throw new Error("Cannot find containerRef");
  }

  const editorInstance = monaco.editor.create(containerRef.value, {
    theme,
    model: null,
    readOnly: props.readonly,
    automaticLayout: true,
    scrollBeyondLastLine: false,
    minimap: {
      enabled: false,
    },
    inlineSuggest: {
      enabled: false,
    }
  });
  editor.value = editorInstance

  watch(() => props.filename, () => {
    if (!editorInstance) return;
    const file = store.state.files[props.filename];
    if (!file) return null;
    const model = getOrCreateModel(
      monaco.Uri.parse(`file:///${props.filename}`),
      file.language,
      file.code
    );
    editorInstance.setModel(model);
  }, { immediate: true });

  await loadGrammars(editorInstance);

  editorInstance.onDidChangeModelContent(() => {
    emits('change', editorInstance.getValue());
  });
});

onBeforeUnmount(() => {
  editor.value?.dispose();
});
</script>
<template>
  <div class="editor" ref="containerRef"></div>
</template>
<style>
.editor {
  position: relative;
  height: 100%;
  width: 100%;
  overflow: hidden;
}
</style>