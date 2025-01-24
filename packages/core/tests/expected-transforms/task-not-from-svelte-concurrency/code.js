/**
 * @param {()=>void} fn 
 */
function task(fn){
	fn();
}

task(async ()=>{
	await Promise.resolve();
	await Promise.resolve();
});