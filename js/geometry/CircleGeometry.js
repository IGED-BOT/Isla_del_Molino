import { Geometry } from '../core/Geometry.js';

export class CircleGeometry extends Geometry {
  constructor(radius = 1, segments = 32) {
    const positions = [0, 0, 0];
    const normals = [0, 1, 0];
    const uvs = [0.5, 0.5];
    const indices = [];

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const a = t * Math.PI * 2;
      const x = Math.cos(a) * radius;
      const z = Math.sin(a) * radius;
      positions.push(x, 0, z);
      normals.push(0, 1, 0);
      uvs.push(x / radius * 0.5 + 0.5, z / radius * 0.5 + 0.5);
    }

    for (let i = 1; i <= segments; i++) {
      indices.push(0, i + 1, i);
    }

    super({
      positions: new Float32Array(positions),
      normals: new Float32Array(normals),
      uvs: new Float32Array(uvs),
      indices: new Uint16Array(indices),
    });

    this.radius = radius;
    this.segments = segments;
  }
}
