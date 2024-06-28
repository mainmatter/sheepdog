import { describe, expect, it } from 'vitest';
import { didCancel } from '../index';
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
