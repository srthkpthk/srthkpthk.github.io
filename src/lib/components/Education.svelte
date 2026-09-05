<script lang="ts">
	import { onMount } from 'svelte';
	import { educationContent } from '$lib/data/content';
	import { scrollReveal, gsap, ScrollTrigger } from '$lib/actions/gsap';

	let lineEl = $state<HTMLDivElement | null>(null);
	let itemEls: HTMLDivElement[] = $state([]);
	let dotEls: HTMLDivElement[] = $state([]);

	onMount(() => {
		const cleanups: (() => void)[] = [];

		if (lineEl) {
			const tl = gsap.fromTo(
				lineEl,
				{ scaleX: 0 },
				{
					scaleX: 1,
					ease: 'none',
					scrollTrigger: {
						trigger: lineEl,
						start: 'top 80%',
						end: 'top 30%',
						scrub: true
					}
				}
			);
			cleanups.push(() => tl.kill());
		}

		const isDesktop = window.innerWidth >= 768;

		// Staggered reveal for each item
		itemEls.forEach((el, i) => {
			if (!el) return;

			const fromProps = isDesktop
				? { x: i % 2 === 0 ? -60 : 60, opacity: 0 }
				: { y: 40, opacity: 0 };
			const toProps = isDesktop
				? { x: 0, opacity: 1 }
				: { y: 0, opacity: 1 };

			gsap.set(el, fromProps);

			const tl = gsap.to(el, {
				...toProps,
				duration: 0.8,
				delay: i * 0.15,
				ease: 'power3.out',
				scrollTrigger: {
					trigger: el,
					start: 'top 85%',
					toggleActions: 'play none none none'
				}
			});
			cleanups.push(() => tl.kill());
		});

		// Dot glow pulses
		dotEls.forEach((dot) => {
			if (!dot) return;

			ScrollTrigger.create({
				trigger: dot,
				start: 'top 85%',
				onEnter: () => {
					const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--color-accent-violet').trim();
					gsap.to(dot, {
						boxShadow: `0 0 12px 3px ${accentColor}99`,
						scale: 1.5,
						duration: 0.4,
						yoyo: true,
						repeat: 1,
						ease: 'power2.out'
					});
				},
				once: true
			});
		});

		return () => cleanups.forEach((fn) => fn());
	});
</script>

<section class="relative mx-auto max-w-6xl px-6 pb-32 md:pb-40">
	<h3 class="mb-12 font-heading text-2xl font-bold text-text-primary" use:scrollReveal>
		Education
	</h3>

	<!-- Timeline -->
	<div class="relative">
		<!-- Horizontal connecting line (desktop) -->
		<div
			bind:this={lineEl}
			class="absolute top-6 left-0 hidden h-px w-full origin-left bg-gradient-to-r from-accent-violet to-accent-cyan md:block"
		></div>

		<div class="grid gap-8 md:grid-cols-3 md:gap-6">
			{#each educationContent.timeline as item, i}
				<div
					bind:this={itemEls[i]}
					class="relative border-l-2 border-border py-2 pl-6 md:border-l-0 md:pt-12 md:pl-0"
				>
					<!-- Dot -->
					<div
						bind:this={dotEls[i]}
						class="absolute top-3 -left-[5px] h-2 w-2 rounded-full bg-accent-violet md:top-[20px] md:left-1/2 md:-translate-x-1/2"
					></div>

					<span class="font-mono text-xs text-accent-cyan">{item.year}</span>
					<h4 class="mt-1 font-heading text-lg font-bold text-text-primary">
						{item.degree}
					</h4>
					<p class="mt-1 text-sm text-text-muted">{item.institution}</p>
					<p class="text-sm text-text-subtle">{item.location}</p>
				</div>
			{/each}
		</div>
	</div>
</section>
