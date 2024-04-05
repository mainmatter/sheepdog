# svelte-concurrency

Handle async task with ease thanks to `svelte-concurrency`

## Async transform

One of the problems of Promises is that they can't be really canceled...once you invoke a promise there's no other way than do a series of if checks to "cancel" it. This is not the case for async generators. When you yield something back it's up to the invoker to continue calling next or stop indefinitely.

> But generators are scary!

Understandable...that's why `svelte-concurrency` also includes a `vite` plugin that transforms your async functions in generators! This will transform your code from this:

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

allowing `svelte-concurrency` to interrupt your function if you call it mid-execution. And have no fear, this will only apply to async functions that you pass as parameter to the task function from `svelte-concurrency`!

## How to write async transform tests?

If you want to write a new test for the async transformation you just need to create a `code.js` file in a new folder in `./src/lib/tests/expected-transforms`. Try to give the folder a descriptive name and the run `pnpm generate-expected`. This will create a series of `transform.js` files in the various folder which will later be used to test the transform. If you are modifying the transform make sure to run the tests before running the `generate-expected` script!

P.s. If, after you run the script, you'll see a folder with `code.js` and no `transform.js` this means that in that case the transform will not apply.
