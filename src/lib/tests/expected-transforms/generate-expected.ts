import { asyncTransform } from '../../vite';
import { readdirSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';

const dir = readdirSync('./src/lib/tests/expected-transforms', {
	withFileTypes: true,
	recursive: true,
});

const plugin = asyncTransform();

for (const file of dir) {
	if (file.isFile() && file.name === 'code.js') {
		readFile(`${file.path}/${file.name}`).then(async (code) => {
			// @ts-expect-error we don't have the correct `this` here but we are not using it
			const result = await plugin.transform(code, 'code.js');
			if (result) {
				await writeFile(`${file.path}/transform.js`, result.code);
			}
		});
	}
}
