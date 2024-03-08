// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Handler = (options?: any) => (
	fn: () => void,

	utils: { promise: { then: unknown }; abort_controller: AbortController },
) => void;
