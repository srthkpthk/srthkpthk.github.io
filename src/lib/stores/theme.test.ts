import { describe, expect, it } from 'vitest';
import {
	ACCENT_HSL,
	accentHex,
	getPeriod,
	hslToHex,
	isDaytimeHour,
	nextThemeMode,
	resolveTheme
} from './theme';

describe('getPeriod', () => {
	it('maps hours to dawn/day/dusk/night at the documented boundaries', () => {
		expect(getPeriod(4)).toBe('night');
		expect(getPeriod(5)).toBe('dawn');
		expect(getPeriod(7)).toBe('dawn');
		expect(getPeriod(8)).toBe('day');
		expect(getPeriod(16)).toBe('day');
		expect(getPeriod(17)).toBe('dusk');
		expect(getPeriod(19)).toBe('dusk');
		expect(getPeriod(20)).toBe('night');
		expect(getPeriod(23)).toBe('night');
	});
});

describe('isDaytimeHour / resolveTheme', () => {
	it('treats 6:00–18:59 as daytime, matching the app.html bootstrap script', () => {
		expect(isDaytimeHour(5)).toBe(false);
		expect(isDaytimeHour(6)).toBe(true);
		expect(isDaytimeHour(18)).toBe(true);
		expect(isDaytimeHour(19)).toBe(false);
	});

	it('honours explicit modes and follows the clock in auto', () => {
		expect(resolveTheme('light', 23)).toBe('light');
		expect(resolveTheme('dark', 12)).toBe('dark');
		expect(resolveTheme('auto', 12)).toBe('light');
		expect(resolveTheme('auto', 22)).toBe('dark');
	});
});

describe('nextThemeMode', () => {
	it('cycles auto → light → dark → auto', () => {
		expect(nextThemeMode('auto')).toBe('light');
		expect(nextThemeMode('light')).toBe('dark');
		expect(nextThemeMode('dark')).toBe('auto');
	});
});

describe('hslToHex / accentHex', () => {
	it('converts primaries', () => {
		expect(hslToHex(0, 100, 50)).toBe('#ff0000');
		expect(hslToHex(120, 100, 50)).toBe('#00ff00');
		expect(hslToHex(240, 100, 50)).toBe('#0000ff');
	});

	it('applies the period hue shift to the base colours', () => {
		const [h, s, l] = ACCENT_HSL.dark.violet;
		expect(accentHex('dark', 'day').violet).toBe(hslToHex(h, s, l));
		expect(accentHex('dark', 'dawn').violet).toBe(hslToHex(h + 20, s, l));
		expect(accentHex('light', 'night').cyan).toBe(
			hslToHex(ACCENT_HSL.light.cyan[0] - 15, ACCENT_HSL.light.cyan[1], ACCENT_HSL.light.cyan[2])
		);
	});
});
