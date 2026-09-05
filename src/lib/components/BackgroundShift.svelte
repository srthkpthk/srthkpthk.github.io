<script lang="ts">
	import { onMount } from 'svelte';
	import { gsap, ScrollTrigger } from '$lib/actions/gsap';
	import { resolvedTheme } from '$lib/stores/theme';

	let overlay = $state<HTMLElement | null>(null);

	const darkSectionColors: Record<string, string> = {
		hero: 'rgba(139, 92, 246, 0.04)',
		about: 'rgba(6, 182, 212, 0.04)',
		skills: 'rgba(236, 72, 153, 0.04)',
		projects: 'rgba(245, 158, 11, 0.04)',
		contact: 'rgba(20, 184, 166, 0.04)'
	};

	const lightSectionColors: Record<string, string> = {
		hero: 'rgba(124, 58, 237, 0.03)',
		about: 'rgba(8, 145, 178, 0.03)',
		skills: 'rgba(219, 39, 119, 0.03)',
		projects: 'rgba(217, 119, 6, 0.03)',
		contact: 'rgba(13, 148, 136, 0.03)'
	};

	let currentTheme: 'light' | 'dark' = 'dark';

	function getSectionColors() {
		return currentTheme === 'light' ? lightSectionColors : darkSectionColors;
	}

	onMount(() => {
		if (!overlay) return;

		const triggers: ScrollTrigger[] = [];

		const unsubTheme = resolvedTheme.subscribe((theme) => {
			currentTheme = theme;
		});

		requestAnimationFrame(() => {
			const sectionColors = getSectionColors();
			for (const [id, color] of Object.entries(sectionColors)) {
				const el = document.getElementById(id);
				if (!el) continue;

				const trigger = ScrollTrigger.create({
					trigger: el,
					start: 'top center',
					onEnter: () => {
						const colors = getSectionColors();
						gsap.to(overlay!, { backgroundColor: colors[id], duration: 0.8 });
					},
					onEnterBack: () => {
						const colors = getSectionColors();
						gsap.to(overlay!, { backgroundColor: colors[id], duration: 0.8 });
					}
				});
				triggers.push(trigger);
			}
		});

		return () => {
			triggers.forEach((t) => t.kill());
			unsubTheme();
		};
	});
</script>

<div
	bind:this={overlay}
	class="pointer-events-none fixed inset-0 z-[1]"
	style="background-color: rgba(139, 92, 246, 0.04);"
></div>
