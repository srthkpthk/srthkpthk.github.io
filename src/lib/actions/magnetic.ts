import { cursorPos } from '$lib/stores/cursor';

export function magnetic(node: HTMLElement, params?: { strength?: number; radius?: number }) {
	const { strength = 0.3, radius = 80 } = params ?? {};

	node.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';

	const unsub = cursorPos.subscribe(({ x, y }) => {
		const rect = node.getBoundingClientRect();
		const cx = rect.left + rect.width / 2;
		const cy = rect.top + rect.height / 2;

		const dx = x - cx;
		const dy = y - cy;
		const dist = Math.sqrt(dx * dx + dy * dy);

		if (dist < radius) {
			node.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
		} else {
			node.style.transform = 'translate(0, 0)';
		}
	});

	return {
		destroy() {
			unsub();
			node.style.transform = '';
			node.style.transition = '';
		}
	};
}
