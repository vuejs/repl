import assert from 'node:assert/strict'
import { after, test } from 'node:test'
import { ref } from 'vue'
import { createServer } from 'vite'

const vite = await createServer({
  appType: 'custom',
  logLevel: 'silent',
  server: { middlewareMode: true },
})
after(() => vite.close())

const { tsconfigFile, useStore } = await vite.ssrLoadModule('/src/store.ts')

function createStore() {
  return useStore({ builtinImportMap: ref({ imports: {} }) })
}

test('setFiles applies the default tsconfig when none is provided', async () => {
  const store = createStore()
  store.init()
  const defaultTsConfig = store.files[tsconfigFile].code

  await store.setFiles({
    'src/App.vue': '<template><div /></template>',
  })

  assert.equal(store.files[tsconfigFile].code, defaultTsConfig)
})

test('setFiles keeps a provided tsconfig', async () => {
  const store = createStore()
  const customTsConfig = JSON.stringify({ compilerOptions: { strict: true } })

  await store.setFiles({
    'src/App.vue': '<template><div /></template>',
    [tsconfigFile]: customTsConfig,
  })

  assert.equal(store.files[tsconfigFile].code, customTsConfig)
})
