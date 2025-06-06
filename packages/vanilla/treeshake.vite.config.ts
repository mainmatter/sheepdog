import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		include: ['./tests/treeshake/*.{test,spec}.{js,ts}'],
		retry: 1,
	},
});
