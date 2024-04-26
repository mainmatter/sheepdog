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
	YieldExpression,
} from 'acorn';

type Nodes = ImportDeclaration | FunctionExpression | ArrowFunctionExpression | CallExpression;

/**
 * This should handle most situation where you can top level await in an async function
 */
function get_expressions_await(expression: Expression): Expression[] {
	switch (expression.type) {
		case 'ArrayExpression':
			// const x = [await promise];
			return expression.elements.flatMap(
				(element) =>
					element?.type !== 'SpreadElement' && element !== null ? get_expressions_await(element) : [],
			);
		case 'AssignmentExpression':
			// x = await promise; x = { value: await promise }; x = [await promise]
			// TODO: [x = await promise] = [undefined]
			return get_expressions_await(expression.right);
		case 'AwaitExpression':
			// await promise;
			return [expression];
		case 'BinaryExpression':
			// await promise + something;
			if(expression.left.type !== "PrivateIdentifier"){
				return get_expressions_await(expression.left).concat(get_expressions_await(expression.right));
			}
			return get_expressions_await(expression.right);
		case 'CallExpression':
			// fn_call(await stuff);
			// TODO: fns[await name]();
			return expression.arguments.flatMap(
				(argument) => argument.type !== 'SpreadElement' ? get_expressions_await(argument) : [],
			);
		case 'ConditionalExpression':
			// await test ? await consequent : await alternate;
			return (
				get_expressions_await(expression.alternate).concat(
				get_expressions_await(expression.consequent)).concat(
				get_expressions_await(expression.test))
			);
		case 'LogicalExpression':
			// await promise || await another;
			return get_expressions_await(expression.left).concat(get_expressions_await(expression.right));
		case 'MemberExpression':
			return (
				expression.property.type !== 'PrivateIdentifier' ?
				get_expressions_await(expression.property) : []
			);
		case 'ObjectExpression':
			return expression.properties.flatMap(
				(property) =>
					property.type !== 'SpreadElement' ?
					(get_expressions_await(property.key).concat(get_expressions_await(property.value))) : [],
			);
		case 'TaggedTemplateExpression':
			return get_expressions_await(expression.quasi);
		case 'TemplateLiteral':
			return expression.expressions.flatMap((template_expression) =>
				get_expressions_await(template_expression),
			);
		case 'UnaryExpression':
			return get_expressions_await(expression.argument);
		default:
			return [];
	}
}

function update_body(task: FunctionExpression) {
	const body: Statement[] = [];

	for (const statement of task.body.body) {
		body.push(statement);
		let expressions: Expression[] = [];
		if(statement.type === "ExpressionStatement"){
			expressions = get_expressions_await(statement.expression);
		}else if(statement.type === "VariableDeclaration"){
			for(let declaration of statement.declarations){
				if(declaration.init){
					expressions = expressions.concat(get_expressions_await(declaration.init));
				}
			}
		}else if(statement.type === "ForInStatement" || statement.type === "ForOfStatement"){
			expressions = get_expressions_await(statement.right)
		}
		for(let expression of expressions){
			if(expression.type==="AwaitExpression"){
				(expression as unknown as YieldExpression).type="YieldExpression";
			}
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
