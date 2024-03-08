import type { Handler } from './types';

const handler = (() => {
	return (fn: () => void) => {
		fn();
	};
}) satisfies Handler;

export default handler;
