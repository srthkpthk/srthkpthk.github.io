<script lang="ts">
	import { scrollReveal } from '$lib/actions/gsap';

	interface Props {
		number: string;
		title: string;
	}

	let { number, title }: Props = $props();
</script>

<div class="mb-16 flex items-center gap-4 md:mb-20" use:scrollReveal>
	<span class="font-mono text-sm text-accent-violet">{number}</span>
	<div class="h-px flex-1 max-w-16 bg-accent-violet/30"></div>
	<h2
		class="font-heading text-3xl font-bold tracking-tight text-text-primary md:text-4xl lg:text-5xl"
	>
		{title}
	</h2>
</div>
