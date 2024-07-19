import { asyncTransform } from '../../vite';
import { readdirSync, existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';

const dir = readdirSync('./src/lib/tests/expected-transforms', {
	withFileTypes: true,
	recursive: true,
});

const [, , force] = process.argv;

const plugin = asyncTransform();

for (const file of dir) {
	if (
		file.isFile() &&
		file.name === 'code.js' &&
		(!!force || !existsSync(`${file.parentPath}/transform.js`))
	) {
		console.log('generating expected for', file.parentPath);
		readFile(`${file.parentPath}/${file.name}`).then(async (code) => {
			// @ts-expect-error we don't have the correct `this` here but we are not using it
			const result = await plugin.transform(code, 'code.js');
			if (result) {
				await writeFile(`${file.parentPath}/transform.js`, result.code);
			}
		});
	}
}
