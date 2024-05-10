import { task } from "svelte-concurrency";

function fn(val) {
	return val;
}

function str(quasi, strings) {}

task(async function* () {
	const assign = yield Promise.resolve();
	let assignment = null;

	assignment = yield Promise.resolve();

	const array = [yield Promise.resolve()];
	const sum = (yield Promise.resolve(1)) + 2;
	const sum2 = 2 + (yield Promise.resolve(1));
	const function_call = fn(yield Promise.resolve(2));
	const conditional1 = (yield Promise.resolve(true)) ? 1 : 2;
	const conditional2 = true ? yield Promise.resolve(1) : 2;
	const conditional3 = false ? 1 : yield Promise.resolve(2);
	const member = { property: null };

	member[yield Promise.resolve("property")] = yield Promise.resolve(null);

	const logical1 = (yield Promise.resolve(null)) ?? 3;
	const logical2 = null ?? (yield Promise.resolve(null));
	const logical3 = null || (yield Promise.resolve(null));
	const logical4 = (yield Promise.resolve(null)) || null;
	const logical5 = (yield Promise.resolve(null)) && null;
	const logical6 = true && (yield Promise.resolve(null));
	const object_expression1 = { awaited: yield Promise.resolve(2) };

	const object_expression2 = {
		awaited: { nested: yield Promise.resolve(2) }
	};

	const object_expression3 = {
		awaited: { nested: [yield Promise.resolve(2)] }
	};

	const tagged_template = str`something ${yield Promise.resolve("")}`;
	const template_literal = `something ${yield Promise.resolve("")}`;
	const unary = !(yield Promise.resolve(true));
});