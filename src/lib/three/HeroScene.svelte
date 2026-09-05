<script lang="ts">
	import { onMount } from 'svelte';
	import { SECTION_IDS } from '$lib/data/sections';
	import { cursorPos } from '$lib/stores/cursor';
	import { activeSection, scrollVelocity } from '$lib/stores/scroll';
	import { resolvedTheme } from '$lib/stores/theme';
	import type { ParticleField } from './ParticleField';

	let backCanvas = $state<HTMLCanvasElement | null>(null);
	let frontCanvas = $state<HTMLCanvasElement | null>(null);
	let field: ParticleField | null = null;
	let hasWebGL = $state(true);
	let threeReady = $state(false);

	/**
	 * Probe WebGL support on a throwaway canvas. Probing on the canvas Three.js will
	 * render to would pin it to whichever context succeeds first (e.g. WebGL1), which
	 * makes Three's later WebGL2 request fail.
	 */
	function supportsWebGL(): boolean {
		try {
			const probe = document.createElement('canvas');
			return !!(probe.getContext('webgl2') || probe.getContext('webgl'));
		} catch {
			return false;
		}
	}

	onMount(() => {
		if (!backCanvas) return;

		if (!supportsWebGL() || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			hasWebGL = false;
			return;
		}

		let cancelled = false;
		const cleanups: (() => void)[] = [];
		const back = backCanvas;
		const front = frontCanvas ?? undefined;

		import('./ParticleField')
			.then(async ({ ParticleField }) => {
				if (cancelled) return;

				const isMobile = window.innerWidth < 800;
				field = new ParticleField(back, isMobile, front);
				field.start();

				// Wait for first frame + minimum delay, then crossfade in
				await new Promise<void>((resolve) => {
					requestAnimationFrame(() => setTimeout(resolve, 500));
				});
				if (cancelled) return;
				threeReady = true;

				// Konami easter egg
				const onKonami = () => field?.rainbowScatter();
				document.addEventListener('konami', onKonami);
				cleanups.push(() => document.removeEventListener('konami', onKonami));

				cleanups.push(cursorPos.subscribe(({ x, y }) => field?.updateMouse(x, y)));
				cleanups.push(scrollVelocity.subscribe((v) => field?.updateVelocity(v)));
				cleanups.push(resolvedTheme.subscribe((theme) => field?.setDarkMode(theme === 'dark')));

				// Section-driven morphing; the home route owns the scroll tracking.
				cleanups.push(
					activeSection.subscribe((id) => field?.transitionTo(SECTION_IDS.indexOf(id)))
				);

				const onResize = () => field?.resize();
				window.addEventListener('resize', onResize);
				cleanups.push(() => window.removeEventListener('resize', onResize));
			})
			.catch(() => {
				hasWebGL = false;
			});

		return () => {
			cancelled = true;
			cleanups.forEach((fn) => fn());
			field?.destroy();
			field = null;
		};
	});
</script>

<!-- Gradient fallback — shown immediately, fades out when Three.js is ready -->
<div
	class="fixed inset-0 z-0 bg-gradient-to-br from-accent-violet/10 via-bg to-accent-cyan/10 pointer-events-none"
	style="opacity: {threeReady ? 0 : 1}; transition: opacity 1s ease;"
>
	<div class="fallback-grain absolute inset-0 opacity-20"></div>
</div>

{#if hasWebGL}
	<!-- Back canvas: far particles (behind content) -->
	<canvas
		bind:this={backCanvas}
		class="fixed inset-0 z-0 h-full w-full"
		style="opacity: {threeReady ? 0.9 : 0}; transition: opacity 1s ease;"
	></canvas>
	<!-- Front canvas: near particles (above content) -->
	<canvas
		bind:this={frontCanvas}
		class="fixed inset-0 z-[15] h-full w-full pointer-events-none"
		style="opacity: {threeReady ? 0.9 : 0}; transition: opacity 1s ease;"
	></canvas>
{:else}
	<div class="fixed inset-0 z-0 bg-gradient-to-br from-accent-violet/10 via-bg to-accent-cyan/10">
		<div class="fallback-grain absolute inset-0 opacity-20"></div>
	</div>
{/if}

<style>
	.fallback-grain {
		background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E");
	}
</style>
