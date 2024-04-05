import type { Handler } from './types';

type Handle = ReturnType<Handler>;

const handler = (({ max = 1 }: { max?: number } = { max: 1 }) => {
	const running_controllers: AbortController[] = [];

	const handle: Handle = async (fn: () => void, utils) => {
		if (running_controllers.length >= max) {
			running_controllers.shift()?.abort();
		}
		running_controllers.push(utils.abort_controller);
		try {
			fn();
			await utils.promise;
		} catch {
			/** empty */
		}
		running_controllers.pop();
	};
	return handle;
}) satisfies Handler;

export default handler;
