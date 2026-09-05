/** Home-page sections, in document order. Single source of truth for scroll tracking. */
export const SECTION_IDS = ['hero', 'about', 'skills', 'projects', 'contact'] as const;
export type SectionId = (typeof SECTION_IDS)[number];

/** Background tint per section for each resolved theme. */
export const SECTION_TINT: Record<'dark' | 'light', Record<SectionId, string>> = {
	dark: {
		hero: 'rgba(139, 92, 246, 0.04)',
		about: 'rgba(6, 182, 212, 0.04)',
		skills: 'rgba(236, 72, 153, 0.04)',
		projects: 'rgba(245, 158, 11, 0.04)',
		contact: 'rgba(20, 184, 166, 0.04)'
	},
	light: {
		hero: 'rgba(124, 58, 237, 0.03)',
		about: 'rgba(8, 145, 178, 0.03)',
		skills: 'rgba(219, 39, 119, 0.03)',
		projects: 'rgba(217, 119, 6, 0.03)',
		contact: 'rgba(13, 148, 136, 0.03)'
	}
};

/**
 * Index of the last section whose top edge is at or above `threshold` (viewport px),
 * or 0 when every section is still below it.
 */
export function pickActiveSection(tops: readonly number[], threshold: number): number {
	let active = 0;
	tops.forEach((top, index) => {
		if (top <= threshold) active = index;
	});
	return active;
}
