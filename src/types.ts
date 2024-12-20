import type { Component, ComputedRef, InjectionKey, ToRefs } from 'vue'
import { Props } from './Repl.vue'

export type EditorMode = 'js' | 'css' | 'ssr'
export interface EditorProps {
  value: string
  filename: string
  readonly?: boolean
  mode?: EditorMode
}
export type ConsoleLevel = 'clear' | 'log' | 'info' | 'dir' | 'warn' | 'error' | 'table' | 'group' | 'unclonable' | 'assert'
export interface CommandData{
  action: 'console' | 'cmd_error' | 'cmd_ok' | 'error' | 'unhandledrejection'
  args: string[]
  level: ConsoleLevel
  stack?: string
  label?: string
  count?: number
}
export interface EditorEmits {
  (e: 'change', code: string): void
}
export type EditorComponentType = Component<EditorProps>

export type OutputModes = 'preview' | EditorMode

export const injectKeyProps: InjectionKey<
  ToRefs<Required<Props & { autoSave: boolean }>>
> = Symbol('props')
export const injectKeyPreviewRef: InjectionKey<
  ComputedRef<HTMLDivElement | null>
> = Symbol('preview-ref')
