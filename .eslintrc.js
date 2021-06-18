module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['airbnb-base', 'prettier'],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    'prettier/prettier': 'error',
    'import/named': 'warn',
    'no-unused-vars': 'warn',
    'import/prefer-default-export': 'none',
  },
  plugins: ['prettier'],
  settings: {
    'import/resolver': {
      'babel-module': {},
    },
  },
};
