# @sheepdog/svelte

Handle async tasks in your svelte application with ease thanks to `@sheepdog/svelte`.

## What is it?

`@sheepdog/svelte` supplies a simple way to introduce cancellable concurrency into your app. Not only do they provide the cancellability that is missing from normal Promises, `@sheepdog/svelte` also provides a public API that allows you to observe the running state of your task without having to set a single flag manually.

Tasks that live on components are automatically cancelled when their context is destroyed, meaning you don't need to worry about the clean up - we've got you covered.

Choose whether you want to keep the oldest, keep the newest or keep all instances of your task to help boost the performance of your app and reduce unnecessary server load.

## How to use `@sheepdog/svelte`

Install it using your favorite package manager:

```bash
pnpm install @sheepdog/svelte
```

Then put it to work immediately wherever you want cancellable promises. (Cancellation is only available when using the generator function or async transform, but more on that later).

## Task structure

All tasks will return a store with the same structure:

- `error`: Error - if an error occurred, it will be returned here,
- `isRunning`: Boolean - whether the task is currently running or not
- `lastSuccessful`: Any - the return value from the last successful run of the task
- `performCount`: Number - the number of times the task has been run,
- `results`: Array - all of the results from previous invocations of this task,

## Task types

There are several flavours of tasks to choose from (check out the interactive docs here [insert link to site when ready]).

With all types of task, it is possible to invoke it directly or add the `kind` parameter to the options object.

If you don't care about mid-call cancellation, then you can utilize the concurrency with any of the following task types.

If you do care about mid-call cancellation, be sure to check out the [Task Cancellation](#task-cancellation) section.

### Standard/default task

This simply gives you a task wrapper around your function. It will not handle any kind of concurrency for you.

```svelte
<script>
	import { task } from '@sheepdog/svelte';

	const myTask = task(async (param: number) => {
		await new Promise((r) => setTimeout(r, 2000));
		return param * 2;
	});
</script>
```

OR

```svelte
<script>
	import { task } from '@sheepdog/svelte';

	const myTask = task(
		async (param: number) => {
			await new Promise((r) => setTimeout(r, 2000));
			return param * 2;
		},
		{ kind: 'default' },
	);
</script>
```

### Restartable task

This will cancel the oldest instance of the task and start a new instance of it. You can also provide a `max` that will only restart the oldest task instance if the threshold is exceeded.

```svelte
<script>
	import { task } from '@sheepdog/svelte';

	const myTask = task.restart(
		async (param: number) => {
			await new Promise((r) => setTimeout(r, 2000));
			return param * 2;
		},
		{ max: 3 },
	);
</script>
```

OR

```svelte
<script>
	import { task } from '@sheepdog/svelte';

	const myTask = task(
		async (param: number) => {
			await new Promise((r) => setTimeout(r, 2000));
			return param * 2;
		},
		{ kind: 'restart', max: 3 },
	);
</script>
```

Both of the above will result in 3 simultaneous tasks being allowed to run. Triggering the task a fourth time will cancel the oldest task.

### Droppable task

This will cancel any new instances of the task. You can also provide a `max` that will only drop the task instances if the threshold is exceeded.

```svelte
<script>
	import { task } from '@sheepdog/svelte';

	const myTask = task.drop(
		async (param: number) => {
			await new Promise((r) => setTimeout(r, 2000));
			return param * 2;
		},
		{ max: 3 },
	);
</script>
```

OR

```svelte
<script>
	import { task } from '@sheepdog/svelte';

	const myTask = task(
		async (param: number) => {
			await new Promise((r) => setTimeout(r, 2000));
			return param * 2;
		},
		{ kind: 'drop', max: 3 },
	);
</script>
```

Both of the above will result in 3 simultaneous tasks being allowed to run. Triggering the task a fourth time will cause it to be cancelled, leaving the initial 3 task instances untouched.

### Enqueue task

This will add all task instances to a list and each task will be run in order. You can also provide a `max` that will dictate the number of task instances that will run at the same time.

```svelte
<script>
	import { task } from '@sheepdog/svelte';

	const myTask = task.enqueue(
		async (param: number) => {
			await new Promise((r) => setTimeout(r, 2000));
			return param * 2;
		},
		{ max: 3 },
	);
</script>
```

OR

```svelte
<script>
	import { task } from '@sheepdog/svelte';

	const myTask = task(
		async (param: number) => {
			await new Promise((r) => setTimeout(r, 2000));
			return param * 2;
		},
		{ kind: 'enqueue', max: 3 },
	);
</script>
```

Both of the above will result in 3 simultaneous tasks being allowed to run. Any additional instances of the task will be added to a list and run when there is space in the queue.

### KeepLatest task

This will run the initial tasks and then ensure that the very last task instance is also run. You can also provide a `max` that will dictate the number of task instances that will run initially. Note: `keepLatest` will only preserve the final _one_ task instance.

```svelte
<script>
	import { task } from '@sheepdog/svelte';

	const myTask = task.keepLatest(
		async (param: number) => {
			await new Promise((r) => setTimeout(r, 2000));
			return param * 2;
		},
		{ max: 3 },
	);
</script>
```

OR

```svelte
<script>
	import { task } from '@sheepdog/svelte';

	const myTask = task(
		async (param: number) => {
			await new Promise((r) => setTimeout(r, 2000));
			return param * 2;
		},
		{ kind: 'keepLatest', max: 3 },
	);
</script>
```

Both of the above will result in 3 simultaneous tasks being allowed to run initially. Triggering the task again will wait for the oldest to complete and then run the latest task instance, preserving the most recent instance.

### Accessing the task in the template

As the return value from the task wrapper is a store, you can access it just like you would with any other store:

```svelte
<script>
	import { task } from '@sheepdog/svelte';

	const myTask = task(async (param: number) => {
		await new Promise((r) => setTimeout(r, 2000));
		return param * 2;
	});
</script>

{$myTask.error}
{$myTask.isRunning}
{$myTask.lastSuccessful}
{$myTask.performCount}
{$myTask.results}
```

## Task Cancellation

With normal Promises, once you have triggered it to run, the only way to interrupt it is to implement your own series of checks at different intervals. With `@sheepdog/svelte` we offer two ways to attain this ability without having to handle it yourself:

### Generator functions

`@sheepdog/svelte` can utilize generator functions to give us fine-grain control of how far through our task will run when cancelled.

```ts
let data;

const instance = task(async function*() {
	const res = async fetch('...');
	yield;
	data = await res.json()
});
```

Using a generator function, we can now stop our function as soon as it is cancelled, that means that if we cancelled the task while the `fetch` request was running, the `data` attribute would not be reassigned.

### Async transform (recommended)

`@sheepdog/svelte` also includes a vite plugin that transforms your async functions into generators.

To set this up, you simply need to important the vite plugin and add it to your `plugins` array:

```diff
// vite.config.ts

import { sveltekit } from '@sveltejs/kit/vite';
import { coverageConfigDefaults, defineConfig } from 'vitest/config';
+ import { sheepdogTransform } from '@sheepdog/svelte/lib/vite';

export default defineConfig(({ mode }) => ({
-	plugins: [sveltekit()],
+	plugins: [sveltekit(), sheepdogTransform()],
	...
	})
)
```

Then you can use standard `async` functions in your `task` definition and under the hood, it will transform your code from this:

```ts
const instance = task(async () => {
	const res = await fetch('...');
});
```

to this:

```ts
const instance = task(async function* () {
	const res = yield fetch('...');
});
```

Meaning you get all of the functionality of generators without having to implement them yourself. And have no fear, this will only apply to async functions that you pass as a parameter to the `task` function from `@sheepdog/svelte`. (You can still use standard async promises as you would normally.)

## Task Utilities

As well as providing your own parameter as the first argument when creating your task function, you also have optional access to another object containing two useful utilities.

`signal` is the `AbortSignal` from the `AbortController`, this can be used to investigate the state of the signal of the current task instance.
`link` allows you to link the current task to another task, allowing automatic cancellation if the parent task is aborted, or if the child is cancelled, the parent will also be cancelled.

```ts
const parent_task = task(async () => {
	const res = await fetch('...');
	return res;
});
const child_task = task(async ({ my_param1, my_param2 }, { signal, link }) => {
	const res = await link(parent_task).perform();
	if (signal.aborted) {
		console.log("I've been cancelled 😭");
	}
});
```

## Contributing

### How to write async transform tests?

If you want to write a new test for the async transformation you just need to create a `code.js` file in a new folder in `./src/lib/tests/expected-transforms`. Try to give the folder a descriptive name and the run `pnpm generate-expected`. This will create a series of `transform.js` files in the various folder which will later be used to test the transform. If you are modifying the transform make sure to run the tests before running the `generate-expected` script!

P.s. If, after you run the script, you'll see a folder with `code.js` and no `transform.js` this means that in that case the transform will not apply.
