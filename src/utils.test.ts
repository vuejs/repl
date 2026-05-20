import { debounce, utoa, atou } from './utils'

describe('debounce', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('should call function after specified delay', () => {
    const fn = jest.fn()
    const debouncedFn = debounce(fn, 100)

    debouncedFn('arg1', 'arg2')
    expect(fn).not.toHaveBeenCalled()

    jest.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledWith('arg1', 'arg2')
  })

  it('should use default delay of 100ms when not specified', () => {
    const fn = jest.fn()
    const debouncedFn = debounce(fn)

    debouncedFn()
    jest.advanceTimersByTime(99)
    expect(fn).not.toHaveBeenCalled()

    jest.advanceTimersByTime(1)
    expect(fn).toHaveBeenCalled()
  })

  it('should cancel previous call when called again before delay', () => {
    const fn = jest.fn()
    const debouncedFn = debounce(fn, 100)

    debouncedFn('first')
    jest.advanceTimersByTime(50)

    debouncedFn('second')
    jest.advanceTimersByTime(50)
    expect(fn).not.toHaveBeenCalled()

    jest.advanceTimersByTime(50)
    expect(fn).toHaveBeenCalledWith('second')
    expect(fn).toHaveBeenCalledTimes(1)
  })
})

describe('utoa', () => {
  it('should compress and encode a string to base64', () => {
    const input = 'Hello, World!'
    const encoded = utoa(input)
    expect(typeof encoded).toBe('string')
    expect(encoded).not.toBe(input)
  })

  it('should handle empty string', () => {
    const encoded = utoa('')
    expect(typeof encoded).toBe('string')
  })

  it('should handle unicode characters', () => {
    const input = 'Hello 世界 🌍'
    const encoded = utoa(input)
    expect(typeof encoded).toBe('string')
  })

  it('should be reversible with atou', () => {
    const input = 'Test string with special chars: !@#$%^&*()'
    const encoded = utoa(input)
    const decoded = atou(encoded)
    expect(decoded).toBe(input)
  })
})

describe('atou', () => {
  it('should decode and decompress a base64 string', () => {
    const input = 'Sample text to decode'
    const encoded = utoa(input)
    const decoded = atou(encoded)
    expect(decoded).toBe(input)
  })

  it('should handle empty encoded string', () => {
    const encoded = utoa('')
    const decoded = atou(encoded)
    expect(decoded).toBe('')
  })

  it('should handle unicode characters', () => {
    const input = 'Hello 世界 🌍'
    const encoded = utoa(input)
    const decoded = atou(encoded)
    expect(decoded).toBe(input)
  })

  it('should handle old format (non-zlib) base64 strings', () => {
    // Old format: plain base64 of UTF-8 encoded string
    const input = 'Hello World'
    const oldFormat = btoa(unescape(encodeURIComponent(input)))
    const decoded = atou(oldFormat)
    expect(decoded).toBe(input)
  })

  it('should be reversible with utoa', () => {
    const input = 'Test string with special chars: !@#$%^&*()'
    const encoded = utoa(input)
    const decoded = atou(encoded)
    expect(decoded).toBe(input)
  })
})
