import type { Handler } from './types';

type Handle = ReturnType<Handler>;
type Fn = Parameters<Handle>[0];
type Utils = Parameters<Handle>[1];

const handler = (({ max = 1 }: { max?: number } = { max: 1 }) => {
	let running = 0;
	let latest:
		| {
				fn: Fn;
				utils: Utils;
		  }
		| undefined = undefined;

	const handle: Handle = async (fn: () => void, utils) => {
		if (running >= max) {
			latest?.utils.abort_controller.abort();
			latest = { fn, utils };
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

		if (latest) {
			handle(latest.fn, latest.utils);
			latest = undefined;
		}
	};
	return handle;
}) satisfies Handler;

export default handler;
