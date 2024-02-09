<script lang="ts">
	import { task } from '$lib/task.js';
	import type { Task } from '$lib/task.js';

	export let parent: Task<number, number>;

	const child = task(async function* (_, { link }) {
		const num = await link(parent).perform(1);
		await new Promise((r) => setTimeout(r, 2000));
		yield;
		alert('Child finished');
		return num * 2;
	});
</script>

<button
	on:click={async () => {
		const num = await child.perform();
		alert(`Result: ${num}`);
	}}>Perform child</button
>
<pre>{JSON.stringify($child, null, '	')}</pre>
