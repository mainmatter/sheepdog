<script lang="ts">
	import { task } from '$lib/task.js';
	import Child from './Child.svelte';

	const parent = task(async function* (param: number) {
		await new Promise((r) => setTimeout(r, 5000));
		yield;
		alert('Parent finished');
		return param * 2;
	});

	const queue_log = task(
		async (param: number) => {
			await new Promise((r) => setTimeout(r, 2000));
			return param;
		},
		{ kind: 'enqueue', max: 3 },
	);

	const also_queue_log = task.enqueue(
		async (param: number) => {
			await new Promise((r) => setTimeout(r, 2000));
			return param;
		},
		{ max: 5 },
	);

	const restart_log = task.restart(
		async function* (param: number) {
			console.log('started ', param);
			await new Promise((r) => setTimeout(r, 2000));
			yield;
			console.log('finished ', param);
			return param;
		},
		{ max: 3 },
	);

	const drop_log = task.drop(async (param: number) => {
		await new Promise((r) => setTimeout(r, 2000));
		return param;
	});

	const latest_log = task(
		async (param: number) => {
			await new Promise((r) => setTimeout(r, 2000));
			return param;
		},
		{ kind: 'keepLatest', max: 3 },
	);

	let hidden = false;

	let x;

	let numbers: number[] = [];
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

<fieldset>
	<legend>restart_log</legend>
	<pre>{JSON.stringify($restart_log, null, '	')}</pre>

	<button
		on:click={() => {
			restart_log.perform(Math.random());
		}}
	>
		Perform
	</button>
</fieldset>

<fieldset>
	<legend>drop_log</legend>
	<pre>{JSON.stringify($drop_log, null, '	')}</pre>

	<button
		on:click={() => {
			drop_log.perform(Math.random());
		}}
	>
		Perform
	</button>
</fieldset>

<fieldset>
	<legend>latest_log</legend>
	<pre>{JSON.stringify($latest_log, null, '	')}</pre>

	<button
		on:click={() => {
			const num = Math.random();
			numbers = [...numbers, num];
			latest_log.perform(num);
		}}
	>
		Perform
	</button>
	<button
		on:click={() => {
			numbers = [];
		}}
	>
		Clear numbers
	</button>
	<ul>
		{#each numbers as number}
			<li>
				{number}
			</li>
		{/each}
	</ul>
</fieldset>

<button
	on:click={() => {
		hidden = !hidden;
	}}>{hidden ? 'mount' : 'unmount'} child</button
>
<button
	on:click={() => {
		parent.perform(43);
	}}>perform parent</button
>
{#if !hidden}
	<Child {parent} />
{/if}
