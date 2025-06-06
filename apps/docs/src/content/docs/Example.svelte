<script>
	import { task, didCancel } from '@sheepdog/svelte';
	import Timeline from './Timeline.svelte';
	import Tabs from '../../components/Tabs.svelte';

	/**
	 * @typedef {Object} Props
	 * @property {number} [max]
	 * @property {string} [selected_task_type]
	 * @property {boolean} [show_tabs]
	 */

	/** @type {Props} */
	let { max = 1, selected_task_type = $bindable('enqueue'), show_tabs = false } = $props();

	let elements = $state([]);
	let start = $state();

	const modifierTypes = [
		{ label: 'Enqueue', value: 'enqueue' },
		{ label: 'Drop', value: 'drop' },
		{ label: 'Restart', value: 'restart' },
		{ label: 'Keep Latest', value: 'keepLatest' },
		{ label: 'Default', value: 'default' },
	];

	async function* fn({ to_add, now }) {
		to_add.start = Date.now() - now;
		await new Promise((r) => setTimeout(r, 2000));
		yield;
		to_add.end = Date.now() - now;
	}

	const stop_after = 3000;
	let timeout;
	let stopped = $state(false);

	let example_task = $derived(task(fn, { max, kind: selected_task_type }));

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
				onclick={() => setTaskType(type.value)}
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
			onclick={() => {
				if (!start) {
					start = Date.now();
				}
				const now = Date.now();
				const to_add = $state({
					added: now - start,
					id: crypto.randomUUID(),
				});

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
			}}>Add</button
		>
	{/if}
	<button
		class="button"
		onclick={() => {
			start = undefined;
			stopped = false;
			elements = [];
			example_task.cancelAll();
		}}>Clear timeline</button
	>
	{#if elements.length}
		<button
			class="button"
			onclick={() => {
				if (!example_task.isRunning) return;
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
