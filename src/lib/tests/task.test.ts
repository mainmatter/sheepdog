/**
 * @vitest-environment happy-dom
 */
import { render, waitFor } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';
import Default from './components/default.svelte';
import Enqueue from './components/enqueue.svelte';
import Drop from './components/drop.svelte';
import Restart from './components/restart.svelte';
import Link from './components/link/parent.svelte';
import WrongKind from './components/wrong-kind.svelte';
import type { Task, SvelteConcurrencyUtils } from '../index';
import { get } from 'svelte/store';

function wait(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

function all_options(fn: (selector: string) => void) {
	describe.each(['default', 'options'])('version with %s', fn);
}

describe.each([
	{ component: Default, name: 'default' },
	{ component: Enqueue, name: 'enqueue' },
	{ component: Drop, name: 'drop' },
	{ component: Restart, name: 'restart' },
])('task - basic functionality $name', ({ component }) => {
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
				await wait(wait_time);
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

		it("doesn't runs to completion if it's cancelled, the function is a generator and there's a yield after every await", async () => {
			let count = 0;
			const wait_time = 50;
			let task_signal: AbortSignal;
			async function* fn(_: number, { signal }: SvelteConcurrencyUtils) {
				task_signal = signal;
				await wait(wait_time);
				yield;
				count++;
			}
			const { getByTestId } = render(component, {
				fn,
			});
			const perform = getByTestId(`perform-${selector}`);
			const cancel = getByTestId(`cancel-${selector}`);
			perform.click();
			await wait(20);
			cancel.click();
			await vi.waitFor(() => {
				expect(task_signal.aborted).toBeTruthy();
			});
			expect(count).toBe(0);
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
			});
			expect(return_value).toHaveBeenCalledWith(returned_value);
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
	});

	it('re-throws any error thrown in the perform function and has the error in the error field of the store', async () => {
		const to_throw = new Error('my error');
		const fn = vi.fn(async () => {
			throw to_throw;
		});
		let returned_value: { error: Error; store: Task } | undefined;
		const { getByTestId } = render(component, {
			fn,
			return_value(value) {
				returned_value = value as never;
			},
		});
		const perform = getByTestId(`perform-error`);
		perform.click();
		await vi.waitFor(() => {
			expect(fn).toHaveBeenCalled();
		});
		expect(returned_value).toBeDefined();
		if (!returned_value) throw new Error('No returned value');
		expect(returned_value.error).toBe(to_throw);
		expect(get(returned_value.store).error).toBe(to_throw);
	});
});

describe('task - error if wrong kind', () => {
	it('throws if you try to instantiate a task with the wrong kind', () => {
		expect(() => render(WrongKind)).toThrowErrorMatchingInlineSnapshot(
			`[Error: Unexpected kind 'something']`,
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
			let count = 0;
			const wait_time = 50;
			const task_signals: AbortSignal[] = [];
			async function* fn(_: number, { signal }: SvelteConcurrencyUtils) {
				task_signals.push(signal);
				await wait(wait_time);
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
			await wait(wait_time);
			expect(count).toBe(2);
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
				await wait(50);
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

		it('runs multiple time if performed multiple time but only `max` at a time (max: 3)', async () => {
			let concurrent = 0;
			let max_concurrent = -Infinity;
			const fn = vi.fn(async () => {
				concurrent++;
				max_concurrent = Math.max(max_concurrent, concurrent);
				await wait(50);
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
			let count = 0;
			const wait_time = 50;
			const task_signals: AbortSignal[] = [];
			async function* fn(_: number, { signal }: SvelteConcurrencyUtils) {
				task_signals.push(signal);
				await wait(wait_time);
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
			await wait(wait_time);
			expect(count).toBe(2);
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
				await wait(50);
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

		it('runs only `max` time if performed when other instances are already running (max: 3)', async () => {
			let concurrent = 0;
			let max_concurrent = -Infinity;
			const fn = vi.fn(async () => {
				concurrent++;
				max_concurrent = Math.max(max_concurrent, concurrent);
				await wait(50);
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

describe("task - specific functionality 'restart'", () => {
	all_options((selector) => {
		it('completes only `max` time if performed when other instances are already running', async () => {
			let finished = 0;
			const abort_signals: AbortSignal[] = [];
			const fn = vi.fn(async function* (_: number, { signal }: SvelteConcurrencyUtils) {
				abort_signals.push(signal);
				await wait(50);
				yield;
				finished++;
			});
			const { getByTestId } = render(Restart, {
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
			const fn = vi.fn(async function* (_: number, { signal }: SvelteConcurrencyUtils) {
				abort_signals.push(signal);
				await wait(50);
				yield;
				finished++;
			});
			const { getByTestId } = render(Restart, {
				fn,
				max: 3,
			});
			const perform = getByTestId(`perform-${selector}`);
			perform.click();
			perform.click();
			perform.click();
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
				await wait(50);
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
			await waitFor(() => {
				expect(fn).toHaveBeenCalled();
			});
			cancel.click();
			await waitFor(() => {
				expect(finish_waiting).toBeTruthy();
			});
			expect(cancelled).toBeTruthy();
		});

		it('cancel the linked parent task if the child is cancelled with cancel', async () => {
			let cancelled = true;
			let finish_waiting = false;
			const fn = vi.fn(async function* () {
				await wait(50);
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
			await waitFor(() => {
				expect(fn).toHaveBeenCalled();
			});
			cancel.click();
			await waitFor(() => {
				expect(finish_waiting).toBeTruthy();
			});
			expect(cancelled).toBeTruthy();
		});

		it('cancel the linked parent task if the child is cancelled when the child component unmount', async () => {
			let cancelled = true;
			let finish_waiting = false;
			const fn = vi.fn(async function* () {
				await wait(50);
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
			await waitFor(() => {
				expect(fn).toHaveBeenCalled();
			});
			cancel.click();
			await waitFor(() => {
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
				await wait(50);
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
			await waitFor(() => {
				expect(fn).toHaveBeenCalledTimes(2);
			});
			cancel.click();
			await waitFor(() => {
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
				await wait(50);
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
			await waitFor(() => {
				expect(fn).toHaveBeenCalledTimes(2);
			});
			cancel.click();
			await waitFor(() => {
				expect(finish_waiting[0]).toBeTruthy();
				expect(finish_waiting[1]).toBeTruthy();
			});
			expect(cancelled[0]).toBeFalsy();
			expect(cancelled[1]).toBeTruthy();
		});
	});
});
