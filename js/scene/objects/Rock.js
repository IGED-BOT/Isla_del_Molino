import { Mesh } from '../Mesh.js';
import { SphereGeometry } from '../../geometry/SphereGeometry.js';
import { StandardMaterial } from '../materials/StandardMaterial.js';
import { MathUtils } from '../../math/MathUtils.js';

export class Rock extends Mesh {
  static deformGeometry(geo, seed) {
    const p = geo.positions;
    const n = geo.normals;
    for (let i = 0; i < p.length; i += 3) {
      const k = MathUtils.hash(seed + i * 0.13);
      const s = 0.72 + k * 0.55;
      p[i] *= s * (0.85 + MathUtils.hash(seed + i) * 0.4);
      p[i + 1] *= s * 0.65;
      p[i + 2] *= s * (0.8 + MathUtils.hash(seed + i + 3) * 0.35);
    }
    for (let i = 0; i < n.length; i += 3) {
      const x = p[i], y = p[i + 1], z = p[i + 2];
      const l = Math.hypot(x, y, z) || 1;
      n[i] = x / l;
      n[i + 1] = y / l;
      n[i + 2] = z / l;
    }
    return geo;
  }

  constructor(textures, { position = [0, 0, 0], scale = 1 } = {}) {
    const geo = Rock.deformGeometry(new SphereGeometry(0.7, 10, 12), position[0] * 10 + position[2]);
    super(geo, new StandardMaterial(textures['roca.jpg'], { shininess: 6, specular: 0.05 }));
    this.name = 'Rock';
    this.position = [...position];
    this.scale = [scale, scale, scale];
  }
}
