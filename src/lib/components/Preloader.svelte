<script lang="ts">
	import { onMount } from 'svelte';
	import { isLoading, loadProgress } from '$lib/stores/loading';

	let count = $state(0);
	let hiding = $state(false);

	onMount(() => {
		const duration = 2000;
		const start = performance.now();

		const tick = (now: number) => {
			const elapsed = now - start;
			const progress = Math.min(elapsed / duration, 1);
			// Ease out cubic
			count = Math.floor(progress * 100);
			loadProgress.set(count);

			if (progress < 1) {
				requestAnimationFrame(tick);
			} else {
				count = 100;
				setTimeout(() => {
					hiding = true;
					setTimeout(() => {
						isLoading.set(false);
					}, 800);
				}, 300);
			}
		};

		requestAnimationFrame(tick);
	});
</script>

{#if $isLoading}
	<div
		data-testid="preloader"
		class="fixed inset-0 z-[9998] flex items-center justify-center bg-bg"
		style="transform: translateY({hiding ? '-100%' : '0'}); transition: transform 0.8s cubic-bezier(0.76, 0, 0.24, 1);"
	>
		<div class="relative">
			<span class="font-mono text-7xl font-bold tabular-nums text-text-primary md:text-9xl">
				{String(count).padStart(3, '0')}
			</span>
			<div class="mt-4 h-px w-full bg-border">
				<div
					class="h-full bg-gradient-to-r from-accent-violet to-accent-cyan"
					style="width: {count}%; transition: width 0.1s;"
				></div>
			</div>
		</div>
	</div>
{/if}
