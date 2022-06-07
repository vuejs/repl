import { gzip, ungzip } from 'pako'

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
  const zipped: Uint8Array = gzip(data, { level: 9 })
  const b = Array.from(zipped, v => String.fromCharCode(v)).join('')
  return btoa(b)
}

export function atou(base64: string): string {
  const b = atob(base64)
  if (b.startsWith('\x1F\x8B')) {
    const buffer = Uint8Array.from(b, (_, i) => b.charCodeAt(i))
    return ungzip(buffer, { to: 'string' })
  }

  // old unicode hacks for backward compatibility
  // https://base64.guru/developers/javascript/examples/unicode-strings
  return decodeURIComponent(escape(b))
}
