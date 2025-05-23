<script lang="ts">
	import { task, type Task } from '../../../index.js';

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	export let parent: Task<number, any>;
	export let kind: string;

	const default_task = task.default(async (_, { link }) => {
		try {
			await link(parent).perform(0);
		} catch {
			/** empty */
		}
	});
	const options_task = task(
		async (_, { link }) => {
			try {
				await link(parent).perform(0);
			} catch {
				/** */
			}
		},
		{ kind: 'default' },
	);
</script>

<button
	data-testid="child-component-perform-{kind}"
	on:click={async () => {
		try {
			if (kind === 'default') {
				await default_task.perform();
			} else {
				await options_task.perform();
			}
		} catch {
			/**empty*/
		}
	}}>perform</button
>
