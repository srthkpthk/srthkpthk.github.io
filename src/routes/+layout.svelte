<script lang="ts">
	import { onMount } from 'svelte';
	import { afterNavigate } from '$app/navigation';
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
	import { updateTimeAccent } from '$lib/stores/theme';
	import { soundEnabled } from '$lib/stores/audio';
	import { playScrollWhoosh } from '$lib/audio/sounds';
	import { get } from 'svelte/store';

	let { children } = $props();
	let lenisInstance: any = null;

	afterNavigate(() => {
		if (lenisInstance) {
			lenisInstance.scrollTo(0, { immediate: true });
		}
	});

	onMount(async () => {
		// Time-of-day theming
		updateTimeAccent();
		const themeInterval = setInterval(updateTimeAccent, 30 * 60 * 1000);

		const Lenis = (await import('lenis')).default;
		const lenis = new Lenis({
			duration: 1.2,
			easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
			touchMultiplier: 2
		});
		lenisInstance = lenis;

		let lastScroll = 0;
		let lastTime = performance.now();
		let lastWhoosh = 0;

		lenis.on('scroll', ({ scroll, limit }: { scroll: number; limit: number }) => {
			const now = performance.now();
			const dt = Math.max(now - lastTime, 1);
			const velocity = Math.abs(scroll - lastScroll) / dt;

			scrollY.set(scroll);
			scrollProgress.set(scroll / limit);
			scrollDirection.set(scroll > lastScroll ? 'down' : 'up');
			scrollVelocity.set(velocity);

			// Sound — throttle whoosh to 1 per 200ms
			if (get(soundEnabled) && velocity > 0.3 && now - lastWhoosh > 200) {
				playScrollWhoosh(velocity);
				lastWhoosh = now;
			}

			lastScroll = scroll;
			lastTime = now;
		});

		function raf(time: number) {
			lenis.raf(time);
			requestAnimationFrame(raf);
		}
		requestAnimationFrame(raf);

		return () => {
			lenis.destroy();
			lenisInstance = null;
			clearInterval(themeInterval);
		};
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
