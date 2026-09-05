<script lang="ts">
	import { onMount } from 'svelte';
	import { base } from '$app/paths';
	import { projectsContent } from '$lib/data/content';
	import { scrollReveal } from '$lib/actions/gsap';
	import SectionHeading from './SectionHeading.svelte';

	let hoveredIndex = $state(-1);
	let isTouch = $state(false);

	onMount(() => {
		isTouch = window.matchMedia('(pointer: coarse)').matches;
	});

	function handleTilt(e: MouseEvent, card: HTMLElement) {
		if (isTouch) return;
		const rect = card.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;
		const centerX = rect.width / 2;
		const centerY = rect.height / 2;

		const rotateX = ((y - centerY) / centerY) * -8;
		const rotateY = ((x - centerX) / centerX) * 8;

		// Update glare position
		const glareX = ((x / rect.width) * 100).toFixed(1);
		const glareY = ((y / rect.height) * 100).toFixed(1);
		card.style.setProperty('--glare-x', `${glareX}%`);
		card.style.setProperty('--glare-y', `${glareY}%`);

		// Apply to wrapper (parent with perspective)
		card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
	}

	function resetTilt(card: HTMLElement) {
		card.style.transform = 'rotateX(0deg) rotateY(0deg)';
	}
</script>

<section id="projects" class="relative mx-auto max-w-6xl px-6 py-32 md:py-40">
	<SectionHeading number={projectsContent.sectionNumber} title={projectsContent.heading} />

	<div class="grid gap-6 md:grid-cols-2">
		{#each projectsContent.projects as project, i}
			<!-- Perspective wrapper -->
			<a
				href="{base}/projects/{project.slug}"
				class="group block"
				style="perspective: 800px;"
				use:scrollReveal={{ delay: i * 0.1, y: 40 }}
				onmousemove={(e) => handleTilt(e, e.currentTarget.firstElementChild as HTMLElement)}
				onmouseleave={(e) => {
					resetTilt(e.currentTarget.firstElementChild as HTMLElement);
					hoveredIndex = -1;
				}}
				onmouseenter={() => (hoveredIndex = i)}
			>
				<div
					class="tilt-card relative overflow-hidden rounded-xl border border-border bg-bg-card/80 p-8 transition-all duration-500 hover:border-border-hover"
					style="transform-style: preserve-3d; transition: transform 0.15s ease-out, box-shadow 0.3s, border-color 0.3s; --glare-x: 50%; --glare-y: 50%;"
				>
					<!-- Hover image/gradient reveal -->
					<div
						class="pointer-events-none absolute inset-0 z-0 rounded-xl bg-gradient-to-br opacity-20 {project.gradient}"
						style="clip-path: {hoveredIndex === i ? 'inset(0)' : 'inset(0 0 0 100%)'}; transition: clip-path 0.5s cubic-bezier(0.77, 0, 0.175, 1);"
					></div>

					<!-- Glare overlay -->
					<div
						class="pointer-events-none absolute inset-0 z-10 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
						style="background: radial-gradient(circle at var(--glare-x) var(--glare-y), var(--color-glare), transparent 60%);"
					></div>

					<!-- Project content with depth -->
					<div style="transform: translateZ(20px);">
						<span class="font-mono text-xs text-text-subtle">{project.number}</span>

						<div class="mt-3 flex items-center justify-between">
							<h3 class="font-heading text-xl font-bold text-text-primary">
								{project.title}
							</h3>
							<svg
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="1.5"
								class="text-text-subtle transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-accent-violet"
							>
								<path d="M7 17L17 7M17 7H7M17 7v10" />
							</svg>
						</div>

						<p class="mt-3 text-sm leading-relaxed text-text-muted">
							{project.description}
						</p>
					</div>

					<div class="mt-5 flex flex-wrap gap-2" style="transform: translateZ(40px);">
						{#each project.tech as tag}
							<span class="rounded-md bg-bg-hover px-2.5 py-1 font-mono text-xs text-text-subtle">
								{tag}
							</span>
						{/each}
					</div>
				</div>
			</a>
		{/each}
	</div>
</section>
