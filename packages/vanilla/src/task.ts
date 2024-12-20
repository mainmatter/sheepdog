import type {
	HandlerType,
	HandlersMap,
	SheepdogUtils,
	TaskOptions,
	TaskFunction,
} from '@sheepdog/core';
import { CancelationError, createTask, handlers } from '@sheepdog/core';
export type { SheepdogUtils, TaskOptions };

export { CancelationError };

export type Task<TArgs = unknown, TReturn = unknown> = ReturnType<typeof task<TArgs, TReturn>>;

type InstanceEvents = 'error' | 'finish' | 'cancel' | 'start' | 'success';
type Events = 'start' | 'finish' | 'instance-create' | `instance-${InstanceEvents}`;

class SheepdogEvent extends CustomEvent<unknown> {
	constructor(name: Events) {
		super(name);
	}
}

class SheepdogInstanceEvent extends CustomEvent<unknown> {
	constructor(name: InstanceEvents) {
		super(name);
	}
}

type MappedInstance<TReturn> = {
	event_target: EventTarget;
	is_running: boolean;
	instance: TaskInstance<TReturn>;
	offs: Set<() => void>;
};

export type TaskInstance<TReturn = undefined> = {
	error?: unknown;
	value?: TReturn;
	on: (event: InstanceEvents, cb: () => void, options?: AddEventListenerOptions) => void;
};

function define_properties<TOn, TFrom>(on: TOn, from: TFrom): asserts on is TOn & Readonly<TFrom> {
	for (const key in from) {
		Object.defineProperty(on, key, {
			enumerable: true,
			get() {
				return from[key as never];
			},
		});
	}
}

function _task<TArgs = unknown, TReturn = undefined>(
	gen_or_fun: TaskFunction<TArgs, TReturn>,
	options?: TaskOptions,
) {
	const event_target = new EventTarget();

	const task_instance = {
		isRunning: false,
		last: undefined as undefined | TaskInstance<TReturn>,
		lastCanceled: undefined as undefined | TaskInstance<TReturn>,
		lastErrored: undefined as undefined | TaskInstance<TReturn>,
		lastRunning: undefined as undefined | TaskInstance<TReturn>,
		lastSuccessful: undefined as undefined | TaskInstance<TReturn>,
		performCount: 0,
		on(event: Events, cb: () => void, options?: AddEventListenerOptions) {
			event_target.addEventListener(event, cb, options);
			return () => {
				event_target.removeEventListener(event, cb, options);
			};
		},
		destroy() {},
	};

	function update_is_running() {
		task_instance.isRunning = [...instances.values()].some((val) => val.is_running);
	}

	const instances = new Map<string, MappedInstance<TReturn>>();

	const actual_task = createTask<TArgs, TReturn, TaskInstance<TReturn>>(
		{
			onDestroy(fn) {
				task_instance.destroy = fn;
			},
			onError(instance_id, error) {
				const instance = instances.get(instance_id);
				if (instance) {
					task_instance.lastErrored = instance.instance;
					instance.instance.error = error;
					instance.is_running = false;
					update_is_running();
					instance.event_target.dispatchEvent(new SheepdogInstanceEvent('error'));
					instance.event_target.dispatchEvent(new SheepdogInstanceEvent('finish'));
					// we delete after a microtask to avoid returnModifier
					// not founding the instance in case of a syncronous
					// cancellation (for example with drop)
					queueMicrotask(() => {
						instances.delete(instance_id);
						for (const off of instance.offs) {
							off();
						}
					});
				}
				if (![...instances.values()].some((instance) => instance.is_running)) {
					event_target.dispatchEvent(new SheepdogEvent('finish'));
				}
				event_target.dispatchEvent(new SheepdogEvent('instance-error'));
				event_target.dispatchEvent(new SheepdogEvent('instance-finish'));
			},
			onInstanceCancel(instance_id) {
				const instance = instances.get(instance_id);
				if (instance) {
					instance.is_running = false;
					update_is_running();
					instance.event_target.dispatchEvent(new SheepdogInstanceEvent('cancel'));
					instance.event_target.dispatchEvent(new SheepdogInstanceEvent('finish'));
					// we delete after a microtask to avoid returnModifier
					// not founding the instance in case of a syncronous
					// cancellation (for example with drop)
					queueMicrotask(() => {
						instances.delete(instance_id);
						for (const off of instance.offs) {
							off();
						}
					});
				}
				if (![...instances.values()].some((instance) => instance.is_running)) {
					event_target.dispatchEvent(new SheepdogEvent('finish'));
				}
				event_target.dispatchEvent(new SheepdogEvent('instance-cancel'));
				event_target.dispatchEvent(new SheepdogEvent('instance-finish'));
			},
			onInstanceCreate(instance_id) {
				const instance_event_target = new EventTarget();
				const offs = new Set<() => void>();
				const instance: MappedInstance<TReturn> = {
					event_target: instance_event_target,
					offs,
					instance: {
						on(event, cb, options) {
							instance_event_target.addEventListener(event, cb, options);
							function off() {
								instance_event_target.removeEventListener(event, cb, options);
							}
							offs.add(off);
							return off;
						},
						error: undefined,
						value: undefined,
					},
					is_running: false,
				};
				task_instance.last = instance.instance;
				if (instances.size === 0) {
					event_target.dispatchEvent(new SheepdogEvent('start'));
				}
				instances.set(instance_id, instance);
				event_target.dispatchEvent(new SheepdogEvent('instance-create'));
			},
			onInstanceStart(instance_id) {
				const instance = instances.get(instance_id);
				if (instance) {
					instance.event_target.dispatchEvent(new SheepdogInstanceEvent('start'));
					instance.is_running = true;
					update_is_running();
				}
				task_instance.performCount++;
				event_target.dispatchEvent(new SheepdogEvent('instance-start'));
			},
			onInstanceComplete(instance_id, last_result) {
				const instance = instances.get(instance_id);
				if (instance) {
					instance.instance.value = last_result;
					instance.is_running = false;
					update_is_running();
					instance.event_target.dispatchEvent(new SheepdogInstanceEvent('success'));
					instance.event_target.dispatchEvent(new SheepdogInstanceEvent('finish'));
					// we delete after a microtask to avoid returnModifier
					// not founding the instance in case of a synchronous
					// cancellation (for example with drop)
					queueMicrotask(() => {
						instances.delete(instance_id);
						for (const off of instance.offs) {
							off();
						}
					});
				}
				if (![...instances.values()].some((instance) => instance.is_running)) {
					event_target.dispatchEvent(new SheepdogEvent('finish'));
				}
				event_target.dispatchEvent(new SheepdogEvent('instance-success'));
				event_target.dispatchEvent(new SheepdogEvent('instance-finish'));
			},
			returnModifier(instance_id, returned_value) {
				const instance = instances.get(instance_id);
				if (!instance)
					throw new Error('Return modifier has been called before the instance was created');
				define_properties(returned_value, instance.instance);
				return returned_value;
			},
		},
		gen_or_fun,
		options,
	);
	define_properties(actual_task, task_instance);
	return actual_task;
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
