import { coverageConfigDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		include: ['tests/**/*.{test,spec}.{js,ts}'],
		retry: 1,
		exclude: ['./tests/threeshake/*'],
		coverage: {
			exclude: ['*.[j|t]s', './tests/threeshake/*', ...coverageConfigDefaults.exclude],
		},
	},
});
