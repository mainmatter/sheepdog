import { createAsyncTransformPlugin } from '@sheepdog/core/vite';

const asyncTransform = createAsyncTransformPlugin([
	'@sheepdog/svelte',
	'@sheepdog/svelte/task',
	'@sheepdog/svelte/utils',
]);

export { asyncTransform };
