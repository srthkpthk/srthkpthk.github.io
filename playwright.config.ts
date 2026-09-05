import { defineConfig, devices } from '@playwright/test';

const PORT = 4173;
const isCI = !!process.env.CI;

export default defineConfig({
	testDir: 'e2e',
	fullyParallel: true,
	forbidOnly: isCI,
	retries: isCI ? 1 : 0,
	reporter: isCI ? [['list'], ['html', { open: 'never' }]] : 'list',
	use: {
		baseURL: `http://localhost:${PORT}`,
		// Headless Chromium renders WebGL through SwiftShader; reduced motion makes the
		// hero scene fall back to CSS so navigation/scroll tests stay fast and deterministic.
		reducedMotion: 'reduce',
		trace: 'retain-on-failure'
	},
	projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
	webServer: {
		command: isCI
			? `npm run preview -- --port ${PORT} --strictPort`
			: `npm run build && npm run preview -- --port ${PORT} --strictPort`,
		url: `http://localhost:${PORT}/`,
		timeout: 180_000,
		reuseExistingServer: !isCI
	}
});
