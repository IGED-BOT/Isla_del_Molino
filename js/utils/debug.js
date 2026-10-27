import { Line } from '../scene/Line.js';
import { Material, ProgramManager } from '../scene/materials/Material.js';
import { Geometry } from '../core/Geometry.js';
import lineVert from '../shaders/line.vert.js';
import lineFrag from '../shaders/line.frag.js';

export class LineMaterial extends Material {
  constructor(color = [1, 0.3, 0.2]) {
    super({ renderOrder: 50, depthWrite: false });
    this.color = color;
  }

  bind(frame, local) {
    this.program = ProgramManager.getProgram(frame.gl, 'line', lineVert, lineFrag);
    this.bindCommon(frame, local);
    this.program.setVec3('uColor', this.color);
  }
}

export class AxisHelper extends Line {
  constructor(size = 2) {
    const geo = new Geometry({
      positions: new Float32Array([
        0, 0, 0, size, 0, 0,
        0, 0, 0, 0, size, 0,
        0, 0, 0, 0, 0, size,
      ]),
      normals: new Float32Array(18),
      uvs: new Float32Array(12),
    });
    super(geo, new LineMaterial([1, 0.3, 0.2]));
    this.name = 'AxisHelper';
    this.size = size;
  }

  ensureGPU(gl) {
    super.ensureGPU(gl);
    this.drawMode = gl.LINES;
  }
}

export class DebugHelper {
  static createAxisHelper(size = 2) {
    return new AxisHelper(size);
  }

  static createWireframeOverlay(mesh) {
    return null;
  }
}
