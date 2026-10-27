export default `#version 300 es
in vec3 aPosition;
in vec3 aNormal;
in vec2 aTexCoord;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform float uTime;
uniform vec4 uWave0;
uniform vec4 uWave1;
uniform vec4 uWave2;

out vec3 vNormal;
out vec3 vWorldPosition;
out vec2 vTexCoord;

vec3 waveOffset(vec3 pos, vec4 wave) {
    vec2 dir = normalize(wave.xy);
    float amp = wave.z;
    float len = max(wave.w, 0.001);
    float k = 6.2831853 / len;
    float speed = sqrt(9.8 / k);
    float f = k * (dot(dir, pos.xz) - speed * uTime);
    float dy = amp * sin(f);
    float d = amp * k * cos(f);
    return vec3(-dir.x * d, dy, -dir.y * d);
}

void main() {
    vec3 p = aPosition;
    vec3 d0 = waveOffset(p, uWave0);
    vec3 d1 = waveOffset(p, uWave1);
    vec3 d2 = waveOffset(p, uWave2);
    vec3 displaced = p + vec3(d0.x + d1.x + d2.x, d0.y + d1.y + d2.y, d0.z + d1.z + d2.z);
    vec3 N = normalize(vec3(-(d0.x + d1.x + d2.x), 1.0, -(d0.z + d1.z + d2.z)));

    vec4 worldPosition = uModelMatrix * vec4(displaced, 1.0);
    gl_Position = uProjectionMatrix * uViewMatrix * worldPosition;
    vWorldPosition = worldPosition.xyz;
    vNormal = normalize(mat3(uModelMatrix) * N);
    vTexCoord = aTexCoord;
}
`;
