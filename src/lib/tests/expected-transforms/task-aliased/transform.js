import { task as other_name } from "@sheepdog/svelte";

other_name(async function* () {
	yield Promise.resolve();
	yield Promise.resolve();
});