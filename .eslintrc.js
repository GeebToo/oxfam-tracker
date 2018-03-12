module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 8,
    ecmaFeatures: {
      jsx: true
    },
    sourceType: 'module',
    parser: 'babel-eslint'
  },
  globals: {
    localStorage: true,
    JSON: true,
    XMLHttpRequest: true
  },
  env: {
    browser: true
  },
  extends: ['plugin:vue/recommended'],
  plugins: ['vue'],
  rules: {
    quotes: ['error', 'single'],
    semi: ['error', 'never'],
    'generator-star-spacing': 0,
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'vue/max-attributes-per-line': 'off'
  }
}
