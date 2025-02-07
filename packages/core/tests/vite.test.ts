import { createAsyncTransformPlugin } from '../src/vite';
import { describe, it, expect } from 'vitest';
import { writeFile } from 'node:fs/promises';

const plugin = await createAsyncTransformPlugin([
	'@sheepdog/svelte',
	'@sheepdog/svelte/task',
	'@sheepdog/svelte/utils',
])();

const expected_entries = Object.entries(
	import.meta.glob<true, string, string>('./expected-transforms/**/(code|transform).js', {
		query: '?raw',
		import: 'default',
		eager: true,
	}),
);
const expected = new Map<string, { code: string; transform?: string }>();

for (const [file, code] of expected_entries) {
	const match = file.match(/\.\/expected-transforms\/(?<folder>.+)\/(?<kind>code|transform)\.js/);
	const id = match?.groups?.folder;
	const kind = match?.groups?.kind;
	if (id && kind) {
		if (!expected.has(id)) {
			expected.set(id, {
				code: '',
			});
		}
		expected.get(id)![kind as unknown as 'code' | 'transform'] = code;
	}
}

describe('sheepdog transform', () => {
	it.each([...expected.entries()])('%s', async (id, { code, transform }) => {
		// @ts-expect-error we don't have the correct `this` here but we are not using it
		const actual_transform = await plugin.transform(code, 'myfile.js');
		if (actual_transform) {
			// write the actual transform to file for better debugging
			writeFile(`./tests/expected-transforms/${id}/_actual.js`, actual_transform.code);
		}
		expect(actual_transform?.code).toBe(transform);
	});
});
