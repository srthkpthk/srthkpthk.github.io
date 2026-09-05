import { writable, get } from 'svelte/store';

export type Period = 'dawn' | 'day' | 'dusk' | 'night';
export type ThemeMode = 'auto' | 'light' | 'dark';
export type ResolvedTheme = 'light' | 'dark';

type Hsl = [hue: number, saturation: number, lightness: number];

/** Hue shift applied to the accent colours for each part of the day. */
export const PERIOD_SHIFT: Record<Period, number> = { dawn: 20, day: 0, dusk: 15, night: -15 };

/**
 * Base accent colours per theme. `day` renders the unshifted design tokens from app.css;
 * the other periods are generated from these values (see accentHex) and written into
 * app.css as html[data-period] / html.light[data-period] overrides.
 */
export const ACCENT_HSL: Record<ResolvedTheme, { violet: Hsl; cyan: Hsl }> = {
	dark: { violet: [263, 90, 66], cyan: [187, 96, 42] },
	light: { violet: [262, 83, 58], cyan: [192, 91, 36] }
};

export function hslToHex(h: number, s: number, l: number): string {
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

/** Accent hexes for a theme/period pair. The CSS overrides in app.css must match these. */
export function accentHex(theme: ResolvedTheme, period: Period): { violet: string; cyan: string } {
	const shift = PERIOD_SHIFT[period];
	const { violet, cyan } = ACCENT_HSL[theme];
	return {
		violet: hslToHex(violet[0] + shift, violet[1], violet[2]),
		cyan: hslToHex(cyan[0] + shift, cyan[1], cyan[2])
	};
}

export function getPeriod(hour: number): Period {
	if (hour >= 5 && hour < 8) return 'dawn';
	if (hour >= 8 && hour < 17) return 'day';
	if (hour >= 17 && hour < 20) return 'dusk';
	return 'night';
}

/** Daytime is 6 AM to 7 PM; keep in sync with the pre-hydration script in app.html. */
export function isDaytimeHour(hour: number): boolean {
	return hour >= 6 && hour < 19;
}

export function resolveTheme(mode: ThemeMode, hour: number): ResolvedTheme {
	if (mode === 'light' || mode === 'dark') return mode;
	return isDaytimeHour(hour) ? 'light' : 'dark';
}

export function nextThemeMode(mode: ThemeMode): ThemeMode {
	return mode === 'auto' ? 'light' : mode === 'light' ? 'dark' : 'auto';
}

// --- Stores ---

export const timeAccent = writable<Period>('day');
export const themeMode = writable<ThemeMode>('auto');
export const resolvedTheme = writable<ResolvedTheme>('dark');

// --- Time-of-day accent shifting ---

export function updateTimeAccent() {
	const period = getPeriod(new Date().getHours());
	timeAccent.set(period);
	// The accent overrides live in app.css keyed on this attribute. Setting the custom
	// properties inline on <html> would beat the html.light rules and break light mode.
	document.documentElement.dataset.period = period;
}

// --- Sunrise / sunset theme system ---

function applyTheme(theme: ResolvedTheme) {
	document.documentElement.classList.toggle('light', theme === 'light');
	resolvedTheme.set(theme);
}

function resolveAndApply(mode: ThemeMode) {
	applyTheme(resolveTheme(mode, new Date().getHours()));
}

export function initTheme(): () => void {
	const stored = localStorage.getItem('theme-preference');
	const mode: ThemeMode = stored === 'light' || stored === 'dark' ? stored : 'auto';
	themeMode.set(mode);
	resolveAndApply(mode);

	// Re-check every minute so auto mode follows sunrise/sunset while the tab is open.
	const interval = setInterval(() => resolveAndApply(get(themeMode)), 60_000);

	const unsub = themeMode.subscribe((m) => {
		localStorage.setItem('theme-preference', m);
		resolveAndApply(m);
	});

	return () => {
		unsub();
		clearInterval(interval);
	};
}

export function toggleTheme() {
	themeMode.set(nextThemeMode(get(themeMode)));
}

export function setThemeMode(mode: ThemeMode) {
	themeMode.set(mode);
}
