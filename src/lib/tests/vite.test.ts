import { concurrency_transform } from '../vite';
import { describe, it, expect } from 'vitest';

const plugin = concurrency_transform();

const expected_entries = Object.entries(
	import.meta.glob('./expected-transforms/**/*.js', { as: 'raw', eager: true }),
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

describe('concurrency transform', () => {
	it.each([...expected.entries()])('%s', async (id, { code, transform }) => {
		// @ts-expect-error we don't have the correct `this` here but we are not using it
		const actual_transform = await plugin.transform(code, 'myfile.js');
		expect(actual_transform?.code).toBe(transform);
	});
});
