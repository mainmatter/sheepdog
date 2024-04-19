import { task } from "svelte-concurrency";

task(async function* () {
	await Promise.resolve();
	yield;
});