import { Store, File } from './store'
import {
  SFCDescriptor,
  BindingMetadata,
  shouldTransformRef,
  transformRef,
  CompilerOptions
} from 'vue/compiler-sfc'
import { transform } from 'sucrase'
// @ts-ignore
import hashId from 'hash-sum'

export const COMP_IDENTIFIER = `__sfc__`

async function transformTS(src: string) {
  return transform(src, {
    transforms: ['typescript']
  }).code
}

export async function compileFile(store: Store, file: File) {
  function withTransformer(
    code: string,
    filename: string,
    stage: 'pre' | 'post',
    ssr = false
  ) {
    if (!store.transformer) return code
    try {
      return store.transformer({ code, filename, file, stage, ssr }) || code
    } catch (err: any) {
      store.state.errors.push(err)
    }
    return code
  }

  store.state.errors = []

  let { code } = file
  const { filename, compiled } = file
  if (!code.trim()) {
    return
  }

  code = withTransformer(code, filename, 'pre')

  if (filename.endsWith('.css')) {
    compiled.css = withTransformer(code, filename, 'post')
    return
  }

  if (filename.endsWith('.js') || filename.endsWith('.ts')) {
    if (shouldTransformRef(code)) {
      code = transformRef(code, { filename }).code
    }
    if (filename.endsWith('.ts')) {
      code = await transformTS(code)
    }
    compiled.js = withTransformer(code, filename, 'post')
    compiled.ssr = withTransformer(code, filename, 'post', true)
    return
  }

  if (!filename.endsWith('.vue')) {
    compiled.js = withTransformer(code, filename, 'post')
    return
  }

  const id = hashId(filename)
  const { errors, descriptor } = store.compiler.parse(code, {
    filename,
    sourceMap: true
  })
  if (errors.length) {
    store.state.errors = errors
    return
  }

  const unsupportedStyle = descriptor.styles.find(
    (s) => s.lang && !store.supportedLanguages.includes(s.lang)
  )
  if (unsupportedStyle) {
    store.state.errors.push(
      `lang="${unsupportedStyle.lang}" pre-processors for <style> are not supported.`
    )
    return
  }

  if (
    descriptor.template &&
    descriptor.template.lang &&
    !store.supportedLanguages.includes(descriptor.template.lang)
  ) {
    store.state.errors.push(
      `lang="${descriptor.template.lang}" pre-processors for <template> are not supported.`
    )
    return
  }

  const scriptLang =
    (descriptor.script && descriptor.script.lang) ||
    (descriptor.scriptSetup && descriptor.scriptSetup.lang)
  const isTS = scriptLang === 'ts'
  if (scriptLang && !isTS) {
    store.state.errors.push(`Only lang="ts" is supported for <script> blocks.`)
    return
  }

  const hasScoped = descriptor.styles.some((s) => s.scoped)
  let clientCode = ''
  let ssrCode = ''

  const appendSharedCode = (code: string) => {
    clientCode += code
    ssrCode += code
  }

  const clientScriptResult = await doCompileScript(
    store,
    descriptor,
    id,
    false,
    isTS
  )
  if (!clientScriptResult) {
    return
  }
  const [clientScript, bindings] = clientScriptResult
  clientCode += clientScript

  // script ssr only needs to be performed if using <script setup> where
  // the render fn is inlined.
  if (descriptor.scriptSetup) {
    const ssrScriptResult = await doCompileScript(
      store,
      descriptor,
      id,
      true,
      isTS
    )
    if (ssrScriptResult) {
      ssrCode += ssrScriptResult[0]
    } else {
      ssrCode = `/* SSR compile error: ${store.state.errors[0]} */`
    }
  } else {
    // when no <script setup> is used, the script result will be identical.
    ssrCode += clientScript
  }

  // template
  // only need dedicated compilation if not using <script setup>
  if (
    descriptor.template &&
    (!descriptor.scriptSetup || store.options?.script?.inlineTemplate === false)
  ) {
    const templateFilename = `${filename}.template.${
      descriptor.template.lang || 'html'
    }`
    const source = withTransformer(
      descriptor.template!.content,
      templateFilename,
      'pre'
    )
    let clientTemplateResult = await doCompileTemplate(
      store,
      descriptor,
      source,
      id,
      bindings,
      false,
      isTS
    )
    clientTemplateResult = withTransformer(
      clientTemplateResult || '',
      templateFilename,
      'post'
    )
    if (!clientTemplateResult) {
      return
    }
    clientCode += clientTemplateResult

    let ssrTemplateResult = await doCompileTemplate(
      store,
      descriptor,
      source,
      id,
      bindings,
      true,
      isTS
    )
    ssrTemplateResult = withTransformer(
      ssrTemplateResult || '',
      templateFilename,
      'post',
      true
    )
    if (ssrTemplateResult) {
      // ssr compile failure is fine
      ssrCode += ssrTemplateResult
    } else {
      ssrCode = `/* SSR compile error: ${store.state.errors[0]} */`
    }
  }

  if (hasScoped) {
    appendSharedCode(
      `\n${COMP_IDENTIFIER}.__scopeId = ${JSON.stringify(`data-v-${id}`)}`
    )
  }

  if (clientCode || ssrCode) {
    appendSharedCode(
      `\n${COMP_IDENTIFIER}.__file = ${JSON.stringify(filename)}` +
        `\nexport default ${COMP_IDENTIFIER}`
    )
    compiled.js = clientCode.trimStart()
    compiled.ssr = ssrCode.trimStart()
  }

  // styles
  let css = ''
  for (const [i, style] of descriptor.styles.entries()) {
    if (style.module) {
      store.state.errors.push(
        `<style module> is not supported in the playground.`
      )
      return
    }

    const styleFilename = `${filename}.${i}.${style.lang || 'css'}`
    const source = withTransformer(style.content, styleFilename, 'pre')
    const styleResult = await store.compiler.compileStyleAsync({
      ...store.options?.style,
      source,
      filename,
      id,
      scoped: style.scoped,
      modules: !!style.module
    })
    if (styleResult.errors.length) {
      // postcss uses pathToFileURL which isn't polyfilled in the browser
      // ignore these errors for now
      if (!styleResult.errors[0].message.includes('pathToFileURL')) {
        store.state.errors = styleResult.errors
      }
      // proceed even if css compile errors
    } else {
      css += withTransformer(styleResult.code + '\n', styleFilename, 'post')
    }
  }
  if (css) {
    compiled.css = css.trim()
  } else {
    compiled.css = '/* No <style> tags present */'
  }

  compiled.js = withTransformer(compiled.js, filename, 'post')
  compiled.ssr = withTransformer(compiled.ssr, filename, 'post', true)
  compiled.css = withTransformer(compiled.css, filename + '.css', 'post')
}

async function doCompileScript(
  store: Store,
  descriptor: SFCDescriptor,
  id: string,
  ssr: boolean,
  isTS: boolean
): Promise<[string, BindingMetadata | undefined] | undefined> {
  if (descriptor.script || descriptor.scriptSetup) {
    try {
      const expressionPlugins: CompilerOptions['expressionPlugins'] = isTS
        ? ['typescript']
        : undefined
      const compiledScript = store.compiler.compileScript(descriptor, {
        inlineTemplate: true,
        ...store.options?.script,
        id,
        templateOptions: {
          ...store.options?.template,
          ssr,
          ssrCssVars: descriptor.cssVars,
          compilerOptions: {
            ...store.options?.template?.compilerOptions,
            expressionPlugins
          }
        }
      })
      let code = ''
      if (compiledScript.bindings) {
        code += `\n/* Analyzed bindings: ${JSON.stringify(
          compiledScript.bindings,
          null,
          2
        )} */`
      }
      code +=
        `\n` +
        store.compiler.rewriteDefault(
          compiledScript.content,
          COMP_IDENTIFIER,
          expressionPlugins
        )

      if ((descriptor.script || descriptor.scriptSetup)!.lang === 'ts') {
        code = await transformTS(code)
      }

      return [code, compiledScript.bindings]
    } catch (e: any) {
      store.state.errors = [e.stack.split('\n').slice(0, 12).join('\n')]
      return
    }
  } else {
    return [`\nconst ${COMP_IDENTIFIER} = {}`, undefined]
  }
}

async function doCompileTemplate(
  store: Store,
  descriptor: SFCDescriptor,
  source: string,
  id: string,
  bindingMetadata: BindingMetadata | undefined,
  ssr: boolean,
  isTS: boolean
) {
  const templateResult = store.compiler.compileTemplate({
    ...store.options?.template,
    source,
    filename: descriptor.filename,
    id,
    scoped: descriptor.styles.some((s) => s.scoped),
    slotted: descriptor.slotted,
    ssr,
    ssrCssVars: descriptor.cssVars,
    isProd: false,
    compilerOptions: {
      ...store.options?.template?.compilerOptions,
      bindingMetadata,
      expressionPlugins: isTS ? ['typescript'] : undefined
    }
  })
  if (templateResult.errors.length) {
    store.state.errors = templateResult.errors
    return
  }

  const fnName = ssr ? `ssrRender` : `render`

  let code =
    `\n${templateResult.code.replace(
      /\nexport (function|const) (render|ssrRender)/,
      `$1 ${fnName}`
    )}` + `\n${COMP_IDENTIFIER}.${fnName} = ${fnName}`

  if ((descriptor.script || descriptor.scriptSetup)?.lang === 'ts') {
    code = await transformTS(code)
  }

  return code
}
