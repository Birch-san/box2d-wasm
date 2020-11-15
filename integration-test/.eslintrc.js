/* eslint-env node */

module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: 'module',
  },
  parser: '@typescript-eslint/parser',
  env: {
    es6: true,
    browser: true
  },
  extends: [
    'eslint:recommended'
  ],
  plugins: [
    '@typescript-eslint',
  ],
  overrides: [
		{
			files: ["*.ts"],
			extends: [
				"plugin:@typescript-eslint/recommended"
			],
		},
  ],
  ignorePatterns: ['public/build/**/*.js']
};
