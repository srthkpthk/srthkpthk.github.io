import { expect, test } from '@playwright/test';
import { waitForPreloader } from './helpers';

test('decorative skill bars are hidden from assistive technology', async ({ page }) => {
	await page.goto('/');
	await waitForPreloader(page);

	const hiddenBars = page.locator('#skills [aria-hidden="true"] .skill-bar-fill');
	await expect(hiddenBars).toHaveCount(8);

	// The visible pills still expose every skill name.
	await expect(page.locator('#skills span', { hasText: 'Java / Spring Boot' }).first()).toBeVisible();
});

test('project cards are plain links without a nested article role', async ({ page }) => {
	await page.goto('/');
	await waitForPreloader(page);

	await expect(page.locator('#projects a [role="article"]')).toHaveCount(0);

	const cards = page.locator('#projects a[href^="/projects/"]');
	await expect(cards).toHaveCount(7);
	await expect(cards.first()).toHaveAccessibleName(/Protean AI Bot/);
});

test('nav links are reachable by keyboard', async ({ page }) => {
	await page.goto('/');
	await waitForPreloader(page);

	await page.keyboard.press('Tab');
	await expect(page.getByRole('link', { name: 'SP.' })).toBeFocused();

	await page.keyboard.press('Tab');
	await expect(page.getByRole('link', { name: 'About', exact: true })).toBeFocused();
});
