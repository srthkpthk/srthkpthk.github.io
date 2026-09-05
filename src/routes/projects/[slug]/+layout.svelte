<script lang="ts">
	import { page } from '$app/state';

	let { children } = $props();
</script>

<!--
	Prev/next links navigate between params of the same route, which would otherwise
	reuse the page component. Keying on the slug re-instantiates it so the intro
	timeline, scroll reveals and title scramble restart for the new project.
-->
{#key page.params.slug}
	{@render children()}
{/key}
