<script lang="ts">
	import { onMount } from 'svelte';
	import { base } from '$app/paths';
	import { heroContent } from '$lib/data/content';
	import { isLoading } from '$lib/stores/loading';
	import { gsap, ScrollTrigger } from '$lib/actions/gsap';

	let section = $state<HTMLElement | null>(null);
	let nameChars = $state<HTMLSpanElement[]>([]);
	let greetingEl = $state<HTMLElement | null>(null);
	let taglineEl = $state<HTMLElement | null>(null);
	let photoEl = $state<HTMLElement | null>(null);
	let arrowEl = $state<HTMLElement | null>(null);
	let ready = $state(false);

	const nameLetters = heroContent.name.split('');
	const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*';
	const randomChar = () => SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
	// Start from the real letters so the prerendered heading is readable; the client
	// scramble replaces them right before the intro reveals the name.
	let displayChars = $state<string[]>([...nameLetters]);

	function scrambleText() {
		nameLetters.forEach((targetChar, i) => {
			if (targetChar === ' ') {
				displayChars[i] = ' ';
				return;
			}

			const startDelay = i * 30;
			const scrambleDuration = 500;
			const interval = 30;
			let elapsed = 0;

			setTimeout(() => {
				const timer = setInterval(() => {
					elapsed += interval;
					if (elapsed >= scrambleDuration) {
						displayChars[i] = targetChar;
						clearInterval(timer);
					} else {
						displayChars[i] = SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
					}
				}, interval);
			}, startDelay);
		});
	}

	let intro: gsap.core.Timeline | null = null;
	let arrowTrigger: ScrollTrigger | null = null;

	onMount(() => {
		const unsub = isLoading.subscribe((loading) => {
			if (!loading) {
				ready = true;
				setTimeout(animateIn, 100);
			}
		});

		// Scroll indicator fade
		if (arrowEl) {
			arrowTrigger = ScrollTrigger.create({
				trigger: section,
				start: 'top top',
				end: '10% top',
				onUpdate: (self) => {
					if (arrowEl) arrowEl.style.opacity = String(1 - self.progress);
				}
			});
		}

		return () => {
			unsub();
			arrowTrigger?.kill();
			intro?.kill();
		};
	});

	function animateIn() {
		const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
		intro = tl;

		tl.from(photoEl, { scale: 0, opacity: 0, duration: 0.8 }, 0);
		tl.from(greetingEl, { y: 30, opacity: 0, duration: 0.6 }, 0.2);

		// Show name chars (fade in) then scramble
		nameChars.forEach((el) => {
			if (el) el.style.opacity = '0';
		});
		tl.add(() => {
			displayChars = nameLetters.map((c) => (c === ' ' ? ' ' : randomChar()));
			nameChars.forEach((el) => {
				if (el) el.style.opacity = '1';
			});
			scrambleText();
		}, 0.3);

		tl.from(taglineEl, { y: 20, opacity: 0, duration: 0.6 }, 0.8);
		tl.from(arrowEl, { opacity: 0, duration: 0.6 }, 1.2);
	}
</script>

<section
	bind:this={section}
	id="hero"
	class="relative flex min-h-screen items-center justify-center overflow-hidden"
>
	<div class="relative z-10 flex flex-col items-center gap-6 px-6 text-center">
		<!-- Profile photo -->
		<div
			bind:this={photoEl}
			class="h-28 w-28 overflow-hidden rounded-full md:h-36 md:w-36"
			style="box-shadow: var(--color-hero-glow); border: 2px solid var(--color-hero-border);"
		>
			<img
				src="{base}/dp.jpg"
				width="144"
				height="144"
				alt="Sarthak Pathak"
				fetchpriority="high"
				class="h-full w-full object-cover"
			/>
		</div>

		<!-- Greeting -->
		<p bind:this={greetingEl} class="font-mono text-sm tracking-widest text-accent-cyan uppercase">
			{heroContent.greeting}
		</p>

		<!-- Name -->
		<h1 class="font-heading text-5xl font-black tracking-tight md:text-7xl lg:text-8xl" style="line-height: 1.1;">
			{#each nameLetters as char, i}
				{#if char === ' '}
					<span class="inline-block w-4 md:w-6">&nbsp;</span>
				{:else}
					<span
						bind:this={nameChars[i]}
						class="inline-block bg-gradient-to-r from-text-primary via-accent-violet to-accent-cyan bg-clip-text text-transparent"
						style="perspective: 600px;"
					>{displayChars[i]}</span>
				{/if}
			{/each}
		</h1>

		<!-- Tagline -->
		<p bind:this={taglineEl} class="max-w-md text-lg text-text-muted">
			{heroContent.tagline}
		</p>
	</div>

	<!-- Scroll indicator -->
	<div
		bind:this={arrowEl}
		class="absolute bottom-8 left-1/2 -translate-x-1/2"
		style="animation: bounce 2s ease-in-out infinite;"
	>
		<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="text-text-muted">
			<path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
		</svg>
	</div>
</section>

<style>
	@keyframes bounce {
		0%, 100% { transform: translateY(0); }
		50% { transform: translateY(8px); }
	}
</style>
