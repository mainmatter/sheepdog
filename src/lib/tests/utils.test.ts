import { describe, expect, it, vi } from 'vitest';
import { didCancel, timeout } from '$lib';
import { CancelationError } from '$lib/task.js';

describe('Util - didCancel', () => {
	it('returns `true` for a CancelationError', async () => {
		const cancelationError = new CancelationError();
		const result = didCancel(cancelationError);
		expect(result).toBeTruthy();
	});
	it('returns `false` for a normal Error', async () => {
		const error = new Error();
		const result = didCancel(error);
		expect(result).toBeFalsy();
	});
});

describe('Util - timeout', () => {
	it('correctly resolves timeout 0', async () => {
		let result = false;
		timeout(0).then(() => (result = true));
		expect(result).toBe(false);

		// should be falsy still after a microtick
		await new Promise<void>((r) => r());
		expect(result).toBe(false);

		// should have resolved after a tick
		await new Promise<void>((r) => setTimeout(r, 0));
		expect(result).toBe(true);
	});

	it('correctly resolves timeout 100 (fake timers)', async () => {
		vi.useFakeTimers();

		let result = false;
		timeout(100).then(() => (result = true));
		expect(result).toBe(false);

		await vi.advanceTimersByTimeAsync(99);
		expect(result).toBe(false);

		await vi.advanceTimersByTimeAsync(1);
		expect(result).toBe(true);

		vi.restoreAllMocks();
	});
});
