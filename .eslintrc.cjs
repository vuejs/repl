// @ts-check

module.exports = {
  root: true,
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  extends: ['plugin:vue/vue3-recommended'],
  rules: {
    'no-debugger': 'error',
    'no-console': ['error', { allow: ['warn', 'error', 'info', 'clear'] }],
    'sort-imports': ['error', { ignoreDeclarationSort: true }],
    'no-duplicate-imports': 'error',

    // This rule enforces the preference for using '@ts-expect-error' comments in TypeScript
    // code to indicate intentional type errors, improving code clarity and maintainability.
    '@typescript-eslint/prefer-ts-expect-error': 'error',
    // Enforce the use of 'import type' for importing types
    '@typescript-eslint/consistent-type-imports': [
      'error',
      {
        fixStyle: 'inline-type-imports',
        disallowTypeAnnotations: false,
      },
    ],
    // Enforce the use of top-level import type qualifier when an import only has specifiers with inline type qualifiers
    '@typescript-eslint/no-import-type-side-effects': 'error',

    'vue/max-attributes-per-line': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'vue/multi-word-component-names': 'off',
    'vue/html-self-closing': [
      'error',
      {
        html: { component: 'always', normal: 'always', void: 'any' },
        math: 'always',
        svg: 'always',
      },
    ],
  },
  overrides: [],
}
