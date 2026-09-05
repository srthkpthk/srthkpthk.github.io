/**
 * Maps particle `i` of `count` onto a source vertex index so that the whole source
 * geometry is covered evenly, whether it has more or fewer vertices than particles.
 *
 * `i % srcCount` (the previous approach) only ever visits the first `count` vertices,
 * so a geometry with more vertices than particles renders as a partial shell.
 */
export function sampleSourceIndex(i: number, count: number, srcCount: number): number {
	if (srcCount <= 0 || count <= 0) return 0;
	return Math.min(srcCount - 1, Math.floor((i * srcCount) / count));
}

/**
 * Icosahedron subdivision level whose non-indexed vertex count (60 * (detail + 1)^2)
 * is closest to `count`, so we do not generate far more geometry than we can show.
 */
export function icosahedronDetailFor(count: number): number {
	return Math.max(0, Math.round(Math.sqrt(count / 60)) - 1);
}

/** Non-indexed vertex count Three.js produces for IcosahedronGeometry at `detail`. */
export function icosahedronVertexCount(detail: number): number {
	return 60 * (detail + 1) ** 2;
}
