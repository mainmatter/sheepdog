import { sveltekit } from '@sveltejs/kit/vite';
import { coverageConfigDefaults, defineConfig } from 'vitest/config';

export default defineConfig(({ mode }) => ({
	plugins: [sveltekit()],
	resolve: {
		conditions: mode === 'test' ? ['browser'] : [],
	},
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
		setupFiles: './src/vitest-setup.ts',
		retry: 1,
		coverage: {
			exclude: [
				'src/routes/**/*',
				'src/lib/tests/expected-transforms/generate-expected.ts',
				'*.[j|t]s',
				'docs/**/*',
				...coverageConfigDefaults.exclude,
			],
		},
	},
}));
