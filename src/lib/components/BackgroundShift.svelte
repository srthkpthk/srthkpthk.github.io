<script lang="ts">
	import { onMount } from 'svelte';
	import { gsap, ScrollTrigger } from '$lib/actions/gsap';

	let overlay = $state<HTMLElement | null>(null);

	const sectionColors: Record<string, string> = {
		hero: 'rgba(139, 92, 246, 0.04)',
		about: 'rgba(6, 182, 212, 0.04)',
		skills: 'rgba(236, 72, 153, 0.04)',
		projects: 'rgba(245, 158, 11, 0.04)',
		contact: 'rgba(20, 184, 166, 0.04)'
	};

	onMount(() => {
		if (!overlay) return;

		const triggers: ScrollTrigger[] = [];

		requestAnimationFrame(() => {
			for (const [id, color] of Object.entries(sectionColors)) {
				const el = document.getElementById(id);
				if (!el) continue;

				const trigger = ScrollTrigger.create({
					trigger: el,
					start: 'top center',
					onEnter: () => gsap.to(overlay!, { backgroundColor: color, duration: 0.8 }),
					onEnterBack: () => gsap.to(overlay!, { backgroundColor: color, duration: 0.8 })
				});
				triggers.push(trigger);
			}
		});

		return () => triggers.forEach((t) => t.kill());
	});
</script>

<div
	bind:this={overlay}
	class="pointer-events-none fixed inset-0 z-[1]"
	style="background-color: rgba(139, 92, 246, 0.04);"
></div>
