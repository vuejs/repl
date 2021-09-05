import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@vue/compiler-sfc': '@vue/compiler-sfc/dist/compiler-sfc.esm-browser.js'
    }
  },
  optimizeDeps: {
    exclude: ['@vue/compiler-sfc']
  }
})
