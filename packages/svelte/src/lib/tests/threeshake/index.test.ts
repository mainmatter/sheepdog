import { test, describe, expect } from 'vitest';
import { Project } from 'fixturify-project';
import { execa } from 'execa';
import { readdir, readFile } from 'node:fs/promises';

async function does_it_shake(file: string) {
	const project = new Project({
		files: {
			'index.js': file,
			'index.html': `<script type="module" src="./index.js"></script>`,
			'vite.config.ts': `
					export default {
						build: {
							minify: false,
							modulePreload: { polyfill: false }
						}
					}`,
		},
	});
	project.linkDevDependency('vite', {
		baseDir: process.cwd(),
	});
	project.linkDevDependency('@sheepdog/svelte', {
		baseDir: process.cwd(),
		resolveName: '.',
	});
	project.linkDevDependency('svelte', {
		baseDir: process.cwd(),
	});
	await project.write();
	await execa({ cwd: project.baseDir })`vite build`;
	const folder = `${project.baseDir}/dist/assets`;
	const dir = await readdir(folder);
	return readFile(`${folder}/${dir[0]}`, 'utf-8');
}

describe('threeshake', () => {
	test('importing `timeout` should treeshake the rest of the library', async () => {
		const file = await does_it_shake(`import { timeout } from '@sheepdog/svelte';
			
			timeout();`);
		expect(file).toMatchInlineSnapshot(`
			"async function timeout(ms) {
			  return new Promise((resolve) => setTimeout(resolve, ms));
			}
			function rune_outside_svelte(rune) {
			  {
			    const error = new Error(\`rune_outside_svelte
			The \\\`\${rune}\\\` rune is only available inside \\\`.svelte\\\` and \\\`.svelte.js/ts\\\` files
			https://svelte.dev/e/rune_outside_svelte\`);
			    error.name = "Svelte error";
			    throw error;
			  }
			}
			{
			  let throw_rune_error = function(rune) {
			    if (!(rune in globalThis)) {
			      let value;
			      Object.defineProperty(globalThis, rune, {
			        configurable: true,
			        // eslint-disable-next-line getter-return
			        get: () => {
			          if (value !== void 0) {
			            return value;
			          }
			          rune_outside_svelte(rune);
			        },
			        set: (v) => {
			          value = v;
			        }
			      });
			    }
			  };
			  var throw_rune_error2 = throw_rune_error;
			  throw_rune_error("$state");
			  throw_rune_error("$effect");
			  throw_rune_error("$derived");
			  throw_rune_error("$inspect");
			  throw_rune_error("$props");
			  throw_rune_error("$bindable");
			}
			timeout();
			"
		`);
	});

	test('importing `didCancel` should treeshake the rest of the library', async () => {
		const file = await does_it_shake(`import { didCancel } from '@sheepdog/svelte';
			
			console.log(didCancel());`);
		expect(file).toMatchInlineSnapshot(`
			"class CancelationError extends Error {
			  constructor() {
			    super("CancelationError: the task instance was cancelled");
			    super.name = "CancelationError";
			  }
			}
			const didCancel = (e) => {
			  return e instanceof CancelationError;
			};
			function rune_outside_svelte(rune) {
			  {
			    const error = new Error(\`rune_outside_svelte
			The \\\`\${rune}\\\` rune is only available inside \\\`.svelte\\\` and \\\`.svelte.js/ts\\\` files
			https://svelte.dev/e/rune_outside_svelte\`);
			    error.name = "Svelte error";
			    throw error;
			  }
			}
			{
			  let throw_rune_error = function(rune) {
			    if (!(rune in globalThis)) {
			      let value;
			      Object.defineProperty(globalThis, rune, {
			        configurable: true,
			        // eslint-disable-next-line getter-return
			        get: () => {
			          if (value !== void 0) {
			            return value;
			          }
			          rune_outside_svelte(rune);
			        },
			        set: (v) => {
			          value = v;
			        }
			      });
			    }
			  };
			  var throw_rune_error2 = throw_rune_error;
			  throw_rune_error("$state");
			  throw_rune_error("$effect");
			  throw_rune_error("$derived");
			  throw_rune_error("$inspect");
			  throw_rune_error("$props");
			  throw_rune_error("$bindable");
			}
			console.log(didCancel());
			"
		`);
	});

	test('importing `CancelationError` should treeshake the rest of the library', async () => {
		const file = await does_it_shake(`import { CancelationError } from '@sheepdog/svelte';
			
			console.log(CancelationError);`);
		expect(file).toMatchInlineSnapshot(`
			"class CancelationError extends Error {
			  constructor() {
			    super("CancelationError: the task instance was cancelled");
			    super.name = "CancelationError";
			  }
			}
			function rune_outside_svelte(rune) {
			  {
			    const error = new Error(\`rune_outside_svelte
			The \\\`\${rune}\\\` rune is only available inside \\\`.svelte\\\` and \\\`.svelte.js/ts\\\` files
			https://svelte.dev/e/rune_outside_svelte\`);
			    error.name = "Svelte error";
			    throw error;
			  }
			}
			{
			  let throw_rune_error = function(rune) {
			    if (!(rune in globalThis)) {
			      let value;
			      Object.defineProperty(globalThis, rune, {
			        configurable: true,
			        // eslint-disable-next-line getter-return
			        get: () => {
			          if (value !== void 0) {
			            return value;
			          }
			          rune_outside_svelte(rune);
			        },
			        set: (v) => {
			          value = v;
			        }
			      });
			    }
			  };
			  var throw_rune_error2 = throw_rune_error;
			  throw_rune_error("$state");
			  throw_rune_error("$effect");
			  throw_rune_error("$derived");
			  throw_rune_error("$inspect");
			  throw_rune_error("$props");
			  throw_rune_error("$bindable");
			}
			console.log(CancelationError);
			"
		`);
	});

	test('importing `transform` should treeshake the rest of the library', async () => {
		const file = await does_it_shake(`import { transform } from '@sheepdog/svelte';
			
			console.log(transform);`);
		expect(file).toMatchInlineSnapshot(`
			"function transform(fn) {
			  {
			    throw new Error("You are using the transform function without the vite plugin. Please add the \`asyncTransform\` plugin to your \`vite.config.ts\`");
			  }
			}
			function rune_outside_svelte(rune) {
			  {
			    const error = new Error(\`rune_outside_svelte
			The \\\`\${rune}\\\` rune is only available inside \\\`.svelte\\\` and \\\`.svelte.js/ts\\\` files
			https://svelte.dev/e/rune_outside_svelte\`);
			    error.name = "Svelte error";
			    throw error;
			  }
			}
			{
			  let throw_rune_error = function(rune) {
			    if (!(rune in globalThis)) {
			      let value;
			      Object.defineProperty(globalThis, rune, {
			        configurable: true,
			        // eslint-disable-next-line getter-return
			        get: () => {
			          if (value !== void 0) {
			            return value;
			          }
			          rune_outside_svelte(rune);
			        },
			        set: (v) => {
			          value = v;
			        }
			      });
			    }
			  };
			  var throw_rune_error2 = throw_rune_error;
			  throw_rune_error("$state");
			  throw_rune_error("$effect");
			  throw_rune_error("$derived");
			  throw_rune_error("$inspect");
			  throw_rune_error("$props");
			  throw_rune_error("$bindable");
			}
			console.log(transform);
			"
		`);
	});
});
