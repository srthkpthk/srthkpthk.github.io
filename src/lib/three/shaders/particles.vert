uniform float uTime;
uniform float uMorph;
uniform float uPixelRatio;
uniform vec2 uMouseNdc;
uniform float uMouseActive;
uniform float uMouseRadius;
uniform float uMouseStrength;
uniform float uTanHalfFov;
uniform float uAspect;
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

    // Floating motion (local space)
    pos.x += sin(uTime * 0.3 + aRandom * 6.28) * 0.05;
    pos.y += cos(uTime * 0.2 + aRandom * 6.28) * 0.05;
    pos.z += sin(uTime * 0.4 + aRandom * 3.14) * 0.03;

    // Colour follows local-space height
    float colorMix = (pos.y + 2.0) / 4.0;

    vec4 worldPos = modelMatrix * vec4(pos, 1.0);

    // Mouse repulsion in world space. The camera looks straight down -Z, so the point
    // where the cursor's view ray passes this particle's depth is the NDC scaled by the
    // frustum half-extents at that depth. Pushing away from it in the view plane keeps
    // the hole under the cursor regardless of the cloud's rotation or the camera zoom.
    // (Mirrored by src/lib/three/pointer.ts.)
    float depth = cameraPosition.z - worldPos.z;
    vec2 cursorWorld = uMouseNdc * vec2(uTanHalfFov * uAspect, uTanHalfFov) * depth;
    vec2 offset = worldPos.xy - cursorWorld;
    float dist = length(offset);
    float repulsion = smoothstep(uMouseRadius, 0.0, dist) * uMouseStrength * uMouseActive;
    worldPos.xy += normalize(offset + vec2(0.0001)) * repulsion;

    vec4 mvPosition = viewMatrix * worldPos;
    gl_Position = projectionMatrix * mvPosition;

    // Pass depth for dual-layer rendering
    vDepth = mvPosition.z;

    // Size attenuation
    float size = (6.0 + aRandom * 4.0) * uPixelRatio;
    gl_PointSize = size * (1.0 / -mvPosition.z);

    // Color: blend between gradient mode and per-vertex color mode
    vec3 gradientColor = mix(uColorA, uColorB, clamp(colorMix, 0.0, 1.0));
    vColor = mix(gradientColor, aColor, uUseVertexColors);

    // Adjust alpha based on dark/light mode
    vAlpha = mix(0.85, 0.6, uDarkMode) + aRandom * 0.3;
}
