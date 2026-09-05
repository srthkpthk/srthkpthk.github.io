import { cursorPos } from '$lib/stores/cursor';

/**
 * Pulls the element toward the cursor while it is within `radius` px of the centre.
 * Layout is read at most once per animation frame regardless of pointer event rate.
 */
export function magnetic(node: HTMLElement, params?: { strength?: number; radius?: number }) {
	const { strength = 0.3, radius = 80 } = params ?? {};

	node.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';

	let pointer = { x: 0, y: 0 };
	let rafId = 0;

	const update = () => {
		rafId = 0;
		const rect = node.getBoundingClientRect();
		const dx = pointer.x - (rect.left + rect.width / 2);
		const dy = pointer.y - (rect.top + rect.height / 2);
		const dist = Math.hypot(dx, dy);

		node.style.transform =
			dist < radius ? `translate(${dx * strength}px, ${dy * strength}px)` : 'translate(0, 0)';
	};

	const unsub = cursorPos.subscribe((pos) => {
		pointer = pos;
		if (!rafId) rafId = requestAnimationFrame(update);
	});

	return {
		destroy() {
			unsub();
			if (rafId) cancelAnimationFrame(rafId);
			node.style.transform = '';
			node.style.transition = '';
		}
	};
}
