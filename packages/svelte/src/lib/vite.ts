import type {
	ArrowFunctionExpression,
	AwaitExpression,
	BlockStatement,
	CallExpression,
	FunctionExpression,
	ImportDeclaration,
} from 'acorn';
import type { Plugin } from 'vite';

type Nodes =
	| ImportDeclaration
	| FunctionExpression
	| ArrowFunctionExpression
	| CallExpression
	| BlockStatement
	| AwaitExpression;

export async function asyncTransform() {
	const { parse } = await import('acorn');
	const { print } = await import('esrap');
	const { walk } = await import('zimmerframe');

	return {
		name: 'sheepdog-async-transform',
		async transform(code, id) {
			try {
				const ast = parse(code, {
					ecmaVersion: 'latest',
					locations: true,
					sourceType: 'module',
				});
				let task_fn_name: string;
				let transform_fn_name: string;
				// let's walk once to find the name (we were using a promise before but that's just messy)
				walk(
					ast as unknown as ImportDeclaration,
					{},
					{
						ImportDeclaration(node) {
							if (
								node.source.value === '@sheepdog/svelte' ||
								node.source.value === '@sheepdog/svelte/task'
							) {
								const task_fn = node.specifiers.find((specifier) => {
									return (
										specifier.type === 'ImportSpecifier' &&
										specifier.imported.type === 'Identifier' &&
										specifier.imported.name === 'task'
									);
								});
								if (task_fn && task_fn.type === 'ImportSpecifier') {
									task_fn_name = task_fn.local.name;
								}
							} else if (node.source.value === '@sheepdog/svelte/utils') {
								const transform_fn = node.specifiers.find((specifier) => {
									return (
										specifier.type === 'ImportSpecifier' &&
										specifier.imported.type === 'Identifier' &&
										specifier.imported.name === 'transform'
									);
								});
								if (transform_fn && transform_fn.type === 'ImportSpecifier') {
									transform_fn_name = transform_fn.local.name;
								}
							}
						},
					},
				);
				let changed = false;
				const returned = walk(
					ast as unknown as Nodes,
					{
						transform: false,
					},
					{
						AwaitExpression(node, { next, state }) {
							if (state.transform) {
								next();
								node.type = 'YieldExpression' as never;
							}
						},
						CallExpression(node, { state, next }) {
							let local_changed = false;
							let task_arg: (typeof node)['arguments'][number] | undefined;
							if (
								(node.callee.type === 'Identifier' &&
									(node.callee.name === task_fn_name || node.callee.name === transform_fn_name)) ||
								(node.callee.type === 'MemberExpression' &&
									node.callee.object.type === 'Identifier' &&
									node.callee.object.name === task_fn_name)
							) {
								task_arg = node.arguments[0];
								if (task_arg && task_arg.type === 'ArrowFunctionExpression' && task_arg.async) {
									const to_change = task_arg as unknown as FunctionExpression;
									to_change.type = 'FunctionExpression';
									to_change.generator = true;
									next({ ...state, transform: true });
									changed = true;
									local_changed = true;
								} else if (
									task_arg &&
									task_arg.type === 'FunctionExpression' &&
									!task_arg.generator &&
									task_arg.async
								) {
									const to_change = task_arg as unknown as FunctionExpression;
									to_change.generator = true;
									next({ ...state, transform: true });
									changed = true;
									local_changed = true;
								}
							}
							if (!local_changed) {
								next();
							}
							if (
								task_arg &&
								node.callee.type === 'Identifier' &&
								node.callee.name === transform_fn_name
							) {
								return task_arg as never;
							}
						},
					},
				) as unknown as typeof ast;

				if (changed) {
					return {
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						...print(returned as any, {
							sourceMapContent: code,
							sourceMapSource: id,
						}),
					};
				}
			} catch (e) {
				console.error(e);
				/** in case parsing fails */
			}
		},
	} satisfies Plugin;
}
