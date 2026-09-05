import { expect, test } from '@playwright/test';
import { waitForPreloader } from './helpers';

test('custom cursor is scoped to pointer devices and grows over hover targets', async ({
	page
}) => {
	await page.goto('/');
	await waitForPreloader(page);

	await expect(page.locator('html')).toHaveClass(/\bhas-custom-cursor\b/);
	const ring = page.getByTestId('cursor-ring');

	await page.mouse.move(5, 5);
	await expect(ring).toHaveCSS('width', '32px');

	await page.getByRole('link', { name: 'LinkedIn' }).hover();
	await expect(ring).toHaveCSS('width', '48px');

	await page.mouse.move(5, 5);
	await expect(ring).toHaveCSS('width', '32px');
});

test('magnetic CTA follows a nearby pointer', async ({ page }) => {
	await page.goto('/');
	await waitForPreloader(page);

	const cta = page.locator('#contact a[href^="mailto:"]');
	await cta.scrollIntoViewIfNeeded();
	const wrapper = cta.locator('..');
	const box = (await cta.boundingBox())!;

	await page.mouse.move(box.x + box.width / 2 + 20, box.y + box.height / 2 + 10);
	await expect
		.poll(() => wrapper.evaluate((el) => el.style.transform))
		.toMatch(/^translate\((?!0px, 0px\))[-\d.]+px, [-\d.]+px\)$/);

	await page.mouse.move(5, 5);
	// Browsers serialise the reset as either "translate(0, 0)" or "translate(0px, 0px)".
	await expect
		.poll(() => wrapper.evaluate((el) => el.style.transform))
		.toMatch(/^translate\(0(px)?, 0(px)?\)$/);
});

test('avatar ships at display size with explicit dimensions', async ({ page }) => {
	await page.goto('/');
	await waitForPreloader(page);

	const img = page.locator('img[alt="Sarthak Pathak"]');
	await expect(img).toHaveAttribute('width', '144');
	await expect(img).toHaveAttribute('height', '144');

	const natural = await img.evaluate((el) => (el as HTMLImageElement).naturalWidth);
	expect(natural).toBeGreaterThan(0);
	expect(natural).toBeLessThanOrEqual(320);
});
