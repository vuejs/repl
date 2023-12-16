import * as monaco from 'monaco-editor-core'
import { getHighlighterCore } from 'shikiji/core'
import { getWasmInlined } from 'shikiji/wasm'
import { shikijiToMonaco } from 'shikiji-monaco'

import langVue from 'shikiji/langs/vue.mjs'
import themeDark from 'shikiji/themes/dark-plus.mjs'
import themeLight from 'shikiji/themes/light-plus.mjs'


export async function registerHighlighter() {
  const highlighter = await getHighlighterCore({
    themes: [themeDark, themeLight],
    langs: [langVue],
    loadWasm: getWasmInlined
  })
  monaco.languages.register({ id: 'vue' })
  shikijiToMonaco(highlighter, monaco)
  return {
    light: themeLight.name!,
    dark: themeDark.name!
  }
}
