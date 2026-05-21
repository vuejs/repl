// Mock shiki modules before importing the module under test
jest.mock('shiki/core', () => ({
  createHighlighterCoreSync: jest.fn(() => ({})),
}))

jest.mock('shiki/engine-javascript.mjs', () => ({
  createJavaScriptRegexEngine: jest.fn(() => ({})),
}))

jest.mock('shiki/langs/vue.mjs', () => ({}))
jest.mock('shiki/langs/tsx.mjs', () => ({}))
jest.mock('shiki/langs/jsx.mjs', () => ({}))
jest.mock('shiki/themes/dark-plus.mjs', () => ({ name: 'dark-plus' }))
jest.mock('shiki/themes/light-plus.mjs', () => ({ name: 'light-plus' }))

jest.mock('@shikijs/monaco', () => ({
  shikiToMonaco: jest.fn(),
}))

import { registerHighlighter } from './highlight'

describe('registerHighlighter', () => {
  beforeEach(() => {
    // Reset the registered state before each test
    jest.resetModules()
  })

  it('should register monaco languages and return theme names', () => {
    const result = registerHighlighter()

    expect(result).toEqual({
      light: 'light-plus',
      dark: 'dark-plus',
    })
  })

  it('should return the same theme names on subsequent calls', () => {
    const firstCall = registerHighlighter()
    const secondCall = registerHighlighter()

    expect(firstCall).toEqual(secondCall)
  })

  it('should not throw when called multiple times', () => {
    expect(() => {
      registerHighlighter()
      registerHighlighter()
      registerHighlighter()
    }).not.toThrow()
  })
})
