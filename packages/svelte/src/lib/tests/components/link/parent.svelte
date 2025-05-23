<script lang="ts">
	import { task, type SheepdogUtils } from '../../../index.js';
	import Child from './child.svelte';

	export let fn: (
		args: number,
		utils: SheepdogUtils,
	) => Promise<unknown> | AsyncGenerator<unknown, unknown, unknown>;

	export let return_value: (value: unknown) => void = () => {};
	export let argument = 0;

	const default_task = task.default(fn);
	const options_task = task(fn, { kind: 'default' });

	const default_task_child = task.default(async (_, { link }) => {
		try {
			await link(default_task).perform(argument);
		} catch {
			/** empty */
		}
	});

	const default_options_task_child = task.default(async (_, { link }) => {
		try {
			await link(options_task).perform(argument);
		} catch {
			/** catch */
		}
	});

	let latest_task_instance: ReturnType<typeof default_task.perform>;
	let latest_task_child_instance: ReturnType<typeof default_task_child.perform>;
	let latest_options_task_child_instance: ReturnType<typeof default_options_task_child.perform>;
	let latest_options_task_instance: ReturnType<typeof options_task.perform>;

	let mounted = true;
</script>

<button
	data-testid="perform-default"
	on:click={async () => {
		try {
			latest_task_instance = default_task.perform(argument);
			return_value(await latest_task_instance);
		} catch {
			/**empty*/
		}
	}}>perform</button
>

<button
	data-testid="perform-options"
	on:click={async () => {
		try {
			latest_options_task_instance = options_task.perform(argument);
			return_value(await latest_options_task_instance);
		} catch {
			/**empty*/
		}
	}}>perform options</button
>

<button
	data-testid="perform-child-default"
	on:click={async () => {
		try {
			latest_task_child_instance = default_task_child.perform();
			await latest_task_child_instance;
		} catch {
			/**empty*/
		}
	}}>perform child</button
>

<button
	data-testid="perform-child-options"
	on:click={async () => {
		try {
			latest_options_task_child_instance = default_options_task_child.perform();
			await latest_options_task_child_instance;
		} catch {
			/**empty*/
		}
	}}>perform child options</button
>

<button
	data-testid="cancel-default"
	on:click={() => {
		default_task.cancelAll();
	}}>cancel</button
>

<button
	data-testid="cancel-options"
	on:click={() => {
		options_task.cancelAll();
	}}>cancel options</button
>

<button
	data-testid="cancel-child-default"
	on:click={() => {
		default_task_child.cancelAll();
	}}>cancel child</button
>

<button
	data-testid="cancel-child-options"
	on:click={() => {
		default_options_task_child.cancelAll();
	}}>cancel child options</button
>

<button
	data-testid="cancel-default-last"
	on:click={() => {
		if (latest_task_instance) {
			latest_task_instance.cancel();
		}
	}}>cancel last instance</button
>

<button
	data-testid="cancel-options-last"
	on:click={() => {
		if (latest_options_task_instance) {
			latest_options_task_instance.cancel();
		}
	}}>cancel last options instance</button
>

<button
	data-testid="cancel-child-default-last"
	on:click={() => {
		if (latest_task_child_instance) {
			latest_task_child_instance.cancel();
		}
	}}>cancel last child instance</button
>

<button
	data-testid="cancel-child-options-last"
	on:click={() => {
		if (latest_options_task_child_instance) {
			latest_options_task_child_instance.cancel();
		}
	}}>cancel last child options instance</button
>

<button
	data-testid="unmount-child-component"
	on:click={() => {
		mounted = !mounted;
	}}>unmount child component</button
>
{#if mounted}
	<Child parent={default_task} kind="default" />
	<Child parent={options_task} kind="options" />
{/if}
