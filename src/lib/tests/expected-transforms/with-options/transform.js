import { task } from "@sheepdog/svelte";

task(
	async function* () {
		yield Promise.resolve();
	},
	{ kind: "drop", max: 3 }
);

task(
	async function* () {
		yield Promise.resolve();
	},
	{ kind: "enqueue", max: 3 }
);

task(
	async function* () {
		yield Promise.resolve();
	},
	{ kind: "default", max: 3 }
);

task(
	async function* () {
		yield Promise.resolve();
	},
	{ kind: "keepLatest", max: 3 }
);

task(
	async function* () {
		yield Promise.resolve();
	},
	{ kind: "restart", max: 3 }
);