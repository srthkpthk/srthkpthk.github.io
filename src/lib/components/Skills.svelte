<script lang="ts">
	import { onMount } from 'svelte';
	import { skillsContent } from '$lib/data/content';
	import { scrollReveal, gsap } from '$lib/actions/gsap';
	import SectionHeading from './SectionHeading.svelte';

	let barsContainer = $state<HTMLElement | null>(null);

	onMount(() => {
		if (!barsContainer) return;

		const bars = barsContainer.querySelectorAll('.skill-bar-fill');
		gsap.set(bars, { scaleX: 0 });

		const tl = gsap.to(bars, {
			scaleX: 1,
			duration: 1,
			stagger: 0.1,
			ease: 'power3.out',
			scrollTrigger: {
				trigger: barsContainer,
				start: 'top 85%',
				toggleActions: 'play none none none'
			}
		});

		return () => tl.kill();
	});
</script>

<section id="skills" class="relative mx-auto max-w-6xl px-6 py-32 md:py-40">
	<SectionHeading number={skillsContent.sectionNumber} title={skillsContent.heading} />

	<p class="mb-12 text-text-muted" use:scrollReveal={{ delay: 0.1 }}>
		{skillsContent.subheading}
	</p>

	<div class="flex flex-wrap gap-3" use:scrollReveal={{ delay: 0.2, stagger: 0.05 }}>
		{#each skillsContent.skills as skill}
			<span
				class="group cursor-default rounded-full border border-border bg-bg-card/60 px-5 py-2.5 font-mono text-sm text-text-muted backdrop-blur-sm transition-all duration-300 hover:border-accent-violet/50 hover:text-text-primary hover:shadow-[0_0_20px_rgba(139,92,246,0.15)]"
			>
				{skill.name}
			</span>
		{/each}
	</div>

	<!-- Skill bars -->
	<!-- Decorative: the pills above already list the skills for assistive tech -->
	<div bind:this={barsContainer} class="mt-16 space-y-4" aria-hidden="true">
		{#each skillsContent.skills as skill}
			<div class="flex items-center gap-4">
				<span class="w-24 shrink-0 font-mono text-xs text-text-subtle">{skill.name}</span>
				<div class="h-1 flex-1 overflow-hidden rounded-full bg-border/30">
					<div
						class="skill-bar-fill h-full origin-left rounded-full bg-gradient-to-r from-accent-violet to-accent-cyan"
						style="width: {skill.level}%;"
					></div>
				</div>
			</div>
		{/each}
	</div>
</section>
