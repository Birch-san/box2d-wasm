/* eslint-env node */
const eslintSveltePreprocess = require('eslint-svelte3-preprocess');
const svelteConfig = require('./svelte.config');

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
    'svelte3',
    '@typescript-eslint',
  ],
  overrides: [
    {
      files: ['*.svelte'],
      processor: 'svelte3/svelte3',
    },
		{
			files: ["*.ts"],
			extends: [
				"plugin:@typescript-eslint/recommended"
			],
		},
  ],
  settings: {
    'svelte3/preprocess': eslintSveltePreprocess(svelteConfig.preprocess),
	},
};
