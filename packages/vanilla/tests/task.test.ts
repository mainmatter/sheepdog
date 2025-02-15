import { HandlersMap, HandlerType } from '@sheepdog/core';
import { describe, expect, it, vi } from 'vitest';
import { task as og_task, type SheepdogUtils, TaskInstance, timeout } from '../src/index';

function all_options(fn: (selector: 'default' | 'options') => void) {
	describe.each(['default', 'options'] as const)('version with %s', fn);
}

function assert_name(name: string | symbol): asserts name is keyof typeof og_task {
	if (!(name in og_task)) {
		throw new Error();
	}
}

function remove_on<T>(instance?: TaskInstance<T>) {
	if (instance) {
		const { error, value } = instance;
		return { error, value };
	}
}

type HandlersShorthands = {
	[K in HandlerType]: <TArgs = undefined, TReturn = unknown>(
		gen_or_fun: (
			args: TArgs,
			utils: SheepdogUtils,
		) => Promise<TReturn> | AsyncGenerator<unknown, TReturn, unknown>,
		options?: Parameters<HandlersMap[K]> extends [] ? object : Parameters<HandlersMap[K]>[0],
	) => ReturnType<typeof og_task<TArgs, TReturn>>;
};

const task = {
	default: {
		default: og_task,
		drop: og_task.drop,
		enqueue: og_task.enqueue,
		keepLatest: og_task.keepLatest,
		restart: og_task.restart,
	},
	options: {
		default: (...props: Parameters<(typeof og_task)['default']>) =>
			og_task(props[0], { kind: 'default' }),
		drop: (...props: Parameters<(typeof og_task)['drop']>) =>
			og_task(props[0], { kind: 'drop', ...props[1] }),
		enqueue: (...props: Parameters<(typeof og_task)['enqueue']>) =>
			og_task(props[0], { kind: 'enqueue', ...props[1] }),
		keepLatest: (...props: Parameters<(typeof og_task)['keepLatest']>) =>
			og_task(props[0], { kind: 'keepLatest', ...props[1] }),
		restart: (...props: Parameters<(typeof og_task)['restart']>) =>
			og_task(props[0], { kind: 'restart', ...props[1] }),
	} as HandlersShorthands,
};

describe.each([
	{
		name: 'default',
		perform_count: {
			expected: 5,
		},
		is_running: {
			wait_for: 3,
			wait_after: 5,
		},
	},
	{
		name: 'enqueue',
		perform_count: {
			expected: 5,
		},
		is_running: {
			wait_for: 3,
			wait_after: 5,
		},
	},
	{
		name: 'drop',
		perform_count: {
			expected: 1,
		},
		is_running: {
			wait_for: 0,
			wait_after: 1,
		},
	},
	{
		name: 'keepLatest',
		perform_count: {
			expected: 2,
		},
		is_running: {
			wait_for: 1,
			wait_after: 2,
		},
	},
	{
		name: 'restart',
		perform_count: {
			expected: 5,
		},
		is_running: {
			wait_for: 0,
			wait_after: 1,
		},
	},
])('task - basic functionality $name', ({ perform_count, is_running, name }) => {
	assert_name(name);
	all_options((selector) => {
		it('calls the function you pass in', async () => {
			const fn = vi.fn();
			const my_task = task[selector][name](fn);
			my_task.perform();
			await vi.waitFor(() => {
				expect(fn).toHaveBeenCalled();
			});
		});

		it("runs to completion if it's not cancelled", async () => {
			let count = 0;
			const wait_time = 50;
			async function* fn() {
				await timeout(wait_time);
				yield;
				count++;
			}
			const my_task = task[selector][name](fn);
			my_task.perform();
			await vi.waitFor(() => {
				expect(count).toBe(1);
			});
		});

		it('it can be rerun after being cancelled using `cancelAll`', async () => {
			vi.useFakeTimers();
			let count = 0;
			const wait_time = 50;
			let task_signal: AbortSignal;
			async function* fn(_: undefined, { signal }: SheepdogUtils) {
				task_signal = signal;
				await timeout(wait_time);
				yield;
				count++;
			}
			const my_task = task[selector][name](fn);
			async function perform() {
				try {
					await my_task.perform();
				} catch {
					/** empty */
				}
			}
			perform();
			await vi.advanceTimersByTimeAsync(20);
			my_task.cancelAll();
			await vi.waitFor(() => {
				expect(task_signal.aborted).toBeTruthy();
			});
			expect(count).toBe(0);
			perform();
			await vi.waitFor(() => {
				expect(count).toBe(1);
			});
			vi.useRealTimers();
		});

		it('it can be rerun after the last instance is cancelled', async () => {
			vi.useFakeTimers();
			let count = 0;
			const wait_time = 50;
			let task_signal: AbortSignal;
			async function* fn(_: undefined, { signal }: SheepdogUtils) {
				task_signal = signal;
				await timeout(wait_time);
				yield;
				count++;
			}
			const my_task = task[selector][name](fn);
			async function perform() {
				try {
					await my_task.perform();
				} catch {
					/** empty */
				}
			}
			perform();
			await vi.advanceTimersByTimeAsync(20);
			my_task.cancelAll();
			await vi.waitFor(() => {
				expect(task_signal.aborted).toBeTruthy();
			});
			expect(count).toBe(0);
			perform();
			await vi.waitFor(() => {
				expect(count).toBe(1);
			});
			vi.useRealTimers();
		});

		it("doesn't runs to completion if it's cancelled, the function is a generator and there's a yield after every await", async () => {
			vi.useFakeTimers();
			let count = 0;
			const wait_time = 50;
			let task_signal: AbortSignal;
			async function* fn(_: undefined, { signal }: SheepdogUtils) {
				task_signal = signal;
				await timeout(wait_time);
				yield;
				count++;
			}
			const my_task = task[selector][name](fn);
			async function perform() {
				try {
					await my_task.perform();
				} catch {
					/** empty */
				}
			}
			perform();
			await vi.advanceTimersByTimeAsync(20);
			my_task.cancelAll();
			await vi.waitFor(() => {
				expect(task_signal.aborted).toBeTruthy();
			});
			expect(count).toBe(0);
			vi.useRealTimers();
		});

		it("if awaited returns the value it's returned from the function", async () => {
			const returned_value = 42;
			const fn = async () => {
				return returned_value;
			};
			const my_task = task[selector][name](fn);
			expect(await my_task.perform()).toBe(returned_value);
		});

		it('passing a value to perform passes the same value as the first argument of the function', async () => {
			let passed_in_value = 0;
			const argument = 42;
			const fn = vi.fn(async (value) => {
				passed_in_value = value;
			}) as (value: number) => Promise<void>;
			const my_task = task[selector][name](fn);
			my_task.perform(argument);
			await vi.waitFor(() => {
				expect(fn).toHaveBeenCalled();
			});
			expect(passed_in_value).toBe(argument);
		});

		it('has the correct derived state for performCount', async () => {
			vi.useFakeTimers();
			const wait_time = 10;
			const fn = vi.fn(async () => {
				await timeout(wait_time);
			});
			const my_task = task[selector][name](fn);
			async function perform() {
				try {
					await my_task.perform();
				} catch {
					/** empty */
				}
			}
			perform();
			await Promise.resolve();
			perform();
			await Promise.resolve();
			perform();
			await Promise.resolve();
			perform();
			await Promise.resolve();
			perform();
			vi.advanceTimersByTime(wait_time);
			await vi.waitFor(() => {
				expect(fn).toHaveBeenCalledTimes(perform_count.expected);
			});
			expect(my_task.performCount).toBe(perform_count.expected);
		});

		it('has the correct derived state for isRunning', async () => {
			vi.useFakeTimers();
			let finished = 0;
			const fn = vi.fn(async function* () {
				await timeout(50);
				yield;
				finished++;
			});
			const my_task = task[selector][name](fn);
			async function perform() {
				try {
					await my_task.perform();
				} catch {
					/** empty */
				}
			}
			perform();
			await vi.advanceTimersByTimeAsync(10);
			perform();
			await vi.advanceTimersByTimeAsync(10);
			perform();
			await vi.advanceTimersByTimeAsync(10);
			perform();
			await vi.advanceTimersByTimeAsync(10);
			perform();
			await vi.waitFor(
				() => {
					expect(finished).toBe(is_running.wait_for);
				},
				{
					interval: 10,
				},
			);
			expect(my_task.isRunning).toBe(true);
			await vi.waitFor(() => {
				expect(finished).toBe(is_running.wait_after);
			});
			expect(my_task.isRunning).toBe(false);
			vi.useRealTimers();
		});

		it('has the correct derived state for last', async () => {
			let finished = false;
			const fn = vi.fn(async function* () {
				await timeout(50);
				yield;
				finished = true;
				return 42;
			});
			const my_task = task[selector][name](fn);
			async function perform() {
				try {
					await my_task.perform();
				} catch {
					/** empty */
				}
			}
			perform();
			await vi.waitFor(() => expect(fn).toHaveBeenCalled());
			expect(remove_on(my_task.last)).toStrictEqual({
				error: undefined,
				value: undefined,
			});
			await vi.waitFor(() => expect(finished).toBeTruthy());
			expect(remove_on(my_task.last)).toStrictEqual({
				value: 42,
				error: undefined,
			});
		});

		it('has the correct derived state for lastRunning', async () => {
			let finished = false;
			const fn = vi.fn(async function* () {
				await timeout(50);
				yield;
				finished = true;
				return 42;
			});
			const my_task = task[selector][name](fn);
			async function perform() {
				try {
					await my_task.perform();
				} catch {
					/** empty */
				}
			}
			perform();
			await vi.waitFor(() => expect(fn).toHaveBeenCalled());

			expect(remove_on(my_task.lastRunning)).toStrictEqual({
				error: undefined,
				value: undefined,
			});
			await vi.waitFor(() => expect(finished).toBeTruthy());
			expect(my_task.lastRunning).toBeUndefined();
		});

		it('has the correct derived state for lastCanceled', async () => {
			let finished = false;
			const fn = vi.fn(async function* () {
				await timeout(50);
				yield;
				finished = true;
				return 42;
			});
			const my_task = task[selector][name](fn);
			function perform() {
				const instance = my_task.perform();
				instance.catch(() => {});
				return instance;
			}
			perform();
			await vi.waitFor(() => expect(fn).toHaveBeenCalled());
			expect(my_task.lastCanceled).toBeUndefined();
			await vi.waitFor(() => expect(finished).toBeTruthy());
			expect(my_task.lastCanceled).toBeUndefined();
			finished = false;
			const last_instance = perform();
			await vi.waitFor(() => expect(fn).toHaveBeenCalledTimes(2));
			last_instance.cancel();
			expect(remove_on(my_task.lastCanceled)).toStrictEqual({
				error: undefined,
				value: undefined,
			});
		});

		it('has the correct derived state for lastErrored', async () => {
			let finished = false;
			let error: Error | undefined = undefined;
			const fn = vi.fn(async () => {
				await timeout(50);
				finished = true;
				if (error) {
					throw error;
				}
			});
			const my_task = task[selector][name](fn);
			let thrown = false;
			async function perform() {
				try {
					await my_task.perform();
				} catch (e) {
					if (e === error) {
						thrown = true;
					}
				}
			}
			perform();
			await vi.waitFor(() => expect(fn).toHaveBeenCalled());
			expect(my_task.lastErrored).toBeUndefined();
			await vi.waitFor(() => expect(finished).toBeTruthy());
			expect(my_task.lastErrored).toBeUndefined();
			finished = false;
			error = new Error();
			perform();
			await vi.waitFor(() => expect(fn).toHaveBeenCalledTimes(2));
			await vi.waitFor(() => expect(thrown).toBeTruthy());
			expect(remove_on(my_task.lastErrored)).toStrictEqual({
				error,
				value: undefined,
			});
		});

		it('has the correct derived state for lastSuccessful', async () => {
			let finished = false;
			let error: Error | undefined = new Error();
			const fn = vi.fn(async () => {
				await timeout(50);
				if (error) {
					throw error;
				}
				try {
					return 42;
				} finally {
					finished = true;
				}
			});
			const my_task = task[selector][name](fn);
			let thrown = false;
			async function perform() {
				try {
					await my_task.perform();
				} catch (e) {
					if (e === error) {
						thrown = true;
					}
				}
			}
			perform();
			await vi.waitFor(() => expect(fn).toHaveBeenCalled());
			expect(my_task.lastSuccessful).toBeUndefined();
			await vi.waitFor(() => expect(thrown).toBeTruthy());
			expect(my_task.lastSuccessful).toBeUndefined();
			finished = false;
			error = undefined;
			perform();
			await vi.waitFor(() => expect(fn).toHaveBeenCalledTimes(2));
			await vi.waitFor(() => expect(finished).toBeTruthy());
			expect(remove_on(my_task.lastSuccessful)).toStrictEqual({
				error: undefined,
				value: 42,
			});
		});
		it('re-throws any error thrown in the perform function and has the error in the error field of the store', async () => {
			const to_throw = new Error('my error');
			const fn = vi.fn(async () => {
				throw to_throw;
			});
			const my_task = task[selector][name](fn);
			let thrown: Error | undefined;
			async function perform() {
				try {
					await my_task.perform();
				} catch (e) {
					thrown = e as Error;
				}
			}
			perform();
			await vi.waitFor(() => {
				expect(thrown).toBeDefined();
			});
			expect(thrown).toBe(to_throw);
			expect(my_task.last?.error).toBe(to_throw);
		});
	});
});

describe('task - error if wrong kind', () => {
	it('throws if you try to instantiate a task with the wrong kind', () => {
		expect(() => {
			// @ts-expect-error need to check runtime error
			og_task(() => {}, { kind: 'something else' });
		}).toThrowErrorMatchingInlineSnapshot(`[Error: Unexpected kind 'something else']`);
	});
});

describe("task - specific functionality 'default'", () => {
	all_options((selector) => {
		it('runs multiple time if performed multiple time', async () => {
			const fn = vi.fn();
			const my_task = task[selector].default(fn);
			my_task.perform();
			my_task.perform();
			my_task.perform();
			await vi.waitFor(() => {
				expect(fn).toHaveBeenCalledTimes(3);
			});
		});

		it('passing a value to perform passes the same value as the first argument of the function', async () => {
			let passed_in_value: number | undefined;
			const argument = 42;
			const my_task = task[selector].default(async (value: number) => {
				passed_in_value = value;
			});

			my_task.perform(argument);
			await vi.waitFor(() => {
				expect(passed_in_value).toBeDefined();
			});
			expect(passed_in_value).toBe(argument);
		});

		it("cancel the last instance if you call cancel on the returned instance, the function is a generator and there's a yield after every await", async () => {
			vi.useFakeTimers();
			let count = 0;
			const wait_time = 50;
			const task_signals: AbortSignal[] = [];
			async function* fn(_: undefined, { signal }: SheepdogUtils) {
				task_signals.push(signal);
				await timeout(wait_time);
				yield;
				count++;
			}
			const my_task = task[selector].default(fn);
			function perform() {
				const instance = my_task.perform();
				instance.catch(() => {});
				return instance;
			}
			perform();
			perform();
			const last = perform();
			await vi.waitFor(() => {
				expect(task_signals.length).toBe(3);
			});
			last.cancel();
			await vi.waitFor(() => {
				expect(task_signals[2].aborted).toBeTruthy();
			});
			await vi.advanceTimersByTimeAsync(wait_time);
			expect(count).toBe(2);
			vi.useRealTimers();
		});
	});
});

describe("task - specific functionality 'enqueue'", () => {
	all_options((selector) => {
		it('runs multiple time if performed multiple time but only `max` at a time', async () => {
			let concurrent = 0;
			let max_concurrent = -Infinity;
			const fn = vi.fn(async () => {
				concurrent++;
				max_concurrent = Math.max(max_concurrent, concurrent);
				await timeout(50);
				concurrent--;
			});
			const my_task = task[selector].enqueue(fn);
			my_task.perform();
			my_task.perform();
			my_task.perform();
			await vi.waitFor(() => {
				expect(fn).toHaveBeenCalledTimes(3);
			});
			expect(max_concurrent).toBe(1);
		});

		it("doesn't run if it is cancelled before starting (async generator)", async () => {
			const wait_time = 50;
			const fn = vi.fn(async function* () {
				await timeout(wait_time);
				yield;
			});
			const my_task = task[selector].enqueue(fn);
			async function perform() {
				try {
					await my_task.perform();
				} catch {
					/**empty */
				}
			}
			perform();
			await Promise.resolve();
			perform();
			await Promise.resolve();
			my_task.cancelAll();
			expect(fn).toHaveBeenCalledTimes(1);
		});

		it("doesn't run if it is cancelled before starting  (async function)", async () => {
			const wait_time = 50;
			const fn = vi.fn(async () => {
				await timeout(wait_time);
			});
			const my_task = task[selector].enqueue(fn);
			async function perform() {
				try {
					await my_task.perform();
				} catch {
					/**empty */
				}
			}
			perform();
			await Promise.resolve();
			perform();
			await Promise.resolve();
			my_task.cancelAll();
			expect(fn).toHaveBeenCalledTimes(1);
		});

		it('runs multiple time if performed multiple time but only `max` at a time (max: 3)', async () => {
			let concurrent = 0;
			let max_concurrent = -Infinity;
			const fn = vi.fn(async () => {
				concurrent++;
				max_concurrent = Math.max(max_concurrent, concurrent);
				await timeout(50);
				concurrent--;
			});
			const my_task = task[selector].enqueue(fn, { max: 3 });

			my_task.perform();
			my_task.perform();
			my_task.perform();
			my_task.perform();
			my_task.perform();
			await vi.waitFor(() => {
				expect(fn).toHaveBeenCalledTimes(5);
			});
			expect(max_concurrent).toBe(3);
		});

		it("cancel the last instance if you call cancel on the returned instance, the function is a generator and there's a yield after every await", async () => {
			vi.useFakeTimers();
			let count = 0;
			const wait_time = 50;
			const task_signals: AbortSignal[] = [];
			async function* fn(_: undefined, { signal }: SheepdogUtils) {
				task_signals.push(signal);
				await timeout(wait_time);
				yield;
				count++;
			}
			const my_task = task[selector].enqueue(fn);
			function perform() {
				const instance = my_task.perform();
				instance.catch(() => {});
				return instance;
			}
			perform();
			perform();
			const last = perform();
			await vi.waitFor(() => {
				expect(task_signals.length).toBe(3);
			});

			last.cancel();
			await vi.waitFor(() => {
				expect(task_signals[2].aborted).toBeTruthy();
			});
			await vi.advanceTimersByTimeAsync(wait_time);
			expect(count).toBe(2);
			vi.useRealTimers();
		});
	});
});

describe("task - specific functionality 'drop'", () => {
	all_options((selector) => {
		it('runs only `max` time if performed when other instances are already running', async () => {
			let concurrent = 0;
			let max_concurrent = -Infinity;
			const fn = vi.fn(async () => {
				concurrent++;
				max_concurrent = Math.max(max_concurrent, concurrent);
				await timeout(50);
				concurrent--;
			});
			const my_task = task[selector].drop(fn);
			async function perform() {
				try {
					await my_task.perform();
				} catch {
					/**empty */
				}
			}
			perform();
			perform();
			perform();
			await vi.waitFor(() => {
				expect(fn).toHaveBeenCalledTimes(1);
			});
			expect(max_concurrent).toBe(1);
			await vi.waitFor(() => {
				expect(concurrent).toBe(0);
			});
			expect(fn).toHaveBeenCalledTimes(1);
			perform();
			await vi.waitFor(() => {
				expect(fn).toHaveBeenCalledTimes(2);
			});
		});

		it("doesn't run if it is cancelled before starting (async generator)", async () => {
			const wait_time = 50;
			const fn = vi.fn(async function* () {
				await timeout(wait_time);
				yield;
			});
			const my_task = task[selector].drop(fn);
			async function perform() {
				try {
					await my_task.perform();
				} catch {
					/**empty */
				}
			}
			perform();
			await Promise.resolve();
			perform();
			await Promise.resolve();
			my_task.cancelAll();
			expect(fn).toHaveBeenCalledTimes(1);
		});

		it("doesn't run if it is cancelled before starting  (async function)", async () => {
			const wait_time = 50;
			const fn = vi.fn(async () => {
				await timeout(wait_time);
			});
			const my_task = task[selector].drop(fn);
			async function perform() {
				try {
					await my_task.perform();
				} catch {
					/**empty */
				}
			}
			perform();
			await Promise.resolve();
			perform();
			await Promise.resolve();
			my_task.cancelAll();
			expect(fn).toHaveBeenCalledTimes(1);
		});

		it('runs only `max` time if performed when other instances are already running (max: 3)', async () => {
			let concurrent = 0;
			let max_concurrent = -Infinity;
			const fn = vi.fn(async () => {
				concurrent++;
				max_concurrent = Math.max(max_concurrent, concurrent);
				await timeout(50);
				concurrent--;
			});
			const my_task = task[selector].drop(fn, { max: 3 });
			async function perform() {
				try {
					await my_task.perform();
				} catch {
					/**empty */
				}
			}
			perform();
			perform();
			perform();
			await vi.waitFor(() => {
				expect(fn).toHaveBeenCalledTimes(3);
			});
			expect(max_concurrent).toBe(3);
			await vi.waitFor(() => {
				expect(concurrent).toBe(0);
			});
			perform();
			await vi.waitFor(() => {
				expect(fn).toHaveBeenCalledTimes(4);
			});
		});
	});
});

describe("task - specific functionality 'keepLatest'", () => {
	all_options((selector) => {
		it('completes only `max` + 1 times if performed when other instances are already running', async () => {
			let finished = 0;
			const fn = vi.fn(async function* () {
				await timeout(50);
				yield;
				finished++;
			});
			const my_task = task[selector].keepLatest(fn);
			async function perform() {
				try {
					await my_task.perform();
				} catch {
					/**empty */
				}
			}
			perform();
			perform();
			perform();
			perform();
			await vi.waitFor(() => {
				expect(fn).toHaveBeenCalledTimes(2);
			});
			await vi.waitFor(() => {
				expect(finished).toBe(2);
			});
			perform();
			await vi.waitFor(() => {
				expect(finished).toBe(3);
			});
		});

		it("doesn't run if it is cancelled before starting (async generator)", async () => {
			const wait_time = 50;
			const fn = vi.fn(async function* () {
				await timeout(wait_time);
				yield;
			});
			const my_task = task[selector].keepLatest(fn);
			async function perform() {
				try {
					await my_task.perform();
				} catch {
					/**empty */
				}
			}
			perform();
			await Promise.resolve();
			perform();
			await Promise.resolve();
			my_task.cancelAll();
			expect(fn).toHaveBeenCalledTimes(1);
		});

		it("doesn't run if it is cancelled before starting  (async function)", async () => {
			const wait_time = 50;
			const fn = vi.fn(async () => {
				await timeout(wait_time);
			});
			const my_task = task[selector].keepLatest(fn);
			async function perform() {
				try {
					await my_task.perform();
				} catch {
					/**empty */
				}
			}
			perform();
			await Promise.resolve();
			perform();
			await Promise.resolve();
			my_task.cancelAll();
			expect(fn).toHaveBeenCalledTimes(1);
		});

		it('completes only `max` + 1 times if performed when other instances are already running (max: 3)', async () => {
			let finished = 0;
			const fn = vi.fn(async function* () {
				await timeout(50);
				yield;
				finished++;
			});
			const my_task = task[selector].keepLatest(fn, { max: 3 });
			async function perform() {
				try {
					await my_task.perform();
				} catch {
					/**empty */
				}
			}
			perform();
			perform();
			perform();
			perform();
			perform();
			perform();
			await vi.waitFor(() => {
				expect(fn).toHaveBeenCalledTimes(4);
			});
			await vi.waitFor(() => {
				expect(finished).toBe(4);
			});
			perform();
			await vi.waitFor(() => {
				expect(finished).toBe(4);
			});
		});
	});
});

describe("task - specific functionality 'restart'", () => {
	all_options((selector) => {
		it('completes only `max` time if performed when other instances are already running', async () => {
			let finished = 0;
			const abort_signals: AbortSignal[] = [];
			const fn = vi.fn(async function* (_: undefined, { signal }: SheepdogUtils) {
				abort_signals.push(signal);
				await timeout(50);
				yield;
				finished++;
			});
			const my_task = task[selector].restart(fn);
			async function perform() {
				try {
					await my_task.perform();
				} catch {
					/**empty */
				}
			}
			perform();
			await Promise.resolve();
			perform();
			await Promise.resolve();
			perform();
			await Promise.resolve();
			await vi.waitFor(() => {
				expect(fn).toHaveBeenCalledTimes(3);
			});
			await vi.waitFor(() => {
				expect(finished).toBe(1);
			});
			expect(abort_signals.map((signal) => signal.aborted)).toStrictEqual([true, true, false]);
			perform();
			await vi.waitFor(() => {
				expect(finished).toBe(2);
			});
			expect(abort_signals.at(-1)?.aborted).toBe(false);
		});

		it('completes only `max` time if performed when other instances are already running (max: 3)', async () => {
			let finished = 0;
			const abort_signals: AbortSignal[] = [];
			const fn = vi.fn(async function* (_: undefined, { signal }: SheepdogUtils) {
				abort_signals.push(signal);
				await timeout(50);
				yield;
				finished++;
			});
			const my_task = task[selector].restart(fn, { max: 3 });
			async function perform() {
				try {
					await my_task.perform();
				} catch {
					/**empty */
				}
			}
			perform();
			await Promise.resolve();
			perform();
			await Promise.resolve();
			perform();
			await Promise.resolve();
			perform();
			await vi.waitFor(() => {
				expect(abort_signals[0]?.aborted).toBe(true);
			});
			perform();
			await vi.waitFor(() => {
				expect(fn).toHaveBeenCalledTimes(5);
			});
			await vi.waitFor(() => {
				expect(finished).toBe(3);
			});
			expect(abort_signals.map((signal) => signal.aborted)).toStrictEqual([
				true,
				true,
				false,
				false,
				false,
			]);
			perform();
			await vi.waitFor(() => {
				expect(finished).toBe(4);
			});
			expect(abort_signals.at(-1)?.aborted).toBe(false);
		});
	});
});

describe('link - invoke a task inside a task and cancel the instance if parent is cancelled', () => {
	all_options((selector) => {
		it('cancel the linked parent task if the child is cancelled with cancelAll', async () => {
			let cancelled = true;
			let finish_waiting = false;
			const fn = vi.fn(async function* () {
				await timeout(50);
				finish_waiting = true;
				yield;
				cancelled = false;
			});

			const my_task = task[selector].default(fn);
			const child_task = task[selector].default(async (_: undefined, { link }) => {
				try {
					await link(my_task).perform();
				} catch {
					/** empty */
				}
			});
			async function perform() {
				try {
					await child_task.perform();
				} catch {
					/**empty */
				}
			}
			perform();
			await vi.waitFor(() => {
				expect(fn).toHaveBeenCalled();
			});
			child_task.cancelAll();
			await vi.waitFor(() => {
				expect(finish_waiting).toBeTruthy();
			});
			expect(cancelled).toBeTruthy();
		});

		it('cancel the linked parent task if the child is cancelled with cancel', async () => {
			let cancelled = true;
			let finish_waiting = false;
			const fn = vi.fn(async function* () {
				await timeout(50);
				finish_waiting = true;
				yield;
				cancelled = false;
			});

			const my_task = task[selector].default(fn);
			const child_task = task[selector].default(async (_: undefined, { link }) => {
				try {
					await link(my_task).perform();
				} catch {
					/** empty */
				}
			});
			function perform() {
				const instance = child_task.perform();
				instance.catch(() => {});
				return instance;
			}
			const last = perform();
			await vi.waitFor(() => {
				expect(fn).toHaveBeenCalled();
			});
			last.cancel();
			await vi.waitFor(() => {
				expect(finish_waiting).toBeTruthy();
			});
			expect(cancelled).toBeTruthy();
		});

		it("doesn't cancel the other instance of the linked parent task if the child is cancelled with cancel", async () => {
			const cancelled = [true, true];
			const finish_waiting = [false, false];
			let instance = 0;
			const fn = vi.fn(async function* () {
				const current_instance = instance++;
				await timeout(50);
				finish_waiting[current_instance] = true;
				yield;
				cancelled[current_instance] = false;
			});

			const my_task = task[selector].default(fn);
			const child_task = task[selector].default(async (_: undefined, { link }) => {
				try {
					await link(my_task).perform();
				} catch {
					/** empty */
				}
			});
			function perform() {
				const instance = child_task.perform();
				instance.catch(() => {});
				return instance;
			}
			perform();
			const last = perform();
			await vi.waitFor(() => {
				expect(fn).toHaveBeenCalledTimes(2);
			});
			last.cancel();
			await vi.waitFor(() => {
				expect(finish_waiting[0]).toBeTruthy();
				expect(finish_waiting[1]).toBeTruthy();
			});
			expect(cancelled[0]).toBeFalsy();
			expect(cancelled[1]).toBeTruthy();
		});
	});
});
