<script lang="ts">
	import { onMount } from 'svelte';
	import { cursorPos, cursorHover, cursorHidden } from '$lib/stores/cursor';

	let dot = $state<HTMLDivElement | null>(null);
	let ring = $state<HTMLDivElement | null>(null);
	let isTouch = $state(false);
	let dotX = $state(0);
	let dotY = $state(0);
	let ringX = $state(0);
	let ringY = $state(0);

	onMount(() => {
		isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
		if (isTouch) return;

		let rafId: number;
		const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

		const onMove = (e: MouseEvent) => {
			cursorPos.set({ x: e.clientX, y: e.clientY });
			dotX = e.clientX;
			dotY = e.clientY;
		};

		const animate = () => {
			ringX = lerp(ringX, dotX, 0.15);
			ringY = lerp(ringY, dotY, 0.15);
			rafId = requestAnimationFrame(animate);
		};

		const onEnter = () => cursorHidden.set(false);
		const onLeave = () => cursorHidden.set(true);

		document.addEventListener('mousemove', onMove);
		document.addEventListener('mouseenter', onEnter);
		document.addEventListener('mouseleave', onLeave);

		// Detect hoverable elements
		const observer = new MutationObserver(() => {
			document.querySelectorAll('a, button, [data-cursor-hover]').forEach((el) => {
				if (!(el as HTMLElement).dataset.cursorBound) {
					el.addEventListener('mouseenter', () => cursorHover.set(true));
					el.addEventListener('mouseleave', () => cursorHover.set(false));
					(el as HTMLElement).dataset.cursorBound = '1';
				}
			});
		});
		observer.observe(document.body, { childList: true, subtree: true });
		// Initial scan
		document.querySelectorAll('a, button, [data-cursor-hover]').forEach((el) => {
			el.addEventListener('mouseenter', () => cursorHover.set(true));
			el.addEventListener('mouseleave', () => cursorHover.set(false));
			(el as HTMLElement).dataset.cursorBound = '1';
		});

		animate();

		return () => {
			cancelAnimationFrame(rafId);
			document.removeEventListener('mousemove', onMove);
			document.removeEventListener('mouseenter', onEnter);
			document.removeEventListener('mouseleave', onLeave);
			observer.disconnect();
		};
	});
</script>

{#if !isTouch}
	<div
		bind:this={dot}
		class="pointer-events-none fixed top-0 left-0 z-[9999] h-2 w-2 rounded-full bg-text-primary mix-blend-difference"
		style="transform: translate({dotX - 4}px, {dotY - 4}px); opacity: {$cursorHidden ? 0 : 1}; transition: opacity 0.3s;"
	></div>
	<div
		bind:this={ring}
		class="pointer-events-none fixed top-0 left-0 z-[9999] rounded-full border border-text-primary mix-blend-difference"
		style="width: {$cursorHover ? 48 : 32}px; height: {$cursorHover ? 48 : 32}px; transform: translate({ringX - ($cursorHover ? 24 : 16)}px, {ringY - ($cursorHover ? 24 : 16)}px); opacity: {$cursorHidden ? 0 : 0.5}; transition: width 0.3s, height 0.3s, opacity 0.3s;"
	></div>
{/if}
