<script>
	import Example from './Example.svelte';

	export let selected_task_type = 'default';
	export let show_max = true;
	let max = 1;
</script>

<fieldset>
	<legend>task{selected_task_type !== 'default' ? `.${selected_task_type}` : ''}</legend>
	{#if show_max}
		<label><code>max:<input type="number" bind:value={max} /></code></label>
	{/if}
	<Example {max} show_tabs={false} {selected_task_type} />
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
