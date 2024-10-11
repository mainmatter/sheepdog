import { it, describe } from 'vitest';
import { Project } from 'fixturify-project';
import { execa } from 'execa';

describe('threeshake', () => {
	it(
		'should threeshake',
		{
			only: true,
			timeout: 30000,
			retry: 0,
		},
		async () => {
			console.log('init', process.cwd());
			const project = new Project({
				files: {
					'index.js': `import { timeout } from '@sheepdog/svelte';
				
				timeout();`,
					'index.html': `<script type="module" src="./index.js"></script>`,
				},
			});
			// project.linkDevDependency('vite', {
			// 	baseDir: process.cwd(),
			// });
			project.linkDevDependency('@sheepdog/svelte', {
				baseDir: process.cwd(),
			});
			console.log('before write');
			await project.write();
			console.log('after write');
			await execa({ cwd: project.baseDir })`vite build`;
			console.log(project.files);
		},
	);
});
