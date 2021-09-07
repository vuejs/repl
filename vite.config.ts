import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  build: {
    minify: false,
    lib: {
      entry: './src/index.ts',
      formats: ['es'],
      fileName: () => 'vue-repl.js'
    },
    rollupOptions: {
      external: ['vue', '@vue/compiler-sfc']
    }
  }
})
