<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { base } from '$app/paths';
	import { navLinks } from '$lib/data/content';
	import { scrollY, scrollDirection, activeSection } from '$lib/stores/scroll';
	import { toggleTheme, themeMode } from '$lib/stores/theme';

	let visible = $state(true);
	let scrolled = $state(false);
	let mobileOpen = $state(false);
	let lastY = 0;

	let linkEls: HTMLAnchorElement[] = $state([]);
	let indicatorLeft = $state(0);
	let indicatorWidth = $state(0);
	let navContainer = $state<HTMLDivElement | null>(null);
	let currentActive = $state('hero');

	let isProjectPage = $derived(page.url.pathname.includes('/projects/'));

	onMount(() => {
		const unsub = scrollY.subscribe((y) => {
			scrolled = y > 50;
			if (y > lastY + 5) {
				scrollDirection.set('down');
				visible = false;
			} else if (y < lastY - 5) {
				scrollDirection.set('up');
				visible = true;
			}
			if (y < 100) visible = true;
			lastY = y;
		});

		const unsubActive = activeSection.subscribe((section) => {
			currentActive = section;
			updateIndicator(section);
		});

		return () => {
			unsub();
			unsubActive();
		};
	});

	function updateIndicator(section: string) {
		if (isProjectPage) {
			indicatorWidth = 0;
			return;
		}
		const href = `#${section}`;
		const idx = navLinks.findIndex((l) => l.href === href);
		if (idx >= 0 && linkEls[idx] && navContainer) {
			const linkRect = linkEls[idx].getBoundingClientRect();
			const navRect = navContainer.getBoundingClientRect();
			indicatorLeft = linkRect.left - navRect.left;
			indicatorWidth = linkRect.width;
		} else {
			indicatorWidth = 0;
		}
	}

	function navHref(linkHref: string): string {
		if (isProjectPage) {
			return `${base}/${linkHref}`;
		}
		return linkHref;
	}

	function handleNavClick() {
		mobileOpen = false;
	}
</script>

<nav
	class="fixed top-0 left-0 z-50 w-full transition-all duration-500"
	style="transform: translateY({visible ? 0 : -100}%); backdrop-filter: {scrolled ? 'blur(16px) saturate(180%)' : 'none'}; background-color: {scrolled ? 'var(--color-bg-nav)' : 'transparent'}; border-bottom: {scrolled ? '1px solid var(--color-border)' : 'none'};"
>
	<div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
		<a href={isProjectPage ? `${base}/` : '#hero'} class="font-heading text-lg font-bold tracking-tight text-text-primary" onclick={handleNavClick}>
			SP<span class="text-accent-violet">.</span>
		</a>

		<!-- Desktop nav -->
		<div bind:this={navContainer} class="relative hidden items-center gap-8 md:flex">
			{#each navLinks as link, i}
				<a
					bind:this={linkEls[i]}
					href={navHref(link.href)}
					class="group relative font-mono text-sm transition-colors hover:text-text-primary {!isProjectPage && currentActive === link.href.slice(1) ? 'text-text-primary' : 'text-text-muted'}"
				>
					{link.label}
					<span
						class="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-accent-violet transition-transform duration-300 group-hover:scale-x-100"
					></span>
				</a>
			{/each}

			<!-- Active section indicator -->
			{#if indicatorWidth > 0}
				<div
					class="absolute -bottom-1 h-[2px] bg-accent-violet transition-all duration-300 ease-out"
					style="left: {indicatorLeft}px; width: {indicatorWidth}px;"
				></div>
			{/if}

			<!-- Theme toggle -->
			<button
				onclick={toggleTheme}
				class="ml-2 flex items-center justify-center text-text-muted transition-colors hover:text-text-primary"
				aria-label="Toggle theme"
			>
				{#if $themeMode === 'auto'}
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
						<circle cx="12" cy="12" r="5" />
						<path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
						<path d="M16 12a4 4 0 01-4 4" stroke-dasharray="3 3" />
					</svg>
				{:else if $themeMode === 'light'}
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
						<circle cx="12" cy="12" r="5" />
						<path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
					</svg>
				{:else}
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
						<path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
					</svg>
				{/if}
			</button>
		</div>

		<!-- Mobile toggle -->
		<button
			class="relative z-50 flex h-8 w-8 flex-col items-center justify-center gap-1.5 md:hidden"
			onclick={() => (mobileOpen = !mobileOpen)}
			aria-label="Toggle menu"
		>
			<span
				class="h-px w-5 bg-text-primary transition-all duration-300"
				style="transform: {mobileOpen ? 'rotate(45deg) translate(2px, 2px)' : 'none'};"
			></span>
			<span
				class="h-px w-5 bg-text-primary transition-all duration-300"
				style="opacity: {mobileOpen ? 0 : 1};"
			></span>
			<span
				class="h-px w-5 bg-text-primary transition-all duration-300"
				style="transform: {mobileOpen ? 'rotate(-45deg) translate(2px, -2px)' : 'none'};"
			></span>
		</button>
	</div>

	<!-- Mobile menu overlay -->
	{#if mobileOpen}
		<div
			class="fixed inset-0 z-40 flex flex-col items-center justify-center gap-8 bg-bg md:hidden"
			style="animation: fadeIn 0.3s ease;"
		>
			{#each navLinks as link, i}
				<a
					href={navHref(link.href)}
					class="font-heading text-3xl font-bold transition-colors hover:text-accent-violet {!isProjectPage && currentActive === link.href.slice(1) ? 'text-accent-violet' : 'text-text-primary'}"
					onclick={handleNavClick}
					style="animation: slideUp 0.4s ease {i * 0.05}s both;"
				>
					{link.label}
				</a>
			{/each}

			<!-- Mobile theme toggle -->
			<button
				onclick={toggleTheme}
				class="mt-4 flex items-center gap-2 font-mono text-sm text-text-muted transition-colors hover:text-text-primary"
				aria-label="Toggle theme"
			>
				{#if $themeMode === 'auto'}
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
						<circle cx="12" cy="12" r="5" />
						<path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
						<path d="M16 12a4 4 0 01-4 4" stroke-dasharray="3 3" />
					</svg>
					Auto Theme
				{:else if $themeMode === 'light'}
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
						<circle cx="12" cy="12" r="5" />
						<path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
					</svg>
					Light Mode
				{:else}
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
						<path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
					</svg>
					Dark Mode
				{/if}
			</button>
		</div>
	{/if}
</nav>

<style>
	@keyframes fadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}
	@keyframes slideUp {
		from { opacity: 0; transform: translateY(20px); }
		to { opacity: 1; transform: translateY(0); }
	}
</style>
