import { expect, test } from '@playwright/test';

// vite preview serves index.html for unknown URLs, so load the static fallback directly;
// GitHub Pages serves this same file for any missing path.
test('404 fallback renders the error page with a working home link', async ({ page }) => {
	await page.goto('/404.html');

	await expect(page.locator('h1')).toHaveText('404');
	await expect(page.getByRole('link', { name: /return home/i })).toHaveAttribute('href', '/');
});
