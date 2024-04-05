import { task as other_name } from "svelte-concurrency";
import { task } from "another-library";

task(async ()=>{
	await Promise.resolve();
	await Promise.resolve();
});

other_name(async ()=>{
	await Promise.resolve();
	await Promise.resolve();
});