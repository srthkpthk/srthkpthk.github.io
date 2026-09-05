import { expect, test } from '@playwright/test';
import { waitForPreloader } from './helpers';

const activeLink = (page: import('@playwright/test').Page) =>
	page.locator('nav a[aria-current="true"]');

test('nav highlights the section in view', async ({ page }) => {
	await page.goto('/');
	await waitForPreloader(page);

	await page.locator('#about').evaluate((el) => el.scrollIntoView());
	await expect(activeLink(page)).toHaveText('About', { timeout: 5_000 });

	await page.locator('#contact').evaluate((el) => el.scrollIntoView());
	await expect(activeLink(page)).toHaveText('Contact', { timeout: 5_000 });
});

test('section tracking survives a round trip through a project page', async ({ page }) => {
	await page.goto('/');
	await waitForPreloader(page);

	await page.locator('#projects a').first().click();
	await expect(page).toHaveURL(/\/projects\//);
	await expect(activeLink(page)).toHaveCount(0);

	await page.getByRole('link', { name: 'SP.' }).click();
	await expect(page).toHaveURL(/\/$/);

	await page.locator('#skills').evaluate((el) => el.scrollIntoView());
	await expect(activeLink(page)).toHaveText('Skills', { timeout: 5_000 });
});
