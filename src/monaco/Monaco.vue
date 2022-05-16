<script lang="ts">
import { setupMonacoEnv } from './utils';
setupMonacoEnv();
</script>
<script lang="ts" setup>
import { onMounted, onBeforeUnmount, ref, shallowRef, nextTick, watchEffect } from 'vue';
import { loadGrammars } from './grammars';
import * as monaco from 'monaco-editor';
import { setupThemePromise } from './utils';

interface Props {
    value?: string
    language?: string;
    readonly?: boolean
}

const props = withDefaults(defineProps<Props>(), {
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

onMounted(async () => {
    const theme = await setupThemePromise;
    ready.value = true;
    await nextTick();

    if (!containerRef.value) {
        throw new Error("Cannot find containerRef");
    }

    const editorInstance = monaco.editor.create(containerRef.value, {
        theme,
        value: props.value,
        language: props.language,
        readOnly: props.readonly,
        automaticLayout: true,
        scrollBeyondLastLine: false,
        minimap: {
            enabled: false,
        },
        inlineSuggest: {
            enabled: false,
        },
    });
    editor.value = editorInstance

    await loadGrammars(editorInstance);

    editorInstance.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
        emits('save', editorInstance.getValue());
    });

    editorInstance.onDidChangeModelContent(() => {
        emits('change', editorInstance.getValue());
    });
});

watchEffect(() => {
    if (editor.value && editor.value.getValue() !== props.value) {
        editor.value.setValue(props.value);
    }
})

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