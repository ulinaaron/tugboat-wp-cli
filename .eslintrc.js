module.exports = {
  env: {
    browser: true,
    es6: true,
    "jest/globals": true
  },
  extends: [
    'airbnb-base',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    "ecmaVersion": 6,
    "sourceType": "module"
  },
  rules: {
  },
  plugins: [
    'jest'
  ]
};
