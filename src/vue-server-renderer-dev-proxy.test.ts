import * as proxy from './vue-server-renderer-dev-proxy'
import * as vueServerRenderer from 'vue/server-renderer'

describe('vue-server-renderer-dev-proxy', () => {
  it('should re-export all exports from vue/server-renderer', () => {
    const vueKeys = Object.keys(vueServerRenderer)
    const proxyKeys = Object.keys(proxy)

    expect(proxyKeys.sort()).toEqual(vueKeys.sort())
  })

  it('should export createRenderer', () => {
    expect(proxy.createRenderer).toBe(vueServerRenderer.createRenderer)
  })

  it('should export renderToString', () => {
    expect(proxy.renderToString).toBe(vueServerRenderer.renderToString)
  })

  it('should export renderToNodeStream', () => {
    expect(proxy.renderToNodeStream).toBe(vueServerRenderer.renderToNodeStream)
  })

  it('should export pipeToNodeWritable', () => {
    expect(proxy.pipeToNodeWritable).toBe(vueServerRenderer.pipeToNodeWritable)
  })

  it('should export renderToWebStream', () => {
    expect(proxy.renderToWebStream).toBe(vueServerRenderer.renderToWebStream)
  })

  it('should export pipeToWebWritable', () => {
    expect(proxy.pipeToWebWritable).toBe(vueServerRenderer.pipeToWebWritable)
  })

  it('should export createReadableStream', () => {
    expect(proxy.createReadableStream).toBe(
      vueServerRenderer.createReadableStream,
    )
  })
})
