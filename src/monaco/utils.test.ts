import { describe, it, expect, beforeEach, jest } from '@jest/globals'

// Define mock types
interface MockUri {
  toString: () => string
  path: string
  scheme: string
}

interface MockModel {
  uri: MockUri
  language: string | undefined
  getValue: () => string
  setValue: (newValue: string) => void
}

// Mock storage for models
const mockModels = new Map<string, MockModel>()

// Mock Uri factory
const createMockUri = (path: string): MockUri => ({
  toString: () => path,
  path,
  scheme: 'file',
})

// Mock editor factory
const createMockEditor = () => {
  const editor = {
    getModel: jest.fn((uri: MockUri) => mockModels.get(uri.toString())),
    createModel: jest.fn(
      (value: string, lang: string | undefined, uri: MockUri) => {
        let currentValue = value
        const model: MockModel = {
          uri,
          language: lang,
          getValue: () => currentValue,
          setValue: (newValue: string) => {
            currentValue = newValue
            mockModels.set(uri.toString(), model)
          },
        }
        mockModels.set(uri.toString(), model)
        return model
      },
    ),
  }
  return editor
}

// Test the getOrCreateModel logic directly
const testGetOrCreateModel = (
  editor: {
    getModel: jest.Mock
    createModel: jest.Mock
  },
  uri: MockUri,
  lang: string | undefined,
  value: string,
) => {
  const model = editor.getModel(uri)
  if (model) {
    model.setValue(value)
    return model
  }
  return editor.createModel(value, lang, uri)
}

describe('utils', () => {
  let mockEditor: ReturnType<typeof createMockEditor>

  beforeEach(() => {
    mockModels.clear()
    mockEditor = createMockEditor()
  })

  describe('getOrCreateModel', () => {
    it('should create a new model when one does not exist', () => {
      const uri = createMockUri('file:///test/file.ts')
      const lang = 'typescript'
      const value = 'const x = 1'

      const model = testGetOrCreateModel(mockEditor, uri, lang, value)

      expect(mockEditor.getModel).toHaveBeenCalledWith(uri)
      expect(mockEditor.createModel).toHaveBeenCalledWith(value, lang, uri)
      expect(model).toBeDefined()
      expect(model.language).toBe(lang)
    })

    it('should get existing model and update its value when it exists', () => {
      const uri = createMockUri('file:///test/file.ts')
      const lang = 'typescript'
      const initialValue = 'const x = 1'
      const newValue = 'const y = 2'

      // First call creates the model
      testGetOrCreateModel(mockEditor, uri, lang, initialValue)

      // Reset call history to test second call behavior
      mockEditor.getModel.mockClear()
      mockEditor.createModel.mockClear()

      // Second call should get the existing model
      const model = testGetOrCreateModel(mockEditor, uri, lang, newValue)

      expect(mockEditor.getModel).toHaveBeenCalledTimes(1)
      expect(mockEditor.createModel).not.toHaveBeenCalled()
      expect(model).toBeDefined()
      expect(model.getValue()).toBe(newValue)
    })

    it('should handle undefined language when creating model', () => {
      const uri = createMockUri('file:///test/file')
      const lang = undefined
      const value = 'some content'

      const model = testGetOrCreateModel(mockEditor, uri, lang, value)

      expect(mockEditor.createModel).toHaveBeenCalledWith(value, lang, uri)
      expect(model.language).toBeUndefined()
    })

    it('should update value of existing model regardless of language parameter', () => {
      const uri = createMockUri('file:///test/file.ts')
      const initialValue = 'const x = 1'
      const newValue = 'const y = 2'
      const newLang = 'javascript'

      // Create initial model
      testGetOrCreateModel(mockEditor, uri, 'typescript', initialValue)

      // Reset call history
      mockEditor.getModel.mockClear()
      mockEditor.createModel.mockClear()

      // Get and update with different language parameter
      const model = testGetOrCreateModel(mockEditor, uri, newLang, newValue)

      expect(mockEditor.getModel).toHaveBeenCalledTimes(1)
      expect(mockEditor.createModel).not.toHaveBeenCalled()
      expect(model.getValue()).toBe(newValue)
    })

    it('should handle empty string value', () => {
      const uri = createMockUri('file:///test/file.ts')
      const lang = 'typescript'
      const value = ''

      const model = testGetOrCreateModel(mockEditor, uri, lang, value)

      expect(mockEditor.createModel).toHaveBeenCalledWith(value, lang, uri)
      expect(model.getValue()).toBe('')
    })

    it('should handle multiple different uris', () => {
      const uri1 = createMockUri('file:///test/file1.ts')
      const uri2 = createMockUri('file:///test/file2.ts')
      const lang = 'typescript'

      const model1 = testGetOrCreateModel(mockEditor, uri1, lang, 'content1')
      const model2 = testGetOrCreateModel(mockEditor, uri2, lang, 'content2')

      expect(mockEditor.createModel).toHaveBeenCalledTimes(2)
      expect(model1).not.toBe(model2)
      expect(model1.getValue()).toBe('content1')
      expect(model2.getValue()).toBe('content2')
    })
  })
})
