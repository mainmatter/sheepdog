import { task as other_name } from "svelte-concurrency";

other_name(async ()=>{
	await Promise.resolve();
	await Promise.resolve();
});