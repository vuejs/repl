import { defineConfig, Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import replace from '@rollup/plugin-replace'

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
      'vue/server-renderer',
    ],
  },
  resolve: {
    alias: {
      path: 'path-browserify',
    },
  },
  worker: {
    format: 'es',
    plugins: [
      replace({
        preventAssignment: true,
        values: {
          'process.env.NODE_ENV': JSON.stringify('production'),
        },
      }),
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
