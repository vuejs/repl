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

const store = new ReplStore({
  // initialize repl with previously serialized state
  serializedState: location.hash.slice(1),

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
