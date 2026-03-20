<script lang="ts">
	import { scrollProgress } from '$lib/stores/scroll';

	let progress = $state(0);
	const unsub = scrollProgress.subscribe((v) => (progress = v));

	import { onDestroy } from 'svelte';
	onDestroy(unsub);
</script>

<div
	class="fixed top-0 left-0 z-40 h-[2px] w-full origin-left"
	style="transform: scaleX({progress}); background: linear-gradient(90deg, #8b5cf6, #06b6d4);"
></div>
