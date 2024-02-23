<script lang="ts">
	import { task } from '$lib/task.js';

  let count: number = 0;

  const incrementBy = task(async function* ([increment]: [increment: number]) {
    let speed = 400;
    while (true) {
      count = count + increment;
      await new Promise((r) => setTimeout(r, speed));
		  yield;
      speed = Math.max(50, speed * 0.8);
    }
  });

</script>

<p>Hold down the buttons to accelerate:</p>
<p>Count: {count}</p>
<button
	on:mousedown={async () => {
		await incrementBy.perform(-1);
	}}
  on:mouseup={async () => {
		await incrementBy.cancel();
	}}
>-- Decrease</button>
<button
	on:mousedown={async () => {
		await incrementBy.perform(1);
	}}
  on:mouseup={async () => {
		await incrementBy.cancel();
	}}
>Increase ++</button>

<p>This example is inspired by 
  <a target="_blank" rel="noopener noreferrer" href="http://ember-concurrency.com/docs/examples/increment-buttons">
    ember-concurrency example "Accelerating Increment / Decrement Buttons"
  </a>
</p>
