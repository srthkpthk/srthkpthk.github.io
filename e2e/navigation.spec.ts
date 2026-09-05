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

	// hover() performs the scroll-into-view and waits for the card's reveal animation to
	// settle; reading the position afterwards and clicking with the raw mouse means no
	// further scrolling can happen between the measurement and the navigation.
	const firstCard = page.locator('#projects a').first();
	await firstCard.hover();
	const before = await page.evaluate(() => window.scrollY);
	expect(before).toBeGreaterThan(500);

	await page.mouse.down();
	await page.mouse.up();
	await expect(page).toHaveURL(/\/projects\//);
	await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(50);

	await page.goBack();
	await expect(page).toHaveURL(/\/$/);
	// Poll the settled position: Lenis may still be easing for a few frames after restore.
	await expect
		.poll(async () => Math.abs((await page.evaluate(() => window.scrollY)) - before), {
			timeout: 5_000
		})
		.toBeLessThan(80);
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

test('SvelteKit owns scroll restoration (ScrollTrigger must not flip it to auto)', async ({
	page
}) => {
	await page.goto('/');
	await waitForPreloader(page);
	expect(await page.evaluate(() => history.scrollRestoration)).toBe('manual');

	await page.locator('#projects a').first().click();
	await expect(page).toHaveURL(/\/projects\//);
	expect(await page.evaluate(() => history.scrollRestoration)).toBe('manual');
});
