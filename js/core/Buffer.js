export class Buffer {
  // Buffer de WebGL para almacenar datos de vértices, normales, colores, etc.
  constructor(gl, target = gl.ARRAY_BUFFER) {
    this.gl = gl;
    this.target = target;
    this.buffer = gl.createBuffer();
    this.count = 0;
  }
  //
  setData(data, usage) {
    const gl = this.gl;
    gl.bindBuffer(this.target, this.buffer);
    gl.bufferData(this.target, data, usage ?? gl.STATIC_DRAW);
    this.count = data.length;
  }
  // Vincula el buffer para su uso en la GPU
  bind() {
    this.gl.bindBuffer(this.target, this.buffer);
  }
}
