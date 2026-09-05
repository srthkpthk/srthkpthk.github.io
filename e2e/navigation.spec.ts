import { expect, test } from '@playwright/test';
import { waitForPreloader } from './helpers';

test('smooth scrolling is active', async ({ page }) => {
	await page.goto('/');
	await waitForPreloader(page);

	await expect(page.locator('html')).toHaveClass(/\blenis\b/);
});

test('"Back to Projects" lands on the projects section, not the top', async ({ page }) => {
	await page.goto('/projects/quickflip');
	await waitForPreloader(page);

	await page.getByRole('link', { name: /back to projects/i }).click();

	await expect(page).toHaveURL(/\/#projects$/);
	await expect
		.poll(
			() => page.locator('#projects').evaluate((el) => Math.round(el.getBoundingClientRect().top)),
			{ timeout: 5_000 }
		)
		.toBeLessThan(200);
});

test('browser back restores the previous scroll position', async ({ page }) => {
	await page.goto('/');
	await waitForPreloader(page);

	const firstCard = page.locator('#projects a').first();
	await firstCard.scrollIntoViewIfNeeded();
	const before = await page.evaluate(() => window.scrollY);
	expect(before).toBeGreaterThan(500);

	await firstCard.click();
	await expect(page).toHaveURL(/\/projects\//);
	await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(50);

	await page.goBack();
	await expect(page).toHaveURL(/\/$/);
	await expect
		.poll(() => page.evaluate(() => window.scrollY), { timeout: 5_000 })
		.toBeGreaterThan(before - 80);
	expect(await page.evaluate(() => window.scrollY)).toBeLessThan(before + 80);
});

test('previous/next links re-render the project page for the new slug', async ({ page }) => {
	await page.goto('/projects/quickflip');
	await waitForPreloader(page);

	await page.getByRole('link', { name: /next/i }).click();
	await expect(page).toHaveURL(/\/projects\/unberry$/);
	await expect(page).toHaveTitle(/Unberry ATS/);
	await expect(page.locator('h1')).toHaveText('Unberry ATS', { timeout: 5_000 });

	await page.getByRole('link', { name: /next/i }).click();
	await expect(page).toHaveURL(/\/projects\/kotak-connect$/);
	await expect(page.locator('h1')).toHaveText('Kotak Connect', { timeout: 5_000 });

	await page.getByRole('link', { name: /previous/i }).click();
	await expect(page).toHaveURL(/\/projects\/unberry$/);
	await expect(page.locator('h1')).toHaveText('Unberry ATS', { timeout: 5_000 });
});
