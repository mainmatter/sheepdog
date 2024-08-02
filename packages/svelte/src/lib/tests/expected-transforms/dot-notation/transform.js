import { task } from "@sheepdog/svelte";

task.drop(async function* () {
	yield Promise.resolve();
});

task.enqueue(async function* () {
	yield Promise.resolve();
});

task.default(async function* () {
	yield Promise.resolve();
});

task.keepLatest(async function* () {
	yield Promise.resolve();
});

task.restart(async function* () {
	yield Promise.resolve();
});