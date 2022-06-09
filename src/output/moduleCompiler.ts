import { File, Store } from '../store'
import {
  babelParse,
  MagicString,
  walk,
  walkIdentifiers,
  extractIdentifiers,
  isInDestructureAssignment,
  isStaticProperty
} from 'vue/compiler-sfc'
import { ExportSpecifier, Identifier, Node } from '@babel/types'

export function compileModulesForPreview(store: Store, isSSR = false) {
  const seen = new Set<File>()
  const processed: string[] = []
  processFile(
    store,
    store.state.files[store.state.mainFile],
    processed,
    seen,
    isSSR
  )

  if (!isSSR) {
    // also add css files that are not imported
    for (const filename in store.state.files) {
      if (filename.endsWith('.css')) {
        const file = store.state.files[filename]
        if (!seen.has(file)) {
          processed.push(
            `\nwindow.__css__ += ${JSON.stringify(file.compiled.css)}`
          )
        }
      }
    }
  }

  return processed
}

const modulesKey = `__modules__`
const exportKey = `__export__`
const dynamicImportKey = `__dynamic_import__`
const moduleKey = `__module__`

// similar logic with Vite's SSR transform, except this is targeting the browser
function processFile(
  store: Store,
  file: File,
  processed: string[],
  seen: Set<File>,
  isSSR: boolean
) {
  if (seen.has(file)) {
    return []
  }
  seen.add(file)

  if (!isSSR && file.filename.endsWith('.html')) {
    return processHtmlFile(store, file.code, file.filename, processed, seen)
  }

  let [js, importedFiles] = processModule(
    store,
    isSSR ? file.compiled.ssr : file.compiled.js,
    file.filename
  )
  // append css
  if (!isSSR && file.compiled.css) {
    js += `\nwindow.__css__ += ${JSON.stringify(file.compiled.css)}`
  }
  // crawl child imports
  if (importedFiles.size) {
    for (const imported of importedFiles) {
      processFile(store, store.state.files[imported], processed, seen, isSSR)
    }
  }
  // push self
  processed.push(js)
}

function processModule(
  store: Store,
  src: string,
  filename: string
): [string, Set<string>] {
  const s = new MagicString(src)

  const ast = babelParse(src, {
    sourceFilename: filename,
    sourceType: 'module'
  }).program.body

  const idToImportMap = new Map<string, string>()
  const declaredConst = new Set<string>()
  const importedFiles = new Set<string>()
  const importToIdMap = new Map<string, string>()

  function defineImport(node: Node, source: string) {
    const filename = source.replace(/^\.\/+/, '')
    if (!(filename in store.state.files)) {
      throw new Error(`File "${filename}" does not exist.`)
    }
    if (importedFiles.has(filename)) {
      return importToIdMap.get(filename)!
    }
    importedFiles.add(filename)
    const id = `__import_${importedFiles.size}__`
    importToIdMap.set(filename, id)
    s.appendLeft(
      node.start!,
      `const ${id} = ${modulesKey}[${JSON.stringify(filename)}]\n`
    )
    return id
  }

  function defineExport(name: string, local = name) {
    s.append(`\n${exportKey}(${moduleKey}, "${name}", () => ${local})`)
  }

  // 0. instantiate module
  s.prepend(
    `const ${moduleKey} = ${modulesKey}[${JSON.stringify(
      filename
    )}] = { [Symbol.toStringTag]: "Module" }\n\n`
  )

  // 1. check all import statements and record id -> importName map
  for (const node of ast) {
    // import foo from 'foo' --> foo -> __import_foo__.default
    // import { baz } from 'foo' --> baz -> __import_foo__.baz
    // import * as ok from 'foo' --> ok -> __import_foo__
    if (node.type === 'ImportDeclaration') {
      const source = node.source.value
      if (source.startsWith('./')) {
        const importId = defineImport(node, node.source.value)
        for (const spec of node.specifiers) {
          if (spec.type === 'ImportSpecifier') {
            idToImportMap.set(
              spec.local.name,
              `${importId}.${(spec.imported as Identifier).name}`
            )
          } else if (spec.type === 'ImportDefaultSpecifier') {
            idToImportMap.set(spec.local.name, `${importId}.default`)
          } else {
            // namespace specifier
            idToImportMap.set(spec.local.name, importId)
          }
        }
        s.remove(node.start!, node.end!)
      }
    }
  }

  // 2. check all export statements and define exports
  for (const node of ast) {
    // named exports
    if (node.type === 'ExportNamedDeclaration') {
      if (node.declaration) {
        if (
          node.declaration.type === 'FunctionDeclaration' ||
          node.declaration.type === 'ClassDeclaration'
        ) {
          // export function foo() {}
          defineExport(node.declaration.id!.name)
        } else if (node.declaration.type === 'VariableDeclaration') {
          // export const foo = 1, bar = 2
          for (const decl of node.declaration.declarations) {
            for (const id of extractIdentifiers(decl.id)) {
              defineExport(id.name)
            }
          }
        }
        s.remove(node.start!, node.declaration.start!)
      } else if (node.source) {
        // export { foo, bar } from './foo'
        const importId = defineImport(node, node.source.value)
        for (const spec of node.specifiers) {
          defineExport(
            (spec.exported as Identifier).name,
            `${importId}.${(spec as ExportSpecifier).local.name}`
          )
        }
        s.remove(node.start!, node.end!)
      } else {
        // export { foo, bar }
        for (const spec of node.specifiers) {
          const local = (spec as ExportSpecifier).local.name
          const binding = idToImportMap.get(local)
          defineExport((spec.exported as Identifier).name, binding || local)
        }
        s.remove(node.start!, node.end!)
      }
    }

    // default export
    if (node.type === 'ExportDefaultDeclaration') {
      if ('id' in node.declaration && node.declaration.id) {
        // named hoistable/class exports
        // export default function foo() {}
        // export default class A {}
        const { name } = node.declaration.id
        s.remove(node.start!, node.start! + 15)
        s.append(`\n${exportKey}(${moduleKey}, "default", () => ${name})`)
      } else {
        // anonymous default exports
        s.overwrite(node.start!, node.start! + 14, `${moduleKey}.default =`)
      }
    }

    // export * from './foo'
    if (node.type === 'ExportAllDeclaration') {
      const importId = defineImport(node, node.source.value)
      s.remove(node.start!, node.end!)
      s.append(`\nfor (const key in ${importId}) {
        if (key !== 'default') {
          ${exportKey}(${moduleKey}, key, () => ${importId}[key])
        }
      }`)
    }
  }

  // 3. convert references to import bindings
  for (const node of ast) {
    if (node.type === 'ImportDeclaration') continue
    walkIdentifiers(node, (id, parent, parentStack) => {
      const binding = idToImportMap.get(id.name)
      if (!binding) {
        return
      }
      if (isStaticProperty(parent) && parent.shorthand) {
        // let binding used in a property shorthand
        // { foo } -> { foo: __import_x__.foo }
        // skip for destructure patterns
        if (
          !(parent as any).inPattern ||
          isInDestructureAssignment(parent, parentStack)
        ) {
          s.appendLeft(id.end!, `: ${binding}`)
        }
      } else if (
        parent.type === 'ClassDeclaration' &&
        id === parent.superClass
      ) {
        if (!declaredConst.has(id.name)) {
          declaredConst.add(id.name)
          // locate the top-most node containing the class declaration
          const topNode = parentStack[1]
          s.prependRight(topNode.start!, `const ${id.name} = ${binding};\n`)
        }
      } else {
        s.overwrite(id.start!, id.end!, binding)
      }
    })
  }

  // 4. convert dynamic imports
  ;(walk as any)(ast, {
    enter(node: Node, parent: Node) {
      if (node.type === 'Import' && parent.type === 'CallExpression') {
        const arg = parent.arguments[0]
        if (arg.type === 'StringLiteral' && arg.value.startsWith('./')) {
          s.overwrite(node.start!, node.start! + 6, dynamicImportKey)
          s.overwrite(
            arg.start!,
            arg.end!,
            JSON.stringify(arg.value.replace(/^\.\/+/, ''))
          )
        }
      }
    }
  })

  return [s.toString(), importedFiles]
}

const scriptRE = /<script\b(?:\s[^>]*>|>)([^]*?)<\/script>/gi
const scriptModuleRE =
  /<script\b[^>]*type\s*=\s*(?:"module"|'module')[^>]*>([^]*?)<\/script>/gi

function processHtmlFile(
  store: Store,
  src: string,
  filename: string,
  processed: string[],
  seen: Set<File>
) {
  const deps: string[] = []
  let jsCode = ''
  const html = src
    .replace(scriptModuleRE, (_, content) => {
      const [code, importedFiles] = processModule(store, content, filename)
      if (importedFiles.size) {
        for (const imported of importedFiles) {
          processFile(store, store.state.files[imported], deps, seen, false)
        }
      }
      jsCode += '\n' + code
      return ''
    })
    .replace(scriptRE, (_, content) => {
      jsCode += '\n' + content
      return ''
    })
  processed.push(`document.body.innerHTML = ${JSON.stringify(html)}`)
  processed.push(...deps)
  processed.push(jsCode)
}
