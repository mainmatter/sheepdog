---
title: task
description: the task function
---

```svelte
<script>
	import { task } from 'svelte-concurrency';

	const getCameras = task(async () => {
		return await getCameras();
	});
</script>

<button
	on:click={() => {
		getCameras.perform();
	}}>get cameras</button
>
```
