import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { HERO_FOV_DEG, cursorWorldAtDepth, ndcFromClient, repulsion, tanHalfFov } from './pointer';

describe('ndcFromClient', () => {
	it('maps the viewport corners and centre', () => {
		expect(ndcFromClient(0, 0, 1000, 500)).toEqual([-1, 1]);
		expect(ndcFromClient(1000, 500, 1000, 500)).toEqual([1, -1]);
		expect(ndcFromClient(500, 250, 1000, 500)).toEqual([0, 0]);
	});
});

describe('cursorWorldAtDepth', () => {
	const tanHalf = tanHalfFov(HERO_FOV_DEG);
	const aspect = 16 / 9;

	it('keeps the centre of the screen on the optical axis', () => {
		expect(cursorWorldAtDepth([0, 0], 4, tanHalf, aspect)).toEqual([0, 0]);
	});

	it('reaches the visible edge of the frustum at the given depth', () => {
		// Camera at z=4 looking at z=0: half-height = tan(35°) * 4 ≈ 2.80, half-width ≈ 4.98.
		const [x, y] = cursorWorldAtDepth([1, 1], 4, tanHalf, aspect);
		expect(x).toBeCloseTo(4.979, 2);
		expect(y).toBeCloseTo(2.801, 2);
	});

	it('scales with depth so the hole tracks the cursor through the cloud', () => {
		const near = cursorWorldAtDepth([0.5, 0.5], 2.2, tanHalf, aspect);
		const far = cursorWorldAtDepth([0.5, 0.5], 5.8, tanHalf, aspect);
		expect(far[0] / near[0]).toBeCloseTo(5.8 / 2.2, 6);
	});
});

describe('repulsion', () => {
	it('is strongest at the cursor and fades to zero at the radius', () => {
		expect(repulsion(0, 1, 0.5)).toBe(0.5);
		expect(repulsion(1, 1, 0.5)).toBe(0);
		expect(repulsion(2, 1, 0.5)).toBe(0);
		expect(repulsion(0.5, 1, 0.5)).toBeCloseTo(0.25, 6);
	});

	it('decreases monotonically with distance', () => {
		let prev = Infinity;
		for (let d = 0; d <= 1; d += 0.05) {
			const r = repulsion(d, 1, 0.5);
			expect(r).toBeLessThanOrEqual(prev);
			prev = r;
		}
	});
});

describe('particles.vert', () => {
	const shader = readFileSync(new URL('./shaders/particles.vert', import.meta.url), 'utf8');

	it('repels in world space from the cursor ray, not in rotating local space', () => {
		expect(shader).toContain('vec4 worldPos = modelMatrix * vec4(pos, 1.0);');
		expect(shader).toContain('float depth = cameraPosition.z - worldPos.z;');
		expect(shader).toContain(
			'vec2 cursorWorld = uMouseNdc * vec2(uTanHalfFov * uAspect, uTanHalfFov) * depth;'
		);
		expect(shader).toContain('smoothstep(uMouseRadius, 0.0, dist) * uMouseStrength * uMouseActive');
		expect(shader).toContain('vec4 mvPosition = viewMatrix * worldPos;');
		expect(shader).not.toMatch(/uniform vec2 uMouse;/);
	});
});
