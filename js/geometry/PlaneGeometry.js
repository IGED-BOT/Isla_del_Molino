import { Geometry } from '../core/Geometry.js';

export class PlaneGeometry extends Geometry {
  constructor(width = 1, depth = 1, segX = 1, segZ = 1, uvScale = 4) {
    const positions = [];
    const normals = [];
    const uvs = [];
    const indices = [];

    for (let z = 0; z <= segZ; z++) {
      const v = z / segZ;
      const zz = (v - 0.5) * depth;
      for (let x = 0; x <= segX; x++) {
        const u = x / segX;
        const xx = (u - 0.5) * width;
        positions.push(xx, 0, zz);
        normals.push(0, 1, 0);
        uvs.push(u * uvScale, v * uvScale);
      }
    }

    const cols = segX + 1;
    for (let z = 0; z < segZ; z++) {
      for (let x = 0; x < segX; x++) {
        const a = z * cols + x;
        const b = a + cols;
        indices.push(a, b, a + 1);
        indices.push(b, b + 1, a + 1);
      }
    }

    super({
      positions: new Float32Array(positions),
      normals: new Float32Array(normals),
      uvs: new Float32Array(uvs),
      indices: new Uint16Array(indices),
    });

    this.width = width;
    this.depth = depth;
    this.segX = segX;
    this.segZ = segZ;
    this.uvScale = uvScale;
  }
}
