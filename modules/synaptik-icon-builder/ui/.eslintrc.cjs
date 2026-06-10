/** Synaptik UI — AICADS consumer lint (tokens + isolation). */
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  env: {
    browser: true,
    es2022: true,
  },
  extends: [require.resolve('@ai-ds/core/eslint-config')],
  rules: {
    'no-hardcoded-tokens': 'error',
  },
};
