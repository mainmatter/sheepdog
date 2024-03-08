<script lang="ts">
	import { task } from '$lib/task.js';
	import Child from './Child.svelte';

	const parent = task(async function* (param: number) {
		await new Promise((r) => setTimeout(r, 2000));
		yield;
		alert('Parent finished');
		return param * 2;
	});

	const queue_log = task(
		async (param: number) => {
			console.log('starting');
			await new Promise((r) => setTimeout(r, 2000));
			console.log(param);
			return param;
		},
		{ kind: 'enqueue', max: 3 },
	);

	let hidden = false;
</script>

<pre>{JSON.stringify($queue_log, null, '	')}</pre>

<button
	on:click={() => {
		queue_log.perform(Math.random());
	}}
>
	Perform
</button>

<button
	on:click={() => {
		hidden = !hidden;
	}}>{hidden ? 'mount' : 'unmount'} child</button
>
{#if !hidden}
	<Child {parent} />
{/if}
