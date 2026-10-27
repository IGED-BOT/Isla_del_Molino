import { Geometry } from '../core/Geometry.js';

export class HemisphereGeometry extends Geometry {
  constructor(radius = 1, lat = 16, lon = 32, capped = true) {
    const positions = [];
    const normals = [];
    const uvs = [];
    const indices = [];

    for (let i = 0; i <= lat; i++) {
      const v = i / lat;
      const phi = v * (Math.PI / 2);
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

    if (capped) {
      const center = positions.length / 3;
      positions.push(0, 0, 0);
      normals.push(0, -1, 0);
      uvs.push(0.5, 0.5);
      const start = positions.length / 3;
      for (let j = 0; j <= lon; j++) {
        const u = j / lon;
        const theta = u * Math.PI * 2;
        const cx = Math.cos(theta);
        const cz = Math.sin(theta);
        positions.push(radius * cx, 0, radius * cz);
        normals.push(0, -1, 0);
        uvs.push(cx * 0.5 + 0.5, cz * 0.5 + 0.5);
      }
      for (let j = 0; j < lon; j++) {
        indices.push(center, start + j, start + j + 1);
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
    this.capped = capped;
  }
}
