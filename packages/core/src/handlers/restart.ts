import type { Handler } from './types';

type Handle = ReturnType<Handler>;

const handler = (({ max = 1 }: { max?: number } = { max: 1 }) => {
	const running_controllers = new Set<AbortController>();

	const handle: Handle = async (fn: () => void, utils) => {
		if (running_controllers.size >= max) {
			const first = running_controllers.values().next();
			first.value?.abort();
			running_controllers.delete(first.value!);
		}
		running_controllers.add(utils.abort_controller);
		try {
			fn();
			await utils.promise;
		} catch {
			/** empty */
		}
		running_controllers.delete(utils.abort_controller);
	};
	return handle;
}) satisfies Handler;

export default handler;
