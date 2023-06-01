# @vue/repl

Vue SFC REPL as a Vue 3 component.

## Simple Usage

```vue
<script setup>
import { Repl } from '@vue/repl'
import '@vue/repl/style.css'
</script>

<template>
  <Repl />
</template>
```

## Advanced Usage

```vue
<script setup>
import { watchEffect } from 'vue'
import { Repl, ReplStore } from '@vue/repl'

// retrieve some configuration options from the URL
const query = new URLSearchParams(location.search)

const store = new ReplStore({
  // initialize repl with previously serialized state
  serializedState: location.hash.slice(1),

  // starts on the output pane (mobile only) if the URL has a showOutput query
  showOutput: query.has('showOutput'),
  // starts on a different tab on the output pane if the URL has a outputMode query
  // and default to the "preview" tab
  outputMode: (query.get('outputMode') || 'preview'),

  // specify the default URL to import Vue runtime from in the sandbox
  // default is the CDN link from unpkg.com with version matching Vue's version
  // from peerDependency
  defaultVueRuntimeURL: 'cdn link to vue.runtime.esm-browser.js'
})

// persist state to URL hash
watchEffect(() => history.replaceState({}, '', store.serialize()))

// pre-set import map
store.setImportMap({
  imports: {
    myLib: 'cdn link to esm build of myLib'
  }
})

// use a specific version of Vue
store.setVueVersion('3.2.8')
</script>

<template>
  <Repl :store="store" :showCompileOutput="true" />
</template>
```
