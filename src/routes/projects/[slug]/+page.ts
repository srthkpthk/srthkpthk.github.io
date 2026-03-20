import { error } from '@sveltejs/kit';
import { getProjectBySlug, getAllSlugs } from '$lib/data/content';

export function entries() {
	return getAllSlugs().map((slug) => ({ slug }));
}

export function load({ params }: { params: { slug: string } }) {
	const project = getProjectBySlug(params.slug);
	if (!project) {
		throw error(404, 'Project not found');
	}
	return { project };
}
