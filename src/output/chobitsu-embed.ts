import chobitsu from 'chobitsu'

const scriptEls: HTMLScriptElement[] = []

Object.assign(window, {
  process: { env: {} },
  __modules__: <Record<string, unknown>>{},
  __export__(mod: any, key: string, get: () => any) {
    Object.defineProperty(mod, key, {
      enumerable: true,
      configurable: true,
      get,
    })
  },
  __dynamic_import__(key: string) {
    return Promise.resolve(this.__modules__[key])
  },
})

const sendToDevtools = (message: { method: string; params?: any }) => {
  window.parent.postMessage(JSON.stringify(message), '*')
}
let id = 0
const sendToChobitsu = (message: {
  method: string
  params?: any
  id?: string
}) => {
  message.id = 'tmp' + ++id
  chobitsu.sendRawMessage(JSON.stringify(message))
}
chobitsu.setOnMessage((message) => {
  if (message.includes('"id":"tmp')) return
  window.parent.postMessage(message, '*')
})
let loaded = false
window.addEventListener('message', async ({ data }) => {
  const { event } = data
  try {
    if (event === 'DEV') {
      if (loaded) chobitsu.sendRawMessage(data.data)

      return
    }
    if (event === 'LOADED') {
      if (loaded) return
      loaded = true
      sendToDevtools({
        method: 'Page.frameNavigated',
        params: {
          frame: {
            id: '1',
            mimeType: 'text/html',
            securityOrigin: location.origin,
            url: location.href,
          },
          type: 'Navigation',
        },
      })
      sendToChobitsu({ method: 'Network.enable' })
      sendToDevtools({ method: 'Runtime.executionContextsCleared' })
      sendToChobitsu({ method: 'Runtime.enable' })
      sendToChobitsu({ method: 'Debugger.enable' })
      sendToChobitsu({ method: 'DOMStorage.enable' })
      sendToChobitsu({ method: 'DOM.enable' })
      sendToChobitsu({ method: 'CSS.enable' })
      sendToChobitsu({ method: 'Overlay.enable' })
      sendToDevtools({ method: 'DOM.documentUpdated' })

      return
    }
  } catch (e) {
    console.error(e)
  }

  if (event === 'MYEVAL') {
    if (scriptEls.length) {
      scriptEls.forEach((el) => {
        document.head.removeChild(el)
      })
      scriptEls.length = 0
    }

    let { script: scripts } = data.data
    try {
      for (const script of scripts) {
        const scriptEl = document.createElement('script')
        scriptEl.setAttribute('type', 'module')
        // send ok in the module script to ensure sequential evaluation
        // of multiple proxy.eval() calls
        const done = new Promise((resolve) => {
          ;(window as unknown as any).__next__ = resolve
        })
        scriptEl.innerHTML = script + `\nwindow.__next__()`
        document.head.appendChild(scriptEl)
        scriptEl.onerror = (err) => console.error(err)
        scriptEls.push(scriptEl)
        await done
      }

      window.parent.postMessage(
        {
          event: 'MYEVAL',
          id: data.id,
        },
        '*'
      )
    } catch (error: any) {
      window.parent.postMessage({
        event: 'MYEVAL',
        id: data.id,
        error: error.message,
      })
    }
  }
})
