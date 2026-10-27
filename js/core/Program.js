import { Shader } from './Shader.js';

export class Program {
  constructor(gl, vertexSource, fragmentSource) {
    this.gl = gl;
    const vs = Shader.compile(gl, gl.VERTEX_SHADER, vertexSource);
    const fs = Shader.compile(gl, gl.FRAGMENT_SHADER, fragmentSource);
    const program = gl.createProgram();
    gl.bindAttribLocation(program, 0, 'aPosition');
    gl.bindAttribLocation(program, 1, 'aNormal');
    gl.bindAttribLocation(program, 2, 'aTexCoord');
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(`Error al enlazar programa:\n${gl.getProgramInfoLog(program)}`);
    }

    gl.deleteShader(vs);
    gl.deleteShader(fs);

    this.program = program;
    this._uniforms = new Map();
    this._attribs = new Map();
  }

  use() {
    this.gl.useProgram(this.program);
  }

  attrib(name) {
    if (!this._attribs.has(name)) {
      this._attribs.set(name, this.gl.getAttribLocation(this.program, name));
    }
    return this._attribs.get(name);
  }

  uniform(name) {
    if (!this._uniforms.has(name)) {
      this._uniforms.set(name, this.gl.getUniformLocation(this.program, name));
    }
    return this._uniforms.get(name);
  }
  
  setMat4(name, matrix) {
    this.gl.uniformMatrix4fv(this.uniform(name), false, matrix);
  }

  setMat3(name, matrix) {
    this.gl.uniformMatrix3fv(this.uniform(name), false, matrix);
  }

  setVec3(name, v) {
    this.gl.uniform3fv(this.uniform(name), v);
  }

  setVec2(name, v) {
    this.gl.uniform2fv(this.uniform(name), v);
  }

  setFloat(name, value) {
    this.gl.uniform1f(this.uniform(name), value);
  }

  setInt(name, value) {
    this.gl.uniform1i(this.uniform(name), value);
  }
}
