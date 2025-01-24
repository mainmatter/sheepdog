import { transform as transform_renamed } from '@sheepdog/svelte';

/**
 * @param {()=>any} fn
 */
function transform(fn) {
	return fn;
}

/**
 * @param {number} val
 */
function fn(val) {
	return val;
}

/**
 * @type {Record<string,()=>void>}
 */
const fns = {};

/**
 *
 * @param {TemplateStringsArray} quasi
 * @param {string} strings
 */
function str(quasi, strings) {}

export const task_fn = transform_renamed(async () => {
	const assign = await Promise.resolve();
	let assignment = null;
	assignment = await Promise.resolve();
	const array = [await Promise.resolve()];
	const sum = (await Promise.resolve(1)) + 2;
	const sum2 = 2 + (await Promise.resolve(1));
	fns[await Promise.resolve(0)]();
	const [array_destructure = await Promise.resolve()] = [undefined];
	const function_call = fn(await Promise.resolve(2));
	const conditional1 = (await Promise.resolve(true)) ? 1 : 2;
	const conditional2 = true ? await Promise.resolve(1) : 2;
	const conditional3 = false ? 1 : await Promise.resolve(2);
	const member = { property: null };
	member[await Promise.resolve('property')] = await Promise.resolve(null);
	const logical1 = (await Promise.resolve(null)) ?? 3;
	const logical2 = null ?? (await Promise.resolve(null));
	const logical3 = null || (await Promise.resolve(null));
	const logical4 = (await Promise.resolve(null)) || null;
	const logical5 = (await Promise.resolve(null)) && null;
	const logical6 = true && (await Promise.resolve(null));
	const object_expression1 = { awaited: await Promise.resolve(2) };
	const object_expression2 = { awaited: { nested: await Promise.resolve(2) } };
	const object_expression3 = { awaited: { nested: [await Promise.resolve(2)] } };
	const tagged_template = str`something ${await Promise.resolve('')}`;
	const template_literal = `something ${await Promise.resolve('')}`;
	const unary = !(await Promise.resolve(true));
});

const task_fn_no_export = transform_renamed(async () => {
	const assign = await Promise.resolve();
	let assignment = null;
	assignment = await Promise.resolve();
	const array = [await Promise.resolve()];
	const sum = (await Promise.resolve(1)) + 2;
	const sum2 = 2 + (await Promise.resolve(1));
	fns[await Promise.resolve(0)]();
	const [array_destructure = await Promise.resolve()] = [undefined];
	const function_call = fn(await Promise.resolve(2));
	const conditional1 = (await Promise.resolve(true)) ? 1 : 2;
	const conditional2 = true ? await Promise.resolve(1) : 2;
	const conditional3 = false ? 1 : await Promise.resolve(2);
	const member = { property: null };
	member[await Promise.resolve('property')] = await Promise.resolve(null);
	const logical1 = (await Promise.resolve(null)) ?? 3;
	const logical2 = null ?? (await Promise.resolve(null));
	const logical3 = null || (await Promise.resolve(null));
	const logical4 = (await Promise.resolve(null)) || null;
	const logical5 = (await Promise.resolve(null)) && null;
	const logical6 = true && (await Promise.resolve(null));
	const object_expression1 = { awaited: await Promise.resolve(2) };
	const object_expression2 = { awaited: { nested: await Promise.resolve(2) } };
	const object_expression3 = { awaited: { nested: [await Promise.resolve(2)] } };
	const tagged_template = str`something ${await Promise.resolve('')}`;
	const template_literal = `something ${await Promise.resolve('')}`;
	const unary = !(await Promise.resolve(true));
});

async function with_no_transform() {
	const assign = await Promise.resolve();
	let assignment = null;
	assignment = await Promise.resolve();
	const array = [await Promise.resolve()];
	const sum = (await Promise.resolve(1)) + 2;
	const sum2 = 2 + (await Promise.resolve(1));
	fns[await Promise.resolve(0)]();
	const [array_destructure = await Promise.resolve()] = [undefined];
	const function_call = fn(await Promise.resolve(2));
	const conditional1 = (await Promise.resolve(true)) ? 1 : 2;
	const conditional2 = true ? await Promise.resolve(1) : 2;
	const conditional3 = false ? 1 : await Promise.resolve(2);
	const member = { property: null };
	member[await Promise.resolve('property')] = await Promise.resolve(null);
	const logical1 = (await Promise.resolve(null)) ?? 3;
	const logical2 = null ?? (await Promise.resolve(null));
	const logical3 = null || (await Promise.resolve(null));
	const logical4 = (await Promise.resolve(null)) || null;
	const logical5 = (await Promise.resolve(null)) && null;
	const logical6 = true && (await Promise.resolve(null));
	const object_expression1 = { awaited: await Promise.resolve(2) };
	const object_expression2 = { awaited: { nested: await Promise.resolve(2) } };
	const object_expression3 = { awaited: { nested: [await Promise.resolve(2)] } };
	const tagged_template = str`something ${await Promise.resolve('')}`;
	const template_literal = `something ${await Promise.resolve('')}`;
	const unary = !(await Promise.resolve(true));
}

const different_transform = transform(async () => {
	const assign = await Promise.resolve();
	let assignment = null;
	assignment = await Promise.resolve();
	const array = [await Promise.resolve()];
	const sum = (await Promise.resolve(1)) + 2;
	const sum2 = 2 + (await Promise.resolve(1));
	fns[await Promise.resolve(0)]();
	const [array_destructure = await Promise.resolve()] = [undefined];
	const function_call = fn(await Promise.resolve(2));
	const conditional1 = (await Promise.resolve(true)) ? 1 : 2;
	const conditional2 = true ? await Promise.resolve(1) : 2;
	const conditional3 = false ? 1 : await Promise.resolve(2);
	const member = { property: null };
	member[await Promise.resolve('property')] = await Promise.resolve(null);
	const logical1 = (await Promise.resolve(null)) ?? 3;
	const logical2 = null ?? (await Promise.resolve(null));
	const logical3 = null || (await Promise.resolve(null));
	const logical4 = (await Promise.resolve(null)) || null;
	const logical5 = (await Promise.resolve(null)) && null;
	const logical6 = true && (await Promise.resolve(null));
	const object_expression1 = { awaited: await Promise.resolve(2) };
	const object_expression2 = { awaited: { nested: await Promise.resolve(2) } };
	const object_expression3 = { awaited: { nested: [await Promise.resolve(2)] } };
	const tagged_template = str`something ${await Promise.resolve('')}`;
	const template_literal = `something ${await Promise.resolve('')}`;
	const unary = !(await Promise.resolve(true));
});
