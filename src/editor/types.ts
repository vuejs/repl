import { Component } from 'vue'

export type PreviewMode = 'js' | 'css' | 'ssr'

interface EditorProps {
  value: string
  filename: string
  readonly?: boolean
  mode?: PreviewMode
}

interface EditorEmits {
  (e: 'change', code: string): void
}

type EditorComponentType = Component<EditorProps, EditorEmits> & {
  editorType: 'monaco' | 'codemirror'
}

export default EditorComponentType
