import { task as other_name } from "svelte-concurrency";

/**
 * 
 * @param {()=>void} fn 
 */
function task(fn){
	fn();
}

task(async ()=>{
	await Promise.resolve();
	await Promise.resolve();
});

other_name(async ()=>{
	await Promise.resolve();
	await Promise.resolve();
});