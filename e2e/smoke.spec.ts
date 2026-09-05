import { expect, test } from '@playwright/test';
import { collectErrors, waitForPreloader } from './helpers';

test('home page renders without runtime errors', async ({ page }) => {
	const errors = collectErrors(page);

	await page.goto('/');
	await waitForPreloader(page);

	await expect(page.locator('h1')).toBeVisible();
	await expect(page.locator('nav')).toBeVisible();
	expect(errors).toEqual([]);
});

test('preloader releases the page within 2.5 seconds', async ({ page }) => {
	const started = Date.now();
	await page.goto('/');

	await page.getByTestId('preloader').waitFor({ state: 'detached', timeout: 2_500 });
	const elapsed = Date.now() - started;

	expect(elapsed).toBeLessThan(2_500);
	await expect(page.locator('h1')).toBeVisible();
});
