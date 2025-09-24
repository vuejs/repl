const DefaultLessVersion = '4.3.0'

export const importLessFromCdn = async (
  version: string = DefaultLessVersion,
) => {
  return new Promise((resolve, reject) => {
    if (!document?.body) {
      reject(new Error('Document body not found'))
    }
    const el = document.createElement('script')
    el.src = `https://cdn.jsdelivr.net/npm/less@${version}/dist/less.min.js`
    el.onload = () => {
      if ((window as any)?.less && (window as any)?.less.render) {
        resolve(void 0)
      } else {
        reject(new Error('Import less from cdn failed'))
      }
    }
    el.onerror = (err) => {
      reject(err)
    }
    document.body.appendChild(el)
  })
}
