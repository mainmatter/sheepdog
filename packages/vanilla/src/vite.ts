import { createAsyncTransformPlugin } from '@sheepdog/core/vite';

const asyncTransform = createAsyncTransformPlugin([
	'@sheepdog/vanilla',
	'@sheepdog/vanilla/task',
	'@sheepdog/vanilla/utils',
]);

export { asyncTransform };
