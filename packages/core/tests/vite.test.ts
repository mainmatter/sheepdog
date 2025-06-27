import { createAsyncTransformPlugin } from '../src/vite';
import { describe, it, expect } from 'vitest';
import { writeFile } from 'node:fs/promises';

const plugin = await createAsyncTransformPlugin([
	'@sheepdog/svelte',
	'@sheepdog/svelte/task',
	'@sheepdog/svelte/utils',
])();

const expected_entries = Object.entries(
	import.meta.glob<true, string, string>('./expected-transforms/**/(code|transform)(.js|.js.map)', {
		query: '?raw',
		import: 'default',
		eager: true,
	}),
);
const expected = new Map<string, { code: string; transform?: string; map?: string }>();

for (const [file, code] of expected_entries) {
	const match = file.match(
		/\.\/expected-transforms\/(?<folder>.+)\/(?<kind>code|transform)\.js(?<map>\.map)?/,
	);
	const id = match?.groups?.folder;
	const kind = match?.groups?.kind;
	const map = !!match?.groups?.map;
	if (id && kind) {
		if (!expected.has(id)) {
			expected.set(id, {
				code: '',
			});
		}
		expected.get(id)![(map ? 'map' : kind) as unknown as 'code' | 'transform' | 'map'] = code;
	}
}

describe('sheepdog transform', () => {
	it.each([...expected.entries()])('%s', async (id, { code, transform, map }) => {
		// @ts-expect-error we don't have the correct `this` here but we are not using it
		const actual_transform = await plugin.transform(code, 'code.js');
		if (actual_transform) {
			// write the actual transform to file for better debugging
			writeFile(`./tests/expected-transforms/${id}/_actual.js`, actual_transform.code);
			writeFile(
				`./tests/expected-transforms/${id}/_actual.js.map`,
				actual_transform.map.toString(),
			);
		}
		expect(actual_transform?.code).toBe(transform);
		expect(actual_transform?.map?.toString()).toBe(map);
	});
});
