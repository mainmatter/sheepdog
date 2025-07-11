/**
 * @vitest-environment happy-dom
 */
import { render } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';
import { type SheepdogUtils, type Task, timeout } from '../index';
import Default from './components/default.svelte';
import Drop from './components/drop.svelte';
import Enqueue from './components/enqueue.svelte';
import KeepLatest from './components/keep_latest.svelte';
import Link from './components/link/parent.svelte';
import Restart from './components/restart.svelte';
import WrongKind from './components/wrong-kind.svelte';

function all_options(fn: (selector: string) => void) {
	describe.each(['default', 'options'])('version with %s', fn);
}

describe.each([
	{
		component: Default,
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
		component: Enqueue,
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
		component: Drop,
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
		component: KeepLatest,
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
		component: Restart,
		name: 'restart',
		perform_count: {
			expected: 5,
		},
		is_running: {
			wait_for: 0,
			wait_after: 1,
		},
	},
])('task - basic functionality $name', ({ component, perform_count, is_running }) => {
	all_options((selector) => {
		it('calls the function you pass in', async () => {
			const fn = vi.fn();
			const { getByTestId } = render(component, {
				fn,
			});
			const perform = getByTestId(`perform-${selector}`);
			perform.click();
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
			const { getByTestId } = render(component, {
				fn,
			});
			const perform = getByTestId(`perform-${selector}`);
			perform.click();
			await vi.waitFor(() => {
				expect(count).toBe(1);
			});
		});

		it('it can be rerun after being cancelled using `cancelAll`', async () => {
			vi.useFakeTimers();
			let count = 0;
			const wait_time = 50;
			let task_signal: AbortSignal;
			async function* fn(_: number, { signal }: SheepdogUtils) {
				task_signal = signal;
				await timeout(wait_time);
				yield;
				count++;
			}
			const { getByTestId } = render(component, {
				fn,
			});
			const perform = getByTestId(`perform-${selector}`);
			const cancel = getByTestId(`cancel-${selector}`);
			perform.click();
			await vi.advanceTimersByTimeAsync(20);
			cancel.click();
			await vi.waitFor(() => {
				expect(task_signal.aborted).toBeTruthy();
			});
			expect(count).toBe(0);
			perform.click();
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
			async function* fn(_: number, { signal }: SheepdogUtils) {
				task_signal = signal;
				await timeout(wait_time);
				yield;
				count++;
			}
			const { getByTestId } = render(component, {
				fn,
			});
			const perform = getByTestId(`perform-${selector}`);
			const cancel = getByTestId(`cancel-${selector}-last`);
			perform.click();
			await vi.advanceTimersByTimeAsync(20);
			cancel.click();
			await vi.waitFor(() => {
				expect(task_signal.aborted).toBeTruthy();
			});
			expect(count).toBe(0);
			perform.click();
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
			async function* fn(_: number, { signal }: SheepdogUtils) {
				task_signal = signal;
				await timeout(wait_time);
				yield;
				count++;
			}
			const { getByTestId } = render(component, {
				fn,
			});
			const perform = getByTestId(`perform-${selector}`);
			const cancel = getByTestId(`cancel-${selector}`);
			perform.click();
			await vi.advanceTimersByTimeAsync(20);
			cancel.click();
			await vi.waitFor(() => {
				expect(task_signal.aborted).toBeTruthy();
			});
			expect(count).toBe(0);
			vi.useRealTimers();
		});

		it("if awaited returns the value it's returned from the function", async () => {
			const returned_value = 42;
			const fn = vi.fn(async () => {
				return returned_value;
			});
			const return_value = vi.fn();
			const { getByTestId } = render(component, {
				fn,
				return_value,
			});
			const perform = getByTestId(`perform-${selector}`);
			perform.click();
			await vi.waitFor(() => {
				expect(fn).toHaveBeenCalled();
				expect(return_value).toHaveBeenCalledWith(returned_value);
			});
		});

		it('passing a value to perform passes the same value as the first argument of the function', async () => {
			let passed_in_value = 0;
			const argument = 42;
			const fn = vi.fn(async (value) => {
				passed_in_value = value;
			});
			const { getByTestId } = render(component, {
				fn,
				argument,
			});
			const perform = getByTestId(`perform-${selector}`);
			perform.click();
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
			const { getByTestId, component: instance } = render(component, {
				fn,
			});
			const task = instance[`${selector}_task`] as Task;
			const perform = getByTestId(`perform-${selector}`);
			perform.click();
			await vi.advanceTimersByTimeAsync(1);
			perform.click();
			await vi.advanceTimersByTimeAsync(1);
			perform.click();
			await vi.advanceTimersByTimeAsync(1);
			perform.click();
			await vi.advanceTimersByTimeAsync(1);
			perform.click();
			await vi.advanceTimersByTimeAsync(wait_time);
			await vi.waitFor(() => {
				expect(fn).toHaveBeenCalledTimes(perform_count.expected);
			});
			expect(task.performCount).toBe(perform_count.expected);
		});

		it('has the correct derived state for isRunning', async () => {
			vi.useFakeTimers();
			let finished = 0;
			const fn = vi.fn(async function* () {
				await timeout(50);
				yield;
				finished++;
			});
			const { getByTestId, component: instance } = render(component, {
				fn,
			});
			const task = instance[`${selector}_task`] as Task;
			const perform = getByTestId(`perform-${selector}`);
			perform.click();
			await vi.advanceTimersByTimeAsync(10);
			perform.click();
			await vi.advanceTimersByTimeAsync(10);
			perform.click();
			await vi.advanceTimersByTimeAsync(10);
			perform.click();
			await vi.advanceTimersByTimeAsync(10);
			perform.click();
			await vi.waitFor(
				() => {
					expect(finished).toBe(is_running.wait_for);
				},
				{
					interval: 10,
				},
			);
			expect(task.isRunning).toBe(true);
			await vi.waitFor(() => {
				expect(finished).toBe(is_running.wait_after);
			});
			expect(task.isRunning).toBe(false);
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
			const { getByTestId, component: instance } = render(component, {
				fn,
			});
			const task = instance[`${selector}_task`] as Task;
			const perform = getByTestId(`perform-${selector}`);
			perform.click();
			await vi.waitFor(() => expect(fn).toHaveBeenCalled());
			// we need to explicitly call toJSON here or else `expect` will call it
			// and the `this` will be the wrong one
			expect(task.last?.toJSON()).toStrictEqual({
				hasStarted: true,
				isCanceled: false,
				isError: false,
				isFinished: false,
				isRunning: true,
				isSuccessful: false,
				error: undefined,
				value: undefined,
			});
			await vi.waitFor(() => expect(finished).toBeTruthy());
			// we need to explicitly call toJSON here or else `expect` will call it
			// and the `this` will be the wrong one
			expect(task.last?.toJSON()).toStrictEqual({
				hasStarted: true,
				isCanceled: false,
				isError: false,
				isFinished: true,
				isRunning: false,
				isSuccessful: true,
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
			const { getByTestId, component: instance } = render(component, {
				fn,
			});
			const task = instance[`${selector}_task`] as Task;
			const perform = getByTestId(`perform-${selector}`);
			perform.click();
			await vi.waitFor(() => expect(fn).toHaveBeenCalled());
			// we need to explicitly call toJSON here or else `expect` will call it
			// and the `this` will be the wrong one
			expect(task.lastRunning?.toJSON()).toStrictEqual({
				hasStarted: true,
				isCanceled: false,
				isError: false,
				isFinished: false,
				isRunning: true,
				isSuccessful: false,
				error: undefined,
				value: undefined,
			});
			await vi.waitFor(() => expect(finished).toBeTruthy());
			expect(task.lastRunning).toBeUndefined();
		});

		it('has the correct derived state for lastCanceled', async () => {
			let finished = false;
			const fn = vi.fn(async function* () {
				await timeout(50);
				yield;
				finished = true;
				return 42;
			});
			const { getByTestId, component: instance } = render(component, {
				fn,
			});
			const task = instance[`${selector}_task`] as Task;
			const perform = getByTestId(`perform-${selector}`);
			perform.click();
			await vi.waitFor(() => expect(fn).toHaveBeenCalled());
			expect(task.lastCanceled).toBeUndefined();
			await vi.waitFor(() => expect(finished).toBeTruthy());
			expect(task.lastCanceled).toBeUndefined();
			finished = false;
			perform.click();
			await vi.waitFor(() => expect(fn).toHaveBeenCalledTimes(2));
			const cancel = getByTestId(`cancel-${selector}-last`);
			cancel.click();
			// we need to explicitly call toJSON here or else `expect` will call it
			// and the `this` will be the wrong one
			expect(task.lastCanceled?.toJSON()).toStrictEqual({
				hasStarted: true,
				isCanceled: true,
				isError: false,
				isFinished: true,
				isRunning: false,
				isSuccessful: false,
				value: undefined,
				error: undefined,
			});
		});

		it("after an instance has completed calling `cancelAll` doesn't change its `isCancelled` status", async () => {
			const fn = vi.fn(async () => {
				await timeout(50);
			});
			const { getByTestId, component: instance } = render(component, {
				fn,
			});
			const instances = instance[`${selector}_instances`] as Array<ReturnType<Task['perform']>>;
			const perform = getByTestId(`perform-${selector}`);
			const cancel = getByTestId(`cancel-${selector}`);
			perform.click();
			await vi.waitFor(() => expect(fn).toHaveBeenCalled());
			await vi.waitFor(() => expect(instances[0].isSuccessful).toBeTruthy());
			perform.click();
			await vi.waitFor(() => expect(fn).toHaveBeenCalledTimes(2));
			cancel.click();
			expect(instances[0].isSuccessful).toBeTruthy();
			expect(instances[0].isCanceled).toBeFalsy();
			expect(instances[1].isSuccessful).toBeFalsy();
			expect(instances[1].isCanceled).toBeTruthy();
		});

		it("after an instance has completed calling `cancel` doesn't change its `isCancelled` status", async () => {
			const fn = vi.fn(async () => {
				await timeout(50);
			});
			const { getByTestId, component: instance } = render(component, {
				fn,
			});
			const instances = instance[`${selector}_instances`] as Array<ReturnType<Task['perform']>>;
			const perform = getByTestId(`perform-${selector}`);
			const cancel = getByTestId(`cancel-${selector}-last`);
			perform.click();
			await vi.waitFor(() => expect(fn).toHaveBeenCalled());
			await vi.waitFor(() => expect(instances[0].isSuccessful).toBeTruthy());
			cancel.click();
			expect(instances[0].isSuccessful).toBeTruthy();
			expect(instances[0].isCanceled).toBeFalsy();
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
		let returned_value: { error: Error; task: Task } | undefined;
		const { getByTestId, component: instance } = render(component, {
			fn,
			return_value(value) {
				returned_value = value as never;
			},
		});
		const task = instance.default_task as Task;
		const perform = getByTestId(`perform-error`);
		perform.click();
		await vi.waitFor(() => expect(fn).toHaveBeenCalled());
		expect(task.lastErrored).toBeUndefined();
		await vi.waitFor(() => expect(finished).toBeTruthy());
		expect(task.lastErrored).toBeUndefined();
		finished = false;
		error = new Error();
		perform.click();
		await vi.waitFor(() => expect(fn).toHaveBeenCalledTimes(2));
		await vi.waitFor(() => expect(returned_value).toBeDefined());
		// we need to explicitly call toJSON here or else `expect` will call it
		// and the `this` will be the wrong one
		expect(task.lastErrored?.toJSON()).toStrictEqual({
			error,
			hasStarted: true,
			isCanceled: false,
			isError: true,
			isFinished: true,
			isRunning: false,
			isSuccessful: false,
			value: undefined,
		});
	});

	it('has the correct derived state for lastSuccessful', async () => {
		let finished = false;
		let error: Error | undefined = new Error();
		const fn = vi.fn(async () => {
			await timeout(50);
			finished = true;
			if (error) {
				throw error;
			}
			return 42;
		});
		let returned_value: { error: Error; task: Task } | undefined;
		const { getByTestId, component: instance } = render(component, {
			fn,
			return_value(value) {
				returned_value = value as never;
			},
		});
		const task = instance.default_task as Task;
		const perform = getByTestId(`perform-error`);
		perform.click();
		await vi.waitFor(() => expect(fn).toHaveBeenCalled());
		expect(task.lastSuccessful).toBeUndefined();
		await vi.waitFor(() => expect(returned_value).toBeDefined());
		expect(task.lastSuccessful).toBeUndefined();
		finished = false;
		error = undefined;
		perform.click();
		await vi.waitFor(() => expect(fn).toHaveBeenCalledTimes(2));
		await vi.waitFor(() => expect(finished).toBeTruthy());
		// we need to explicitly call toJSON here or else `expect` will call it
		// and the `this` will be the wrong one
		expect(task.lastSuccessful?.toJSON()).toStrictEqual({
			hasStarted: true,
			isCanceled: false,
			isError: false,
			isFinished: true,
			isRunning: false,
			isSuccessful: true,
			value: 42,
			error: undefined,
		});
	});

	it('re-throws any error thrown in the perform function and has the error in the error field of the task', async () => {
		const to_throw = new Error('my error');
		const fn = vi.fn(async () => {
			throw to_throw;
		});
		let returned_value: { error: Error; task: Task } | undefined;
		const return_value = vi.fn((value) => {
			returned_value = value as never;
		});
		const { getByTestId } = render(component, {
			fn,
			return_value,
		});
		const perform = getByTestId(`perform-error`);
		perform.click();
		await vi.waitFor(() => {
			expect(return_value).toHaveBeenCalled();
		});
		expect(returned_value).toBeDefined();
		if (!returned_value) throw new Error('No returned value');
		expect(returned_value.error).toBe(to_throw);
		expect(returned_value.task.last?.error).toBe(to_throw);
	});
});

describe('task - error if wrong kind', () => {
	it('throws if you try to instantiate a task with the wrong kind', () => {
		expect(() => render(WrongKind)).toThrowErrorMatchingInlineSnapshot(
			`
			[Error: Unexpected kind 'something'

				in <unknown>
			]
		`,
		);
	});
});

describe("task - specific functionality 'default'", () => {
	all_options((selector) => {
		it('runs multiple time if performed multiple time', async () => {
			const fn = vi.fn();
			const { getByTestId } = render(Default, {
				fn,
			});
			const perform = getByTestId(`perform-${selector}`);
			perform.click();
			perform.click();
			perform.click();
			await vi.waitFor(() => {
				expect(fn).toHaveBeenCalledTimes(3);
			});
		});

		it('passing a value to perform passes the same value as the first argument of the function', async () => {
			let passed_in_value = 0;
			const argument = 42;
			const fn = vi.fn(async (value) => {
				passed_in_value = value;
			});
			const { getByTestId } = render(Default, {
				fn,
				argument,
			});
			const perform = getByTestId(`perform-${selector}`);
			perform.click();
			await vi.waitFor(() => {
				expect(fn).toHaveBeenCalled();
			});
			expect(passed_in_value).toBe(argument);
		});

		it("cancel the last instance if you call cancel on the returned instance, the function is a generator and there's a yield after every await", async () => {
			vi.useFakeTimers();
			let count = 0;
			const wait_time = 50;
			const task_signals: AbortSignal[] = [];
			async function* fn(_: number, { signal }: SheepdogUtils) {
				task_signals.push(signal);
				await timeout(wait_time);
				yield;
				count++;
			}
			const { getByTestId } = render(Default, {
				fn,
			});
			const perform = getByTestId(`perform-${selector}`);
			const cancel = getByTestId(`cancel-${selector}-last`);
			perform.click();
			perform.click();
			perform.click();
			await vi.waitFor(() => {
				expect(task_signals.length).toBe(3);
			});
			cancel.click();
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
			const { getByTestId } = render(Enqueue, {
				fn,
				max: 1,
			});
			const perform = getByTestId(`perform-${selector}`);
			perform.click();
			perform.click();
			perform.click();
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
			const { getByTestId } = render(Enqueue, {
				fn,
			});
			const perform = getByTestId(`perform-${selector}`);
			const cancel = getByTestId(`cancel-${selector}`);
			perform.click();
			await Promise.resolve();
			perform.click();
			await Promise.resolve();
			cancel.click();
			expect(fn).toHaveBeenCalledTimes(1);
		});

		it("doesn't run if it is cancelled before starting  (async function)", async () => {
			const wait_time = 50;
			const fn = vi.fn(async () => {
				await timeout(wait_time);
			});
			const { getByTestId } = render(Enqueue, {
				fn,
			});
			const perform = getByTestId(`perform-${selector}`);
			const cancel = getByTestId(`cancel-${selector}`);
			perform.click();
			await Promise.resolve();
			perform.click();
			await Promise.resolve();
			cancel.click();
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
			const { getByTestId } = render(Enqueue, {
				fn,
				max: 3,
			});
			const perform = getByTestId(`perform-${selector}`);
			perform.click();
			perform.click();
			perform.click();
			perform.click();
			perform.click();
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
			async function* fn(_: number, { signal }: SheepdogUtils) {
				task_signals.push(signal);
				await timeout(wait_time);
				yield;
				count++;
			}
			const { getByTestId } = render(Enqueue, {
				fn,
			});
			const perform = getByTestId(`perform-${selector}`);
			const cancel = getByTestId(`cancel-${selector}-last`);
			perform.click();
			perform.click();
			perform.click();
			await vi.waitFor(() => {
				expect(task_signals.length).toBe(3);
			});
			cancel.click();
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
			const { getByTestId } = render(Drop, {
				fn,
				max: 1,
			});
			const perform = getByTestId(`perform-${selector}`);
			perform.click();
			perform.click();
			perform.click();
			await vi.waitFor(() => {
				expect(fn).toHaveBeenCalledTimes(1);
			});
			expect(max_concurrent).toBe(1);
			await vi.waitFor(() => {
				expect(concurrent).toBe(0);
			});
			expect(fn).toHaveBeenCalledTimes(1);
			perform.click();
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
			const { getByTestId } = render(Enqueue, {
				fn,
			});
			const perform = getByTestId(`perform-${selector}`);
			const cancel = getByTestId(`cancel-${selector}`);
			perform.click();
			await Promise.resolve();
			perform.click();
			await Promise.resolve();
			cancel.click();
			expect(fn).toHaveBeenCalledTimes(1);
		});

		it("doesn't run if it is cancelled before starting  (async function)", async () => {
			const wait_time = 50;
			const fn = vi.fn(async () => {
				await timeout(wait_time);
			});
			const { getByTestId } = render(Enqueue, {
				fn,
			});
			const perform = getByTestId(`perform-${selector}`);
			const cancel = getByTestId(`cancel-${selector}`);
			perform.click();
			await Promise.resolve();
			perform.click();
			await Promise.resolve();
			cancel.click();
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
			const { getByTestId } = render(Drop, {
				fn,
				max: 3,
			});
			const perform = getByTestId(`perform-${selector}`);
			perform.click();
			perform.click();
			perform.click();
			await vi.waitFor(() => {
				expect(fn).toHaveBeenCalledTimes(3);
			});
			expect(max_concurrent).toBe(3);
			await vi.waitFor(() => {
				expect(concurrent).toBe(0);
			});
			perform.click();
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
			const { getByTestId } = render(KeepLatest, {
				fn,
			});
			const perform = getByTestId(`perform-${selector}`);
			perform.click();
			perform.click();
			perform.click();
			perform.click();
			await vi.waitFor(() => {
				expect(fn).toHaveBeenCalledTimes(2);
			});
			await vi.waitFor(() => {
				expect(finished).toBe(2);
			});
			perform.click();
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
			const { getByTestId } = render(Enqueue, {
				fn,
			});
			const perform = getByTestId(`perform-${selector}`);
			const cancel = getByTestId(`cancel-${selector}`);
			perform.click();
			await Promise.resolve();
			perform.click();
			await Promise.resolve();
			cancel.click();
			expect(fn).toHaveBeenCalledTimes(1);
		});

		it("doesn't run if it is cancelled before starting  (async function)", async () => {
			const wait_time = 50;
			const fn = vi.fn(async () => {
				await timeout(wait_time);
			});
			const { getByTestId } = render(Enqueue, {
				fn,
			});
			const perform = getByTestId(`perform-${selector}`);
			const cancel = getByTestId(`cancel-${selector}`);
			perform.click();
			await Promise.resolve();
			perform.click();
			await Promise.resolve();
			cancel.click();
			expect(fn).toHaveBeenCalledTimes(1);
		});

		it('completes only `max` + 1 times if performed when other instances are already running (max: 3)', async () => {
			let finished = 0;
			const fn = vi.fn(async function* () {
				await timeout(50);
				yield;
				finished++;
			});
			const { getByTestId } = render(KeepLatest, {
				fn,
				max: 3,
			});
			const perform = getByTestId(`perform-${selector}`);
			perform.click();
			perform.click();
			perform.click();
			perform.click();
			perform.click();
			perform.click();
			await vi.waitFor(() => {
				expect(fn).toHaveBeenCalledTimes(4);
			});
			await vi.waitFor(() => {
				expect(finished).toBe(4);
			});
			perform.click();
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
			const fn = vi.fn(async function* (_: number, { signal }: SheepdogUtils) {
				abort_signals.push(signal);
				await timeout(50);
				yield;
				finished++;
			});
			const { getByTestId } = render(Restart, {
				fn,
				max: 1,
			});
			const perform = getByTestId(`perform-${selector}`);
			perform.click();
			await Promise.resolve();
			perform.click();
			await Promise.resolve();
			perform.click();
			await Promise.resolve();
			await vi.waitFor(() => {
				expect(fn).toHaveBeenCalledTimes(3);
			});
			await vi.waitFor(() => {
				expect(finished).toBe(1);
			});
			expect(abort_signals.map((signal) => signal.aborted)).toStrictEqual([true, true, false]);
			perform.click();
			await vi.waitFor(() => {
				expect(finished).toBe(2);
			});
			expect(abort_signals.at(-1)?.aborted).toBe(false);
		});

		it('completes only `max` time if performed when other instances are already running (max: 3)', async () => {
			let finished = 0;
			const abort_signals: AbortSignal[] = [];
			const fn = vi.fn(async function* (_: number, { signal }: SheepdogUtils) {
				abort_signals.push(signal);
				await timeout(50);
				yield;
				finished++;
			});
			const { getByTestId } = render(Restart, {
				fn,
				max: 3,
			});
			const perform = getByTestId(`perform-${selector}`);
			perform.click();
			await Promise.resolve();
			perform.click();
			await Promise.resolve();
			perform.click();
			await Promise.resolve();
			perform.click();
			await vi.waitFor(() => {
				expect(abort_signals[0]?.aborted).toBe(true);
			});
			perform.click();
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
			perform.click();
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

			const { getByTestId } = render(Link, {
				fn,
			});
			const perform = getByTestId(`perform-child-${selector}`);
			const cancel = getByTestId(`cancel-child-${selector}`);
			perform.click();
			await vi.waitFor(() => {
				expect(fn).toHaveBeenCalled();
			});
			cancel.click();
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

			const { getByTestId } = render(Link, {
				fn,
			});
			const perform = getByTestId(`perform-child-${selector}`);
			const cancel = getByTestId(`cancel-child-${selector}-last`);
			perform.click();
			await vi.waitFor(() => {
				expect(fn).toHaveBeenCalled();
			});
			cancel.click();
			await vi.waitFor(() => {
				expect(finish_waiting).toBeTruthy();
			});
			expect(cancelled).toBeTruthy();
		});

		it('cancel the linked parent task if the child is cancelled when the child component unmount', async () => {
			let cancelled = true;
			let finish_waiting = false;
			const fn = vi.fn(async function* () {
				await timeout(50);
				finish_waiting = true;
				yield;
				cancelled = false;
			});

			const { getByTestId } = render(Link, {
				fn,
			});
			const perform = getByTestId(`child-component-perform-${selector}`);
			const cancel = getByTestId(`unmount-child-component`);
			perform.click();
			await vi.waitFor(() => {
				expect(fn).toHaveBeenCalled();
			});
			cancel.click();
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

			const { getByTestId } = render(Link, {
				fn,
			});
			const perform = getByTestId(`perform-child-${selector}`);
			const cancel = getByTestId(`cancel-child-${selector}-last`);
			perform.click();
			perform.click();
			await vi.waitFor(() => {
				expect(fn).toHaveBeenCalledTimes(2);
			});
			cancel.click();
			await vi.waitFor(() => {
				expect(finish_waiting[0]).toBeTruthy();
				expect(finish_waiting[1]).toBeTruthy();
			});
			expect(cancelled[0]).toBeFalsy();
			expect(cancelled[1]).toBeTruthy();
		});

		it("doesn't cancel the other instance of the linked parent task if the child is cancelled when the child component unmount", async () => {
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

			const { getByTestId } = render(Link, {
				fn,
			});
			const perform_parent = getByTestId(`perform-${selector}`);
			const perform_child = getByTestId(`child-component-perform-${selector}`);
			const cancel = getByTestId(`unmount-child-component`);
			perform_parent.click();
			perform_child.click();
			await vi.waitFor(() => {
				expect(fn).toHaveBeenCalledTimes(2);
			});
			cancel.click();
			await vi.waitFor(() => {
				expect(finish_waiting[0]).toBeTruthy();
				expect(finish_waiting[1]).toBeTruthy();
			});
			expect(cancelled[0]).toBeFalsy();
			expect(cancelled[1]).toBeTruthy();
		});
	});

	describe('task instance derived state', () => {
		all_options((selector) => {
			it('shows "hasStarted" correctly', async () => {
				const fn = vi.fn(async () => {
					await timeout(50);
				});
				const { getByTestId, component: instance } = render(Enqueue, {
					fn,
					max: 1,
				});
				const instances = instance[`${selector}_instances`] as Array<ReturnType<Task['perform']>>;
				const perform = getByTestId(`perform-${selector}`);
				perform.click();
				perform.click();
				expect(instances.at(-1)?.hasStarted).toBeFalsy();
			});
		});
	});
});
