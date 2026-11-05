import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import replace from '@rollup/plugin-replace'
import path from 'node:path'
import scenarioPlugin from './vite-plugin-scenario'

export default defineConfig({
  plugins: [vue(), scenarioPlugin()],
  resolve: {
    alias: {
      '@vue/compiler-dom': '@vue/compiler-dom/dist/compiler-dom.cjs.js',
      '@vue/compiler-core': '@vue/compiler-core/dist/compiler-core.cjs.js',
    },
  },
  server: {
    port: 5174, // Use a different port to avoid conflicts with the main project
    open: true, // Automatically open the browser
  },
  // Remove build config because playground is for development and demo only
  worker: {
    format: 'es',
    plugins: () => [
      replace({
        preventAssignment: true,
        values: {
          'process.env.NODE_ENV': JSON.stringify('production'),
        },
      }),
    ],
  },
  // Set project root directory to the playground directory
  root: path.resolve(__dirname),
  base: './', // Use relative path
})
