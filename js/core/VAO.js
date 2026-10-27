export class VAO {
  constructor(gl) {
    // Objeto de WebGL para almacenar el estado de los atributos de vértices y buffers
    this.gl = gl;
    this.vao = gl.createVertexArray();
  }

  bind() {
    this.gl.bindVertexArray(this.vao);
  }

  unbind() {
    this.gl.bindVertexArray(null);
  }

  attrib(location, size, type, stride, offset, normalized = false) {
    const gl = this.gl;
    if (location < 0) return;
    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(location, size, type, normalized, stride, offset);
  }
}
