import { Object3D } from './Object3D.js';
import { Buffer } from '../core/Buffer.js';
import { VAO } from '../core/VAO.js';

export class Mesh extends Object3D {
  constructor(geometry, material) {
    super();
    this.geometry = geometry;
    this.material = material;
    this.vao = null;
    this.indexCount = geometry.indices ? geometry.indices.length : 0;
    this.vertexCount = geometry.positions.length / 3;
    this.drawMode = null;
  }

  ensureGPU(gl) {
    if (this.vao) return;
    const geo = this.geometry;
    const vao = new VAO(gl);
    vao.bind();

    const pos = new Buffer(gl, gl.ARRAY_BUFFER);
    pos.setData(geo.positions);
    vao.attrib(0, 3, gl.FLOAT, 0, 0);

    if (geo.normals) {
      const nrm = new Buffer(gl, gl.ARRAY_BUFFER);
      nrm.setData(geo.normals);
      vao.attrib(1, 3, gl.FLOAT, 0, 0);
    }

    if (geo.uvs) {
      const uv = new Buffer(gl, gl.ARRAY_BUFFER);
      uv.setData(geo.uvs);
      vao.attrib(2, 2, gl.FLOAT, 0, 0);
    }

    if (geo.indices) {
      const ebo = new Buffer(gl, gl.ELEMENT_ARRAY_BUFFER);
      ebo.setData(geo.indices);
    }

    vao.unbind();
    this.vao = vao;
  }
}
