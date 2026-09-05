import { describe, expect, it } from 'vitest';
import { getAllSlugs, getProjectBySlug, projectsContent } from './content';

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
