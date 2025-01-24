import { task as other_name } from "@sheepdog/svelte";
import { task } from "another-library";

task(async () => {
	await Promise.resolve();
	await Promise.resolve();
});

other_name(async function* () {
	yield Promise.resolve();
	yield Promise.resolve();
});