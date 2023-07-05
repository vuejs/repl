import { Plugin, mergeConfig } from 'vite'
import base from './vite.preview.config'

const genStub: Plugin = {
  name: 'gen-stub',
  apply: 'build',
  generateBundle() {
    this.emitFile({
      type: 'asset',
      fileName: 'ssr-stub.js',
      source: `module.exports = {}`,
    })
  },
}

export default mergeConfig(base, {
  plugins: [genStub],
  optimizeDeps: {
    // avoid late discovered deps
    include: [
      'path-browserify',
      'onigasm',
      'typescript',
      '@volar/cdn',
      '@vue/language-service',
      'monaco-editor-core/esm/vs/editor/editor.worker',
      '@volar/monaco/worker',
      'vue/server-renderer',
    ],
  },
  base: './',
  build: {
    target: 'esnext',
    minify: false,
    lib: {
      entry: {
        'vue-repl': './src/index.ts',
        'monaco-editor': './src/editor/MonacoEditor.vue',
        'codemirror-editor': './src/editor/CodeMirrorEditor.vue',
      },
      formats: ['es'],
      fileName: () => '[name].js',
    },
    rollupOptions: {
      output: {
        chunkFileNames: 'chunks/[name]-[hash].js',
      },
      external: ['vue', 'vue/compiler-sfc'],
    },
  },
})
