import { ScrollTrigger } from '$lib/actions/gsap';
import { SECTION_IDS, pickActiveSection, type SectionId } from '$lib/data/sections';
import { activeSection } from '$lib/stores/scroll';

/**
 * Tracks which home-page section is in view and writes it to the `activeSection` store.
 *
 * Call this from the home route's onMount: the root layout persists across client-side
 * navigations but the sections do not, so triggers owned by the layout would keep
 * pointing at detached elements after a trip to a project page and back.
 */
export function trackSections(ids: readonly SectionId[] = SECTION_IDS): () => void {
	const sections = ids.flatMap((id) => {
		const el = document.getElementById(id);
		return el ? [{ id, el }] : [];
	});

	// Seed synchronously so deep links such as /#projects are correct before any scroll event.
	const tops = sections.map(({ el }) => el.getBoundingClientRect().top);
	const initial = sections[pickActiveSection(tops, window.innerHeight / 2)];
	if (initial) activeSection.set(initial.id);

	const triggers = sections.map(({ id, el }) => {
		const enter = () => activeSection.set(id);
		return ScrollTrigger.create({
			trigger: el,
			start: 'top center',
			onEnter: enter,
			onEnterBack: enter
		});
	});

	return () => {
		triggers.forEach((trigger) => trigger.kill());
	};
}
