import { describe, expect, it } from 'vitest';
import { shouldResetScroll } from './lenis';

const nav = (type: string, path: string | null) => ({
	type,
	to: path === null ? null : { url: new URL(path, 'https://example.test') }
});

describe('shouldResetScroll', () => {
	it('resets on ordinary link and goto navigations', () => {
		expect(shouldResetScroll(nav('link', '/projects/quickflip'))).toBe(true);
		expect(shouldResetScroll(nav('goto', '/'))).toBe(true);
	});

	it('leaves hash navigations alone so the browser lands on the target', () => {
		expect(shouldResetScroll(nav('link', '/#projects'))).toBe(false);
		expect(shouldResetScroll(nav('goto', '/#about'))).toBe(false);
	});

	it('leaves popstate alone so SvelteKit can restore the previous position', () => {
		expect(shouldResetScroll(nav('popstate', '/'))).toBe(false);
	});

	it('resets when the destination is unknown', () => {
		expect(shouldResetScroll(nav('link', null))).toBe(true);
	});
});
