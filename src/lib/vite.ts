import type { Plugin } from 'vite';
import { walk } from 'zimmerframe';
import type {
	ImportDeclaration,
	FunctionExpression,
	ArrowFunctionExpression,
	CallExpression,
	Statement,
	Node,
} from 'estree';
import { print } from 'esrap';
import { parse } from 'acorn';

type Nodes = ImportDeclaration | FunctionExpression | ArrowFunctionExpression | CallExpression;

function update_body(task: FunctionExpression) {
	const body: Statement[] = [];

	for (const statement of task.body.body) {
		body.push(statement);
		if (
			(statement.type === 'ExpressionStatement' &&
				statement.expression.type === 'AwaitExpression') ||
			(statement.type === 'VariableDeclaration' &&
				statement.declarations.some((declarator) => {
					return declarator.init?.type === 'AwaitExpression';
				}))
		) {
			body.push({
				type: 'ExpressionStatement',
				expression: {
					type: 'YieldExpression',
					delegate: false,
				},
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
									return specifier.type === 'ImportSpecifier' && specifier.imported.name === 'task';
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
						...print(returned as Node, {
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
