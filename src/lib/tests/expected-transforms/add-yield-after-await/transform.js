import { task } from "svelte-concurrency";

task(async function* () {
	yield Promise.resolve();
});