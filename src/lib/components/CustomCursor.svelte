<script lang="ts">
	import { onMount } from 'svelte';
	import { cursorPos, cursorHover, cursorHidden } from '$lib/stores/cursor';

	/** Elements that grow the cursor ring on hover. */
	const HOVER_SELECTOR = 'a, button, [data-cursor-hover]';

	let isTouch = $state(false);
	let dotX = $state(0);
	let dotY = $state(0);
	let ringX = $state(0);
	let ringY = $state(0);

	const hoverTarget = (node: EventTarget | null) =>
		node instanceof Element ? node.closest(HOVER_SELECTOR) : null;

	onMount(() => {
		isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
		if (isTouch) return;

		// The native cursor is hidden by CSS only while this class is present, so a JS
		// failure or a touch device never leaves the user without a cursor.
		document.documentElement.classList.add('has-custom-cursor');

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

		// Delegated hover detection: no per-element listeners, no MutationObserver rescans.
		const onOver = (e: PointerEvent) => {
			if (hoverTarget(e.target)) cursorHover.set(true);
		};
		const onOut = (e: PointerEvent) => {
			const from = hoverTarget(e.target);
			if (!from) return;
			const to = hoverTarget(e.relatedTarget);
			if (to !== from) cursorHover.set(to !== null);
		};

		document.addEventListener('mousemove', onMove);
		document.addEventListener('mouseenter', onEnter);
		document.addEventListener('mouseleave', onLeave);
		document.addEventListener('pointerover', onOver);
		document.addEventListener('pointerout', onOut);

		animate();

		return () => {
			cancelAnimationFrame(rafId);
			document.removeEventListener('mousemove', onMove);
			document.removeEventListener('mouseenter', onEnter);
			document.removeEventListener('mouseleave', onLeave);
			document.removeEventListener('pointerover', onOver);
			document.removeEventListener('pointerout', onOut);
			document.documentElement.classList.remove('has-custom-cursor');
		};
	});
</script>

{#if !isTouch}
	<div
		data-testid="cursor-dot"
		class="pointer-events-none fixed top-0 left-0 z-[9999] h-2 w-2 rounded-full bg-text-primary mix-blend-difference"
		style="transform: translate({dotX - 4}px, {dotY - 4}px); opacity: {$cursorHidden
			? 0
			: 1}; transition: opacity 0.3s;"
	></div>
	<div
		data-testid="cursor-ring"
		class="pointer-events-none fixed top-0 left-0 z-[9999] rounded-full border border-text-primary mix-blend-difference"
		style="width: {$cursorHover ? 48 : 32}px; height: {$cursorHover
			? 48
			: 32}px; transform: translate({ringX - ($cursorHover ? 24 : 16)}px, {ringY -
			($cursorHover ? 24 : 16)}px); opacity: {$cursorHidden
			? 0
			: 0.5}; transition: width 0.3s, height 0.3s, opacity 0.3s;"
	></div>
{/if}
