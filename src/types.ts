import type { Component, ComputedRef, InjectionKey, ToRefs } from 'vue'
import { Props } from './Repl.vue'
import type * as monaco from 'monaco-editor-core'
import type CodeMirror from 'codemirror'

export type EditorMode = 'js' | 'css' | 'ssr'
export interface EditorProps {
  value: string
  filename: string
  readonly?: boolean
  mode?: EditorMode
}
export interface EditorEmits {
  (e: 'change', code: string): void
}

export interface EditorMethods {
  getEditorIns<T extends 'monaco' | 'codemirror' = 'monaco'>():
    | (T extends 'codemirror'
        ? CodeMirror.Editor
        : monaco.editor.IStandaloneCodeEditor)
    | undefined
  getMonacoEditor?(): typeof monaco.editor | undefined
}

export type EditorComponentType = Component<EditorProps>

export type OutputModes = 'preview' | 'ssr output' | EditorMode

export const injectKeyProps: InjectionKey<
  ToRefs<Required<Props & { autoSave: boolean }>>
> = Symbol('props')
export const injectKeyPreviewRef: InjectionKey<
  ComputedRef<HTMLDivElement | null>
> = Symbol('preview-ref')
