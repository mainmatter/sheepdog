<script lang="ts">
	import { task } from '$lib/task.js';
	import Child from './Child.svelte';

	const parent = task(async function* (param: number) {
		await new Promise((r) => setTimeout(r, 2000));
		yield;
		alert('Parent finished');
		return param * 2;
	});

	let hidden = false;
</script>

<button
	on:click={() => {
		hidden = !hidden;
	}}>{hidden ? 'mount' : 'unmount'} child</button
>
{#if !hidden}
	<Child {parent} />
{/if}
