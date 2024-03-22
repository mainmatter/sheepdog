// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Handler = (options?: any) => (
	fn: () => void,

	utils: { promise: Promise<unknown>; abort_controller: AbortController },
) => void;
