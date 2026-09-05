<script lang="ts">
	import { onMount } from 'svelte';
	import { gsap } from '$lib/actions/gsap';

	let lineEl = $state<HTMLDivElement | null>(null);

	onMount(() => {
		if (!lineEl) return;

		const tl = gsap.fromTo(
			lineEl,
			{ scaleX: 0 },
			{
				scaleX: 1,
				ease: 'power2.out',
				duration: 1,
				scrollTrigger: {
					trigger: lineEl,
					start: 'top 90%',
					toggleActions: 'play none none none'
				}
			}
		);

		return () => tl.kill();
	});
</script>

<footer class="mx-auto max-w-6xl px-6 pb-12">
	<div
		bind:this={lineEl}
		class="mb-8 h-px w-full origin-left bg-border"
	></div>

	<div class="flex flex-col items-center justify-between gap-4 md:flex-row">
		<p class="font-mono text-xs text-text-subtle">
			&copy; {new Date().getFullYear()} Srthk Pthk
		</p>
		<p class="font-mono text-xs text-text-subtle">
			Built with SvelteKit + Three.js
		</p>
	</div>
</footer>
