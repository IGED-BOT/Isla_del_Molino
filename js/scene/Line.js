import { Mesh } from './Mesh.js';

export class Line extends Mesh {
  constructor(geometry, material) {
    super(geometry, material);
  }

  ensureGPU(gl) {
    super.ensureGPU(gl);
    this.drawMode = gl.LINE_LOOP;
  }
}
