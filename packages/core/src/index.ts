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

export type SheepdogUtils = {
	signal: AbortSignal;
	link: <TArgs, TReturn>(task: Task<TArgs, TReturn>) => Task<TArgs, TReturn>;
};

export type Task<TArgs = unknown, TReturn = unknown> = ReturnType<
	typeof createTask<TArgs, TReturn>
>;

type TaskAdapter<TReturn = unknown, TModifier = object> = {
	/**
	 * Callback called to register an onDestroy callback
	 */
	onDestroy: (fn: () => void) => void;
	/**
	 * Callback called when the instance is manually canceled
	 */
	onInstanceCancel: (instance_id: string) => void;
	/**
	 * Callback called when `perform` is called regardless if the handler is
	 * immediately executed or not
	 */
	onInstanceCreate: (instance_id: string) => void;
	/**
	 * Callback called when the instance is actually executed by the handler
	 */
	onInstanceStart: (instance_id: string) => void;
	/**
	 * Callback called if the instance completes successfully
	 */
	onInstanceComplete: (instance_id: string, new_value: TReturn) => void;
	/**
	 * Callback called when the instance errors out
	 */
	onError: (instance_id: string, error: unknown | undefined) => void;
	/**
	 * Callback called with the promise-like returned from perform. It allows you to
	 * modify the value (like appending a subscribe or create a signal out of it)
	 * before finally being returned to the user
	 */
	returnModifier?: (
		instance_id: string,
		returned_value: Promise<TReturn> & { cancel(): void },
	) => Promise<TReturn> & { cancel(): void } & TModifier;
};

export class CancelationError extends Error {
	constructor() {
		super('CancelationError: the task instance was cancelled');
		super.name = 'CancelationError';
	}
}

export type TaskFunction<TArgs = unknown, TReturn = unknown> = (
	args: TArgs,
	utils: SheepdogUtils,
) => Promise<TReturn> | AsyncGenerator<unknown, TReturn, unknown>;

export function createTask<TArgs = unknown, TReturn = unknown, TModifier = object>(
	adapter: TaskAdapter<TReturn, TModifier>,
	gen_or_fun: TaskFunction<TArgs, TReturn>,
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
				abort_controller.controller.signal.removeEventListener('abort', abort_controller.listener);
			});
		},
		perform(...args: undefined extends TArgs ? [] : [TArgs]) {
			const child_tasks = new Set<ReturnType<Task<any, any>['perform']>>();

			const instance_id = crypto.randomUUID();

			let resolve: (value: TReturn) => unknown;
			let reject: (cause: unknown) => unknown;
			function cancel_linked_and_update_store() {
				for (const child_task of child_tasks) {
					child_task.cancel();
				}
				adapter.onInstanceCancel(instance_id);
				reject(new CancelationError());
			}
			const promise = new Promise<TReturn>((resolver, rejecter) => {
				resolve = resolver;
				reject = rejecter;
			});
			const abort_controller = new AbortController();
			abort_controller.signal.addEventListener('abort', cancel_linked_and_update_store);
			const set_element = {
				controller: abort_controller,
				listener: cancel_linked_and_update_store,
			};
			abort_controllers.add(set_element);
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
			// we always create the instance because it's also used by the returnModifier
			adapter.onInstanceCreate(instance_id);
			handler(
				() => {
					queueMicrotask(async () => {
						adapter.onInstanceStart(instance_id);
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
									set_element.controller.signal.removeEventListener('abort', set_element.listener);
									abort_controllers.delete(set_element);
									adapter.onInstanceComplete(instance_id, last_result);
									resolve(next_val.value);
								}
							} else if (!abort_controller.signal.aborted) {
								set_element.controller.signal.removeEventListener('abort', set_element.listener);
								abort_controllers.delete(set_element);
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

			// we default to just return the same value if returnModifier is null
			const modifier =
				adapter.returnModifier ??
				(((_: string, ret: any) => ret) as NonNullable<typeof adapter.returnModifier>);

			return modifier(
				instance_id,
				Object.assign(promise, {
					cancel() {
						abort_controller.abort();
					},
				}),
			);
		},
	};
}
