/**
 * @vitest-environment happy-dom
 */
import type { SvelteConcurrencyUtils } from '$lib/task';
import { render } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';
import Task from './components/default.svelte';

function wait(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

describe('task', () => {
	it('calls the function you pass in', async () => {
		const fn = vi.fn();
		const { getByTestId } = render(Task, {
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
		const { getByTestId } = render(Task, {
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
		async function* fn(_: unknown, { signal }: SvelteConcurrencyUtils) {
			task_signal = signal;
			await wait(wait_time);
			yield;
			count++;
		}
		const { getByTestId } = render(Task, {
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
		const { getByTestId } = render(Task, {
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
});
