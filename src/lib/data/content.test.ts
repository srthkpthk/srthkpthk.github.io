import { describe, expect, it } from 'vitest';
import { SITE_URL, getAllSlugs, getProjectBySlug, projectsContent, siteConfig } from './content';

describe('content helpers', () => {
	it('finds a project by slug', () => {
		expect(getProjectBySlug('quickflip')?.title).toBe('Quickflip');
	});

	it('returns undefined for an unknown slug', () => {
		expect(getProjectBySlug('does-not-exist')).toBeUndefined();
	});

	it('lists every project slug exactly once', () => {
		const slugs = getAllSlugs();
		expect(slugs).toHaveLength(projectsContent.projects.length);
		expect(new Set(slugs).size).toBe(slugs.length);
		expect(slugs).toEqual(projectsContent.projects.map((p) => p.slug));
	});
});

describe('site config', () => {
	it('uses an https site URL without a trailing slash', () => {
		expect(SITE_URL).toMatch(/^https:\/\//);
		expect(SITE_URL.endsWith('/')).toBe(false);
	});

	it('points social links at real profiles, not bare domains', () => {
		expect(siteConfig.social.github).toBe('https://github.com/srthkpthk');
		expect(siteConfig.social.twitter).toBe('https://twitter.com/SrthkPthk');
		for (const url of Object.values(siteConfig.social)) {
			expect(new URL(url).pathname.length, `${url} has no profile path`).toBeGreaterThan(1);
		}
	});

	it('does not carry unused project fields', () => {
		for (const project of projectsContent.projects) {
			expect(project).not.toHaveProperty('image');
		}
	});
});

describe('legacy /portfolio redirects', () => {
	// Keys are repo-root paths like /static/portfolio/projects/<slug>/index.html
	const stubs = import.meta.glob('/static/portfolio/projects/*/index.html', {
		query: '?raw',
		import: 'default',
		eager: true
	}) as Record<string, string>;

	it('ships a redirect stub for every project slug', () => {
		const bySlug = new Map(
			Object.entries(stubs).map(([path, html]) => [path.split('/').at(-2), html])
		);
		for (const slug of getAllSlugs()) {
			const html = bySlug.get(slug);
			expect(html, `missing redirect stub for ${slug}`).toBeDefined();
			expect(html).toContain(`url=/projects/${slug}`);
		}
	});
});
