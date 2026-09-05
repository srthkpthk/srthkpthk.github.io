<script lang="ts">
	import { contactContent, siteConfig } from '$lib/data/content';
	import { scrollReveal } from '$lib/actions/gsap';
	import { magnetic } from '$lib/actions/magnetic';

	const words = contactContent.heading.split(' ');
</script>

<section
	id="contact"
	class="relative flex min-h-screen flex-col items-center justify-center px-6 py-32"
>
	<!-- Large heading -->
	<div class="mb-8 text-center" use:scrollReveal={{ stagger: 0.1 }}>
		{#each words as word}
			<span
				class="mr-4 inline-block font-heading text-5xl font-black text-text-primary md:text-7xl lg:text-8xl"
			>
				{word}
			</span>
		{/each}
	</div>

	<p class="mb-12 text-center text-lg text-text-muted" use:scrollReveal={{ delay: 0.3 }}>
		{contactContent.subheading}
	</p>

	<!-- CTA Button -->
	<div use:scrollReveal={{ delay: 0.5 }} use:magnetic>
		<a
			href="mailto:{contactContent.email}"
			class="group relative inline-block overflow-hidden rounded-full border border-accent-violet px-10 py-4 font-heading text-lg font-bold text-text-primary transition-all duration-500 hover:text-bg"
			data-cursor-hover
		>
			<span
				class="absolute inset-0 -translate-x-full bg-gradient-to-r from-accent-violet to-accent-cyan transition-transform duration-500 group-hover:translate-x-0"
			></span>
			<span class="relative">{contactContent.cta}</span>
		</a>
	</div>

	<!-- Social links -->
	<div class="mt-16 flex gap-8" use:scrollReveal={{ delay: 0.6 }}>
		<a
			href={siteConfig.social.github}
			target="_blank"
			rel="noopener noreferrer"
			class="text-text-subtle transition-colors duration-300 hover:text-text-primary"
			data-cursor-hover
		>
			GitHub
		</a>
		<a
			href={siteConfig.social.linkedin}
			target="_blank"
			rel="noopener noreferrer"
			class="text-text-subtle transition-colors duration-300 hover:text-[#0077B5]"
			data-cursor-hover
		>
			LinkedIn
		</a>
		<a
			href={siteConfig.social.twitter}
			target="_blank"
			rel="noopener noreferrer"
			class="text-text-subtle transition-colors duration-300 hover:text-text-primary"
			data-cursor-hover
		>
			Twitter
		</a>
	</div>
</section>
