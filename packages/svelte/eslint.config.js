import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginSvelte from 'eslint-plugin-svelte';
import globals from 'globals';
import svelteParser from 'svelte-eslint-parser';
import tsEslint from 'typescript-eslint';
import playwright from 'eslint-plugin-playwright';

export default tsEslint.config(
	js.configs.recommended,
	...tsEslint.configs.recommended,
	...eslintPluginSvelte.configs['flat/recommended'],
	eslintConfigPrettier,
	{
		...playwright.configs['flat/recommended'],
		files: ['tests/**'],
	},
	{
		languageOptions: {
			ecmaVersion: 2020,
			sourceType: 'module',
			globals: {
				...globals.node,
				...globals.browser,
				...globals.es2017,
			},
			parser: tsEslint.parser,
			parserOptions: {
				extraFileExtensions: ['.svelte'],
			},
		},
		plugins: {
			'@typescript-eslint': tsEslint.plugin,
		},
	},
	{
		files: ['**/*.svelte'],
		languageOptions: {
			parser: svelteParser,
			parserOptions: {
				parser: tsEslint.parser,
				svelteFeatures: {
					experimentalGenerics: true,
				},
			},
		},
	},
	{
		ignores: [
			'**/.svelte-kit',
			'**/build',
			'**/node_modules',
			'**/static',
			'**/test-results',
			'**/expected-transforms',
			'**/dist',
			'**/docs',
			'**/coverage',
			'CHANGELOG.md',
			'.release-plan-json',
		],
	},
);
