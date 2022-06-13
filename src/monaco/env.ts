import editorWorker from 'monaco-editor-core/esm/vs/editor/editor.worker?worker';
import vueWorker from './vue.worker?worker';

export function setupMonacoEnv() {
    (self as any).MonacoEnvironment = {
      async getWorker(_: any, label: string) {
        if (label === 'vue') {
          console.log('label vue')
          return new vueWorker();
        }
        return new editorWorker();
      },
    };
  }