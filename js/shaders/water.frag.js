export default `#version 300 es
precision highp float;

in vec3 vNormal;
in vec3 vWorldPosition;
in vec2 vTexCoord;

uniform vec3 uDeepColor;
uniform vec3 uShallowColor;
uniform vec3 uLightDirection;
uniform vec3 uLightColor;
uniform float uLightIntensity;
uniform vec3 uAmbientColor;
uniform vec3 uCameraPosition;
uniform float uTime;

out vec4 outColor;

void main() {
    vec3 N = normalize(vNormal);
    vec3 L = normalize(-uLightDirection);
    vec3 V = normalize(uCameraPosition - vWorldPosition);
    vec3 H = normalize(L + V);

    float fresnel = pow(1.0 - max(dot(N, V), 0.0), 3.0);
    vec3 base = mix(uDeepColor, uShallowColor, fresnel);
    float sparkle = sin(vWorldPosition.x * 3.1 + uTime * 1.7) * sin(vWorldPosition.z * 2.7 + uTime);
    base += vec3(0.04) * sparkle;

    float difusa = max(dot(N, L), 0.0);
    float spec = pow(max(dot(N, H), 0.0), 64.0) * 0.65 * step(0.0, difusa);

    vec3 color = uAmbientColor * base + base * uLightColor * uLightIntensity * difusa + uLightColor * spec;
    outColor = vec4(color, 0.92);
}
`;
