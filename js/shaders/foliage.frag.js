export default `#version 300 es
precision highp float;

in vec3 vNormal;
in vec3 vWorldPosition;
in vec2 vTexCoord;

uniform sampler2D uTexture;
uniform vec3 uLightDirection;
uniform vec3 uLightColor;
uniform float uLightIntensity;
uniform vec3 uAmbientColor;
uniform vec3 uTint;

out vec4 outColor;

void main() {
    vec4 tex = texture(uTexture, vTexCoord);
    if (tex.a < 0.25) discard;

    vec3 N = normalize(vNormal);
    vec3 L = normalize(-uLightDirection);
    float difusa = max(dot(N, L), 0.15);
    vec3 base = tex.rgb * uTint;
    vec3 color = uAmbientColor * base + base * uLightColor * uLightIntensity * difusa;
    outColor = vec4(color, tex.a);
}
`;
