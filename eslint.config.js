import js from '@eslint/js';
import ts from 'typescript-eslint';
import svelte from 'eslint-plugin-svelte';
import prettier from 'eslint-config-prettier';
import globals from 'globals';
import svelte_config from './packages/svelte/svelte.config.js';

/** @type {import('eslint').Linter.Config[]} */
export default [
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs['flat/recommended'],
	prettier,
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
	},
	{
		files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
		languageOptions: {
			parserOptions: {
				projectService: true,
				extraFileExtensions: ['.svelte'],
				parser: ts.parser,
				svelteConfig: svelte_config,
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
	{
		rules: {
			'svelte/require-each-key': 'off',
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					argsIgnorePattern: '^(_|\\$\\$)',
					varsIgnorePattern: '^(_|\\$\\$)',
					caughtErrorsIgnorePattern: '^(_|\\$\\$)',
				},
			],
		},
	},
];
