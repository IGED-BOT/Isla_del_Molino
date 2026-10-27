export default `#version 300 es
in vec3 aPosition;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

out vec3 vDir;

void main() {
    vDir = aPosition;
    mat4 viewNoTrans = uViewMatrix;
    viewNoTrans[3][0] = 0.0;
    viewNoTrans[3][1] = 0.0;
    viewNoTrans[3][2] = 0.0;
    vec4 clip = uProjectionMatrix * viewNoTrans * vec4(aPosition, 1.0);
    gl_Position = clip.xyww;
}
`;
