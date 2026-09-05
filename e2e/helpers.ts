import type { Page } from '@playwright/test';

/**
 * Collects browser console errors and uncaught page errors for the lifetime of the page.
 * Returns the live array so tests can assert on it after interactions.
 */
export function collectErrors(page: Page): string[] {
	const errors: string[] = [];
	page.on('console', (msg) => {
		if (msg.type() === 'error') errors.push(`console: ${msg.text()}`);
	});
	page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`));
	return errors;
}

/** Waits for the intro preloader overlay to be removed from the DOM. */
export async function waitForPreloader(page: Page, timeout = 6_000): Promise<void> {
	await page.getByTestId('preloader').waitFor({ state: 'detached', timeout });
}
