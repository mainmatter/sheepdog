import { task as other_name } from "svelte-concurrency";

other_name(async function* () {
	yield Promise.resolve();
	yield Promise.resolve();
});