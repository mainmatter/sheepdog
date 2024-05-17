<script lang="ts">
	import { task, type Task } from '../../../index';

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	export let parent: Task<number, any>;
	export let kind: string;

	const default_task = task.default(async (_, { link }) => {
		await link(parent).perform(0);
	});
	const options_task = task(
		async (_, { link }) => {
			await link(parent).perform(0);
		},
		{ kind: 'default' },
	);
</script>

<button
	data-testid="child-component-perform-{kind}"
	on:click={async () => {
		if (kind === 'default') {
			default_task.perform();
		} else {
			options_task.perform();
		}
	}}>perform</button
>
