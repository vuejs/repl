import { defineConfig, Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'

const genStub: Plugin = {
  name: 'gen-stub',
  apply: 'build',
  generateBundle() {
    this.emitFile({
      type: 'asset',
      fileName: 'ssr-stub.js',
      source: `module.exports = {}`
    })
  }
}

export default defineConfig({
  define: {
    global: 'globalThis',
    'process.env': process.env,
  },
  plugins: [vue(), genStub],
  build: {
    target: 'esnext',
    minify: false,
    lib: {
      entry: './src/index.ts',
      formats: ['es'],
      fileName: () => 'vue-repl.js'
    },
    rollupOptions: {
      external: ['vue', 'vue/compiler-sfc']
    }
  }
})
