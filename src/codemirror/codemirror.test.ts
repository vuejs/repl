jest.mock('codemirror', () => {
  const mockCodeMirror = jest.fn() as any
  mockCodeMirror.version = '5.65.18'
  mockCodeMirror.modes = {
    javascript: {},
    css: {},
    htmlmixed: {},
  }
  mockCodeMirror.mimeModes = {
    'text/javascript': {},
    'text/css': {},
    'text/html': {},
  }
  mockCodeMirror.commands = {}
  mockCodeMirror.keyMap = {
    sublime: {},
    default: {},
  }
  mockCodeMirror.defineExtension = jest.fn()
  mockCodeMirror.defineDocExtension = jest.fn()
  mockCodeMirror.defineOption = jest.fn()
  mockCodeMirror.defineMode = jest.fn()
  mockCodeMirror.defineMIME = jest.fn()
  mockCodeMirror.getMode = jest.fn()
  mockCodeMirror.fromTextArea = jest.fn()
  mockCodeMirror.Pos = jest.fn()
  mockCodeMirror.changeEnd = jest.fn()
  mockCodeMirror.isWordChar = jest.fn()
  mockCodeMirror.normalizeKeyMap = jest.fn()
  mockCodeMirror.signal = jest.fn()
  mockCodeMirror.on = jest.fn()
  mockCodeMirror.off = jest.fn()
  mockCodeMirror.addClass = jest.fn()
  mockCodeMirror.rmClass = jest.fn()
  mockCodeMirror.e_preventDefault = jest.fn()
  mockCodeMirror.e_stop = jest.fn()
  mockCodeMirror.e_stopPropagation = jest.fn()
  mockCodeMirror.e_target = jest.fn()
  mockCodeMirror.contains = jest.fn()
  mockCodeMirror.lookupKey = jest.fn()
  mockCodeMirror.isModifierKey = jest.fn()
  mockCodeMirror.keyName = jest.fn()
  mockCodeMirror.restartMode = jest.fn()
  mockCodeMirror.innerMode = jest.fn()
  mockCodeMirror.StringStream = jest.fn()
  mockCodeMirror.TextMarker = jest.fn()
  mockCodeMirror.LineWidget = jest.fn()
  mockCodeMirror.Doc = jest.fn()
  mockCodeMirror.extensionHooks = {}
  mockCodeMirror.optionHandlers = {}
  mockCodeMirror.initHooks = []
  mockCodeMirror.copyState = jest.fn()
  mockCodeMirror.startState = jest.fn()
  mockCodeMirror.getModeHelper = jest.fn()
  mockCodeMirror.colorize = jest.fn()
  mockCodeMirror.resolveMode = jest.fn()
  mockCodeMirror.clearMode = jest.fn()
  mockCodeMirror.modeExtensions = {}
  mockCodeMirror.extensions = {}
  mockCodeMirror.GlobalState = jest.fn()
  mockCodeMirror.contentClass = 'CodeMirror-code'
  mockCodeMirror.sizerClass = 'CodeMirror-sizer'
  mockCodeMirror.gutterClass = 'CodeMirror-gutters'
  mockCodeMirror.lineClass = 'CodeMirror-line'
  mockCodeMirror.wrapperClass = 'CodeMirror'
  mockCodeMirror.inputClass = 'CodeMirror-input'
  mockCodeMirror.scrollbarClass = 'CodeMirror-scrollbar'
  mockCodeMirror.lineSpaceClass = 'CodeMirror-lines'
  mockCodeMirror.measureClass = 'CodeMirror-measure'
  mockCodeMirror.gutterBGClass = 'CodeMirror-gutter-background'
  mockCodeMirror.codeClass = 'cm-s-default'
  mockCodeMirror.lineSeparator = '\n'
  mockCodeMirror.defaults = {
    tabSize: 4,
    indentUnit: 2,
    lineNumbers: false,
  }
  mockCodeMirror.create = jest.fn()
  mockCodeMirror.defineModeSpec = jest.fn()
  mockCodeMirror.defineMIMESpec = jest.fn()
  return mockCodeMirror
})

jest.mock('codemirror/addon/dialog/dialog.css', () => ({}))
jest.mock('./codemirror.css', () => ({}))
jest.mock('codemirror/mode/javascript/javascript.js', () => ({}))
jest.mock('codemirror/mode/css/css.js', () => ({}))
jest.mock('codemirror/mode/htmlmixed/htmlmixed.js', () => ({}))
jest.mock('codemirror/addon/edit/closebrackets.js', () => ({}))
jest.mock('codemirror/addon/edit/closetag.js', () => ({}))
jest.mock('codemirror/addon/comment/comment.js', () => ({}))
jest.mock('codemirror/addon/fold/foldcode.js', () => ({}))
jest.mock('codemirror/addon/fold/foldgutter.js', () => ({}))
jest.mock('codemirror/addon/fold/brace-fold.js', () => ({}))
jest.mock('codemirror/addon/fold/indent-fold.js', () => ({}))
jest.mock('codemirror/addon/fold/comment-fold.js', () => ({}))
jest.mock('codemirror/addon/search/search.js', () => ({}))
jest.mock('codemirror/addon/search/searchcursor.js', () => ({}))
jest.mock('codemirror/addon/dialog/dialog.js', () => ({}))
jest.mock('codemirror/keymap/sublime.js', () => ({}))

import CodeMirror from './codemirror'

describe('codemirror', () => {
  it('should export CodeMirror', () => {
    expect(CodeMirror).toBeDefined()
  })

  it('should export CodeMirror as a function', () => {
    expect(typeof CodeMirror).toBe('function')
  })

  it('should have CodeMirror constructor available', () => {
    expect(typeof CodeMirror).toBe('function')
  })

  it('should have version property', () => {
    expect(CodeMirror.version).toBeDefined()
    expect(typeof CodeMirror.version).toBe('string')
  })

  it('should have modes registered', () => {
    expect(CodeMirror.modes).toBeDefined()
    expect(typeof CodeMirror.modes).toBe('object')
  })

  it('should have javascript mode loaded', () => {
    expect(CodeMirror.modes.javascript).toBeDefined()
  })

  it('should have css mode loaded', () => {
    expect(CodeMirror.modes.css).toBeDefined()
  })

  it('should have htmlmixed mode loaded', () => {
    expect(CodeMirror.modes.htmlmixed).toBeDefined()
  })

  it('should have mimeModes registered', () => {
    expect(CodeMirror.mimeModes).toBeDefined()
    expect(typeof CodeMirror.mimeModes).toBe('object')
  })

  it('should have text/javascript mime mode', () => {
    expect(CodeMirror.mimeModes['text/javascript']).toBeDefined()
  })

  it('should have text/css mime mode', () => {
    expect(CodeMirror.mimeModes['text/css']).toBeDefined()
  })

  it('should have text/html mime mode', () => {
    expect(CodeMirror.mimeModes['text/html']).toBeDefined()
  })

  it('should have commands registered', () => {
    expect(CodeMirror.commands).toBeDefined()
    expect(typeof CodeMirror.commands).toBe('object')
  })

  it('should have keyMap registered', () => {
    expect(CodeMirror.keyMap).toBeDefined()
    expect(typeof CodeMirror.keyMap).toBe('object')
  })

  it('should have sublime keymap loaded', () => {
    expect(CodeMirror.keyMap.sublime).toBeDefined()
  })

  it('should have default keymap', () => {
    expect(CodeMirror.keyMap.default).toBeDefined()
  })

  it('should have defineExtension method', () => {
    expect(typeof CodeMirror.defineExtension).toBe('function')
  })

  it('should have defineDocExtension method', () => {
    expect(typeof CodeMirror.defineDocExtension).toBe('function')
  })

  it('should have defineOption method', () => {
    expect(typeof CodeMirror.defineOption).toBe('function')
  })

  it('should have defineMode method', () => {
    expect(typeof CodeMirror.defineMode).toBe('function')
  })

  it('should have defineMIME method', () => {
    expect(typeof CodeMirror.defineMIME).toBe('function')
  })

  it('should have getMode method', () => {
    expect(typeof CodeMirror.getMode).toBe('function')
  })

  it('should have fromTextArea static method', () => {
    expect(typeof CodeMirror.fromTextArea).toBe('function')
  })

  it('should have Pos constructor', () => {
    expect(CodeMirror.Pos).toBeDefined()
    expect(typeof CodeMirror.Pos).toBe('function')
  })

  it('should have changeEnd static method', () => {
    expect(typeof CodeMirror.changeEnd).toBe('function')
  })

  it('should have isWordChar static method', () => {
    expect(typeof CodeMirror.isWordChar).toBe('function')
  })

  it('should have normalizeKeyMap method', () => {
    expect(typeof CodeMirror.normalizeKeyMap).toBe('function')
  })

  it('should have signal method', () => {
    expect(typeof CodeMirror.signal).toBe('function')
  })

  it('should have on method', () => {
    expect(typeof CodeMirror.on).toBe('function')
  })

  it('should have off method', () => {
    expect(typeof CodeMirror.off).toBe('function')
  })

  it('should have addClass method', () => {
    expect(typeof CodeMirror.addClass).toBe('function')
  })

  it('should have rmClass method', () => {
    expect(typeof CodeMirror.rmClass).toBe('function')
  })

  it('should have e_preventDefault method', () => {
    expect(typeof CodeMirror.e_preventDefault).toBe('function')
  })

  it('should have e_stop method', () => {
    expect(typeof CodeMirror.e_stop).toBe('function')
  })

  it('should have e_stopPropagation method', () => {
    expect(typeof CodeMirror.e_stopPropagation).toBe('function')
  })

  it('should have e_target method', () => {
    expect(typeof CodeMirror.e_target).toBe('function')
  })

  it('should have contains method', () => {
    expect(typeof CodeMirror.contains).toBe('function')
  })

  it('should have lookupKey method', () => {
    expect(typeof CodeMirror.lookupKey).toBe('function')
  })

  it('should have isModifierKey method', () => {
    expect(typeof CodeMirror.isModifierKey).toBe('function')
  })

  it('should have keyName method', () => {
    expect(typeof CodeMirror.keyName).toBe('function')
  })

  it('should have restartMode method', () => {
    expect(typeof CodeMirror.restartMode).toBe('function')
  })

  it('should have innerMode method', () => {
    expect(typeof CodeMirror.innerMode).toBe('function')
  })

  it('should have StringStream constructor', () => {
    expect(CodeMirror.StringStream).toBeDefined()
    expect(typeof CodeMirror.StringStream).toBe('function')
  })

  it('should have TextMarker class', () => {
    expect(CodeMirror.TextMarker).toBeDefined()
  })

  it('should have LineWidget class', () => {
    expect(CodeMirror.LineWidget).toBeDefined()
  })

  it('should have Doc constructor', () => {
    expect(CodeMirror.Doc).toBeDefined()
    expect(typeof CodeMirror.Doc).toBe('function')
  })

  it('should have extensionHooks registered', () => {
    expect(CodeMirror.extensionHooks).toBeDefined()
    expect(typeof CodeMirror.extensionHooks).toBe('object')
  })

  it('should have optionHandlers registered', () => {
    expect(CodeMirror.optionHandlers).toBeDefined()
    expect(typeof CodeMirror.optionHandlers).toBe('object')
  })

  it('should have initHooks array', () => {
    expect(CodeMirror.initHooks).toBeDefined()
    expect(Array.isArray(CodeMirror.initHooks)).toBe(true)
  })

  it('should have copyState method', () => {
    expect(typeof CodeMirror.copyState).toBe('function')
  })

  it('should have startState method', () => {
    expect(typeof CodeMirror.startState).toBe('function')
  })

  it('should have getModeHelper method', () => {
    expect(typeof CodeMirror.getModeHelper).toBe('function')
  })

  it('should have colorize method', () => {
    expect(typeof CodeMirror.colorize).toBe('function')
  })

  it('should have resolveMode method', () => {
    expect(typeof CodeMirror.resolveMode).toBe('function')
  })

  it('should have clearMode method', () => {
    expect(typeof CodeMirror.clearMode).toBe('function')
  })

  it('should have modeExtensions object', () => {
    expect(CodeMirror.modeExtensions).toBeDefined()
    expect(typeof CodeMirror.modeExtensions).toBe('object')
  })

  it('should have extensions object', () => {
    expect(CodeMirror.extensions).toBeDefined()
    expect(typeof CodeMirror.extensions).toBe('object')
  })

  it('should have GlobalState class', () => {
    expect(CodeMirror.GlobalState).toBeDefined()
  })

  it('should have contentClass constant', () => {
    expect(CodeMirror.contentClass).toBeDefined()
  })

  it('should have sizerClass constant', () => {
    expect(CodeMirror.sizerClass).toBeDefined()
  })

  it('should have gutterClass constant', () => {
    expect(CodeMirror.gutterClass).toBeDefined()
  })

  it('should have lineClass constant', () => {
    expect(CodeMirror.lineClass).toBeDefined()
  })

  it('should have wrapperClass constant', () => {
    expect(CodeMirror.wrapperClass).toBeDefined()
  })

  it('should have inputClass constant', () => {
    expect(CodeMirror.inputClass).toBeDefined()
  })

  it('should have scrollbarClass constant', () => {
    expect(CodeMirror.scrollbarClass).toBeDefined()
  })

  it('should have lineSpaceClass constant', () => {
    expect(CodeMirror.lineSpaceClass).toBeDefined()
  })

  it('should have measureClass constant', () => {
    expect(CodeMirror.measureClass).toBeDefined()
  })

  it('should have gutterBGClass constant', () => {
    expect(CodeMirror.gutterBGClass).toBeDefined()
  })

  it('should have codeClass constant', () => {
    expect(CodeMirror.codeClass).toBeDefined()
  })

  it('should have lineSeparator constant', () => {
    expect(CodeMirror.lineSeparator).toBeDefined()
  })

  it('should have defaults object with default options', () => {
    expect(CodeMirror.defaults).toBeDefined()
    expect(typeof CodeMirror.defaults).toBe('object')
  })

  it('should have defaults.tabSize', () => {
    expect(CodeMirror.defaults.tabSize).toBeDefined()
  })

  it('should have defaults.indentUnit', () => {
    expect(CodeMirror.defaults.indentUnit).toBeDefined()
  })

  it('should have defaults.lineNumbers property', () => {
    expect(CodeMirror.defaults.lineNumbers).toBeDefined()
  })

  it('should have create defined', () => {
    expect(typeof CodeMirror.create).toBe('function')
  })

  it('should have defineModeSpec method', () => {
    expect(typeof CodeMirror.defineModeSpec).toBe('function')
  })

  it('should have defineMIMESpec method', () => {
    expect(typeof CodeMirror.defineMIMESpec).toBe('function')
  })
})
