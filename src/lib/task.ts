/* eslint-disable @typescript-eslint/no-explicit-any */
import { onDestroy } from 'svelte';
import { writable } from 'svelte/store';
import default_handler from './handlers/default';
import enqueue from './handlers/enqueue';

const handlers = {
	default: default_handler,
	enqueue,
} as const;

type HandlersMap = typeof handlers;

type HandlerType = keyof HandlersMap;

type TaskOptions = {
	[K in HandlerType]: { kind: K } & (Parameters<HandlersMap[K]> extends []
		? object
		: Parameters<HandlersMap[K]>[0]);
}[HandlerType];

type SvelteConcurrencyUtils = {
	signal: AbortSignal;
	link: <T extends { cancel: () => void }>(task: T) => T;
};

export type Task<TArgs = unknown, TReturn = unknown> = ReturnType<typeof task<TArgs, TReturn>>;

function _task<TArgs = undefined, TReturn = unknown>(
	gen_or_fun: (
		args: TArgs,
		utils: SvelteConcurrencyUtils,
	) => Promise<TReturn> | AsyncGenerator<unknown, TReturn, unknown>,
	options?: TaskOptions,
) {
	const handler_factory = handlers[options?.kind ?? 'default'];
	const handler = handler_factory(options as never);
	const results: TReturn[] = [];

	const { subscribe, ...result } = writable({
		is_loading: false,
		last_successful: undefined as undefined | TReturn,
		error: undefined as undefined | unknown,
		results,
	});

	let abort_controller = new AbortController();
	abort_controller.signal.addEventListener('abort', cancel_linked_and_update_store);

	onDestroy(() => {
		abort_controller.abort();
	});

	const child_tasks = new Set<{ cancel: () => void }>();

	function link<T extends { cancel: () => void }>(task: T) {
		child_tasks.add(task);
		return task;
	}

	function cancel_linked_and_update_store() {
		for (const child_task of child_tasks) {
			child_task.cancel();
		}
		result.update((old) => {
			old.is_loading = false;
			return old;
		});
	}

	return {
		subscribe,
		cancel() {
			abort_controller.abort();
		},
		perform(...args: undefined extends TArgs ? [] : [TArgs]) {
			let resolve: (value: TReturn) => unknown;
			const promise = {
				then(resolver: (value: TReturn) => TReturn) {
					resolve = resolver;
				},
				//TODO: handle catch and finally
			};
			handler(
				() => {
					abort_controller.signal.removeEventListener('abort', cancel_linked_and_update_store);
					abort_controller = new AbortController();
					abort_controller.signal.addEventListener('abort', cancel_linked_and_update_store);
					result.update((old) => {
						old.is_loading = true;
						return old;
					});
					queueMicrotask(async () => {
						try {
							const gen_or_value = await gen_or_fun(args[0]!, {
								signal: abort_controller.signal,
								link,
							});
							const is_generator =
								gen_or_value &&
								typeof gen_or_value === 'object' &&
								Symbol.asyncIterator in gen_or_value;
							if (is_generator) {
								let next_val = await gen_or_value.next();
								while (!next_val.done) {
									if (abort_controller.signal.aborted) {
										break;
									}
									next_val = await gen_or_value.next();
								}
								if (next_val.done) {
									const last_result = next_val.value;
									results.push(last_result);
									result.update((old) => {
										old.error = undefined;
										old.is_loading = false;
										old.last_successful = last_result;
										return old;
									});
									resolve(next_val.value);
								}
							} else if (!abort_controller.signal.aborted) {
								results.push(gen_or_value);
								result.update((old) => {
									old.error = undefined;
									old.is_loading = false;
									old.last_successful = gen_or_value;
									return old;
								});
								resolve(gen_or_value);
							}
						} catch (e) {
							if (!abort_controller.signal.aborted) {
								result.update((old) => {
									old.error = e;
									old.is_loading = false;
									return old;
								});
							}
						}
					});
				},
				{ promise, abort_controller },
			);
			return {
				subscribe,
				...promise,
			};
		},
	};
}

type HandlersShorthands = {
	[K in HandlerType]: <TArgs = undefined, TReturn = unknown>(
		gen_or_fun: (
			args: TArgs,
			utils: SvelteConcurrencyUtils,
		) => Promise<TReturn> | AsyncGenerator<unknown, TReturn, unknown>,
		options?: Parameters<HandlersMap[K]> extends [] ? object : Parameters<HandlersMap[K]>[0],
	) => ReturnType<typeof _task<TArgs, TReturn>>;
};

const to_assign: HandlersShorthands = {} as HandlersShorthands;

function is_key(handler: string): handler is HandlerType {
	return handler in handlers;
}

for (let handler in handlers) {
	if (is_key(handler)) {
		to_assign[handler] = (gen_or_fun, options) =>
			_task(gen_or_fun, { kind: is_key(handler) ? handler : 'default', ...(options ?? {}) });
	}
}

export const task = Object.assign(_task, to_assign);
