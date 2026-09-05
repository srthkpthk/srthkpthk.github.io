<script lang="ts">
	import { onMount, untrack } from 'svelte';
	import { base } from '$app/paths';
	import { projectsContent, SITE_URL } from '$lib/data/content';
	import type { Project } from '$lib/data/content';
	import { scrollReveal, gsap } from '$lib/actions/gsap';
	import { scramble } from '$lib/utils/scramble';
	import SectionHeading from '$lib/components/SectionHeading.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let { data } = $props();
	let project: Project = $derived(data.project);

	// Find prev/next projects
	const projects = projectsContent.projects;
	let currentIndex = $derived(projects.findIndex((p) => p.slug === project.slug));
	let prevProject = $derived(projects[(currentIndex - 1 + projects.length) % projects.length]);
	let nextProject = $derived(projects[(currentIndex + 1) % projects.length]);

	// Title scramble. The parent layout keys this page on the slug, so the component is
	// re-created for every project and may read the initial data here.
	let titleLetters = $derived(project.title.split(''));
	// Start from the real title so the prerendered heading is readable; the client
	// scramble replaces it right before the intro reveals the title.
	let displayChars = $state<string[]>(untrack(() => data.project.title.split('')));

	let heroEl = $state<HTMLElement | null>(null);
	let numberEl = $state<HTMLElement | null>(null);
	let subtitleEl = $state<HTMLElement | null>(null);
	let metaEl = $state<HTMLElement | null>(null);
	let titleChars = $state<HTMLSpanElement[]>([]);

	onMount(() => {
		let cancelScramble: (() => void) | null = null;
		const tl = gsap.timeline({ defaults: { ease: 'power4.out' }, delay: 0.3 });

		tl.from(numberEl, { y: 20, opacity: 0, duration: 0.6 }, 0);

		titleChars.forEach((el) => {
			if (el) el.style.opacity = '0';
		});
		tl.add(() => {
			cancelScramble = scramble(titleLetters, (chars) => (displayChars = chars));
			titleChars.forEach((el) => {
				if (el) el.style.opacity = '1';
			});
		}, 0.2);

		tl.from(subtitleEl, { y: 20, opacity: 0, duration: 0.6 }, 0.6);
		tl.from(metaEl, { y: 20, opacity: 0, duration: 0.6 }, 0.8);

		return () => {
			tl.kill();
			cancelScramble?.();
		};
	});
</script>

<svelte:head>
	<title>{project.title} — Srthk Pthk</title>
	<meta name="description" content={project.description} />
	<link rel="canonical" href="{SITE_URL}/projects/{project.slug}" />

	<!-- Open Graph -->
	<meta property="og:title" content="{project.title} — Srthk Pthk" />
	<meta property="og:description" content={project.description} />
	<meta property="og:type" content="article" />
	<meta property="og:url" content="{SITE_URL}/projects/{project.slug}" />
	<meta property="og:image" content="{SITE_URL}/og-image.png" />

	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="{project.title} — Srthk Pthk" />
	<meta name="twitter:description" content={project.description} />
	<meta name="twitter:image" content="{SITE_URL}/og-image.png" />
</svelte:head>

<!-- A. Project Hero -->
<section
	bind:this={heroEl}
	class="relative flex min-h-screen items-center justify-center overflow-hidden px-6"
>
	<!-- Gradient overlay -->
	<div
		class="pointer-events-none absolute inset-0 bg-gradient-to-br opacity-30 {project.gradient}"
	></div>

	<div class="relative z-10 mx-auto max-w-4xl text-center">
		<!-- Back button -->
		<a
			href="{base}/#projects"
			class="group mb-12 inline-flex items-center gap-2 font-mono text-sm text-text-muted transition-colors hover:text-accent-violet"
		>
			<svg
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="1.5"
				class="transition-transform duration-300 group-hover:-translate-x-1"
			>
				<path d="M19 12H5M12 19l-7-7 7-7" />
			</svg>
			Back to Projects
		</a>

		<!-- Number -->
		<p bind:this={numberEl} class="mb-4 font-mono text-sm tracking-widest text-accent-violet">
			Project {project.number}
		</p>

		<!-- Title with scramble -->
		<h1
			class="font-heading text-5xl font-black tracking-tight md:text-7xl lg:text-8xl"
			style="line-height: 1.1;"
		>
			{#each titleLetters as char, i}
				{#if char === ' '}
					<span class="inline-block w-4 md:w-6">&nbsp;</span>
				{:else}
					<span
						bind:this={titleChars[i]}
						class="inline-block bg-gradient-to-r from-text-primary via-accent-violet to-accent-cyan bg-clip-text text-transparent"
					>{displayChars[i]}</span>
				{/if}
			{/each}
		</h1>

		<!-- Subtitle -->
		<p bind:this={subtitleEl} class="mx-auto mt-6 max-w-2xl text-lg text-text-muted">
			{project.description}
		</p>

		<!-- Meta -->
		<div bind:this={metaEl} class="mt-8 flex items-center justify-center gap-6 font-mono text-xs text-text-subtle">
			<span>{project.role}</span>
			<span class="h-3 w-px bg-border"></span>
			<span>{project.year}</span>
		</div>
	</div>
</section>

<!-- B. Long Description -->
<section class="mx-auto max-w-3xl px-6 py-24">
	<div class="space-y-6" use:scrollReveal={{ stagger: 0.15, y: 30 }}>
		{#each project.longDescription as paragraph}
			<p class="text-base leading-relaxed text-text-muted">{paragraph}</p>
		{/each}
	</div>
</section>

<!-- C. Features/Highlights -->
<section class="mx-auto max-w-3xl px-6 py-24">
	<SectionHeading number={project.number} title="Features" />
	<div class="space-y-4" use:scrollReveal={{ stagger: 0.1, y: 30 }}>
		{#each project.features as feature, i}
			<div class="flex gap-4 border-l-2 border-accent-violet/30 py-3 pl-6">
				<span class="shrink-0 font-mono text-sm text-accent-violet">
					{String(i + 1).padStart(2, '0')}
				</span>
				<p class="text-sm leading-relaxed text-text-muted">{feature}</p>
			</div>
		{/each}
	</div>
</section>

<!-- D. Tech Stack -->
<section class="mx-auto max-w-3xl px-6 py-24">
	<SectionHeading number={project.number} title="Tech Stack" />
	<div class="grid grid-cols-1 gap-3 md:grid-cols-3" use:scrollReveal={{ stagger: 0.08, y: 30 }}>
		{#each project.tech as tech}
			<div class="rounded-lg border border-border bg-bg-card/80 px-4 py-3 text-center">
				<span class="font-mono text-sm text-text-primary">{tech}</span>
			</div>
		{/each}
	</div>
</section>

<!-- E. Links -->
{#if project.links.github || project.links.demo}
	<section class="mx-auto max-w-3xl px-6 py-24">
		<div class="flex flex-wrap items-center justify-center gap-4" use:scrollReveal>
			{#if project.links.github}
				<a
					href={project.links.github}
					target="_blank"
					rel="noopener noreferrer"
					class="group inline-flex items-center gap-2 rounded-full border border-accent-violet px-6 py-3 font-mono text-sm text-accent-violet transition-all duration-300 hover:bg-accent-violet hover:text-bg"
				>
					<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
						<path
							d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"
						/>
					</svg>
					View Source
				</a>
			{/if}
			{#if project.links.demo}
				<a
					href={project.links.demo}
					target="_blank"
					rel="noopener noreferrer"
					class="group inline-flex items-center gap-2 rounded-full border border-accent-cyan px-6 py-3 font-mono text-sm text-accent-cyan transition-all duration-300 hover:bg-accent-cyan hover:text-bg"
				>
					<svg
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.5"
					>
						<path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
					</svg>
					Live Demo
				</a>
			{/if}
		</div>
	</section>
{/if}

<!-- F. Prev/Next Navigation -->
<section class="mx-auto max-w-3xl px-6 py-24">
	<div class="flex items-stretch justify-between gap-4 border-t border-border pt-12" use:scrollReveal>
		<a
			href="{base}/projects/{prevProject.slug}"
			class="group flex flex-col items-start gap-2 text-left transition-colors hover:text-accent-violet"
		>
			<span class="font-mono text-xs text-text-subtle transition-colors group-hover:text-accent-violet">
				&larr; Previous
			</span>
			<span class="font-mono text-xs text-text-subtle">{prevProject.number}</span>
			<span class="font-heading text-lg font-bold text-text-primary transition-colors group-hover:text-accent-violet">
				{prevProject.title}
			</span>
		</a>
		<a
			href="{base}/projects/{nextProject.slug}"
			class="group flex flex-col items-end gap-2 text-right transition-colors hover:text-accent-violet"
		>
			<span class="font-mono text-xs text-text-subtle transition-colors group-hover:text-accent-violet">
				Next &rarr;
			</span>
			<span class="font-mono text-xs text-text-subtle">{nextProject.number}</span>
			<span class="font-heading text-lg font-bold text-text-primary transition-colors group-hover:text-accent-violet">
				{nextProject.title}
			</span>
		</a>
	</div>
</section>

<!-- G. Footer -->
<Footer />
