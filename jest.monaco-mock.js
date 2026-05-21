// Manual mock for monaco-editor-core
const mockModels = new Map()

module.exports = {
  Uri: {
    parse: jest.fn((uri) => ({ toString: () => uri })),
  },
  editor: {
    getModel: jest.fn((uri) => mockModels.get(uri.toString())),
    getModels: jest.fn(() => Array.from(mockModels.values())),
    createWebWorker: jest.fn(),
    registerEditorOpener: jest.fn(),
  },
  languages: {
    register: jest.fn(),
    setLanguageConfiguration: jest.fn(),
    onLanguage: jest.fn(),
  },
  // Export for test access
  __mockModels: mockModels,
}
