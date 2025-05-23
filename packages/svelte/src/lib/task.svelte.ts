import type {
	HandlerType,
	HandlersMap,
	SheepdogUtils,
	TaskFunction,
	TaskOptions,
} from '@sheepdog/core';
import { CancelationError, createTask, handlers } from '@sheepdog/core';
import { onDestroy } from 'svelte';
export type { SheepdogUtils, TaskOptions };

export { CancelationError };

export type Task<TArgs = unknown, TReturn = unknown> = ReturnType<typeof task<TArgs, TReturn>>;

export class TaskInstance<TReturn = undefined> {
	error?: unknown = $state.raw(undefined);
	hasStarted = $state.raw(false);
	isCanceled = $state.raw(false);
	isError = $state.raw(false);
	isFinished = $state.raw(false);
	isRunning = $state.raw(false);
	isSuccessful = $state.raw(false);
	value?: TReturn = $state.raw(undefined);

	toJSON() {
		return {
			error: this.error,
			hasStarted: this.hasStarted,
			isCanceled: this.isCanceled,
			isError: this.isError,
			isFinished: this.isFinished,
			isRunning: this.isRunning,
			isSuccessful: this.isSuccessful,
			value: this.value,
		};
	}
}

class TaskState<TReturn> {
	isRunning = $state.raw(false);
	last: undefined | TaskInstance<TReturn> = $state.raw(undefined);
	lastCanceled: undefined | TaskInstance<TReturn> = $state.raw(undefined);
	lastErrored: undefined | TaskInstance<TReturn> = $state.raw(undefined);
	lastRunning: undefined | TaskInstance<TReturn> = $state.raw(undefined);
	lastSuccessful: undefined | TaskInstance<TReturn> = $state.raw(undefined);
	performCount = $state.raw(0);

	toJSON() {
		return {
			isRunning: this.isRunning,
			last: this.last,
			lastCanceled: this.lastCanceled,
			lastErrored: this.lastErrored,
			lastRunning: this.lastRunning,
			lastSuccessful: this.lastSuccessful,
			performCount: this.performCount,
		};
	}
}

const task = /*#__PURE__*/ (() => {
	function _task<TArgs = unknown, TReturn = undefined>(
		gen_or_fun: TaskFunction<TArgs, TReturn>,
		options?: TaskOptions,
	) {
		const task_result = new TaskState<TReturn>();

		const updateResult = (instance: TaskInstance<TReturn>, new_instance: boolean = false) => {
			task_result;
			if (new_instance) {
				task_result.performCount++;
			}
			const { isSuccessful, isError, isCanceled, isRunning } = instance;
			if (isCanceled) {
				task_result.lastCanceled = instance;
			}
			if (isError) {
				task_result.lastErrored = instance;
			}
			if (isSuccessful) {
				task_result.lastSuccessful = instance;
			}
			if (isRunning) {
				task_result.lastRunning = instance;
			} else if (task_result.lastRunning === instance) {
				task_result.lastRunning = undefined;
			}
			task_result.last = instance;
			task_result.isRunning = [...instances.values()].some((val) => val.isRunning);
			return task_result;
		};

		const instances = new Map<string, TaskInstance<TReturn>>();

		const actual_task = createTask<TArgs, TReturn, TaskInstance<TReturn>>(
			{
				onDestroy(fn) {
					onDestroy(fn);
				},
				onError(instance_id, error) {
					const instance = instances.get(instance_id);
					if (instance) {
						instance.error = error;
						instance.isError = true;
						instance.isFinished = true;
						instance.isRunning = false;
						// we delete after a microtask to avoid returnModifier
						// not founding the instance in case of a syncronous
						// cancellation (for example with drop)
						queueMicrotask(() => {
							instances.delete(instance_id);
						});
						updateResult(instance);
					}
				},
				onInstanceCancel(instance_id) {
					const instance = instances.get(instance_id);
					if (instance) {
						instance.isCanceled = true;
						instance.isFinished = true;
						instance.isRunning = false;
						// we delete after a microtask to avoid returnModifier
						// not founding the instance in case of a syncronous
						// cancellation (for example with drop)
						queueMicrotask(() => {
							instances.delete(instance_id);
						});
						updateResult(instance);
					}
				},
				onInstanceCreate(instance_id) {
					const instance = new TaskInstance<TReturn>();
					instances.set(instance_id, instance);
					updateResult(instance);
				},
				onInstanceStart(instance_id) {
					const instance = instances.get(instance_id);
					if (instance) {
						instance.hasStarted = true;
						instance.isRunning = true;
						updateResult(instance, true);
					}
				},
				onInstanceComplete(instance_id, last_result) {
					const instance = instances.get(instance_id);
					if (instance) {
						instance.isFinished = true;
						instance.isRunning = false;
						instance.isSuccessful = true;
						instance.value = last_result;
						// we delete after a microtask to avoid returnModifier
						// not founding the instance in case of a synchronous
						// cancellation (for example with drop)
						queueMicrotask(() => {
							instances.delete(instance_id);
						});
						updateResult(instance);
					}
				},
				returnModifier(instance_id, returned_value) {
					const instance = instances.get(instance_id);
					if (!instance)
						throw new Error('Return modifier has been called before the instance was created');
					return Object.assign(instance, {
						...returned_value,
						// we need to transfer the promise methods to the instance
						// while keeping them bound to the original promise
						then: returned_value.then.bind(returned_value),
						catch: returned_value.catch.bind(returned_value),
						finally: returned_value.finally.bind(returned_value),
					});
				},
			},
			gen_or_fun,
			options,
		);

		return Object.assign(task_result, actual_task);
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

	return task;
})();

export { task };
