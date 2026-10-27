import { Geometry } from '../core/Geometry.js';

export class BoxGeometry extends Geometry {
  constructor(width = 1, height = 1, depth = 1) {
    const hw = width / 2;
    const hh = height / 2;
    const hd = depth / 2;

    const faces = [
      { n: [0, 0, 1], verts: [[-hw, -hh, hd], [hw, -hh, hd], [hw, hh, hd], [-hw, hh, hd]] },
      { n: [0, 0, -1], verts: [[hw, -hh, -hd], [-hw, -hh, -hd], [-hw, hh, -hd], [hw, hh, -hd]] },
      { n: [0, 1, 0], verts: [[-hw, hh, hd], [hw, hh, hd], [hw, hh, -hd], [-hw, hh, -hd]] },
      { n: [0, -1, 0], verts: [[-hw, -hh, -hd], [hw, -hh, -hd], [hw, -hh, hd], [-hw, -hh, hd]] },
      { n: [1, 0, 0], verts: [[hw, -hh, hd], [hw, -hh, -hd], [hw, hh, -hd], [hw, hh, hd]] },
      { n: [-1, 0, 0], verts: [[-hw, -hh, -hd], [-hw, -hh, hd], [-hw, hh, hd], [-hw, hh, -hd]] },
    ];

    const positions = [];
    const normals = [];
    const uvs = [];
    const indices = [];
    const faceUV = [[0, 0], [1, 0], [1, 1], [0, 1]];

    faces.forEach((face, fi) => {
      const base = fi * 4;
      face.verts.forEach((v, i) => {
        positions.push(...v);
        normals.push(...face.n);
        uvs.push(...faceUV[i]);
      });
      indices.push(base, base + 1, base + 2, base, base + 2, base + 3);
    });

    super({
      positions: new Float32Array(positions),
      normals: new Float32Array(normals),
      uvs: new Float32Array(uvs),
      indices: new Uint16Array(indices),
    });

    this.width = width;
    this.height = height;
    this.depth = depth;
  }
}
