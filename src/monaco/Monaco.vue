<script lang="ts">
import { setupMonacoEnv } from './env';
setupMonacoEnv();
import './monaco.contribution'
</script>
<script lang="ts" setup>
import { onMounted, onBeforeUnmount, ref, shallowRef, nextTick, watchEffect } from 'vue';
import { loadGrammars } from './grammars';
import * as monaco from 'monaco-editor-core';
import { setupThemePromise, getOrCreateModel } from './utils';
// import { setupLs, setupValidate } from './ls';

const props = withDefaults(defineProps<{
  value?: string
  language?: string;
  readonly?: boolean
}>(), {
  value: '',
  readonly: false
})

const emits = defineEmits<{
  (e: 'change', value: string): void,
  (e: 'save', value: string): void
}>()

const containerRef = ref<HTMLDivElement | null>();
const ready = ref(false);
const editor = shallowRef<monaco.editor.IStandaloneCodeEditor | undefined>(undefined);

const currentModel = shallowRef<monaco.editor.ITextModel>(
  getOrCreateModel(
    monaco.Uri.parse('file:///demo.vue'),
    'vue',
    props.value ?? ''
  )
)

// const documentModelMap = shallowRef(new Map([[
//   currentModel.value.uri.fsPath, currentModel.value
// ]]))

watchEffect(() => {
  if (currentModel.value.getValue() !== props.value) {
    currentModel.value.setValue(props.value)
  }
})

onMounted(async () => {
  const theme = await setupThemePromise;
  ready.value = true;
  await nextTick();

  if (!containerRef.value) {
    throw new Error("Cannot find containerRef");
  }

  const editorInstance = monaco.editor.create(containerRef.value, {
    theme,
    model: currentModel.value,
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

  // const ls = await setupLs(editorInstance, documentModelMap)

  await loadGrammars(editorInstance);

  editorInstance.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
    emits('save', editorInstance.getValue());
  });

  editorInstance.onDidChangeModelContent(() => {
    emits('change', editorInstance.getValue());
  });



  // setupValidate(editorInstance, ls);
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