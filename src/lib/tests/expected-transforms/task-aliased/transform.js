import { task as other_name } from "svelte-concurrency";

other_name(async function* () {
	await Promise.resolve();
	yield;
	await Promise.resolve();
	yield;
});