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
