import type { Handler } from './types';

type Handle = ReturnType<Handler>;
type Fn = Parameters<Handle>[0];

const handler = (() => {
	let running: null | Fn;

	const handle: Handle = async (fn: () => void, utils) => {
		if (running) {
			return;
		}
		running = fn;
		try {
			fn();
			await utils.promise;
		} catch {
			/** empty */
		}
		running = null;
	};
	return handle;
}) satisfies Handler;

export default handler;
