export const SCRAMBLE_CHARS =
	'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*';

export interface ScrambleOptions {
	/** Milliseconds between the start of each character's scramble. */
	startDelay?: number;
	/** Milliseconds each character keeps scrambling before it settles. */
	duration?: number;
	/** Milliseconds between random character swaps. */
	interval?: number;
	/** Character pool to draw from. */
	chars?: string;
	/** Random source in [0, 1); injectable for deterministic tests. */
	rng?: () => number;
}

export function randomChar(
	chars: string = SCRAMBLE_CHARS,
	rng: () => number = Math.random
): string {
	return chars[Math.floor(rng() * chars.length)];
}

/**
 * Scrambles `target` character by character and calls `onFrame` with a fresh copy of the
 * display characters every time they change, starting with a fully scrambled frame.
 * Spaces are preserved. Returns a function that cancels all pending timers.
 */
export function scramble(
	target: readonly string[],
	onFrame: (chars: string[]) => void,
	options: ScrambleOptions = {}
): () => void {
	const {
		startDelay = 30,
		duration = 500,
		interval = 30,
		chars = SCRAMBLE_CHARS,
		rng = Math.random
	} = options;

	const display = target.map((c) => (c === ' ' ? ' ' : randomChar(chars, rng)));
	const timers = new Set<ReturnType<typeof setTimeout>>();
	const emit = () => onFrame([...display]);

	emit();

	target.forEach((targetChar, i) => {
		if (targetChar === ' ') return;

		const start = setTimeout(() => {
			timers.delete(start);
			let elapsed = 0;
			const ticker = setInterval(() => {
				elapsed += interval;
				if (elapsed >= duration) {
					display[i] = targetChar;
					clearInterval(ticker);
					timers.delete(ticker);
				} else {
					display[i] = randomChar(chars, rng);
				}
				emit();
			}, interval);
			timers.add(ticker);
		}, i * startDelay);
		timers.add(start);
	});

	return () => {
		timers.forEach((timer) => {
			clearTimeout(timer);
			clearInterval(timer);
		});
		timers.clear();
	};
}
