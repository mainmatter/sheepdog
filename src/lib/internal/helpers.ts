import { writable } from 'svelte/store';
import type { Readable, Writable } from 'svelte/store';
/**
 * Thanks to Melt-UI for the implementation
 * https://github.com/melt-ui/melt-ui/blob/284582b759ec9ad31166bd75f09b4bfa3b35b650/src/lib/internal/helpers/withGet.ts
 */

type ReadableValue<T> = T extends Readable<infer V> ? V : never;

type WithGet<T extends Readable<unknown>> = T & {
	get: () => ReadableValue<T>;
};

export type WritableWithGet<T> = WithGet<Writable<T>>;
export type ReadableWithGet<T> = WithGet<Readable<T>>;

export function writable_with_get<T>(initial: T): WritableWithGet<T> {
	const internal = writable(initial);
	let value = initial;

	return {
		subscribe: internal.subscribe,
		set(new_value) {
			internal.set(new_value);
			value = new_value;
		},
		update(updater) {
			const new_value = updater(value);
			internal.set(new_value);
			value = new_value;
		},
		get() {
			return value;
		},
	};
}
