import { sveltekit } from '@sveltejs/kit/vite';
import { coverageConfigDefaults, defineConfig } from 'vitest/config';
import { svelteTesting } from '@testing-library/svelte/vite';

export default defineConfig({
	plugins: [sveltekit(), svelteTesting()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
		setupFiles: './src/vitest-setup.ts',
		retry: 1,
		exclude: ['src/lib/tests/threeshake/*'],
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
});
