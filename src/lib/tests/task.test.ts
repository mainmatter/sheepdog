/**
 * @vitest-environment happy-dom
 */
import type { SvelteConcurrencyUtils } from '$lib/task';
import { render } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';
import Default from './components/default.svelte';
import Enqueue from './components/enqueue.svelte';
import Drop from './components/drop.svelte';

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
