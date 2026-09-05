import { writable, get } from 'svelte/store';

// --- Time-of-day accent hue shifting (unchanged) ---

export const timeAccent = writable<'dawn' | 'day' | 'dusk' | 'night'>('day');

function hslToHex(h: number, s: number, l: number): string {
	l /= 100;
	const a = (s * Math.min(l, 1 - l)) / 100;
	const f = (n: number) => {
		const k = (n + h / 30) % 12;
		const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
		return Math.round(255 * color)
			.toString(16)
			.padStart(2, '0');
	};
	return `#${f(0)}${f(8)}${f(4)}`;
}

export function updateTimeAccent() {
	const hour = new Date().getHours();

	let shift: number;
	let period: 'dawn' | 'day' | 'dusk' | 'night';

	if (hour >= 5 && hour < 8) {
		shift = 20;
		period = 'dawn';
	} else if (hour >= 8 && hour < 17) {
		shift = 0;
		period = 'day';
	} else if (hour >= 17 && hour < 20) {
		shift = 15;
		period = 'dusk';
	} else {
		shift = -15;
		period = 'night';
	}

	timeAccent.set(period);

	const violet = hslToHex(263 + shift, 90, 66);
	const cyan = hslToHex(187 + shift, 96, 42);

	document.documentElement.style.setProperty('--color-accent-violet', violet);
	document.documentElement.style.setProperty('--color-accent-cyan', cyan);
}

// --- Sunrise / Sunset theme system (hour-based) ---

export type ThemeMode = 'auto' | 'light' | 'dark';

export const themeMode = writable<ThemeMode>('auto');
export const resolvedTheme = writable<'light' | 'dark'>('dark');

/** Daytime = 6 AM to 7 PM */
function isDaytime(): boolean {
	const h = new Date().getHours();
	return h >= 6 && h < 19;
}

function applyTheme(theme: 'light' | 'dark') {
	const html = document.documentElement;
	if (theme === 'light') {
		html.classList.add('light');
	} else {
		html.classList.remove('light');
	}
	resolvedTheme.set(theme);
}

let themeInterval: ReturnType<typeof setInterval> | null = null;

export function initTheme(): () => void {
	// Read persisted preference
	const stored = localStorage.getItem('theme-preference') as ThemeMode | null;
	const mode = stored || 'auto';
	themeMode.set(mode);

	resolveAndApply(mode);

	// Check every 60s for sunrise/sunset transitions
	themeInterval = setInterval(() => {
		resolveAndApply(get(themeMode));
	}, 60000);

	// Subscribe to mode changes
	const unsub = themeMode.subscribe((m) => {
		localStorage.setItem('theme-preference', m);
		resolveAndApply(m);
	});

	return () => {
		unsub();
		if (themeInterval) clearInterval(themeInterval);
	};
}

function resolveAndApply(mode: ThemeMode) {
	let theme: 'light' | 'dark';
	if (mode === 'light') {
		theme = 'light';
	} else if (mode === 'dark') {
		theme = 'dark';
	} else {
		theme = isDaytime() ? 'light' : 'dark';
	}
	applyTheme(theme);
}

export function toggleTheme() {
	const current = get(themeMode);
	const next: ThemeMode = current === 'auto' ? 'light' : current === 'light' ? 'dark' : 'auto';
	themeMode.set(next);
}

export function setThemeMode(mode: ThemeMode) {
	themeMode.set(mode);
}
