import { Geometry } from '../core/Geometry.js';

export class PalmFrondGeometry extends Geometry {
  constructor(width = 0.9, length = 2.4, steps = 6) {
    const positions = [];
    const normals = [];
    const uvs = [];
    const indices = [];

    for (let k = 0; k <= steps; k++) {
      const t = k / steps;
      const z = t * length;
      const y = -0.42 * (t * t) * length;
      const w = Math.sin(t * Math.PI) ** 0.65 * width;

      // Borde izquierdo
      positions.push(-w * 0.5, y - 0.05 * w, z);
      normals.push(0, 1, 0);
      uvs.push(0, t);

      // Nervadura central
      positions.push(0, y, z);
      normals.push(0, 1, 0);
      uvs.push(0.5, t);

      // Borde derecho
      positions.push(w * 0.5, y - 0.05 * w, z);
      normals.push(0, 1, 0);
      uvs.push(1, t);
    }

    for (let k = 0; k < steps; k++) {
      const base = k * 3;
      const l0 = base, c0 = base + 1, r0 = base + 2;
      const l1 = base + 3, c1 = base + 4, r1 = base + 5;
      indices.push(l0, l1, c0);
      indices.push(c0, l1, c1);
      indices.push(c0, c1, r0);
      indices.push(r0, c1, r1);
    }

    super({
      positions: new Float32Array(positions),
      normals: new Float32Array(normals),
      uvs: new Float32Array(uvs),
      indices: new Uint16Array(indices),
    });

    this.frondWidth = width;
    this.frondLength = length;
    this.steps = steps;
  }
}
