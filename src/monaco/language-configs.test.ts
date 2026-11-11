import { describe, it, expect, jest, beforeAll } from '@jest/globals'

// Mock monaco-editor-core before importing language-configs
jest.mock('monaco-editor-core', () => ({
  languages: {
    IndentAction: {
      None: 0,
      Indent: 1,
      IndentOutdent: 2,
      Outdent: 3,
    },
  },
}))

import { css, vue, js, ts } from './language-configs'

describe('language-configs', () => {
  describe('css', () => {
    it('should have correct comments configuration', () => {
      expect(css.comments).toEqual({
        blockComment: ['/*', '*/'],
      })
    })

    it('should have correct brackets configuration', () => {
      expect(css.brackets).toEqual([
        ['{', '}'],
        ['[', ']'],
        ['(', ')'],
      ])
    })

    it('should have correct autoClosingPairs configuration', () => {
      expect(css.autoClosingPairs).toEqual([
        { open: '{', close: '}', notIn: ['string', 'comment'] },
        { open: '[', close: ']', notIn: ['string', 'comment'] },
        { open: '(', close: ')', notIn: ['string', 'comment'] },
        { open: '"', close: '"', notIn: ['string', 'comment'] },
        { open: "'", close: "'", notIn: ['string', 'comment'] },
      ])
    })

    it('should have correct surroundingPairs configuration', () => {
      expect(css.surroundingPairs).toEqual([
        { open: "'", close: "'" },
        { open: '"', close: '"' },
        { open: '{', close: '}' },
        { open: '[', close: ']' },
        { open: '(', close: ')' },
      ])
    })

    it('should have correct folding configuration', () => {
      expect(css.folding).toEqual({
        markers: {
          start: expect.any(RegExp),
          end: expect.any(RegExp),
        },
      })
      expect(css.folding!.markers.start.source).toContain('region')
      expect(css.folding!.markers.end.source).toContain('endregion')
    })

    it('should have correct indentationRules configuration', () => {
      expect(css.indentationRules).toEqual({
        increaseIndentPattern: expect.any(RegExp),
        decreaseIndentPattern: expect.any(RegExp),
      })
    })

    it('should have correct wordPattern configuration', () => {
      expect(css.wordPattern).toBeInstanceOf(RegExp)
    })

    it('should not have lineComment configuration', () => {
      expect((css.comments as any).lineComment).toBeUndefined()
    })
  })

  describe('vue', () => {
    it('should have correct comments configuration', () => {
      expect(vue.comments).toEqual({
        blockComment: ['<!--', '-->'],
      })
    })

    it('should have correct brackets configuration', () => {
      expect(vue.brackets).toEqual([
        ['<!--', '-->'],
        ['<', '>'],
        ['{', '}'],
        ['(', ')'],
      ])
    })

    it('should have correct autoClosingPairs configuration', () => {
      expect(vue.autoClosingPairs).toEqual([
        { open: '{', close: '}' },
        { open: '[', close: ']' },
        { open: '(', close: ')' },
        { open: "'", close: "'" },
        { open: '"', close: '"' },
        { open: '<!--', close: '-->', notIn: ['comment', 'string'] },
        { open: '`', close: '`', notIn: ['string', 'comment'] },
        { open: '/**', close: ' */', notIn: ['string'] },
      ])
    })

    it('should have correct autoCloseBefore configuration', () => {
      expect(vue.autoCloseBefore).toBe(';:.,=}])><`\'" \n\t')
    })

    it('should have correct surroundingPairs configuration', () => {
      expect(vue.surroundingPairs).toEqual([
        { open: "'", close: "'" },
        { open: '"', close: '"' },
        { open: '{', close: '}' },
        { open: '[', close: ']' },
        { open: '(', close: ')' },
        { open: '<', close: '>' },
        { open: '`', close: '`' },
      ])
    })

    it('should have correct colorizedBracketPairs configuration', () => {
      expect(vue.colorizedBracketPairs).toEqual([])
    })

    it('should have correct folding configuration', () => {
      expect(vue.folding).toEqual({
        markers: {
          start: expect.any(RegExp),
          end: expect.any(RegExp),
        },
      })
    })

    it('should have correct wordPattern configuration', () => {
      expect(vue.wordPattern).toBeInstanceOf(RegExp)
    })

    it('should have correct onEnterRules configuration', () => {
      expect(vue.onEnterRules).toHaveLength(2)
      expect(vue.onEnterRules![0].action.indentAction).toBeDefined()
      expect(vue.onEnterRules![1].action.indentAction).toBeDefined()
    })

    it('should have correct indentationRules configuration', () => {
      expect(vue.indentationRules).toEqual({
        increaseIndentPattern: expect.any(RegExp),
        decreaseIndentPattern: expect.any(RegExp),
      })
    })

    it('should not have lineComment configuration', () => {
      expect((vue.comments as any).lineComment).toBeUndefined()
    })
  })

  describe('js', () => {
    it('should have correct comments configuration', () => {
      expect(js.comments).toEqual({
        lineComment: '//',
        blockComment: ['/*', '*/'],
      })
    })

    it('should have correct brackets configuration', () => {
      expect(js.brackets).toEqual([
        ['${', '}'],
        ['{', '}'],
        ['[', ']'],
        ['(', ')'],
      ])
    })

    it('should have correct autoClosingPairs configuration', () => {
      expect(js.autoClosingPairs).toEqual([
        { open: '{', close: '}' },
        { open: '[', close: ']' },
        { open: '(', close: ')' },
        { open: "'", close: "'", notIn: ['string', 'comment'] },
        { open: '"', close: '"', notIn: ['string'] },
        { open: '`', close: '`', notIn: ['string', 'comment'] },
        { open: '/**', close: ' */', notIn: ['string'] },
      ])
    })

    it('should have correct surroundingPairs configuration', () => {
      expect(js.surroundingPairs).toEqual([
        { open: "'", close: "'" },
        { open: '"', close: '"' },
        { open: '{', close: '}' },
        { open: '[', close: ']' },
        { open: '(', close: ')' },
        { open: '<', close: '>' },
        { open: '`', close: '`' },
      ])
    })

    it('should have correct autoCloseBefore configuration', () => {
      expect(js.autoCloseBefore).toBe(';:.,=}])>` \n\t')
    })

    it('should have correct folding configuration', () => {
      expect(js.folding).toEqual({
        markers: {
          start: expect.any(RegExp),
          end: expect.any(RegExp),
        },
      })
    })

    it('should have correct wordPattern configuration', () => {
      expect(js.wordPattern).toBeInstanceOf(RegExp)
    })

    it('should have correct indentationRules configuration', () => {
      expect(js.indentationRules).toEqual({
        decreaseIndentPattern: expect.any(RegExp),
        increaseIndentPattern: expect.any(RegExp),
        unIndentedLinePattern: expect.any(RegExp),
      })
    })

    it('should have correct onEnterRules configuration', () => {
      expect(js.onEnterRules).toHaveLength(7)
      expect(js.onEnterRules![0].action.indentAction).toBeDefined()
      expect(js.onEnterRules![0].action.appendText).toBe(' * ')
    })

    it('should not have colorizedBracketPairs configuration', () => {
      expect((js as any).colorizedBracketPairs).toBeUndefined()
    })
  })

  describe('ts', () => {
    it('should have correct comments configuration', () => {
      expect(ts.comments).toEqual({
        lineComment: '//',
        blockComment: ['/*', '*/'],
      })
    })

    it('should have correct brackets configuration', () => {
      expect(ts.brackets).toEqual([
        ['${', '}'],
        ['{', '}'],
        ['[', ']'],
        ['(', ')'],
      ])
    })

    it('should have correct autoClosingPairs configuration', () => {
      expect(ts.autoClosingPairs).toEqual([
        { open: '{', close: '}' },
        { open: '[', close: ']' },
        { open: '(', close: ')' },
        { open: "'", close: "'", notIn: ['string', 'comment'] },
        { open: '"', close: '"', notIn: ['string'] },
        { open: '`', close: '`', notIn: ['string', 'comment'] },
        { open: '/**', close: ' */', notIn: ['string'] },
      ])
    })

    it('should have correct surroundingPairs configuration', () => {
      expect(ts.surroundingPairs).toEqual([
        { open: "'", close: "'" },
        { open: '"', close: '"' },
        { open: '{', close: '}' },
        { open: '[', close: ']' },
        { open: '(', close: ')' },
        { open: '<', close: '>' },
        { open: '`', close: '`' },
      ])
    })

    it('should have correct colorizedBracketPairs configuration', () => {
      expect(ts.colorizedBracketPairs).toEqual([
        ['(', ')'],
        ['[', ']'],
        ['{', '}'],
        ['<', '>'],
      ])
    })

    it('should have correct autoCloseBefore configuration', () => {
      expect(ts.autoCloseBefore).toBe(';:.,=}])>` \n\t')
    })

    it('should have correct folding configuration', () => {
      expect(ts.folding).toEqual({
        markers: {
          start: expect.any(RegExp),
          end: expect.any(RegExp),
        },
      })
    })

    it('should have correct wordPattern configuration', () => {
      expect(ts.wordPattern).toBeInstanceOf(RegExp)
    })

    it('should have correct indentationRules configuration', () => {
      expect(ts.indentationRules).toEqual({
        decreaseIndentPattern: expect.any(RegExp),
        increaseIndentPattern: expect.any(RegExp),
        unIndentedLinePattern: expect.any(RegExp),
      })
    })

    it('should have correct onEnterRules configuration', () => {
      expect(ts.onEnterRules).toHaveLength(7)
      expect(ts.onEnterRules![0].action.indentAction).toBeDefined()
      expect(ts.onEnterRules![0].action.appendText).toBe(' * ')
    })

    it('should have same indentationRules as js', () => {
      expect(ts.indentationRules).toEqual(js.indentationRules)
    })

    it('should have same onEnterRules as js', () => {
      expect(ts.onEnterRules).toEqual(js.onEnterRules)
    })
  })

  describe('cross-language comparisons', () => {
    it('should have different comments for css vs vue', () => {
      expect(css.comments).not.toEqual(vue.comments)
    })

    it('should have same comments for js and ts', () => {
      expect(js.comments).toEqual(ts.comments)
    })

    it('should have same brackets for js and ts', () => {
      expect(js.brackets).toEqual(ts.brackets)
    })

    it('should have same autoClosingPairs for js and ts', () => {
      expect(js.autoClosingPairs).toEqual(ts.autoClosingPairs)
    })

    it('should have same surroundingPairs for js and ts', () => {
      expect(js.surroundingPairs).toEqual(ts.surroundingPairs)
    })

    it('should have same folding for js and ts', () => {
      expect(js.folding).toEqual(ts.folding)
    })

    it('should have same wordPattern for js and ts', () => {
      expect(js.wordPattern.toString()).toBe(ts.wordPattern.toString())
    })

    it('should have different brackets for css vs js', () => {
      expect(css.brackets).not.toEqual(js.brackets)
    })
  })

  describe('configuration structure', () => {
    it('css should have all required properties', () => {
      expect(css).toHaveProperty('comments')
      expect(css).toHaveProperty('brackets')
      expect(css).toHaveProperty('autoClosingPairs')
      expect(css).toHaveProperty('surroundingPairs')
      expect(css).toHaveProperty('folding')
      expect(css).toHaveProperty('indentationRules')
      expect(css).toHaveProperty('wordPattern')
    })

    it('vue should have all required properties', () => {
      expect(vue).toHaveProperty('comments')
      expect(vue).toHaveProperty('brackets')
      expect(vue).toHaveProperty('autoClosingPairs')
      expect(vue).toHaveProperty('surroundingPairs')
      expect(vue).toHaveProperty('colorizedBracketPairs')
      expect(vue).toHaveProperty('autoCloseBefore')
      expect(vue).toHaveProperty('folding')
      expect(vue).toHaveProperty('wordPattern')
      expect(vue).toHaveProperty('onEnterRules')
      expect(vue).toHaveProperty('indentationRules')
    })

    it('js should have all required properties', () => {
      expect(js).toHaveProperty('comments')
      expect(js).toHaveProperty('brackets')
      expect(js).toHaveProperty('autoClosingPairs')
      expect(js).toHaveProperty('surroundingPairs')
      expect(js).toHaveProperty('autoCloseBefore')
      expect(js).toHaveProperty('folding')
      expect(js).toHaveProperty('wordPattern')
      expect(js).toHaveProperty('indentationRules')
      expect(js).toHaveProperty('onEnterRules')
    })

    it('ts should have all required properties', () => {
      expect(ts).toHaveProperty('comments')
      expect(ts).toHaveProperty('brackets')
      expect(ts).toHaveProperty('autoClosingPairs')
      expect(ts).toHaveProperty('surroundingPairs')
      expect(ts).toHaveProperty('colorizedBracketPairs')
      expect(ts).toHaveProperty('autoCloseBefore')
      expect(ts).toHaveProperty('folding')
      expect(ts).toHaveProperty('wordPattern')
      expect(ts).toHaveProperty('indentationRules')
      expect(ts).toHaveProperty('onEnterRules')
    })
  })
})
