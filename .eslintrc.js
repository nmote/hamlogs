module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    'jest/globals': true,
  },
  extends: ['eslint:recommended', 'plugin:flowtype/recommended'],
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['jest', 'flowtype'],
  rules: {
    indent: ['error', 2, {SwitchCase: 1}],
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single', {avoidEscape: true}],
    semi: ['error', 'always'],
    'flowtype/require-valid-file-annotation': ['error', 'always', {strict: true}],
  },
  overrides: [
    {
      files: ['src/**/*.test.js', '.eslintrc.js', 'bin/*'],
      rules: {
        'flowtype/require-valid-file-annotation': [0, 'never'],
      },
    },
  ],
};
