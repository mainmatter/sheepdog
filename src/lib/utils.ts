import { CancelationError } from './core';

export const didCancel = (e: Error | CancelationError) => {
	return e instanceof CancelationError;
};
