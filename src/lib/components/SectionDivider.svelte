<script lang="ts">
	import { onMount } from 'svelte';
	import { gsap } from '$lib/actions/gsap';

	let line = $state<HTMLElement | null>(null);

	onMount(() => {
		if (!line) return;

		gsap.set(line, { scaleX: 0 });

		const tl = gsap.to(line, {
			scaleX: 1,
			duration: 1.2,
			ease: 'power3.inOut',
			scrollTrigger: {
				trigger: line,
				start: 'top 85%',
				toggleActions: 'play none none none'
			}
		});

		return () => tl.kill();
	});
</script>

<div class="mx-auto max-w-6xl px-6">
	<div
		bind:this={line}
		class="h-px w-full origin-left"
		style="background: linear-gradient(90deg, transparent, rgba(139,92,246,0.4), rgba(6,182,212,0.4), transparent);"
	></div>
</div>
