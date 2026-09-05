import { describe, expect, it } from 'vitest';
import { SECTION_IDS, SECTION_TINT, pickActiveSection } from './sections';

describe('pickActiveSection', () => {
	it('defaults to the first section when nothing has reached the threshold', () => {
		expect(pickActiveSection([100, 900, 1800], 50)).toBe(0);
		expect(pickActiveSection([], 400)).toBe(0);
	});

	it('picks the last section whose top is at or above the threshold', () => {
		expect(pickActiveSection([-800, -100, 700, 1500], 400)).toBe(1);
		expect(pickActiveSection([-800, -100, 400, 1500], 400)).toBe(2);
	});

	it('picks the final section when everything is above the threshold', () => {
		expect(pickActiveSection([-3000, -2000, -1000, -10], 400)).toBe(3);
	});
});

describe('SECTION_TINT', () => {
	it('defines a colour for every section in both themes', () => {
		for (const theme of ['dark', 'light'] as const) {
			for (const id of SECTION_IDS) {
				expect(SECTION_TINT[theme][id]).toMatch(/^rgba\(/);
			}
		}
	});
});
