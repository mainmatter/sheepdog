<script lang="ts">
	import { task, type SvelteConcurrencyUtils } from '../../task';

	export let fn: (
		args: unknown,
		utils: SvelteConcurrencyUtils,
	) => Promise<unknown> | AsyncGenerator<unknown, unknown, unknown>;

	const default_task = task(fn);
</script>

<button
	data-testid="perform-default"
	on:click={() => {
		default_task.perform();
	}}>perform</button
>

<button
	data-testid="cancel-default"
	on:click={() => {
		default_task.cancelAll();
	}}>cancel</button
>
