<script lang="ts">
	import { task, type SvelteConcurrencyUtils } from '../../task';

	export let fn: (
		args: number,
		utils: SvelteConcurrencyUtils,
	) => Promise<unknown> | AsyncGenerator<unknown, unknown, unknown>;

	export let return_value: (value: unknown) => void = () => {};
	export let argument = 0;

	const default_task = task(fn);

	let latest_task_instance: ReturnType<typeof default_task.perform>;
</script>

<button
	data-testid="perform-default"
	on:click={async () => {
		latest_task_instance = default_task.perform(argument);
		return_value(await latest_task_instance);
	}}>perform</button
>

<button
	data-testid="cancel-default"
	on:click={() => {
		default_task.cancelAll();
	}}>cancel</button
>

<button
	data-testid="cancel-default-last"
	on:click={() => {
		if (latest_task_instance) {
			latest_task_instance.cancel();
		}
	}}>cancel last instance</button
>
