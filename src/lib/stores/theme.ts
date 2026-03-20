import { writable } from 'svelte/store';

export const timeAccent = writable<'dawn' | 'day' | 'dusk' | 'night'>('day');

function hslToHex(h: number, s: number, l: number): string {
	l /= 100;
	const a = (s * Math.min(l, 1 - l)) / 100;
	const f = (n: number) => {
		const k = (n + h / 30) % 12;
		const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
		return Math.round(255 * color)
			.toString(16)
			.padStart(2, '0');
	};
	return `#${f(0)}${f(8)}${f(4)}`;
}

export function updateTimeAccent() {
	const hour = new Date().getHours();

	let shift: number;
	let period: 'dawn' | 'day' | 'dusk' | 'night';

	if (hour >= 5 && hour < 8) {
		shift = 20;
		period = 'dawn';
	} else if (hour >= 8 && hour < 17) {
		shift = 0;
		period = 'day';
	} else if (hour >= 17 && hour < 20) {
		shift = 15;
		period = 'dusk';
	} else {
		shift = -15;
		period = 'night';
	}

	timeAccent.set(period);

	// Base violet: HSL(263, 90%, 66%)
	// Base cyan: HSL(187, 96%, 42%)
	const violet = hslToHex(263 + shift, 90, 66);
	const cyan = hslToHex(187 + shift, 96, 42);

	document.documentElement.style.setProperty('--color-accent-violet', violet);
	document.documentElement.style.setProperty('--color-accent-cyan', cyan);
}
