import * as monaco from 'monaco-editor-core'
import { getHighlighterCore } from 'shiki/core'
import { shikiToMonaco } from '@shikijs/monaco'

import langVue from 'shiki/langs/vue.mjs'
import themeDark from 'shiki/themes/dark-plus.mjs'
import themeLight from 'shiki/themes/light-plus.mjs'

export async function registerHighlighter() {
  const highlighter = await getHighlighterCore({
    themes: [themeDark, themeLight],
    langs: [langVue],
    loadWasm: import('shiki/wasm'),
  })
  monaco.languages.register({ id: 'vue' })
  shikiToMonaco(highlighter, monaco)
  return {
    light: themeLight.name!,
    dark: themeDark.name!,
  }
}
