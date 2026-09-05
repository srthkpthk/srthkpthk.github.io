import { expect, test } from '@playwright/test';
import { collectErrors, waitForPreloader } from './helpers';

// The default config forces reduced motion so the WebGL hero is skipped. These tests opt
// back in to exercise the real Three.js path. Headless Chromium renders WebGL on the CPU
// (SwiftShader), so they run serially and with an extended timeout to avoid starving
// each other.
test.use({ reducedMotion: 'no-preference' });
test.describe.configure({ mode: 'serial' });

test('hero particle scene boots on WebGL and fades in', async ({ page }) => {
	test.slow();
	const errors = collectErrors(page);

	await page.goto('/');
	await waitForPreloader(page, 15_000);

	const canvases = page.locator('canvas');
	await expect(canvases).toHaveCount(2);

	// threeReady flips the canvas opacity from 0 to 0.9 once the first frame rendered.
	await expect
		.poll(() => canvases.first().evaluate((el) => getComputedStyle(el).opacity), { timeout: 10_000 })
		.toBe('0.9');

	expect(errors).toEqual([]);
});

test('particle scene pauses while the tab is hidden', async ({ page }) => {
	test.slow();
	await page.goto('/');
	await waitForPreloader(page, 15_000);

	const canvas = page.locator('canvas').first();
	await expect(canvas).toHaveAttribute('data-state', 'running');

	const setHidden = (hidden: boolean) =>
		page.evaluate((value) => {
			Object.defineProperty(document, 'hidden', { value, configurable: true });
			document.dispatchEvent(new Event('visibilitychange'));
		}, hidden);

	await setHidden(true);
	await expect(canvas).toHaveAttribute('data-state', 'paused');

	await setHidden(false);
	await expect(canvas).toHaveAttribute('data-state', 'running');
});
