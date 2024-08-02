<script>
	export let task;
	export let top;
	export let height;
	export let width;
	export let left;
	export let idle;
</script>

<button
	type="button"
	on:click={() => {
		if ($task.isFinished) return;
		task.cancel();
	}}
	class="element"
	class:canceled={$task.isCanceled}
	class:completed={$task.isSuccessful}
	class:dropped={!$task.hasStarted && $task.isCanceled}
	style:--top={top}
	style:--height={height}
	style:--width={width}
	style:--left={left}
	style:--idle={idle}
>
	<span class="queued">
		<span class="status"> Queued </span>
	</span>
	{#if $task.hasStarted}
		<span class="started">
			<span class="status">
				{#if $task.isSuccessful}
					Finished
				{:else if $task.isRunning}
					Running
				{/if}
			</span>
		</span>
	{/if}
	{#if $task.isCanceled}
		<span class="status">
			{#if $task.hasStarted}
				Canceled
			{:else}
				Dropped
			{/if}
		</span>
	{/if}
</button>

<style>
	.element {
		position: absolute;
		border: none;
		top: calc(var(--top) * 1px);
		left: 0;
		transform: translateX(calc(var(--left) * 1px));
		height: calc(var(--height) * 1px);
		width: calc(var(--width) * 1px);
		box-sizing: border-box;
		border-radius: 25px 0 0 25px;
		display: flex;
		align-items: center;
		justify-content: start;
		margin: 0;
		cursor: pointer;
		overflow: hidden;
		background: transparent;
		color: var(--sl-color-black);
		border-left: 2px solid var(--sl-color-black);
	}

	.completed {
		border-radius: 25px;
	}

	.canceled {
		border-left: none;
		background-color: var(--color-canceled);
	}

	.dropped {
		padding: 0;
		overflow: visible;
		width: 3px;
		color: var(--color-canceled);
	}

	.dropped .status {
		margin-left: 5px;
	}

	.queued {
		border: 5px var(--color-waiting) solid;
		background-color: var(--sl-color-black);
		border-right: none;
		position: absolute;
		inset: 0;
		border-radius: 25px 0 0 25px;
		display: flex;
		align-items: center;
		z-index: 0;
		color: var(--color-waiting);
	}

	.started {
		background-color: var(--color-running);
		position: absolute;
		display: flex;
		align-items: center;
		inset: 0;
		border-radius: 25px 0 0 25px;
		z-index: 0;
		left: calc(var(--idle) * 1px);
	}

	.canceled .queued,
	.canceled .started {
		display: none;
	}

	.status {
		display: inline-block;
		padding-inline: min(22px, 10%);
		z-index: 1;
		font-weight: 600;
	}
</style>
