import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		include: ['src/lib/tests/threeshake/*.{test,spec}.{js,ts}'],
		retry: 1,
	},
});
