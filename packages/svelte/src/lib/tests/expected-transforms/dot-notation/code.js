import { task } from "@sheepdog/svelte";

task.drop(async () => {
	await Promise.resolve();
});

task.enqueue(async () => {
	await Promise.resolve();
});

task.default(async () => {
	await Promise.resolve();
});

task.keepLatest(async () => {
	await Promise.resolve();
});

task.restart(async () => {
	await Promise.resolve();
});
