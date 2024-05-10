import { task } from "svelte-concurrency";

task(async ()=>{
	const arr = [0,1];
	const obj = {a: true};
	for(const num of arr){
		console.log(await Promise.resolve(num));
	}
	for(const letter in obj){
		console.log(await Promise.resolve(letter));
	}
	for(const num of arr) console.log(await Promise.resolve(num));
	for(const letter in obj) console.log(await Promise.resolve(letter));
	let i = 0;
	while(i < 10){
		console.log(await Promise.resolve(i));
		i++;
	}
	i = 0;
	while(i < 10) console.log(await Promise.resolve(i));
	i = 0;
	do{
		console.log(await Promise.resolve(i));
		i++;
	}while(i<10);
	let y;
	for(y = await Promise.resolve(0); y<10; y++){
		console.log(await Promise.resolve(y));
	}
	for(let y = await Promise.resolve(0); y<10; y++) console.log(await Promise.resolve(y));

	label: {
		console.log(await Promise.resolve());
	}
	label: console.log(await Promise.resolve());

	switch(await Promise.resolve(true)){
		case await Promise.resolve(true):
			console.log(await Promise.resolve());
		case await Promise.resolve("") === await Promise.resolve(""):
		case await Promise.resolve("a") === await Promise.resolve("a"):
			console.log(await Promise.resolve("b"));
			break;
		case await Promise.resolve(true): {
			console.log(await Promise.resolve("b"));
		}
		default:
			console.log(await Promise.resolve("default"));
	}

	if(await Promise.resolve(true)){
		console.log(await Promise.resolve(true));
	}else if(await Promise.resolve("") === await Promise.resolve("")){
		console.log(await Promise.resolve("equal"));
	}else while(await Promise.resolve(3)>await Promise.resolve(5)){
		console.log(await Promise.resolve(false));
	}{
		console.log(await Promise.resolve(false));
	}

	if(await Promise.resolve(true)) console.log(await Promise.resolve(true));

	if(await Promise.resolve(true)){
		console.log(await Promise.resolve());
	}else console.log(await Promise.resolve());

	// nested test
	for(const x of await Promise.resolve([])){
		console.log(await Promise.resolve("for of"));
		while(await Promise.resolve(true)){
			console.log(await Promise.resolve("while"));
			for(const xx in await Promise.resolve({})){
				console.log(await Promise.resolve("for in"));
				
			}
		}
	}
});