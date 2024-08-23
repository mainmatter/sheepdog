<script>
	import { task, didCancel } from '@sheepdog/svelte';
	import Timeline from './Timeline.svelte';
	import Tabs from '../../components/Tabs.svelte';

	let elements = [];
	let start;

	let selectedTaskType = 'enqueue';

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

	$: example_task = task(fn, { max: 1, kind: selectedTaskType });

	const setTaskType = (type) => {
		start = undefined;
		elements = [];
		selectedTaskType = type;
	};
</script>

<Tabs>
	{#each modifierTypes as type}
		<button on:click={() => setTaskType(type.value)} class:active={selectedTaskType === type.value}
			>{type.label}</button
		>
	{/each}
</Tabs>
<p>You can click an individual task instance to cancel it</p>

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
	}}>Add</button
>
<button
	on:click={() => {
		elements = [];
		start = undefined;
	}}>Clear timeline</button
>
{#if elements.length}
	<button
		on:click={() => {
			if (!$example_task.isRunning) return;
			example_task.cancelAll();
		}}>Cancel all</button
	>
{/if}
<Timeline {elements} />
