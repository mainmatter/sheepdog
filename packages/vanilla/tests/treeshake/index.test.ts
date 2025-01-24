import { test, describe, expect } from 'vitest';
import { Project } from 'fixturify-project';
import { execa } from 'execa';
import { readdir, readFile } from 'node:fs/promises';

async function does_it_shake(file: string) {
	const project = new Project({
		files: {
			'index.js': file,
			'index.html': `<script type="module" src="./index.js"></script>`,
			'vite.config.ts': `
					export default {
						build: {
							minify: false,
							modulePreload: { polyfill: false }
						}
					}`,
		},
	});
	project.linkDevDependency('vite', {
		baseDir: process.cwd(),
	});
	project.linkDevDependency('@sheepdog/vanilla', {
		baseDir: process.cwd(),
		resolveName: '.',
	});
	await project.write();
	await execa({ cwd: project.baseDir })`vite build`;
	const folder = `${project.baseDir}/dist/assets`;
	const dir = await readdir(folder);
	return readFile(`${folder}/${dir[0]}`, 'utf-8');
}

describe('threeshake', () => {
	test('importing `timeout` should treeshake the rest of the library', async () => {
		const file = await does_it_shake(`import { timeout } from '@sheepdog/vanilla';
			
			timeout();`);
		expect(file).toMatchInlineSnapshot(`
			"async function timeout(ms) {
			  return new Promise((resolve) => setTimeout(resolve, ms));
			}
			timeout();
			"
		`);
	});

	test('importing `didCancel` should treeshake the rest of the library', async () => {
		const file = await does_it_shake(`import { didCancel } from '@sheepdog/vanilla';
			
			console.log(didCancel());`);
		expect(file).toMatchInlineSnapshot(`
			"class CancelationError extends Error {
			  constructor() {
			    super("CancelationError: the task instance was cancelled");
			    super.name = "CancelationError";
			  }
			}
			const didCancel = (e) => {
			  return e instanceof CancelationError;
			};
			console.log(didCancel());
			"
		`);
	});

	test('importing `CancelationError` should treeshake the rest of the library', async () => {
		const file = await does_it_shake(`import { CancelationError } from '@sheepdog/vanilla';
			
			console.log(CancelationError);`);
		expect(file).toMatchInlineSnapshot(`
			"class CancelationError extends Error {
			  constructor() {
			    super("CancelationError: the task instance was cancelled");
			    super.name = "CancelationError";
			  }
			}
			console.log(CancelationError);
			"
		`);
	});

	test('importing `transform` should treeshake the rest of the library', async () => {
		const file = await does_it_shake(`import { transform } from '@sheepdog/vanilla';
			
			console.log(transform);`);
		expect(file).toMatchInlineSnapshot(`
			"function transform(fn) {
			  {
			    throw new Error("You are using the transform function without the vite plugin. Please add the \`asyncTransform\` plugin to your \`vite.config.ts\`");
			  }
			}
			console.log(transform);
			"
		`);
	});
});
