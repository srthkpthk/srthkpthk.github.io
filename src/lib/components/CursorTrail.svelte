<script lang="ts">
	import { onMount } from 'svelte';
	import { cursorPos } from '$lib/stores/cursor';
	import { resolvedTheme } from '$lib/stores/theme';

	const POOL_SIZE = 20;

	let darkColors = ['#8b5cf6', '#06b6d4', '#ffffff'];
	let lightColors = ['#7c3aed', '#0891b2', '#1a1a1a'];
	let colors = $state(darkColors);

	let particles = $state<HTMLElement[]>([]);
	let currentIndex = 0;
	let lastTime = 0;

	onMount(() => {
		// Disable on touch devices
		if ('ontouchstart' in window) return;

		const unsubTheme = resolvedTheme.subscribe((theme) => {
			colors = theme === 'light' ? lightColors : darkColors;
		});

		const unsub = cursorPos.subscribe(({ x, y }) => {
			const now = performance.now();
			if (now - lastTime < 30) return;
			lastTime = now;

			const el = particles[currentIndex];
			if (!el) return;

			// Reset and trigger
			el.style.transition = 'none';
			el.style.left = `${x}px`;
			el.style.top = `${y}px`;
			el.style.opacity = '1';
			el.style.transform = 'translate(-50%, -50%) scale(1)';
			el.style.background = colors[currentIndex % colors.length];

			// Force reflow
			void el.offsetHeight;

			// Fade out
			el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
			el.style.opacity = '0';
			const offsetX = (Math.random() - 0.5) * 30;
			const offsetY = (Math.random() - 0.5) * 30;
			el.style.transform = `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px)) scale(0)`;

			currentIndex = (currentIndex + 1) % POOL_SIZE;
		});

		return () => {
			unsub();
			unsubTheme();
		};
	});
</script>

<div class="pointer-events-none fixed inset-0 z-[55] hidden md:block">
	{#each Array(POOL_SIZE) as _, i}
		<div
			bind:this={particles[i]}
			class="absolute rounded-full"
			style="
				width: {2 + Math.random() * 2}px;
				height: {2 + Math.random() * 2}px;
				background: {colors[i % colors.length]};
				opacity: 0;
			"
		></div>
	{/each}
</div>
