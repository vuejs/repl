/// <reference types="vite/client" />

declare module '*.vue' {
  import type { ComponentOptions } from 'vue'
  const comp: ComponentOptions
  export default comp
}
