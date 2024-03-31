import type { Handler } from './types';

type Handle = ReturnType<Handler>;
type Fn = Parameters<Handle>[0];
type Utils = Parameters<Handle>[1];

const handler = (({ max = 1 }: { max?: number } = { max: 1 }) => {
	let running = 0;
	const queue: Array<{
		fn: Fn;
		utils: Utils;
	}> = [];

	const handle: Handle = async (fn: () => void, utils) => {
		if (running >= max) {
			queue.push({
				fn,
				utils,
			});
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
		const next = queue.shift();
		if (next) {
			handle(next.fn, next.utils);
		}
	};
	return handle;
}) satisfies Handler;

export default handler;
