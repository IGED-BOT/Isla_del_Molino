export default `#version 300 es
in vec3 aPosition;
in vec3 aNormal;
in vec2 aTexCoord;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform float uTime;
uniform vec3 uWindDirection;
uniform float uWindStrength;

out vec3 vNormal;
out vec3 vWorldPosition;
out vec2 vTexCoord;

void main() {
    float infl = aTexCoord.y;
    vec3 wind = normalize(uWindDirection + vec3(0.0001, 0.0, 0.0));
    float wave = sin(uTime * 2.2 + aPosition.x * 2.0 + aPosition.z * 1.7);
    vec3 pos = aPosition + wind * (wave * 0.35 * uWindStrength * infl);
    pos.y += abs(wave) * 0.04 * infl * uWindStrength;

    vec4 worldPosition = uModelMatrix * vec4(pos, 1.0);
    gl_Position = uProjectionMatrix * uViewMatrix * worldPosition;
    vWorldPosition = worldPosition.xyz;
    vNormal = normalize(mat3(uModelMatrix) * aNormal);
    vTexCoord = aTexCoord;
}
`;
