export default `#version 300 es
precision highp float;
in vec2 vUv;
uniform sampler2D uScene;
uniform float uVignette;
out vec4 outColor;
void main() {
    vec3 color = texture(uScene, vUv).rgb;
    float d = distance(vUv, vec2(0.5));
    float vig = smoothstep(0.9, 0.3, d);
    color *= mix(1.0, vig, uVignette);
    outColor = vec4(color, 1.0);
}
`;
