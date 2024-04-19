import { task as other_name } from "svelte-concurrency";

function task(fn) {
	fn();
}

task(async () => {
	await Promise.resolve();
	await Promise.resolve();
});

other_name(async function* () {
	await Promise.resolve();
	yield;
	await Promise.resolve();
	yield;
});