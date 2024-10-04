<script>
	import { task } from '@sheepdog/svelte';

	let sheep = [
		'Autumn', 'Buttercup', 'Chloe', 'Dolly', 'Emma', 'Freddie'
	]

	let timeout = (t) => new Promise(r => setTimeout(r,t));
	let searchTask = task.restart(async function*(value) {
		yield timeout(500);
		return sheep.filter(s => s.toLowerCase().includes(value.toLowerCase()));
	});

	function getTaskState(searchTask) {
		if (searchTask.isRunning) {
			return 'running';
		} else if (searchTask.isCanceled) {
			return 'canceled';
		} else if (searchTask.isError) {
			return 'error';
		} else {
			return 'idle';
		}
	};
	$: taskState = getTaskState($searchTask);
</script>

<div class="demo">
	<label class="label">
		Search <span class="state">State: {taskState}</span>
		<input type="text" on:input={({ target: { value }}) => searchTask.perform(value)}/>
	</label>

	<ul class="sheep">
		{#if $searchTask.isRunning}
			<li>Loading...</li>
		{:else if $searchTask.lastSuccessful}
			{#if $searchTask.lastSuccessful.value.length}
				{#each $searchTask.lastSuccessful.value as name}
					<li>{name}</li>
				{/each}
			{:else}
				<li><i>No sheep found</i></li>
			{/if}
		{:else}
			{#each sheep as name}
				<li>{name}</li>
			{/each}
		{/if}
	</ul>
</div>

<style>
	.label {
		font-weight: bold;
		display: block;
	}

	.state {
	  float: right;
	}

	.label input {
			font-weight: normal;
			display: block;
			width: 100%;
      background: var(--sl-color-gray-4);
			border: 2px solid var(--sl-color-white);
			border-radius: 0.5rem;
			margin: 0;
			padding: 0.25rem 0.5rem;
	}

  :global([data-theme='light']) .label input {
      background: #fff;
	}

	.sheep {
		list-style: none;
		margin: 0.5rem 0 0 0;
		padding: 0.5rem 0;
		background: var(--sl-color-gray-4);
		border-radius: 0.75rem;
		box-shadow: var(--sl-shadow-md)
	}

  :global([data-theme='light']) .sheep {
		background: #fff;
	}

	.sheep li {
		padding: 0.5rem 1rem;
	}

	.demo {
		background: var(--sl-color-black);
		color: var(--sl-color-white);
		border: 2px solid var(--sl-color-white);
		border-radius: 1.25rem;
		padding: 1rem 2rem 2rem;
		display: block;
		width: 100%;
		min-height: 428px;
	}
</style>