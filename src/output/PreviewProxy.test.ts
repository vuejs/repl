import { PreviewProxy } from './PreviewProxy'

// Mock window and related APIs for node environment
const mockAddEventListener = jest.fn()
const mockRemoveEventListener = jest.fn()
const mockPostMessage = jest.fn()

// Create a mock for the iframe's contentWindow
const mockIframeContentWindow = {
  postMessage: mockPostMessage,
} as unknown as Window

// Create a mock window object
const mockWindow = {
  addEventListener: mockAddEventListener,
  removeEventListener: mockRemoveEventListener,
  postMessage: mockPostMessage,
} as unknown as Window & typeof globalThis

// Mock the global window
Object.defineProperty(global, 'window', {
  value: mockWindow,
  writable: true,
  configurable: true,
})

// Create a mock iframe element
const createMockIframe = () =>
  ({
    contentWindow: mockIframeContentWindow,
  }) as unknown as HTMLIFrameElement

describe('PreviewProxy', () => {
  let iframe: HTMLIFrameElement
  let handlers: Record<string, jest.Mock>
  let proxy: PreviewProxy

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks()

    // Create a fresh mock iframe for each test
    iframe = createMockIframe()

    handlers = {
      on_fetch_progress: jest.fn(),
      on_error: jest.fn(),
      on_unhandled_rejection: jest.fn(),
      on_console: jest.fn(),
      on_console_group: jest.fn(),
      on_console_group_collapsed: jest.fn(),
      on_console_group_end: jest.fn(),
    }

    proxy = new PreviewProxy(iframe, handlers)
  })

  afterEach(() => {
    proxy.destroy()
  })

  describe('constructor', () => {
    it('should initialize with iframe and handlers', () => {
      expect(proxy.iframe).toBe(iframe)
      expect(proxy.handlers).toBe(handlers)
      expect(proxy.pending_cmds).toBeInstanceOf(Map)
    })

    it('should add message event listener', () => {
      expect(mockAddEventListener).toHaveBeenCalledWith(
        'message',
        expect.any(Function),
        false,
      )
    })
  })

  describe('destroy', () => {
    it('should remove message event listener', () => {
      proxy.destroy()
      expect(mockRemoveEventListener).toHaveBeenCalledWith(
        'message',
        expect.any(Function),
      )
    })
  })

  describe('iframe_command', () => {
    it('should post message to iframe content window', () => {
      proxy.iframe_command('test_action', { foo: 'bar' })

      expect(mockPostMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'test_action',
          cmd_id: expect.any(Number),
          args: { foo: 'bar' },
        }),
        '*',
      )
    })

    it('should return a promise that resolves on cmd_ok', async () => {
      const promise = proxy.iframe_command('test_action', {})

      // Get the cmd_id from the posted message
      const postedMessage = mockPostMessage.mock.calls[0][0]
      const cmd_id = postedMessage.cmd_id

      // Simulate response from iframe
      const mockEvent = {
        source: mockIframeContentWindow,
        data: { action: 'cmd_ok', cmd_id, args: { result: 'success' } },
      }

      // Get the event handler that was registered
      const registeredHandler = mockAddEventListener.mock
        .calls[0][1] as Function
      registeredHandler(mockEvent)

      const result = await promise
      expect(result).toEqual({ result: 'success' })
    })

    it('should return a promise that rejects on cmd_error', async () => {
      const promise = proxy.iframe_command('test_action', {})

      // Get the cmd_id from the posted message
      const postedMessage = mockPostMessage.mock.calls[0][0]
      const cmd_id = postedMessage.cmd_id

      // Simulate error response from iframe
      const errorMessage = 'Test error'
      const errorStack = 'Error stack trace'
      const mockEvent = {
        source: mockIframeContentWindow,
        data: {
          action: 'cmd_error',
          cmd_id,
          message: errorMessage,
          stack: errorStack,
        },
      }

      const registeredHandler = mockAddEventListener.mock
        .calls[0][1] as Function
      registeredHandler(mockEvent)

      await expect(promise).rejects.toThrow(errorMessage)
    })
  })

  describe('handle_command_message', () => {
    it('should resolve pending command on cmd_ok', async () => {
      const promise = proxy.iframe_command('test_action', {})

      // Access the pending_cmds map to get the cmd_id
      const cmd_id = Array.from(proxy['pending_cmds'].keys())[0]

      proxy.handle_command_message({
        action: 'cmd_ok',
        cmd_id,
        args: { data: 'test' },
      })

      await expect(promise).resolves.toEqual({ data: 'test' })
    })

    it('should reject pending command on cmd_error', async () => {
      const promise = proxy.iframe_command('test_action', {})

      const cmd_id = Array.from(proxy['pending_cmds'].keys())[0]

      proxy.handle_command_message({
        action: 'cmd_error',
        cmd_id,
        message: 'Error occurred',
        stack: 'Error stack trace',
      })

      await expect(promise).rejects.toThrow('Error occurred')
    })

    it('should remove command from pending_cmds after handling', () => {
      proxy.iframe_command('test_action', {})
      const cmd_id = Array.from(proxy['pending_cmds'].keys())[0]

      expect(proxy['pending_cmds'].has(cmd_id)).toBe(true)

      proxy.handle_command_message({
        action: 'cmd_ok',
        cmd_id,
        args: {},
      })

      expect(proxy['pending_cmds'].has(cmd_id)).toBe(false)
    })

    it('should log error for unknown command id with non-command action', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

      proxy.handle_command_message({
        action: 'unknown_action',
        cmd_id: 999,
      })

      expect(consoleSpy).toHaveBeenCalledWith(
        'command not found',
        999,
        expect.any(Object),
        expect.any(Array),
      )

      consoleSpy.mockRestore()
    })

    it('should not log error for cmd_error with unknown id', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

      proxy.handle_command_message({
        action: 'cmd_error',
        cmd_id: 999,
        message: 'error',
      })

      expect(consoleSpy).not.toHaveBeenCalled()

      consoleSpy.mockRestore()
    })

    it('should not log error for cmd_ok with unknown id', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

      proxy.handle_command_message({
        action: 'cmd_ok',
        cmd_id: 999,
        args: {},
      })

      expect(consoleSpy).not.toHaveBeenCalled()

      consoleSpy.mockRestore()
    })
  })

  describe('handle_repl_message', () => {
    it('should ignore messages from other sources', () => {
      const mockEvent = {
        source: {} as Window,
        data: { action: 'cmd_ok', cmd_id: 1, args: {} },
      }

      proxy.handle_repl_message(mockEvent)

      // Should not process the message
      expect(handlers.on_fetch_progress).not.toHaveBeenCalled()
    })

    it('should handle cmd_ok action', async () => {
      const promise = proxy.iframe_command('test_action', {})
      const cmd_id = mockPostMessage.mock.calls[0][0].cmd_id

      proxy.handle_repl_message({
        source: mockIframeContentWindow,
        data: { action: 'cmd_ok', cmd_id, args: { result: 'ok' } },
      })

      await expect(promise).resolves.toEqual({ result: 'ok' })
    })

    it('should handle cmd_error action', async () => {
      const promise = proxy.iframe_command('test_action', {})
      const cmd_id = mockPostMessage.mock.calls[0][0].cmd_id

      proxy.handle_repl_message({
        source: mockIframeContentWindow,
        data: {
          action: 'cmd_error',
          cmd_id,
          message: 'Command failed',
          stack: 'stack trace',
        },
      })

      await expect(promise).rejects.toThrow('Command failed')
    })

    it('should call on_fetch_progress handler', () => {
      proxy.handle_repl_message({
        source: mockIframeContentWindow,
        data: { action: 'fetch_progress', args: { remaining: 5 } },
      })

      expect(handlers.on_fetch_progress).toHaveBeenCalledWith(5)
    })

    it('should call on_error handler', () => {
      const errorData = { message: 'Runtime error', line: 10 }

      proxy.handle_repl_message({
        source: mockIframeContentWindow,
        data: { action: 'error', ...errorData },
      })

      expect(handlers.on_error).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'error',
          message: 'Runtime error',
          line: 10,
        }),
      )
    })

    it('should call on_unhandled_rejection handler', () => {
      const rejectionData = { reason: 'Promise rejected' }

      proxy.handle_repl_message({
        source: mockIframeContentWindow,
        data: { action: 'unhandledrejection', ...rejectionData },
      })

      expect(handlers.on_unhandled_rejection).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'unhandledrejection',
          reason: 'Promise rejected',
        }),
      )
    })

    it('should call on_console handler', () => {
      const consoleData = { level: 'log', args: ['hello'] }

      proxy.handle_repl_message({
        source: mockIframeContentWindow,
        data: { action: 'console', ...consoleData },
      })

      expect(handlers.on_console).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'console',
          level: 'log',
          args: ['hello'],
        }),
      )
    })

    it('should call on_console_group handler', () => {
      const groupData = { label: 'My Group' }

      proxy.handle_repl_message({
        source: mockIframeContentWindow,
        data: { action: 'console_group', ...groupData },
      })

      expect(handlers.on_console_group).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'console_group', label: 'My Group' }),
      )
    })

    it('should call on_console_group_collapsed handler', () => {
      const groupData = { label: 'Collapsed Group' }

      proxy.handle_repl_message({
        source: mockIframeContentWindow,
        data: { action: 'console_group_collapsed', ...groupData },
      })

      expect(handlers.on_console_group_collapsed).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'console_group_collapsed',
          label: 'Collapsed Group',
        }),
      )
    })

    it('should call on_console_group_end handler', () => {
      proxy.handle_repl_message({
        source: mockIframeContentWindow,
        data: { action: 'console_group_end' },
      })

      expect(handlers.on_console_group_end).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'console_group_end' }),
      )
    })
  })

  describe('eval', () => {
    it('should call iframe_command with eval action and script', () => {
      const iframeCommandSpy = jest.spyOn(proxy, 'iframe_command')
      const script = 'console.log("test")'

      proxy.eval(script)

      expect(iframeCommandSpy).toHaveBeenCalledWith('eval', { script })
    })

    it('should handle array of scripts', () => {
      const iframeCommandSpy = jest.spyOn(proxy, 'iframe_command')
      const scripts = ['const a = 1', 'const b = 2']

      proxy.eval(scripts)

      expect(iframeCommandSpy).toHaveBeenCalledWith('eval', { script: scripts })
    })
  })

  describe('handle_links', () => {
    it('should call iframe_command with catch_clicks action', () => {
      const iframeCommandSpy = jest.spyOn(proxy, 'iframe_command')

      proxy.handle_links()

      expect(iframeCommandSpy).toHaveBeenCalledWith('catch_clicks', {})
    })
  })
})
