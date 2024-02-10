import { languages } from 'monaco-editor-core'

// export const html: languages.LanguageConfiguration = {
//   comments: {
//     blockComment: ['<!--', '-->'],
//   },
//   brackets: [
//     ['<!--', '-->'],
//     ['{', '}'],
//     ['(', ')'],
//   ],
//   autoClosingPairs: [
//     { open: '{', close: '}' },
//     { open: '[', close: ']' },
//     { open: '(', close: ')' },
//     { open: "'", close: "'" },
//     { open: '"', close: '"' },
//     { open: '<!--', close: '-->', notIn: ['comment', 'string'] },
//   ],
//   surroundingPairs: [
//     { open: "'", close: "'" },
//     { open: '"', close: '"' },
//     { open: '{', close: '}' },
//     { open: '[', close: ']' },
//     { open: '(', close: ')' },
//     { open: '<', close: '>' },
//   ],
//   colorizedBracketPairs: [],
//   folding: {
//     markers: {
//       start: /^\s*<!--\s*#region\b.*-->/,
//       end: /^\s*<!--\s*#endregion\b.*-->/,
//     },
//   },
//   wordPattern: new RegExp(
//     '(-?\\d*\\.\\d\\w*)|([^\\`\\~\\!\\@\\$\\^\\&\\*\\(\\)\\=\\+\\[\\{\\]\\}\\\\\\|\\;\\:\\\'\\"\\,\\.\\<\\>\\/\\s]+)',
//   ),
//   onEnterRules: [
//     {
//       beforeText: new RegExp(
//         '<(?!(?:area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr))([_:\\w][_:\\w-.\\d]*)(?:(?:[^\'"/>]|"[^"]*"|\'[^\']*\')*?(?!\\/)>)[^<]*$',
//         'i',
//       ),
//       afterText: new RegExp('^<\\/([_:\\w][_:\\w-.\\d]*)\\s*>', 'i'),
//       action: {
//         indentAction: languages.IndentAction.IndentOutdent,
//       },
//     },
//     {
//       beforeText: new RegExp(
//         '<(?!(?:area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr))([_:\\w][_:\\w-.\\d]*)(?:(?:[^\'"/>]|"[^"]*"|\'[^\']*\')*?(?!\\/)>)[^<]*$',
//         'i',
//       ),
//       action: {
//         indentAction: languages.IndentAction.Indent,
//       },
//     },
//   ],
//   indentationRules: {
//     increaseIndentPattern: new RegExp(
//       '<(?!\\?|(?:area|base|br|col|frame|hr|html|img|input|keygen|link|menuitem|meta|param|source|track|wbr)\\b|[^>]*\\/>)([-_\\.A-Za-z0-9]+)(?=\\s|>)\\b[^>]*>(?!.*<\\/\\1>)|<!--(?!.*-->)|\\{[^}"\']*$',
//     ),
//     decreaseIndentPattern: new RegExp(
//       '^\\s*(<\\/(?!html)[-_\\.A-Za-z0-9]+\\b[^>]*>|-->|\\})',
//     ),
//   },
// }

export const css: languages.LanguageConfiguration = {
  comments: {
    blockComment: ['/*', '*/'],
  },
  brackets: [
    ['{', '}'],
    ['[', ']'],
    ['(', ')'],
  ],
  autoClosingPairs: [
    { open: '{', close: '}', notIn: ['string', 'comment'] },
    { open: '[', close: ']', notIn: ['string', 'comment'] },
    { open: '(', close: ')', notIn: ['string', 'comment'] },
    { open: '"', close: '"', notIn: ['string', 'comment'] },
    { open: "'", close: "'", notIn: ['string', 'comment'] },
  ],
  surroundingPairs: [
    {
      open: "'",
      close: "'",
    },
    {
      open: '"',
      close: '"',
    },
    {
      open: '{',
      close: '}',
    },
    {
      open: '[',
      close: ']',
    },
    {
      open: '(',
      close: ')',
    },
  ],
  folding: {
    markers: {
      start: new RegExp('^\\s*\\/\\*\\s*#region\\b\\s*(.*?)\\s*\\*\\/'),
      end: new RegExp('^\\s*\\/\\*\\s*#endregion\\b.*\\*\\/'),
    },
  },
  indentationRules: {
    increaseIndentPattern: new RegExp('(^.*\\{[^}]*$)'),
    decreaseIndentPattern: new RegExp('^\\s*\\}'),
  },
  wordPattern: new RegExp(
    '(#?-?\\d*\\.\\d\\w*%?)|(::?[\\w-]*(?=[^,{;]*[,{]))|(([@#.!])?[\\w-?]+%?|[@#!.])',
  ),
}

export const vue: languages.LanguageConfiguration = {
  comments: {
    blockComment: ['<!--', '-->'],
  },
  brackets: [
    ['<!--', '-->'],
    ['<', '>'],
    ['{', '}'],
    ['(', ')'],
  ],
  autoClosingPairs: [
    {
      open: '{',
      close: '}',
    },
    {
      open: '[',
      close: ']',
    },
    {
      open: '(',
      close: ')',
    },
    {
      open: "'",
      close: "'",
    },
    {
      open: '"',
      close: '"',
    },
    {
      open: '<!--',
      close: '-->',
      notIn: ['comment', 'string'],
    },
    {
      open: '`',
      close: '`',
      notIn: ['string', 'comment'],
    },
    {
      open: '/**',
      close: ' */',
      notIn: ['string'],
    },
  ],
  autoCloseBefore: ';:.,=}])><`\'" \n\t',
  surroundingPairs: [
    {
      open: "'",
      close: "'",
    },
    {
      open: '"',
      close: '"',
    },
    {
      open: '{',
      close: '}',
    },
    {
      open: '[',
      close: ']',
    },
    {
      open: '(',
      close: ')',
    },
    {
      open: '<',
      close: '>',
    },
    {
      open: '`',
      close: '`',
    },
  ],
  colorizedBracketPairs: [],
  folding: {
    markers: {
      start: /^\s*<!--\s*#region\b.*-->/,
      end: /^\s*<!--\s*#endregion\b.*-->/,
    },
  },
  wordPattern:
    /(-?\d*\.\d\w*)|([^\`\@\~\!\%\^\&\*\(\)\-\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>/\?\s]+)/,
  onEnterRules: [
    {
      beforeText:
        /<(?!(?:area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr|script|style))([_:\w][_:\w-.\d]*)(?:(?:[^'"/>]|"[^"]*"|'[^']*')*?(?!\/)>)[^<]*$/i,
      afterText: /^<\/([_:\w][_:\w-.\d]*)\s*>/i,
      action: {
        indentAction: languages.IndentAction.IndentOutdent,
      },
    },
    {
      beforeText:
        /<(?!(?:area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr|script|style))([_:\w][_:\w-.\d]*)(?:(?:[^'"/>]|"[^"]*"|'[^']*')*?(?!\/)>)[^<]*$/i,
      action: {
        indentAction: languages.IndentAction.Indent,
      },
    },
  ],
  indentationRules: {
    increaseIndentPattern:
      /<(?!\?|(?:area|base|br|col|frame|hr|html|img|input|keygen|link|menuitem|meta|param|source|track|wbr|script|style)\b|[^>]*\/>)([-_\.A-Za-z0-9]+)(?=\s|>)\b[^>]*>(?!\s*\()(?!.*<\/\1>)|<!--(?!.*-->)|\{[^}"']*$/i,
    decreaseIndentPattern: /^\s*(<\/(?!html)[-_\.A-Za-z0-9]+\b[^>]*>|-->|\})/,
  },
}

export const js: languages.LanguageConfiguration = {
  comments: {
    lineComment: '//',
    blockComment: ['/*', '*/'],
  },
  brackets: [
    ['${', '}'],
    ['{', '}'],
    ['[', ']'],
    ['(', ')'],
  ],
  autoClosingPairs: [
    {
      open: '{',
      close: '}',
    },
    {
      open: '[',
      close: ']',
    },
    {
      open: '(',
      close: ')',
    },
    {
      open: "'",
      close: "'",
      notIn: ['string', 'comment'],
    },
    {
      open: '"',
      close: '"',
      notIn: ['string'],
    },
    {
      open: '`',
      close: '`',
      notIn: ['string', 'comment'],
    },
    {
      open: '/**',
      close: ' */',
      notIn: ['string'],
    },
  ],
  surroundingPairs: [
    {
      open: "'",
      close: "'",
    },
    {
      open: '"',
      close: '"',
    },
    {
      open: '{',
      close: '}',
    },
    {
      open: '[',
      close: ']',
    },
    {
      open: '(',
      close: ')',
    },
    {
      open: '<',
      close: '>',
    },
    {
      open: '`',
      close: '`',
    },
  ],
  autoCloseBefore: ';:.,=}])>` \n\t',
  folding: {
    markers: {
      start: /^\s*\/\/\s*#?region\b/,
      end: /^\s*\/\/\s*#?endregion\b/,
    },
  },
  wordPattern:
    /(-?\d*\.\d\w*)|([^\`\~\@\!\%\^\&\*\(\)\-\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>/\?\s]+)/,
  indentationRules: {
    decreaseIndentPattern: /^((?!.*?\/\*).*\*\/)?\s*[\}\]].*$/,
    increaseIndentPattern:
      /^((?!\/\/).)*(\{([^}"'`/]*|(\t|[ ])*\/\/.*)|\([^)"'`/]*|\[[^\]"'`/]*)$/,
    unIndentedLinePattern:
      /^(\t|[ ])*[ ]\*[^/]*\*\/\s*$|^(\t|[ ])*[ ]\*\/\s*$|^(\t|[ ])*[ ]\*([ ]([^\*]|\*(?!\/))*)?$/,
  },
  onEnterRules: [
    {
      beforeText: /^\s*\/\*\*(?!\/)([^\*]|\*(?!\/))*$/,
      afterText: /^\s*\*\/$/,
      action: {
        indentAction: languages.IndentAction.IndentOutdent,
        appendText: ' * ',
      },
    },
    {
      beforeText: /^\s*\/\*\*(?!\/)([^\*]|\*(?!\/))*$/,
      action: {
        indentAction: languages.IndentAction.None,
        appendText: ' * ',
      },
    },
    {
      beforeText: /^(\t|[ ])*[ ]\*([ ]([^\*]|\*(?!\/))*)?$/,
      previousLineText: /(?=^(\s*(\/\*\*|\*)).*)(?=(?!(\s*\*\/)))/,
      action: {
        indentAction: languages.IndentAction.None,
        appendText: '* ',
      },
    },
    {
      beforeText: /^(\t|[ ])*[ ]\*\/\s*$/,
      action: {
        indentAction: languages.IndentAction.None,
        removeText: 1,
      },
    },
    {
      beforeText: /^(\t|[ ])*[ ]\*[^/]*\*\/\s*$/,
      action: {
        indentAction: languages.IndentAction.None,
        removeText: 1,
      },
    },
    {
      beforeText: /^\s*(\bcase\s.+:|\bdefault:)$/,
      afterText: /^(?!\s*(\bcase\b|\bdefault\b))/,
      action: {
        indentAction: languages.IndentAction.Indent,
      },
    },
    {
      previousLineText: /^\s*(((else ?)?if|for|while)\s*\(.*\)\s*|else\s*)$/,
      beforeText: /^\s+([^{i\s]|i(?!f\b))/,
      action: {
        indentAction: languages.IndentAction.Outdent,
      },
    },
  ],
}

export const ts: languages.LanguageConfiguration = {
  comments: {
    lineComment: '//',
    blockComment: ['/*', '*/'],
  },
  brackets: [
    ['${', '}'],
    ['{', '}'],
    ['[', ']'],
    ['(', ')'],
  ],
  autoClosingPairs: [
    {
      open: '{',
      close: '}',
    },
    {
      open: '[',
      close: ']',
    },
    {
      open: '(',
      close: ')',
    },
    {
      open: "'",
      close: "'",
      notIn: ['string', 'comment'],
    },
    {
      open: '"',
      close: '"',
      notIn: ['string'],
    },
    {
      open: '`',
      close: '`',
      notIn: ['string', 'comment'],
    },
    {
      open: '/**',
      close: ' */',
      notIn: ['string'],
    },
  ],
  surroundingPairs: [
    {
      open: "'",
      close: "'",
    },
    {
      open: '"',
      close: '"',
    },
    {
      open: '{',
      close: '}',
    },
    {
      open: '[',
      close: ']',
    },
    {
      open: '(',
      close: ')',
    },
    {
      open: '<',
      close: '>',
    },
    {
      open: '`',
      close: '`',
    },
  ],
  colorizedBracketPairs: [
    ['(', ')'],
    ['[', ']'],
    ['{', '}'],
    ['<', '>'],
  ],
  autoCloseBefore: ';:.,=}])>` \n\t',
  folding: {
    markers: {
      start: /^\s*\/\/\s*#?region\b/,
      end: /^\s*\/\/\s*#?endregion\b/,
    },
  },
  wordPattern:
    /(-?\d*\.\d\w*)|([^\`\~\@\!\%\^\&\*\(\)\-\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>/\?\s]+)/,
  indentationRules: {
    decreaseIndentPattern: /^((?!.*?\/\*).*\*\/)?\s*[\}\]].*$/,
    increaseIndentPattern:
      /^((?!\/\/).)*(\{([^}"'`/]*|(\t|[ ])*\/\/.*)|\([^)"'`/]*|\[[^\]"'`/]*)$/,
    unIndentedLinePattern:
      /^(\t|[ ])*[ ]\*[^/]*\*\/\s*$|^(\t|[ ])*[ ]\*\/\s*$|^(\t|[ ])*[ ]\*([ ]([^\*]|\*(?!\/))*)?$/,
  },
  onEnterRules: [
    {
      beforeText: /^\s*\/\*\*(?!\/)([^\*]|\*(?!\/))*$/,
      afterText: /^\s*\*\/$/,
      action: {
        indentAction: languages.IndentAction.IndentOutdent,
        appendText: ' * ',
      },
    },
    {
      beforeText: /^\s*\/\*\*(?!\/)([^\*]|\*(?!\/))*$/,
      action: {
        indentAction: languages.IndentAction.None,
        appendText: ' * ',
      },
    },
    {
      beforeText: /^(\t|[ ])*[ ]\*([ ]([^\*]|\*(?!\/))*)?$/,
      previousLineText: /(?=^(\s*(\/\*\*|\*)).*)(?=(?!(\s*\*\/)))/,
      action: {
        indentAction: languages.IndentAction.None,
        appendText: '* ',
      },
    },
    {
      beforeText: /^(\t|[ ])*[ ]\*\/\s*$/,
      action: {
        indentAction: languages.IndentAction.None,
        removeText: 1,
      },
    },
    {
      beforeText: /^(\t|[ ])*[ ]\*[^/]*\*\/\s*$/,
      action: {
        indentAction: languages.IndentAction.None,
        removeText: 1,
      },
    },
    {
      beforeText: /^\s*(\bcase\s.+:|\bdefault:)$/,
      afterText: /^(?!\s*(\bcase\b|\bdefault\b))/,
      action: {
        indentAction: languages.IndentAction.Indent,
      },
    },
    {
      previousLineText: /^\s*(((else ?)?if|for|while)\s*\(.*\)\s*|else\s*)$/,
      beforeText: /^\s+([^{i\s]|i(?!f\b))/,
      action: {
        indentAction: languages.IndentAction.Outdent,
      },
    },
  ],
}
