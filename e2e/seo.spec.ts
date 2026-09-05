import { expect, test } from '@playwright/test';

const SITE = 'https://srthkpthk.github.io';

test('home HTML is server-rendered with a single title and absolute OG image', async ({ request }) => {
	const html = await (await request.get('/')).text();

	expect(html.match(/<title>/g) ?? []).toHaveLength(1);
	expect(html).toContain('<title>Sarthak Pathak — Software Engineer</title>');
	expect(html).toContain(`<link rel="canonical" href="${SITE}/"`);
	expect(html).toContain(`property="og:image" content="${SITE}/og-image.png"`);
	expect(html).not.toContain('og:image" content="./og-image.png"');
});

test('project pages are prerendered with their own metadata', async ({ request }) => {
	const html = await (await request.get('/projects/quickflip')).text();

	expect(html).toContain('<title>Quickflip');
	expect(html).toContain(`<link rel="canonical" href="${SITE}/projects/quickflip"`);
	expect(html).toContain('property="og:url" content="' + SITE + '/projects/quickflip"');
});

test('heading is readable without JavaScript', async ({ browser }) => {
	const context = await browser.newContext({ javaScriptEnabled: false });
	const page = await context.newPage();
	await page.goto('/');

	const text = await page.locator('h1').evaluate((el) => el.textContent ?? '');
	expect(text.replace(/ /g, ' ').replace(/\s+/g, ' ').trim()).toBe('Sarthak Pathak');

	await context.close();
});

test('robots.txt allows crawling and points at the sitemap', async ({ request }) => {
	const body = await (await request.get('/robots.txt')).text();

	expect(body).toMatch(/^User-agent: \*$/m);
	expect(body).toMatch(/^Disallow:\s*$/m);
	expect(body).toContain(`Sitemap: ${SITE}/sitemap.xml`);
});

test('sitemap lists the home page and every project', async ({ request }) => {
	const xml = await (await request.get('/sitemap.xml')).text();
	const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

	expect(locs).toHaveLength(8);
	expect(locs[0]).toBe(`${SITE}/`);
	expect(locs).toContain(`${SITE}/projects/quickflip`);
});

test('legacy /portfolio deep links redirect to the new project URLs', async ({ request }) => {
	const html = await (await request.get('/portfolio/projects/quickflip/')).text();
	expect(html).toContain('url=/projects/quickflip');
});
