<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { navLinks, siteConfig, projectsContent } from '$lib/data/content';
	import { setThemeMode, toggleTheme } from '$lib/stores/theme';
	import { smoothScrollTo } from '$lib/stores/lenis';

	let open = $state(false);
	let query = $state('');
	let selectedIndex = $state(0);
	let inputEl = $state<HTMLInputElement | null>(null);

	interface PaletteItem {
		label: string;
		description?: string;
		action: () => void;
		icon: string;
	}

	function navigateToSection(href: string) {
		const el = document.querySelector<HTMLElement>(href);
		if (el) {
			smoothScrollTo(el);
		} else {
			goto(`${base}/${href}`);
		}
		close();
	}

	const items: PaletteItem[] = [
		...navLinks.map((link) => ({
			label: link.label,
			description: `Go to ${link.label} section`,
			action: () => navigateToSection(link.href),
			icon: '#'
		})),
		{
			label: 'Toggle Theme',
			description: 'Cycle: auto → light → dark',
			action: () => {
				toggleTheme();
				close();
			},
			icon: '◑'
		},
		{
			label: 'Light Mode',
			description: 'Switch to light theme',
			action: () => {
				setThemeMode('light');
				close();
			},
			icon: '☀'
		},
		{
			label: 'Dark Mode',
			description: 'Switch to dark theme',
			action: () => {
				setThemeMode('dark');
				close();
			},
			icon: '☾'
		},
		{
			label: 'Auto Theme',
			description: 'Follow sunrise/sunset',
			action: () => {
				setThemeMode('auto');
				close();
			},
			icon: '⚙'
		},
		{
			label: 'Scroll to top',
			description: 'Go to the beginning',
			action: () => {
				smoothScrollTo(0);
				close();
			},
			icon: '^'
		},
		{
			label: 'Rainbow Party',
			description: 'Trigger the konami easter egg',
			action: () => {
				document.dispatchEvent(new CustomEvent('konami'));
				close();
			},
			icon: '*'
		},
		{
			label: 'GitHub',
			description: siteConfig.social.github,
			action: () => {
				window.open(siteConfig.social.github, '_blank');
				close();
			},
			icon: '>'
		},
		{
			label: 'LinkedIn',
			description: siteConfig.social.linkedin,
			action: () => {
				window.open(siteConfig.social.linkedin, '_blank');
				close();
			},
			icon: '>'
		},
		...projectsContent.projects.map((project) => ({
			label: `View ${project.title}`,
			description: project.description,
			action: () => {
				goto(`${base}/projects/${project.slug}`);
				close();
			},
			icon: '→'
		}))
	];

	let filtered = $derived(
		query.trim()
			? items.filter((item) => item.label.toLowerCase().includes(query.toLowerCase()))
			: items
	);

	function close() {
		open = false;
		query = '';
		selectedIndex = 0;
	}

	function handleKeydown(e: KeyboardEvent) {
		if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
			e.preventDefault();
			open = !open;
			if (!open) close();
			return;
		}

		if (!open) return;

		if (e.key === 'Escape') {
			e.preventDefault();
			close();
		} else if (e.key === 'ArrowDown') {
			e.preventDefault();
			selectedIndex = (selectedIndex + 1) % Math.max(filtered.length, 1);
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			selectedIndex = (selectedIndex - 1 + filtered.length) % Math.max(filtered.length, 1);
		} else if (e.key === 'Enter') {
			e.preventDefault();
			if (filtered[selectedIndex]) {
				filtered[selectedIndex].action();
			}
		}
	}

	$effect(() => {
		if (open && inputEl) {
			// Focus input when palette opens
			requestAnimationFrame(() => inputEl?.focus());
		}
	});

	onMount(() => {
		document.addEventListener('keydown', handleKeydown);
		return () => document.removeEventListener('keydown', handleKeydown);
	});
</script>

{#if open}
	<!-- Backdrop -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="fixed inset-0 z-[9990] bg-bg/80 backdrop-blur-sm"
		style="animation: paletteFadeIn 0.15s ease;"
		onclick={close}
		onkeydown={() => {}}
	></div>

	<!-- Palette -->
	<div
		class="fixed left-1/2 top-[20%] z-[9991] w-[90vw] max-w-lg -translate-x-1/2 rounded-xl border border-border bg-bg-card shadow-2xl shadow-accent-violet/5"
		style="animation: paletteSlideDown 0.15s ease;"
	>
		<!-- Search input -->
		<div class="flex items-center gap-3 border-b border-border px-4 py-3">
			<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="text-text-subtle shrink-0">
				<circle cx="11" cy="11" r="8" />
				<path d="M21 21l-4.35-4.35" />
			</svg>
			<input
				bind:this={inputEl}
				bind:value={query}
				oninput={() => (selectedIndex = 0)}
				placeholder="Search commands..."
				class="w-full bg-transparent font-mono text-sm text-text-primary outline-none placeholder:text-text-subtle"
			/>
			<kbd class="shrink-0 rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-text-subtle">ESC</kbd>
		</div>

		<!-- Results -->
		<div class="max-h-64 overflow-y-auto p-2">
			{#each filtered as item, i}
				<button
					class="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors {i === selectedIndex ? 'bg-bg-hover text-text-primary' : 'text-text-muted hover:bg-bg-hover/50'}"
					onclick={() => item.action()}
					onmouseenter={() => (selectedIndex = i)}
				>
					<span class="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-bg-hover font-mono text-xs text-accent-violet">
						{item.icon}
					</span>
					<div class="min-w-0 flex-1">
						<div class="text-sm font-medium">{item.label}</div>
						{#if item.description}
							<div class="truncate text-xs text-text-subtle">{item.description}</div>
						{/if}
					</div>
				</button>
			{/each}
			{#if filtered.length === 0}
				<p class="px-3 py-4 text-center text-sm text-text-subtle">No results found</p>
			{/if}
		</div>

		<!-- Footer -->
		<div class="flex items-center gap-4 border-t border-border px-4 py-2">
			<span class="flex items-center gap-1 text-[10px] text-text-subtle">
				<kbd class="rounded border border-border px-1 py-0.5 font-mono">↑↓</kbd> Navigate
			</span>
			<span class="flex items-center gap-1 text-[10px] text-text-subtle">
				<kbd class="rounded border border-border px-1 py-0.5 font-mono">↵</kbd> Select
			</span>
		</div>
	</div>
{/if}

<style>
	@keyframes paletteFadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}
	@keyframes paletteSlideDown {
		from { opacity: 0; transform: translate(-50%, -10px); }
		to { opacity: 1; transform: translate(-50%, 0); }
	}
</style>
