import { strFromU8, strToU8, unzlibSync, zlibSync } from 'fflate'

export function debounce(fn: Function, n = 100) {
  let handle: any
  return (...args: any[]) => {
    if (handle) clearTimeout(handle)
    handle = setTimeout(() => {
      fn(...args)
    }, n)
  }
}

export function utoa(data: string): string {
  const buffer = strToU8(data)
  const zipped = zlibSync(buffer, { level: 9 })
  const binary = strFromU8(zipped, true)
  return btoa(binary)
}

export function atou(base64: string): string {
  const binary = atob(base64)

  // zlib header (x78), level 9 (xDA)
  if (binary.startsWith('\x78\xDA')) {
    const buffer = strToU8(binary, true)
    const unzipped = unzlibSync(buffer)
    return strFromU8(unzipped)
  }

  // old unicode hacks for backward compatibility
  // https://base64.guru/developers/javascript/examples/unicode-strings
  return decodeURIComponent(escape(binary))
}

export function parse(value: any = false) {
  value = value ?? false
  if (typeof value === 'object') {
    return Object.entries(value) as [string, any][]
  }
  return false
}

export function word(total: number, singular: string, plural: string) {
  const choose = total > 1 ? plural : singular
  return `${total} ${choose}`
}

export function isObject(value: any) {
  const type = typeof value
  return value != null && (type == 'object' || type == 'function')
}
