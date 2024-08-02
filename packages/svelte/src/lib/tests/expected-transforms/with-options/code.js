import { task } from "@sheepdog/svelte";

task(async () => {
	await Promise.resolve();
}, {kind: "drop", max: 3});

task(async () => {
	await Promise.resolve();
}, {kind: "enqueue", max: 3});

task(async () => {
	await Promise.resolve();
}, {kind: "default", max: 3});

task(async () => {
	await Promise.resolve();
}, {kind: "keepLatest", max: 3});

task(async () => {
	await Promise.resolve();
}, {kind: "restart", max: 3});
