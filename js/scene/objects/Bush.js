import { Object3D } from '../Object3D.js';
import { Mesh } from '../Mesh.js';
import { SphereGeometry } from '../../geometry/SphereGeometry.js';
import { FoliageMaterial } from '../materials/FoliageMaterial.js';
import { GeometryFactory } from '../../geometry/GeometryFactory.js';
import { MathUtils } from '../../math/MathUtils.js';

export class Bush extends Object3D {
  constructor(textures, { position = [0, 0, 0], scale = 1, seed = 0 } = {}) {
    super();
    this.name = 'Bush';

    const leafMat = new FoliageMaterial(textures['palmera_hoja.png'], [0.18, 0.44, 0.16]);
    const geo = GeometryFactory.get('bush-blob', () => new SphereGeometry(0.48, 8, 10));

    // Clúster de 3 esferas de follaje agrupadas orgánicamente
    const count = 3;
    for (let i = 0; i < count; i++) {
      const clump = new Mesh(geo, leafMat);
      const angle = (i / count) * Math.PI * 2 + MathUtils.hash(seed + i * 2) * 0.5;
      const dist = 0.2 + MathUtils.hash(seed + i * 3) * 0.15;
      const s = 0.75 + MathUtils.hash(seed + i * 5) * 0.4;
      clump.position = [
        Math.cos(angle) * dist,
        0.32 + MathUtils.hash(seed + i * 7) * 0.15,
        Math.sin(angle) * dist,
      ];
      clump.scale = [s, s * 0.85, s];
      this.add(clump);
    }

    this.position = [...position];
    this.scale = [scale, scale, scale];
  }
}
