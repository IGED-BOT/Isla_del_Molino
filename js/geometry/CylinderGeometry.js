import { Geometry } from '../core/Geometry.js';

export class CylinderGeometry extends Geometry {
  constructor(radiusTop = 1, radiusBottom = 1, height = 1, radial = 20, heightSeg = 1, capped = true) {
    const positions = [];
    const normals = [];
    const uvs = [];
    const indices = [];

    for (let y = 0; y <= heightSeg; y++) {
      const v = y / heightSeg;
      const yy = (v - 0.5) * height;
      const radius = radiusBottom + (radiusTop - radiusBottom) * v;
      for (let x = 0; x <= radial; x++) {
        const u = x / radial;
        const theta = u * Math.PI * 2;
        const nx = Math.cos(theta);
        const nz = Math.sin(theta);
        positions.push(radius * nx, yy, radius * nz);
        const ny = (radiusBottom - radiusTop) / height;
        const len = Math.hypot(nx, ny, nz) || 1;
        normals.push(nx / len, ny / len, nz / len);
        uvs.push(u, v);
      }
    }

    const cols = radial + 1;
    for (let y = 0; y < heightSeg; y++) {
      for (let x = 0; x < radial; x++) {
        const a = y * cols + x;
        const b = a + cols;
        indices.push(a, b, a + 1);
        indices.push(b, b + 1, a + 1);
      }
    }

    const pushCap = (y, radius, nY) => {
      const center = positions.length / 3;
      positions.push(0, y, 0);
      normals.push(0, nY, 0);
      uvs.push(0.5, 0.5);
      const start = positions.length / 3;
      for (let x = 0; x <= radial; x++) {
        const u = x / radial;
        const theta = u * Math.PI * 2;
        const cx = Math.cos(theta);
        const cz = Math.sin(theta);
        positions.push(radius * cx, y, radius * cz);
        normals.push(0, nY, 0);
        uvs.push(cx * 0.5 + 0.5, cz * 0.5 + 0.5);
      }
      for (let x = 0; x < radial; x++) {
        if (nY > 0) indices.push(center, start + x + 1, start + x);
        else indices.push(center, start + x, start + x + 1);
      }
    };

    if (capped) {
      pushCap(height / 2, radiusTop, 1);
      pushCap(-height / 2, radiusBottom, -1);
    }

    super({
      positions: new Float32Array(positions),
      normals: new Float32Array(normals),
      uvs: new Float32Array(uvs),
      indices: new Uint16Array(indices),
    });

    this.radiusTop = radiusTop;
    this.radiusBottom = radiusBottom;
    this.height = height;
    this.radial = radial;
    this.heightSeg = heightSeg;
    this.capped = capped;
  }
}
