const path = require('path')

module.exports = {
  extends: 'standard-with-typescript',
  rules: {
    '@typescript-eslint/naming-convention': 'off',
    'new-cap': 'off'
  },
  parserOptions: {
    project: path.join(__dirname, 'tsconfig.json')
  }
}
