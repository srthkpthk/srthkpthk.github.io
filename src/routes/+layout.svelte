<script lang="ts">
	import { onMount } from 'svelte';
	import { afterNavigate } from '$app/navigation';
	import Lenis from 'lenis';
	import '../app.css';
	import Navbar from '$lib/components/Navbar.svelte';
	import CustomCursor from '$lib/components/CustomCursor.svelte';
	import Preloader from '$lib/components/Preloader.svelte';
	import HeroScene from '$lib/three/HeroScene.svelte';
	import ScrollProgress from '$lib/components/ScrollProgress.svelte';
	import FilmGrain from '$lib/components/FilmGrain.svelte';
	import BackgroundShift from '$lib/components/BackgroundShift.svelte';
	import CursorTrail from '$lib/components/CursorTrail.svelte';
	import KonamiEgg from '$lib/components/KonamiEgg.svelte';
	import CommandPalette from '$lib/components/CommandPalette.svelte';
	import PageTransition from '$lib/components/PageTransition.svelte';
	import { scrollY, scrollProgress, scrollDirection, scrollVelocity } from '$lib/stores/scroll';
	import { updateTimeAccent, initTheme, resolvedTheme } from '$lib/stores/theme';

	let { children } = $props();
	let lenisInstance: Lenis | null = null;

	afterNavigate(() => {
		lenisInstance?.scrollTo(0, { immediate: true });
	});

	onMount(() => {
		// Theme system
		const cleanupTheme = initTheme();

		// Time-of-day accent hue shifting
		updateTimeAccent();
		const themeInterval = setInterval(updateTimeAccent, 30 * 60 * 1000);

		const lenis = new Lenis({
			duration: 1.2,
			easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
			touchMultiplier: 2
		});
		lenisInstance = lenis;

		let lastScroll = 0;
		let lastTime = performance.now();

		lenis.on('scroll', ({ scroll, limit }: { scroll: number; limit: number }) => {
			const now = performance.now();
			const dt = Math.max(now - lastTime, 1);
			const velocity = Math.abs(scroll - lastScroll) / dt;

			scrollY.set(scroll);
			scrollProgress.set(scroll / limit);
			scrollDirection.set(scroll > lastScroll ? 'down' : 'up');
			scrollVelocity.set(velocity);

			lastScroll = scroll;
			lastTime = now;
		});

		let rafId = 0;
		function raf(time: number) {
			lenis.raf(time);
			rafId = requestAnimationFrame(raf);
		}
		rafId = requestAnimationFrame(raf);

		return () => {
			cancelAnimationFrame(rafId);
			lenis.destroy();
			lenisInstance = null;
			clearInterval(themeInterval);
			cleanupTheme();
		};
	});

	// Dynamic theme-color meta tag
	$effect(() => {
		const theme = $resolvedTheme;
		const meta = document.querySelector('meta[name="theme-color"]');
		if (meta) {
			meta.setAttribute('content', theme === 'light' ? '#fafafa' : '#0a0a0a');
		}
	});
</script>

<HeroScene />
<Preloader />
<CustomCursor />
<CursorTrail />
<KonamiEgg />
<Navbar />
<ScrollProgress />
<FilmGrain />
<BackgroundShift />
<CommandPalette />
<PageTransition />

<main class="relative z-10">
	{@render children()}
</main>
