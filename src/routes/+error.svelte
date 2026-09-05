<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { base } from '$app/paths';
	import { scramble } from '$lib/utils/scramble';

	const target = '404';
	let displayText = $state(target);

	onMount(() =>
		scramble(target.split(''), (chars) => (displayText = chars.join('')), {
			startDelay: 40,
			duration: 240,
			interval: 40
		})
	);
</script>

<div class="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6">
	<!-- CSS floating particles -->
	{#each Array(18) as _}
		<div
			class="error-particle absolute rounded-full bg-accent-violet/20"
			style="
				width: {3 + Math.random() * 6}px;
				height: {3 + Math.random() * 6}px;
				left: {Math.random() * 100}%;
				top: {Math.random() * 100}%;
				animation: errorFloat {4 + Math.random() * 6}s ease-in-out {Math.random() * 4}s infinite alternate;
			"
		></div>
	{/each}

	<!-- Content -->
	<h1
		class="font-heading text-[8rem] font-black leading-none tracking-tighter md:text-[12rem]"
		style="background: linear-gradient(135deg, var(--color-accent-violet), var(--color-accent-cyan)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;"
	>
		{displayText}
	</h1>

	<p class="mt-4 font-body text-lg text-text-muted">
		Lost in space
	</p>

	<p class="mt-2 text-sm text-text-subtle">
		{page.error?.message ?? 'Page not found'}
	</p>

	<a
		href="{base}/"
		class="group mt-8 inline-flex items-center gap-2 rounded-full border border-accent-violet px-6 py-3 font-mono text-sm text-accent-violet transition-all duration-300 hover:bg-accent-violet hover:text-bg"
	>
		<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="transition-transform duration-300 group-hover:-translate-x-1">
			<path d="M19 12H5M12 19l-7-7 7-7" />
		</svg>
		Return home
	</a>
</div>

<style>
	@keyframes errorFloat {
		0% {
			transform: translateY(0) translateX(0) scale(1);
			opacity: 0.3;
		}
		100% {
			transform: translateY(-40px) translateX(20px) scale(1.3);
			opacity: 0.6;
		}
	}

	.error-particle {
		pointer-events: none;
	}
</style>
