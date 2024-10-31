import { onDestroy } from 'svelte';
import { writable } from 'svelte/store';
import type { HandlerType, HandlersMap, SheepdogUtils, TaskOptions, TaskFunction } from './core';
import { CancelationError, createTask, handlers } from './core';
import type { ReadableWithGet, WritableWithGet } from './internal/helpers';
import { writable_with_get } from './internal/helpers';
export type { SheepdogUtils, TaskOptions };

export { CancelationError };

export type Task<TArgs = unknown, TReturn = unknown> = ReturnType<typeof task<TArgs, TReturn>>;

export type TaskInstance<TReturn = undefined> = {
	error?: unknown;
	hasStarted: boolean;
	isCanceled: boolean;
	isError: boolean;
	isFinished: boolean;
	isRunning: boolean;
	isSuccessful: boolean;
	value?: TReturn;
};

function _task<TArgs = unknown, TReturn = undefined>(
	gen_or_fun: TaskFunction<TArgs, TReturn>,
	options?: TaskOptions,
) {
	const { subscribe, ...result } = writable({
		isRunning: false,
		last: undefined as undefined | TaskInstance<TReturn>,
		lastCanceled: undefined as undefined | TaskInstance<TReturn>,
		lastErrored: undefined as undefined | TaskInstance<TReturn>,
		lastRunning: undefined as undefined | TaskInstance<TReturn>,
		lastSuccessful: undefined as undefined | TaskInstance<TReturn>,
		performCount: 0,
	});

	const updateResult = (instance: TaskInstance<TReturn>, new_instance: boolean = false) => {
		return result.update((old) => {
			if (new_instance) {
				old.performCount++;
			}
			const { isSuccessful, isError, isCanceled, isRunning } = instance;
			if (isCanceled) {
				old.lastCanceled = instance;
			}
			if (isError) {
				old.lastErrored = instance;
			}
			if (isSuccessful) {
				old.lastSuccessful = instance;
			}
			if (isRunning) {
				old.lastRunning = instance;
			} else if (old.lastRunning === instance) {
				old.lastRunning = undefined;
			}
			old.last = instance;
			old.isRunning = [...instances.values()].some((val) => val.get().isRunning);
			return old;
		});
	};

	const instances = new Map<string, WritableWithGet<TaskInstance<TReturn>>>();

	const actual_task = createTask<TArgs, TReturn, ReadableWithGet<TaskInstance<TReturn>>>(
		{
			onDestroy(fn) {
				onDestroy(fn);
			},
			onError(instance_id, error) {
				const instance = instances.get(instance_id);
				if (instance) {
					instance.update((instance) => {
						instance.error = error;
						instance.isError = true;
						instance.isFinished = true;
						instance.isRunning = false;
						return instance;
					});
					// we delete after a microtask to avoid returnModifier
					// not founding the instance in case of a syncronous
					// cancellation (for example with drop)
					queueMicrotask(() => {
						instances.delete(instance_id);
					});
					updateResult(instance.get());
				}
			},
			onInstanceCancel(instance_id) {
				const instance = instances.get(instance_id);
				if (instance) {
					instance.update((instance) => {
						instance.isCanceled = true;
						instance.isFinished = true;
						instance.isRunning = false;
						return instance;
					});
					// we delete after a microtask to avoid returnModifier
					// not founding the instance in case of a syncronous
					// cancellation (for example with drop)
					queueMicrotask(() => {
						instances.delete(instance_id);
					});
					updateResult(instance.get());
				}
			},
			onInstanceCreate(instance_id) {
				const instance_value = {
					hasStarted: false,
					isCanceled: false,
					isError: false,
					isFinished: false,
					isRunning: false,
					isSuccessful: false,
				};
				const instance = writable_with_get(instance_value);
				instances.set(instance_id, instance);
				updateResult(instance_value);
			},
			onInstanceStart(instance_id) {
				const instance = instances.get(instance_id);
				if (instance) {
					instance.update((instance) => {
						instance.hasStarted = true;
						instance.isRunning = true;
						return instance;
					});
					updateResult(instance.get(), true);
				}
			},
			onInstanceComplete(instance_id, last_result) {
				const instance = instances.get(instance_id);
				if (instance) {
					instance.update((instance) => {
						instance.isFinished = true;
						instance.isRunning = false;
						instance.isSuccessful = true;
						instance.value = last_result;
						return instance;
					});
					// we delete after a microtask to avoid returnModifier
					// not founding the instance in case of a synchronous
					// cancellation (for example with drop)
					queueMicrotask(() => {
						instances.delete(instance_id);
					});
					updateResult(instance.get());
				}
			},
			returnModifier(instance_id, returned_value) {
				const instance = instances.get(instance_id);
				if (!instance)
					throw new Error('Return modifier has been called before the instance was created');
				return Object.assign(returned_value, {
					subscribe: instance.subscribe,
					get: instance.get,
				});
			},
		},
		gen_or_fun,
		options,
	);
	return Object.assign(actual_task, {
		subscribe,
	});
}

type HandlersShorthands = {
	[K in HandlerType]: <TArgs = undefined, TReturn = unknown>(
		gen_or_fun: (
			args: TArgs,
			utils: SheepdogUtils,
		) => Promise<TReturn> | AsyncGenerator<unknown, TReturn, unknown>,
		options?: Parameters<HandlersMap[K]> extends [] ? object : Parameters<HandlersMap[K]>[0],
	) => ReturnType<typeof task<TArgs, TReturn>>;
};

const task: typeof _task & HandlersShorthands = _task as typeof _task & HandlersShorthands;

function is_key(handler: string): handler is HandlerType {
	return handler in handlers;
}

for (const handler in handlers) {
	if (is_key(handler)) {
		task[handler] = (gen_or_fun, options) => {
			if (!is_key(handler)) {
				throw new Error('Impossible');
			}
			return _task(gen_or_fun, { ...(options ?? {}), kind: handler });
		};
	}
}

export { task };
