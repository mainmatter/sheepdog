import type { Handler } from './types';

type Handle = ReturnType<Handler>;

const handler = (({ max = 1 }: { max?: number } = { max: 1 }) => {
	let running = 0;

	const handle: Handle = async (fn: () => void, utils) => {
		if (running >= max) {
			utils.abort_controller.abort();
			return;
		}
		running++;
		try {
			fn();
			await utils.promise;
		} catch {
			/** empty */
		}
		running--;
	};
	return handle;
}) satisfies Handler;

export default handler;
