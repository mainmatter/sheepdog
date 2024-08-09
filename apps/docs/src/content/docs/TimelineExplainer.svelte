<script>
	import { task, didCancel } from '@sheepdog/svelte';
	import Timeline from './Timeline.svelte';

	let elements = [];
	let start;

	export let selected_task_type = 'default';
	export let show_max = true;
	let max = 1;

	async function* fn({ to_add, now }) {
		to_add.start = Date.now() - now;
		elements = elements;
		await new Promise((r) => setTimeout(r, 2000));
		yield;
		to_add.end = Date.now() - now;
		elements = elements;
	}

	$: example_task = task(fn, { max, kind: selected_task_type });

	$: {
		selected_task_type;
		max;
		start = undefined;
		elements = [];
	}
</script>

<fieldset>
	<legend>task{selected_task_type !== 'default' ? `.${selected_task_type}` : ''}</legend>
	<button
		on:click={() => {
			if (!start) {
				start = Date.now();
			}
			const now = Date.now();
			const to_add = {
				added: now - start,
				id: crypto.randomUUID(),
			};

			const task = example_task.perform({ to_add, now });
			to_add.task = task;

			task.catch((e) => {
				if (didCancel(e)) {
					to_add.end = Date.now() - now;
					elements = elements;
				}
			});
			elements.push(to_add);
			elements = elements;
		}}>perform</button
	>
	<button
		on:click={() => {
			elements = [];
			start = undefined;
		}}>clear timeline</button
	>
	{#if elements.length}
		<button
			on:click={() => {
				if (!$example_task.isRunning) return;
				example_task.cancelAll();
			}}>cancelAll</button
		>
	{/if}
	{#if show_max}
		<label><code>max:<input type="number" bind:value={max} /></code></label>
	{/if}
	<Timeline {elements} />
</fieldset>

<style>
	fieldset {
		border: 1px solid var(--sl-color-text);
		padding: 1.5rem;
		margin-block: 2rem;
	}
	legend {
		padding-inline: 1.5rem;
	}
	label {
		display: block;
	}
	input {
		min-width: none;
		width: 5rem;
		padding-inline: 0.5rem;
		border: 0;
		background-color: transparent;
	}
</style>
