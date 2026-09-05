<script lang="ts">
	import { onMount } from 'svelte';
	import { isLoading, sceneReady } from '$lib/stores/loading';
	import { firstTruthy, waitForReady } from '$lib/utils/readiness';

	/** Keep the counter visible at least this long so it never just flashes. */
	const MIN_VISIBLE_MS = 500;
	/** Stop waiting for fonts / the WebGL scene after this long. */
	const CAP_MS = 1200;
	/** Fallback in case transitionend never fires for the exit animation. */
	const EXIT_FALLBACK_MS = 900;

	let count = $state(0);
	let hiding = $state(false);

	onMount(() => {
		let cancelled = false;
		let rafId = 0;
		const timers: ReturnType<typeof setTimeout>[] = [];
		const start = performance.now();

		// Count toward 90 over the cap while waiting; jump to 100 when the gate opens.
		const tick = (now: number) => {
			if (cancelled) return;
			const progress = Math.min((now - start) / CAP_MS, 1);
			count = Math.max(count, Math.floor(progress * 90));
			if (progress < 1) rafId = requestAnimationFrame(tick);
		};
		rafId = requestAnimationFrame(tick);

		const fonts = 'fonts' in document ? document.fonts.ready : Promise.resolve();
		void waitForReady({
			signals: [fonts, firstTruthy(sceneReady)],
			min: MIN_VISIBLE_MS,
			cap: CAP_MS
		}).then(() => {
			if (cancelled) return;
			cancelAnimationFrame(rafId);
			count = 100;
			timers.push(
				setTimeout(() => {
					if (cancelled) return;
					hiding = true;
					timers.push(setTimeout(finish, EXIT_FALLBACK_MS));
				}, 150)
			);
		});

		return () => {
			cancelled = true;
			cancelAnimationFrame(rafId);
			timers.forEach(clearTimeout);
		};
	});

	function finish() {
		isLoading.set(false);
	}

	function onTransitionEnd(e: TransitionEvent) {
		// Ignore the progress bar's width transitions bubbling up from inside.
		if (e.target === e.currentTarget && e.propertyName === 'transform') finish();
	}
</script>

{#if $isLoading}
	<div
		data-testid="preloader"
		class="fixed inset-0 z-[9998] flex items-center justify-center bg-bg"
		style="transform: translateY({hiding ? '-100%' : '0'}); transition: transform 0.6s cubic-bezier(0.76, 0, 0.24, 1);"
		ontransitionend={onTransitionEnd}
	>
		<div class="relative">
			<span class="font-mono text-7xl font-bold tabular-nums text-text-primary md:text-9xl">
				{String(count).padStart(3, '0')}
			</span>
			<div class="mt-4 h-px w-full bg-border">
				<div
					class="h-full bg-gradient-to-r from-accent-violet to-accent-cyan"
					style="width: {count}%; transition: width 0.1s;"
				></div>
			</div>
		</div>
	</div>
{/if}
