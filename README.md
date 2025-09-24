# @vue/repl

Vue SFC REPL as a Vue 3 component.

## Basic Usage

**Note: `@vue/repl` >= 2 now supports Monaco Editor, but also requires explicitly passing in the editor to be used for tree-shaking.**

```ts
// vite.config.ts
import { defineConfig } from 'vite'
export default defineConfig({
  optimizeDeps: {
    exclude: ['@vue/repl'],
  },
  // ...
})
```

### With CodeMirror Editor

Basic editing experience with no intellisense. Lighter weight, fewer network requests, better for embedding use cases.

```vue
<script setup>
import { Repl } from '@vue/repl'
import CodeMirror from '@vue/repl/codemirror-editor'
// import '@vue/repl/style.css'
// ^ no longer needed after 3.0
</script>

<template>
  <Repl :editor="CodeMirror" />
</template>
```

### With Monaco Editor

With Volar support, autocomplete, type inference, and semantic highlighting. Heavier bundle, loads dts files from CDN, better for standalone use cases.

```vue
<script setup>
import { Repl } from '@vue/repl'
import Monaco from '@vue/repl/monaco-editor'
// import '@vue/repl/style.css'
// ^ no longer needed after 3.0
</script>

<template>
  <Repl :editor="Monaco" />
</template>
```

## Advanced Usage

Customize the behavior of the REPL by manually initializing the store.

See [v4 Migration Guide](https://github.com/vuejs/repl/releases/tag/v4.0.0)

```vue
<script setup>
import { watchEffect, ref } from 'vue'
import { Repl, useStore, useVueImportMap } from '@vue/repl'
import Monaco from '@vue/repl/monaco-editor'

// retrieve some configuration options from the URL
const query = new URLSearchParams(location.search)

const {
  importMap: builtinImportMap,
  vueVersion,
  productionMode,
} = useVueImportMap({
  // specify the default URL to import Vue runtime from in the sandbox
  // default is the CDN link from jsdelivr.com with version matching Vue's version
  // from peerDependency
  runtimeDev: 'cdn link to vue.runtime.esm-browser.js',
  runtimeProd: 'cdn link to vue.runtime.esm-browser.prod.js',
  serverRenderer: 'cdn link to server-renderer.esm-browser.js',
})

const store = useStore(
  {
    // pre-set import map
    builtinImportMap,
    vueVersion,
    // starts on the output pane (mobile only) if the URL has a showOutput query
    showOutput: ref(query.has('showOutput')),
    // starts on a different tab on the output pane if the URL has a outputMode query
    // and default to the "preview" tab
    outputMode: ref(query.get('outputMode') || 'preview'),
  },
  // initialize repl with previously serialized state
  location.hash,
)

// persist state to URL hash
watchEffect(() => history.replaceState({}, '', store.serialize()))

// use a specific version of Vue
vueVersion.value = '3.2.8'
// production mode is enabled
productionMode.value = true
</script>

<template>
  <Repl :store="store" :editor="Monaco" :showCompileOutput="true" />
</template>
```

Use only the Preview without the editor

```vue
<script setup>
import { ref } from 'vue'
import { Sandbox, useStore } from '@vue/repl'

// retrieve some configuration options from the URL
const query = new URLSearchParams(location.search)

const store = useStore(
  {
    // custom vue version
    vueVersion: ref(query.get('vue')),
  },
  // initialize repl with previously serialized state
  location.hash,
)
</script>

<template>
  <Sandbox :store="store" />
</template>
```

<details>
<summary>Configuration options for resource links. (replace CDN resources)</summary>

```ts
export type ResourceLinkConfigs = {
  /** URL for ES Module Shims. */
  esModuleShims?: string
  /** Function that generates the Vue compiler URL based on the version. */
  vueCompilerUrl?: (version: string) => string
  /** Function that generates the TypeScript library URL based on the version. */
  typescriptLib?: (version: string) => string

  /** [monaco] Function that generates a URL to fetch the latest version of a package. */
  pkgLatestVersionUrl?: (pkgName: string) => string
  /** [monaco] Function that generates a URL to browse a package directory. */
  pkgDirUrl?: (pkgName: string, pkgVersion: string, pkgPath: string) => string
  /** [monaco] Function that generates a URL to fetch the content of a file from a package. */
  pkgFileTextUrl?: (
    pkgName: string,
    pkgVersion: string | undefined,
    pkgPath: string,
  ) => string
}
```

**unpkg**

```ts
const store = useStore({
  resourceLinks: ref({
    esModuleShims:
      'https://unpkg.com/es-module-shims@1.5.18/dist/es-module-shims.wasm.js',
    vueCompilerUrl: (version) =>
      `https://unpkg.com/@vue/compiler-sfc@${version}/dist/compiler-sfc.esm-browser.js`,
    typescriptLib: (version) =>
      `https://unpkg.com/typescript@${version}/lib/typescript.js`,
    pkgLatestVersionUrl: (pkgName) =>
      `https://unpkg.com/${pkgName}@latest/package.json`,
    pkgDirUrl: (pkgName, pkgVersion, pkgPath) =>
      `https://unpkg.com/${pkgName}@${pkgVersion}/${pkgPath}/?meta`,
    pkgFileTextUrl: (pkgName, pkgVersion, pkgPath) =>
      `https://unpkg.com/${pkgName}@${pkgVersion || 'latest'}/${pkgPath}`,
  }),
})
```

**npmmirror**

```ts
const store = useStore({
  resourceLinks: ref({
    esModuleShims:
      'https://registry.npmmirror.com/es-module-shims/1.5.18/files/dist/es-module-shims.wasm.js',
    vueCompilerUrl: (version) =>
      `https://registry.npmmirror.com/@vue/compiler-sfc/${version}/files/dist/compiler-sfc.esm-browser.js`,
    typescriptLib: (version) =>
      `https://registry.npmmirror.com/typescript/${version}/files/lib/typescript.js`,

    pkgLatestVersionUrl: (pkgName) =>
      `https://registry.npmmirror.com/${pkgName}/latest/files/package.json`,
    pkgDirUrl: (pkgName, pkgVersion, pkgPath) =>
      `https://registry.npmmirror.com/${pkgName}/${pkgVersion}/files/${pkgPath}/?meta`,
    pkgFileTextUrl: (pkgName, pkgVersion, pkgPath) =>
      `https://registry.npmmirror.com/${pkgName}/${pkgVersion || 'latest'}/files/${pkgPath}`,
  }),
})
```

</details>
