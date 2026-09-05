/**
 * Pointer → world-space maths for the particle field's mouse repulsion. The GLSL in
 * shaders/particles.vert mirrors cursorWorldAtDepth/repulsion exactly; pointer.test.ts
 * checks both sides stay in step.
 */

/** Field of view of the hero camera, degrees. */
export const HERO_FOV_DEG = 70;

export function tanHalfFov(fovDeg: number): number {
	return Math.tan((fovDeg * Math.PI) / 360);
}

/** Client pixel coordinates → normalised device coordinates (-1..1, y up). */
export function ndcFromClient(
	x: number,
	y: number,
	width: number,
	height: number
): [number, number] {
	return [(x / width) * 2 - 1, -(y / height) * 2 + 1];
}

/**
 * World xy of the point on the cursor's view ray that lies `depth` units in front of a
 * camera looking straight down -Z. Repelling from this point makes the hole follow the
 * cursor at every depth of the cloud.
 */
export function cursorWorldAtDepth(
	ndc: readonly [number, number],
	depth: number,
	tanHalf: number,
	aspect: number
): [number, number] {
	return [ndc[0] * tanHalf * aspect * depth, ndc[1] * tanHalf * depth];
}

function smoothstep(edge0: number, edge1: number, x: number): number {
	const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
	return t * t * (3 - 2 * t);
}

/** Displacement magnitude for a particle `dist` world units from the cursor point. */
export function repulsion(dist: number, radius: number, strength: number): number {
	return smoothstep(radius, 0, dist) * strength;
}
