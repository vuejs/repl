import type { Component, InjectionKey } from 'vue'
import type { Store } from './store'

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
export type EditorComponentType = Component<EditorProps>

export type OutputModes = 'preview' | EditorMode

export const injectKeyStore: InjectionKey<Store> = Symbol('store')
