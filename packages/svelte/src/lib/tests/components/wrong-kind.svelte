<script lang="ts">
	import { task } from '../../index.js';

	// @ts-expect-error something doesn't exists
	task(async () => {}, { kind: 'something' });
</script>
