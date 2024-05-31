import { onDestroy } from 'svelte';
import { createTask, handlers } from './core';
import { writable } from 'svelte/store';
import type { SvelteConcurrencyUtils, TaskOptions, HandlerType, HandlersMap } from './core';
export type { SvelteConcurrencyUtils, TaskOptions };

export type Task<TArgs = unknown, TReturn = unknown> = ReturnType<typeof task<TArgs, TReturn>>;

export function _task<TArgs = unknown, TReturn = undefined>(
	gen_or_fun: (
		args: TArgs,
		utils: SvelteConcurrencyUtils,
	) => Promise<TReturn> | AsyncGenerator<unknown, TReturn, unknown>,
	options?: TaskOptions,
) {
	const results: TReturn[] = [];

	const { subscribe, ...result } = writable({
		isRunning: false,
		lastSuccessful: undefined as undefined | TReturn,
		error: undefined as undefined | unknown,
		results,
		performCount: 0,
	});

	const instances = new Map<string, { is_running: boolean }>();

	const actual_task = createTask<TArgs, TReturn>(
		{
			onDestroy(fn) {
				onDestroy(fn);
			},
			onError(instance_id, error) {
				const instance = instances.get(instance_id);
				if (instance) instance.is_running = false;
				result.update((old) => {
					old.error = error;
					old.isRunning = [...instances.values()].some((val) => val.is_running);
					return old;
				});
			},
			onInstanceCancel(instance_id) {
				const instance = instances.get(instance_id);
				if (instance) instance.is_running = false;
				result.update((old) => {
					old.isRunning = [...instances.values()].some((val) => val.is_running);
					return old;
				});
			},
			onInstanceStart(instance_id) {
				instances.set(instance_id, { is_running: true });
				result.update((old) => {
					old.isRunning = [...instances.values()].some((val) => val.is_running);
					old.performCount++;
					return old;
				});
			},
			onInstanceComplete(instance_id, last_result) {
				results.push(last_result);
				const instance = instances.get(instance_id);
				if (instance) instance.is_running = false;
				result.update((old) => {
					old.error = undefined;
					old.isRunning = [...instances.values()].some((val) => val.is_running);
					old.lastSuccessful = last_result;
					return old;
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
			utils: SvelteConcurrencyUtils,
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
