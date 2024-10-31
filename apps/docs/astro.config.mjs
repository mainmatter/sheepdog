import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import path from 'node:path';
import svelte from '@astrojs/svelte';

import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
	site: 'https://sheepdog.run',
	vite: {
		resolve: {
			alias: {
				'@assets': path.resolve(process.cwd(), './src/assets'),
				'@components': path.resolve(process.cwd(), './src/components'),
			},
		},
	},
	integrations: [
		starlight({
			components: {
				SiteTitle: './src/components/SiteTitle.astro',
				Hero: './src/components/Hero.astro',
				Footer: './src/components/Footer.astro',
			},
			title: '@sheepdog/svelte',
			expressiveCode: {
				themes: ['github-dark-default', 'github-light-default'],
			},
			head: [
				{
					tag: 'script',
					attrs: {
						defer: '',
						'data-domain': 'sheepdog.run',
						src: 'https://plausible.io/js/script.js',
					},
				},
				{
					tag: 'link',
					attrs: {
						rel: 'shortcut icon',
						href: '/full-color.svg',
						media: '(prefers-color-scheme: light)',
					},
				},
				{
					tag: 'link',
					attrs: {
						rel: 'shortcut icon',
						href: '/1c-plus.svg',
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
					label: 'Explainers',
					items: [
						// Each item here is one entry in the navigation menu.
						{
							label: 'Mid run cancellation',
							link: '/explainers/mid-run-cancellation/',
						},
						{
							label: 'Task modifiers',
							link: '/explainers/task-modifiers/',
						},
						{
							label: 'Linking tasks',
							link: '/explainers/linking-tasks/',
						},
						{
							label: 'Async Transform',
							link: '/explainers/async-transform/',
						},
					],
				},
				{
					label: 'Reference',
					items: [
						{
							label: 'Default task',
							link: '/reference/default',
						},
						{
							label: 'Drop task',
							link: '/reference/drop',
						},
						{
							label: 'Enqueue task',
							link: '/reference/enqueue',
						},
						{
							label: 'KeepLatest task',
							link: '/reference/keep-latest',
						},
						{
							label: 'Restart task',
							link: '/reference/restart',
						},
						{
							label: 'Sheepdog Utils',
							link: '/reference/sheepdog-utils',
						},
						{
							label: 'Task Instance',
							link: '/reference/task-instance',
						},
					],
				},
			],
		}),
		svelte(),
	],
	output: 'static',
	adapter: netlify({}),
});
