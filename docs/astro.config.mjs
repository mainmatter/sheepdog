import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

import svelte from '@astrojs/svelte';

// https://astro.build/config
export default defineConfig({
	site: 'https://jsonsheet.com',
	integrations: [
		starlight({
			title: 'svelte-concurrency',
			social: {
				github: 'https://github.com/mainmatter/svelte-concurrency',
			},
			customCss: ['./src/styles/global.css'],
			editLink: {
				baseUrl: 'https://github.com/mainmatter/svelte-concurrency/edit/main',
			},
			sidebar: [
				{
					label: 'Getting started',
					items: [
						{
							label: 'Installation',
							link: '/getting-started/installation/',
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
});
