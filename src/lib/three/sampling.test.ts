import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { icosahedronDetailFor, icosahedronVertexCount, sampleSourceIndex } from './sampling';

describe('sampleSourceIndex', () => {
	it('spreads particles across the whole geometry when it has more vertices than particles', () => {
		const count = 1000;
		const srcCount = 5000;
		const picked = Array.from({ length: count }, (_, i) => sampleSourceIndex(i, count, srcCount));

		expect(picked[0]).toBe(0);
		expect(picked.at(-1)).toBe(srcCount - 5); // last particle lands in the final stride
		expect(new Set(picked).size).toBe(count); // no duplicates when source is larger
		for (let i = 1; i < picked.length; i++) expect(picked[i]).toBeGreaterThan(picked[i - 1]);
	});

	it('reuses every vertex evenly when there are more particles than vertices', () => {
		const count = 900;
		const srcCount = 300;
		const hits = new Array(srcCount).fill(0);
		for (let i = 0; i < count; i++) hits[sampleSourceIndex(i, count, srcCount)]++;

		expect(hits.every((h) => h === 3)).toBe(true);
	});

	it('never exceeds the source range', () => {
		expect(sampleSourceIndex(34999, 35000, 188160)).toBeLessThan(188160);
		expect(sampleSourceIndex(0, 1, 1)).toBe(0);
		expect(sampleSourceIndex(5, 10, 0)).toBe(0);
	});
});

describe('icosahedron sizing', () => {
	it('matches the vertex count Three.js actually generates', () => {
		for (const detail of [0, 3, 12, 23]) {
			const geometry = new THREE.IcosahedronGeometry(1.8, detail);
			expect(geometry.attributes.position.count).toBe(icosahedronVertexCount(detail));
		}
	});

	it('picks a detail level whose vertex count is close to the particle budget', () => {
		for (const count of [10000, 35000]) {
			const detail = icosahedronDetailFor(count);
			const vertices = icosahedronVertexCount(detail);
			expect(vertices).toBeGreaterThan(count * 0.8);
			expect(vertices).toBeLessThan(count * 1.2);
		}
	});

	it('documents the old formula overshooting the budget by 5x', () => {
		const count = 35000;
		const oldDetail = Math.ceil(Math.sqrt(count / 12));
		expect(icosahedronVertexCount(oldDetail)).toBeGreaterThan(count * 5);
	});
});
