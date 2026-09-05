<script lang="ts">
	import { onMount } from 'svelte';
	import { cursorPos } from '$lib/stores/cursor';
	import { activeSection } from '$lib/stores/scroll';
	import { scrollVelocity } from '$lib/stores/scroll';
	import { resolvedTheme } from '$lib/stores/theme';

	let backCanvas = $state<HTMLCanvasElement | null>(null);
	let frontCanvas = $state<HTMLCanvasElement | null>(null);
	let field: import('./ParticleField').ParticleField | null = null;
	let hasWebGL = $state(true);
	let threeReady = $state(false);

	onMount(async () => {
		if (!backCanvas) return;

		// Check WebGL support
		try {
			const gl = backCanvas.getContext('webgl2') || backCanvas.getContext('webgl');
			if (!gl) throw new Error('No WebGL');
		} catch {
			hasWebGL = false;
			return;
		}

		// Check reduced motion
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			hasWebGL = false;
			return;
		}

		try {
			const { ParticleField } = await import('./ParticleField');
			const isMobile = window.innerWidth < 800;
			field = new ParticleField(backCanvas, isMobile, frontCanvas ?? undefined);
			field.start();

			// Wait for first frame + minimum delay, then crossfade in
			await new Promise<void>((resolve) => {
				requestAnimationFrame(() => {
					setTimeout(resolve, 500);
				});
			});
			threeReady = true;
		} catch {
			hasWebGL = false;
			return;
		}

		// Konami easter egg
		const onKonami = () => field?.rainbowScatter();
		document.addEventListener('konami', onKonami);

		const unsubCursor = cursorPos.subscribe(({ x, y }) => {
			field?.updateMouse(x, y);
		});

		const unsubVelocity = scrollVelocity.subscribe((v) => {
			field?.updateVelocity(v);
		});

		const unsubTheme = resolvedTheme.subscribe((theme) => {
			field?.setDarkMode(theme === 'dark');
		});

		const onResize = () => field?.resize();
		window.addEventListener('resize', onResize);

		// Section-based particle transitions via ScrollTrigger
		const { ScrollTrigger } = await import('gsap/ScrollTrigger');
		const { gsap } = await import('gsap');
		gsap.registerPlugin(ScrollTrigger);

		const sectionIds = ['hero', 'about', 'skills', 'projects', 'contact'];
		const triggers: ScrollTrigger[] = [];

		// Wait for DOM sections to exist
		requestAnimationFrame(() => {
			sectionIds.forEach((id, index) => {
				const el = document.getElementById(id);
				if (!el) return;

				const trigger = ScrollTrigger.create({
					trigger: el,
					start: 'top center',
					onEnter: () => {
						field?.transitionTo(index);
						activeSection.set(sectionIds[index]);
					},
					onEnterBack: () => {
						field?.transitionTo(index);
						activeSection.set(sectionIds[index]);
					}
				});
				triggers.push(trigger);
			});
		});

		return () => {
			field?.destroy();
			unsubCursor();
			unsubVelocity();
			unsubTheme();
			document.removeEventListener('konami', onKonami);
			window.removeEventListener('resize', onResize);
			triggers.forEach((t) => t.kill());
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
