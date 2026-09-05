import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SCRAMBLE_CHARS, randomChar, scramble } from './scramble';

describe('scramble', () => {
	beforeEach(() => vi.useFakeTimers());
	afterEach(() => vi.useRealTimers());

	const target = 'XY Z'.split('');

	it('starts fully scrambled, keeps the length, and preserves spaces', () => {
		const frames: string[][] = [];
		scramble(target, (f) => frames.push(f), { rng: () => 0 });

		expect(frames[0]).toEqual(['A', 'A', ' ', 'A']);

		vi.advanceTimersByTime(1_000);
		for (const frame of frames) {
			expect(frame).toHaveLength(target.length);
			expect(frame[2]).toBe(' ');
		}
	});

	it('settles on the target text after every character finishes', () => {
		const frames: string[][] = [];
		scramble(target, (f) => frames.push(f), { rng: () => 0, startDelay: 30, duration: 500, interval: 30 });

		// Last character starts at 3 * 30ms and settles after ceil(500 / 30) ticks.
		vi.advanceTimersByTime(90 + 510);
		expect(frames.at(-1)).toEqual(target);

		// Before that the last character was still scrambling.
		const midway = frames[Math.floor(frames.length / 2)];
		expect(midway).not.toEqual(target);
	});

	it('emits a fresh array per frame so reactive consumers see a change', () => {
		const frames: string[][] = [];
		scramble(target, (f) => frames.push(f), { rng: () => 0 });
		vi.advanceTimersByTime(60);

		expect(frames.length).toBeGreaterThan(1);
		expect(frames[0]).not.toBe(frames[1]);
	});

	it('stops emitting once cancelled', () => {
		const frames: string[][] = [];
		const cancel = scramble(target, (f) => frames.push(f), { rng: () => 0 });

		vi.advanceTimersByTime(45);
		const emitted = frames.length;
		cancel();
		vi.advanceTimersByTime(2_000);

		expect(frames).toHaveLength(emitted);
		expect(vi.getTimerCount()).toBe(0);
	});

	it('is deterministic for a given rng', () => {
		const run = () => {
			const frames: string[][] = [];
			let seed = 1;
			const rng = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
			const cancel = scramble(target, (f) => frames.push(f), { rng });
			vi.advanceTimersByTime(300);
			cancel();
			return frames;
		};
		expect(run()).toEqual(run());
	});
});

describe('randomChar', () => {
	it('maps the rng across the whole pool', () => {
		expect(randomChar(SCRAMBLE_CHARS, () => 0)).toBe(SCRAMBLE_CHARS[0]);
		expect(randomChar(SCRAMBLE_CHARS, () => 0.999999)).toBe(SCRAMBLE_CHARS.at(-1));
		expect(randomChar('ab', () => 0.5)).toBe('b');
	});
});
