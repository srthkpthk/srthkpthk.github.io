<script lang="ts">
	import { aboutContent } from '$lib/data/content';
	import { scrollReveal, textReveal } from '$lib/actions/gsap';
	import SectionHeading from './SectionHeading.svelte';
</script>

<section id="about" class="relative mx-auto max-w-6xl px-6 py-32 md:py-40">
	<SectionHeading number={aboutContent.sectionNumber} title={aboutContent.heading} />

	<div class="grid gap-12 md:grid-cols-2 md:gap-20">
		<!-- Left: decorative -->
		<div class="hidden items-start md:flex" use:scrollReveal={{ delay: 0.2 }}>
			<div class="relative">
				<div class="h-48 w-px bg-gradient-to-b from-accent-violet to-accent-cyan"></div>
				<div class="absolute -left-1 top-0 h-2 w-2 rounded-full bg-accent-violet"></div>
				<div class="absolute -left-1 bottom-0 h-2 w-2 rounded-full bg-accent-cyan"></div>
			</div>
		</div>

		<!-- Right: text -->
		<div class="space-y-6">
			{#each aboutContent.paragraphs as paragraph, i}
				<p
					class="text-text-muted leading-relaxed"
					use:scrollReveal={{ delay: i * 0.15, y: 30 }}
				>
					{paragraph}
				</p>
			{/each}
		</div>
	</div>
</section>
