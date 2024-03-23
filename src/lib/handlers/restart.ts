import type { Handler } from './types';

type Handle = ReturnType<Handler>;

const handler = (() => {
	let running_controller: null | AbortController;

	const handle: Handle = async (fn: () => void, utils) => {
		if (running_controller) {
			running_controller.abort();
		}
		running_controller = utils.abort_controller;
		try {
			fn();
			await utils.promise;
		} catch {
			/** empty */
		}
		running_controller = null;
	};
	return handle;
}) satisfies Handler;

export default handler;
