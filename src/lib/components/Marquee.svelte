<script lang="ts">
	import { scrollDirection } from '$lib/stores/scroll';
	import { onDestroy } from 'svelte';

	interface Props {
		items: string[];
		speed?: number;
	}

	let { items, speed = 40 }: Props = $props();

	let dir = $state<'up' | 'down'>('down');
	const unsub = scrollDirection.subscribe((v) => (dir = v));
	onDestroy(unsub);

	const doubled = $derived([...items, ...items]);
</script>

<div class="marquee-container relative overflow-hidden py-8" style="--speed: {speed}s;">
	<div class="marquee-track flex whitespace-nowrap" class:reverse={dir === 'up'}>
		{#each doubled as item}
			<span
				class="mx-8 inline-block font-heading text-4xl font-black text-text-subtle/20 md:text-6xl lg:text-8xl select-none"
			>
				{item}
			</span>
		{/each}
	</div>
</div>

<style>
	.marquee-container {
		mask-image: linear-gradient(90deg, transparent, black 10%, black 90%, transparent);
		-webkit-mask-image: linear-gradient(90deg, transparent, black 10%, black 90%, transparent);
	}

	.marquee-track {
		animation: marquee var(--speed) linear infinite;
	}

	.marquee-track.reverse {
		animation-direction: reverse;
	}

	@keyframes marquee {
		0% {
			transform: translateX(0);
		}
		100% {
			transform: translateX(-50%);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.marquee-track {
			animation: none;
		}
	}
</style>
