uniform float uDepthMode;
uniform float uDarkMode;

varying vec3 vColor;
varying float vAlpha;
varying float vDepth;

void main() {
    // Dual-layer depth culling
    // Mode 0 (back layer): render only far particles
    // Mode 1 (front layer): render only near particles
    // Mode -1: render all (no culling)
    if (uDepthMode > -0.5) {
        if (uDepthMode < 0.5 && vDepth > -3.5) discard;
        if (uDepthMode > 0.5 && vDepth <= -3.5) discard;
    }

    // Circular point with soft edge
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;

    float alpha = smoothstep(0.5, 0.1, dist) * vAlpha;

    // Darken colors in light mode for visibility
    vec3 color = mix(vColor * 0.5, vColor, uDarkMode);

    gl_FragColor = vec4(color, alpha);
}
