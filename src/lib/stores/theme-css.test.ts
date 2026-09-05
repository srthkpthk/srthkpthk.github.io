import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { accentHex, type Period, type ResolvedTheme } from './theme';

// Keeps the generated overrides in src/app.css in lock-step with the TS colour data.
// (Read from disk: Vitest's CSS handling returns an empty module for `?raw` CSS imports.)
const css = readFileSync(new URL('../../app.css', import.meta.url), 'utf8');
const themeSource = readFileSync(new URL('./theme.ts', import.meta.url), 'utf8');

const SHIFTED: Period[] = ['dawn', 'dusk', 'night'];
const THEMES: ResolvedTheme[] = ['dark', 'light'];

function block(theme: ResolvedTheme, period: Period): Record<string, string> | null {
	const selector =
		theme === 'light' ? `html.light[data-period='${period}']` : `html[data-period='${period}']`;
	const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	const match = css.match(new RegExp(`${escaped}\\s*\\{([^}]*)\\}`));
	if (!match) return null;
	return Object.fromEntries(
		[...match[1].matchAll(/(--[\w-]+):\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()])
	);
}

describe('app.css period overrides', () => {
	it('has a rule for every shifted period in both themes', () => {
		for (const theme of THEMES) {
			for (const period of SHIFTED) {
				expect(block(theme, period), `${theme}/${period}`).not.toBeNull();
			}
		}
	});

	it('uses the hexes computed by accentHex', () => {
		for (const theme of THEMES) {
			for (const period of SHIFTED) {
				const rule = block(theme, period)!;
				const expected = accentHex(theme, period);
				expect(rule['--color-accent-violet'], `${theme}/${period} violet`).toBe(expected.violet);
				expect(rule['--color-accent-cyan'], `${theme}/${period} cyan`).toBe(expected.cyan);
			}
		}
	});

	it('leaves the day period to the base tokens', () => {
		expect(block('dark', 'day')).toBeNull();
		expect(block('light', 'day')).toBeNull();
	});

	it('never sets the accents as inline styles from the theme store', () => {
		expect(themeSource).not.toMatch(/style\.setProperty\(/);
	});
});
