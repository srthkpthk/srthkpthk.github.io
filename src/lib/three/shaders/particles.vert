uniform float uTime;
uniform float uMorph;
uniform float uPixelRatio;
uniform vec2 uMouse;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform float uUseVertexColors;
uniform float uVelocity;
uniform float uDarkMode;

attribute vec3 positionTarget;
attribute vec3 aColor;
attribute float aRandom;

varying vec3 vColor;
varying float vAlpha;
varying float vDepth;

void main() {
    vec3 pos = mix(position, positionTarget, uMorph);

    // Scroll velocity distortion — subtle stretch along Y, scatter Z
    pos.y += uVelocity * pos.y * 0.04;
    pos.z += uVelocity * sin(aRandom * 6.28) * 0.08;

    // Mouse repulsion
    vec2 mouseOffset = pos.xy - uMouse;
    float mouseDist = length(mouseOffset);
    float repulsion = smoothstep(1.5, 0.0, mouseDist) * 0.4;
    pos.xy += normalize(mouseOffset + 0.001) * repulsion;

    // Floating motion
    pos.x += sin(uTime * 0.3 + aRandom * 6.28) * 0.05;
    pos.y += cos(uTime * 0.2 + aRandom * 6.28) * 0.05;
    pos.z += sin(uTime * 0.4 + aRandom * 3.14) * 0.03;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // Pass depth for dual-layer rendering
    vDepth = mvPosition.z;

    // Size attenuation
    float size = (6.0 + aRandom * 4.0) * uPixelRatio;
    gl_PointSize = size * (1.0 / -mvPosition.z);

    // Color: blend between gradient mode and per-vertex color mode
    float colorMix = (pos.y + 2.0) / 4.0;
    vec3 gradientColor = mix(uColorA, uColorB, clamp(colorMix, 0.0, 1.0));
    vColor = mix(gradientColor, aColor, uUseVertexColors);

    // Adjust alpha based on dark/light mode
    vAlpha = mix(0.85, 0.6, uDarkMode) + aRandom * 0.3;
}
