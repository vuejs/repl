import type { Component, ComputedRef, InjectionKey, ToRefs } from 'vue'
import { Props } from './Repl.vue'

export type EditorMode = 'js' | 'css' | 'ssr'
export interface EditorProps {
  value: string
  filename: string
  readonly?: boolean
  mode?: EditorMode
}
export type LogLevel =
  | 'log'
  | 'error'
  | 'warn'
  | 'group'
  | 'groupCollapsed'
  | 'groupEnd'
  | 'assert'
  | 'count'
  | 'countReset'
  | 'debug'
  | 'dir'
  | 'info'
  | 'table'
  | 'time'
  | 'timeEnd'
  | 'timeLog'
  | 'warn'

export interface LogPayload {
  logLevel: LogLevel
  data?: any[]
}
export interface EditorEmits {
  (e: 'change', code: string): void
}
export interface SandboxEmits {
  (e: 'log', payload: LogPayload): void
}
export type EditorComponentType = Component<EditorProps>

export type ConsoleComponentType = Component

export type OutputModes = 'preview' | EditorMode

export const injectKeyProps: InjectionKey<
  ToRefs<Required<Props & { autoSave: boolean }>>
> = Symbol('props')
export const injectKeyPreviewRef: InjectionKey<
  ComputedRef<HTMLDivElement | null>
> = Symbol('preview-ref')
