import { task as other_name } from "@sheepdog/svelte";

function task(fn) {
	fn();
}

task(async () => {
	await Promise.resolve();
	await Promise.resolve();
});

other_name(async function* () {
	yield Promise.resolve();
	yield Promise.resolve();
});