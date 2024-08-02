<script lang="ts">
	import { task, type SheepdogUtils } from '../../index';

	export let fn: (
		args: number,
		utils: SheepdogUtils,
	) => Promise<unknown> | AsyncGenerator<unknown, unknown, unknown>;

	export let return_value: (value: unknown) => void = () => {};
	export let argument = 0;

	export const default_task = task.default(fn);
	export const options_task = task(fn, { kind: 'default' });

	export const default_instances: Array<ReturnType<typeof default_task.perform>> = [];
	export const options_instances: Array<ReturnType<typeof options_task.perform>> = [];

	let latest_task_instance: ReturnType<typeof default_task.perform>;
	let latest_options_task_instance: ReturnType<typeof options_task.perform>;
</script>

<button
	data-testid="perform-default"
	on:click={async () => {
		try {
			latest_task_instance = default_task.perform(argument);
			default_instances.push(latest_task_instance);
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
			options_instances.push(latest_options_task_instance);
			return_value(await latest_options_task_instance);
		} catch {
			/**empty*/
		}
	}}>perform options</button
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
	data-testid="perform-error"
	on:click={async () => {
		try {
			await default_task.perform(argument);
		} catch (e) {
			return_value({
				error: e,
				store: default_task,
			});
		}
	}}>perform</button
>
