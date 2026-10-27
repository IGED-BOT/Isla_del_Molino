export class Shader {
  // Clase para compilar y manejar shaders de WebGL
  static compile(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const error = gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      throw new Error(`Error al compilar shader:\n${error}`);
    }
    return shader;
  }
}
