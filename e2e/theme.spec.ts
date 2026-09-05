import { expect, test } from '@playwright/test';
import { accentHex } from '../src/lib/stores/theme';
import { waitForPreloader } from './helpers';

test('accent colours come from CSS overrides and follow theme + period', async ({ page }) => {
	await page.goto('/');
	await waitForPreloader(page);

	const root = page.locator('html');
	const inline = await root.evaluate((el) => el.style.getPropertyValue('--color-accent-violet'));
	expect(inline, 'accent must not be set as an inline style').toBe('');

	await expect(root).toHaveAttribute('data-period', /^(dawn|day|dusk|night)$/);

	const readAccent = () =>
		root.evaluate((el) =>
			getComputedStyle(el).getPropertyValue('--color-accent-violet').trim().toLowerCase()
		);

	await root.evaluate((el) => {
		el.dataset.period = 'dawn';
		el.classList.add('light');
	});
	expect(await readAccent()).toBe(accentHex('light', 'dawn').violet);

	await root.evaluate((el) => el.classList.remove('light'));
	expect(await readAccent()).toBe(accentHex('dark', 'dawn').violet);

	await root.evaluate((el) => {
		el.dataset.period = 'day';
		el.classList.add('light');
	});
	expect(await readAccent()).toBe('#7c3aed');
});

test('theme toggle announces the current and next mode', async ({ page }) => {
	await page.goto('/');
	await waitForPreloader(page);

	const toggle = page.getByRole('button', { name: /^Theme: / }).first();
	await expect(toggle).toHaveAttribute('aria-label', 'Theme: Auto Theme. Switch to Light Mode');
	await toggle.click();
	await expect(toggle).toHaveAttribute('aria-label', 'Theme: Light Mode. Switch to Dark Mode');
	await expect(page.locator('html')).toHaveClass(/\blight\b/);
});

test.describe('mobile menu', () => {
	test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

	test('exposes state, closes on Escape and restores focus', async ({ page }) => {
		await page.goto('/');
		await waitForPreloader(page);

		const toggle = page.getByRole('button', { name: /toggle menu/i });
		await expect(toggle).toHaveAttribute('aria-expanded', 'false');
		await expect(toggle).toHaveAttribute('aria-controls', 'mobile-menu');

		await toggle.click();
		await expect(toggle).toHaveAttribute('aria-expanded', 'true');
		const menu = page.locator('#mobile-menu');
		await expect(menu).toBeVisible();
		await expect(menu.locator('a').first()).toBeFocused();
		await expect(page.locator('html')).toHaveClass(/lenis-stopped/);

		await page.keyboard.press('Escape');
		await expect(menu).toBeHidden();
		await expect(toggle).toHaveAttribute('aria-expanded', 'false');
		await expect(toggle).toBeFocused();
		await expect(page.locator('html')).not.toHaveClass(/lenis-stopped/);
	});
});
