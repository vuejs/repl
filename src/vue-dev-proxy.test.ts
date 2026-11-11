import * as vueDevProxy from './vue-dev-proxy'
import * as vue from 'vue'

describe('vue-dev-proxy', () => {
  it('should re-export all exports from vue', () => {
    const vueKeys = Object.keys(vue)
    const proxyKeys = Object.keys(vueDevProxy)

    vueKeys.forEach((key) => {
      expect(proxyKeys).toContain(key)
    })
  })

  it('should re-export vue correctly', () => {
    expect(vueDevProxy).toEqual(expect.objectContaining(vue))
  })
})
