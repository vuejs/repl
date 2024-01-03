import CodeMirrorEditor from "./CodeMirrorEditor.vue";
import MonacoEditor from "./MonacoEditor.vue";

export type EditorComponentType = typeof CodeMirrorEditor | typeof MonacoEditor

export type PreviewMode = 'js' | 'css' | 'ssr'

export interface EditorProps {
  value: string
  filename: string
  readonly?: boolean
  mode?: PreviewMode
}

export interface EditorEmits {
  (e: 'change', code: string): void
}
