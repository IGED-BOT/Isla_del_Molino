import { Geometry } from '../core/Geometry.js';

export class SphereGeometry extends Geometry {
  constructor(radius = 1, lat = 24, lon = 32) {
    const positions = [];
    const normals = [];
    const uvs = [];
    const indices = [];

    for (let i = 0; i <= lat; i++) {
      const v = i / lat;
      const phi = v * Math.PI;
      for (let j = 0; j <= lon; j++) {
        const u = j / lon;
        const theta = u * Math.PI * 2;
        const nx = Math.sin(phi) * Math.cos(theta);
        const ny = Math.cos(phi);
        const nz = Math.sin(phi) * Math.sin(theta);
        positions.push(radius * nx, radius * ny, radius * nz);
        normals.push(nx, ny, nz);
        uvs.push(u, 1.0 - v);
      }
    }

    const cols = lon + 1;
    for (let i = 0; i < lat; i++) {
      for (let j = 0; j < lon; j++) {
        const a = i * cols + j;
        const b = a + cols;
        indices.push(a, a + 1, b);
        indices.push(b, a + 1, b + 1);
      }
    }

    super({
      positions: new Float32Array(positions),
      normals: new Float32Array(normals),
      uvs: new Float32Array(uvs),
      indices: new Uint16Array(indices),
    });

    this.radius = radius;
    this.lat = lat;
    this.lon = lon;
  }
}
