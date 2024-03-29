/**
 * @vitest-environment happy-dom
 */
import type { SvelteConcurrencyUtils } from '$lib/task';
import { render } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';
import Default from './components/default.svelte';

function wait(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

describe('task - default handler', () => {
	it('calls the function you pass in', async () => {
		const fn = vi.fn();
		const { getByTestId } = render(Default, {
			fn,
		});
		const perform = getByTestId('perform-default');
		perform.click();
		await vi.waitFor(() => {
			expect(fn).toHaveBeenCalled();
		});
	});

	it("runs to completion if it's not cancelled", async () => {
		let count = 0;
		const wait_time = 2000;
		async function* fn() {
			await wait(wait_time);
			yield;
			count++;
		}
		const { getByTestId } = render(Default, {
			fn,
		});
		const perform = getByTestId('perform-default');
		perform.click();
		await vi.waitFor(
			() => {
				expect(count).toBe(1);
			},
			{
				timeout: 3000,
			},
		);
	});

	it("doesn't runs to completion if it's cancelled, the function is a generator and there's a yield after every await", async () => {
		let count = 0;
		const wait_time = 2000;
		let task_signal: AbortSignal;
		async function* fn(_: number, { signal }: SvelteConcurrencyUtils) {
			task_signal = signal;
			await wait(wait_time);
			yield;
			count++;
		}
		const { getByTestId } = render(Default, {
			fn,
		});
		const perform = getByTestId('perform-default');
		const cancel = getByTestId('cancel-default');
		perform.click();
		await wait(500);
		cancel.click();
		await vi.waitFor(() => {
			expect(task_signal.aborted).toBeTruthy();
		});
		expect(count).toBe(0);
	});

	it('runs multiple time if performed multiple time', async () => {
		const fn = vi.fn();
		const { getByTestId } = render(Default, {
			fn,
		});
		const perform = getByTestId('perform-default');
		perform.click();
		perform.click();
		perform.click();
		await vi.waitFor(() => {
			expect(fn).toHaveBeenCalledTimes(3);
		});
	});

	it("if awaited returns the value it's returned from the function", async () => {
		const returned_value = 42;
		const fn = vi.fn(async () => {
			return returned_value;
		});
		const return_value = vi.fn();
		const { getByTestId } = render(Default, {
			fn,
			return_value,
		});
		const perform = getByTestId('perform-default');
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
		const { getByTestId } = render(Default, {
			fn,
			argument,
		});
		const perform = getByTestId('perform-default');
		perform.click();
		await vi.waitFor(() => {
			expect(fn).toHaveBeenCalled();
		});
		expect(passed_in_value).toBe(argument);
	});

	it("cancel the last instance if you call cancel on the returned instance, the function is a generator and there's a yield after every await", async () => {
		let count = 0;
		const wait_time = 2000;
		let task_signal: AbortSignal;
		async function* fn(_: number, { signal }: SvelteConcurrencyUtils) {
			task_signal = signal;
			await wait(wait_time);
			yield;
			count++;
		}
		const { getByTestId } = render(Default, {
			fn,
		});
		const perform = getByTestId('perform-default');
		const cancel = getByTestId('cancel-default-last');
		perform.click();
		perform.click();
		perform.click();
		await wait(500);
		cancel.click();
		await vi.waitFor(() => {
			expect(task_signal.aborted).toBeTruthy();
		});
		await wait(wait_time);
		expect(count).toBe(2);
	});
});
