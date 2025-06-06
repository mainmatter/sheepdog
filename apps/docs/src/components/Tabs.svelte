<script>
	/**
	 * @typedef {Object} Props
	 * @property {import('svelte').Snippet} [children]
	 */

	/** @type {Props} */
	let { children } = $props();
</script>

<div class="wrapper">
	{@render children?.()}
</div>

<style>
	.wrapper {
		display: inline-flex;
		align-items: center;
		border-radius: 2rem;
		border: 2px var(--sl-color-white) solid;
		max-width: calc(100vw - 2rem);
		overflow-x: auto;
	}

	.wrapper > :global(button) {
		margin: 0;
		background-color: transparent;
		border: none;
		outline: none;
		min-width: 6rem;
		cursor: pointer;
		padding: 0.25rem 1rem;
		border-radius: 3rem;
		color: var(--sl-color-white);
		font-weight: bold;
		white-space: nowrap;
	}

	.wrapper > :global(.active) {
		background-color: var(--sl-color-white);
		color: var(--sl-color-black);
	}

	:global([data-theme='dark']) .wrapper {
		border-color: var(--sl-color-white);
	}

	:global([data-theme='dark']) .wrapper > :global(.active) {
		background-color: var(--sl-color-white);
		color: var(--sl-color-black);
	}

	:global([data-theme='dark']) .wrapper > :global(button) {
		color: var(--sl-color-white);
	}
</style>
