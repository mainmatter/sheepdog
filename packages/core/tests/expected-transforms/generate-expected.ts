import { createAsyncTransformPlugin } from '../../src/vite';
import { readdirSync, existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';

const dir = readdirSync('./tests/expected-transforms', {
	withFileTypes: true,
	recursive: true,
});

const [, , force] = process.argv;

const plugin = await createAsyncTransformPlugin([
	'@sheepdog/svelte',
	'@sheepdog/svelte/task',
	'@sheepdog/svelte/utils',
])();

for (const file of dir) {
	if (
		file.isFile() &&
		file.name === 'code.js' &&
		(!!force || !existsSync(`${file.parentPath}/transform.js`))
	) {
		console.log('generating expected for', file.parentPath);
		readFile(`${file.parentPath}/${file.name}`, 'utf-8').then(async (code) => {
			// @ts-expect-error we don't have the correct `this` here but we are not using it
			const result = await plugin.transform(code, 'code.js');
			if (result) {
				await writeFile(`${file.parentPath}/transform.js`, result.code);
				await writeFile(`${file.parentPath}/code.js.map`, result.map.toString());
			}
		});
	}
}
