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
							label: 'Async Transform',
							link: '/explainers/async-transform/',
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
