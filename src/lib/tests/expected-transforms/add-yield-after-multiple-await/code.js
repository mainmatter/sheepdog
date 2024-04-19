import { task } from "svelte-concurrency";

task(async ()=>{
	await Promise.resolve();
	await Promise.resolve();
});