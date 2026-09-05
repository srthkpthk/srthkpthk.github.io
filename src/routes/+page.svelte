<script lang="ts">
	import { base } from '$app/paths';
	import Hero from '$lib/components/Hero.svelte';
	import About from '$lib/components/About.svelte';
	import Skills from '$lib/components/Skills.svelte';
	import Education from '$lib/components/Education.svelte';
	import Projects from '$lib/components/Projects.svelte';
	import Contact from '$lib/components/Contact.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import SectionDivider from '$lib/components/SectionDivider.svelte';
	import Marquee from '$lib/components/Marquee.svelte';
</script>

<svelte:head>
	<title>Sarthak Pathak — Software Engineer</title>
	<meta name="description" content="Sarthak Pathak — Software Engineer specializing in cloud-native architecture, Spring Boot, AWS, and Flutter." />
	<link rel="canonical" href="https://srthkpthk.github.io/" />

	<!-- Open Graph -->
	<meta property="og:title" content="Sarthak Pathak — Software Engineer" />
	<meta property="og:description" content="Software Engineer specializing in cloud-native architecture, Spring Boot, AWS, and Flutter." />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://srthkpthk.github.io/" />
	<meta property="og:image" content="{base}/og-image.png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />

	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Sarthak Pathak — Software Engineer" />
	<meta name="twitter:description" content="Software Engineer specializing in cloud-native architecture, Spring Boot, AWS, and Flutter." />
	<meta name="twitter:image" content="{base}/og-image.png" />
</svelte:head>

<Hero />
<SectionDivider />
<About />
<SectionDivider />
<Skills />
<Education />
<Marquee items={['CREATIVE', 'DEVELOPER', 'DESIGNER', 'ENGINEER', 'INNOVATOR', 'BUILDER']} speed={35} />
<SectionDivider />
<Projects />
<SectionDivider />
<Contact />
<Footer />
