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
    // avoid late discovered deps
    include: [
      'path-browserify',
      'onigasm',
      'typescript',
      '@vue/language-service',
      'monaco-editor-core/esm/vs/editor/editor.worker',
      '@volar/monaco/worker',
      'vue/server-renderer'
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
        'vue-repl': './src/index.ts',
        'monaco-editor': './src/editor/MonacoEditor.vue',
        'codemirror-editor': './src/editor/CodeMirrorEditor.vue'
      },
      output: {
        chunkFileNames: 'chunks/[name]-[hash].js'
      },
      external: ['vue', 'vue/compiler-sfc']
    },
  }
})
