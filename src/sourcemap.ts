import type { RawSourceMap } from 'source-map-js'
import type { EncodedSourceMap as TraceEncodedSourceMap } from '@jridgewell/trace-mapping'
import { TraceMap, eachMapping } from '@jridgewell/trace-mapping'
import type { EncodedSourceMap as GenEncodedSourceMap } from '@jridgewell/gen-mapping'
import { addMapping, fromMap, toEncodedMap } from '@jridgewell/gen-mapping'

// trim analyzed bindings comment
export function trimAnalyzedBindings(scriptCode: string) {
  return scriptCode.replace(/\/\*[\s\S]*?\*\/\n/, '').trim()
}
/**
 * The merge logic of sourcemap is consistent with the logic in vite-plugin-vue
 */
export function getSourceMap(
  filename: string,
  scriptCode: string,
  scriptMap: any,
  templateMap: any,
): RawSourceMap {
  let resolvedMap: RawSourceMap | undefined = undefined
  if (templateMap) {
    // if the template is inlined into the main module (indicated by the presence
    // of templateMap), we need to concatenate the two source maps.
    const from = scriptMap ?? {
      file: filename,
      sourceRoot: '',
      version: 3,
      sources: [],
      sourcesContent: [],
      names: [],
      mappings: '',
    }
    const gen = fromMap(
      // version property of result.map is declared as string
      // but actually it is `3`
      from as Omit<RawSourceMap, 'version'> as TraceEncodedSourceMap,
    )
    const tracer = new TraceMap(
      // same above
      templateMap as Omit<RawSourceMap, 'version'> as TraceEncodedSourceMap,
    )
    const offset = trimAnalyzedBindings(scriptCode).match(/\r?\n/g)?.length ?? 0
    eachMapping(tracer, (m) => {
      if (m.source == null) return
      addMapping(gen, {
        source: m.source,
        original: { line: m.originalLine, column: m.originalColumn },
        generated: {
          line: m.generatedLine + offset,
          column: m.generatedColumn,
        },
      })
    })

    // same above
    resolvedMap = toEncodedMap(gen) as Omit<
      GenEncodedSourceMap,
      'version'
    > as RawSourceMap
    // if this is a template only update, we will be reusing a cached version
    // of the main module compile result, which has outdated sourcesContent.
    resolvedMap.sourcesContent = templateMap.sourcesContent
  } else {
    resolvedMap = scriptMap
  }

  return resolvedMap!
}

/*
 * Slightly modified version of https://github.com/AriPerkkio/vite-plugin-source-map-visualizer/blob/main/src/generate-link.ts
 */
export function toVisualizer(code: string, sourceMap: RawSourceMap) {
  const map = JSON.stringify(sourceMap)
  const encoder = new TextEncoder()

  // Convert the strings to Uint8Array
  const codeArray = encoder.encode(code)
  const mapArray = encoder.encode(map)

  // Create Uint8Array for the lengths
  const codeLengthArray = encoder.encode(codeArray.length.toString())
  const mapLengthArray = encoder.encode(mapArray.length.toString())

  // Combine the lengths and the data
  const combinedArray = new Uint8Array(
    codeLengthArray.length +
      1 +
      codeArray.length +
      mapLengthArray.length +
      1 +
      mapArray.length,
  )

  combinedArray.set(codeLengthArray)
  combinedArray.set([0], codeLengthArray.length)
  combinedArray.set(codeArray, codeLengthArray.length + 1)
  combinedArray.set(
    mapLengthArray,
    codeLengthArray.length + 1 + codeArray.length,
  )
  combinedArray.set(
    [0],
    codeLengthArray.length + 1 + codeArray.length + mapLengthArray.length,
  )
  combinedArray.set(
    mapArray,
    codeLengthArray.length + 1 + codeArray.length + mapLengthArray.length + 1,
  )

  // Convert the Uint8Array to a binary string
  let binary = ''
  const len = combinedArray.byteLength
  for (let i = 0; i < len; i++) binary += String.fromCharCode(combinedArray[i])

  // Convert the binary string to a base64 string and return it
  return `https://evanw.github.io/source-map-visualization#${btoa(binary)}`
}
