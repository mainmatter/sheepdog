import { CancelationError } from './core';

export const didCancel = (e: Error | CancelationError) => {
	return e instanceof CancelationError;
};

export async function timeout(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
