import type { File, Store } from './store'
import type {
  BindingMetadata,
  CompilerOptions,
  SFCDescriptor,
} from 'vue/compiler-sfc'
import { type Transform, transform } from 'sucrase'
import hashId from 'hash-sum'
import { getSourceMap, toVisualizer, trimAnalyzedBindings } from './sourcemap'

export const COMP_IDENTIFIER = `__sfc__`

const REGEX_JS = /\.[jt]sx?$/
function testTs(filename: string | undefined | null) {
  return !!(filename && /(\.|\b)tsx?$/.test(filename))
}
function testJsx(filename: string | undefined | null) {
  return !!(filename && /(\.|\b)[jt]sx$/.test(filename))
}

function transformTS(src: string, isJSX?: boolean) {
  return transform(src, {
    transforms: ['typescript', ...(isJSX ? (['jsx'] as Transform[]) : [])],
    jsxRuntime: 'preserve',
  }).code
}

export async function compileFile(
  store: Store,
  { filename, code, compiled }: File,
): Promise<(string | Error)[]> {
  if (!code.trim()) {
    return []
  }

  if (filename.endsWith('.css')) {
    compiled.css = code
    return []
  }

  if (REGEX_JS.test(filename)) {
    const isJSX = testJsx(filename)
    if (testTs(filename)) {
      code = transformTS(code, isJSX)
    }
    if (isJSX) {
      code = await import('./jsx').then(({ transformJSX }) =>
        transformJSX(code),
      )
    }
    compiled.js = compiled.ssr = code
    return []
  }

  if (filename.endsWith('.json')) {
    let parsed
    try {
      parsed = JSON.parse(code)
    } catch (err: any) {
      console.error(`Error parsing ${filename}`, err.message)
      return [err.message]
    }
    compiled.js = compiled.ssr = `export default ${JSON.stringify(parsed)}`
    return []
  }

  if (!filename.endsWith('.vue')) {
    return []
  }

  const id = hashId(filename)
  const { errors, descriptor } = store.compiler.parse(code, {
    filename,
    sourceMap: true,
    templateParseOptions: store.sfcOptions?.template?.compilerOptions,
  })
  if (errors.length) {
    return errors
  }

  const styleLangs = descriptor.styles.map((s) => s.lang).filter(Boolean)
  const templateLang = descriptor.template?.lang
  if (styleLangs.length && templateLang) {
    return [
      `lang="${styleLangs.join(
        ',',
      )}" pre-processors for <style> and lang="${templateLang}" ` +
        `for <template> are currently not supported.`,
    ]
  } else if (styleLangs.length) {
    return [
      `lang="${styleLangs.join(
        ',',
      )}" pre-processors for <style> are currently not supported.`,
    ]
  } else if (templateLang) {
    return [
      `lang="${templateLang}" pre-processors for ` +
        `<template> are currently not supported.`,
    ]
  }

  const scriptLang = descriptor.script?.lang || descriptor.scriptSetup?.lang
  const isTS = testTs(scriptLang)
  const isJSX = testJsx(scriptLang)

  if (scriptLang && scriptLang !== 'js' && !isTS && !isJSX) {
    return [`Unsupported lang "${scriptLang}" in <script> blocks.`]
  }

  const hasScoped = descriptor.styles.some((s) => s.scoped)
  let clientCode = ''
  let ssrCode = ''
  let ssrScript = ''
  let clientScriptMap: any
  let clientTemplateMap: any
  let ssrScriptMap: any
  let ssrTemplateMap: any

  const appendSharedCode = (code: string) => {
    clientCode += code
    ssrCode += code
  }

  let clientScript: string
  let bindings: BindingMetadata | undefined
  try {
    const res = await doCompileScript(store, descriptor, id, false, isTS, isJSX)
    clientScript = res.code
    bindings = res.bindings
    clientScriptMap = res.map
  } catch (e: any) {
    return [e.stack.split('\n').slice(0, 12).join('\n')]
  }

  clientCode += clientScript

  // script ssr needs to be performed if :
  // 1.using <script setup> where the render fn is inlined.
  // 2.using cssVars, as it do not need to be injected during SSR.
  if (descriptor.scriptSetup || descriptor.cssVars.length > 0) {
    try {
      const ssrScriptResult = await doCompileScript(
        store,
        descriptor,
        id,
        true,
        isTS,
        isJSX,
      )
      ssrScript = ssrScriptResult.code
      ssrCode += ssrScript
      ssrScriptMap = ssrScriptResult.map
    } catch (e) {
      ssrCode = `/* SSR compile error: ${e} */`
    }
  } else {
    // the script result will be identical.
    ssrCode += clientScript
  }

  // template
  // only need dedicated compilation if not using <script setup>
  if (
    descriptor.template &&
    (!descriptor.scriptSetup ||
      store.sfcOptions?.script?.inlineTemplate === false)
  ) {
    const clientTemplateResult = await doCompileTemplate(
      store,
      descriptor,
      id,
      bindings,
      false,
      isTS,
      isJSX,
    )
    if (clientTemplateResult.errors.length) {
      return clientTemplateResult.errors
    }
    clientCode += `;${clientTemplateResult.code}`
    clientTemplateMap = clientTemplateResult.map

    const ssrTemplateResult = await doCompileTemplate(
      store,
      descriptor,
      id,
      bindings,
      true,
      isTS,
      isJSX,
    )
    if (ssrTemplateResult.code) {
      // ssr compile failure is fine
      ssrCode += `;${ssrTemplateResult.code}`
      ssrTemplateMap = ssrTemplateResult.map
    } else {
      ssrCode = `/* SSR compile error: ${ssrTemplateResult.errors[0]} */`
    }
  }

  if (isJSX) {
    const { transformJSX } = await import('./jsx')
    clientCode &&= transformJSX(clientCode)
    ssrCode &&= transformJSX(ssrCode)
  }

  if (hasScoped) {
    appendSharedCode(
      `\n${COMP_IDENTIFIER}.__scopeId = ${JSON.stringify(`data-v-${id}`)}`,
    )
  }

  // styles
  const ceFilter = store.sfcOptions.script?.customElement || /\.ce\.vue$/
  function isCustomElement(filters: typeof ceFilter): boolean {
    if (typeof filters === 'boolean') {
      return filters
    }
    if (typeof filters === 'function') {
      return filters(filename)
    }
    return filters.test(filename)
  }
  let isCE = isCustomElement(ceFilter)

  let css = ''
  let styles: string[] = []
  for (const style of descriptor.styles) {
    if (style.module) {
      return [`<style module> is not supported in the playground.`]
    }

    const styleResult = await store.compiler.compileStyleAsync({
      ...store.sfcOptions?.style,
      source: style.content,
      filename,
      id,
      scoped: style.scoped,
      modules: !!style.module,
    })
    if (styleResult.errors.length) {
      // postcss uses pathToFileURL which isn't polyfilled in the browser
      // ignore these errors for now
      if (!styleResult.errors[0].message.includes('pathToFileURL')) {
        store.errors = styleResult.errors
      }
      // proceed even if css compile errors
    } else {
      isCE ? styles.push(styleResult.code) : (css += styleResult.code + '\n')
    }
  }
  if (css) {
    compiled.css = css.trim()
  } else {
    compiled.css = isCE
      ? (compiled.css =
          '/* The component style of the custom element will be compiled into the component object */')
      : '/* No <style> tags present */'
  }

  if (clientCode || ssrCode) {
    const ceStyles = isCE
      ? `\n${COMP_IDENTIFIER}.styles = ${JSON.stringify(styles)}`
      : ''
    appendSharedCode(
      `\n${COMP_IDENTIFIER}.__file = ${JSON.stringify(filename)}` +
        ceStyles +
        `\nexport default ${COMP_IDENTIFIER}`,
    )
    compiled.js = clientCode.trimStart()
    compiled.ssr = ssrCode.trimStart()
    compiled.clientMap = toVisualizer(
      trimAnalyzedBindings(compiled.js),
      getSourceMap(filename, clientScript, clientScriptMap, clientTemplateMap),
    )
    compiled.ssrMap = toVisualizer(
      trimAnalyzedBindings(compiled.ssr),
      getSourceMap(
        filename,
        ssrScript || clientScript,
        ssrScriptMap,
        ssrTemplateMap,
      ),
    )
  }

  return []
}

async function doCompileScript(
  store: Store,
  descriptor: SFCDescriptor,
  id: string,
  ssr: boolean,
  isTS: boolean,
  isJSX: boolean,
): Promise<{ code: string; bindings: BindingMetadata | undefined; map?: any }> {
  if (descriptor.script || descriptor.scriptSetup) {
    const expressionPlugins: CompilerOptions['expressionPlugins'] = []
    if (isTS) {
      expressionPlugins.push('typescript')
    }
    if (isJSX) {
      expressionPlugins.push('jsx')
    }
    const compiledScript = store.compiler.compileScript(descriptor, {
      inlineTemplate: true,
      ...store.sfcOptions?.script,
      id,
      genDefaultAs: COMP_IDENTIFIER,
      templateOptions: {
        ...store.sfcOptions?.template,
        ssr,
        ssrCssVars: descriptor.cssVars,
        compilerOptions: {
          ...store.sfcOptions?.template?.compilerOptions,
          expressionPlugins,
        },
      },
    })
    let code = compiledScript.content
    if (isTS) {
      code = await transformTS(code, isJSX)
    }
    if (compiledScript.bindings) {
      code =
        `/* Analyzed bindings: ${JSON.stringify(
          compiledScript.bindings,
          null,
          2,
        )} */\n` + code
    }

    return { code, bindings: compiledScript.bindings, map: compiledScript.map }
  } else {
    // @ts-expect-error TODO remove when 3.6 is out
    const vaporFlag = descriptor.vapor ? '__vapor: true' : ''
    return {
      code: `\nconst ${COMP_IDENTIFIER} = { ${vaporFlag} }`,
      bindings: {},
      map: undefined,
    }
  }
}

async function doCompileTemplate(
  store: Store,
  descriptor: SFCDescriptor,
  id: string,
  bindingMetadata: BindingMetadata | undefined,
  ssr: boolean,
  isTS: boolean,
  isJSX: boolean,
) {
  const expressionPlugins: CompilerOptions['expressionPlugins'] = []
  if (isTS) {
    expressionPlugins.push('typescript')
  }
  if (isJSX) {
    expressionPlugins.push('jsx')
  }

  const res = store.compiler.compileTemplate({
    isProd: false,
    ...store.sfcOptions?.template,
    // @ts-expect-error TODO remove expect-error after 3.6
    vapor: descriptor.vapor,
    ast: descriptor.template!.ast,
    source: descriptor.template!.content,
    filename: descriptor.filename,
    id,
    scoped: descriptor.styles.some((s) => s.scoped),
    slotted: descriptor.slotted,
    ssr,
    ssrCssVars: descriptor.cssVars,
    compilerOptions: {
      ...store.sfcOptions?.template?.compilerOptions,
      bindingMetadata,
      expressionPlugins,
    },
  })
  let { code, errors, map } = res
  if (errors.length) {
    return { code, map, errors }
  }

  const fnName = ssr ? `ssrRender` : `render`

  code =
    `\n${code.replace(
      /\nexport (function|const) (render|ssrRender)/,
      `$1 ${fnName}`,
    )}` + `\n${COMP_IDENTIFIER}.${fnName} = ${fnName}`

  if (isTS) {
    code = await transformTS(code, isJSX)
  }
  return { code, map, errors: [] }
}
