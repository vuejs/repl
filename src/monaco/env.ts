import editorWorker from 'monaco-editor-core/esm/vs/editor/editor.worker?worker';
import vueWorker from 'monaco-volar/vue.worker?worker';
import * as onigasm from "onigasm";
import onigasmWasm from "onigasm/lib/onigasm.wasm?url";
import { editor, languages } from 'monaco-editor-core';
import * as volar from '@volar/monaco';

export function loadWasm() {
  return onigasm.loadWASM(onigasmWasm);
}

export function loadMonacoEnv() {
  (self as any).MonacoEnvironment = {
    async getWorker(_: any, label: string) {
      if (label === 'vue') {
        return new vueWorker();
      }
      return new editorWorker();
    },
  };
  languages.register({ id: 'vue', extensions: ['.vue'] })
  languages.onLanguage('vue', async () => {
    const worker = editor.createWebWorker<any>({
      moduleId: 'vs/language/vue/vueWorker',
      label: 'vue',
      createData: {},
    })
    const languageId = ['vue']
    const getSyncUris = () => editor.getModels().map(m => m.uri);
    volar.editor.activateMarkers(worker, languageId, 'vue', getSyncUris, editor)
    volar.editor.activateAutoInsertion(worker, languageId, getSyncUris, editor)
    volar.languages.registerProvides(worker, languageId, getSyncUris, languages)
  })
}