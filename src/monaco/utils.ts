import { Uri, editor } from 'monaco-editor-core';
import { loadWASM } from 'onigasm';
import { theme } from './themes/converted';
import onigasm from 'onigasm/lib/onigasm.wasm?url'

export function getOrCreateModel(uri: Uri, lang: string, value: string) {
  const model = editor.getModel(uri);
  if (model) {
      model.setValue(value);
      return model;
  }
  return editor.createModel(value, lang, uri);
}

export async function setupThemeAndWasm() {
  const themeName = 'vs-code-theme-converted';
  editor.defineTheme(themeName, theme);
  await loadWASM(onigasm);
  return themeName;
}

export const setupThemePromise = setupThemeAndWasm();
