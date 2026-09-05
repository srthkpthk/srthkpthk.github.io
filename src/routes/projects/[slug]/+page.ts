import { error } from '@sveltejs/kit';
import type { EntryGenerator, PageLoad } from './$types';
import { getAllSlugs, getProjectBySlug } from '$lib/data/content';

export const entries: EntryGenerator = () => getAllSlugs().map((slug) => ({ slug }));

export const load: PageLoad = ({ params }) => {
	const project = getProjectBySlug(params.slug);
	if (!project) {
		error(404, 'Project not found');
	}
	return { project };
};
