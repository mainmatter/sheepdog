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

	const also_queue_log = task.enqueue(
		async (param: number) => {
			console.log('starting');
			await new Promise((r) => setTimeout(r, 2000));
			console.log(param);
			return param;
		},
		{ max: 5 },
	);

	let hidden = false;

	let x;
</script>

<fieldset>
	<legend>queue_log</legend>

	<pre>{JSON.stringify($queue_log, null, '	')}</pre>

	<button
		on:click={async () => {
			x = queue_log.perform(Math.random());
		}}
	>
		Perform
	</button>
	<pre>{JSON.stringify($x, null, '	')}</pre>
</fieldset>

<fieldset>
	<legend>also_queue_log</legend>
	<pre>{JSON.stringify($also_queue_log, null, '	')}</pre>

	<button
		on:click={() => {
			also_queue_log.perform(Math.random());
		}}
	>
		Perform
	</button>
</fieldset>

<button
	on:click={() => {
		hidden = !hidden;
	}}>{hidden ? 'mount' : 'unmount'} child</button
>
{#if !hidden}
	<Child {parent} />
{/if}
