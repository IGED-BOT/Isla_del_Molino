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
uniform vec3 uCameraPosition;
uniform bool uEmissive;
uniform float uShininess;
uniform float uSpecular;

out vec4 outColor;

void main() {
    vec3 colorTextura = texture(uTexture, vTexCoord).rgb;

    if (uEmissive) {
        outColor = vec4(colorTextura, 1.0);
        return;
    }

    vec3 N = normalize(vNormal);
    vec3 L = normalize(-uLightDirection);
    vec3 V = normalize(uCameraPosition - vWorldPosition);
    vec3 H = normalize(L + V);

    float difusa = max(dot(N, L), 0.0);
    float spec = pow(max(dot(N, H), 0.0), uShininess) * uSpecular * step(0.0, difusa);

    vec3 ambient = uAmbientColor * colorTextura;
    vec3 lit = colorTextura * uLightColor * uLightIntensity * difusa;
    vec3 colorFinal = ambient + lit + uLightColor * spec;
    outColor = vec4(colorFinal, 1.0);
}
`;
