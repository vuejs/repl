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
  plugins: [vue(), genStub],
  optimizeDeps: {
    include: [
      'path-browserify'
    ],
  },
  resolve: {
    alias: {
      path: 'path-browserify',
    }
  },
  worker: {
    format: 'es'
  },
  build: {
    target: 'esnext',
    minify: false,
    lib: {
      entry: './src/index.ts',
      formats: ['es'],
      fileName: () => '[name].js'
    },
    
    rollupOptions: {
      input: {
        'main': './index.html',
        'vue-repl': './src/index.ts',
        'vue-repl-monaco-editor': './src/editor/MonacoEditor.vue',
      },
      external: ['vue', 'vue/compiler-sfc'],
      output: {
        format: 'amd'
      }
    },
  }
})
