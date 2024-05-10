import { task } from "svelte-concurrency";

task(async function* () {
	const arr = [0, 1];
	const obj = { a: true };

	for (const num of arr) {
		console.log(yield Promise.resolve(num));
	}

	for (const letter in obj) {
		console.log(yield Promise.resolve(letter));
	}

	for (const num of arr) console.log(yield Promise.resolve(num));
	for (const letter in obj) console.log(yield Promise.resolve(letter));

	let i = 0;

	while (i < 10) {
		console.log(yield Promise.resolve(i));
		i++;
	}

	i = 0;
	while (i < 10) console.log(yield Promise.resolve(i));
	i = 0;

	do {
		console.log(yield Promise.resolve(i));
		i++;
	} while (i < 10);

	let y;

	for (y = yield Promise.resolve(0); y < 10; y++) {
		console.log(yield Promise.resolve(y));
	}

	for (let y = yield Promise.resolve(0); y < 10; y++) console.log(yield Promise.resolve(y));

	label: {
		console.log(yield Promise.resolve());
	}

	label: console.log(yield Promise.resolve());

	switch (yield Promise.resolve(true)) {
		case yield Promise.resolve(true):
			console.log(yield Promise.resolve());

		case (yield Promise.resolve("")) === (yield Promise.resolve("")):

		case (yield Promise.resolve("a")) === (yield Promise.resolve("a")):
			console.log(yield Promise.resolve("b"));
			break;

		case yield Promise.resolve(true):
			{
				console.log(yield Promise.resolve("b"));
			}

		default:
			console.log(yield Promise.resolve("default"));
	}

	if (yield Promise.resolve(true)) {
		console.log(yield Promise.resolve(true));
	} else if ((yield Promise.resolve("")) === (yield Promise.resolve(""))) {
		console.log(yield Promise.resolve("equal"));
	} else while ((yield Promise.resolve(3)) > (yield Promise.resolve(5))) {
		console.log(yield Promise.resolve(false));
	}

	{
		console.log(await Promise.resolve(false));
	}

	if (yield Promise.resolve(true)) console.log(yield Promise.resolve(true));

	if (yield Promise.resolve(true)) {
		console.log(yield Promise.resolve());
	} else console.log(yield Promise.resolve());

	for (const x of yield Promise.resolve([])) {
		console.log(yield Promise.resolve("for of"));

		while (yield Promise.resolve(true)) {
			console.log(yield Promise.resolve("while"));

			for (const xx in yield Promise.resolve({})) {
				console.log(yield Promise.resolve("for in"));
			}
		}
	}
});