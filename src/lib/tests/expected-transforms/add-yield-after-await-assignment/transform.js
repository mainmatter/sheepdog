import { task } from "svelte-concurrency";

function fn(val) {
	return val;
}

function str(quasi, strings) {}

task(async function* () {
	const assign = await Promise.resolve();

	yield;

	const array = [await Promise.resolve()];

	yield;

	const sum = await Promise.resolve(1) + 2;

	yield;

	const sum2 = 2 + await Promise.resolve(1);

	yield;

	const function_call = fn(await Promise.resolve(2));

	yield;

	const conditional1 = await Promise.resolve(true) ? 1 : 2;

	yield;

	const conditional2 = true ? await Promise.resolve(1) : 2;

	yield;

	const conditional3 = false ? 1 : await Promise.resolve(2);

	yield;

	const logical1 = await Promise.resolve(null) ?? 3;

	yield;

	const logical2 = null ?? await Promise.resolve(null);

	yield;

	const logical3 = null || await Promise.resolve(null);

	yield;

	const logical4 = await Promise.resolve(null) || null;

	yield;

	const logical5 = await Promise.resolve(null) && null;

	yield;

	const logical6 = true && await Promise.resolve(null);

	yield;

	const object_expression1 = { awaited: await Promise.resolve(2) };

	yield;

	const object_expression2 = {
		awaited: { nested: await Promise.resolve(2) }
	};

	yield;

	const object_expression3 = {
		awaited: { nested: [await Promise.resolve(2)] }
	};

	yield;

	const tagged_template = str`something ${await Promise.resolve("")}`;

	yield;

	const template_literal = `something ${await Promise.resolve("")}`;

	yield;

	const unary = !await Promise.resolve(true);

	yield;
});