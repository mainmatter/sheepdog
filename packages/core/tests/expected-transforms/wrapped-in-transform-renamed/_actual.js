import { transform as transform_renamed } from '@sheepdog/svelte/utils';

function transform(fn) {
	return fn;
}

function fn(val) {
	return val;
}

const fns = {};

function str(quasi, strings) {}

export const task_fn = async function* () {
	const assign = yield Promise.resolve();
	let assignment = null;

	assignment = yield Promise.resolve();

	const array = [yield Promise.resolve()];
	const sum = (yield Promise.resolve(1)) + 2;
	const sum2 = 2 + (yield Promise.resolve(1));

	fns[yield Promise.resolve(0)]();

	const [
		array_destructure = yield Promise.resolve()
	] = [undefined];

	const function_call = fn(yield Promise.resolve(2));
	const conditional1 = (yield Promise.resolve(true)) ? 1 : 2;
	const conditional2 = true ? yield Promise.resolve(1) : 2;
	const conditional3 = false ? 1 : yield Promise.resolve(2);
	const member = { property: null };

	member[yield Promise.resolve('property')] = yield Promise.resolve(null);

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

	const tagged_template = str`something ${yield Promise.resolve('')}`;
	const template_literal = `something ${yield Promise.resolve('')}`;
	const unary = !(yield Promise.resolve(true));
};

const task_fn_no_export = async function* () {
	const assign = yield Promise.resolve();
	let assignment = null;

	assignment = yield Promise.resolve();

	const array = [yield Promise.resolve()];
	const sum = (yield Promise.resolve(1)) + 2;
	const sum2 = 2 + (yield Promise.resolve(1));

	fns[yield Promise.resolve(0)]();

	const [
		array_destructure = yield Promise.resolve()
	] = [undefined];

	const function_call = fn(yield Promise.resolve(2));
	const conditional1 = (yield Promise.resolve(true)) ? 1 : 2;
	const conditional2 = true ? yield Promise.resolve(1) : 2;
	const conditional3 = false ? 1 : yield Promise.resolve(2);
	const member = { property: null };

	member[yield Promise.resolve('property')] = yield Promise.resolve(null);

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

	const tagged_template = str`something ${yield Promise.resolve('')}`;
	const template_literal = `something ${yield Promise.resolve('')}`;
	const unary = !(yield Promise.resolve(true));
};

async function with_no_transform() {
	const assign = await Promise.resolve();
	let assignment = null;

	assignment = await Promise.resolve();

	const array = [await Promise.resolve()];
	const sum = await Promise.resolve(1) + 2;
	const sum2 = 2 + await Promise.resolve(1);

	fns[await Promise.resolve(0)]();

	const [
		array_destructure = await Promise.resolve()
	] = [undefined];

	const function_call = fn(await Promise.resolve(2));
	const conditional1 = await Promise.resolve(true) ? 1 : 2;
	const conditional2 = true ? await Promise.resolve(1) : 2;
	const conditional3 = false ? 1 : await Promise.resolve(2);
	const member = { property: null };

	member[await Promise.resolve('property')] = await Promise.resolve(null);

	const logical1 = await Promise.resolve(null) ?? 3;
	const logical2 = null ?? await Promise.resolve(null);
	const logical3 = null || await Promise.resolve(null);
	const logical4 = await Promise.resolve(null) || null;
	const logical5 = await Promise.resolve(null) && null;
	const logical6 = true && await Promise.resolve(null);
	const object_expression1 = { awaited: await Promise.resolve(2) };

	const object_expression2 = {
		awaited: { nested: await Promise.resolve(2) }
	};

	const object_expression3 = {
		awaited: { nested: [await Promise.resolve(2)] }
	};

	const tagged_template = str`something ${await Promise.resolve('')}`;
	const template_literal = `something ${await Promise.resolve('')}`;
	const unary = !await Promise.resolve(true);
}

const different_transform = transform(async () => {
	const assign = await Promise.resolve();
	let assignment = null;

	assignment = await Promise.resolve();

	const array = [await Promise.resolve()];
	const sum = await Promise.resolve(1) + 2;
	const sum2 = 2 + await Promise.resolve(1);

	fns[await Promise.resolve(0)]();

	const [
		array_destructure = await Promise.resolve()
	] = [undefined];

	const function_call = fn(await Promise.resolve(2));
	const conditional1 = await Promise.resolve(true) ? 1 : 2;
	const conditional2 = true ? await Promise.resolve(1) : 2;
	const conditional3 = false ? 1 : await Promise.resolve(2);
	const member = { property: null };

	member[await Promise.resolve('property')] = await Promise.resolve(null);

	const logical1 = await Promise.resolve(null) ?? 3;
	const logical2 = null ?? await Promise.resolve(null);
	const logical3 = null || await Promise.resolve(null);
	const logical4 = await Promise.resolve(null) || null;
	const logical5 = await Promise.resolve(null) && null;
	const logical6 = true && await Promise.resolve(null);
	const object_expression1 = { awaited: await Promise.resolve(2) };

	const object_expression2 = {
		awaited: { nested: await Promise.resolve(2) }
	};

	const object_expression3 = {
		awaited: { nested: [await Promise.resolve(2)] }
	};

	const tagged_template = str`something ${await Promise.resolve('')}`;
	const template_literal = `something ${await Promise.resolve('')}`;
	const unary = !await Promise.resolve(true);
});