<script lang="ts">
	import { timeout } from '$lib';
	import { task } from '$lib/task.svelte.js';
	import type { Task } from '$lib/task.svelte.js';

	export let parent: Task<number, number>;

	const child = task(async function* (_, { link }) {
		const num = await link(parent).perform(1);
		await timeout(2000);
		yield;
		alert('Child finished');
		return num * 2;
	});

	let num: ReturnType<typeof child.perform>;
</script>

<button
	onclick={async () => {
		num = child.perform();
		alert(`Result: ${await num}`);
	}}>Perform child</button
>
<button
	onclick={() => {
		num.cancel();
	}}>cancel child last instance</button
>
<pre>{JSON.stringify(child, null, '	')}</pre>
