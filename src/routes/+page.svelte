<script lang="ts">
	import { SITE_URL } from '$lib/data/content';
	import Hero from '$lib/components/Hero.svelte';
	import About from '$lib/components/About.svelte';
	import Skills from '$lib/components/Skills.svelte';
	import Education from '$lib/components/Education.svelte';
	import Projects from '$lib/components/Projects.svelte';
	import Contact from '$lib/components/Contact.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import SectionDivider from '$lib/components/SectionDivider.svelte';
	import Marquee from '$lib/components/Marquee.svelte';

	const title = 'Sarthak Pathak — Software Engineer';
	const description =
		'Software Engineer specializing in cloud-native architecture, Spring Boot, AWS, and Flutter.';
	const ogImage = `${SITE_URL}/og-image.png`;
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content="Sarthak Pathak — {description}" />
	<link rel="canonical" href="{SITE_URL}/" />

	<!-- Open Graph -->
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="{SITE_URL}/" />
	<meta property="og:image" content={ogImage} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />

	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={ogImage} />
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
