import { type FunctionalComponent } from 'vue'

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

export type EditorComponentType = FunctionalComponent<
  EditorProps,
  { change: (code: string) => void }
> & {
  editorType: 'monaco' | 'codemirror'
}

declare const EditorComponent: EditorComponentType

export default EditorComponent
