<script lang="ts">
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { afterNavigate } from '$app/navigation';
	import Lenis from 'lenis';
	import 'lenis/dist/lenis.css';
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
	import { gsap, ScrollTrigger } from '$lib/actions/gsap';
	import { lenis as lenisStore, shouldResetScroll } from '$lib/stores/lenis';
	import { scrollY, scrollProgress, scrollDirection, scrollVelocity } from '$lib/stores/scroll';
	import { updateTimeAccent, initTheme, resolvedTheme } from '$lib/stores/theme';

	let { children } = $props();

	afterNavigate((nav) => {
		// SvelteKit has already restored popstate scroll / jumped to a hash target by now.
		if (shouldResetScroll(nav)) {
			get(lenisStore)?.scrollTo(0, { immediate: true });
		}
		ScrollTrigger.refresh();
	});

	onMount(() => {
		// Theme system
		const cleanupTheme = initTheme();

		// Time-of-day accent hue shifting
		updateTimeAccent();
		const themeInterval = setInterval(updateTimeAccent, 30 * 60 * 1000);

		// Smooth scrolling, driven by GSAP's ticker and kept in sync with ScrollTrigger
		// (see the "GSAP ScrollTrigger" section of the Lenis README).
		const lenis = new Lenis({
			duration: 1.2,
			easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
			touchMultiplier: 2
		});
		lenisStore.set(lenis);

		let lastScroll = 0;
		let lastTime = performance.now();

		lenis.on('scroll', ScrollTrigger.update);
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

		const tick = (time: number) => lenis.raf(time * 1000);
		gsap.ticker.add(tick);
		gsap.ticker.lagSmoothing(0);

		return () => {
			gsap.ticker.remove(tick);
			lenis.destroy();
			lenisStore.set(null);
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
