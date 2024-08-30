<script>
</script>

<div class="wrapper">
	<slot />
</div>

<style>
	.wrapper {
		display: inline-flex;
		align-items: center;
		border-radius: 2rem;
		border: 2px var(--sheepdog-primary) solid;
	}

	.wrapper > :global(button) {
		margin: 0;
		background-color: transparent;
		border: none;
		outline: none;
		min-width: 6rem;
		cursor: pointer;
		padding: 0.25rem 1rem;
		border-radius: calc(1rem + 1px);
		color: var(--sheepdog-primary);
	}

	.wrapper > :global(.active) {
		background-color: var(--sheepdog-primary);
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
