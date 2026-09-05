import { get, writable } from 'svelte/store';
import type Lenis from 'lenis';

/** The live Lenis instance created by the root layout; null before mount and after destroy. */
export const lenis = writable<Lenis | null>(null);

type ScrollTarget = number | string | HTMLElement;
type ScrollOptions = Parameters<Lenis['scrollTo']>[1];

/** Scrolls through Lenis when it is running, otherwise falls back to native scrolling. */
export function smoothScrollTo(target: ScrollTarget, options?: ScrollOptions): void {
	const instance = get(lenis);
	if (instance) {
		instance.scrollTo(target, options);
		return;
	}

	const behavior: ScrollBehavior = options?.immediate ? 'auto' : 'smooth';
	if (typeof target === 'number') {
		window.scrollTo({ top: target, behavior });
		return;
	}
	const el = typeof target === 'string' ? document.querySelector(target) : target;
	el?.scrollIntoView({ behavior });
}

interface NavigationLike {
	type: string;
	to: { url: URL } | null;
}

/**
 * Whether the layout should force the page back to the top after a navigation.
 * SvelteKit already restores the previous position on popstate and scrolls to hash
 * targets itself, and both happen before afterNavigate runs, so resetting in those
 * cases would undo them.
 */
export function shouldResetScroll(nav: NavigationLike): boolean {
	return nav.type !== 'popstate' && !nav.to?.url.hash;
}
