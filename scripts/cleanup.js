// This file is executed from npm script with project root as cwd.
import fs from 'node:fs'

fs.renameSync(
  'dist/src/editor/CodeMirrorEditor.vue.d.ts',
  'dist/CodeMirrorEditor.vue.d.ts'
)

fs.renameSync(
  'dist/src/editor/MonacoEditor.vue.d.ts',
  'dist/MonacoEditor.vue.d.ts'
)

fs.renameSync('dist/src/editor/types.d.ts', 'dist/types.d.ts')

fs.rmSync('dist/src', { recursive: true })
