import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import path from 'node:path';
import svelte from '@astrojs/svelte';

import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
	site: 'https://sheepdogjs.com',
	vite: {
		resolve: {
			alias: {
				'@assets': path.resolve(process.cwd(), './src/assets'),
			},
		},
	},
	integrations: [
		starlight({
			title: '@sheepdog/svelte',
			head: [
				{
					tag: 'link',
					attrs: {
						rel: 'shortcut icon',
						href: '/logo-light.svg',
						media: '(prefers-color-scheme: light)',
					},
				},
				{
					tag: 'link',
					attrs: {
						rel: 'shortcut icon',
						href: '/logo-dark.svg',
						media: '(prefers-color-scheme: dark)',
					},
				},
			],
			social: {
				github: 'https://github.com/mainmatter/sheepdog',
			},
			customCss: ['./src/styles/global.css'],
			editLink: {
				baseUrl: 'https://github.com/mainmatter/sheepdog/edit/main',
			},
			sidebar: [
				{
					label: 'Getting started',
					items: [
						{
							label: 'What is it?',
							link: '/getting-started/what-is-it/',
						},
						{
							label: 'Installation',
							link: '/getting-started/installation/',
						},
						{
							label: 'Basic Usage',
							link: '/getting-started/usage/',
						},
					],
				},
				{
					label: 'Guides',
					items: [
						// Each item here is one entry in the navigation menu.
						{
							label: 'Async Transform',
							link: '/guides/async-transform/',
						},
						{
							label: 'Task modifiers',
							link: '/guides/task-modifiers/',
						},
					],
				},
				{
					label: 'Reference',
					autogenerate: {
						directory: 'reference',
					},
				},
			],
		}),
		svelte(),
	],
	output: 'server',
	adapter: netlify({
		edgeMiddleware: true,
	}),
});
