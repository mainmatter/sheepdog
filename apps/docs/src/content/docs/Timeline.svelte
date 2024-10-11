<script>
	import { onDestroy } from 'svelte';
	import TimelineItem from './TimelineItem.svelte';

	export let elements = [];
	export let lines = 6;
	export let gap = 15;
	export let total_time = 10000;
	export let stopped;

	let wrapper_width;
	let wrapper_height;

	function resize(node) {
		const resize_observer = new ResizeObserver(([div]) => {
			// make sure the line stays visible
			wrapper_width = div.contentRect.width - 2;
			wrapper_height = div.contentRect.height;
		});
		resize_observer.observe(node);
		return {
			destroy() {
				resize_observer.unobserve(node);
			},
		};
	}
	let elapsed = 0;
	let start_time = 0;
	let started = false;
	let finished = false;

	onDestroy(() => {
		finished = true;
	});

	function loop(time) {
		if (finished) return;
		if (stopped) return;
		if (!started) {
			started = true;
		}
		if (start_time) {
			elapsed = time - start_time;
		}
		if (elapsed === 0) {
			start_time = time;
		}
		requestAnimationFrame(loop);
	}
	$: if (elements.length > 0 && !started) {
		finished = false;
		loop();
	}

	$: if (elements.length === 0) {
		started = false;
		finished = true;
		start_time = 0;
		elapsed = 0;
	}

	$: total = Math.max(total_time, elapsed);
</script>

<div class="wrapper" use:resize>
	<div style:--left={(elapsed / Math.max(total_time, elapsed)) * wrapper_width} class="line"></div>
	{#each elements as element, i (element.id)}
		<TimelineItem
			task={element.task}
			top={(i % lines) * ((wrapper_height - 2 * gap) / lines) + gap}
			height={(wrapper_height - 2 * gap) / lines - gap / 2}
			width={((element.end ?? elapsed - element.added) / total) * wrapper_width}
			left={(element.added / total) * wrapper_width}
			idle={(element.start / total) * wrapper_width}
		/>
	{/each}
</div>

{#if stopped}
	<p>
		For the sake of the example, the timeline gets stopped after 3 seconds without a running task.
		To restart the example, click "Clear timeline".
	</p>
{/if}

<style>
	.wrapper {
		height: 300px;
		position: relative;
		background: transparent;
		overflow: hidden;
	}
	.line {
		position: absolute;
		top: 0;
		bottom: 0;
		transform: translateX(calc(var(--left) * 1px));
		border-left: 2px solid var(--sl-color-text);
		background: transparent;
		z-index: 1;
	}
</style>
