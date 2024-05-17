# svelte-concurrency

Handle async tasks with ease thanks to `svelte-concurrency`.

## What is it?

`svelte-concurrency` supplies a simple way to introduce cancellable concurrency into your app. Not only do they provide the cancellability that is missing from normal Promises, `svelte-concurrency` also provides a public API that allows you to observe the running state of your task without having to set a single flag manually.

Tasks that live on components are automatically cancelled when their context is destroyed, meaning you don't need to worry about the clean up - we've got you covered.

Choose whether you want to keep the oldest, keep the newest or keep all instances of your task to help boost the performance of your app and reduce unnecessary server load.

## How to use `svelte-concurrency`

Install it using your favourite package manager:

```bash
	pnpm install svelte-concurrency
```

Then put it to work immediately wherever you want cancellable promises.

## Task structure

All tasks will return a store with the same structure:

- error: Error - if an error occurred, it will be returned here,
- results: Array - all of the results from previous invocations of this task,
- lastSuccessful: Any - the return value from the last successful run of the task
- isLoading: Boolean - whether the task is currently running on not

## Task types

There are several flavours of tasks to choose from (check out the interactive docs here [insert link to site when ready]).

With all types of task, it is possible to invoke it directly or add the `kind` parameter to the options object.

### Standard/default task

This simply gives you a task wrapper around your function. It will not handle any kind of concurrency for you.

```ts
<script>
	import { task } from 'svelte-concurrency';

	const my_task = task(async function* (param: number) {
		await new Promise((r) => setTimeout(r, 2000));
		return param * 2;
	});
</script>
```

OR

```ts
<script>
	import { task } from 'svelte-concurrency';

	const my_task = task(async function* (param: number) {
		await new Promise((r) => setTimeout(r, 2000));
		return param * 2;
	}, { kind: 'default' });
</script>
```

### Restartable task

This will cancel the oldest instance of the task and start a new instance of it. You can also provide a `max` that will only restart the oldest task instance if the threshold is exceeded.

```ts
<script>
	import { task } from 'svelte-concurrency';

	const my_task = task.restart(async function* (param: number) {
		await new Promise((r) => setTimeout(r, 2000));
		return param * 2;
	}, { max: 3 });
</script>
```

OR

```ts
<script>
	import { task } from 'svelte-concurrency';

	const my_task = task(async function* (param: number) {
		await new Promise((r) => setTimeout(r, 2000));
		return param * 2;
	}, { kind: 'restart', max: 3 });
</script>
```

Both of the above will result in 3 simultaneous tasks being allowed to run. Triggering the task a fourth time will cancel the oldest task.

### Droppable task

This will cancel any new instances of the task. You can also provide a `max` that will only drop the task instances if the threshold is exceeded.

```ts
<script>
	import { task } from 'svelte-concurrency';

	const my_task = task.drop(async function* (param: number) {
		await new Promise((r) => setTimeout(r, 2000));
		return param * 2;
	}, { max: 3 });
</script>
```

OR

```ts
<script>
	import { task } from 'svelte-concurrency';

	const my_task = task(async function* (param: number) {
		await new Promise((r) => setTimeout(r, 2000));
		return param * 2;
	}, { kind: 'drop', max: 3 });
</script>
```

Both of the above will result in 3 simultaneous tasks being allowed to run. Triggering the task a fourth time will be cancelled and won't retry automatically.

### Enqueue task

This will add all task instances to a list and each task will be run in order. You can also provide a `max` that will dictate the number of task instances that will run at the same time.

```ts
<script>
	import { task } from 'svelte-concurrency';

	const my_task = task.enqueue(async function* (param: number) {
		await new Promise((r) => setTimeout(r, 2000));
		return param * 2;
	}, { max: 3 });
</script>
```

OR

```ts
<script>
	import { task } from 'svelte-concurrency';

	const my_task = task(async function* (param: number) {
		await new Promise((r) => setTimeout(r, 2000));
		return param * 2;
	}, { kind: 'enqueue', max: 3 });
</script>
```

Both of the above will result in 3 simultaneous tasks being allowed to run. Any additional instances of the task will be added to a list and run when there is space in the queue.

### Accessing the task in the template

As the return value from the task wrapper is a store, you can access it just like you would with any other store:

```
{$my_task.isLoading}
{$my_task.lastSuccessful}
{$my_task.error}
```

## Async transform

One of the problems with Promises is that they can't really be canceled; once you invoke a promise the only way to "cancel" it is to do a series of checks, but this isn't actually cancelling the promise. Whereas with async generators, when you yield something back it's up to the invoker to continue calling next or stop indefinitely.

> But generators are scary!

We hear you, that's why `svelte-concurrency` also includes a `vite` plugin that transforms your async functions into generators! This will transform your code from this:

```ts
const instance = task(async () => {
	const res = await fetch('...');
});
```

to this

```ts
const instance = task(async function* () {
	const res = await fetch('...');
	yield;
});
```

meaning you get all of the functionality of generators without having to implement them yourself. And have no fear, this will only apply to async functions that you pass as a parameter to the `task` function from `svelte-concurrency`. (You can still use standard async promises as you would normally.)

## How to write async transform tests?

If you want to write a new test for the async transformation you just need to create a `code.js` file in a new folder in `./src/lib/tests/expected-transforms`. Try to give the folder a descriptive name and the run `pnpm generate-expected`. This will create a series of `transform.js` files in the various folder which will later be used to test the transform. If you are modifying the transform make sure to run the tests before running the `generate-expected` script!

P.s. If, after you run the script, you'll see a folder with `code.js` and no `transform.js` this means that in that case the transform will not apply.
