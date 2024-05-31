/* eslint-disable @typescript-eslint/no-explicit-any */
import default_handler from './handlers/default';
import drop from './handlers/drop';
import enqueue from './handlers/enqueue';
import keep_latest from './handlers/keep_latest';
import restart from './handlers/restart';

export const handlers = {
	default: default_handler,
	drop,
	enqueue,
	keepLatest: keep_latest,
	restart,
} as const;

export type HandlersMap = typeof handlers;

export type HandlerType = keyof HandlersMap;

export type TaskOptions = {
	[K in HandlerType]: { kind: K } & (Parameters<HandlersMap[K]> extends []
		? object
		: Parameters<HandlersMap[K]>[0]);
}[HandlerType];

export type SvelteConcurrencyUtils = {
	signal: AbortSignal;
	link: <TArgs, TReturn>(task: Task<TArgs, TReturn>) => Task<TArgs, TReturn>;
};

export type Task<TArgs = unknown, TReturn = unknown> = ReturnType<
	typeof createTask<TArgs, TReturn>
>;

type TaskAdapter<TReturn = unknown> = {
	onDestroy: (fn: () => void) => void;
	onInstanceCancel: (instance_id: string) => void;
	onInstanceStart: (instance_id: string) => void;
	onInstanceComplete: (instance_id: string, new_value: TReturn) => void;
	onError: (instance_id: string, error: unknown | undefined) => void;
};

export function createTask<TArgs = unknown, TReturn = unknown>(
	adapter: TaskAdapter<TReturn>,
	gen_or_fun: (
		args: TArgs,
		utils: SvelteConcurrencyUtils,
	) => Promise<TReturn> | AsyncGenerator<unknown, TReturn, unknown>,
	options?: TaskOptions,
) {
	const handler_factory = handlers[options?.kind ?? 'default'];
	if (!handler_factory) {
		throw new Error(`Unexpected kind '${options?.kind}'`);
	}
	const handler = handler_factory(options as never);

	const abort_controllers = new Set<{ controller: AbortController; listener: () => void }>();

	adapter.onDestroy(() => {
		abort_controllers.forEach((abort_controller) => {
			abort_controller.controller.abort();
			abort_controller.controller.signal.removeEventListener('abort', abort_controller.listener);
		});
	});

	return {
		cancelAll() {
			abort_controllers.forEach((abort_controller) => {
				abort_controller.controller.abort();
			});
		},
		perform(...args: undefined extends TArgs ? [] : [TArgs]) {
			const child_tasks = new Set<ReturnType<Task<any, any>['perform']>>();

			const instance_id = crypto.randomUUID();

			function cancel_linked_and_update_store() {
				for (const child_task of child_tasks) {
					child_task.cancel();
				}
				adapter.onInstanceCancel(instance_id);
			}

			let resolve: (value: TReturn) => unknown;
			let reject: (cause: unknown) => unknown;
			const promise = new Promise<TReturn>((resolver, rejecter) => {
				resolve = resolver;
				reject = rejecter;
			});
			const abort_controller = new AbortController();
			abort_controller.signal.addEventListener('abort', cancel_linked_and_update_store);
			abort_controllers.add({
				controller: abort_controller,
				listener: cancel_linked_and_update_store,
			});
			function link<TLinkArgs, TLinkReturn>(
				task: Task<TLinkArgs, TLinkReturn>,
			): Task<TLinkArgs, TLinkReturn> {
				const old_perform = task.perform;
				return {
					...task,
					perform(...args) {
						const instance = old_perform(...args);
						child_tasks.add(instance);
						return instance;
					},
				};
			}
			handler(
				() => {
					adapter.onInstanceStart(instance_id);
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
									next_val = await gen_or_value.next(next_val.value);
								}
								if (next_val.done) {
									const last_result = next_val.value;
									adapter.onInstanceComplete(instance_id, last_result);
									resolve(next_val.value);
								}
							} else if (!abort_controller.signal.aborted) {
								adapter.onInstanceComplete(instance_id, gen_or_value);
								resolve(gen_or_value);
							}
						} catch (e) {
							if (!abort_controller.signal.aborted) {
								adapter.onError(instance_id, e);
							}
							reject(e);
						}
					});
				},
				{ promise, abort_controller },
			);

			return Object.assign(promise, {
				cancel() {
					abort_controller.abort();
				},
			});
		},
	};
}
