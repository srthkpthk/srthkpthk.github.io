<script lang="ts">
	import { onNavigate, afterNavigate } from '$app/navigation';
	import { gsap } from '$lib/actions/gsap';

	let overlay = $state<HTMLDivElement | null>(null);
	let navigating = false;

	onNavigate(() => {
		if (!overlay) return;
		navigating = true;
		return new Promise<void>((resolve) => {
			gsap.fromTo(
				overlay,
				{ y: '100%' },
				{
					y: '0%',
					duration: 0.5,
					ease: 'power4.inOut',
					onComplete: resolve
				}
			);
		});
	});

	afterNavigate(() => {
		if (!overlay || !navigating) return;
		navigating = false;
		gsap.fromTo(
			overlay,
			{ y: '0%' },
			{
				y: '-100%',
				duration: 0.5,
				ease: 'power4.inOut'
			}
		);
	});
</script>

<div
	bind:this={overlay}
	class="pointer-events-none fixed inset-0 z-[9980] bg-bg"
	style="transform: translateY(100%);"
></div>
