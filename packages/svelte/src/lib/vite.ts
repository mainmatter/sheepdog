import type {
	ArrowFunctionExpression,
	AwaitExpression,
	BlockStatement,
	CallExpression,
	Comment,
	FunctionDeclaration,
	FunctionExpression,
	ImportDeclaration,
	Node,
	VariableDeclaration,
	ExportDefaultDeclaration,
	ExportNamedDeclaration,
} from 'acorn';
import { parse } from 'acorn';
import { print } from 'esrap';
import type { Plugin } from 'vite';
import { walk, type Context } from 'zimmerframe';

type CommentWithLocation = Comment & {
	start: number;
	end: number;
};

type CommentsExtend = {
	leadingComments?: CommentWithLocation[];
	trailingComments?: CommentWithLocation[];
};

type Nodes = (
	| ImportDeclaration
	| FunctionExpression
	| ArrowFunctionExpression
	| CallExpression
	| BlockStatement
	| AwaitExpression
	| FunctionDeclaration
	| VariableDeclaration
	| ExportDefaultDeclaration
	| ExportNamedDeclaration
) &
	CommentsExtend;

/**
 * Acorn doesn't add comments to the AST by itself. This factory returns the capabilities
 * to add them after the fact.
 *
 * Stolen from the svelte codebase with love 🧡
 */
function get_comment_handlers(source: string) {
	const comments: CommentWithLocation[] = [];

	return {
		onComment: (block: boolean, value: string, start: number, end: number) => {
			if (block && /\n/.test(value)) {
				let a = start;
				while (a > 0 && source[a - 1] !== '\n') a -= 1;

				let b = a;
				while (/[ \t]/.test(source[b])) b += 1;

				const indentation = source.slice(a, b);
				value = value.replace(new RegExp(`^${indentation}`, 'gm'), '');
			}

			comments.push({ type: block ? 'Block' : 'Line', value, start, end });
		},

		add_comments(ast: Node & CommentsExtend) {
			if (comments.length === 0) return;

			walk(ast, null, {
				_(node, { next, path }) {
					let comment;

					while (comments[0] && comments[0].start < node.start) {
						comment = comments.shift() as CommentWithLocation;
						(node.leadingComments ||= []).push(comment);
					}

					next();

					if (comments[0]) {
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						const parent: any = path.at(-1);

						if (parent === undefined || node.end !== parent.end) {
							const slice = source.slice(node.end, comments[0].start);
							const is_last_in_body =
								((parent?.type === 'BlockStatement' || parent?.type === 'Program') &&
									parent.body.indexOf(node) === parent.body.length - 1) ||
								(parent?.type === 'ArrayExpression' &&
									parent.elements.indexOf(node) === parent.elements.length - 1) ||
								(parent?.type === 'ObjectExpression' &&
									parent.properties.indexOf(node) === parent.properties.length - 1);

							if (is_last_in_body) {
								while (comments.length) {
									const comment = comments[0];
									if (parent && comment.start >= parent.end) break;

									(node.trailingComments ||= []).push(comment);
									comments.shift();
								}
							} else if (node.end <= comments[0].start && /^[,) \t]*$/.test(slice)) {
								node.trailingComments = [comments.shift() as CommentWithLocation];
							}
						}
					}
				},
			});

			// Special case: Trailing comments after the root node (which can only happen for expression tags or for Program nodes).
			// Adding them ensures that we can later detect the end of the expression tag correctly.
			if (comments.length > 0 && (comments[0].start >= ast.end || ast.type === 'Program')) {
				(ast.trailingComments ||= []).push(...comments.splice(0));
			}
		},
	};
}

function check_for_transform_comment(
	node: (FunctionDeclaration | VariableDeclaration) & CommentsExtend,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	{ path }: Context<Nodes, any>,
) {
	const parent = path[path.length - 1];
	let to_check_for_comments: CommentsExtend = node;
	if (parent.type === 'ExportDefaultDeclaration' || parent.type === 'ExportNamedDeclaration') {
		to_check_for_comments = parent;
	}
	if (
		to_check_for_comments.leadingComments?.some((comment) =>
			comment.value
				.split('\n')
				.some((line) =>
					line.replaceAll('*', '').toLowerCase().trim().startsWith('@sheepdog-transform'),
				),
		)
	) {
		return true;
	}
	return false;
}

export function asyncTransform() {
	return {
		name: 'sheepdog-async-transform',
		async transform(code, id) {
			try {
				const { onComment, add_comments } = get_comment_handlers(code);
				const ast = parse(code, {
					ecmaVersion: 'latest',
					locations: true,
					sourceType: 'module',
					onComment,
				});
				add_comments(ast);

				let fn_name: string;
				// let's walk once to find the name (we were using a promise before but that's just messy)
				walk(
					ast as unknown as ImportDeclaration,
					{},
					{
						ImportDeclaration(node) {
							if (node.source.value === '@sheepdog/svelte') {
								const task_fn = node.specifiers.find((specifier) => {
									return (
										specifier.type === 'ImportSpecifier' &&
										specifier.imported.type === 'Identifier' &&
										specifier.imported.name === 'task'
									);
								});
								if (task_fn && task_fn.type === 'ImportSpecifier') {
									fn_name = task_fn.local.name;
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
						VariableDeclaration(node, context) {
							let local_changed = false;
							if (check_for_transform_comment(node, context)) {
								for (const declaration of node.declarations) {
									if (
										(declaration.init?.type === 'ArrowFunctionExpression' ||
											declaration.init?.type === 'FunctionExpression') &&
										declaration.init.async
									) {
										const to_change = declaration.init as unknown as FunctionExpression;
										to_change.type = 'FunctionExpression';
										to_change.generator = true;
										context.next({ ...context.state, transform: true });
										changed = true;
										local_changed = true;
									}
								}
							}
							if (!local_changed) {
								context.next();
							}
						},
						FunctionDeclaration(node, context) {
							let local_changed = false;
							if (check_for_transform_comment(node, context) && node.async) {
								node.generator = true;
								context.next({ ...context.state, transform: true });
								local_changed = true;
								changed = true;
							}
							if (!local_changed) {
								context.next();
							}
						},
						CallExpression(node, { state, next }) {
							let local_changed = false;
							if (
								(node.callee.type === 'Identifier' && node.callee.name === fn_name) ||
								(node.callee.type === 'MemberExpression' &&
									node.callee.object.type === 'Identifier' &&
									node.callee.object.name === fn_name)
							) {
								const task_arg = node.arguments[0];
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
			} catch {
				/** in case parsing fails */
			}
		},
	} satisfies Plugin;
}
