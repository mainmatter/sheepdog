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

/**
 * @sheepdog-transform
 */
export async function task_fn() {
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

// @sheepdog-transform
export async function task_fn_singleline() {
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

/**
 * With comment on top
 * @sheepdog-transform
 */
export async function task_fn_comment_top() {
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

// with comment on top
// @sheepdog-transform
export async function task_fn_singleline_comment_top() {
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

/**
 * @sheepdog-transform with comment after
 */
export async function task_fn_comment_after() {
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

// @sheepdog-transform with comment after
export async function task_fn_singleline_comment_after() {
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

/**
 * @sheepdog-transform
 */
async function task_fn_no_export() {
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

// @sheepdog-transform
async function task_fn_singleline_no_export() {
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

/**
 * With comment on top
 * @sheepdog-transform
 */
async function task_fn_comment_top_no_export() {
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

// with comment on top
// @sheepdog-transform
async function task_fn_singleline_comment_top_no_export() {
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

/**
 * @sheepdog-transform with comment after
 */
async function task_fn_comment_after_no_export() {
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

// @sheepdog-transform with comment after
async function task_fn_singleline_comment_after_no_export() {
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

/**
 * @sheepdog-transform
 */
export const task_const = async () => {
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
};

// @sheepdog-transform
export const task_const_singleline = async () => {
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
};

/**
 * With comment on top
 * @sheepdog-transform
 */
export const task_const_comment_top = async () => {
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
};

// with comment on top
// @sheepdog-transform
export const task_const_singleline_comment_top = async () => {
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
};

/**
 * @sheepdog-transform with comment after
 */
export const task_const_comment_after = async () => {
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
};

// @sheepdog-transform with comment after
export const task_const_singleline_comment_after = async () => {
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
};

/**
 * @sheepdog-transform
 */
const task_const_no_export = async () => {
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
};

// @sheepdog-transform
const task_const_singleline_no_export = async () => {
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
};

/**
 * With comment on top
 * @sheepdog-transform
 */
const task_const_comment_top_no_export = async () => {
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
};

// with comment on top
// @sheepdog-transform
const task_const_singleline_comment_top_no_export = async () => {
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
};

/**
 * @sheepdog-transform with comment after
 */
const task_const_comment_after_no_export = async () => {
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
};

// @sheepdog-transform with comment after
const task_const_singleline_comment_after_no_export = async () => {
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
};

async function with_no_comment() {
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
