module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true,
    worker: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    }
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:vue/recommended'],
  rules: {
    semi: ['warn', 'always'],
    quotes: ['warn', 'single'],
    'eol-last': ['warn', 'always'],
    'no-debugger': 'warn',
    'jsx-quotes': ['warn','prefer-double'],
    'key-spacing': 'warn',
    'keyword-spacing': 'warn',
    'no-multiple-empty-lines': 'warn',
    'no-trailing-spaces': 'warn',
    'space-infix-ops': ['warn', {'int32Hint': false}],
    'vue/multi-word-component-names': 'off'
  },
  overrides: [
    {
      files: ['**/*.{vue,tsx,ts,jsx,js}'],
      parser: 'vue-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser'
      }
    },
    {
      files: ['**/*.tsx'],
      parser: '@typescript-eslint/parser',
    }
  ]
};
