<script lang="ts">
	import { onMount } from 'svelte';
	import { derived } from 'svelte/store';
	import { gsap } from '$lib/actions/gsap';
	import { SECTION_TINT } from '$lib/data/sections';
	import { activeSection } from '$lib/stores/scroll';
	import { resolvedTheme } from '$lib/stores/theme';

	let overlay = $state<HTMLElement | null>(null);

	// Tint follows both the section in view and the resolved theme.
	const tint = derived(
		[activeSection, resolvedTheme],
		([section, theme]) => SECTION_TINT[theme][section]
	);

	onMount(() => {
		let first = true;
		return tint.subscribe((color) => {
			if (!overlay) return;
			if (first) {
				first = false;
				overlay.style.backgroundColor = color;
				return;
			}
			gsap.to(overlay, { backgroundColor: color, duration: 0.8 });
		});
	});
</script>

<div
	bind:this={overlay}
	class="pointer-events-none fixed inset-0 z-[1]"
	style="background-color: {SECTION_TINT.dark.hero};"
></div>
