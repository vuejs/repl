import * as monaco from 'monaco-editor-core';
import { wireTmGrammars } from 'monaco-editor-textmate';
import { Registry, type IGrammarDefinition } from 'monaco-textmate';

async function dispatchGrammars(scopeName: string): Promise<IGrammarDefinition> {
  switch (scopeName) {
    case 'source.vue':
      return {
        format: 'json',
        content: await import('./vue.tmLanguage.json'),
      };
    case 'source.ts':
      return {
        format: 'json',
        content: await import('./TypeScript.tmLanguage.json'),
      };
    case 'source.tsx':
      return {
        format: 'json',
        content: await import('./TypeScriptReact.tmLanguage.json'),
      };
    case 'source.js':
      return {
        format: 'json',
        content: await import('./JavaScript.tmLanguage.json'),
      };
    case 'source.js.jsx':
    case 'source.jsx':
      return {
        format: 'json',
        content: await import('./JavaScriptReact.tmLanguage.json'),
      };
    case 'text.html.basic':
      return {
        format: 'json',
        content: await import('./html.tmLanguage.json'),
      };
    case 'source.css':
      return {
        format: 'json',
        content: await import('./css.tmLanguage.json'),
      };
    case 'source.stylus':
      return {
        format: 'json',
        content: await import('./stylus.tmLanguage.json'),
      };
    case 'source.markdown':
      return {
        format: 'json',
        content: await import('./markdown.tmLanguage.json'),
      };
    default:
      console.log(scopeName, 'missing language');
      return {
        format: 'json',
        content: {
          scopeName: 'source',
          patterns: [],
        },
      };
  }
}

export async function loadGrammars(editor: monaco.editor.IStandaloneCodeEditor) {
  const registry = new Registry({
    getGrammarDefinition: async (scopeName) => {
      const dispatch = await dispatchGrammars(scopeName);
      return JSON.parse(JSON.stringify(dispatch));
    },
  });
  const grammars = new Map();
  grammars.set('vue', 'source.vue');

  for (const lang of grammars.keys()) {
    monaco.languages.register({
      id: lang,
    });
  }

  await wireTmGrammars(monaco, registry, grammars, editor);
}
