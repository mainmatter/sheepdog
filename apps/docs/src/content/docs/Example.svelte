<script>
	import { task, didCancel } from '@sheepdog/svelte';
	import Timeline from './Timeline.svelte';
	import Tabs from '../../components/Tabs.svelte';
	import { readable } from 'svelte/store';

	export let max = 1;
	export let selected_task_type = 'enqueue';
	export let show_tabs = false;

	let elements = [];
	let start;

	const modifierTypes = [
		{ label: 'Enqueue', value: 'enqueue' },
		{ label: 'Drop', value: 'drop' },
		{ label: 'Restart', value: 'restart' },
		{ label: 'Keep Latest', value: 'keepLatest' },
		{ label: 'Default', value: 'default' },
	];

	async function* fn({ to_add, now }) {
		to_add.start = Date.now() - now;
		elements = elements;
		await new Promise((r) => setTimeout(r, 2000));
		yield;
		to_add.end = Date.now() - now;
		elements = elements;
	}

	const stop_after = 3000;
	let timeout;
	let stopped = false;

	$: example_task = task(fn, { max, kind: selected_task_type });

	const set_stop_time = () => {
		clearTimeout(timeout);
		timeout = setTimeout(() => (stopped = true), stop_after);
	};

	const setTaskType = (type) => {
		example_task.cancelAll();
		start = undefined;
		setTimeout(() => clearTimeout(timeout), 0);
		elements = [];
		stopped = false;
		selected_task_type = type;
	};
</script>

{#if show_tabs}
	<Tabs>
		{#each modifierTypes as type}
			<button
				on:click={() => setTaskType(type.value)}
				class:active={selected_task_type === type.value}>{type.label}</button
			>
		{/each}
	</Tabs>
	<p>You can click an individual task instance to cancel it</p>
{/if}
<div class="actions">
	{#if !stopped}
		<button
			class="button"
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

				task
					.then(() => {
						set_stop_time();
					})
					.catch((e) => {
						if (didCancel(e)) {
							to_add.end = Date.now() - now;
							elements = elements;
							set_stop_time();
						}
					});
				elements.push(to_add);
				elements = elements;
			}}>Add</button
		>
	{/if}
	<button
		class="button"
		on:click={() => {
			start = undefined;
			stopped = false;
			elements = [];
			example_task.cancelAll();
		}}>Clear timeline</button
	>
	{#if elements.length}
		<button
			class="button"
			on:click={() => {
				if (!$example_task.isRunning) return;
				example_task.cancelAll();
			}}>Cancel all</button
		>
	{/if}
</div>
<Timeline {elements} {stopped} />

<style>
	.actions {
		display: flex;
		gap: 0.5rem;
		align-items: center;
	}

	.actions .button {
		margin-top: 0;
	}
</style>
