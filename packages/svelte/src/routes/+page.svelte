<script lang="ts">
	import { task, TaskInstance } from '$lib/task.svelte.js';
	import { timeout } from '$lib/utils.js';
	import Child from './Child.svelte';

	// NOTE: the tasks don't work exactly as we would expect them to here
	// because asyncTransform looks for the `@sheepdog/svelte` import which
	// we don't have here for obvious reasons, to play around with the AsyncTransform
	// working correctly, use this SvelteLab - https://www.sveltelab.dev/nbyg7vep9ock4y0

	const parent = task(async function* (param: number) {
		await timeout(5000);
		yield;
		alert('Parent finished');
		return param * 2;
	});

	const queue_log = task(
		async (param: number) => {
			await timeout(2000);
			return param;
		},
		{ kind: 'enqueue', max: 3 },
	);

	const also_queue_log = task.enqueue(
		async (param: number) => {
			await timeout(2000);
			return param;
		},
		{ max: 5 },
	);

	const restart_log = task.restart(
		async function* (param: number) {
			console.log('started ', param);
			await timeout(2000);
			yield;
			console.log('finished ', param);
			return param;
		},
		{ max: 3 },
	);

	const drop_log = task.drop(async (param: number) => {
		await timeout(2000);
		return param;
	});

	const latest_log = task(
		async (param: number) => {
			await timeout(2000);
			return param;
		},
		{ kind: 'keepLatest', max: 3 },
	);

	let hidden = false;

	let x: TaskInstance<number>;

	let numbers: number[] = [];
</script>

<fieldset>
	<legend>queue_log</legend>

	<pre>{JSON.stringify(queue_log, null, '	')}</pre>

	<button
		onclick={async () => {
			x = queue_log.perform(Math.random());
			console.log('awaited', await x);
		}}
	>
		Perform
	</button>
	<pre>{JSON.stringify(x, null, '	')}</pre>
</fieldset>

<fieldset>
	<legend>also_queue_log</legend>
	<pre>{JSON.stringify(also_queue_log, null, '	')}</pre>

	<button
		onclick={() => {
			also_queue_log.perform(Math.random());
		}}
	>
		Perform
	</button>
</fieldset>

<fieldset>
	<legend>restart_log</legend>
	<pre>{JSON.stringify(restart_log, null, '	')}</pre>

	<button
		onclick={() => {
			restart_log.perform(Math.random());
		}}
	>
		Perform
	</button>
</fieldset>

<fieldset>
	<legend>drop_log</legend>
	<pre>{JSON.stringify(drop_log, null, '	')}</pre>

	<button
		onclick={() => {
			drop_log.perform(Math.random());
		}}
	>
		Perform
	</button>
</fieldset>

<fieldset>
	<legend>latest_log</legend>
	<pre>{JSON.stringify(latest_log, null, '	')}</pre>

	<button
		onclick={() => {
			const num = Math.random();
			numbers = [...numbers, num];
			latest_log.perform(num);
		}}
	>
		Perform
	</button>
	<button
		onclick={() => {
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
	onclick={() => {
		hidden = !hidden;
	}}>{hidden ? 'mount' : 'unmount'} child</button
>
<button
	onclick={() => {
		parent.perform(43);
	}}>perform parent</button
>
{#if !hidden}
	<Child {parent} />
{/if}
