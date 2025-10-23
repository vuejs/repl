#!/usr/bin/env node
/* eslint-disable no-console */

import fs from 'fs'
import path from 'path'

const pkgCssPath = path.resolve(
  process.cwd(),
  'node_modules',
  'sample-vue-library',
  'dist',
  'styles.css',
)
const outDir = path.resolve(process.cwd(), 'src', 'generated')
const outFile = path.join(outDir, 'css.ts')

function fail(msg) {
  console.error(msg)
  process.exit(1)
}

if (!fs.existsSync(pkgCssPath)) {
  fail(`CSS source file not found: ${pkgCssPath}`)
}

try {
  const css = fs.readFileSync(pkgCssPath, 'utf8')

  // Escape backticks and "${" sequences so the generated template literal is safe.
  const safe = css.replace(/`/g, '\\`').replace(/\$\{/g, '\\${')

  const ts = `export const css = \`${safe}\`;\n`

  fs.mkdirSync(outDir, { recursive: true })
  fs.writeFileSync(outFile, ts, 'utf8')

  console.log(`Wrote ${outFile} (${Buffer.byteLength(ts, 'utf8')} bytes)`)
} catch (err) {
  fail(`Error: ${err.message}`)
}
