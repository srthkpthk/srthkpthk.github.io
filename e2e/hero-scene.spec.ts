import { expect, test } from '@playwright/test';
import { collectErrors, waitForPreloader } from './helpers';

// The default config forces reduced motion so the WebGL hero is skipped; this
// spec opts back in to exercise the real Three.js path (SwiftShader in headless).
test.use({ reducedMotion: 'no-preference' });

test('hero particle scene boots on WebGL and fades in', async ({ page }) => {
	const errors = collectErrors(page);

	await page.goto('/');
	await waitForPreloader(page);

	const canvases = page.locator('canvas');
	await expect(canvases).toHaveCount(2);

	// threeReady flips the canvas opacity from 0 to 0.9 once the first frame rendered.
	await expect
		.poll(() => canvases.first().evaluate((el) => getComputedStyle(el).opacity), { timeout: 10_000 })
		.toBe('0.9');

	expect(errors).toEqual([]);
});
