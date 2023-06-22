// This file is executed from npm script with project root as cwd.
import fs from 'node:fs'

fs.renameSync('dist/src/editor/types.d.ts', 'dist/editor-types.d.ts')

fs.rmSync('dist/src', { recursive: true })
