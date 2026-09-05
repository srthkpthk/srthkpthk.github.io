<script lang="ts">
	import type { ThemeMode } from '$lib/stores/theme';

	let { mode }: { mode: ThemeMode } = $props();
</script>

{#if mode === 'auto'}
	<svg
		width="16"
		height="16"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="1.5"
		aria-hidden="true"
	>
		<circle cx="12" cy="12" r="5" />
		<path
			d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
		/>
		<path d="M16 12a4 4 0 01-4 4" stroke-dasharray="3 3" />
	</svg>
{:else if mode === 'light'}
	<svg
		width="16"
		height="16"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="1.5"
		aria-hidden="true"
	>
		<circle cx="12" cy="12" r="5" />
		<path
			d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
		/>
	</svg>
{:else}
	<svg
		width="16"
		height="16"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="1.5"
		aria-hidden="true"
	>
		<path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
	</svg>
{/if}
