import type { Plugin } from 'vite';
import { walk } from 'zimmerframe';
import { print } from 'esrap';
import { parse } from 'acorn';
import type {
	ImportDeclaration,
	FunctionExpression,
	ArrowFunctionExpression,
	CallExpression,
	Statement,
	Expression,
} from 'acorn';

type Nodes = ImportDeclaration | FunctionExpression | ArrowFunctionExpression | CallExpression;

/**
 * This should handle most situation where you can top level await in an async function
 */
function has_expression_await(expression: Expression): boolean {
	switch (expression.type) {
		case 'ArrayExpression':
			// const x = [await promise];
			return expression.elements.some(
				(element) =>
					element?.type !== 'SpreadElement' && element !== null && has_expression_await(element),
			);
		case 'AssignmentExpression':
			// x = await promise; x = { value: await promise }; x = [await promise]
			// TODO: [x = await promise] = [undefined]
			return has_expression_await(expression.right);
		case 'AwaitExpression':
			// await promise;
			return true;
		case 'BinaryExpression':
			// await promise + something;
			return (
				(expression.left.type !== 'PrivateIdentifier' && has_expression_await(expression.left)) ||
				has_expression_await(expression.right)
			);
		case 'CallExpression':
			// fn_call(await stuff);
			// TODO: fns[await name]();
			return expression.arguments.some(
				(argument) => argument.type !== 'SpreadElement' && has_expression_await(argument),
			);
		case 'ConditionalExpression':
			// await test ? await consequent : await alternate;
			return (
				has_expression_await(expression.alternate) ||
				has_expression_await(expression.consequent) ||
				has_expression_await(expression.test)
			);
		case 'LogicalExpression':
			// await promise || await another;
			return has_expression_await(expression.left) || has_expression_await(expression.right);
		case 'MemberExpression':
			return (
				expression.property.type !== 'PrivateIdentifier' &&
				has_expression_await(expression.property)
			);
		case 'ObjectExpression':
			return expression.properties.some(
				(property) =>
					property.type !== 'SpreadElement' &&
					(has_expression_await(property.key) || has_expression_await(property.value)),
			);
		case 'TaggedTemplateExpression':
			return has_expression_await(expression.quasi);
		case 'TemplateLiteral':
			return expression.expressions.some((template_expression) =>
				has_expression_await(template_expression),
			);
		case 'UnaryExpression':
			return has_expression_await(expression.argument);
		default:
			return false;
	}
}

function update_body(task: FunctionExpression) {
	const body: Statement[] = [];

	for (const statement of task.body.body) {
		body.push(statement);
		if (
			(statement.type === 'ExpressionStatement' && has_expression_await(statement.expression)) ||
			(statement.type === 'VariableDeclaration' &&
				statement.declarations.some((declarator) => {
					return declarator.init && has_expression_await(declarator.init);
				})) ||
			(statement.type === 'ForInStatement' && has_expression_await(statement.right)) ||
			(statement.type === 'ForOfStatement' && has_expression_await(statement.right))
		) {
			body.push({
				type: 'ExpressionStatement',
				expression: {
					type: 'YieldExpression',
					delegate: false,
					start: 0,
					end: 0,
				},
				start: 0,
				end: 0,
			});
		}
	}
	task.body.body = body;
}

export function concurrency_transform() {
	return {
		name: 'concurrency-transform',
		async transform(code, id) {
			try {
				const ast = parse(code, {
					ecmaVersion: 'latest',
					locations: true,
					sourceType: 'module',
				});
				let resolve_fn_name: (value: string | undefined | PromiseLike<string>) => void;
				const task_fn_name = new Promise<string | undefined>((resolve) => {
					resolve_fn_name = resolve;
				});
				let changed = false;
				const returned = walk(
					ast as unknown as Nodes,
					{
						task_fn_name,
					},
					{
						ImportDeclaration(node) {
							if (node.source.value === 'svelte-concurrency') {
								const task_fn = node.specifiers.find((specifier) => {
									return (
										specifier.type === 'ImportSpecifier' &&
										specifier.imported.type === 'Identifier' &&
										specifier.imported.name === 'task'
									);
								});
								if (task_fn && task_fn.type === 'ImportSpecifier') {
									resolve_fn_name(task_fn.local.name);
								}
							}
						},
						CallExpression(node, { state, next }) {
							state.task_fn_name.then((name) => {
								if (node.callee.type === 'Identifier' && node.callee.name === name) {
									const task_arg = node.arguments[0];
									if (task_arg && task_arg.type === 'ArrowFunctionExpression' && task_arg.async) {
										const to_change = task_arg as unknown as FunctionExpression;
										to_change.type = 'FunctionExpression';
										to_change.generator = true;
										update_body(to_change);
										changed = true;
									} else if (
										task_arg &&
										task_arg.type === 'FunctionExpression' &&
										!task_arg.generator &&
										task_arg.async
									) {
										const to_change = task_arg as unknown as FunctionExpression;
										to_change.generator = true;
										update_body(to_change);
										changed = true;
									}
								}
							});
							next();
						},
					},
				) as unknown as typeof ast;
				resolve_fn_name!(undefined);
				await task_fn_name;

				if (changed) {
					return {
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						...print(returned as any, {
							sourceMapContent: code,
							sourceMapSource: id,
						}),
					};
				}
			} catch {
				/** in case parsing fails */
			}
		},
	} satisfies Plugin;
}
