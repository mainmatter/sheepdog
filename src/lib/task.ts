import { onDestroy } from 'svelte';
import { createTask, handlers, CancelationError } from './core';
import { writable } from 'svelte/store';
import type { SheepdogUtils, TaskOptions, HandlerType, HandlersMap } from './core';
export type { SheepdogUtils, TaskOptions };

export { CancelationError };

export type Task<TArgs = unknown, TReturn = unknown> = ReturnType<typeof task<TArgs, TReturn>>;

export type TaskInstance<TReturn = undefined> = {
	error?: undefined | unknown;
	isCanceled: boolean;
	isError: boolean;
	isRunning: boolean;
	isSuccessful: boolean;
	value?: undefined | TReturn;
};

function _task<TArgs = unknown, TReturn = undefined>(
	gen_or_fun: (
		args: TArgs,
		utils: SheepdogUtils,
	) => Promise<TReturn> | AsyncGenerator<unknown, TReturn, unknown>,
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

	const updateResult = (
		instance: TaskInstance<TReturn> | undefined,
		new_instance: boolean = false,
	) => {
		return result.update((old) => {
			if (!instance) {
				return old;
			}
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
			old.isRunning = [...instances.values()].some((val) => val.isRunning);
			return old;
		});
	};

	const instances = new Map<string, TaskInstance<TReturn>>();

	const actual_task = createTask<TArgs, TReturn>(
		{
			onDestroy(fn) {
				onDestroy(fn);
			},
			onError(instance_id, error) {
				const instance = instances.get(instance_id);
				if (instance) {
					instance.error = error;
					instance.isRunning = false;
					instance.isError = true;
				}
				updateResult(instance);
			},
			onInstanceCancel(instance_id) {
				const instance = instances.get(instance_id);
				if (instance) {
					instance.isRunning = false;
					instance.isCanceled = true;
				}
				updateResult(instance);
			},
			onInstanceStart(instance_id) {
				const instance = {
					isRunning: true,
					isCanceled: false,
					isError: false,
					isSuccessful: false,
				};
				instances.set(instance_id, instance);
				updateResult(instance, true);
			},
			onInstanceComplete(instance_id, last_result) {
				const instance = instances.get(instance_id);
				if (instance) {
					instance.isRunning = false;
					instance.isSuccessful = true;
					instance.value = last_result;
				}
				updateResult(instance);
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
	) => ReturnType<typeof _task<TArgs, TReturn>>;
};

const to_assign: HandlersShorthands = {} as HandlersShorthands;

function is_key(handler: string): handler is HandlerType {
	return handler in handlers;
}

for (const handler in handlers) {
	if (is_key(handler)) {
		to_assign[handler] = (gen_or_fun, options) => {
			if (!is_key(handler)) {
				throw new Error('Impossible');
			}
			return _task(gen_or_fun, { ...(options ?? {}), kind: handler });
		};
	}
}

export const task = Object.assign(_task, to_assign);
