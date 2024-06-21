<script lang="ts">
	import { task, type SvelteConcurrencyUtils } from '../../index';

	export let fn: (
		args: number,
		utils: SvelteConcurrencyUtils,
	) => Promise<unknown> | AsyncGenerator<unknown, unknown, unknown>;

	export let return_value: (value: unknown) => void = () => {};
	export let argument = 0;
	export let max = 1;

	export const default_task = task.restart(fn, { max });
	export const options_task = task(fn, { kind: 'restart', max });

	let latest_task_instance: ReturnType<typeof default_task.perform>;
	let latest_options_task_instance: ReturnType<typeof options_task.perform>;
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
			/** empty */
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
